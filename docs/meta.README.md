# README authoring guidelines

Guidelines for authoring repository README files. This document defines the purpose, structure, and style so READMEs stay focused, scannable, and easy to maintain.

## 1. Purpose

A README is the first document people see when they encounter a repository. Its purpose is to answer the most important questions quickly:

- What is this project?
- Why does it exist?
- How do I use it?
- Where can I learn more?

A good README is short, practical, and easy to navigate. It is a compressed representation of the project, not an index: the reader should be able to take basic action (understand what it is and get started) from the README alone.

## 2. Core Principles

### Core Visibility and Priority-Based Separation

README is a Top-Level Document. Apply the Core Visibility Principle and Priority-Based Separation defined in [meta.top-level-docs](meta.top-level-docs.md). High-priority content (read by almost everyone, costly if misunderstood, or defining project character) must appear in the README in substance; do not reduce it to a link. When deciding what to move to another file, use priority, not length: only low-priority (detailed or auxiliary) content should be linked out.

### Keep It Focused

A README is an overview, not full documentation. Move low-priority or specialized content into separate files and link to them. Keep high-priority content in the README.

### Optimize for the First Minute

Readers should understand the project's purpose and how to get started with minimal effort. Use simple structure, short paragraphs, and clear headings.

### Prioritize Practical Information

Focus on what users need first: installation, quick start, and common workflows. Where relevant, state design stance or key trade-offs briefly so the project's priorities are visible.

### One Source of Truth

Policies, extended guides, and large documents should live in dedicated locations. Do not duplicate long content inside the README. High-priority items still need substance in the README; link out only for details or low-priority material.

## 3. Recommended Structure

A typical README should include the following sections, in this order when applicable:

1. Project Title
2. Short Description (one or two sentences)
3. Features or Goals
4. Installation or Setup (brief; link out for details)
5. Quick Start or Basic Usage
6. Documentation Links
7. Contributing (link to CONTRIBUTING.md)
8. License (link, not full text)
9. Support or Contact

Each section should be short enough to read quickly.

## 4. Content to Link Instead of Embedding (Low-Priority Only)

Apply Priority-Based Separation ([meta.top-level-docs](meta.top-level-docs.md)). Only content that is not read by almost everyone, does not create high cost if misunderstood, and does not define the character of the project should be moved to separate files. For such low-priority content, link out to:

- Full documentation or user guides
- API references
- Architecture or design documents
- Troubleshooting guides
- Contribution guidelines (link to CONTRIBUTING.md; keep a brief note in README)
- Code of Conduct
- Release notes or changelogs

Do not reduce high-priority items to links. This keeps the README a compressed entity and the top-level page approachable.

## 5. Authoring style

Use short sentences and active voice. Highlight essential actions or concepts. Avoid long blocks of text; use lists where helpful.

Prefer explanations like:

- "Run this command to start the server."
- "See the full setup guide here."

Avoid vague or promotional statements without substance.

## 6. Common Pitfalls to Avoid

- Letting the README become an index only (links without substance for high-priority topics)
- Overloading the README with full manuals
- Long, unstructured paragraphs
- Outdated information that contradicts the rest of the repository
- Mixing user documentation with contributor documentation
- Embedding large code samples or logs directly in the README

## 7. Maintenance

Update the README whenever the installation process, usage workflow, or project purpose changes. If users frequently ask the same question, improve the corresponding section. Treat the README as a living document and part of the product experience.
