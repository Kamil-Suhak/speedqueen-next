"use server";

import crypto from 'crypto';
import { neon } from '@netlify/neon';
import { Resend } from 'resend';
import { ClaimDiscountContent, getClaimDiscountEmailTemplate } from '@/lib/emailTemplates';

const sql = neon();

const resend = new Resend(process.env.RESEND_API_KEY);

interface ClaimDiscountState {
  email: string;
  consent: boolean;
  honeypot: string;
  content: ClaimDiscountContent;
}

export async function claimDiscount(state: ClaimDiscountState) {
  const { email, consent, honeypot, content } = state;

  try {
    if (honeypot) return { success: true, message: content.form.successMessage };

    if (!email || !email.includes('@')) return { success: false, error: content.form.errorInvalidEmail };
    if (!consent) return { success: false, error: content.form.errorNoConsent };

    const adminEmail = process.env.ADMIN_EMAIL;
    const isEarlyAccess = adminEmail && email.toLowerCase().trim() === adminEmail.toLowerCase().trim();
    const promoStartEnv = process.env.PROMO_START_DATE || '2026-03-30T00:00:00+01:00';
    const promoStartDate = new Date(promoStartEnv);
    if (new Date() < promoStartDate && !isEarlyAccess) {
      return { success: false, error: content.form.errorPromoNotStarted };
    }

    const salt = process.env.HASH_SALT || 'default-fallback-salt-change-me';
    const hashedEmail = crypto.createHash('sha256').update(email.toLowerCase().trim() + salt).digest('hex');

    const existing = await sql`SELECT id FROM discounts WHERE hashed_email = ${hashedEmail} LIMIT 1`;
    if (existing.length > 0) return { success: false, error: content.form.errorAlreadyClaimed };

    // ATOMIC CLAIM: Find and update in one step to prevent race conditions
    const claimResult = await sql`
      UPDATE discounts 
      SET hashed_email = ${hashedEmail}, 
          claimed_at = NOW() 
      WHERE id = (
        SELECT id FROM discounts 
        WHERE hashed_email IS NULL 
        ORDER BY id ASC
        LIMIT 1 
        FOR UPDATE SKIP LOCKED
      )
      RETURNING id, blob_url;
    `;

    if (claimResult.length === 0) return { success: false, error: content.form.errorNoCodes };

    const { id: discountId, blob_url: blobKey } = claimResult[0];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://speedqueenkrk.pl';
    const logoUrl = `${baseUrl}/images/logo.png`;
    const blobUrl = `${baseUrl}/api/qr/${blobKey}`;

    try {
      const { data, error: resendError } = await resend.emails.send({
        from: 'Speed Queen Kraków <noreply@mail.speedqueenkrk.pl>',
        to: [email],
        subject: content.email.subject,
        html: getClaimDiscountEmailTemplate(content.email, baseUrl, logoUrl, blobUrl),
      });

      if (resendError) throw new Error('Resend failed');

      console.log('Success:', data?.id);
    } catch (err) {
      // FALLBACK: Email failed, so release the QR code back to the pool
      await sql`UPDATE discounts SET hashed_email = NULL, claimed_at = NULL WHERE id = ${discountId}`;
      return { success: false, error: content.form.errorEmailFailed };
    }

    return { success: true, message: content.form.successMessage };
  } catch (error) {
    console.error('Server Error:', error);
    return { success: false, error: content.form.errorServer };
  }
}
