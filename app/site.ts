export const SITE_URL = 'https://headline-arena-gamma.vercel.app';
export const SITE_NAME = 'Headline Arena';
export const SITE_TITLE = 'Headline Arena: test and rank headlines side by side';
export const SITE_DESCRIPTION =
  'Free headline analyzer. Paste 2 to 8 headlines, blog titles or email subject lines and see each one scored for clarity, curiosity and clickbait, then ranked.';
export const SITE_KEYWORDS = ['headline analyzer', 'headline tester', 'blog title checker', 'email subject line tester', 'YouTube title tester', 'compare headlines', 'clickbait checker', 'headline score'];

const AUTHOR = {
  '@type': 'Person',
  name: 'Sahil Chalke',
  url: 'https://sahilchalke.com',
  sameAs: ['https://github.com/Sahilll15', 'https://x.com/chalke1015'],
};

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  author: AUTHOR,
  creator: AUTHOR,
};

export function jsonLdScript(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
