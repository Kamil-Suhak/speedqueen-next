import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { neon } from '@neondatabase/serverless';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env first, then .env.local (which overrides)
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true });

const sql = neon(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL);

const s3 = new S3Client({
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
  region: 'auto',
});

async function seed() {
  console.log('Seeding discounts table with placeholders...');

  // Create table
  await sql`
    CREATE TABLE IF NOT EXISTS discounts (
      id SERIAL PRIMARY KEY,
      blob_url TEXT NOT NULL,
      hashed_email VARCHAR(64) UNIQUE,
      claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
    )
  `;

  console.log('Clearing old discount records...');
  await sql`TRUNCATE TABLE discounts RESTART IDENTITY`;

  // Upload 80 QR codes to Cloudflare R2 and insert keys into DB
  const qrCodesDir = path.resolve(__dirname, '../discount_qr_codes');
  const allFiles = fs.readdirSync(qrCodesDir);
  const bmpFiles = allFiles.filter(f => f.toLowerCase().endsWith('.bmp'));
  const selectedFiles = bmpFiles.slice(0, 80);

  console.log(`Uploading ${selectedFiles.length} QR codes to Cloudflare R2...`);

  for (let i = 0; i < selectedFiles.length; i++) {
    const filename = selectedFiles[i];
    const filePath = path.join(qrCodesDir, filename);
    const fileBuffer = fs.readFileSync(filePath);

    try {
      // 1. Upload to R2
      await s3.send(new PutObjectCommand({
        Bucket: 'discount-qr-codes',
        Key: filename,
        Body: fileBuffer,
        ContentType: 'image/bmp',
      }));

      // 2. Insert DB record
      await sql`
        INSERT INTO discounts (blob_url)
        VALUES (${filename})
      `;
      console.log(`Inserted & Uploaded code ${i + 1}/${selectedFiles.length}: ${filename}`);
    } catch (err) {
      console.log(`Skipped ${filename} (may already exist or error):`, err.message);
    }
  }

  console.log('Seeding completed successfully.');
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
