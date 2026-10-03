import { REPO_URL, TOOLS } from '../site';

const link = 'font-semibold text-teal underline-offset-4 hover:underline';

export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-6xl border-t border-line px-4 pt-10 pb-12 text-sm leading-relaxed text-ink-soft sm:px-6">
      <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
        <div className="space-y-3">
          <p>
            Every number comes from Jev answering typed questions about each headline. Every sentence is a template filled with those
            numbers.
          </p>
          <p>
            Your headlines and audience are sent to the Jev model from TypeSafe to be scored. This app does not save them. It only
            keeps a short-lived request count per IP address to rate limit the free bouts.
          </p>
          <p className="flex flex-wrap gap-x-5 gap-y-1">
            <span>
              Built by{' '}
              <a href="https://sahilchalke.com" className={link}>
                Sahil Chalke
              </a>
            </span>
            <a href={REPO_URL} className={link}>
              Source code on GitHub
            </a>
          </p>
        </div>
        <nav aria-labelledby="more-tools">
          <h2 id="more-tools" className="font-display text-xs font-bold uppercase tracking-[0.2em] text-ink-dim">
            More tools
          </h2>
          <ul className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
            {TOOLS.map((t) => (
              <li key={t.url}>
                <a href={t.url} className={link}>
                  {t.name}
                </a>
                <span className="text-ink-dim">, {t.blurb}</span>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
