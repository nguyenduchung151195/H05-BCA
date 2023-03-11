/*
 *
 * Recall actions
 *
 */

import {MERGE_DATA,
} from './constants';

export function mergeData(data) {
    return {
      type: MERGE_DATA,
      data
    }
  }