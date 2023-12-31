import { context, getOctokit } from "@actions/github";

import { getPullRequest } from "./queries/getPullRequest";
import { getLabelsToAdd } from "./queries/getLabelsToAdd";
import { getExistingLabels } from "./queries/getExistingLabels";
import { getChangedFiles } from "./queries/getChangedFiles";

import { addLabelsToPR } from "./actions/addLabelsToPR";
import { removeLabelsFromPR } from "./actions/removeLabelsFromPR";

(async function main() {
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

  const changedFiles = await getChangedFiles({
    pullRequest,
    octokit,
    owner,
    repo,
  });

  const existingLabels = getExistingLabels(pullRequest);
  const allLabelsToAdd = getLabelsToAdd(pullRequest, changedFiles);

  // Don't need to remove labels if there are none to remove
  const labelsToRemove = existingLabels.filter(
    (label) => !allLabelsToAdd.includes(label)
  );
  await removeLabelsFromPR({
    octokit,
    owner,
    repo,
    number,
    labels: labelsToRemove,
  });

  // Don't need to add labels if there are none to add
  const newLabelsToAdd = allLabelsToAdd.filter(
    (label) => !existingLabels.includes(label)
  );
  await addLabelsToPR({
    octokit,
    owner,
    repo,
    number,
    labels: newLabelsToAdd,
  });
})();
