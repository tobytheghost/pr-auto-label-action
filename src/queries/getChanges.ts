import { getOctokit } from "@actions/github";
import { PullRequest } from "./getPullRequest";

const getBaseBranch = (pullRequest: PullRequest) => {
  return pullRequest.base.label;
};

const getHeadBranch = (pullRequest: PullRequest) => {
  return pullRequest.head.label;
};

export async function getChanges({
  pullRequest,
  octokit,
  owner,
  repo,
}: {
  pullRequest: PullRequest;
  octokit: ReturnType<typeof getOctokit>;
  owner: string;
  repo: string;
}) {
  const baseBranch = getBaseBranch(pullRequest);
  const headBranch = getHeadBranch(pullRequest);

  return octokit.rest.repos.compareCommits({
    owner: owner,
    repo: repo,
    base: baseBranch,
    head: headBranch,
  });
}

export type Changes = Awaited<ReturnType<typeof getChanges>>;
export type ChangedFiles = Changes["data"]["files"];