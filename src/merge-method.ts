/**
 * Merge method selection combining existing branch rules with production history.
 * The production lookup is opt-in and only applies to ordinary develop-target PRs.
 */

import { fetchProductionHistory } from './github-api.js';
import type { ActionConfig, MergeMethodResult, Octokit, PullRequestData } from './types.js';
import { determineMergeMethod } from './validation.js';

/**
 * Resolves the merge method and retains the SHA evidence for reporting and
 * revalidation. Existing release and sync rules always retain their precedence.
 * A feature whose head is not in production continues to use squash.
 */
export async function resolveMergeMethod(
  octokit: Octokit,
  owner: string,
  repo: string,
  pr: PullRequestData,
  config: ActionConfig,
): Promise<MergeMethodResult> {
  const selected = determineMergeMethod(pr.headRef, pr.baseRef, config);
  if (
    !config.productionBranch ||
    selected.method !== 'squash' ||
    pr.baseRef !== config.developBranch ||
    pr.baseRef.startsWith(config.releaseBranchPrefix)
  ) {
    return selected;
  }

  const history = await fetchProductionHistory(octokit, owner, repo, config.productionBranch, pr.headSha);
  const evidence = `Head SHA ${history.headSha} ${history.containsHead ? 'is' : 'is not'} contained in production branch \`${history.branch}\` at ${history.productionSha}`;
  return {
    method: history.containsHead ? 'merge' : 'squash',
    reason: history.containsHead
      ? `${evidence} (merge commit to preserve back-merge history)`
      : `${evidence}; ${selected.reason}`,
    productionHistory: history,
  };
}
