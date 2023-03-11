import React, { useCallback, useMemo, useEffect, useState } from 'react';
import {
  API_INCOMMING_DOCUMENT,
  API_DOCUMENT_PROCESS_TEMPLATE,
  API_INCOMMING_DOCUMENT_LOOKUP_STATISTICS,
  API_ORIGANIZATION,
} from '../../config/urlConfig';
import { Add } from '@material-ui/icons';
import { Grid, Tooltip } from '@material-ui/core';
import ListPage from '../List';
import ListPageClone from '../List/indexClone';
import { AsyncAutocomplete, Dialog } from 'components/LifetekUi';
import FilterDocs from './components/FilterDocs';
import { changeSnackbar } from 'containers/Dashboard/actions';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import { fetchData, flatChild } from '../../helper';

function WrapperListPage(props) {
  const {
    tab = 0,
    rootTab = '',
    reloadPage,
    profile,
    mapFunction,
    openTitleDialog,
    handleSelectedDoc,
    handle,
    roles,
    handleSetCurrentRole,
    handleSetProcessed,
    getStateSelection,
    kanbanFilter,
    OpenExecutiveDocumenDialog,
    businessRoleSelect,
    // tab 1
    templates,
    typePage = '',
    reload,
    handleSetSelectProcess,
    history,
    callBack,
    lands,
    selectedProcess,
    resetSelect,
    openTitleDialogCustom,
    checkListDocument,
    setCanView,
    roleDepartment,
    isAuthory = false,
    permissionOutLineDoc = false,
    setReloadPage,
    profileAuthority,
  } = props;

  const [openDialog, setOpenDialog] = useState(false);
  const [filterDocs, setFilterDocs] = useState();
  const [listDer, setListDer] = useState([]);
  const [checkRecallDocs, setCheckRecallDocs] = useState(false);
  const [canDeadlineIncrease, setCanDeadlineIncrease] = useState(false);
  const [openSearch, setOpenSearch] = useState(true);
  const [noRecall, setNoRecall] = useState(false);

  const nameCallBack = 'receive';
  const customContent = [
    {
      title: 'Số đến',
      fieldName: 'toBookCode',
      type: 'string',
    },
    {
      title: 'Số VB',
      fieldName: 'toBook',
      type: 'string',
    },
    {
      title: 'Trích yếu',
      fieldName: 'abstractNote',
      type: 'string',
    },
  ];
  const contentKanbanTemplate = [
    {
      title: 'Số đến',
      fieldName: 'toBookCode',
      type: 'string',
    },
    {
      title: 'Số VB',
      fieldName: 'toBook',
      type: 'string',
    },
    {
      title: 'Trích yếu',
      fieldName: 'abstractNote',
      type: 'string',
    },
  ];

  let url1 = typePage !== '' ? `${API_INCOMMING_DOCUMENT}?authority=true` : API_INCOMMING_DOCUMENT;
  let url2 = typePage !== '' ? `${API_INCOMMING_DOCUMENT}/processors?authority=true` : `${API_INCOMMING_DOCUMENT}/processors`;
  let url3 = typePage !== '' ? `${API_INCOMMING_DOCUMENT}/supporters?authority=true` : `${API_INCOMMING_DOCUMENT}/supporters`;
  let url4 = typePage !== '' ? `${API_INCOMMING_DOCUMENT}/viewers?authority=true` : `${API_INCOMMING_DOCUMENT}/viewers`;
  let url5 = typePage !== '' ? `${API_INCOMMING_DOCUMENT}/commanders?authority=true` : `${API_INCOMMING_DOCUMENT}/commanders`;
  // error can here
  let urlSelect = typePage !== '' ? `${API_DOCUMENT_PROCESS_TEMPLATE}?authority=true` : API_DOCUMENT_PROCESS_TEMPLATE;

  // const getAction = (rootTab) => {
  //     if (rootTab === 'receive') {
  //         return [{ action: 'comment' }]
  //     }
  //     return []
  // };
  useEffect(
    () => {
      let role;
      if (rootTab === 'processors') {
        role = roleDepartment.find(element => element.name === 'processing');
      } else if (rootTab === 'supporters') {
        role = roleDepartment.find(element => element.name === 'support');
      } else if (rootTab === 'viewers') {
        role = roleDepartment.find(element => element.name === 'view');
      } else if (rootTab === 'commander') {
        role = roleDepartment.find(element => element.name === 'command');
      } else if (rootTab === 'receive') {
        role = roleDepartment.find(element => element.name === 'receive');
      } else if (rootTab === 'feedback') {
        role = roleDepartment.find(element => element.name === 'feedback');
      }
      if (rootTab === 'processors') {
        const roleFound = roleDepartment.find(element => element.name === 'processing');
        setCanDeadlineIncrease(roleFound && roleFound.data && roleFound.data.deadlineIncrease ? roleFound.data.deadlineIncrease : false);
        setCheckRecallDocs(roleFound && roleFound.data && roleFound.data.recallDocs ? roleFound.data.recallDocs : false);
      } else if (rootTab === 'commander') {
        const roleFound = roleDepartment.find(element => element.name === 'command');
        console.log(roleFound, "roleFound", roleDepartment)
        setCanDeadlineIncrease(roleFound && roleFound.data && roleFound.data.deadlineIncrease ? roleFound.data.deadlineIncrease : false);
        setCheckRecallDocs(roleFound && roleFound.data && roleFound.data.recallDocs ? roleFound.data.recallDocs : false);
      } else if (rootTab === 'receive') {
        setCanDeadlineIncrease(false);
        const roleFound = roleDepartment.find(element => element.name === 'receive');
        setCheckRecallDocs(roleFound && roleFound.data && roleFound.data.recallDocs ? roleFound.data.recallDocs : false);

      } else {
        setCanDeadlineIncrease(false);
        setCheckRecallDocs(false);
      }
      if (noRecall) {
        setCheckRecallDocs(false);
      }
      // else {
      //   setCheckRecallDocs(role && role.data && role.data.recallDocs ? role.data.recallDocs : false);
      // }
    },
    [rootTab, tab, roleDepartment, noRecall],
  );
  const handleRefactor = (val, rootTab) => {
    const docIds = Array.isArray(val) ? val.map(v => v._id) : [];
    switch (rootTab) {
      case 'receive':
      case 'feedback':
      case 'viewers':
      case 'commander':
        handleSelectedDoc(docIds, val);
        handle && handle(docIds, val);
        if (docIds.length) {
          val && handleSetCurrentRole(val[0].nextRole);
        }
        break;
      case 'processors':
        let processedsSelected = [];
        handleSelectedDoc(docIds, val);
        handle && handle(docIds, val);
        Array.isArray(val) ? val.map(v => v.originItem && processedsSelected.push(v.originItem.processeds)) : [];
        if (processedsSelected.length > 0) {
          processedsSelected = processedsSelected.reduce((arrayTotal, el) => arrayTotal.concat(el), []);
          handleSetProcessed(processedsSelected);
        }
        if (docIds.length) {
          val && handleSetCurrentRole(val[0].nextRole);
        }
        break;
      case 'supporters':
        if (docIds.length) {
          val && handleSetCurrentRole(val[0].nextRole);
        }
        handleSelectedDoc(docIds, val);
        handle && handle(docIds, val);
        break;
    }
  };

  // const handleGetApiByRootTab = (rootTab) => {
  //     switch (rootTab) {
  //         case 'receive':
  //         case 'feedback':
  //             return API_INCOMMING_DOCUMENT
  //         case 'processors':
  //         case 'supporters':
  //         case 'viewers':
  //             return `${API_INCOMMING_DOCUMENT}/${rootTab}`
  //         case 'commander':
  //             return `${API_INCOMMING_DOCUMENT}/${rootTab}s`
  //     }
  // }

  // const getFilterByRootTab = (rootTab) => {
  //     if (typePage === 'authority') {
  //         switch (rootTab) {
  //             case 'receive':
  //                 return { stage: 'receive' };
  //             case 'feedback':
  //                 return { commanders: { $in: [profile._id] } }
  //             case 'supporters':
  //                 return { stage: 'processing' }
  //             case 'processors':
  //             case 'viewers':
  //             case 'commander':
  //                 return { authority: true }
  //         }
  //     }

  //     switch (rootTab) {
  //         case 'receive':
  //             return { stage: 'receive' };
  //         case 'feedback':
  //             return { commanders: { $in: [profile._id] } }
  //         case 'supporters':
  //             return { stage: 'processing' }
  //         case 'processors':
  //         case 'viewers':
  //         case 'commander':
  //             return {status: 1}
  //     }
  // }

  // const handleGetFilterFeedBack = (rootTab) => {
  //     switch (rootTab) {
  //         case 'receive':
  //             return { stage: { $ne: 'receive' } };
  //         case 'feedback':
  //             return { commandered: { $in: [profile._id] } }
  //         case 'supporters':
  //             return { stage: 'processing', supporters: { $in: [profile._id] } }
  //         case 'processors':
  //             return { stage: 'processing', processeds: { $in: [profile._id] } }
  //         case 'viewers':
  //             return { stage: { $ne: 'receive' }, vieweds: { $in: [profile._id] } }
  //         case 'commander':
  //             return { stage: 'processing', commandeds: { $in: [profile._id] } }
  //     }
  // }
  // const checkMultiple = (rootTab) => {
  //     switch (rootTab) {
  //         case 'receive':
  //         case 'viewers':
  //         case 'feedback':
  //         case 'commander':
  //             return true;
  //         case 'supporters':
  //         case 'processors':
  //             return false
  //     }
  // }
  // const getKanban = (rootTab) => {
  //     switch (rootTab) {
  //         case 'receive':
  //         case 'supporters':
  //         case 'viewers':
  //         case 'commander':
  //         case 'feedback':
  //             return 'ST21';
  //         case 'processors':
  //             return 'ST24';
  //     }
  // }

  const addExecutiveDocument = () => {
    if (rootTab === 'receive') {
      return (
        <Tooltip title="Tiếp nhận" onClick={OpenExecutiveDocumenDialog}>
          <Add style={{ color: 'white' }} />
        </Tooltip>
      );
    } else {
      return null;
    }
  };
  const filter1 = useMemo(
    () => {
      return {
        stage: 'receive',
        receiverUnit: profile && profile.organizationUnit && profile.organizationUnit.organizationUnitId,
        checkRole: true,
      };
    },
    [profile],
  );
  useEffect(() => {
    fetchData(API_ORIGANIZATION).then(res => {
      const flattedDepartment = flatChild(res);
      setListDer(flattedDepartment);
    });
  }, []);
  const customFC = item => {
    // const result = listDer.filter(x => recipientId.includes(x.title));
    let listDerr = [];
    let data = [];
    let minLevel = 99999;
    listDer &&
      Array.isArray(listDer) &&
      listDer.length > 0 &&
      listDer.map(el => {
        item.map(ell => {
          if (el._id && ell._id && el._id === ell._id) {
            if (ell.level < minLevel) minLevel = ell.level;
            data.push(ell);
          }
        });
      });
    data = data.map((el, idx) => {
      return {
        ...el,
        level: el.level - minLevel || 0,
        stt: idx + 1,
      };
    });
    return data.length && data.length > 0 ? data : item;
  };
  return (
    <div>
      {console.log(tab, rootTab, 'rootTab')}
      {tab === 0 && (
        <>
          {rootTab === 'receive' && (
            <ListPage
              filterStartEnd="documentDate"
              withPagination
              showDepartmentAndEmployeeFilter
              exportExcel
              roles={roles}
              getStateSelection={e => getStateSelection(e)}
              settingBar={[addExecutiveDocument()]}
              disableAdd
              filter={filter1}
              onSelectCustomers={val => {
                handleRefactor(val, rootTab);
              }}
              onRowClick={item => {
                openTitleDialog(item._id, 'viewReceive', tab);
              }}
              history={props.history}
              reload={reloadPage}
              disableEmployee
              noKanban
              mapFunction={mapFunction}
              clickToView
              code="IncommingDocument"
              employeeFilterKey="createdBy"
              apiUrl={url1}
              kanban="ST21"
              listMenus={[]}
              kanbanKey="type"
              rootTab={rootTab}
              height={'calc(100vh - 350px)'}
              setCanView={setCanView}
              checkRecallDocs={false}
              isAuthory={isAuthory}
              setReloadPage={setReloadPage}
              sorting={[{ columnName: 'urgencyLevel', direction: 'asc' }]}
            />
          )}
          {rootTab === 'processors' && ((profile.type && profile.type.includes('outlineDoc')) || permissionOutLineDoc) ? (
            <ListPage
              filterStartEnd="documentDate"
              withPagination
              showDepartmentAndEmployeeFilter
              disableAdd
              notDelete
              roles={roles}
              history={props.history}
              disableImport
              noKanban
              disableOneEdit
              exportExcel
              getStateSelection={e => getStateSelection(e)}
              selectMultiple={false}
              onSelectCustomers={val => {
                handleRefactor(val, rootTab);
              }}
              // handleCheckRecall={(noRecall)=>{
              // }}
              filter={checkListDocument ? { typeDoc: 'preliminaryDoc' } : { typeDoc: 'roomDoc' }}
              disableEmployee
              mapFunction={mapFunction}
              code="IncommingDocument"
              employeeFilterKey="createdBy"
              apiUrl={url2}
              kanban="ST24"
              kanbanKey="type"
              onRowClick={item => {
                // openTitleDialog(item._id, 'processors', tab);
                openTitleDialog(item._id, 'processors', tab, checkListDocument);
              }}
              pointerCursor="pointer"
              reload={reloadPage}
              rootTab={rootTab}
              // listMenus={['setProcessor', 'changeDeadline', 'createTask', 'createSigner', 'createOutGoingDoc'].filter(i => {
              listMenus={['changeDeadline', 'createTask', 'createSigner', 'createOutGoingDoc'].filter(i => {
                if (i === 'setProcessor') {
                  if (businessRoleSelect && businessRoleSelect.add_more_process === true && rootTab === 'processors') {
                    return true;
                  }
                  return false;
                }
                if (i === 'changeDeadline') {
                  if (canDeadlineIncrease) {
                    return true;
                  }
                  return false;
                }
                return true;
              })}
              height={'calc(100vh - 350px)'}
              setCanView={setCanView}
              // checkRecallDocs={checkRecallDocs}
              isAuthory={isAuthory}
              setReloadPage={setReloadPage}
              sorting={[{ columnName: 'urgencyLevel', direction: 'asc' }]}
            />
          ) : rootTab === 'processors' && ((profile.type && !profile.type.includes('outlineDoc')) || !profile.type) ? (
            <ListPage
              filterStartEnd="documentDate"
              withPagination
              showDepartmentAndEmployeeFilter
              disableAdd
              notDelete
              roles={roles}
              history={props.history}
              disableImport
              noKanban
              disableOneEdit
              exportExcel
              getStateSelection={e => getStateSelection(e)}
              selectMultiple={false}
              onSelectCustomers={val => {
                handleRefactor(val, rootTab);
              }}
              disableEmployee
              mapFunction={mapFunction}
              code="IncommingDocument"
              employeeFilterKey="createdBy"
              apiUrl={url2}
              kanban="ST24"
              kanbanKey="type"
              onRowClick={item => {
                // openTitleDialog(item._id, 'processors', tab);
                openTitleDialog(item._id, 'processors', tab, checkListDocument);
              }}
              pointerCursor="pointer"
              reload={reloadPage}
              rootTab={rootTab}
              // listMenus={['setProcessor', 'changeDeadline', 'createTask', 'createSigner', 'createOutGoingDoc'].filter(i => {
              listMenus={['changeDeadline', 'createTask', 'createSigner', 'createOutGoingDoc'].filter(i => {
                if (i === 'setProcessor') {
                  if (businessRoleSelect && businessRoleSelect.add_more_process === true && rootTab === 'processors') {
                    return true;
                  }
                  return false;
                }
                if (i === 'changeDeadline') {
                  if (canDeadlineIncrease) {
                    return true;
                  }
                  return false;
                }
                return true;
              })}
              height={'calc(100vh - 350px)'}
              setCanView={setCanView}
              // checkRecallDocs={checkRecallDocs}
              isAuthory={isAuthory}
              setReloadPage={setReloadPage}
              sorting={[{ columnName: 'urgencyLevel', direction: 'asc' }]}
            />
          ) : null}
          {rootTab === 'supporters' && (
            <ListPage
              filterStartEnd="documentDate"
              withPagination
              roles={roles}
              showDepartmentAndEmployeeFilter
              exportExcel
              notDelete
              history={props.history}
              disableImport
              noKanban
              getStateSelection={e => getStateSelection(e)}
              mapFunction={mapFunction}
              disableEmployee
              selectMultiple={false}
              disableOneEdit
              disableAdd
              onSelectCustomers={val => {
                handleRefactor(val, rootTab);
              }}
              onRowClick={item => {
                openTitleDialog(item._id, 'supporters', tab);
              }}
              filter={{ stage: 'processing' }}
              pointerCursor="pointer"
              code="IncommingDocument"
              employeeFilterKey="createdBy"
              apiUrl={url3}
              kanban="ST21"
              kanbanKey="type"
              reload={reloadPage}
              rootTab={rootTab}
              listMenus={[]}
              height={'calc(100vh - 350px)'}
              setCanView={setCanView}
              // checkRecallDocs={checkRecallDocs}
              checkRecallDocs={false}
              isAuthory={isAuthory}
              setReloadPage={setReloadPage}
              sorting={[{ columnName: 'urgencyLevel', direction: 'asc' }]}
            />
          )}
          {/* nhận để biết văn bản đến */}

          {rootTab === 'viewers' && (
            <ListPage
              filterStartEnd="documentDate"
              withPagination
              notDelete
              roles={roles}
              getStateSelection={e => getStateSelection(e)}
              disableImport
              noKanban
              mapFunction={mapFunction}
              showDepartmentAndEmployeeFilter
              exportExcel
              disableEmployee
              history={props.history}
              disableOneEdit
              disableAdd
              enableView
              selectMultiple={true}
              onSelectCustomers={val => {
                handleRefactor(val, rootTab);
              }}
              onRowClick={item => {
                // openTitleDialog(item._id, 'viewers', tab);
                // props.history.push(`/RecallDocument/${item._id}?role=viewers&tab=${tab}`);
                const { profileAuthority } = props
                {
                  console.log(profileAuthority, "profileAuthority")
                }
                if (profileAuthority && profileAuthority._id) {
                  props.history.push(`/RecallDocument/${item._id}?role=viewers&tab=${tab}&isAuthory=true`);
                } else {
                  props.history.push(`/RecallDocument/${item._id}?role=viewers&tab=${tab}`);
                }
              }}
              pointerCursor="pointer"
              code="IncommingDocument"
              createdDraft={false}
              employeeFilterKey="createdBy"
              apiUrl={url4}
              kanban="ST21"
              kanbanKey="type"
              reload={reloadPage}
              rootTab={rootTab}
              listMenus={[]}
              height={'calc(100vh - 350px)'}
              setCanView={setCanView}
              // checkRecallDocs={checkRecallDocs}
              checkRecallDocs={false}
              isAuthory={isAuthory}
              setReloadPage={setReloadPage}
              sorting={[{ columnName: 'urgencyLevel', direction: 'asc' }]}
            />
          )}
          {rootTab === 'commander' && (
            <ListPage
              filterStartEnd="documentDate"
              withPagination
              disableImport
              notDelete
              noKanban
              roles={roles}
              getStateSelection={e => getStateSelection(e)}
              mapFunction={mapFunction}
              showDepartmentAndEmployeeFilter
              exportExcel
              disableOneEdit
              disableAdd
              history={props.history}
              selectMultiple={false}
              onSelectCustomers={val => {
                handleRefactor(val, rootTab);
              }}
              onRowClick={item => {
                openTitleDialog(item._id, 'commander', tab);
              }}
              pointerCursor="pointer"
              disableEmployee
              code="IncommingDocument"
              employeeFilterKey="createdBy"
              apiUrl={url5}
              kanban="ST21"
              kanbanKey="type"
              reload={reloadPage}
              rootTab={rootTab}
              // listMenus={['createTask']}
              listMenus={['changeDeadline', 'createTask'].filter(i => {
                if (i === 'changeDeadline') {
                  if (canDeadlineIncrease) {
                    return true;
                  }
                  return false;
                }
                return true;
              })}
              height={'calc(100vh - 350px)'}
              setCanView={setCanView}
              // checkRecallDocs={checkRecallDocs}
              isAuthory={isAuthory}
              setReloadPage={setReloadPage}
              sorting={[{ columnName: 'urgencyLevel', direction: 'asc' }]}
            />
          )}
          {/* ý kiến văn bản đến  */}
          {rootTab === 'feedback' && (
            <ListPage
              filterStartEnd="documentDate"
              withPagination
              notDelete
              noKanban
              showDepartmentAndEmployeeFilter
              exportExcel
              roles={roles}
              history={props.history}
              disableImport
              getStateSelection={e => getStateSelection(e)}
              disableAdd
              filter={{ commanders: { $in: [profile._id] } }}
              onSelectCustomers={val => {
                handleRefactor(val, rootTab);
              }}
              reload={reloadPage}
              disableEmployee
              mapFunction={mapFunction}
              code="IncommingDocument"
              employeeFilterKey="createdBy"
              apiUrl={url1}
              kanban="ST21"
              listMenus={[]}
              kanbanKey="type"
              rootTab={rootTab}
              onRowClick={item => {
                // openTitleDialog(item._id, 'feedback', tab);
                props.history.push({
                  pathname: `incomming-document-detail/${item._id}?role=feedback&tab=${tab}`,
                  tabList: 'feedback',
                });
              }}
              pointerCursor="pointer"
              createdDraft={false}
              feedback={true}
              height={'calc(100vh - 350px)'}
              setCanView={setCanView}
              // checkRecallDocs={checkRecallDocs}
              checkRecallDocs={false}
              isAuthory={isAuthory}
              setReloadPage={setReloadPage}
              sorting={[{ columnName: 'urgencyLevel', direction: 'asc' }]}
            />
          )}
          {/* tra cứu thống kê */}
          {rootTab === 'findStatistics' && (
            <ListPageClone
              filterStartEnd="documentDate"
              withPagination
              notDelete
              noKanban
              disableSelect
              notChangeApi
              // exportExcel
              optionSearch={[
                { name: 'abstractNote', title: 'Trích yếu' },
                { name: 'toBookCode', title: 'Số đến' },
                { name: 'toBook', title: 'Số văn bản' },
              ]}
              customFunction={item => customFC(item)}
              roles={roles}
              history={props.history}
              disableImport
              disableAdd
              reload={reloadPage}
              disableEmployee
              code="IncommingDocument"
              employeeFilterKey="createdBy"
              apiUrl={API_INCOMMING_DOCUMENT_LOOKUP_STATISTICS}
              kanban="ST21"
              listMenus={[]}
              kanbanKey="type"
              rootTab={rootTab}
              disableViewConfig
              pointerCursor="pointer"
              createdDraft={false}
              // height={'calc(100vh - 350px)'}
              setOpenSearch={setOpenSearch}
              height={openSearch ? 'calc(100vh - 350px)' : 'calc(100vh - 100px)'}
              mapFunction={item => {
                return {
                  ...item,
                  nameOrg: <p style={{ paddingLeft: `${(item.level || 0) * 15}px`, fontWeight: 'bold' }}>{item.nameOrg}</p>,
                  stt: <p style={{ textAlign: 'center' }}>{item.stt}</p>,
                  count: <p style={{ textAlign: 'center' }}>{item.count}</p>,
                  countNoComplete: <p style={{ textAlign: 'center' }}>{item.countNoComplete}</p>,
                  countNoCompleteNoDeadline: <p style={{ textAlign: 'center' }}>{item.countNoCompleteNoDeadline}</p>,
                  countNoCompleteOutDeadline: <p style={{ textAlign: 'center' }}>{item.countNoCompleteOutDeadline}</p>,
                  countNoCompleteInDeadline: <p style={{ textAlign: 'center' }}>{item.countNoCompleteInDeadline}</p>,
                  countComplete: <p style={{ textAlign: 'center' }}>{item.countComplete}</p>,
                  countCompleteNoDeadline: <p style={{ textAlign: 'center' }}>{item.countCompleteNoDeadline}</p>,
                  countCompleteOutDeadline: <p style={{ textAlign: 'center' }}>{item.countCompleteOutDeadline}</p>,
                  countCompleteInDeadline: <p style={{ textAlign: 'center' }}>{item.countCompleteInDeadline}</p>,
                };
              }}
              setCanView={setCanView}
              onCellClick={(column, row) => {
                if (column && column.name) {
                  let col = `${column.name}Filter`;
                  let filter =
                    row && row.originItem && row.originItem[col] && Array.isArray(row.originItem[col]) && row.originItem[col][0]
                      ? row.originItem[col][0]
                      : null;
                  if (filter) {
                    setOpenDialog(true);
                    setFilterDocs(filter.$match);
                  } else {
                    props.onChangeSnackbar({ variant: 'error', message: 'Đồng chí chọn sai trường dữ liệu, vui lòng chọn lại!', status: true });
                  }
                }
              }}
              // tree
              setReloadPage={setReloadPage}
              sorting={[{ columnName: 'urgencyLevel', direction: 'asc' }]}
            />
          )}
        </>
      )}
      {tab === 4 && (
        <>
          {rootTab === 'receive' && (
            <ListPage
              filterStartEnd="documentDate"
              withPagination
              showDepartmentAndEmployeeFilter
              exportExcel
              disable3Action
              disableAdd
              roles={roles}
              disableImport
              disableSelect
              noKanban
              reload={reloadPage}
              filter={{
                stage: { $ne: 'receive' },
                receiverUnit: profile && profile.organizationUnit && profile.organizationUnit.organizationUnitId,
              }}
              disableEmployee
              code="IncommingDocument"
              employeeFilterKey="createdBy"
              apiUrl={url1}
              kanban="ST21"
              kanbanKey="type"
              disableOneEdit
              onRowClick={item => {
                // openTitleDialog(item._id, 'receive', tab);
                openTitleDialogCustom(item._id, 'viewReceive', tab);
              }}
              pointerCursor="pointer"
              mapFunction={mapFunction}
              rootTab={rootTab}
              height={'calc(100vh - 350px)'}
              setCanView={setCanView}
              checkRecallDocs={checkRecallDocs}
              setReloadPage={setReloadPage}
              history={props.history}
              sorting={[{ columnName: 'urgencyLevel', direction: 'asc' }]}
            />
          )}
          {rootTab === 'processors' && ((profile.type && profile.type.includes('outlineDoc')) || permissionOutLineDoc) ? (
            <ListPage
              filterStartEnd="documentDate"
              withPagination
              showDepartmentAndEmployeeFilter
              disableAdd
              notDelete
              roles={roles}
              history={props.history}
              disableImport
              noKanban
              disableOneEdit
              exportExcel
              getStateSelection={e => getStateSelection(e)}
              selectMultiple={false}
              onSelectCustomers={val => {
                handleRefactor(val, rootTab);
              }}
              handleCheckRecall={value => {
                setNoRecall(value);
              }}
              filter={
                checkListDocument
                  ? { typeDoc: 'preliminaryDoc', stage: 'processing', processeds: { $in: [props.profile._id] } }
                  : { typeDoc: 'roomDoc', stage: 'processing', processeds: { $in: [props.profile._id] } }
              }
              disableEmployee
              mapFunction={mapFunction}
              code="IncommingDocument"
              employeeFilterKey="createdBy"
              apiUrl={url2}
              kanban="ST24"
              kanbanKey="type"
              onRowClick={item => {
                openTitleDialog(item._id, 'processors', tab, checkListDocument);
              }}
              pointerCursor="pointer"
              reload={reloadPage}
              rootTab={rootTab}
              // listMenus={['setProcessor', 'changeDeadline', 'createTask', 'createSigner', 'createOutGoingDoc'].filter(i => {
              listMenus={
                checkListDocument
                  ? ['changeDeadline', 'createTask', 'createSigner', 'createOutGoingDoc'].filter(i => {
                    if (i === 'setProcessor') {
                      if (businessRoleSelect && businessRoleSelect.add_more_process === true && rootTab === 'processors') {
                        return true;
                      }
                      return false;
                    }
                    if (i === 'changeDeadline') {
                      if (canDeadlineIncrease) {
                        return true;
                      }
                      return false;
                    }
                    return true;
                  })
                  : ['setProcessor', 'changeDeadline', 'createTask', 'createSigner', 'createOutGoingDoc'].filter(i => {
                    if (i === 'setProcessor') {
                      if (businessRoleSelect && businessRoleSelect.add_more_process === true && rootTab === 'processors') {
                        return true;
                      }

                      return false;
                    }
                    if (i === 'changeDeadline') {
                      if (canDeadlineIncrease) {
                        return true;
                      }
                      return false;
                    }
                    return true;
                  })
              }
              typeDocOfItem={checkListDocument ? 'preliminaryDoc' : 'roomDoc'}
              height={'calc(100vh - 350px)'}
              setCanView={setCanView}
              // checkRecallDocs={!checkListDocument && checkRecallDocs}
              checkRecallDocs={checkRecallDocs}
              isAuthory={isAuthory}
              setReloadPage={setReloadPage}
              profileAuthority={profileAuthority}
              sorting={[{ columnName: 'urgencyLevel', direction: 'asc' }]}
            />
          ) : rootTab === 'processors' && ((profile.type && !profile.type.includes('outlineDoc')) || !profile.type) ? (
            <ListPage
              filterStartEnd="documentDate"
              withPagination
              showDepartmentAndEmployeeFilter
              disableAdd
              notDelete
              roles={roles}
              history={props.history}
              disableImport
              noKanban
              disableOneEdit
              exportExcel
              filter={{ stage: 'processing', processeds: { $in: [props.profile._id] } }}
              getStateSelection={e => getStateSelection(e)}
              selectMultiple={false}
              onSelectCustomers={val => {
                handleRefactor(val, rootTab);
              }}
              disableEmployee
              mapFunction={mapFunction}
              code="IncommingDocument"
              employeeFilterKey="createdBy"
              apiUrl={url2}
              kanban="ST24"
              kanbanKey="type"
              onRowClick={item => {
                openTitleDialog(item._id, 'processors', tab, checkListDocument);
              }}
              pointerCursor="pointer"
              reload={reloadPage}
              rootTab={rootTab}
              listMenus={['setProcessor', 'changeDeadline', 'createTask', 'createSigner', 'createOutGoingDoc'].filter(i => {
                if (i === 'setProcessor') {
                  if (businessRoleSelect && businessRoleSelect.add_more_process === true && rootTab === 'processors') {
                    return true;
                  }
                  return false;
                }
                if (i === 'changeDeadline') {
                  if (canDeadlineIncrease) {
                    return true;
                  }
                  return false;
                }
                return true;
              })}
              height={'calc(100vh - 350px)'}
              setCanView={setCanView}
              checkRecallDocs={checkRecallDocs}
              isAuthory={isAuthory}
              typeDocOfItem={'roomDoc'}
              setReloadPage={setReloadPage}
              profileAuthority={profileAuthority}
              sorting={[{ columnName: 'urgencyLevel', direction: 'asc' }]}
            />
          ) : null}
          {/* {rootTab === 'processors' && (
            <ListPage
              filterStartEnd="documentDate"
              withPagination
              showDepartmentAndEmployeeFilter
              exportExcel
              disableAdd
              disableImport
              roles={roles}
              noKanban
              filter={{ stage: 'processing', processeds: { $in: [props.profile._id] } }}
              selectMultiple={false}
              reload={reloadPage}
              disableEmployee
              code="IncommingDocument"
              employeeFilterKey="createdBy"
              apiUrl={url1}
              kanban="ST21"
              kanbanKey="type"
              getStateSelection={e => getStateSelection(e)}
              onSelectCustomers={val => {
                handleRefactor(val, rootTab);
              }}
              onRowClick={item => {
                openTitleDialog(item._id, 'processors', tab);
              }}
              listMenus={['setProcessor'].filter(i => {
                if (i === 'setProcessor') {
                  if (businessRoleSelect && businessRoleSelect.add_more_process === true && rootTab === 'processors') {
                    return true;
                  }
                  return false;
                }
                return true;
              })}
              pointerCursor="pointer"
              disableOneEdit
              mapFunction={mapFunction}
              rootTab={rootTab}
              height={'calc(100vh - 350px)'}
              setCanView={setCanView}
              checkRecallDocs={checkRecallDocs}
              isAuthory={isAuthory}
              history={props.history}
            />
          )} */}
          {rootTab === 'supporters' && (
            <ListPage
              filterStartEnd="documentDate"
              withPagination
              roles={roles}
              showDepartmentAndEmployeeFilter
              exportExcel
              disableAdd
              filter={
                typePage !== ''
                  ? { supporteds: { $in: [props.profile._id] }, checkStatus: { $nin: [props.profile._id] } }
                  : { stage: 'processing', supporteds: { $in: [props.profile._id] }, checkStatus: { $nin: [props.profile._id] } }
              }
              reload={reloadPage}
              disableImport
              disableEmployee
              noKanban
              code="IncommingDocument"
              employeeFilterKey="createdBy"
              apiUrl={url1}
              kanban="ST21"
              kanbanKey="type"
              getStateSelection={e => getStateSelection(e)}
              selectMultiple={false}
              onSelectCustomers={val => {
                handleRefactor(val, rootTab);
              }}
              onRowClick={item => {
                openTitleDialog(item._id, 'supporters', tab);
              }}
              listMenus={[]}
              pointerCursor="pointer"
              disableOneEdit
              mapFunction={mapFunction}
              rootTab={rootTab}
              height={'calc(100vh - 350px)'}
              setCanView={setCanView}
              // checkRecallDocs={checkRecallDocs}
              checkRecallDocs={false}
              setReloadPage={setReloadPage}
              history={props.history}
              sorting={[{ columnName: 'urgencyLevel', direction: 'asc' }]}
            />
          )}
          {rootTab === 'viewers' && (
            <ListPage
              filterStartEnd="documentDate"
              withPagination
              showDepartmentAndEmployeeFilter
              exportExcel
              roles={roles}
              disableAdd
              noKanban
              disableImport
              filter={{ stage: { $ne: 'receive' }, vieweds: { $in: [props.profile._id] } }}
              reload={reloadPage}
              disableEmployee
              code="IncommingDocument"
              employeeFilterKey="createdBy"
              apiUrl={url1}
              kanban="ST21"
              kanbanKey="type"
              getStateSelection={e => getStateSelection(e)}
              selectMultiple={true}
              onSelectCustomers={val => {
                handleRefactor(val, rootTab);
              }}
              onRowClick={item => {
                openTitleDialog(item._id, 'viewers', tab);
              }}
              listMenus={[]}
              pointerCursor="pointer"
              disableOneEdit
              mapFunction={mapFunction}
              rootTab={rootTab}
              height={'calc(100vh - 350px)'}
              setCanView={setCanView}
              checkRecallDocs={checkRecallDocs}
              setReloadPage={setReloadPage}
              history={props.history}
              sorting={[{ columnName: 'urgencyLevel', direction: 'asc' }]}
            />
          )}
          {rootTab === 'commander' && (
            <ListPage
              filterStartEnd="documentDate"
              withPagination
              showDepartmentAndEmployeeFilter
              exportExcel
              disableAdd
              filter={{ stage: 'processing', commandeds: { $in: [props.profile._id] } }}
              disableSelect
              reload={reloadPage}
              disableImport
              roles={roles}
              noKanban
              disableEmployee
              code="IncommingDocument"
              employeeFilterKey="createdBy"
              apiUrl={url1}
              kanban="ST21"
              kanbanKey="type"
              listMenus={['changeDeadline', 'createTask', 'createOutGoingDoc', 'setProcessor'].filter(i => {
                if (i === 'setProcessor') {
                  if (businessRoleSelect && businessRoleSelect.add_more_process === true && rootTab === 'commander') {
                    return true;
                  }
                  return false;
                }
                if (i === 'changeDeadline') {
                  if (canDeadlineIncrease) {
                    return true;
                  }
                  return false;
                }
                return true;
              })}
              onRowClick={item => {
                openTitleDialog(item._id, 'commander', tab);
              }}
              pointerCursor="pointer"
              disableOneEdit
              mapFunction={mapFunction}
              rootTab={rootTab}
              height={'calc(100vh - 350px)'}
              setCanView={setCanView}
              checkRecallDocs={checkRecallDocs}
              setReloadPage={setReloadPage}
              history={props.history}
              sorting={[{ columnName: 'urgencyLevel', direction: 'asc' }]}
            />
          )}

          {rootTab === 'feedback' && (
            <ListPage
              filterStartEnd="documentDate"
              withPagination
              notDelete
              noKanban
              showDepartmentAndEmployeeFilter
              exportExcel
              roles={roles}
              history={props.history}
              disableImport
              getStateSelection={e => getStateSelection(e)}
              disableAdd
              filter={{ commandered: { $in: [profile._id] } }}
              onSelectCustomers={val => {
                handleRefactor(val, rootTab);
              }}
              reload={reloadPage}
              disableEmployee
              mapFunction={mapFunction}
              code="IncommingDocument"
              employeeFilterKey="createdBy"
              apiUrl={url1}
              kanban="ST21"
              listMenus={['createTask']}
              kanbanKey="type"
              rootTab={rootTab}
              onRowClick={item => {
                openTitleDialog(item._id, 'feedback', tab);
              }}
              pointerCursor="pointer"
              createdDraft={true}
              height={'calc(100vh - 350px)'}
              setCanView={setCanView}
              // checkRecallDocs={checkRecallDocs}
              checkRecallDocs={false}
              isAuthory={isAuthory}
              setReloadPage={setReloadPage}
              sorting={[{ columnName: 'urgencyLevel', direction: 'asc' }]}
            />
          )}
        </>
      )}
      {tab === 5 && (
        <>
          {/* tiếp nhận ndb */}
          {rootTab === 'receive' && (
            <ListPage
              filterStartEnd="documentDate"
              withPagination
              showDepartmentAndEmployeeFilter
              exportExcel
              roles={roles}
              getStateSelection={e => getStateSelection(e)}
              // settingBar={[addExecutiveDocument()]}
              disableAdd
              filter={filter1}
              onSelectCustomers={val => {
                handleRefactor(val, rootTab);
              }}
              notDelete
              disableImport
              onRowClick={item => {
                openTitleDialog(item._id, 'viewReceive', tab);
              }}
              history={props.history}
              reload={reloadPage}
              disableEmployee
              noKanban
              mapFunction={mapFunction}
              clickToView
              code="IncommingDocument"
              employeeFilterKey="createdBy"
              apiUrl={url1}
              kanban="ST21"
              listMenus={[]}
              kanbanKey="type"
              rootTab={rootTab}
              height={'calc(100vh - 350px)'}
              setCanView={setCanView}
              checkRecallDocs={false}
              isAuthory={isAuthory}
              setReloadPage={setReloadPage}
              sorting={[{ columnName: 'urgencyLevel', direction: 'asc' }]}
            />
          )}
          {rootTab === 'processors' && ((profile.type && profile.type.includes('outlineDoc')) || permissionOutLineDoc) ? (
            <ListPage
              filterStartEnd="documentDate"
              withPagination
              showDepartmentAndEmployeeFilter
              disableAdd
              notDelete
              roles={roles}
              history={props.history}
              disableImport
              noKanban
              disableOneEdit
              exportExcel
              getStateSelection={e => getStateSelection(e)}
              selectMultiple={false}
              onSelectCustomers={val => {
                handleRefactor(val, rootTab);
              }}
              filter={
                checkListDocument
                  ? { typeDoc: 'preliminaryDoc', stage: 'complete', processeds: { $in: [props.profile._id] } }
                  : { typeDoc: 'roomDoc', stage: 'complete', processeds: { $in: [props.profile._id] } }
              }
              disableEmployee
              mapFunction={mapFunction}
              code="IncommingDocument"
              employeeFilterKey="createdBy"
              apiUrl={url2}
              kanban="ST24"
              kanbanKey="type"
              onRowClick={item => {
                openTitleDialog(item._id, 'processors', tab, checkListDocument);
              }}
              pointerCursor="pointer"
              reload={reloadPage}
              rootTab={rootTab}
              // listMenus={['setProcessor', 'changeDeadline', 'createTask', 'createSigner', 'createOutGoingDoc'].filter(i => {
              // listMenus={['changeDeadline', 'createTask', 'createSigner', 'createOutGoingDoc'].filter(i => {
              listMenus={['createTask', 'createSigner', 'createOutGoingDoc'].filter(i => {
                if (i === 'setProcessor') {
                  if (businessRoleSelect && businessRoleSelect.add_more_process === true && rootTab === 'processors') {
                    return true;
                  }
                  return false;
                }
                if (i === 'changeDeadline') {
                  if (canDeadlineIncrease) {
                    return true;
                  }
                  return false;
                }
                return true;
              })}
              height={'calc(100vh - 350px)'}
              setCanView={setCanView}
              // checkRecallDocs={checkRecallDocs}
              checkRecallDocs={false}
              isAuthory={isAuthory}
              setReloadPage={setReloadPage}
              sorting={[{ columnName: 'urgencyLevel', direction: 'asc' }]}
            />
          ) : rootTab === 'processors' && ((profile.type && !profile.type.includes('outlineDoc')) || !profile.type) ? (
            <ListPage
              filterStartEnd="documentDate"
              withPagination
              showDepartmentAndEmployeeFilter
              disableAdd
              notDelete
              roles={roles}
              history={props.history}
              disableImport
              noKanban
              disableOneEdit
              exportExcel
              filter={{ stage: 'complete', processeds: { $in: [props.profile._id] } }}
              getStateSelection={e => getStateSelection(e)}
              selectMultiple={false}
              onSelectCustomers={val => {
                handleRefactor(val, rootTab);
              }}
              disableEmployee
              mapFunction={mapFunction}
              code="IncommingDocument"
              employeeFilterKey="createdBy"
              apiUrl={url2}
              kanban="ST24"
              kanbanKey="type"
              onRowClick={item => {
                openTitleDialog(item._id, 'processors', tab, checkListDocument);
              }}
              pointerCursor="pointer"
              reload={reloadPage}
              rootTab={rootTab}
              // listMenus={['setProcessor', 'changeDeadline', 'createTask', 'createSigner', 'createOutGoingDoc'].filter(i => {
              // listMenus={['changeDeadline', 'createTask', 'createSigner', 'createOutGoingDoc'].filter(i => {
              listMenus={['createTask', 'createSigner', 'createOutGoingDoc'].filter(i => {
                if (i === 'setProcessor') {
                  if (businessRoleSelect && businessRoleSelect.add_more_process === true && rootTab === 'processors') {
                    return true;
                  }
                  return false;
                }
                if (i === 'changeDeadline') {
                  if (canDeadlineIncrease) {
                    return true;
                  }
                  return false;
                }
                return true;
              })}
              height={'calc(100vh - 350px)'}
              setCanView={setCanView}
              // checkRecallDocs={checkRecallDocs}
              checkRecallDocs={false}
              isAuthory={isAuthory}
              setReloadPage={setReloadPage}
              sorting={[{ columnName: 'urgencyLevel', direction: 'asc' }]}
            />
          ) : null}

          {/* {rootTab === 'processors' && (
            <ListPage
              filterStartEnd="documentDate"
              withPagination
              showDepartmentAndEmployeeFilter
              exportExcel
              onRowClick={item => {
                openTitleDialog(item._id, 'processors', tab);
              }}
              disableImport
              roles={roles}
              disableAdd
              disableOneEdit
              filter={{ stage: 'complete', processeds: { $in: [props.profile._id] } }}
              disableSelect
              reload={reloadPage}
              noKanban
              pointerCursor="pointer"
              disableEmployee
              code="IncommingDocument"
              employeeFilterKey="createdBy"
              apiUrl={url1}
              kanban="ST21"
              kanbanKey="type"
              mapFunction={mapFunction}
              rootTab={rootTab}
              listMenus={[]}
              height={'calc(100vh - 350px)'}
              setCanView={setCanView}
              checkRecallDocs={checkRecallDocs}
              history={props.history}
            />
          )} */}

          {rootTab === 'supporters' && (
            <ListPage
              filterStartEnd="documentDate"
              withPagination
              showDepartmentAndEmployeeFilter
              exportExcel
              disableAdd
              roles={roles}
              disableImport
              disableOneEdit
              // filter={{ stage: 'complete', supporteds: { $in: [props.profile._id] } }}
              filter={{
                stage: 'complete',
                supporteds: { $in: [props.profile._id] },
                stage: { $in: ['complete', 'processing'] },
                checkStatus: { $in: [props.profile._id] },
              }}
              // ? { typeDoc: 'preliminaryDoc', stage: { $in: ['complete', "processing"] }, processeds: { $in: [props.profile._id] } ,checkStatus : {$in: [props.profile._id]}}
              disableSelect
              noKanban
              pointerCursor="pointer"
              onRowClick={item => {
                openTitleDialog(item._id, 'supporters', tab);
              }}
              reload={reloadPage}
              disableEmployee
              code="IncommingDocument"
              employeeFilterKey="createdBy"
              apiUrl={url1}
              kanban="ST21"
              kanbanKey="type"
              mapFunction={mapFunction}
              rootTab={rootTab}
              listMenus={[]}
              height={'calc(100vh - 350px)'}
              setCanView={setCanView}
              // checkRecallDocs={checkRecallDocs}
              checkRecallDocs={false}
              setReloadPage={setReloadPage}
              history={props.history}
              sorting={[{ columnName: 'urgencyLevel', direction: 'asc' }]}
            />
          )}
          {/*  chỉ đạo đã hoàn thành */}
          {rootTab === 'commander' && (
            <ListPage
              filterStartEnd="documentDate"
              withPagination
              showDepartmentAndEmployeeFilter
              exportExcel
              disableAdd
              filter={{ stage: 'complete', commandeds: { $in: [props.profile._id] } }}
              disableSelect
              reload={reloadPage}
              disableImport
              roles={roles}
              noKanban
              disableEmployee
              code="IncommingDocument"
              employeeFilterKey="createdBy"
              apiUrl={url1}
              kanban="ST21"
              kanbanKey="type"
              onRowClick={item => {
                // openTitleDialog(item._id, 'viewCommander', tab);
                openTitleDialog(item._id, 'commander', tab);
              }}
              listMenus={['createTask', 'createOutGoingDoc'].filter(i => {
                if (i === 'setProcessor') {
                  if (businessRoleSelect && businessRoleSelect.add_more_process === true && rootTab === 'processors') {
                    return true;
                  }
                  return false;
                }

                return true;
              })}
              pointerCursor="pointer"
              disableOneEdit
              mapFunction={mapFunction}
              rootTab={rootTab}
              height={'calc(100vh - 350px)'}
              setCanView={setCanView}
              // checkRecallDocs={checkRecallDocs}
              setReloadPage={setReloadPage}
              history={props.history}
              checkRecallDocs={false}
              sorting={[{ columnName: 'urgencyLevel', direction: 'asc' }]}
            />
          )}
        </>
      )}

      {tab === 6 && (
        <>
          {/* tiếp nhận phối hợp */}
          {rootTab === 'receive' && (
            <ListPage
              filterStartEnd="documentDate"
              withPagination
              showDepartmentAndEmployeeFilter
              exportExcel
              roles={roles}
              getStateSelection={e => getStateSelection(e)}
              // settingBar={[addExecutiveDocument()]}
              disableAdd
              notDelete
              disableImport
              filter={filter1}
              onSelectCustomers={val => {
                handleRefactor(val, rootTab);
              }}
              onRowClick={item => {
                openTitleDialog(item._id, 'viewReceive', tab);
              }}
              history={props.history}
              reload={reloadPage}
              disableEmployee
              noKanban
              mapFunction={mapFunction}
              clickToView
              code="IncommingDocument"
              employeeFilterKey="createdBy"
              apiUrl={url1}
              kanban="ST21"
              listMenus={[]}
              kanbanKey="type"
              rootTab={rootTab}
              height={'calc(100vh - 350px)'}
              setCanView={setCanView}
              checkRecallDocs={false}
              isAuthory={isAuthory}
              setReloadPage={setReloadPage}
              sorting={[{ columnName: 'urgencyLevel', direction: 'asc' }]}
            />
          )}
          {rootTab === 'supporters' && (
            <ListPage
              filterStartEnd="documentDate"
              withPagination
              showDepartmentAndEmployeeFilter
              exportExcel
              disableAdd
              roles={roles}
              disableImport
              disableOneEdit
              filter={{ stage: 'complete', supporters: { $in: [props.profile._id] } }}
              disableSelect
              noKanban
              pointerCursor="pointer"
              onRowClick={item => {
                openTitleDialog(item._id, 'viewSupporters', tab);
              }}
              reload={reloadPage}
              disableEmployee
              code="IncommingDocument"
              employeeFilterKey="createdBy"
              apiUrl={url1}
              kanban="ST21"
              kanbanKey="type"
              mapFunction={mapFunction}
              rootTab={rootTab}
              listMenus={[]}
              height={'calc(100vh - 350px)'}
              setCanView={setCanView}
              // checkRecallDocs={checkRecallDocs}
              checkRecallDocs={false}
              createdDraft={false}
              setReloadPage={setReloadPage}
              history={props.history}
              sorting={[{ columnName: 'urgencyLevel', direction: 'asc' }]}
            />
          )}

          {rootTab === 'commander' && (
            <ListPage
              filterStartEnd="documentDate"
              withPagination
              showDepartmentAndEmployeeFilter
              exportExcel
              disableAdd
              filter={{ stage: 'complete', commander: { $in: [props.profile._id] } }}
              disableSelect
              reload={reloadPage}
              disableImport
              roles={roles}
              noKanban
              disableEmployee
              code="IncommingDocument"
              employeeFilterKey="createdBy"
              apiUrl={url1}
              kanban="ST21"
              kanbanKey="type"
              listMenus={[]}
              createdDraft={false}
              onRowClick={item => {
                openTitleDialog(item._id, 'viewCommander', tab);
              }}
              pointerCursor="pointer"
              disableOneEdit
              mapFunction={mapFunction}
              rootTab={rootTab}
              height={'calc(100vh - 350px)'}
              setCanView={setCanView}
              // checkRecallDocs={checkRecallDocs}
              setReloadPage={setReloadPage}
              history={props.history}
              checkRecallDocs={false}
              sorting={[{ columnName: 'urgencyLevel', direction: 'asc' }]}
            />
          )}
        </>
      )}

      {tab === 10 && (
        <>
          {rootTab === 'receive' && (
            <ListPage
              filterStartEnd="documentDate"
              withPagination
              showDepartmentAndEmployeeFilter
              exportExcel
              getStateSelection={e => getStateSelection(e)}
              // settingBar={[addExecutiveDocument()]}
              disableAdd
              roles={roles}
              notDelete
              // filter={{
              //   ...filter1, isExportTicket: true
              // }}
              filter={{
                stage: { $ne: 'receive' },
                receiverUnit: profile && profile.organizationUnit && profile.organizationUnit.organizationUnitId,
                isExportTicket: true,
              }}
              history={props.history}
              reload={reloadPage}
              disableEmployee
              noKanban
              mapFunction={mapFunction}
              clickToView
              code="IncommingDocument"
              employeeFilterKey="createdBy"
              apiUrl={url1}
              kanban="ST21"
              listMenus={[]}
              kanbanKey="type"
              rootTab={rootTab}
              disableOneEdit
              createdDraf={false}
              onRowClick={item => {
                openTitleDialogCustom(item._id, 'viewReceive', tab);
              }}
              height={'calc(100vh - 350px)'}
              setCanView={setCanView}
              checkRecallDocs={checkRecallDocs}
              setReloadPage={setReloadPage}
              sorting={[{ columnName: 'urgencyLevel', direction: 'asc' }]}
            />
          )}
        </>
      )}

      {tab === 11 && (
        <>
          {rootTab === 'processors' && ((profile.type && profile.type.includes('outlineDoc')) || permissionOutLineDoc) ? (
            <ListPage
              filterStartEnd="documentDate"
              withPagination
              showDepartmentAndEmployeeFilter
              disableAdd
              notDelete
              roles={roles}
              history={props.history}
              disableImport
              noKanban
              disableOneEdit
              exportExcel
              getStateSelection={e => getStateSelection(e)}
              selectMultiple={false}
              onSelectCustomers={val => {
                handleRefactor(val, rootTab);
              }}
              filter={
                checkListDocument
                  ? { typeDoc: 'preliminaryDoc', stage: 'complete', preProcesseds: { $in: profile._id }, processeds: { $ne: profile._id } }
                  : { typeDoc: 'roomDoc', stage: 'complete', preProcesseds: { $in: profile._id }, processeds: { $ne: profile._id } }
              }
              disableEmployee
              mapFunction={mapFunction}
              code="IncommingDocument"
              employeeFilterKey="createdBy"
              apiUrl={url2}
              kanban="ST24"
              kanbanKey="type"
              onRowClick={item => {
                openTitleDialog(item._id, 'processors', tab);
              }}
              pointerCursor="pointer"
              reload={reloadPage}
              rootTab={rootTab}
              // listMenus={['setProcessor', 'changeDeadline', 'createTask', 'createSigner', 'createOutGoingDoc'].filter(i => {
              // listMenus={['changeDeadline', 'createTask', 'createSigner', 'createOutGoingDoc'].filter(i => {
              listMenus={['createTask', 'createSigner', 'createOutGoingDoc'].filter(i => {
                if (i === 'setProcessor') {
                  if (businessRoleSelect && businessRoleSelect.add_more_process === true && rootTab === 'processors') {
                    return true;
                  }
                  return false;
                }
                if (i === 'changeDeadline') {
                  if (canDeadlineIncrease) {
                    return true;
                  }
                  return false;
                }
                return true;
              })}
              height={'calc(100vh - 350px)'}
              setCanView={setCanView}
              // checkRecallDocs={checkRecallDocs}
              checkRecallDocs={false}
              isAuthory={isAuthory}
              setReloadPage={setReloadPage}
              sorting={[{ columnName: 'urgencyLevel', direction: 'asc' }]}
            />
          ) : rootTab === 'processors' && ((profile.type && !profile.type.includes('outlineDoc')) || !profile.type) ? (
            <ListPage
              filterStartEnd="documentDate"
              withPagination
              showDepartmentAndEmployeeFilter
              disableAdd
              notDelete
              roles={roles}
              history={props.history}
              disableImport
              noKanban
              disableOneEdit
              exportExcel
              filter={{
                stage: 'complete',
                preProcesseds: { $in: profile._id },
                processeds: { $ne: profile._id },
              }}
              getStateSelection={e => getStateSelection(e)}
              selectMultiple={false}
              onSelectCustomers={val => {
                handleRefactor(val, rootTab);
              }}
              disableEmployee
              mapFunction={mapFunction}
              code="IncommingDocument"
              employeeFilterKey="createdBy"
              apiUrl={url2}
              kanban="ST24"
              kanbanKey="type"
              onRowClick={item => {
                openTitleDialog(item._id, 'processors', tab);
              }}
              pointerCursor="pointer"
              reload={reloadPage}
              rootTab={rootTab}
              // listMenus={['setProcessor', 'changeDeadline', 'createTask', 'createSigner', 'createOutGoingDoc'].filter(i => {
              listMenus={['changeDeadline', 'createTask', 'createSigner', 'createOutGoingDoc'].filter(i => {
                if (i === 'setProcessor') {
                  if (businessRoleSelect && businessRoleSelect.add_more_process === true && rootTab === 'processors') {
                    return true;
                  }
                  return false;
                }
                if (i === 'changeDeadline') {
                  if (canDeadlineIncrease) {
                    return true;
                  }
                  return false;
                }
                return true;
              })}
              height={'calc(100vh - 350px)'}
              setCanView={setCanView}
              // checkRecallDocs={checkRecallDocs}
              checkRecallDocs={false}
              isAuthory={isAuthory}
              setReloadPage={setReloadPage}
              sorting={[{ columnName: 'urgencyLevel', direction: 'asc' }]}
            />
          ) : null}

          {/* {rootTab === 'processors' && (
            <ListPage
              filterStartEnd="documentDate"
              withPagination
              showDepartmentAndEmployeeFilter
              disableAdd
              notDelete
              history={props.history}
              disableImport
              noKanban
              disableOneEdit
              exportExcel
              getStateSelection={e => getStateSelection(e)}
              selectMultiple={false}
              onSelectCustomers={val => {
                handleRefactor(val, rootTab);
              }}
              filter={{
                stage: 'complete',
                preProcesseds: { $in: profile._id },
                processeds: { $ne: profile._id },
              }}
              disableEmployee
              mapFunction={mapFunction}
              code="IncommingDocument"
              employeeFilterKey="createdBy"
              apiUrl={url1}
              kanban="ST24"
              kanbanKey="type"
              onRowClick={item => {
                openTitleDialog(item._id, 'viewUncomplete', tab);
              }}
              pointerCursor="pointer"
              reload={reloadPage}
              rootTab={rootTab}
              disableSelect
              height={'calc(100vh - 350px)'}
              setCanView={setCanView}
              checkRecallDocs={checkRecallDocs}
            // listMenus={['setProcessor', 'changeDeadline', 'createTask', 'createSigner', 'createOutGoingDoc'].filter(i => {
            //   if (i === 'setProcessor') {
            //     if (businessRoleSelect && businessRoleSelect.add_more_process === true && rootTab === 'processors') {
            //       return true;
            //     }
            //     return false;
            //   }
            //   return true;
            // })}
            />
          )} */}
        </>
      )}
      <Dialog
        dialogAction={false}
        onClose={() => {
          setOpenDialog(false);
          // setFilterDocs()
        }}
        open={openDialog}
      >
        <FilterDocs
          handleCloseFilter={() => {
            setOpenDialog(false);
            // setFilterDocs()
          }}
          onRowClick={item => {
            openTitleDialog(item._id, 'viewReceive', 0);
          }}
          filterDocs={filterDocs}
        />
      </Dialog>
    </div>
  );
}

// export default WrapperListPage;
function mapDispatchToProps(dispatch) {
  return {
    onChangeSnackbar: obj => dispatch(changeSnackbar(obj)),
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(WrapperListPage);
