# Minimal-Fix Evaluation

This project evaluates whether language models repair a narrowly described defect with the smallest reasonable correct patch.

## Language

**Benchmark Case**:
An isolated defect scenario supplied to an agent through an off-the-shelf evaluation runner.
_Avoid_: task, fixture

**Review Finding**:
The human-supplied description that identifies the defect and the intended behavioral correction.
_Avoid_: bug report, prompt

**Candidate Patch**:
The working-tree change an agent makes in response to a Benchmark Case.
_Avoid_: solution, completion

**Verification Command**:
The case-owned command that determines whether a Candidate Patch is correct.
_Avoid_: test suite, grader
