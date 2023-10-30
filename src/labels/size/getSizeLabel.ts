import { type PullRequest } from "../../queries/getPullRequest";
import { LABELS } from "../../config";

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

function getPullRequestChangedLines(pullRequest: PullRequest) {
	return pullRequest.additions + pullRequest.deletions;
}
  

function getSizeLabel(pullRequest: PullRequest) {
  console.log(`Getting changed lines for PR #${pullRequest.number}`);
  const linesChanged = getPullRequestChangedLines(pullRequest);
  console.log(`Changed lines for PR #${pullRequest.number}: ${linesChanged}`);
  return getSizeLabelByLinesChanged(linesChanged);
}

export default getSizeLabel;
