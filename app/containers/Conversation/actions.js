/*
 *
 * Conversation actions
 *
 */

// eslint-disable-next-line import/named
import { DEFAULT_ACTION, MERGE_DATA, GET_CONVERSATION, CREATE_CONVERSATION, SEND_MESSAGE } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}

export function getConversation() {
  return {
    type: GET_CONVERSATION,
  };
}

export function createConversation(data) {
  return {
    type: CREATE_CONVERSATION,
    data,
  };
}

export function sendMessage(data) {
  return {
    type: SEND_MESSAGE,
    data,
  };
}
