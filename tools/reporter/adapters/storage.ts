import fs from "node:fs";
import path from "node:path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export interface SaveReportOptions {
  html: string;
  slug: string; // e.g. "2026-10"
  period: string; // e.g. "Październik 2026"
}

export interface SaveReportResult {
  localPath: string;
  previewPath: string;
  r2Uploaded: boolean;
  r2Location?: string;
}

export async function saveReport(
  options: SaveReportOptions,
): Promise<SaveReportResult> {
  const { html, slug } = options;

  // 1. Local project folder save
  const reportsDir = path.resolve(process.cwd(), "reports");
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const localPath = path.join(reportsDir, `raport-${slug}.html`);
  fs.writeFileSync(localPath, html, "utf-8");

  // Keep report-preview.html in project root as an instant shortcut to the latest report
  const previewPath = path.resolve(process.cwd(), "report-preview.html");
  fs.writeFileSync(previewPath, html, "utf-8");

  // 2. Cloudflare R2 storage archive (S3-compatible)
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId =
    process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ||
    process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey =
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ||
    process.env.R2_SECRET_ACCESS_KEY;
  const bucket =
    process.env.R2_REPORTS_BUCKET ||
    process.env.R2_BUCKET_NAME ||
    "speedqueen-reports";

  let r2Uploaded = false;
  let r2Location: string | undefined;

  if (accountId && accessKeyId && secretAccessKey) {
    try {
      const s3 = new S3Client({
        region: "auto",
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });

      const key = `reports/raport-${slug}.html`;
      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: html,
          ContentType: "text/html; charset=utf-8",
        }),
      );

      r2Uploaded = true;
      r2Location = `r2://${bucket}/${key}`;
    } catch (err) {
      console.warn(
        `[Storage] Warning: Could not upload report to R2 bucket "${bucket}":`,
        err instanceof Error ? err.message : err,
      );
    }
  }

  return {
    localPath,
    previewPath,
    r2Uploaded,
    r2Location,
  };
}
