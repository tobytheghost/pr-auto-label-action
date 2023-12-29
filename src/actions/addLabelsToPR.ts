import { type getOctokit } from "@actions/github";

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
  if (!labels.length) return console.log("No labels to add");

  const response = await octokit.rest.issues.addLabels({
    owner: owner,
    repo: repo,
    issue_number: number,
    labels: labels,
  });

  if (response.status !== 200) throw new Error("Failed to add label to PR");

  console.log(`Added labels [${labels.join(",")}] to PR #${number}`);
}

export default addLabelsToPR;
