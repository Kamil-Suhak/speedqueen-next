"use server";

import crypto from 'crypto';
import { neon } from '@netlify/neon';
import { Resend } from 'resend';

const sql = neon();

const resend = new Resend(process.env.RESEND_API_KEY);

interface ClaimDiscountState {
  email: string;
  consent: boolean;
  honeypot: string;
  content: any;
}

export async function claimDiscount(state: ClaimDiscountState) {
  const { email, consent, honeypot, content } = state;

  try {
    // 1. Bot Protection
    if (honeypot) return { success: true, message: content.form.successMessage };

    // 2. Validation
    if (!email || !email.includes('@')) return { success: false, error: content.form.errorInvalidEmail };
    if (!consent) return { success: false, error: content.form.errorNoConsent };

    // 3. Salted Hash (GDPR)
    const salt = process.env.HASH_SALT || 'default-fallback-salt-change-me';
    const hashedEmail = crypto.createHash('sha256').update(email.toLowerCase().trim() + salt).digest('hex');

    // 4. Pre-check for duplicate (for specific error message)
    const existing = await sql`SELECT id FROM discounts WHERE hashed_email = ${hashedEmail} LIMIT 1`;
    if (existing.length > 0) return { success: false, error: content.form.errorAlreadyClaimed };

    // 5. ATOMIC CLAIM: Find and update in ONE step to prevent race conditions
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

    // 6. Attempt Email
    try {
      const { data, error: resendError } = await resend.emails.send({
        from: 'Speed Queen Kraków <noreply@mail.speedqueenkrk.pl>',
        to: [email],
        subject: content.email.subject,
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #eeeeee; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #e7272d; padding: 20px; text-align: center;">
              <a href="${baseUrl}" target="_blank" style="text-decoration: none;">
                <img src="${logoUrl}" alt="Speed Queen Kraków" style="width: 80px; height: 80px; display: block; margin: 0 auto; border-radius: 8px;" />
              </a>
            </div>
            <div style="padding: 40px 30px; text-align: center;">
              <h1 style="color: #1d1d1b; font-size: 24px; margin-bottom: 20px; font-weight: bold;">${content.email.greeting}</h1>
              <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">${content.email.body}</p>
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px; display: inline-block;">
                <img src="${blobUrl}" alt="QR Code" style="max-width: 200px; height: auto; display: block; margin: 0 auto;" />
              </div>
              <p style="color: #e7272d; font-weight: bold; font-size: 16px; margin-bottom: 0;">${content.email.instruction}</p>
            </div>
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
              <p style="color: #666666; font-size: 14px; margin: 0;">${content.email.footer}</p>
              <p style="color: #999999; font-size: 12px; margin-top: 10px;">Speed Queen Kraków<br />Pawia 34 | Słowackiego 56 | Orlińskiego 1</p>
            </div>
          </div>
        `,
      });

      if (resendError) throw new Error('Resend failed');

      console.log('Success:', data?.id);
    } catch (err) {
      // 7. FALLBACK: Email failed, so release the QR code back to the pool
      await sql`UPDATE discounts SET hashed_email = NULL, claimed_at = NULL WHERE id = ${discountId}`;
      return { success: false, error: content.form.errorEmailFailed };
    }

    return { success: true, message: content.form.successMessage };
  } catch (error) {
    console.error('Server Error:', error);
    return { success: false, error: content.form.errorServer };
  }
}
