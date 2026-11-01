export interface CloudflareVisitorMetrics {
  visits: number;
  pageViews: number;
  pagesPerVisit: number;
  deviceBreakdown?: {
    mobilePct: number;
    desktopPct: number;
  };
  languageBreakdown?: {
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

  // 2. Query Cloudflare GraphQL for 30-day analytics
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const dateGeq = thirtyDaysAgo.toISOString().split("T")[0];

  const graphqlQuery = {
    query: `
      query GetZoneAnalytics($zoneTag: String!, $dateGeq: String!) {
        viewer {
          zones(filter: { zoneTag: $zoneTag }) {
            httpRequests1dGroups(
              limit: 30
              filter: { date_geq: $dateGeq }
            ) {
              sum {
                pageViews
                requests
              }
              uniq {
                uniques
              }
            }
          }
        }
      }
    `,
    variables: {
      zoneTag: zoneId,
      dateGeq,
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
          httpRequests1dGroups?: Array<{
            sum?: { pageViews?: number; requests?: number };
            uniq?: { uniques?: number };
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

  const groups = gqlData?.data?.viewer?.zones?.[0]?.httpRequests1dGroups;

  if (!groups || groups.length === 0) {
    throw new Error(
      `Fatal: Cloudflare returned 0 days of analytics for zone ${zoneName} in the last 30 days.`,
    );
  }

  let totalVisits = 0;
  let totalPageViews = 0;

  for (const day of groups) {
    totalVisits += day?.uniq?.uniques || 0;
    totalPageViews += day?.sum?.pageViews || 0;
  }

  if (totalVisits === 0) {
    throw new Error(
      `Fatal: Cloudflare returned 0 unique visitors for zone ${zoneName} in the last 30 days.`,
    );
  }

  const pagesPerVisit =
    totalVisits > 0 ? Number((totalPageViews / totalVisits).toFixed(2)) : 1;

  return {
    visits: totalVisits,
    pageViews: totalPageViews,
    pagesPerVisit,
  };
}
