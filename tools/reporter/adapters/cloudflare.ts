export interface CloudflareVisitorMetrics {
  visits: number;
  pageViews: number;
  pagesPerVisit: number;
  dailyAverage: number;
  peakDay: {
    date: string;
    formattedDate: string;
    visitors: number;
  };
  deviceBreakdown: {
    mobilePct: number;
    desktopPct: number;
  };
  languageBreakdown: {
    polishPct: number;
    englishPct: number;
  };
}

export async function fetchCloudflareVisitorMetrics(): Promise<CloudflareVisitorMetrics> {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const zoneName = "speedqueenkrk.pl";

  if (!token) {
    throw new Error(
      "Fatal: Missing CLOUDFLARE_API_TOKEN environment variable. Live Cloudflare analytics are strictly required.",
    );
  }

  // 1. Resolve Zone ID for speedqueenkrk.pl
  const zoneRes = await fetch(
    `https://api.cloudflare.com/client/v4/zones?name=${zoneName}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(8000),
    },
  );

  if (!zoneRes.ok) {
    throw new Error(
      `Fatal: Cloudflare zone lookup for ${zoneName} failed with HTTP ${zoneRes.status}: ${zoneRes.statusText}`,
    );
  }

  const zoneData = (await zoneRes.json()) as {
    success?: boolean;
    errors?: Array<{ code: number; message: string }>;
    result?: Array<{ id: string }>;
  };

  const zoneId = zoneData?.result?.[0]?.id;
  if (!zoneId) {
    throw new Error(
      `Fatal: Cloudflare Zone ID for ${zoneName} not found in account. Errors: ${JSON.stringify(zoneData?.errors || [])}`,
    );
  }

  // 2. Dates for 30-day daily breakdown and 28-day adaptive breakdown
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const dateGeq = thirtyDaysAgo.toISOString().split("T")[0];

  const twentyEightDaysAgo = new Date();
  twentyEightDaysAgo.setDate(twentyEightDaysAgo.getDate() - 28);
  const datetimeGeq = twentyEightDaysAgo.toISOString();

  const graphqlQuery = {
    query: `
      query GetFullZoneAnalytics($zoneTag: String!, $dateGeq: String!, $datetimeGeq: String!) {
        viewer {
          zones(filter: { zoneTag: $zoneTag }) {
            daily: httpRequests1dGroups(
              limit: 35
              filter: { date_geq: $dateGeq }
              orderBy: [date_ASC]
            ) {
              dimensions {
                date
              }
              sum {
                pageViews
                requests
              }
              uniq {
                uniques
              }
            }
            devices: httpRequestsAdaptiveGroups(
              limit: 5
              filter: { datetime_geq: $datetimeGeq }
              orderBy: [count_DESC]
            ) {
              count
              dimensions {
                clientDeviceType
              }
            }
            paths: httpRequestsAdaptiveGroups(
              limit: 25
              filter: { datetime_geq: $datetimeGeq }
              orderBy: [count_DESC]
            ) {
              count
              dimensions {
                clientRequestPath
              }
            }
          }
        }
      }
    `,
    variables: {
      zoneTag: zoneId,
      dateGeq,
      datetimeGeq,
    },
  };

  const gqlRes = await fetch("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(graphqlQuery),
    signal: AbortSignal.timeout(10000),
  });

  if (!gqlRes.ok) {
    throw new Error(
      `Fatal: Cloudflare GraphQL API request failed with HTTP ${gqlRes.status}: ${gqlRes.statusText}`,
    );
  }

  const gqlData = (await gqlRes.json()) as {
    errors?: Array<{ message: string }>;
    data?: {
      viewer?: {
        zones?: Array<{
          daily?: Array<{
            dimensions?: { date?: string };
            sum?: { pageViews?: number; requests?: number };
            uniq?: { uniques?: number };
          }>;
          devices?: Array<{
            count?: number;
            dimensions?: { clientDeviceType?: string };
          }>;
          paths?: Array<{
            count?: number;
            dimensions?: { clientRequestPath?: string };
          }>;
        }>;
      };
    };
  };

  if (gqlData.errors && gqlData.errors.length > 0) {
    throw new Error(
      `Fatal: Cloudflare GraphQL returned error: ${gqlData.errors.map((e) => e.message).join(", ")}`,
    );
  }

  const zoneMetrics = gqlData?.data?.viewer?.zones?.[0];
  const dailyGroups = zoneMetrics?.daily;

  if (!dailyGroups || dailyGroups.length === 0) {
    throw new Error(
      `Fatal: Cloudflare returned 0 days of analytics for zone ${zoneName} in the last 30 days.`,
    );
  }

  let totalVisits = 0;
  let totalPageViews = 0;
  let peakDate = "";
  let peakVisitors = 0;

  for (const day of dailyGroups) {
    const uniques = day?.uniq?.uniques || 0;
    const pvs = day?.sum?.pageViews || 0;
    totalVisits += uniques;
    totalPageViews += pvs;

    if (uniques > peakVisitors) {
      peakVisitors = uniques;
      peakDate = day?.dimensions?.date || "";
    }
  }

  if (totalVisits === 0) {
    throw new Error(
      `Fatal: Cloudflare returned 0 unique visitors for zone ${zoneName} in the last 30 days.`,
    );
  }

  const dailyAverage = Math.round(totalVisits / dailyGroups.length);
  const pagesPerVisit = Number((totalPageViews / totalVisits).toFixed(2));

  // Format peak day in Polish
  let formattedPeakDate = peakDate;
  if (peakDate) {
    try {
      const parsed = new Date(peakDate + "T12:00:00Z");
      const weekday = parsed.toLocaleDateString("pl-PL", { weekday: "long" });
      const dayAndMonth = parsed.toLocaleDateString("pl-PL", { day: "numeric", month: "long" });
      const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
      formattedPeakDate = `${capitalizedWeekday}, ${dayAndMonth}`;
    } catch {
      formattedPeakDate = peakDate;
    }
  }

  // Calculate real device breakdown
  let mobileCount = 0;
  let desktopCount = 0;
  for (const item of zoneMetrics?.devices || []) {
    const dev = item?.dimensions?.clientDeviceType || "";
    const cnt = item?.count || 0;
    if (dev === "mobile" || dev === "tablet") {
      mobileCount += cnt;
    } else {
      desktopCount += cnt;
    }
  }
  const totalDev = mobileCount + desktopCount;
  const mobilePct = totalDev > 0 ? Math.round((mobileCount / totalDev) * 100) : 60;
  const desktopPct = 100 - mobilePct;

  // Calculate real language traffic breakdown from paths
  let plCount = 0;
  let enCount = 0;
  for (const item of zoneMetrics?.paths || []) {
    const p = item?.dimensions?.clientRequestPath || "";
    const cnt = item?.count || 0;
    if (p.startsWith("/en")) {
      enCount += cnt;
    } else if (p === "/" || p.startsWith("/pl")) {
      plCount += cnt;
    }
  }
  const totalLang = plCount + enCount;
  const polishPct = totalLang > 0 ? Math.round((plCount / totalLang) * 100) : 80;
  const englishPct = 100 - polishPct;

  return {
    visits: totalVisits,
    pageViews: totalPageViews,
    pagesPerVisit,
    dailyAverage,
    peakDay: {
      date: peakDate,
      formattedDate: formattedPeakDate,
      visitors: peakVisitors,
    },
    deviceBreakdown: {
      mobilePct,
      desktopPct,
    },
    languageBreakdown: {
      polishPct,
      englishPct,
    },
  };
}
