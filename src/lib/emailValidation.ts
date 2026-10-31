/**
 * A robust list of common email domain typos and their corrections.
 * This covers the most frequent providers in Poland and globally.
 */
const COMMON_TYPOS: Record<string, string> = {
  // Gmail
  'gmial.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmeil.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmila.com': 'gmail.com',
  'gmali.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmail.pl': 'gmail.com',
  // Outlook / Hotmail
  'outluk.com': 'outlook.com',
  'outlok.com': 'outlook.com',
  'outloook.com': 'outlook.com',
  'hotmial.com': 'hotmail.com',
  'hotmal.com': 'hotmail.com',
  'hotamail.com': 'hotmail.com',
  // Yahoo
  'yaho.com': 'yahoo.com',
  'yahho.com': 'yahoo.com',
  'yahoo.co': 'yahoo.com',
  'yaho.pl': 'yahoo.pl',
  'yahooo.pl': 'yahoo.pl',
  // Polish providers
  'wp.pll': 'wp.pl',
  'wwp.pl': 'wp.pl',
  'onet.pll': 'onet.pl',
  'o2.p': 'o2.pl',
  'interia.pll': 'interia.pl',
  'intriea.pl': 'interia.pl',
  // Others
  'icloud.cm': 'icloud.com',
  'iclod.com': 'icloud.com',
};

/**
 * Validates an email address for common typos and verifies if the domain can receive mail.
 * @param email The email address to validate.
 * @returns An object containing the validation results.
 */
export async function validateEmail(email: string): Promise<{
  isValid: boolean;
  type?: 'typo' | 'invalid_domain';
  suggestion?: string;
}> {
  const parts = email.toLowerCase().trim().split('@');
  if (parts.length !== 2) {
    return { isValid: false };
  }

  const domain = parts[1];

  // 1. Check for common typos
  if (COMMON_TYPOS[domain]) {
    return {
      isValid: false,
      type: 'typo',
      suggestion: `${parts[0]}@${COMMON_TYPOS[domain]}`,
    };
  }

  // 2. Edge-compatible DNS check for MX records via Cloudflare DoH (DNS over HTTPS)
  // Replaces Node.js 'dns' module which is unsupported in Cloudflare Workers
  try {
    const res = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=MX`,
      {
        headers: { accept: "application/dns-json" },
        signal: AbortSignal.timeout(1500),
      },
    );

    if (res.ok) {
      const data = (await res.json()) as {
        Status?: number;
        Answer?: { type: number; data: string }[];
      };
      // Status 3 is NXDOMAIN (domain does not exist)
      if (data.Status === 3) {
        return { isValid: false, type: "invalid_domain" };
      }
      // If Status 0 (NOERROR) but no MX Answer, check if it has zero answers
      if (data.Status === 0 && (!data.Answer || data.Answer.length === 0)) {
        return { isValid: false, type: "invalid_domain" };
      }
    }
  } catch (error) {
    // For timeouts or network errors, log a warning and proceed gracefully
    // to avoid blocking valid users during transient DNS issues
    console.warn(`DNS check for ${domain} skipped or failed:`, error);
  }

  return { isValid: true };
}
