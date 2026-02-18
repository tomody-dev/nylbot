# CONTRIBUTING authoring guidelines

Guidelines for authoring CONTRIBUTING.md files. This document defines the purpose, structure, and style so contribution guides stay welcoming, clear, and easy to follow.

## 1. Purpose

`CONTRIBUTING.md` is the entry point for anyone who wants to contribute.

Its job is simple:

- Welcome newcomers.
- Explain how to get started within a few minutes.
- Clarify what is expected for a contribution to be accepted.

It should be short, clear, and easy to scan. It is a compressed representation of contribution expectations, not an index: the reader should be able to understand the basic workflow and non-negotiables from CONTRIBUTING.md alone.

## 2. Core Principles

### Core Visibility and Priority-Based Separation

CONTRIBUTING.md is a Top-Level Document. Apply the Core Visibility Principle and Priority-Based Separation defined in [meta.top-level-docs](meta.top-level-docs.md). High-priority content (read by almost everyone, costly if misunderstood, or defining project character) must appear in CONTRIBUTING.md in substance; do not reduce it to a link. When deciding what to move to another file, use priority, not length: only low-priority (detailed or auxiliary) content should be linked out.

### Non-Negotiables Must Be Explicit

State the project's non-negotiable conditions for accepting contributions in CONTRIBUTING.md. These are rules that, if broken, change the character of the project (e.g. CI must pass, commit format required, how to respond to review). Keep the list short and clear; link to detailed rules only for elaboration.

### Clarity and Warmth

Keep the tone friendly and straightforward. Explain the “why” behind important steps; avoid sounding bureaucratic or overly formal.

### Keep It Focused

`CONTRIBUTING.md` is not a development manual. Link to detailed documents for low-priority or auxiliary content. Keep high-priority content in CONTRIBUTING.md.

### Requirements Must Be Verifiable

Only mark something as required if it can be checked by CI or by a reviewer. Avoid vague rules.

### One Source of Truth

Policies, standards, or large documents should live in one authoritative place. `CONTRIBUTING.md` should link to that location for details. High-priority items still need substance in CONTRIBUTING.md.

## 3. Normative Language

Use these terms consistently:

**MUST** — required for acceptance
**SHOULD** — strongly recommended
**MAY** — optional

Use them lightly and only when they improve clarity.
Avoid overusing capitalized terms.

## 4. What to Include Directly (High-Priority Content)

The following items are high-priority and must appear in CONTRIBUTING.md in substance (not as links only):

- A short welcome message
- Non-negotiables (conditions that must hold for a contribution to be accepted)
- What kinds of contributions are accepted
- The basic workflow (Issue → Branch → PR → Review → Merge)
- Required checks (tests, linting, formatting)
- Definition of Done for PRs
- Where to ask questions
- How to report security issues or where to find the policy

Keep each section concise. Link out only for detailed or low-priority material.

## 5. What to Link Instead of Embedding (Low-Priority Only)

Apply Priority-Based Separation ([meta.top-level-docs](meta.top-level-docs.md)). Only content that is not read by almost everyone, does not create high cost if misunderstood, and does not define the character of the project should be moved to separate files. For such content, link to:

- Coding standards
- Architecture documentation
- Code of Conduct
- License text
- Environment setup or troubleshooting guides

Do not reduce non-negotiables or the basic workflow to links. This keeps CONTRIBUTING.md a compressed entity and the guide readable.

## 6. Authoring style

Author in short, direct sentences. Use headings, bullet points, and checklists to minimize cognitive load.

Prefer explanations like:

“Please include tests to make review faster.”

Avoid vague statements like:

“Write clean code.”

## 7. Common Pitfalls to Avoid

- Letting CONTRIBUTING.md become an index only (links without substance for non-negotiables and workflow)
- Turning the guide into a full handbook
- Describing rules that CI does not enforce
- Enforcing undocumented expectations during review
- Using long, unstructured paragraphs

## 8. Maintenance

Update `CONTRIBUTING.md` whenever workflows or CI requirements change. If contributors ask the same question repeatedly, clarify the corresponding part of the guide. Treat documentation updates as part of regular development work.

A good `CONTRIBUTING.md` lowers the barrier to entry while keeping expectations clear.
