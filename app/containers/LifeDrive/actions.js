/*
 *
 * LifeDrive actions
 *
 */

import { DEFAULT_ACTION,MERGE_DATA,MERGE_STATE } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function mergeData() {
  return {
    type: MERGE_DATA,
  };
}
export function mergeState() {
  return {
    type: MERGE_STATE,
  };
}
