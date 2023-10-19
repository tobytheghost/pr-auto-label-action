import { context, getOctokit } from "@actions/github";

const LABELS = {
  XS: "size/XS",
  S: "size/S",
  M: "size/M",
  L: "size/L",
  XL: "size/XL",
  XXL: "size/XXL",
} as const;

async function main() {
  console.log("Starting action");
  
  if (context.eventName !== "pull_request") {
    throw new Error("This action only works on pull requests");
  }

  const number = context.payload.pull_request?.number;
  const token = process.env?.GITHUB_TOKEN;

  if (!number) throw new Error("No pull request number found in context");
  if (!token) throw new Error("No GITHUB_TOKEN found in environment variables");

  const owner = context.repo.owner;
  const repo = context.repo.repo;
  const octokit = getOctokit(token);

  console.log(`Getting changed lines for PR #${number}`);

  const linesChanged = await getPullRequestChangedLines({
    octokit,
    owner,
    repo,
    number,
  });

  console.log(`PR #${number} has ${linesChanged} lines changed`);

  const label = await getPRSize(linesChanged);

  await addLabelToPR({
    octokit,
    owner,
    repo,
    number,
    label,
  });
}

async function getPullRequestChangedLines({
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

  return response.data.additions + response.data.deletions;
}

async function getPRSize(linesChanged: number) {
  switch (true) {
    case linesChanged <= 50:
      return LABELS.XS;
    case linesChanged <= 100:
      return LABELS.S;
    case linesChanged <= 250:
      return LABELS.M;
    case linesChanged <= 500:
      return LABELS.L;
    case linesChanged <= 1000:
      return LABELS.XL;
    case linesChanged > 1000:
      return LABELS.XXL;
    default:
      throw new Error("No size found");
  }
}

async function addLabelToPR({
  octokit,
  owner,
  repo,
  number,
  label,
}: {
  octokit: ReturnType<typeof getOctokit>;
  owner: string;
  repo: string;
  number: number;
  label: string;
}) {
  const response = await octokit.rest.issues.addLabels({
    owner: owner,
    repo: repo,
    issue_number: number,
    labels: [label],
  });

  if (response.status !== 200) {
    throw new Error("Failed to add label to PR");
  }

  console.log(`Added label ${label} to PR #${number}`);
}

main();
