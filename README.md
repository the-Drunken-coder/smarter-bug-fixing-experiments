# Smarter Bug Fixing Experiments

This repository evaluates whether a coding agent automatically loads a bug-fixing skill and makes a restrained repair when the user gives it only a normal bug-fix request and a review finding.

It uses [Promptfoo's native OpenCode SDK provider](https://www.promptfoo.dev/docs/providers/opencode-sdk/), not a custom agent harness. Promptfoo records the run and checks native OpenCode skill invocation; OpenCode runs the agent, discovers project-local skills, and routes to the selected model.

## The skill under test

[`minimal-bug-fix`](.agents/skills/minimal-bug-fix/SKILL.md) is an ordinary Agent Skill. Its routing description is deliberately only:

> Use when fixing a bug.

The agent sees that description before the full skill body. The eval prompt itself remains natural:

```text
Fix this bug.

Review:
<review finding>
```

Promptfoo asserts that OpenCode invoked `minimal-bug-fix`, then grades the actual fixture change and focused verification.

## Run the experiment

Install the JavaScript dependencies, including the project-local OpenCode CLI, then expose your OpenCode Go key only to the process running the eval:

```bash
npm install
export OPENCODE_GO_API_KEY='...'
npm run validate
npm run eval
```

The default run uses OpenCode Go's `glm-5.3-flash` in the actual OpenCode agent runtime. Promptfoo starts an isolated agent session but grants the fixture only the read, edit, focused-shell, and skill tools needed for this repair. It denies web and external-directory access.

The checked-in fixture intentionally fails `python3 -m unittest -q` until repaired. Promptfoo copies it into a disposable workspace for every evaluation, so the source fixture remains unchanged.

## Add or tune an experiment

To tune the behavior, edit the skill body, not the user prompt. Keep its `description` as the trigger under test. Add an isolated fixture and a second Promptfoo config when expanding the suite; each config should give the agent a normal “Fix this bug” request plus a Review Finding and assert `skill-used: minimal-bug-fix`.

Each evaluation resets a disposable workspace from the checked-in fixture. Its result is based on the actual fixture diff and focused unittest, not the agent's reported verification.

See [the research note](docs/research/minimal-fix-benchmark-landscape.md) for the benchmark and verifier background, and [ADR-0001](docs/adr/0001-use-promptfoo-and-opencode.md) for the runtime boundary.
