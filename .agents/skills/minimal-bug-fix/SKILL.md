---
name: minimal-bug-fix
description: Use when fixing a bug.
---

Fix the identified defect with the smallest reasonable change.

- Change only code required by the review finding.
- Do not refactor nearby code, introduce abstractions, add comments, or add tests unless the finding requires it.
- Run the focused existing verification when it can establish that the repair works.
- In the final response, identify the changed files and verification result.
