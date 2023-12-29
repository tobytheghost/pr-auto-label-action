import { ChangedFiles } from "./getChangedFiles";
import { PullRequest } from "./getPullRequest";
import { getSizeLabel } from "./getSizeLabel";

export function getLabelsToAdd(
  pullRequest: PullRequest,
  changedFiles: ChangedFiles
) {
  const sizeLabel = getSizeLabel(pullRequest, changedFiles);
  return [sizeLabel];
}
