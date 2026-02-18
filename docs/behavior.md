# Merge and commit message behavior

This document describes how nylbot-merge selects the merge method and formats merge commit messages. For basic usage and inputs, see [README](../README.md).

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

When validating PR approvals, the action only checks the reviewer's permission level (admin/maintain/write) and does not check author association. This is because GitHub App tokens (like `GITHUB_TOKEN`) may return `'NONE'` for author_association even for valid collaborators. See [GitHub Community Discussion #70568](https://github.com/orgs/community/discussions/70568).

## Check status icons

The merge check comment uses three icon states:

| Icon | Meaning                                                                                                          |
| ---- | ---------------------------------------------------------------------------------------------------------------- |
| ✅   | Check passed                                                                                                     |
| ❌   | Check failed and blocks merge                                                                                    |
| ⚠️   | Check did not pass but is explicitly tolerated (e.g., overridden approval requirement or accepted title warning) |
