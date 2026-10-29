import Link from "next/link";
import { site } from "../../lib/content.mjs";

// `current` marks the page you're on: "home", "eliza", "gpt-2", "build-a-bot", "story", "history", "glossary", or nothing.
export function SiteHeader({ current = "" }) {
  const item = (href, key, label) => <Link href={href} aria-current={current === key ? "page" : undefined}>{label}</Link>;
  return (
    <header className="site-header">
      <Link className="wordmark" href="/">
        {site.title} <span>{site.label}</span>
      </Link>
      <nav aria-label="Main navigation">
        {item("/eliza", "eliza", "ELIZA")}
        {item("/gpt-2", "gpt-2", "GPT-2")}
        {item("/build-a-bot", "build-a-bot", "Build a bot")}
        {item("/timeline", "story", "Timeline")}
        {item("/history", "history", "Interfaces")}
        {item("/glossary", "glossary", "Glossary")}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link href="/">{site.title}</Link>
      <span>{site.term}</span>
    </footer>
  );
}
