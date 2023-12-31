import { type getOctokit } from "@actions/github";

export async function removeLabelsFromPR({
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
  if (!labels.length) return console.log("No labels to remove");
  const response = await Promise.allSettled(
    labels.map((label) => {
      return octokit.rest.issues.removeLabel({
        owner: owner,
        repo: repo,
        issue_number: number,
        name: label,
      });
    })
  );

  response
    .filter((r) => r.status !== "fulfilled")
    .forEach((r) => {
      console.log(r);
      throw new Error("Failed to remove label from PR");
    });

  console.log(`Remove labels [${labels.join(",")}] from PR #${number}`);
}
