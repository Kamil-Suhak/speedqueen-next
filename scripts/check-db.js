import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { neon } from '@netlify/neon';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env first, then .env.local (which overrides)
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true });

const sql = neon(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL);

async function check() {
  console.log('Checking database...');
  
  const countResult = await sql`SELECT COUNT(*) FROM discounts`;
  console.log(`Total rows in discounts table: ${countResult[0].count}`);

  console.log('\nFirst 5 rows:');
  const firstRows = await sql`SELECT id, blob_url FROM discounts ORDER BY id ASC LIMIT 5`;
  console.table(firstRows);

  console.log('\nLast 5 rows:');
  const lastRows = await sql`SELECT id, blob_url FROM discounts ORDER BY id DESC LIMIT 5`;
  console.table(lastRows);
}

check().catch(console.error);
