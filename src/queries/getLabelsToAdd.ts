import { LABELS } from "../config";
import { ChangedFiles } from "./getChanges";
import { PullRequest } from "./getPullRequest";

const SIZES = {
  XS: 50,
  S: 100,
  M: 250,
  L: 500,
  XL: 1000,
} as const;

export function getSizeLabel(
  pullRequest: PullRequest,
  changedFiles: ChangedFiles
) {
  console.log(`Getting changed lines for PR #${pullRequest.number}`);

  const linesChanged = changedFiles.reduce((acc, file) => {
    return acc + file.additions + file.deletions;
  }, 0);

  console.log(`Changed lines for PR #${pullRequest.number}: ${linesChanged}`);

  if (linesChanged <= SIZES.XS) return LABELS.SIZE_XS;
  if (linesChanged <= SIZES.S) return LABELS.SIZE_S;
  if (linesChanged <= SIZES.M) return LABELS.SIZE_M;
  if (linesChanged <= SIZES.L) return LABELS.SIZE_L;
  if (linesChanged <= SIZES.XL) return LABELS.SIZE_XL;
  return LABELS.SIZE_XXL;
}

export function getLabelsToAdd(
  pullRequest: PullRequest,
  changedFiles: ChangedFiles
) {
  const sizeLabel = getSizeLabel(pullRequest, changedFiles);
  return [sizeLabel];
}
