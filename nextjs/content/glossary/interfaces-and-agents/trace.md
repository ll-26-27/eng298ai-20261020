---
term: "Trace"
slug: "trace"
short: "A record of an agent’s steps, requests, and returned results."
aliases: ["execution trace", "run log"]
category: "interfaces-and-agents"
see_also: ["tool-call", "tool-result", "agent-loop"]
readings: []
experiments: ["mini-claw"]
updated: "2026-10-19"
---

# Trace

**A record of an agent’s steps, requests, and returned results.**

## In plain terms

Mini-claw displays a trace showing what the model received, what tool it requested, and what came back. That is an inspectable record of operations; it should not be presented as a complete record of private reasoning.

For an invented note-writing task, compare the proposed filename, the executed write, and the resulting file. An agent saying “saved” is a claim to check against the trace.



## See also

[Tool call](tool-call.md) · [Tool result](tool-result.md) · [Agent loop](agent-loop.md)


