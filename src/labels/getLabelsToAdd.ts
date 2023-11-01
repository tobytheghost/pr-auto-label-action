import { type ChangedFiles } from "../queries/getChanges";
import { type PullRequest } from "../queries/getPullRequest";
import getSizeLabel from "./size/getSizeLabel";

export function getLabelsToAdd(pullRequest: PullRequest, changedFiles: ChangedFiles) {
  const sizeLabel = getSizeLabel(pullRequest, changedFiles);
  return [sizeLabel];
}
