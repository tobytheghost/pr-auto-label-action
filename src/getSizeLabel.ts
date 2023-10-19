import { type PullRequest } from "./getPullRequest";

const SIZES = {
  XS: 50,
  S: 100,
  M: 250,
  L: 500,
  XL: 1000,
} as const;

const LABELS = {
  XS: "size/XS",
  S: "size/S",
  M: "size/M",
  L: "size/L",
  XL: "size/XL",
  XXL: "size/XXL",
} as const;

function getSizeLabelByLinesChanged(linesChanged: number) {
  if (linesChanged <= SIZES.XS) return LABELS.XS;
  if (linesChanged <= SIZES.S) return LABELS.S;
  if (linesChanged <= SIZES.M) return LABELS.M;
  if (linesChanged <= SIZES.L) return LABELS.L;
  if (linesChanged <= SIZES.XL) return LABELS.XL;
  return LABELS.XXL;
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
