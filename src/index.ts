import { context, getOctokit } from "@actions/github";

import getPullRequest from "./queries/getPullRequest";
import addLabelsToPR from "./actions/addLabelsToPR";
import { getLabelsToAdd } from "./labels/getLabelsToAdd";
import { getLabelsToRemove } from "./queries/getLabelsToRemove";
import removeLabelsFromPR from "./actions/removeLabelsFromPR";

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

  const labelsToRemove = getLabelsToRemove(pullRequest);

  await removeLabelsFromPR({
    octokit,
    owner,
    repo,
    number,
    labels: labelsToRemove,
  });

  const labelsToAdd = getLabelsToAdd(pullRequest);

  await addLabelsToPR({
    octokit,
    owner,
    repo,
    number,
    labels: labelsToAdd,
  });
}

main();
