import type { Locale } from '@/config/site-config';

export const getDictionary = async (lang: Locale, namespace: string) => {
    return (await import(`../config/${lang}/${namespace}`)).default;
};
