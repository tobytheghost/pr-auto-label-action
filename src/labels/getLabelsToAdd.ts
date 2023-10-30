import { PullRequest } from "../queries/getPullRequest";
import getSizeLabel from "./size/getSizeLabel";

export function getLabelsToAdd(pullRequest: PullRequest) {
  const sizeLabel = getSizeLabel(pullRequest);
  return [sizeLabel];
}
