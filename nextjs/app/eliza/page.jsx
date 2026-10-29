import Link from "next/link";
import { getExperiment } from "../../lib/content.mjs";
import { SiteFooter, SiteHeader } from "../components/Chrome.jsx";
import Markdown from "../components/Markdown.jsx";
import ElizaChat from "./ElizaChat.jsx";
import "../components/activity.css";
import "./eliza.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "ELIZA", description: "Weizenbaum's 1966 DOCTOR script, running in the browser, with its rules visible." };

// ELIZA (lib/eliza/), with the rule behind each reply beside it. The notes on how faithful the engine is are
// content/experiments/eliza.md, shown under the chat.
export default async function Page() {
  const notes = await getExperiment("eliza");
  return (
    <>
      <SiteHeader current="eliza" />
      <main id="main" className="activity">
        <Link className="today-link" href="/">← Home</Link>
        <p className="eyebrow">1966</p>
        <h1>ELIZA</h1>
        <p className="activity-deck">The first chatbot, rebuilt from Joseph Weizenbaum&rsquo;s 1966 paper and the original program listing, running in your browser. It knows nothing. It finds a keyword in your sentence, cuts the sentence up by a pattern, and reassembles your own words into a reply. Beside each reply is the rule that made it.</p>
        <p className="activity-note">Press <strong>Play the 1966 exchange</strong> to see the paper&rsquo;s own conversation, line by line, then type your own. Things to try: &ldquo;I remember my mother&rdquo;, &ldquo;computers frighten me&rdquo;, &ldquo;You are like my father&rdquo;, &ldquo;Can we talk?&rdquo; (no rule fits, so ELIZA falls back on one of four built-in replies).</p>
        <section className="activity-stage">
          <ElizaChat />
        </section>
        {notes && (
          <details className="experiment-notes">
            <summary>How this ELIZA was built, and how faithful it is</summary>
            <article className="prose"><Markdown doc={notes} /></article>
          </details>
        )}
        <p className="activity-next">Next: <Link href="/gpt-2">GPT-2, two ways →</Link> · ELIZA in the <Link href="/timeline#eliza">timeline</Link>.</p>
      </main>
      <SiteFooter />
    </>
  );
}
