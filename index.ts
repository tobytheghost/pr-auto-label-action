import { context, getOctokit } from "@actions/github";

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

  console.log(`Getting changed lines for PR #${number}`);
  const linesChanged = getPullRequestChangedLines(pullRequest);
  console.log(`PR #${number} has ${linesChanged} lines changed`);
  const sizeLabel = getPRSize(linesChanged);

  const labels = [sizeLabel];

  await addLabelsToPR({
    octokit,
    owner,
    repo,
    number,
    labels,
  });

  console.log(`Added labels ${labels.join(",")} to PR #${number}`);
}

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

type PullRequest = Awaited<ReturnType<typeof getPullRequest>>;
function getPullRequestChangedLines(pullRequest: PullRequest) {
  return pullRequest.additions + pullRequest.deletions;
}

const SIZES = {
  XS: 50,
  S: 100,
  M: 250,
  L: 500,
  XL: 1000,
};

const LABELS = {
  XS: "size/XS",
  S: "size/S",
  M: "size/M",
  L: "size/L",
  XL: "size/XL",
  XXL: "size/XXL",
};

function getPRSize(linesChanged: number) {
  if (linesChanged <= SIZES.XS) return LABELS.XS;
  if (linesChanged <= SIZES.S) return LABELS.S;
  if (linesChanged <= SIZES.M) return LABELS.M;
  if (linesChanged <= SIZES.L) return LABELS.L;
  if (linesChanged <= SIZES.XL) return LABELS.XL;
  return LABELS.XXL;
}

async function addLabelsToPR({
  octokit,
  owner,
  repo,
  number,
  labels,
}: {
  octokit: ReturnType<typeof getOctokit>;
  owner: string;
  repo: string;
  number: number;
  labels: string[];
}) {
  const response = await octokit.rest.issues.addLabels({
    owner: owner,
    repo: repo,
    issue_number: number,
    labels: labels,
  });

  if (response.status !== 200) throw new Error("Failed to add label to PR");
}

main();
