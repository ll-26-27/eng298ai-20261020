# Who is speaking? Where the chatbot assistant came from

A small public site for ENG 298AI, the AI Humanities Lab at Harvard (Fall 2026). Talk to ELIZA, run GPT-2 with and without the first assistant script, learn how to build a bot in ChatGPT, Gemini, or Claude, and read a short history of the chatbot from Plato to the agents of 2026.

The full class site of 20 October 2026, with the Poetry Gem studio, the build-a-bot fork, the course readings as pages, and every experiment, is on the [`full-site`](https://github.com/ll-26-27/eng298ai-20261020/tree/full-site) branch. `main` is this simplified version.

## Pages

| URL | What |
| --- | --- |
| `/` | Home: the three things to try and the history to read |
| `/eliza` | ELIZA (1966): Weizenbaum's DOCTOR script in the browser, with the rule behind each reply |
| `/gpt-2` | GPT-2 (2019), two ways: the raw model, then the same model with the HHH prompt of 2021 in front of your question |
| `/build-a-bot` | How to build a bot: instructions, knowledge, and tools, in ChatGPT, Gemini, and Claude, with screenshots |
| `/timeline` | Who is speaking? A short history of the chatbot, c. 370 BCE to 2026, with ELIZA, GPT-2, and a retrieval demo inside it |
| `/history` | Interfaces: 43 screenshots of chat interfaces, 1966 to 2026, with sourced dates |
| `/glossary` | The glossary |

## Run it

Node 22 or later, pnpm.

```sh
cd nextjs
pnpm install
pnpm dev
```

No keys are needed. ELIZA and GPT-2 run in the browser (GPT-2 downloads about 130 MB from Hugging Face the first time); the timeline's knowledge demo searches precomputed vectors. `pnpm test` runs the checks.

## Layout

| Path | What |
| --- | --- |
| `nextjs/` | The app (see `nextjs/CLAUDE.md`) |
| `nextjs/content/` | The Markdown: `story/` (the timeline), `history/` (the screenshots), `glossary/`, and the ELIZA notes |
| `nextjs/public/guide/` | Crops of the screenshots for the guide |
| `readings/` | The course readings and AI papers the timeline links to |
