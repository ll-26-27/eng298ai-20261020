---
term: "Stopping condition"
slug: "stopping-condition"
short: "The rule that determines when an agent run should end."
aliases: ["stop condition", "iteration limit"]
category: "interfaces-and-agents"
see_also: ["agent-loop", "workflow", "human-in-the-loop"]
readings: []
experiments: ["mini-claw"]
updated: "2026-10-19"
---

# Stopping condition

**The rule that determines when an agent run should end.**

## In plain terms

An agent needs boundaries such as completion criteria, a maximum number of iterations, or another way to return control. Anthropic’s agent guidance recommends explicit stopping conditions.

For an invented mini-claw exercise, “stop after saving the note” is clearer than “keep improving it.” If the tool fails repeatedly, a run limit can prevent the same unsuccessful operation from continuing indefinitely.



## See also

[Agent loop](agent-loop.md) · [Workflow](workflow.md) · [Human in the loop](human-in-the-loop.md)

## Sources

- [Anthropic: building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
