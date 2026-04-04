import { promises as dns } from 'dns';

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

  // 2. Performance-safe DNS check for MX records
  // We use a timeout to ensure this doesn't hang the server action.
  try {
    const mxCheck = await withTimeout(dns.resolveMx(domain), 1000);
    if (!mxCheck || mxCheck.length === 0) {
      return { isValid: false, type: 'invalid_domain' };
    }
  } catch (error) {
    const errorCode = (error as any).code;

    // Domain explicitly doesn't exist or has no mail servers configured
    if (errorCode === 'ENOTFOUND' || errorCode === 'ENODATA' || errorCode === 'EREFUSED') {
      return { isValid: false, type: 'invalid_domain' };
    }
    
    // For other errors (like timeouts), we log a warning and proceed 
    // to avoid preventing valid users from signing up due to transient DNS issues.
    console.warn(`DNS check for ${domain} skipped or failed:`, error);
  }

  return { isValid: true };
}

/**
 * Utility to wrap a promise with a timeout.
 */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timeoutId: NodeJS.Timeout;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('DNS Timeout'));
    }, ms);
  });

  return Promise.race([promise, timeout]).finally(() => {
    clearTimeout(timeoutId);
  }) as Promise<T>;
}
