export const SITE_URL = 'https://headline-arena-gamma.vercel.app';
export const SITE_NAME = 'Headline Arena';
export const SITE_TITLE = 'Headline Arena: test and rank headlines side by side';
export const SITE_DESCRIPTION =
  'Free headline analyzer. Paste 2 to 8 headlines, blog titles or email subject lines and see each one scored for clarity, curiosity and clickbait, then ranked.';
export const SITE_KEYWORDS = ['headline analyzer', 'headline tester', 'blog title checker', 'email subject line tester', 'YouTube title tester', 'compare headlines', 'clickbait checker', 'headline score'];

export const REPO_URL = 'https://github.com/Sahilll15/headline-arena';
// Bump only when page content changes; feeds sitemap lastModified.
export const LAST_UPDATED = '2026-10-04';

const PERSON_ID = 'https://sahilchalke.com/#person';
const WEBSITE_ID = `${SITE_URL}/#website`;
export const APP_ID = `${SITE_URL}/#app`;

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: 'en',
      publisher: { '@id': PERSON_ID },
      author: { '@id': PERSON_ID },
    },
    {
      '@type': 'WebApplication',
      '@id': APP_ID,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      isPartOf: { '@id': WEBSITE_ID },
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      inLanguage: 'en',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      screenshot: `${SITE_URL}/opengraph-image.png`,
      featureList: ['Scores 2 to 8 headlines on five stats', 'Docks points for clickbait', 'Ranks headlines by power rating', 'Compares any two headlines head to head', 'Blog, email, tweet and YouTube divisions'],
      author: { '@id': PERSON_ID },
      creator: { '@id': PERSON_ID },
    },
    {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: 'Sahil Chalke',
      url: 'https://sahilchalke.com',
      sameAs: ['https://github.com/Sahilll15', 'https://x.com/chalke1015'],
    },
  ],
};

export function jsonLdScript(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export const TOOLS = [
  { name: 'ToneRadar', url: 'https://toneradar.vercel.app', blurb: 'check the tone of a message' },
  { name: 'Headline Arena', url: 'https://headline-arena-gamma.vercel.app', blurb: 'compare headlines side by side' },
  { name: 'FinePrint', url: 'https://fineprint-beta.vercel.app', blurb: 'find risky clauses in a contract' },
  { name: 'fallacy finder', url: 'https://fallacy-finder-nine.vercel.app', blurb: 'spot logical fallacies' },
  { name: 'PitchPanel', url: 'https://pitchpanel.vercel.app', blurb: 'startup pitch feedback' },
  { name: 'Interview Coach', url: 'https://interview-coach-seven-rose.vercel.app', blurb: 'mock interview practice' },
  { name: 'Minutes', url: 'https://minutes-sand.vercel.app', blurb: 'meeting minutes from audio' },
  { name: 'SplitSnap', url: 'https://splitsnap-sandy.vercel.app', blurb: 'split a bill from a receipt photo' },
  { name: 'AskCSV', url: 'https://askcsv-seven.vercel.app', blurb: 'ask questions about a CSV' },
  { name: 'ShipNotes', url: 'https://shipnotes-mu.vercel.app', blurb: 'release notes from commits' },
  { name: 'Ask India', url: 'https://askindia.online', blurb: 'answers from official government sites' },
].filter((t) => t.url !== SITE_URL);
