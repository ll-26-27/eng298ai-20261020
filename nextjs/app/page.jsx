import Link from "next/link";
import { SiteFooter, SiteHeader } from "./components/Chrome.jsx";
import { BotParts, Line, Mirror, Spiral } from "./components/Glyphs.jsx";
import "./home.css";

export const metadata = { title: "Where the assistant came from" };

const REPO = "https://github.com/ll-26-27/eng298ai-20261020";

const CARDS = [
  { href: "/eliza", Glyph: Mirror, year: "1966", title: "ELIZA", text: "Talk to the first chatbot. Turn on “Show the rule” and see which rule wrote each reply." },
  { href: "/gpt-2", Glyph: Spiral, year: "2019 · 2021", title: "GPT-2, two ways", text: "A small model that only continues your text. Then the same model with a script of invented conversations in front of your question, so it plays an assistant." },
  { href: "/build-a-bot", Glyph: BotParts, year: "2023 – now", title: "How to build a bot", text: "A custom GPT, a Gem, or a Claude Project is three things: instructions, knowledge, and tools. What each is, where to set it, and how to tell which one is speaking." },
  { href: "/timeline", Glyph: Line, year: "c. 370 BCE – 2026", title: "Who is speaking?", text: "A short history of the chatbot, from Plato’s complaint about writing to the agents of 2026, with ELIZA and GPT-2 running inside it." },
];

// The home page: the three things to try and the history to read.
export default function HomePage() {
  return (
    <>
      <SiteHeader current="home" />
      <main id="main" className="home">
        <p className="eyebrow">ENG 298AI · The AI Humanities Lab</p>
        <h1>Where the assistant came from</h1>

        <ol className="home-cards">
          {CARDS.map(({ href, Glyph, year, title, text }) => (
            <li key={href}>
              <Link href={href} className="home-card">
                <span className="home-glyph"><Glyph /></span>
                <span className="home-card-body">
                  <span className="home-card-year">{year}</span>
                  <strong>{title}</strong>
                  <p>{text}</p>
                  <span className="home-card-go" aria-hidden="true">Open →</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <p className="home-about">
          Built for ENG 298AI, the AI Humanities Lab at Harvard, Fall 2026. Nothing here needs an account or a key: ELIZA and GPT-2 run in your own browser. <a href={REPO}>Source on GitHub</a>.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
