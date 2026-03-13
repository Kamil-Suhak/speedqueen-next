import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env first, then .env.local (which overrides)
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true });

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is missing in .env or .env.local');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

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

  // Insert 50 placeholder rows
  for (let i = 1; i <= 50; i++) {
    const placeholderUrl = `https://placehold.co/400x400?text=QR+Code+${i}`;
    try {
      await sql`
        INSERT INTO discounts (blob_url)
        VALUES (${placeholderUrl})
      `;
      console.log(`Inserted placeholder ${i}`);
    } catch (err) {
      console.log(`Skipped ${i} (maybe already exists)`);
    }
  }

  console.log('Seeding completed successfully.');
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
