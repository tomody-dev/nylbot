# Commit and PR title conventions

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages and PR titles. Details are in this document; for a short summary and workflow, see [CONTRIBUTING.md](../../CONTRIBUTING.md).

## Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

## Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit
- `ux`: User experience improvements (project-specific additional custom type)

> [!NOTE]
>
> For dependency updates, see the [Dependency Updates](#dependency-updates) section for commit type selection guidelines.

## Examples

```
feat(auth): add login functionality
fix(api): resolve null pointer exception in user service
docs(readme): update installation instructions
ci(workflow): add automated testing pipeline
```

## Pull Request Titles

PR titles must also follow the Conventional Commits format. This ensures consistency in the project history and enables automated changelog generation.

### Examples

```
feat(mergebot): add PR merge automation workflow
fix(release): correct version bump logic
docs(contributing): add commit message guidelines
```

### Dependency Updates

#### Decision Criteria: End-User Value Impact

The commit type for dependency updates is determined by a single criterion: **Does the dependency update affect the value delivered to end users?**

This decision framework requires understanding what constitutes the "primary output" of a repository and who the end users are.

#### Primary Output Definition

The **primary output** is what creates value for the repository's end users:

- For application repositories: the deployed application or distributed package
- For library repositories: the published library package
- For tool repositories: the command-line tool or SDK
- **For this repository**: the published GitHub Action

> [!NOTE]
>
> This repository delivers a reusable GitHub Action.
> The end users are developers who integrate this Action into their repositories.
> The Action itself is the primary output and versioned artifact.

#### Commit Type Selection Rules

**Use `fix` or `feat` when:**

- Dependency updates affect the primary output
- Changes could alter end-user value (behavior, performance, security, features)
- Examples in application repositories: runtime dependencies, bundled libraries, production packages

**Use `build`, `ci`, `chore`, or `test` when:**

- Dependency updates do NOT affect the primary output
- Changes only affect development, build, testing, or CI/CD processes
- Examples: build tools, test frameworks, linters, formatters, CI action dependencies

#### This Repository's Dependency Update Policy

In this repository:

- **Action runtime dependencies**: Use `fix` type
  - Rationale: The GitHub Action is the primary output
  - Dependency updates may affect runtime behavior, security, or stability
  - These changes directly impact developers using the Action
  - Therefore they are treated as bug fixes at the artifact level
- **Workflow definition changes**: Use `ci` type
  - Rationale: Workflow files are CI/CD configuration, not distributed artifacts
  - They affect repository automation but are not part of the published Action runtime

> [!IMPORTANT]
>
> For repositories that DO have a primary output (applications, libraries, tools), dependency updates affecting that output should use `fix` or `feat` to ensure:
>
> 1. Security patches reach end users promptly (via semantic versioning patch increments)
> 2. Behavioral changes are properly versioned
> 3. Dependency updates with bug fixes are treated appropriately
>
> The `fix` type for runtime dependencies is a pragmatic choice that prioritizes safety and proper versioning when changes could affect end-user value.
