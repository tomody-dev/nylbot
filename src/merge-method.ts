/**
 * Merge method selection combining existing branch rules with production history.
 * Production lookup applies to ordinary develop-target PRs and defaults to main
 * and master when no explicit production branch is configured.
 */

import { fetchProductionHistory } from './github-api.js';
import type { ActionConfig, MergeMethodResult, Octokit, ProductionHistory, PullRequestData } from './types.js';
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
    selected.method !== 'squash' ||
    pr.baseRef !== config.developBranch ||
    pr.baseRef.startsWith(config.releaseBranchPrefix)
  ) {
    return selected;
  }

  const branches = config.productionBranch ? [config.productionBranch] : ['main', 'master'];
  const histories: ProductionHistory[] = [];
  for (const branch of branches) {
    const history = await fetchProductionHistory(octokit, owner, repo, branch, pr.headSha);
    if (!history) {
      if (config.productionBranch) {
        throw new Error(`Configured production branch \`${branch}\` was not found`);
      }
      continue;
    }
    histories.push(history);
    if (history.containsHead) {
      return {
        method: 'merge',
        reason: `Head SHA ${history.headSha} is contained in production branch \`${history.branch}\` at ${history.productionSha} (merge commit to preserve back-merge history)`,
        productionHistory: histories,
      };
    }
  }

  const evidence =
    histories.length > 0
      ? `Head SHA ${pr.headSha} is not contained in production branches ${histories.map((history) => `\`${history.branch}\` at ${history.productionSha}`).join(', ')}`
      : `No production branches found (checked: ${branches.join(', ')})`;
  return {
    ...selected,
    reason: `${evidence}; ${selected.reason}`,
    productionHistory: histories,
  };
}
