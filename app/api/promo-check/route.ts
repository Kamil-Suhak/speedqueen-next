import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }
  return neon(process.env.DATABASE_URL);
}

export async function POST() {
  try {
    const sql = getSql();
    const result = await sql`
      UPDATE visit_counter
      SET count = CASE
        WHEN count + 1 >= threshold THEN 0
        ELSE count + 1
      END
      RETURNING (count = 0) AS show_modal
    `;

    if (!result || result.length === 0) {
      // Fallback if table doesn't exist or has no rows
      return NextResponse.json({ showModal: false });
    }

    return NextResponse.json({ showModal: result[0].show_modal });
  } catch (error) {
    console.error('Error in promo-check API:', error);
    return NextResponse.json({ showModal: false }, { status: 500 });
  }
}
