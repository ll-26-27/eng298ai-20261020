---
term: "Memory"
slug: "memory"
short: "Information saved for use beyond the immediate exchange."
aliases: ["persistent memory"]
category: "interfaces-and-agents"
see_also: ["conversation-history", "instruction-files", "workspace", "weights"]
readings: ["plato-phaedrus"]
experiments: ["layers", "mini-claw"]
updated: "2026-10-19"
---

# Memory

**Information saved for use beyond the immediate exchange.**

## In plain terms

Claude Code distinguishes written project instructions from notes it accumulates as auto memory. Both become input when loaded; neither is a change to model weights.

Mini-claw makes persistence tangible: a memory.md file is read at the start and can be appended to. Inspect the note, restart, and ask what survived. The scripted stand-in exercises persistence; testing whether the model uses remembered information requires the Claude path.

## In the readings

In [*Phaedrus*, 274c–275b](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/plato-phaedrus.md), the story of Theuth distinguishes external written reminders from cultivated memory. A saved memory file makes that distinction useful to revisit; the dialogue is not describing software memory.



## See also

[Conversation history](conversation-history.md) · [CLAUDE.md / AGENTS.md](instruction-files.md) · [Workspace](workspace.md) · [Weights](../models-and-training/weights.md)

## Sources

- [Claude Code: project instructions and memory](https://code.claude.com/docs/en/memory)
