import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/Chrome.jsx";
import { Instructions, Knowledge, Tools } from "../components/Glyphs.jsx";
import "../components/activity.css";
import "./guide.css";

export const metadata = {
  title: "How to build a bot",
  description: "A custom GPT, a Gem, or a Claude Project is three things: instructions, knowledge, and tools. What each is, where to set it, and how to test it.",
};

// The guide. The screenshots are crops of the Interfaces gallery (content/history/_images/, captured 19 Oct 2026),
// cut to the editor panels and saved in public/guide/ (the full captures, with sources, are at /history).
/* eslint-disable @next/next/no-img-element */

function Shot({ src, width, height, alt, children }) {
  return (
    <figure>
      <img src={`/guide/${src}.webp`} width={width} height={height} alt={alt} loading="lazy" />
      <figcaption>{children}</figcaption>
    </figure>
  );
}

export default function Page() {
  return (
    <>
      <SiteHeader current="build-a-bot" />
      <main id="main" className="activity guide">
        <Link className="today-link" href="/">← Home</Link>
        <p className="eyebrow">2023 – 2026 · GPTs, Gems, Projects</p>
        <h1>How to build a bot</h1>
        <p className="activity-deck">A custom bot is three things handed to the model before it reads your message: <strong>instructions</strong>, <strong>knowledge</strong>, and <strong>tools</strong>. None of them changes the model. All of them change what it reads. Here is what each part is, where to set it in ChatGPT, Gemini, and Claude, and how to tell which part is speaking.</p>

        <div className="guide-parts" role="list" aria-label="The three parts of a bot">
          <figure role="listitem"><Instructions /><figcaption>Instructions</figcaption></figure>
          <figure role="listitem"><Knowledge /><figcaption>Knowledge</figcaption></figure>
          <figure role="listitem"><Tools /><figcaption>Tools</figcaption></figure>
        </div>

        <table className="guide-table">
          <caption className="sr-only">What each product calls the three parts</caption>
          <thead>
            <tr><th scope="col"><span className="sr-only">Part</span></th><th scope="col">ChatGPT (GPT or Project)</th><th scope="col">Gemini (Gem)</th><th scope="col">Claude (Project)</th></tr>
          </thead>
          <tbody>
            <tr><th scope="row">Instructions</th><td>Instructions</td><td>Instructions</td><td>Project instructions</td></tr>
            <tr><th scope="row">Knowledge</th><td>Knowledge: upload files</td><td>Knowledge: add files</td><td>Context: upload, text, GitHub, Drive</td></tr>
            <tr><th scope="row">Tools</th><td>Capabilities and Actions</td><td>Default tool</td><td>Connectors</td></tr>
          </tbody>
        </table>
        <p className="guide-dates">
          GPTs were announced on <a href="https://openai.com/index/introducing-gpts/">6 Nov 2023</a>, Claude Projects on <a href="https://www.anthropic.com/news/projects">25 Jun 2024</a>, Gems rolled out on <a href="https://workspaceupdates.googleblog.com/2024/08/customize-gemini-with-gems.html">28 Aug 2024</a>, and ChatGPT Projects on <a href="https://help.openai.com/en/articles/6825453-chatgpt-release-notes">13 Dec 2024</a>. The names differ; the three parts do not.
        </p>

        <section className="activity-step" id="instructions">
          <div className="activity-copy">
            <p className="eyebrow">Part 1</p>
            <h2>Instructions: the script the model reads first</h2>
            <p>Instructions are text placed in front of every conversation. The model does not remember them between chats. It reads them again each time, the way <Link href="/gpt-2">GPT-2 read the HHH prompt</Link> in 2021. Products also call this the system prompt.</p>
            <p>Four lines cover most bots:</p>
            <ul>
              <li><strong>Who it is.</strong> A role. <q>You are a teaching fellow for GENED 1000.</q></li>
              <li><strong>What it does, and from what.</strong> <q>Answer only from the uploaded syllabus and assignment sheets.</q></li>
              <li><strong>What it refuses or hands off.</strong> <q>If a question is not covered, tell the student to email the course staff. Never give away answers to graded problems.</q></li>
              <li><strong>How it answers.</strong> Length, tone, form. <q>Guide students toward the answer instead.</q></li>
            </ul>
            <p>Write them as rules, in plain sentences. The model follows the shape of the document it is given, so one example answer in the instructions teaches more than a row of adjectives.</p>
            <p className="guide-try"><strong>Test it.</strong> Ask the bot who it is, then ask it to ignore its instructions. The first shows whether the role took. The second shows how firmly.</p>
          </div>
          <div className="guide-shots">
            <Shot src="gpt-configure" width={1440} height={1445} alt="The GPT builder's Configure tab: a draft named Course TF Assistant with a name, a description, and an instructions box">ChatGPT&rsquo;s GPT builder, Configure tab: a name, a description, and the instructions. Captured 19 Oct 2026; the draft was never published.</Shot>
            <Shot src="gem-editor" width={1600} height={1036} alt="Google's Gem editor with the same draft: name, description, instructions, and a preview panel">Gemini&rsquo;s Gem editor: the same boxes, with a preview beside them. <q>Gem not saved.</q></Shot>
            <Shot src="claude-instructions" width={1440} height={1023} alt="Claude's Set project instructions dialog with the same instruction text">Claude&rsquo;s <q>Set project instructions</q> dialog, with the same text.</Shot>
          </div>
        </section>

        <section className="activity-step" id="knowledge">
          <div className="activity-copy">
            <p className="eyebrow">Part 2</p>
            <h2>Knowledge: texts put in front of the model</h2>
            <p>Uploading a file does not teach the model anything. The text is placed in front of it, like the instructions, either whole or in pieces. A short file goes in whole with every message. A long one is searched, and only the passages that match your question go in. That search is called retrieval, and you can <Link href="/timeline#configuration-2">watch it pick passages from <em>Frankenstein</em></Link> in the timeline.</p>
            <ul>
              <li><strong>Small, clean texts.</strong> A syllabus, a reading, a list of rules. Not an archive.</li>
              <li><strong>Plain file names and headings.</strong> Retrieval shows the model a title with each passage.</li>
              <li><strong>Ask it to quote.</strong> If the bot cannot quote the file, the passage was not in front of it.</li>
            </ul>
            <p className="guide-try"><strong>Test it.</strong> Ask something only the file answers. Then ask something near it that the file does not cover, and watch whether the bot admits the gap or fills it.</p>
          </div>
          <div className="guide-shots">
            <Shot src="gpt-knowledge" width={1440} height={569} alt="The GPT builder's Knowledge section with an Upload files button and a warning that conversations can reveal the files">ChatGPT: Knowledge, with its warning that conversations can reveal the uploaded files.</Shot>
            <Shot src="gem-tools-knowledge" width={1051} height={490} alt="The Gem editor's Default tool and Knowledge settings below the instructions">Gemini: a Default tool and Knowledge, below the instructions.</Shot>
            <Shot src="claude-context" width={691} height={576} alt="Claude's project Context menu: upload from device, add text content, GitHub, Canva, Drive">Claude: Context can be uploaded, typed, or connected from GitHub, Canva, or Drive.</Shot>
          </div>
        </section>

        <section className="activity-step" id="tools">
          <div className="activity-copy">
            <p className="eyebrow">Part 3</p>
            <h2>Tools: what the model may reach for</h2>
            <p>A tool is something outside the conversation that the model is allowed to use: web search, a code interpreter, image generation, a connected app. The model writes a request. The program around it runs the request and pastes the result back into the conversation. The model reads the result and continues. That loop is what makes an <Link href="/timeline#agents">agent</Link>.</p>
            <p>In a GPT, tools are Capabilities (tick boxes) and Actions (connections you define). In a Gem, one Default tool. In Claude, connectors. Turn on only what the bot needs: a bot that can search the web answers from the web, not from your file.</p>
            <p className="guide-try"><strong>Be careful.</strong> Anything the model reads can try to instruct it. A tool that reads outside text and a tool that sends things out, together, are the dangerous pair (the <Link href="/glossary/interfaces-and-agents/lethal-trifecta">lethal trifecta</Link>).</p>
          </div>
          <div className="guide-shots">
            <Shot src="gpt-capabilities" width={1440} height={393} alt="The GPT builder's Capabilities: Web Search and Image Generation ticked, Code Interpreter unticked, then Actions">ChatGPT: Capabilities (Web Search, Image Generation, Code Interpreter) and Actions.</Shot>
            <Shot src="gpt-create" width={1440} height={662} alt="The GPT builder's Create tab, a conversation that writes the configuration for you">The GPT builder&rsquo;s Create tab writes the configuration for you from a conversation. Switch to Configure to read what it wrote.</Shot>
          </div>
        </section>

        <section className="guide-build-section" id="build">
          <p className="eyebrow">Now</p>
          <h2>Build one in ten minutes</h2>
          <div className="guide-build">
            <section>
              <h3>In ChatGPT</h3>
              <ol>
                <li>Go to <a href="https://chatgpt.com/gpts">chatgpt.com/gpts</a> and press <strong>Create</strong>, or make a <strong>Project</strong> from the sidebar.</li>
                <li><strong>Configure:</strong> name, description, instructions.</li>
                <li><strong>Knowledge:</strong> upload one file.</li>
                <li><strong>Capabilities:</strong> tick only what it needs.</li>
                <li>Try it in the preview, then <strong>Create</strong>.</li>
              </ol>
              <p>OpenAI plans to retire GPTs on <a href="https://help.openai.com/en/articles/20001519-custom-gpt-retirement-and-migration-faq">11 Dec 2026</a>. A Project has the same three parts.</p>
            </section>
            <section>
              <h3>In Gemini</h3>
              <ol>
                <li>Go to <a href="https://gemini.google.com/gems/create">gemini.google.com/gems/create</a>.</li>
                <li>Name and instructions.</li>
                <li><strong>Knowledge:</strong> add a file.</li>
                <li><strong>Default tool</strong>, if it needs one.</li>
                <li><strong>Save</strong>, and chat in the preview.</li>
              </ol>
              <p>Google is moving Gems into <a href="https://support.google.com/gemini/answer/18560919">skills</a> from November 2026.</p>
            </section>
            <section>
              <h3>In Claude</h3>
              <ol>
                <li>Go to <a href="https://claude.ai/projects">claude.ai/projects</a> and press <strong>New project</strong>.</li>
                <li><strong>Instructions:</strong> set project instructions.</li>
                <li><strong>Context:</strong> add a file, text, or a connection.</li>
                <li>Start a session inside the project.</li>
              </ol>
              <p>Claude Code, the agent, reads the same kind of instructions from a file in your folder.</p>
            </section>
          </div>

          <div className="guide-test">
            <h3>Then test it the same way three times</h3>
            <ol>
              <li>Ask something the knowledge answers.</li>
              <li>Ask something the instructions forbid.</li>
              <li>Ask something outside both.</li>
            </ol>
            <p>For each reply, decide which part spoke: the instructions, the file, a tool, or the trained assistant underneath, which was there before you wrote anything. That is this site&rsquo;s question: <Link href="/timeline">who is speaking?</Link></p>
          </div>
        </section>

        <section className="guide-not">
          <h2>What a bot is not</h2>
          <ul>
            <li><strong>The model does not change.</strong> Instructions and files change what it reads, not what it is. Underneath any Gem is a model already trained to be an assistant, and it tends to come back.</li>
            <li><strong>The character can slip.</strong> Instructions are short and a conversation is long. Given enough turns, the conversation writes a different character, as <Link href="/timeline#chatgpt">Sydney</Link> showed in 2023.</li>
            <li><strong>Context costs.</strong> Every message re-sends the instructions, the files, and the whole conversation so far.</li>
          </ul>
          <p className="activity-next">The full screenshots, with sources and dates: <Link href="/history">Interfaces</Link>. The history behind this page: <Link href="/timeline#configuration">the configuration era</Link>.</p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
