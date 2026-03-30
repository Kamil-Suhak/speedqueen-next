import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { neon } from '@netlify/neon';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env first, then .env.local (which overrides)
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true });

const sql = neon(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL);

async function seed() {
  console.log('Seeding visit_counter table...');

  // Create table
  await sql`
    CREATE TABLE IF NOT EXISTS visit_counter (
      id INTEGER PRIMARY KEY DEFAULT 1,
      count INTEGER NOT NULL DEFAULT 0,
      threshold INTEGER NOT NULL DEFAULT 5,
      CONSTRAINT single_row CHECK (id = 1)
    )
  `;

  console.log("Inserting initial row if it doesn't exist...");
  await sql`
    INSERT INTO visit_counter (id, count, threshold) 
    VALUES (1, 0, 5)
    ON CONFLICT (id) DO NOTHING
  `;

  console.log('\nCurrent data in visit_counter:');
  const rows = await sql`SELECT * FROM visit_counter`;
  console.table(rows);

  console.log('Seeding completed successfully.');
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
