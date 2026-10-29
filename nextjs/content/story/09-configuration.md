---
title: "The configuration era: GPTs and Gems"
chapter: 8
years: "2023 – 2024"
description: "Custom instructions, GPTs, Projects, Gems: the script is handed to the user. A bot is now three things: instructions, knowledge, and a way to deliver the knowledge."
year: "Nov 2023"
label: "GPTs"
---

# The configuration era: GPTs and Gems

After Sydney, the companies did something that, in light of this history, looks almost inevitable. They gave the script to the users. Between 2023 and 2024 every major chatbot acquired a place where you could write instructions, upload texts, and give the result a name.

```panel
type: image
src: ../history/_images/06-gpt-builder-configure-tab.png
alt: "The GPT builder's Configure tab, with a draft named Course TF Assistant"
caption: "OpenAI's GPT builder, with a draft \"Course TF Assistant\": a name, a description, instructions, knowledge files, a picture."
cite: "Screenshot 19 Oct 2026 (a draft, not published); GPTs announced [6 Nov 2023](https://openai.com/index/introducing-gpts/)"
```

In July 2023 ChatGPT added [custom instructions](../glossary/interfaces-and-agents/custom-instructions.md), two boxes whose contents were added, out of sight, to what the model read. That is the HHH preamble handed to the reader. In November came [GPTs](../glossary/chatbots/custom-gpts.md): "custom versions of ChatGPT" that combine instructions, uploaded "knowledge" files, and tools, each with its own name and picture, listed in a store. Anthropic's [Projects](../glossary/chatbots/claude-projects.md) followed in June 2024, and Google's [Gems](../glossary/chatbots/gems.md) in August.

Look at the form in the panel: a name, a description, a box for instructions, a place for files. It is a character sheet. The names frame different relations, too. A "GPT" is a being you meet in a store. A "Project" is a folder you work inside. A "Gem" is a finished, precious object.

```panel
type: knowledge
caption: "Knowledge is not learned: text is put in front of the model, either all of it or a few retrieved passages."
```

What does "knowledge" mean here? Not that the model learned anything. When you upload *Frankenstein* to a GPT, the text is put in front of the model, like the HHH script. Either the whole book goes in with every message, which is costly, or a search picks a few passages that seem relevant to your question ([retrieval-augmented generation](https://arxiv.org/abs/2005.11401), one of the course papers).

Try the panel with "reading." Keyword search matches your words: it finds Felix reading aloud. Meaning-based search compares [embeddings](../glossary/models-and-training/embedding.md), lists of numbers that place passages with similar ideas near each other, so it finds the creature learning language, in passages that never use the word. Whichever you choose, you can see exactly which pages the bot will read.

```panel
type: image
src: ../history/_images/19-gemini-gem-editor.png
alt: "Google's Gem editor, with a draft named Course TF Assistant and a preview beside it"
caption: "Google's Gem editor with the same draft: a name, instructions, and a preview."
cite: "Screenshot 19 Oct 2026 (unsaved); Gems rolled out [28 Aug 2024](https://workspaceupdates.googleblog.com/2024/08/customize-gemini-with-gems.html)"
```

So a custom bot of this era is three things: its **instructions** (the script), its **knowledge** (the texts put in front of the model), and its **tools** (what it may reach for, including the search that delivers the knowledge). [How to build a bot](/build-a-bot) shows where each one lives in ChatGPT, Gemini, and Claude.

One thing the interfaces make easy to miss: **context is not weights.** Writing instructions and uploading texts changes what the model reads, not what it is. Underneath any Gem is a model already pretrained, shown demonstrations, ranked, and given principles. You are decorating a character that is already there, and it tends to come back. Build one, then ask it three questions and decide, for each reply, which part answered.
