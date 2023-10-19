import { context, getOctokit } from "@actions/github";

import getPullRequest from "./getPullRequest";
import getSizeLabel from "./getSizeLabel";
import addLabelsToPR from "./addLabelsToPR";

async function main() {
  console.log("Starting action");

  if (context.eventName !== "pull_request") {
    throw new Error("This action only works on pull requests");
  }

  const number = context.payload.pull_request?.number;
  if (!number) throw new Error("No pull request number found in context");

  const token = process.env?.GITHUB_TOKEN;
  if (!token) throw new Error("No GITHUB_TOKEN found in environment variables");

  const owner = context.repo.owner;
  const repo = context.repo.repo;
  const octokit = getOctokit(token);

  const pullRequest = await getPullRequest({
    octokit,
    owner,
    repo,
    number,
  });

  const sizeLabel = getSizeLabel(pullRequest);

  const labels = [sizeLabel];

  await addLabelsToPR({
    octokit,
    owner,
    repo,
    number,
    labels,
  });
}

main();
