import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config(); // fallback to process.env

import React from "react";
import { render } from "react-email";
import { Resend } from "resend";
import { MonthlyReportEmail } from "./template";
import { fetchGooglePlacesReputation } from "./adapters/googlePlaces";
import { fetchCloudflareVisitorMetrics } from "./adapters/cloudflare";
import { saveReport } from "./adapters/storage";

function getReportPeriod(): { period: string; slug: string } {
  const date = new Date();
  // If run early in the month (1st-5th), report is for the previous month
  if (date.getDate() <= 5) {
    date.setMonth(date.getMonth() - 1);
  }
  const monthName = date.toLocaleDateString("pl-PL", { month: "long" });
  const year = date.getFullYear();
  const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  const period = `${capitalizedMonth} ${year}`;
  const slug = `${year}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  return { period, slug };
}

async function main() {
  const isSend = process.argv.includes("--send");
  const { period, slug } = getReportPeriod();
  const recipientEmail =
    process.env.RESEND_TO_EMAIL || "kontakt@speedqueenkrk.pl";

  console.log("==========================================");
  console.log(`Speed Queen Monthly Visibility Reporter (${period})`);
  console.log("==========================================");

  // 1. Fetch metrics from adapters (strictly real data, throws fatal error on missing keys or failures)
  console.log("Fetching live data from Google Places API and Cloudflare Analytics...");
  const [reputation, traffic] = await Promise.all([
    fetchGooglePlacesReputation(),
    fetchCloudflareVisitorMetrics(),
  ]);

  console.log(`[Google Places] Scoped to last month: ${reputation.recentReviewsCount} new reviews. Featured review: ${reputation.featuredReview ? reputation.featuredReview.author : "None"}`);
  console.log(`[Cloudflare] ${traffic.visits} visits, ${traffic.pageViews} page views, daily avg: ${traffic.dailyAverage}, peak: ${traffic.peakDay.formattedDate} (${traffic.peakDay.visitors})`);
  console.log(`[Config] Target recipient: ${recipientEmail}`);

  // 2. Render React Email template to HTML
  console.log("Rendering HTML email template in Polish...");
  const emailElement = React.createElement(MonthlyReportEmail, {
    period,
    traffic,
    reputation,
    recipientEmail,
  });

  const html = await render(emailElement);

  // 3. Save report locally and to R2 storage
  console.log("Saving report snapshot...");
  const storageResult = await saveReport({ html, slug, period });
  console.log(`[Storage] Saved locally: ${storageResult.localPath}`);
  console.log(`[Storage] Updated preview: ${storageResult.previewPath}`);
  if (storageResult.r2Uploaded) {
    console.log(`[Storage] Archived to Cloudflare R2: ${storageResult.r2Location}`);
  }

  // 4. Dispatch or Dry Run
  if (isSend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Fatal: Missing RESEND_API_KEY environment variable. Cannot dispatch report email.",
      );
    }

    console.log(`Dispatching monthly report to ${recipientEmail} via Resend...`);
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: "Raporty Speed Queen <noreply@mail.speedqueenkrk.pl>",
      to: [recipientEmail],
      subject: `📊 Raport Widoczności Speed Queen Kraków (${period})`,
      html,
    });

    if (error) {
      throw new Error(
        `Fatal: Resend delivery failed: ${JSON.stringify(error)}`,
      );
    }

    console.log(`Report successfully dispatched! Resend message ID: ${data?.id}`);
  } else {
    console.log(`Dry-run mode completed successfully.`);
    console.log(`Open preview directly: ${storageResult.previewPath}`);
    console.log("To send the live report, rerun with the --send flag.");
  }
}

main().catch((err) => {
  console.error("FATAL ERROR:", err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
