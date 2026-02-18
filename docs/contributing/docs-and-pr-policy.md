# Documentation and PR guidelines

Guidelines for documentation content and PR descriptions, and how to respond to review comments. For a short summary of non-negotiables, see [CONTRIBUTING.md](../../CONTRIBUTING.md).

## Avoiding Specific Metrics in Documentation

To reduce maintenance burden and prevent documentation drift, **do not include specific metrics** such as test counts, file line numbers, coverage percentages, or other quantitative details in documentation files (e.g., README.md, guides, or other markdown documentation) **or in code comments**.

**Rationale**: These specific numbers change frequently as the codebase evolves. Maintaining them accurately requires ongoing effort with minimal benefit. Outdated metrics can mislead readers and create unnecessary maintenance overhead.

**Examples of what to avoid**:

- ❌ "The project has 150 tests"
- ❌ "The main file is 1,088 lines"
- ❌ "There are 25 TypeScript files"
- ❌ "This module has 94% test coverage" (in code comments)
- ❌ "80+ tests validate this functionality" (in code comments)

**Examples of acceptable alternatives**:

- ✅ "The project has comprehensive test coverage"
- ✅ "The codebase follows modular design principles"
- ✅ "Multiple TypeScript files implement the functionality"
- ✅ "This module has high test coverage" (in code comments)
- ✅ "Extensive tests validate this functionality" (in code comments)

> [!NOTE]
>
> Quantitative metrics should appear in CI or generated reports, not in manually-maintained documentation or code comments.

## Specific Metrics in PR Descriptions

While specific metrics should be avoided in documentation, **PR descriptions are exempt from this policy**. You may (and should) include specific details about "this change" or "at this time" in PR descriptions.

**Rationale**: PR descriptions capture a snapshot of changes at a specific point in time. They serve as historical records and do not require ongoing maintenance.

**Examples of acceptable PR description content**:

- ✅ "This PR splits a 1,088-line file into 15 smaller modules"
- ✅ "Added 23 new test cases to improve coverage"
- ✅ "Reduced file size from 500 lines to 150 lines"

## Responding to Review Comments

When addressing individual review comments in a PR conversation, **always reference the commit hash** that addresses each specific comment.

**Rationale**: This creates clear traceability in the GitHub PR conversation, making it easy to verify that each piece of feedback has been addressed.

**How to respond**:

- Reply to each conversation thread with the commit hash (short or full form) that addresses that specific feedback
- A simple hash-only reply is acceptable (e.g., `abc1234`)
- If the comment is addressed across multiple commits, reference all relevant hashes or provide a brief explanation (e.g., "Fixed across a1b2c3d and b2c3d4e due to refactoring split")
- Do not resolve the review thread until the reviewer has confirmed the fix

**Examples**:

- ✅ `a1b2c3d`
- ✅ `a1b2c3d - refactored as suggested`
- ✅ `Fixed in a1b2c3d and b2c3d4e`
