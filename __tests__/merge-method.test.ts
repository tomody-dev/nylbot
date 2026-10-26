import { execFile } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { resolveMergeMethod } from '../src/merge-method.js';
import type { ActionConfig, CommitComparison, PullRequestData } from '../src/types.js';
import { isHeadInProduction } from '../src/validation.js';

import { createMockOctokit } from './helpers/octokit.mock.js';

const config: ActionConfig = {
  developBranch: 'develop',
  productionBranch: 'master',
  releaseBranchPrefix: 'release/',
  syncBranchPrefix: 'fix/sync/',
  mergeableRetryCount: 5,
  mergeableRetryInterval: 10,
  trustedApproverBots: [],
};
const pr: PullRequestData = {
  state: 'open',
  locked: false,
  draft: false,
  merged: false,
  mergeable: true,
  mergeableState: 'clean',
  headRef: 'topic/repair',
  baseRef: 'develop',
  headSha: 'head-sha',
  author: 'author',
  isFork: false,
  title: 'fix: repair',
};

describe('resolveMergeMethod', () => {
  it.each([
    { headRef: 'release/1.0.0', baseRef: 'develop', productionBranch: 'master', method: 'merge' },
    { headRef: 'fix/sync/fix', baseRef: 'develop', productionBranch: 'master', method: 'merge' },
    { headRef: 'topic/fix', baseRef: 'release/1.0.0', productionBranch: 'master', method: 'squash' },
    { headRef: 'topic/fix', baseRef: 'master', productionBranch: 'master', method: 'merge' },
  ])('keeps existing selection without history lookup: $headRef → $baseRef ($productionBranch)', async (c) => {
    const octokit = createMockOctokit();
    const result = await resolveMergeMethod(
      octokit,
      'owner',
      'repo',
      { ...pr, headRef: c.headRef, baseRef: c.baseRef },
      { ...config, productionBranch: c.productionBranch },
    );
    expect(result.method).toBe(c.method);
    expect(octokit.rest.repos.getBranch).not.toHaveBeenCalled();
    expect(octokit.rest.repos.compareCommitsWithBasehead).not.toHaveBeenCalled();
  });

  it('supports configured production and develop branch names', async () => {
    const octokit = createMockOctokit();
    const result = await resolveMergeMethod(
      octokit,
      'owner',
      'repo',
      { ...pr, baseRef: 'integration' },
      { ...config, developBranch: 'integration', productionBranch: 'production' },
    );
    expect(result.method).toBe('squash');
    expect(octokit.rest.repos.getBranch).toHaveBeenCalledWith({ owner: 'owner', repo: 'repo', branch: 'production' });
    expect(octokit.rest.repos.compareCommitsWithBasehead).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      basehead: 'production-sha...head-sha',
      per_page: 1,
    });
    expect(result.reason).toContain('is not contained');
    expect(result.productionHistory?.[0]?.containsHead).toBe(false);
    expect(octokit.rest.repos.getBranch).toHaveBeenCalledTimes(1);
  });

  it('does not override a configured release target even if it is also the develop branch', async () => {
    const octokit = createMockOctokit();
    const result = await resolveMergeMethod(
      octokit,
      'owner',
      'repo',
      { ...pr, baseRef: 'release/current' },
      { ...config, developBranch: 'release/current' },
    );
    expect(result.method).toBe('squash');
    expect(octokit.rest.repos.getBranch).not.toHaveBeenCalled();
  });
});

describe('automatic main/master production candidates', () => {
  function mockCandidates(candidates: Partial<Record<string, boolean>>) {
    const octokit = createMockOctokit();
    octokit.rest.repos.getBranch.mockImplementation(async (params) => {
      const branch = params?.branch ?? '';
      if (candidates[branch] === undefined) {
        throw Object.assign(new Error('Not Found'), { status: 404 });
      }
      return { data: { commit: { sha: branch + '-sha' } } } as Awaited<ReturnType<typeof octokit.rest.repos.getBranch>>;
    });
    octokit.rest.repos.compareCommitsWithBasehead.mockImplementation(async (params) => {
      const productionSha = params?.basehead.split('...')[0] ?? '';
      const branch = productionSha.slice(0, -4);
      const containsHead = candidates[branch] === true;
      return {
        data: {
          status: containsHead ? 'behind' : 'diverged',
          ahead_by: containsHead ? 0 : 1,
          behind_by: 1,
          base_commit: { sha: productionSha },
          merge_base_commit: { sha: containsHead ? pr.headSha : 'common-sha' },
        },
      } as Awaited<ReturnType<typeof octokit.rest.repos.compareCommitsWithBasehead>>;
    });
    return octokit;
  }

  it.each([
    { candidates: { main: true }, checked: ['main'], method: 'merge' },
    { candidates: { master: true }, checked: ['main', 'master'], method: 'merge' },
    { candidates: { main: false, master: true }, checked: ['main', 'master'], method: 'merge' },
    { candidates: { main: true, master: false }, checked: ['main'], method: 'merge' },
    { candidates: { main: false, master: false }, checked: ['main', 'master'], method: 'squash' },
    { candidates: { main: false }, checked: ['main', 'master'], method: 'squash' },
    { candidates: {}, checked: ['main', 'master'], method: 'squash' },
  ])('selects $method without configuration for %j', async ({ candidates, checked, method }) => {
    const octokit = mockCandidates(candidates);
    const result = await resolveMergeMethod(octokit, 'owner', 'repo', pr, { ...config, productionBranch: '' });
    expect(result.method).toBe(method);
    expect(octokit.rest.repos.getBranch.mock.calls.map(([params]) => params?.branch)).toEqual(checked);
    expect(result.productionHistory).toBeDefined();
    if (method === 'merge') {
      expect(result.productionHistory?.some((history) => history.containsHead)).toBe(true);
    }
  });

  it('reports the absence of both default candidates without blocking ordinary feature merges', async () => {
    const octokit = mockCandidates({});
    const result = await resolveMergeMethod(octokit, 'owner', 'repo', pr, { ...config, productionBranch: '' });
    expect(result.reason).toContain('No production branches found');
    expect(result.productionHistory).toEqual([]);
    expect(octokit.rest.repos.compareCommitsWithBasehead).not.toHaveBeenCalled();
  });

  it('does not fall back to automatic candidates when an explicit production branch is missing', async () => {
    const octokit = mockCandidates({ main: true, master: true });
    await expect(
      resolveMergeMethod(octokit, 'owner', 'repo', pr, { ...config, productionBranch: 'production' }),
    ).rejects.toThrow('Configured production branch');
    expect(octokit.rest.repos.getBranch.mock.calls.map(([params]) => params?.branch)).toEqual(['production']);
  });

  it.each([401, 403, 429, 500])(
    'propagates branch lookup HTTP %s instead of treating it as absence',
    async (status) => {
      const octokit = mockCandidates({ master: true });
      octokit.rest.repos.getBranch.mockRejectedValue(Object.assign(new Error('API unavailable'), { status }));
      await expect(
        resolveMergeMethod(octokit, 'owner', 'repo', pr, { ...config, productionBranch: '' }),
      ).rejects.toThrow('API unavailable');
    },
  );

  it('propagates comparison 404 even when a missing main candidate was skipped', async () => {
    const octokit = mockCandidates({ master: true });
    octokit.rest.repos.compareCommitsWithBasehead.mockRejectedValue(
      Object.assign(new Error('Comparison unavailable'), { status: 404 }),
    );
    await expect(resolveMergeMethod(octokit, 'owner', 'repo', pr, { ...config, productionBranch: '' })).rejects.toThrow(
      'Comparison unavailable',
    );
  });
});

describe('production ancestry with real Git history', () => {
  const exec = promisify(execFile);
  let directory: string;
  let hotfix: string;
  let production: string;
  let advanced: string;
  let nextHotfix: string;
  let nextProduction: string;
  let feature: string;
  let develop: string;
  let reverted: string;
  const env = {
    ...process.env,
    GIT_AUTHOR_NAME: 'Fixture Author',
    GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
    GIT_COMMITTER_NAME: 'Fixture Author',
    GIT_COMMITTER_EMAIL: 'fixture@example.invalid',
    GIT_AUTHOR_DATE: '2026-01-01T00:00:00Z',
    GIT_COMMITTER_DATE: '2026-01-01T00:00:00Z',
  };
  async function git(args: string[], input?: string): Promise<string> {
    const child = exec('git', ['--git-dir=' + directory, ...args], { env });
    child.child.stdin?.end(input);
    return (await child).stdout.trim();
  }
  async function commit(message: string, parents: string[], content: string): Promise<string> {
    const blob = await git(['hash-object', '-w', '--stdin'], content);
    const tree = await git(['mktree'], `100644 blob ${blob}\tfile.txt\n`);
    return git(['commit-tree', tree, ...parents.flatMap((p) => ['-p', p])], message + '\n');
  }
  async function comparison(base: string, head: string): Promise<CommitComparison> {
    const counts = (await git(['rev-list', '--left-right', '--count', `${base}...${head}`])).split(/\s+/).map(Number);
    const behind = counts[0] ?? 0;
    const ahead = counts[1] ?? 0;
    return {
      status: ahead === 0 ? (behind === 0 ? 'identical' : 'behind') : behind === 0 ? 'ahead' : 'diverged',
      ahead_by: ahead,
      behind_by: behind,
      base_commit: { sha: base },
      merge_base_commit: { sha: await git(['merge-base', base, head]) },
    };
  }
  beforeAll(async () => {
    directory = await mkdtemp(join(process.env.TMPDIR ?? tmpdir(), 'nylbot-history-'));
    await exec('git', ['init', '--bare', '--quiet', directory], { env });
    const base = await commit('baseline', [], 'base\n');
    hotfix = await commit('hotfix', [base], 'fixed\n');
    production = await commit('merge hotfix into production', [base, hotfix], 'fixed\n');
    advanced = await commit('advance production', [production], 'fixed later\n');
    nextHotfix = await commit('new hotfix topic', [advanced], 'fixed again\n');
    nextProduction = await commit('merge new hotfix topic', [advanced, nextHotfix], 'fixed again\n');
    develop = await commit('independent develop edit', [base], 'different\n');
    feature = await commit('ordinary feature', [develop], 'feature\n');
    reverted = await commit('undo content without rewriting history', [nextProduction], 'base\n');
  });
  afterAll(async () => {
    await rm(directory, { recursive: true, force: true });
  });

  it('preserves the original head across production advances, new hotfixes, and revert commits', async () => {
    for (const base of [production, advanced, nextProduction, reverted, hotfix]) {
      const data = await comparison(base, hotfix);
      expect(isHeadInProduction(data, base, hotfix)).toBe(true);
      const octokit = createMockOctokit();
      octokit.rest.repos.getBranch.mockResolvedValue({ data: { commit: { sha: base } } } as Awaited<
        ReturnType<typeof octokit.rest.repos.getBranch>
      >);
      octokit.rest.repos.compareCommitsWithBasehead.mockResolvedValue({ data } as Awaited<
        ReturnType<typeof octokit.rest.repos.compareCommitsWithBasehead>
      >);
      const result = await resolveMergeMethod(octokit, 'owner', 'repo', { ...pr, headSha: hotfix }, config);
      expect(result.method).toBe('merge');
      expect(result.reason).toContain(hotfix);
      expect(result.reason).toContain(base);
    }
    expect(isHeadInProduction(await comparison(nextProduction, nextHotfix), nextProduction, nextHotfix)).toBe(true);
  });

  it('keeps ordinary features as squash', async () => {
    const data = await comparison(production, feature);
    expect(isHeadInProduction(data, production, feature)).toBe(false);
    const octokit = createMockOctokit();
    octokit.rest.repos.getBranch.mockResolvedValue({ data: { commit: { sha: production } } } as Awaited<
      ReturnType<typeof octokit.rest.repos.getBranch>
    >);
    octokit.rest.repos.compareCommitsWithBasehead.mockResolvedValue({ data } as Awaited<
      ReturnType<typeof octokit.rest.repos.compareCommitsWithBasehead>
    >);
    expect((await resolveMergeMethod(octokit, 'owner', 'repo', { ...pr, headSha: feature }, config)).method).toBe(
      'squash',
    );
  });

  it('still recognizes the unchanged hotfix when develop has a real merge conflict', async () => {
    await expect(git(['merge-tree', '--write-tree', develop, hotfix])).rejects.toMatchObject({ code: 1 });
    expect(isHeadInProduction(await comparison(production, hotfix), production, hotfix)).toBe(true);
  });
});
