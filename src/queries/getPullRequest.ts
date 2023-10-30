import { type getOctokit } from "@actions/github";

export type	PullRequest = Awaited<ReturnType<typeof getPullRequest>>;

async function getPullRequest({
  octokit,
  owner,
  repo,
  number,
}: {
  octokit: ReturnType<typeof getOctokit>;
  owner: string;
  repo: string;
  number: number;
}) {
  const response = await octokit.rest.pulls.get({
    owner: owner,
    repo: repo,
    pull_number: number,
  });
  if (response.status !== 200) throw new Error("Failed to get PR");
  return response.data;
}

export default getPullRequest;