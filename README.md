# nylbot-merge Action

A TypeScript-based GitHub Action that provides automated PR merging via the `/nylbot merge` command in PR comments.

## Features

- 🔐 **Permission validation** - Only authorized users can trigger merges
- ✅ **PR status checks** - Validates PR is open, unlocked, and not a draft
- 💬 **Review validation** - Ensures all conversations are resolved and approval exists
- 🔀 **Smart merge method** - Automatically selects squash or merge commit based on branch patterns
- 🔒 **Stale approval handling** - Dismisses approvals on outdated commits
- 📊 **Detailed feedback** - Posts clear status messages to PR comments
- ✅ **Unit tested** - Comprehensive test suite with extensive test coverage

## Next Steps

Depending on what you want to do next:

- **Use `/nylbot merge` on an existing project** &#x279C; See **[Usage](#usage)**
- **Integrate this Action into your repository** &#x279C; See **[Quick Start](#quick-start)**
- **Contribute to or debug the Action** &#x279C; See **[Development](./Development.md)**

## Usage

Comment `/nylbot merge` on any PR to trigger the merge action.

### Command Options

| Option                            | Description                                                                                                                                                                                                                                                                           |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--override-approval-requirement` | **Exceptional/privileged option**: Skip the review approval requirement for this merge only. The command executor acts as a reviewer proxy, taking responsibility for approving the changes. All other checks (status checks, merge conflicts, unresolved threads, etc.) still apply. |

**Example with flag:**

```
/nylbot merge --override-approval-requirement
```

> [!CAUTION]
>
> **Important Notes on `--override-approval-requirement`:**
>
> - **This is an exceptional, privileged option**: Use this option sparingly and only when you have a valid reason to bypass the normal approval workflow.
> - **Command executor takes reviewer responsibility**: By using this flag, you are acting as a reviewer proxy and asserting that you have reviewed and approved the changes yourself.
> - **Temporary and explicit**: This override applies only to the current merge command invocation and does not change repository settings or branch protection rules.
> - **Limited scope**: This flag only bypasses the approval requirement. All other checks (merge conflicts, unresolved conversations, status checks, etc.) must still pass.
> - **Commit message marker**: When this flag is used and actually takes effect (i.e., when there are no valid approvals), the merge commit message will include a marker indicating the exceptional approval override.

## Merge Method Selection

The action automatically selects the appropriate merge method:

| Condition                   | Merge Method | Reason                       |
| --------------------------- | ------------ | ---------------------------- |
| Head branch is `release/*`  | Merge commit | Preserve release history     |
| Head branch is `fix/sync/*` | Merge commit | Preserve back-merge history  |
| Base branch is `release/*`  | Squash       | Clean release branch history |
| Base branch is `develop`    | Squash       | Clean develop branch history |
| Otherwise                   | Merge commit | Default behavior             |

## Commit Message Behavior

nylbot-merge **explicitly specifies** both commit title and body to ensure consistent behavior regardless of repository settings for `merge_commit_title` and `merge_commit_message`.

### Merge Commits

For merge commits (used for `release/*` and `fix/sync/*` branches):

**Title (first line):**

```
Merge pull request #{PR_NUMBER} from {PR_MERGE_HEAD}
```

**Body (after blank line):**

```
{PR_TITLE}

{ADDITIONAL_MESSAGES}
```

**Example:**

```
Merge pull request #123 from release/v1.0.0

chore(release): Release v1.0.0

Merged-by: nylbot-merge (on behalf of @username)
```

### Squash Merges

For squash merges (used for PRs targeting `develop` or `release/*` branches):

**Title (first line):**

```
{PR_TITLE} (#{PR_NUMBER})
```

**Body (after blank line):**

```
* {COMMIT_TITLE_01}
* {COMMIT_TITLE_02}
* {COMMIT_TITLE_03}
...

Co-authored-by: {AUTHOR_NAME_01} <{AUTHOR_EMAIL_01}>
Co-authored-by: {AUTHOR_NAME_02} <{AUTHOR_EMAIL_02}>
...

{ADDITIONAL_MESSAGES}
```

**Notes:**

- Only commit titles (first line of each commit message) are listed, not full commit messages
- Each commit title is prefixed with `* ` (bullet point)
- Co-authors are extracted from all commits in the PR and listed in commit order (oldest ancestor &#x279C; most recent)
- Duplicate authors are included only once (first occurrence)
- Co-authored-by entries follow the Git trailer format: `Co-authored-by: Name <email>`

**Example:**

```
feat: add new authentication system (#456)

* feat: implement OAuth2 provider
* fix: handle token expiration
* docs: update authentication guide

Co-authored-by: Alice Developer <alice@example.com>
Co-authored-by: Bob Contributor <bob@example.com>

Merged-by: nylbot-merge (on behalf of @username)
```

### Special Commit Message Markers

When the `--override-approval-requirement` flag is used **and actually takes effect** (i.e., when there are no valid approvals), the merge commit message will include a marker in the additional messages section:

```
⚠️ EXCEPTIONAL MERGE: Approval requirement overridden via --override-approval-requirement
```

This marker is **not** added if the override flag was specified but didn't take effect (e.g., when there were already valid approvals).

## Pre-merge Checks

Before merging, the action validates:

1. ✅ PR is ready for review (open, unlocked, and not a draft)
2. ✅ All review conversations are resolved
3. ✅ At least one valid approval from another user
4. ✅ Mergeable state is clean
5. ✅ PR title follows Conventional Commits

### Check Status Icons

The merge check comment uses three icon states:

| Icon | Meaning                                                                                                          |
| ---- | ---------------------------------------------------------------------------------------------------------------- |
| ✅   | Check passed                                                                                                     |
| ❌   | Check failed and blocks merge                                                                                    |
| ⚠️   | Check did not pass but is explicitly tolerated (e.g., overridden approval requirement or accepted title warning) |

## Quick Start

Create a caller workflow in your project (e.g., `.github/workflows/on-comment.yml`):

```yaml
name: on-comment

on:
  issue_comment:
    types: [created]

concurrency:
  group: on-comment-${{ github.event.issue.number }}
  cancel-in-progress: false

jobs:
  nylbot-merge:
    if: github.event.issue.pull_request
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      issues: write
    steps:
      - uses: tomody-dev/nylbot/merge@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

## Inputs

| Input                      | Type   | Required | Default     | Valid Range | Description                                        |
| -------------------------- | ------ | -------- | ----------- | ----------- | -------------------------------------------------- |
| `github-token`             | string | Yes      | -           | -           | GitHub token for API authentication                |
| `release-branch-prefix`    | string | No       | `release/`  | -           | Prefix for release branches                        |
| `develop-branch`           | string | No       | `develop`   | -           | Name of the develop branch                         |
| `sync-branch-prefix`       | string | No       | `fix/sync/` | -           | Prefix for sync branches (back-merges)             |
| `mergeable-retry-count`    | number | No       | `5`         | 1-20        | Number of retries for mergeable status calculation |
| `mergeable-retry-interval` | number | No       | `10`        | 1-60        | Interval in seconds between retries                |

> [!NOTE]
>
> **Input Validation**: Out-of-range values for `mergeable-retry-count` and `mergeable-retry-interval` will cause the action to fail with a clear error message indicating the valid range.

## Outputs

| Output         | Description                                                                 |
| -------------- | --------------------------------------------------------------------------- |
| `result`       | Result of the operation: `merged`, `skipped`, `failed`, or `already_merged` |
| `merge-method` | Merge method used: `squash` or `merge` (only set when merged)               |

## Permissions Required

The workflow must have the following permissions:

- `contents: write` - For performing merges
- `pull-requests: write` - For posting comments and dismissing reviews
- `issues: write` - For adding reactions to comments

### User Authorization

To execute the `/nylbot merge` command, users must satisfy **both** of the following requirements:

1. **Author Association**: Must be one of the following:
   - **OWNER** - Repository owner
   - **MEMBER** - Organization member
   - **COLLABORATOR** - Explicitly added as a collaborator

2. **Permission Level**: Must have one of the following permissions:
   - **admin** - Full administrative access
   - **maintain** - Maintain access (manage repository without destructive actions)
   - **write** - Write access (push to repository)

Both checks are performed because:

- **Author association** verifies the user's relationship to the repository
- **Permission level** confirms the user has actual write capabilities

> [!NOTE]
> **Approval validation uses different criteria**: When validating PR approvals, the action only checks the reviewer's permission level (admin/maintain/write) and does not check author association. This is because GitHub App tokens (like `GITHUB_TOKEN`) may return `'NONE'` for author_association even for valid collaborators. See [GitHub Community Discussion #70568](https://github.com/orgs/community/discussions/70568).

Users without sufficient permissions will receive a clear error message when attempting to use the command.

## Limitations

> [!WARNING]
>
> **Fork PRs are NOT supported**: This action explicitly rejects PRs from forked repositories. This design decision is made because the typical usage pattern involves passing `GITHUB_TOKEN`, which has restricted write permissions on fork PRs as a GitHub security feature. While technically possible to support fork PRs with a Personal Access Token (PAT), this action intentionally does not support them to maintain a consistent and predictable behavior. To merge fork PRs, repository maintainers should use the GitHub web interface or push the fork branch to the main repository first.
