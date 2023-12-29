import { LABEL_LIST } from "../config";
import { PullRequest } from "./getPullRequest";

export function getExistingLabels(pullRequest: PullRequest) {
  const labelsFromPR = pullRequest.labels.map((label) => label.name);
  return labelsFromPR.filter((label) => LABEL_LIST.includes(label));
}
