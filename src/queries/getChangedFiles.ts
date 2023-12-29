import { getOctokit } from "@actions/github";
import { PullRequest } from "./getPullRequest";

export async function getChangedFiles({
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
  const ignoredFiles = process.env?.IGNORED_FILES?.split(" ") || [];
  if (ignoredFiles.length) {
    console.log(`Ignored files: ${ignoredFiles.join(", ")}`);
  }

  const changes = await octokit.rest.repos.compareCommits({
    owner: owner,
    repo: repo,
    base: pullRequest.base.label,
    head: pullRequest.head.label,
  });

  return changes.data.files.filter((file) => {
    if (!ignoredFiles.includes(file.filename)) return file;
    return console.log(`Skipping file ${file.filename}`);
  });
}

export type ChangedFiles = Awaited<ReturnType<typeof getChangedFiles>>;
