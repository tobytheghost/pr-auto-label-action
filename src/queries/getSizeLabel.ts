import { LABELS } from "../config";
import { type ChangedFiles } from "./getChangedFiles";
import { type PullRequest } from "./getPullRequest";

export function getSizeLabel(
  pullRequest: PullRequest,
  changedFiles: ChangedFiles
) {
  console.log(`Getting changed lines for PR #${pullRequest.number}`);

  const linesChanged = changedFiles.reduce((acc, file) => {
    return acc + file.additions + file.deletions;
  }, 0);

  console.log(`Changed lines for PR #${pullRequest.number}: ${linesChanged}`);

  const SIZES = {
    XS: 50,
    S: 100,
    M: 250,
    L: 500,
    XL: 1000,
  } as const;

  if (linesChanged <= SIZES.XS) return LABELS.SIZE_XS;
  if (linesChanged <= SIZES.S) return LABELS.SIZE_S;
  if (linesChanged <= SIZES.M) return LABELS.SIZE_M;
  if (linesChanged <= SIZES.L) return LABELS.SIZE_L;
  if (linesChanged <= SIZES.XL) return LABELS.SIZE_XL;
  return LABELS.SIZE_XXL;
}
