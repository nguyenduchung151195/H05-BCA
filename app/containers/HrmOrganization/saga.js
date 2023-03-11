import request from 'utils/request';
import { take, call, put, select, all, takeLatest } from 'redux-saga/effects';
import { GET_ALL_HRM_CHART } from './constants';
import {
  getAllHrmChartSuccess,
  getAllHrmChartFailure
} from './actions'
import { API_PERSONNEL, API_ORIGANIZATION } from '../../config/urlConfig';

export function* getAllHrmChartSaga(action) {
  const token = localStorage.getItem("token");
  try {
    const responses = yield all([
      call(request, `${API_PERSONNEL}`, {
        headers: {
          Authoraztion: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        method: 'GET'
      }),
      call(request, `${API_ORIGANIZATION}?shape=array`, {
        headers: {
          Authoraztion: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        method: 'GET'
      }),
    ]);
    const [hrmData, orgData] = responses;
    const result = orgData.map(o => ({ ...o, Id: o._id, ReportingPerson: o.parent, Name: o.name, Designation: o.code }));
    const validHrm = hrmData.data.filter(hrm => {
      if (hrm.organizationUnit && hrm.organizationUnit._id) {
        if (orgData.find(o => o._id === hrm.organizationUnit._id)) {
          return true;
        }
      }
      return false;
    }).map(hrm => ({ ...hrm, Id: hrm._id, ReportingPerson: hrm.organizationUnit._id, Name: hrm.name, Designation: hrm.position ? hrm.position.title : "", ImageUrl: hrm.avatar }));
    const hrmOrgTreeData = [...result, ...validHrm];
    yield put(getAllHrmChartSuccess(hrmOrgTreeData));
  } catch (error) {
    //console.log('error', error);
    yield put(getAllHrmChartFailure(error));
  }
}

// Individual exports for testing
export default function* hrmOrganizationSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_ALL_HRM_CHART, getAllHrmChartSaga);
}
