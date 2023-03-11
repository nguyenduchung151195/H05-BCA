/* eslint-disable import/named */
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { API_USERS, API_CONVERSATION } from '../../config/urlConfig';
import request from '../../utils/request';
import { GET_CONVERSATION, CREATE_CONVERSATION } from './constants';
import { mergeData, getConversation } from './actions';
import conversationSl from './selectors';
import { serialize } from '../../helper';
// import { compareArr } from '../../helper';

export function* getConversationSaga() {
  try {
    // const onlineFilter = { online: true };
    // const queryOnline = serialize({ filter: onlineFilter });
    const employees = yield call(request, `${API_USERS}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const filter = { type: 1 };
    const query = serialize({ filter });
    const conversationGroup = yield call(request, `${API_CONVERSATION}?${query}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    yield put(mergeData({
      employees: employees.data.sort((a, b) => {
        if (a.online && !b.online) return -1;
        if (!a.online && b.online) return 1;
        return 0;
      }), conversationGroup: conversationGroup.data
    }));
  } catch (err) {
    // eslint-disable-next-line no-console
    //console.log(err);
  }
}

export function* createConversationSaga(action) {
  try {
    const data = yield call(request, API_CONVERSATION, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });

    const cvs = yield select(conversationSl());
    const conversations = [...cvs.conversations];
    const index = conversations.findIndex(item => item._id === data.data._id);

    if (index === -1) {
      const conversation = data.data;
      if (data.data.type === 0) {
        conversation.name = action.data.name;
        conversation.friendId = action.data.friendId;
      }

      conversations.push(conversation);
      yield put(mergeData({ conversations }));
      yield put(getConversation());
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    //console.log(err);
  }
}

// export function* sendMessageSaga(action) {
//   try {
//     const conversation = yield call(request,  `${API_CONVERSATION}/${conversation.data._id}`, {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('token')}`,

//         'Content-type': 'application/json',
//       },
//       body: JSON.stringify(action.data),
//     });

//     const messages = yield call(request, `${API_CONVERSATION}/message/${conversation.data._id}`);
//     const cvs = yield select(conversationSl());
//     const conversations = [...cvs.conversations];
//     const index = conversations.findIndex(item => compareArr(item.join, conversation.data.join));

//     if (index !== -1) {
//       conversations[index] = conversation.data;
//       if (!conversations[index].name) conversations[index].name = action.data.name;
//       conversations[index].messages = messages.data;
//       yield put(mergeData({ conversations }));
//     }
//   } catch (err) {
//     // eslint-disable-next-line no-console
//     console.log(err);
//   }
// }

// Individual exports for testing
export default function* conversationSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_CONVERSATION, getConversationSaga);
  yield takeLatest(CREATE_CONVERSATION, createConversationSaga);
}
