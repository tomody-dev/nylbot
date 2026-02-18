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
- **Contribute to or debug the Action** &#x279C; See **[Development](./docs/development.md)**

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

## Merge method and commit message format

Merge method (squash vs merge commit) and the exact format of merge commit messages are determined by branch patterns and repository settings. For the full table, examples, and special markers, see [Merge and commit message behavior](docs/behavior.md).

## Pre-merge Checks

Before merging, the action validates:

1. ✅ PR is ready for review (open, unlocked, and not a draft)
2. ✅ All review conversations are resolved
3. ✅ At least one valid approval from another user
4. ✅ Mergeable state is clean
5. ✅ PR title follows Conventional Commits

Check status icons (✅ / ❌ / ⚠️) are described in [behavior.md](docs/behavior.md#check-status-icons).

## Quick Start

No separate installation is required: add the step to your workflow and the Action runs in GitHub's environment. Create a caller workflow in your project (e.g., `.github/workflows/on-comment.yml`):

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
      - uses: tomody-dev/nylbot/merge@v2
        # with:
        #   release-branch-prefix: "release/"
        #   develop-branch: "develop"
        #   sync-branch-prefix: "fix/sync/"
```

## Inputs

| Input                      | Type   | Required | Default               | Valid Range | Description                                        |
| -------------------------- | ------ | -------- | --------------------- | ----------- | -------------------------------------------------- |
| `token`                    | string | No       | `${{ github.token }}` | -           | GitHub token for API authentication                |
| `release-branch-prefix`    | string | No       | `release/`            | -           | Prefix for release branches                        |
| `develop-branch`           | string | No       | `develop`             | -           | Name of the develop branch                         |
| `sync-branch-prefix`       | string | No       | `fix/sync/`           | -           | Prefix for sync branches (back-merges)             |
| `mergeable-retry-count`    | number | No       | `5`                   | 1-20        | Number of retries for mergeable status calculation |
| `mergeable-retry-interval` | number | No       | `10`                  | 1-60        | Interval in seconds between retries                |

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

To execute `/nylbot merge`, the user must have **Author Association** (OWNER, MEMBER, or COLLABORATOR) and **Permission Level** (admin, maintain, or write). Both checks are performed because: **Author association** verifies the user's relationship to the repository; **Permission level** confirms the user has actual write capabilities. Users without sufficient permissions receive a clear error message. For approval validation (reviewer side), see [behavior.md](docs/behavior.md#approval-validation-note).

## Limitations

> [!WARNING]
>
> **Fork PRs are NOT supported**: This action explicitly rejects PRs from forked repositories. This design decision is made because the typical usage pattern involves passing `GITHUB_TOKEN`, which has restricted write permissions on fork PRs as a GitHub security feature. While technically possible to support fork PRs with a Personal Access Token (PAT), this action intentionally does not support them to maintain a consistent and predictable behavior. To merge fork PRs, repository maintainers should use the GitHub web interface or push the fork branch to the main repository first.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines. To develop or debug the Action, see [Development](docs/development.md).

## License

See [LICENSE](LICENSE).

## Support

For questions or issues, please open a [GitHub Issue](https://github.com/tomody-dev/nylbot/issues).
