# Minimal-fix benchmark landscape

## What already exists

[SWE-bench](https://arxiv.org/abs/2310.06770) evaluates issue resolution from real GitHub issues and pull requests. Its tasks deliberately span functions, classes, and files, so it is a useful repository-agent benchmark but not a direct measure of whether a model can resist over-engineering on a narrow review finding.

The current [SWE-bench task format](https://www.swebench.com/SWE-bench/reference/cli/) already establishes several sound evaluation mechanics: a task holds a problem statement, hidden grading tests, an evaluation command, a Docker image, and optionally a gold patch. Its public score is resolved instances divided by total instances, not patch size or scope. MinimalFix adopts the problem/hidden-verifier split, but deliberately omits Docker and a required gold patch for self-contained v1 cases.

[SWE-Lancer](https://openai.com/index/swe-lancer/) extends the scale and realism to more than 1,400 freelance engineering tasks. Its independent tasks use end-to-end tests that were triple-verified by engineers, and its public release includes a unified Docker image. This reinforces the decision to treat executable correctness as the gate, while leaving MinimalFix's distinct question, patch restraint, visible rather than hidden behind an aggregate score.

[OpenHands Benchmarks](https://github.com/OpenHands/benchmarks) is useful integration precedent: it accepts an LLM configuration carrying a model, base URL, and API key, and logs per-instance runs. It is oriented to long-horizon agents and tool trajectories. MinimalFix uses Promptfoo's OpenCode SDK with read, navigation, edit, write, bash, and skill tools in a mutable fixture workspace. The lifecycle recreates that workspace before and after each test for isolation while preserving tool use and repository-state effects during the run.

## Why verifier quality matters

The 2026 study [Are “Solved Issues” in SWE-bench Really Solved Correctly?](https://arxiv.org/abs/2503.15223) found that 7.8% of patches counted correct by SWE-bench validation failed developer-written tests, and that plausible patches frequently behaved differently from the ground truth. The study's PatchDiff method uses differential testing to expose those discrepancies. The lesson for this project is not to require one exact reference patch: it is to keep each Verification Command specific, executable, and strong enough to reject a superficial repair. Adding adversarial or differential checks is the most valuable future upgrade to each case.

## OpenCode Go routing

The [OpenCode Go documentation](https://dev.opencode.ai/docs/go/) documents `glm-5.3-flash` at the OpenAI-compatible `https://opencode.ai/zen/go/v1/chat/completions` endpoint, and documents `GET https://opencode.ai/zen/go/v1/models` for current model metadata. It also shows that some Go models use Responses or Anthropic Messages instead. Therefore the harness should use `glm-5.3-flash` by default, fetch the current menu when credentials are supplied, and route known models by their documented protocol rather than pretending every model shares one endpoint.

## Implications for MinimalFix v1

- Use Promptfoo's native OpenCode SDK provider instead of a custom agent harness. Its `skill-used` assertion observes OpenCode's first-class skill tool calls.
- Keep a Benchmark Case isolated, with the Review Finding as the only task-specific prompt content and the source available through OpenCode's working directory.
- Place the tested skill in `.agents/skills/`, where OpenCode discovers it automatically from a fixture working directory.
- Enable only the read, edit, focused-shell, and skill tools required by a bug-fixing agent, and deny external-directory and web access.
- Treat multi-case fixtures, repeat sampling, and differential verifiers as later extensions once this direct skill-routing experiment is established.
