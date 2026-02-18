# Markdown authoring guidelines

This document defines a small number of explicit Markdown conventions used in this project.
Its purpose is to keep documents structurally consistent and easy to read under GitHub Flavored Markdown (GFM).

## 1. Scope

This document defines concrete format and structure policy for all Markdown in this repository.

It does not define content policy (what belongs in which document or how to prioritize content). That is defined in purpose-specific guidelines (e.g. meta.top-level-docs, meta.README, meta.CONTRIBUTING).

Section 5 applies only to authoring guideline documents (e.g. meta.README, meta.CONTRIBUTING). The rules in sections 1–4 apply to all Markdown unless explicitly stated otherwise. This document intentionally defines only a minimal set of conventions; other stylistic decisions are left to author judgment.

When this document and purpose-specific authoring guidelines conflict, the purpose-specific guidelines take precedence.

## 2. Baseline: GitHub Flavored Markdown

All Markdown is authored assuming GitHub Flavored Markdown (GFM). Authors should not rely on renderer-specific behavior outside GFM.

## 3. Document Structure Rules

### 3.1 Exactly One H1

Each Markdown document must contain exactly one level-1 heading (`#`).

- It must appear at the top of the file.
- It must not be repeated elsewhere.
- All other headings must begin at level 2 (`##`) or lower.

### 3.2 H1 Must Provide a Summary

The text immediately following the H1 must briefly describe:

- What the document is
- What it is for

The overview should be concise and should precede detailed sections.

## 4. Formatting Rules

### 4.1 List Marker Standardization

Unordered lists must use `-` as the list marker.

- Do not use `*` for unordered lists.
- Do not mix list markers within a document.

### 4.2 Do Not Use Trailing Double Spaces

Do not use two trailing spaces to force a line break. In GFM, normal line breaks are preserved, so trailing double spaces are unnecessary.

In most cases:

- Start a new paragraph, or
- Use list formatting

Hard line breaks should be avoided unless clearly necessary.

### 4.3 Restricted Use of `---`

Do not use `---` in cases where:

- It is intended only as a visual divider between sections
- It appears immediately before or after headings
- It is used to separate a closing sentence or short concluding remark

In these situations, use headings or normal paragraph structure instead.

`---` may be used only when a large structural separation is required and cannot be expressed through headings.

## 5. Authoring guideline documents only (layout)

The following applies only to authoring guideline documents (e.g. meta.README, meta.CONTRIBUTING, meta.top-level-docs). It is a restricted-scope exception to sections 1–4. Other Markdown in this repository is not required to follow it.

### 5.1 Opening

One H1, then one blank line, then one short summary paragraph (what the document is and what it is for), then one blank line, then the first level-2 section. No heading or extra line between H1 and the summary.

### 5.2 Blank lines

One blank line between level-2 sections. One blank line after any heading (## or ###) before body text. One blank line between paragraphs. One blank line before a list when it follows lead-in text; one blank line after a list before the next paragraph or heading. No blank line between list items.

### 5.3 Section length

Keep each section or subsection to one short paragraph, or one short paragraph plus a list, plus an optional one-sentence closer. Prefer one paragraph over two when the ideas are closely related.
