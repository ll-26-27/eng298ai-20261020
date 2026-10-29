# Instructions for agents

Read `README.md` first; the app's own notes are in `nextjs/CLAUDE.md`. Use pnpm only. There are no keys and no `.env` file: nothing on this site calls a paid model.

`main` is the simplified public site: ELIZA, GPT-2, How to build a bot, the timeline, the Interfaces gallery, and the glossary. Keep it that small. The full class site of 20 October 2026 (the Poetry Gem, the build-a-bot fork, every experiment, the orchestration notes) lives on the `full-site` branch; don't bring those back to `main` unless Madeleine asks.

No paper-doll or costume imagery: the site draws a bot as three abstract objects (`nextjs/app/components/Glyphs.jsx`). The screenshots in `nextjs/public/guide/` are crops of the Interfaces gallery (`nextjs/content/history/_images/`), cut to the editor panels.
