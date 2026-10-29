@AGENTS.md

# The app

A Next app. Plain JavaScript (TypeScript only under `lib/poetry-gem/`, the knowledge demo's search), the app's own CSS (`app/globals.css`, plus one CSS file beside each page); forced dark.

- **Pages:** `app/page.jsx` (home), `app/eliza/`, `app/gpt-2/` (the two GPT-2 panels, shared with the timeline from `app/story/`), `app/build-a-bot/` (the guide), `app/timeline/` (renders `app/story/page.jsx`), `app/glossary/`. The glyphs every page uses are `app/components/Glyphs.jsx`; `app/components/activity.css` is the shared activity layout.
- **Content:** `content/` is Markdown, read on every request (`lib/content.mjs`): `content/a/b.md` is `/a/b`, served by `app/[...slug]/`. `content/story/` is the timeline (format in its README), `content/history/` the Interfaces gallery (images in `_images/`, served by `app/context-media/`), `content/glossary/` the glossary, `content/experiments/eliza.md` the ELIZA notes.
- **In the browser:** ELIZA is `lib/eliza/`; GPT-2 runs through `lib/browser-lm/` (Transformers.js, a worker). The HHH prompt is `app/gpt-2/hhh-prompt.txt`, byte for byte, which `tests/hhh.test.mjs` checks.
- **Tests:** `pnpm test`.
