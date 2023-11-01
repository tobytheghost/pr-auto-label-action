import { type PullRequest } from "../../queries/getPullRequest";
import { LABELS } from "../../config";
import { ChangedFiles } from "../../queries/getChanges";

const SIZES = {
  XS: 50,
  S: 100,
  M: 250,
  L: 500,
  XL: 1000,
} as const;

function getSizeLabelByLinesChanged(linesChanged: number) {
  if (linesChanged <= SIZES.XS) return LABELS.SIZE_XS;
  if (linesChanged <= SIZES.S) return LABELS.SIZE_S;
  if (linesChanged <= SIZES.M) return LABELS.SIZE_M;
  if (linesChanged <= SIZES.L) return LABELS.SIZE_L;
  if (linesChanged <= SIZES.XL) return LABELS.SIZE_XL;
  return LABELS.SIZE_XXL;
}

function getChangedLines(changedFiles: ChangedFiles) {
  return changedFiles.reduce((acc, { additions, deletions }) => acc + additions + deletions, 0);
}
  

function getSizeLabel(pullRequest: PullRequest, changedFiles: ChangedFiles) {
  console.log(`Getting changed lines for PR #${pullRequest.number}`);
  const linesChanged = getChangedLines(changedFiles);
  console.log(`Changed lines for PR #${pullRequest.number}: ${linesChanged}`);
  return getSizeLabelByLinesChanged(linesChanged);
}

export default getSizeLabel;
