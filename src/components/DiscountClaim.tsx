'use client';

import { useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { claimDiscount } from '@/actions/claimDiscount';
import { FormattedText } from '@/components/FormattedText';
import { ClaimDiscountContent } from '@/lib/emailTemplates';

interface DiscountClaimProps {
  content: ClaimDiscountContent & {
    title: string;
    subtitle: string;
    form: ClaimDiscountContent['form'] & {
      email: string;
      emailPlaceholder: string;
      consent: string;
      button: string;
      buttonLoading: string;
    };
  };
}

export default function DiscountClaim({ content }: DiscountClaimProps) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const result = await claimDiscount({
        email,
        consent,
        honeypot,
        content,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      setStatus({ type: 'success', message: result.message! });
      setEmail('');
      setConsent(false);
    } catch (err) {
      if (err instanceof Error) {
        setStatus({ type: 'error', message: err.message });
      } else {
        setStatus({ type: 'error', message: 'An unknown error occurred.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md bg-white p-6 md:p-10">
      <h2 className="mb-2 text-2xl md:text-3xl font-extrabold text-zinc-900 font-heading tracking-tight leading-tight">
        <FormattedText text={content.title} />
      </h2>
      <p className="mb-8 text-sm md:text-base text-zinc-500 font-normal leading-relaxed">
        {content.subtitle}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5 ml-1">
            {content.form.email}
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-zinc-900 focus:border-brand-red focus:ring-brand-red sm:text-sm transition-all outline-none"
            placeholder={content.form.emailPlaceholder}
            disabled={loading}
          />
        </div>

        <div className="absolute opacity-0 -z-10 h-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <input
            type="text"
            name="confirm_email_address"
            tabIndex={-1}
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-5 items-center mt-0.5">
            <input
              id="consent"
              name="consent"
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-brand-red focus:ring-brand-red transition-all cursor-pointer"
              disabled={loading}
            />
          </div>
          <div className="text-[11px] md:text-xs leading-relaxed">
            <label htmlFor="consent" className="text-zinc-400 font-light cursor-pointer select-none">
              <span className="inline-block">
                <FormattedText text={content.form.consent} />
              </span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-2xl bg-brand-red px-8 py-5 font-bold text-white shadow-lg transition hover:brightness-110 active:scale-[0.98] disabled:opacity-70 uppercase tracking-widest text-sm"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {content.form.buttonLoading}
            </>
          ) : (
            content.form.button
          )}
        </button>
      </form>

      {status && (
        <div
          className={`mt-6 flex items-start gap-3 rounded-lg p-4 ${
            status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-brand-red-light text-brand-red'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
          )}
          <p className="text-sm font-medium">{status.message}</p>
        </div>
      )}
    </div>
  );
}
