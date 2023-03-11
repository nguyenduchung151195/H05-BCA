// import { takeLatest, call, put } from 'redux-saga/effects';
// // import { goBack } from 'react-router-redux';
// // import qs from 'qs';
// import { importExcelSuccess, importExcelFalse, importExcelWarning } from './actions';
// import request from '../../utils/request';
// import { IMPORT_EXCEL } from './constants';
// import { API_IMPORT } from '../../config/urlConfig';
// import { changeSnackbar } from '../Dashboard/actions';
// export function* fetchAddDepartment(action) {
//   try {
//     // const departmentId = action.departmentId;
//     // console.log(JSON.parse(action.data));
//     const data = yield call(request, API_IMPORT, {
//       method: 'POST',
//       body: JSON.stringify(action.data),
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (data) {
//       if (data.success) {
//         yield put(importExcelSuccess(data));
//         const arrTr = document.querySelectorAll('.tbl_Value');
//         data.data.forEach((item, index) => {
//           if (item.success) {
//             arrTr[index + 1].remove();
//           }
//         });
//         yield put(changeSnackbar({ status: true, message: 'Import thành công', variant: 'success' }));
//       } else {
//         yield put(importExcelWarning(data));
//         const arrTr = document.querySelectorAll('.tbl_Value');
//         data.data.forEach((item, index) => {
//           if (item.success) {
//             arrTr[index + 1].remove();
//           }
//         });
//         // yield put(impo)
//         yield put(changeSnackbar({ status: true, message: 'Cảnh báo: Import còn thiếu', variant: 'warning' }));
//       }
//     } else {
//       yield put(changeSnackbar({ status: true, message: 'Import thất bại', variant: 'error' }));
//       yield put(importExcelFalse({}));
//     }
//   } catch (err) {
//     yield put(changeSnackbar({ status: true, message: 'Import thất bại', variant: 'error' }));
//     yield put(importExcelFalse(err));
//   }
// }
// // Individual exports for testing
// export default function* importPageSaga() {
//   // See example in containers/HomePage/saga.js
//   yield takeLatest(IMPORT_EXCEL, fetchAddDepartment);
// }


import { takeLatest, call, put } from 'redux-saga/effects';
// import { goBack } from 'react-router-redux';
// import qs from 'qs';
import { importExcelSuccess, importExcelFalse, importExcelWarning, updateImportProccess, mergeData } from './actions';
import request from '../../utils/request';
import { IMPORT_EXCEL } from './constants';
import { API_IMPORT, API_IMPORT_FIELD, API_IMPORT_ALTERNATIVE, API_ORIGANIZATION, API_STOCK, API_SAMPLE_PROCESS } from '../../config/urlConfig';
import * as API from 'config/urlConfig';
import { changeSnackbar } from '../Dashboard/actions';
import { delSpace } from 'utils/common';
import { removeVietnameseTones, convertToSlug } from 'utils/common';
import { clientId } from '../../variable';
import { serialize } from '../../helper';
import lodash from 'lodash';

function* getSpecialOfferSaga() {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API.API_SALE_POLICY_CTUD}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
    if (res) return res.data;
  } catch (error) { }
  return [];
}

function* getConnectiveNameSaga() {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API.API_SALE_POLICY_CTKM}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
    if (res) return res.data;
  } catch (error) { }
  return [];
}

function* getStockSaga() {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API.API_STOCK}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
    if (res) return res.data;
  } catch (error) { }
  return [];
}

function* getCustomer(code) {
  if (!code) return {};
  const query = serialize({ filter: { code } });

  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API.API_CUSTOMERS}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    });
    if (res) return res.data;
  } catch (error) { }
  return [];
}

function* getEmplyee(code) {
  if (!code) return {};
  const query = serialize({ filter: { code } });

  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API.API_USERS}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    });
    if (res) return res.data;
  } catch (error) { }
  return [];
}

function* getApproveGroup(code) {
  if (!code) return {};

  const query = serialize({ filter: { code } });

  const token = localStorage.getItem('token');
  // try {
  //   const res = yield call(request, `${API.API_APPROVE_GROUPS}?${query}`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //     method: 'GET',
  //   });
  //   if (res) return res;
  // } catch (error) { }
  return [];
}

function* addTemplate(template) {
  try {
    const res = yield call(request, API_SAMPLE_PROCESS, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(delSpace(template)),
    });

    return res.data._id;
  } catch (error) {
    // console.log(error);
  }
  return '';
}

function* custom(data) {
  let { modelName, url, arr } = { ...data };
  try {
    switch (modelName) {
      // case 'DynamicForm':
      //   url = API_IMPORT_ALTERNATIVE;
      //   arr = arr.map(e => {
      //     const obj = {
      //       clientId,
      //       formType: 'document',
      //       title: e.title,
      //       title_en: removeVietnameseTones(e.title),
      //       code: e.code,
      //       // categoryDynamicForm: 'ugh',
      //       // content: '<p></p>',
      //       // moduleCode: 'CrmSource',
      //       ...e,
      //     };
      //     delete obj._id;

      //     return obj;
      //   });
      //   break;
      case 'BusinessOpportunities':
        const specialOffers = yield call(getSpecialOfferSaga);
        const connectiveNames = yield call(getConnectiveNameSaga);
        const productNames = yield call(getStockSaga);

        const crmSource = JSON.parse(localStorage.getItem('crmSource'));
        const foundSourceData = (crmSource.find(it => it.code === 'S06') || { data: [] }).data;

        arr = yield arr.map(function* (e) {
          const { name, specialOffer, connectiveName, productName, customerId, source, responsibilityPerson, supervisor } = e;

          const { name: specialOfferStr, _id: specialOffer_id } = specialOffers.find(e => e.code === specialOffer) || {};
          const { name: connectiveNameStr, _id: connectiveName_id } = connectiveNames.find(e => e.code === connectiveName) || {};
          const { name: productNameStr, _id: productName_id } = productNames.find(e => e.code === productName) || {};

          let foundCustomer = yield call(getCustomer, customerId);
          foundCustomer = foundCustomer.length === 1 ? foundCustomer[0] : undefined;
          const customerIdStr = foundCustomer && foundCustomer.name;

          let foundResponsibilityPerson = yield call(getEmplyee, responsibilityPerson);
          foundResponsibilityPerson = foundResponsibilityPerson.length === 1 ? foundResponsibilityPerson[0] : undefined;
          const responsibilityPersonStr = foundResponsibilityPerson && foundResponsibilityPerson.name;

          let foundsupervisor = yield call(getEmplyee, responsibilityPerson);
          foundsupervisor = foundsupervisor.length === 1 ? foundsupervisor[0] : undefined;

          const formatSource = convertToSlug(source);
          const foundSource = foundSourceData.find(item => item.value === formatSource);
          const sourceStr = foundSource ? foundSource.title : '';

          const obj = {
            specialOfferStr,
            connectiveNameStr,
            productNameStr,
            customerIdStr,
            sourceStr,
            responsibilityPersonStr,
            connectiveNameStr_en: removeVietnameseTones(connectiveNameStr),
            customerIdStr_en: removeVietnameseTones(customerIdStr),
            name_en: removeVietnameseTones(name),
            specialOfferStr_en: removeVietnameseTones(specialOfferStr),
            ...e,
            source: formatSource,
            specialOffer: specialOffer_id,
            connectiveName: connectiveName_id,
            productName: productName_id,
            customerId: foundCustomer && foundCustomer._id,
            responsibilityPerson: foundResponsibilityPerson && foundResponsibilityPerson._id,
            supervisor: foundsupervisor && foundsupervisor._id,
          };

          return obj;
        });

        break;
      case 'Task':
        let CutomerCode = arr.map(e => e.customer);
        CutomerCode = lodash.compact(CutomerCode);
        CutomerCode = lodash.uniqBy(CutomerCode);

        let EmployeeCode = arr.map(e => {
          const { join, inCharge, taskManager, viewable, support } = e;
          return [...join, ...inCharge, ...taskManager, ...viewable, ...support];
        });
        EmployeeCode = lodash.flatten(EmployeeCode);
        EmployeeCode = lodash.compact(EmployeeCode);
        EmployeeCode = lodash.uniqBy(EmployeeCode);

        let ApproveCode = arr.map(e => e.approved);
        ApproveCode = lodash.flatten(ApproveCode);
        ApproveCode = lodash.compact(ApproveCode);
        ApproveCode = lodash.uniqBy(ApproveCode);

        const CustomerArr = yield call(getCustomer, CutomerCode);
        const EmployeeArr = yield call(getEmplyee, EmployeeCode);
        const ApproveArr = yield call(getApproveGroup, ApproveCode);

        arr = yield arr.map(function* (e) {
          let { customer, taskManager = '', support = '', viewable = '', inCharge = '', join = '', approved = '', code = '', template = '' } = e;

          customer = CustomerArr.find(e => e.code === customer);
          customer = customer && customer._id;

          taskManager = EmployeeArr.filter(e => taskManager.includes(e.code));
          taskManager = taskManager.map(e => e._id);

          support = EmployeeArr.filter(e => support.includes(e.code));
          support = support.map(e => e._id);

          viewable = EmployeeArr.filter(e => viewable.includes(e.code));
          viewable = viewable.map(e => e._id);

          inCharge = EmployeeArr.filter(e => inCharge.includes(e.code));
          inCharge = inCharge.map(e => e._id);

          join = EmployeeArr.filter(e => join.includes(e.code));
          join = join.map(e => e._id);

          approved = ApproveArr.filter(e => approved.includes(e.code));
          // approved = approved.map(e => e._id)
          const obj = {
            ...e,
            customer,
            taskManager,
            support,
            viewable,
            inCharge,
            join,
            approved,
          };

          return obj;
        });
        break;
      case 'AffiliateProgram':
        arr = yield arr.map(function* (it) {
          const query = it.productName;
          if (query) {
            const filter = serialize({
              filter: {
                code: {
                  $in: it.productName,
                },
              },
            });
            const res = yield call(request, `${API_STOCK}?${filter}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
              },
              method: 'GET',
            });
            const productName = res && res.data && res.data.map(i => i._id);
            return { ...it, productName: productName || [] };
          }
          return it;
        });
        break;
      case 'SpecialOffers':
        arr = yield arr.map(function* (it) {
          const query = it.productName;
          if (query) {
            const filter = serialize({
              filter: {
                code: {
                  $in: query || [],
                },
              },
            });
            const res = yield call(request, `${API_STOCK}?${filter}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
              },
              method: 'GET',
            });
            const productName = res && res.data && res.data.map(i => i._id);
            return { ...it, productName: productName || [] };
          }
          return it;
        });

        break;
      case 'Employee':
        url = `${url}-user`;
        // arr = yield arr.map(function* (it) {
        //   const query = it['organizationUnit'];
        //   if (query) {
        //     const filter = serialize({ filter: { query } });
        //     const data = yield call(request, `${API_ORIGANIZATION}?${filter}`, {
        //       headers: {
        //         Authorization: `Bearer ${localStorage.getItem('token')}`,
        //         'Content-Type': 'application/json'
        //       },
        //       method: 'GET',
        //     });
        //     const organizationUnitId = Array.isArray(data) && data.length > 0 ? data[0] && data[0]._id : '';
        //     const name = Array.isArray(data) && data.length > 0 ? data[0] && data[0]._id : '';

        //     return {
        //       ...it, 'organizationUnit': {
        //         organizationUnitId,
        //         name
        //       }
        //     }
        //   }
        //   return it
        // })
        break;
    }
  } catch (err) {
    // console.log(err);
  }
  return { url, arr };
}

function validateData(arr, modelName) {
  let msgArr = [];
  switch (modelName) {
    case 'Customer':
      msgArr = arr.map(e => {
        let { name, idetityCardNumber } = e;
        let msg = [];
        name = name.replaceAll(' ', '');
        idetityCardNumber = idetityCardNumber ? idetityCardNumber.replaceAll(' ', '') : null;
        if (name === '') msg.push('Thiếu trường name');
        if (idetityCardNumber === '') msg.push('Thiếu trường idetityCardNumber');
        return { success: msg.length === 0, errors: [msg.join('. ')] };
      });
      break;
    case 'Employee':
      msgArr = arr.map(e => {
        let { username } = e;
        let msg = [];
        username = username.replaceAll(' ', '');
        if (username.length < 5 || username.length > 150) msg.push('Username tối thiểu 5 kí tự và tối đa 150 kí tự');
        return { success: msg.length === 0, errors: [msg.join('. ')] };
      });
      break;
  }

  msgArr = msgArr.filter(e => !e.success);
  return { success: msgArr.length === 0, data: msgArr };
}

function removeSuccessItem(data) {
  let myNodeList = document.querySelectorAll('.tbl_Value');
  let arrTr = [];
  for (let i = 0; i < myNodeList.length; i++) {
    const checkbox = myNodeList[i].childNodes[0].querySelector('input[type=checkbox]');
    if (checkbox.checked) arrTr.push(myNodeList[i]);
  }

  data.data.forEach((item, index) => {
    if (!item || item.success) {
      arrTr[index].remove();
    }
  });
}

export function* fetchAddDepartment(action) {
  try {
    const { modelName } = action.data;
    let url = action.data.filterImport === 0 || action.data.filterImport === '' ? API_IMPORT : API_IMPORT_FIELD;
    let arr = [...action.data.data];
    //console.log(url,'kkkk')

    const customData = yield call(custom, { modelName, url, arr });
    url = customData.url;
    arr = customData.arr;
    const validate = validateData(arr, modelName);
    if (!validate.success) {
      yield put(changeSnackbar({ status: true, message: 'Cảnh báo: Tải lên còn thiếu', variant: 'warning' }));
      yield put(importExcelWarning(validate));
      return;
    }

    const limit = 20;
    let data = { success: true, data: [] };
    // const countReport = Math.ceil(arr.length / limit);

    if (modelName === 'Employee') {
      action.data.filterUpdate = 'code';
    }

    yield put(
      updateImportProccess({
        importCount: 0,
        importedCount: arr.length,
      }),
    );

    for (let i = 0; i < arr.length; i += limit) {
      const newData = { ...action.data, data: arr.slice(i, i + limit) };

      let dta = yield call(request, url, {
        method: 'POST',
        body: JSON.stringify(delSpace(newData)),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      data.success = data.success && (!dta || dta.success);
      data.data = data.data.concat(dta.data);

      yield put(
        updateImportProccess({
          importCount: i + limit > arr.length ? arr.length : i + limit,
          importedCount: arr.length,
        }),
      );
    }

    if (data) {
      if (data.success) {
        // for(let i =0; i< data.length; i++){
        //   if(data.data[0].data.username.length < 5 || data.data[0].data.username.length > 150){
        //     yield put(importExcelWarning(data[i]));
        //     removeSuccessItem(data[i])
        //     yield put(changeSnackbar({ status: true, message: 'Username tối thiểu 5 kí tự, tối đa 150 kí tự', variant: 'warning' }));
        //   }else{
        yield put(importExcelSuccess(data));
        removeSuccessItem(data);
        yield put(changeSnackbar({ status: true, message: 'Tải lên thành công', variant: 'success' }));
        // }
        // }
      } else {
        //console.log(2222,data.message)
        if (data.message) {
          const err = {
            data: [
              {
                errors: [data.message],
                success: false,
              },
            ],
            success: false,
          };
          yield put(importExcelWarning(err));
          yield put(changeSnackbar({ status: true, message: 'Tải lên thất bại', variant: 'error' }));
        } else {
          // console.log(3333,data)
          yield put(importExcelWarning(data));
          removeSuccessItem(data);

          if (data.data.find(e => e.invalidPhoneNumber)) {
            yield put(mergeData({ flagDialog: true }));
          }
          else yield put(changeSnackbar({ status: true, message: 'Cảnh báo: Tải lên còn thiếu', variant: 'warning' }));
        }
      }
    } else {
      //console.log(4444,data)
      yield put(changeSnackbar({ status: true, message: 'Tải lên thất bại', variant: 'error' }));
      yield put(importExcelFalse({}));
    }
  } catch (err) {
    // console.log(5555,data)
    yield put(changeSnackbar({ status: true, message: 'Tải lên thất bại', variant: 'error' }));
    yield put(importExcelFalse(err));
  }
}
// Individual exports for testing
export default function* importPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(IMPORT_EXCEL, fetchAddDepartment);
}
