# Merge and commit message behavior

This document describes how nylbot-merge selects the merge method and formats merge commit messages. For basic usage and inputs, see [README](../README.md).

## Merge Method Selection

The action automatically selects the appropriate merge method:

| Condition                                                                             | Merge Method | Reason                                         |
| ------------------------------------------------------------------------------------- | ------------ | ---------------------------------------------- |
| Head branch is `release/*`                                                            | Merge commit | Preserve release history                       |
| Head branch is `fix/sync/*`                                                           | Merge commit | Preserve back-merge history                    |
| Base branch is `release/*`                                                            | Squash       | Clean release branch history                   |
| Base branch is `develop` and its exact PR head is contained in a production candidate | Merge commit | Preserve the already-integrated hotfix history |
| Base branch is `develop`                                                              | Squash       | Clean develop branch history                   |
| Otherwise                                                                             | Merge commit | Default behavior                               |

### Production history lookup

Production-history selection is enabled without additional configuration. When `production-branch` is empty, the action checks `main` and `master` and selects merge if either contains the exact PR head. Candidates returning 404 from the branch lookup are skipped. If neither candidate exists, the existing branch-name rules apply. If existing candidates do not contain the head, ordinary features still use squash.

Set `production-branch` to override these candidates with a specific production branch. If that explicitly configured branch is missing, selection stops. The repository's default branch is not used as a substitute.

History lookup applies only to develop-target PRs that would otherwise use squash. Existing release-source, sync-source, and release-target rules keep their precedence, including configured branch names and prefixes.

The supported hotfix flow is:

1. Merge the hotfix topic into production with a merge commit.
2. Keep the topic unchanged after that merge. Additional production fixes use new hotfix topics.
3. Back-merge the same topic into develop using `/nylbot merge`.

The action captures each candidate's production SHA and compares it with the exact PR head SHA. If the head is an ancestor of a candidate or equals it, the action selects merge. Otherwise it keeps squash for ordinary features. It uses the comparison status and ancestry evidence rather than searching a paginated commit list.

The candidate lookup and comparison are repeated after the existing head and mergeability checks. Normal production advances are accepted when the merge decision stays the same. A changed PR source or target, changed merge decision, failed API request, or inconsistent comparison response stops the operation and requires retry. These failures never fall back to squash. Only a missing automatic candidate is skipped; comparison errors, including comparison 404 responses, stop selection. PR comments record the selected method, reason, and production/head SHAs.

History selection does not bypass permission, approval, unresolved-thread, or mergeability checks. A develop-side conflict does not invalidate production ancestry, but it still prevents automatic merging. If conflict resolution uses a separate integration branch, the existing `fix/sync/*` rule remains available without changing the original hotfix topic.

## Commit Message Behavior

nylbot-merge **explicitly specifies** both commit title and body to ensure consistent behavior regardless of repository settings for `merge_commit_title` and `merge_commit_message`.

### Merge Commits

For merge commits (including `release/*`, `fix/sync/*`, and production-integrated hotfix back-merges):

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

For squash merges (used for ordinary features targeting `develop` and fixes targeting `release/*`):

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
- Co-authors are extracted from all commits in the PR and listed in commit order (oldest ancestor → most recent)
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

## Approval validation note

The action validates approving reviewers differently depending on the reviewer type:

- **Human reviewers**: validated via the reviewer's repository permission level (admin/maintain/write). Author association is intentionally not used because GitHub App tokens (like `GITHUB_TOKEN`) may return `'NONE'` for author_association even for valid collaborators. See [GitHub Community Discussion #70568](https://github.com/orgs/community/discussions/70568).
- **Bot reviewers** (`user.type === 'Bot'`): validated via the `trusted-approver-bots` action input allowlist. GitHub App bot accounts cannot be added as repository collaborators, so the permission API cannot authorize them; the allowlist lets the workflow author declare which Bot logins are trusted reviewers for this repository. Matching is case-sensitive and the trailing `[bot]` suffix is optional. When the allowlist is empty (default), no Bot approvals are accepted.

Self-approvals (reviewer login matches PR author) and stale reviews (review SHA differs from current HEAD) are rejected for both reviewer types.

## Check status icons

The merge check comment uses three icon states:

| Icon | Meaning                                                                                                          |
| ---- | ---------------------------------------------------------------------------------------------------------------- |
| ✅   | Check passed                                                                                                     |
| ❌   | Check failed and blocks merge                                                                                    |
| ⚠️   | Check did not pass but is explicitly tolerated (e.g., overridden approval requirement or accepted title warning) |
