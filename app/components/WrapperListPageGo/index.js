import React, { useCallback, useEffect, useState, memo } from 'react';
import { API_GOING_DOCUMENT, API_DOCUMENT_PROCESS_TEMPLATE, API_OUTGOING_DOCUMENT_LOOKUP_STATISTICS, API_ORIGANIZATION } from '../../config/urlConfig';
import { Add } from '@material-ui/icons';
import { Grid, Tooltip } from '@material-ui/core';
import ListPage from '../List';
import ListPageClone from '../List/indexCloneGo';

import { AsyncAutocomplete, Dialog } from 'components/LifetekUi';

import _ from 'lodash';
import moment from 'moment';
import FilterDocs from './components/FilterDocs';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { changeSnackbar } from 'containers/Dashboard/actions';
import { fetchData, flatChild } from '../../helper';

function WrapperListPageGo(props) {
  const {
    tab,
    rootTab = '',
    reloadPage,
    profile,
    mapFunction,
    openTitleDialog,
    openEditPage,
    handleSelectedDoc,
    handleSetCurrentRole,
    handleSetProcessed,
    getStateSelection,
    mapRelease,
    kanbanFilter,
    OpenExecutiveDocumenDialog,
    // tab 1
    templates,
    typePage = '',
    reload,
    handleSetSelectProcess,
    history,
    callBack,
    selectedProcess,
    kanbanCode = {},
    pathname,
    roles,
    roleDepartment,
    listDer
  } = props;

  const code = {
    receive: 'ST22',
    processors: 'ST25',
    promulgate: 'ST23',
  };
  const [codeStatus, setCodeStatus] = useState([1, 3])

  const [openDialog, setOpenDialog] = useState(false)
  const [filterDocs, setFilterDocs] = useState()
  const [checkRecallDocs, setCheckRecallDocs] = useState(false);
  const [openSearch, setOpenSearch] = useState(true);

  const nameCallBack = 'goDocuments';
  const customContent = [
    {
      title: 'Phương thức nhận',
      fieldName: 'receiveMethod',
      type: 'string',
    },
    {
      title: 'Loại văn bản',
      fieldName: 'documentType',
      type: 'string',
    },
  ];

  const contentKanbanTemplate = [
    {
      title: 'Phương thức nhận',
      fieldName: 'receiveMethod',
      type: 'string',
    },
    {
      title: 'Loại văn bản',
      fieldName: 'documentType',
      type: 'string',
    },
  ];

  const handleRefactor = (val, rootTab) => {
    let docIds = Array.isArray(val) ? val.map(v => v._id) : [];
    switch (rootTab) {
      case 'receive':
      case 'textGo':
      case 'promulgate':
        handleSelectedDoc(docIds);
        break;
      case 'processors':
        let processedsSelected = [];
        if (docIds.length > 0)
          fetch(`${API_GOING_DOCUMENT}/${docIds[0]}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
            .then(response => response.json())
            .then(data => {
              if (data && data.processors && data.processors.length > 0 && data.processors[0] !== profile._id) {
                docIds = []
                processedsSelected = []
                handleSelectedDoc([]);
              }
              else handleSelectedDoc(docIds);

            });
        Array.isArray(val) ? val.map(v => v.originItem && processedsSelected.push(v.originItem.processeds)) : [];
        if (processedsSelected.length > 0) {
          processedsSelected = processedsSelected.reduce((arrayTotal, el) => arrayTotal.concat(el), []);
          handleSetProcessed(processedsSelected);
        }
        if (docIds.length) {
          val && handleSetCurrentRole(val[0].nextRole);
        }

        break;
    }


  };

  const addGoDocument = () => {
    if (rootTab === 'receive') {
      return (
        <Tooltip title="Dự thảo" onClick={OpenExecutiveDocumenDialog}>
          <Add style={{ color: 'white' }} />
        </Tooltip>
      );
    }
    else if (rootTab === 'promulgate') {
      console.log("jdjfnvfdjv")
      return (
        <Tooltip title="Ban hành" onClick={OpenExecutiveDocumenDialog}>
          <Add style={{ color: 'white' }} />
        </Tooltip>
      );
    }
  };
  useEffect(() => {
    const crmStatus = JSON.parse(localStorage.getItem('crmStatus'));
    const crm = crmStatus && crmStatus.find(item => item.code === "ST23")
    const crmProcess = crmStatus && crmStatus.find(item => item.code === "ST25")

    let code1 = 1
    let code2 = 3
    if (crm && crm.data && Array.isArray(crm.data)) {
      if (crm.data && crm.data[0] && crm.data[0].code) code1 = crm.data[0].code
      if (crm.data && crm.data[1] && crm.data[1].code) code2 = crm.data[1].code
    }
    setCodeStatus([code1, code2])

  }, [tab])
  let url1 = typePage !== '' ? `${API_GOING_DOCUMENT}?authority=true` : API_GOING_DOCUMENT;
  let url2Kanban = typePage !== '' ? `${API_GOING_DOCUMENT}?authority=true` : `${API_GOING_DOCUMENT}`;
  let url2 = typePage !== '' ? `${API_GOING_DOCUMENT}/processors?authority=true` : `${API_GOING_DOCUMENT}/processors`;
  let url3 = typePage !== '' ? `${API_GOING_DOCUMENT}/commanders?authority=true` : `${API_GOING_DOCUMENT}/commanders`;
  let url4 = typePage !== '' ? `${API_GOING_DOCUMENT}/processors?authority=true` : `${API_GOING_DOCUMENT}/processors`;
  let url5 = typePage !== '' ? `${API_GOING_DOCUMENT}?authority=true` : `${API_GOING_DOCUMENT}`;
  // error can be here
  let urlSelect = typePage !== '' ? `${API_DOCUMENT_PROCESS_TEMPLATE}?authority=true` : API_DOCUMENT_PROCESS_TEMPLATE;


  const customFC = (item) => {
    let data = []
    let minLevel = 99999
    listDer && Array.isArray(listDer) && listDer.length > 0 && listDer.forEach((el) => {
      item.map((ell) => {
        if (el._id && ell._id && el._id === ell._id) {
          if (ell.level < minLevel) minLevel = ell.level
          data.push(ell)
        }
      })
    })
    console.log(minLevel, 'level')
    data = data.map((el, idx) => {
      return {
        ...el,
        level: (el.level - minLevel )|| 0,
        stt: idx + 1
      }
    })
    console.log(data, 'data')
    return data.length && data.length > 0 ? data : item
  }
  useEffect(() => {
    let role
    if (rootTab === "processors") {
      role = roleDepartment.find(element => element.name === "processing");
    }
    else if (rootTab === "receive") {
      role = roleDepartment.find(element => element.name === "receive");
    }
    else if (rootTab === "feedback") {
      role = roleDepartment.find(element => element.name === "feedback");
    }
    else if (rootTab === "textGo") {
      role = roleDepartment.find(element => element.name === "outgoing");
    }
    else if (rootTab === "promulgate") {
      role = roleDepartment.find(element => element.name === "release");
    }
    setCheckRecallDocs(role && role.data && role.data.recallDocs ? role.data.recallDocs : false)

  }, [rootTab])
  return (
    <div>
      {
        console.log(tab, rootTab, "rootTab")
      }
      {tab === 7 && (
        <>
          {/* ban hành */}
          {rootTab === 'receive' && (
            <ListPage
              withPagination
              showDepartmentAndEmployeeFilter
              exportExcel
              history={history}
              mapFunction={mapFunction}
              disableEmployee
              reload={reloadPage}
              getStateSelection={e => getStateSelection(e)}
              code="OutGoingDocument"
              employeeFilterKey="createdBy"
              codeStatus="1"
              // apiUrl={`${url1}&code=waitPromulgate`}
              apiUrl={`${url1}`}
              onRowClick={item => openTitleDialog(item._id, 'view', tab)}
              pointerCursor="pointer"
              filter={
                {
                  $or: [
                    {
                      stage: 'complete',
                      completeStatus: 'waitPromulgate',
                      createdBy: profile && profile._id,
                      releasePartStatus: { $ne: 'released' }
                    },
                    {
                      releasePartStatus: 'waitting',
                      completePartUnit: profile && profile.organizationUnit && profile.organizationUnit.organizationUnitId,
                    },
                    {
                      releasePartStatus: 'waitting',
                      createdBy: profile && profile._id,
                    }
                  ]
                }}
              kanban={code.promulgate}
              selectMultiple={false}
              disableAdd
              // status='ST23'
              kanbanKey="type"
              onSelectCustomers={val => {
                handleRefactor(val, rootTab);
              }}
              disableOneEdit
              listMenus={[]}
            />
          )}
        </>
      )}

      {tab === 0 && (
        <>
          {rootTab === 'receive' && (
            <ListPage
              withPagination
              showDepartmentAndEmployeeFilter
              exportExcel
              disableEmployee
              onEdit={row => {
                openEditPage && openEditPage(row._id, 'receive')
              }}
              onRowClick={item => {
                openTitleDialog(item._id, 'receive', tab);
              }}
              history={history}
              reload={reloadPage}
              codeStatus="new"
              code="OutGoingDocument"
              employeeFilterKey="createdBy"
              getStateSelection={e => getStateSelection(e)}
              apiUrl={url1}
              filter={{ stage: 'receive', createdBy: profile._id, checkRole: true }}
              kanban={code.receive}
              mapFunction={mapFunction}
              kanbanKey="type"
              selectMultiple={true}
              onSelectCustomers={val => {
                handleRefactor(val, rootTab);
              }}
              settingBar={[addGoDocument()]}
              disableAdd
              listMenus={[]}
              checkRecallDocs={checkRecallDocs}
              deleteUrl={API_GOING_DOCUMENT}
            />
          )}
          {/* chờ xử lý */}
          {rootTab === 'processors' && (
            <>
              <ListPage
                withPagination
                showDepartmentAndEmployeeFilter
                exportExcel
                history={history}
                codeStatus='1'
                disableEmployee
                reload={reloadPage}
                onEdit={row => {
                  openEditPage && openEditPage(row._id, 'processors')
                }}
                // filter={{
                //   $or: [
                //     { signingStatus: "none" },
                //     { signingStatus: "waitingSign", apostropher: profile._id },
                //     { agreeUser: profile._id, signingStatus: "waitingSign" }
                //   ]
                // }}
                mapFunction={mapFunction}
                disableAdd
                disableOneEdit
                getStateSelection={e => getStateSelection(e)}
                code="OutGoingDocument"
                employeeFilterKey="createdBy"
                apiUrl={url2}
                // apiUrl={props.isAuthory ? `${url2}&code=issued` : url2}
                kanban={code.processors}
                kanbanKey="type"
                selectMultiple={false}
                onSelectCustomers={val => {
                  handleRefactor(val, rootTab);
                }}
                // filter={{ releasePartStatus: { $nin: ["waitting", "released"] } }}
                onRowClick={item => {
                  openTitleDialog(item._id, 'processors', tab, item.originItem.processeds);
                }}
                pointerCursor="pointer"
                listMenus={[]}
                checkRecallDocs={checkRecallDocs}
                deleteUrl={API_GOING_DOCUMENT}
              />
            </>
          )}
          {/* chờ ban hành */}
          {rootTab === 'promulgate' && (
            <ListPage
              withPagination
              showDepartmentAndEmployeeFilter
              exportExcel
              history={history}
              mapFunction={mapFunction}
              disableEmployee
              reload={reloadPage}
              getStateSelection={e => getStateSelection(e)}
              code="OutGoingDocument"
              employeeFilterKey="createdBy"
              codeStatus="1"
              // apiUrl={`${url1}`}
              apiUrl={props.isAuthory ? `${url1}&code=waitIssue` : url1}
              onRowClick={item => openTitleDialog(item._id, 'release', tab)}
              pointerCursor="pointer"
              filter={{
                $or: [
                  {
                    stage: 'complete',
                    completeStatus: 'waitPromulgate',
                    completeUnit: profile && profile.organizationUnit && profile.organizationUnit.organizationUnitId,
                    releaseDepartment: { $exists: 'false' }
                  },
                  {
                    stage: 'complete',
                    completeStatus: 'waitPromulgate',
                    releaseDepartment: profile && profile.organizationUnit && profile.organizationUnit.organizationUnitId
                  },
                  {
                    releasePartStatus: 'waitting',
                    completePartUnit: profile && profile.organizationUnit && profile.organizationUnit.organizationUnitId,
                  }
                ]
              }}
              kanban={code.promulgate}
              selectMultiple={false}
              disableAdd
              // status='ST23'
              kanbanKey="type"
              onEdit={row => {
                props.history.push(`./editGoDocuments/${row._id}`);
              }}
              onSelectCustomers={val => {
                handleRefactor(val, rootTab);
              }}
              // settingBar={[addGoDocument()]}
              settingBar={[
                <Tooltip title="Ban hành" onClick={OpenExecutiveDocumenDialog}>
                  <Add style={{ color: 'white' }} />
                </Tooltip>
              ]}
              disableOneEdit
              listMenus={[]}
              checkRecallDocs={checkRecallDocs}
              deleteUrl={API_GOING_DOCUMENT}
            />
          )}

          {rootTab === 'textGo' && (
            <ListPage
              withPagination
              showDepartmentAndEmployeeFilter
              exportExcel
              disableOneEdit
              disableEmployee
              mapFunction={mapFunction}
              disableAdd
              history={history}
              reload={reloadPage}
              getStateSelection={e => getStateSelection(e)}
              onEdit={row => {
                props.history.push(`./${row._id}`);
              }}
              code="OutGoingDocument"
              employeeFilterKey="createdBy"
              // apiUrl={url1}
              apiUrl={props.isAuthory ? `${url1}&code=viewers` : url1}
              kanban={code.promulgate}
              filter={{
                stage: 'complete',
                viewers: { $in: profile._id },
                completeStatus: 'promulgated',
                releaseDate: {
                  $lte: moment()
                    .endOf('day')
                    .toDate(),
                },
              }}
              kanbanKey="type"
              onSelectCustomers={val => {
                handleRefactor(val, rootTab);
              }}
              onRowClick={item => openTitleDialog(item._id, 'textGo', tab)}
              pointerCursor="pointer"
              listMenus={[]}
              checkRecallDocs={checkRecallDocs}
              deleteUrl={API_GOING_DOCUMENT}
            />
          )}
          {/* ý kiến văn bản đi */}

          {rootTab === 'feedback' && (
            <ListPage
              withPagination
              mapFunction={mapFunction}
              showDepartmentAndEmployeeFilter
              exportExcel
              disableEmployee
              disableAdd
              reload={reloadPage}
              history={history}
              onEdit={row => {
                props.history.push(pathname ? openTitleDialog(row._id, 'feedback', tab) : `./${row._id}`);
              }}
              code="OutGoingDocument"
              employeeFilterKey="createdBy"
              // apiUrl={url5}
              apiUrl={props.isAuthory ? `${url5}&code=waitCom` : url5}
              // kanban={code.promulgate}
              kanban={"ST25"}
              filter={{
                commanders: { $in: profile._id },
              }}
              kanbanKey="type"
              disableSelect
              onRowClick={item => {
                openTitleDialog(item._id, 'feedback', tab);
              }}
              pointerCursor="pointer"
              listMenus={[]}
              disableOneEdit
              codeStatus="wait4comment"
              checkRecallDocs={checkRecallDocs}
              deleteUrl={API_GOING_DOCUMENT}
            />
          )}
          {/* tra cứu thống kê */}
          {rootTab === "findStatistics" && (
            <ListPageClone
              filterStartEnd="createdAt"
              // showStartEnd
              withPagination
              notDelete
              noKanban
              disableSelect
              notChangeApi
              customFunction={(item => customFC(item))}
              // showDepartmentAndEmployeeFilter
              optionSearch={[{ name: "abstractNote", title: "Trích yếu" }, { name: "toBook", title: "Số, ký hiệu ban hành" }]}
              // exportExcel
              roles={roles}
              history={props.history}
              disableImport
              getStateSelection={e => getStateSelection(e)}
              disableAdd
              reload={reloadPage}
              disableEmployee
              code="OutGoingDocument"
              employeeFilterKey="createdBy"
              apiUrl={API_OUTGOING_DOCUMENT_LOOKUP_STATISTICS}
              mapFunction={(item) => {
                return {
                  ...item,
                  nameOrg: <p style={{ paddingLeft: `${(item.level || 0) * 15}px`, fontWeight: "bold" }}>{item.nameOrg}</p>,
                  count: <p style={{ textAlign: "center" }}>{item.count}</p>,
                  countSignDigitalDoc: <p style={{ textAlign: "center" }}>{item.countSignDigitalDoc}</p>,
                  countSignTextDoc: <p style={{ textAlign: "center" }}>{item.countSignTextDoc}</p>,
                  countPromulgateDoc: <p style={{ textAlign: "center" }}>{item.countPromulgateDoc}</p>,
                  countCommandDoc: <p style={{ textAlign: "center" }}>{item.countCommandDoc}</p>
                }
              }}
              kanban="ST21"
              listMenus={[]}
              kanbanKey="type"
              rootTab={rootTab}
              disableViewConfig
              onCellClick={(column, row) => {
                //console.log(row, "row")
                if (column && column.name) {
                  let col = `${column.name}Filter`
                  let filter = row && row.originItem && row.originItem[col] && Array.isArray(row.originItem[col]) && row.originItem[col][0] ? row.originItem[col][0] : null
                  if (filter) {
                    setOpenDialog(true)
                    setFilterDocs(filter.$match)
                    console.log(filter.$match, "filter.$match")
                  }
                  else {
                    props.onChangeSnackbar({ variant: 'error', message: 'Đồng chí chọn sai trường dữ liệu, vui lòng chọn lại!', status: true });
                  }
                }
              }}
              pointerCursor="pointer"
              createdDraft={false}
              // height={'calc(100vh - 350px)'}
              setOpenSearch={setOpenSearch}
              height={openSearch ? 'calc(100vh - 350px)' : 'calc(100vh - 80px)'}
              deleteUrl={API_GOING_DOCUMENT}
            />
          )}
        </>
      )}
      {tab === 4 && (
        <>
          {rootTab === 'receive' ? (
            <ListPage
              onRowClick={item => openTitleDialog(item._id, 'receive', tab)}
              withPagination
              showDepartmentAndEmployeeFilter
              exportExcel
              disableAdd
              mapFunction={mapFunction}
              disableOneEdit
              disable3Action
              codeStatus='2'
              disableEmployee
              reload={reloadPage}
              code="OutGoingDocument"
              employeeFilterKey="createdBy"
              apiUrl={props.isAuthory ? `${url1}&code=signed` : url1}
              kanban={code.receive}
              kanbanKey="type"
              filter={{
                stage: { $ne: 'receive' }, createdBy: profile._id,
                releasePartStatus: { $nin: ["waitting", "released"] }
              }}
              disableSelect
              pointerCursor="pointer"
              listMenus={[]}
              checkRecallDocs={checkRecallDocs}
              deleteUrl={API_GOING_DOCUMENT}
            />
          ) : (
            <ListPage
              withPagination
              showDepartmentAndEmployeeFilter
              exportExcel
              disableAdd
              disableOneEdit
              mapFunction={mapFunction}
              disable3Action
              disableEmployee
              reload={reloadPage}
              code="OutGoingDocument"
              employeeFilterKey="createdBy"
              apiUrl={url1}
              kanban={code.receive}
              kanbanKey="type"
              filter={{ stage: { $ne: 'receive' } }}
              onRowClick={row => {
                props.history.push(`OutGoingDocument/editGoDocuments/${row._id}`);
              }}
              pointerCursor="pointer"
              disableSelect
              listMenus={[]}
              checkRecallDocs={checkRecallDocs}
              deleteUrl={API_GOING_DOCUMENT}
            />
          )}
        </>
      )}
      {tab === 5 && (
        <>
          {rootTab === 'receive' && (
            <ListPage
              withPagination
              showDepartmentAndEmployeeFilter
              exportExcel
              disableAdd
              mapFunction={mapFunction}
              disableEdit
              disableEmployee
              codeStatus='3'
              reload={reloadPage}
              code="OutGoingDocument"
              employeeFilterKey="createdBy"
              apiUrl={props.isAuthory ? `${url1}&code=issued` : url1}
              // apiUrl={`${url1}`}

              kanban={code.receive}
              kanbanKey="type"
              filter={
                {
                  $or: [
                    {
                      stage: 'complete',
                      completeStatus: 'promulgated',
                      createdBy: profile._id,
                      releasePartStatus: { $ne: 'waitting' }
                    },
                    {
                      releasePartStatus: 'released',
                      completePartUnit: profile && profile.organizationUnit && profile.organizationUnit.organizationUnitId,
                      stage: {$ne:'receive'},
                    },
                    {
                      releasePartStatus: 'released',
                      createdBy: profile && profile._id,
                      stage: {$ne:'receive'},
                    }
                  ],
                  createdBy: profile._id
                }
              }
              onRowClick={row => {
                props.history.push(`OutGoingDocument/editGoDocuments/${row._id}`);
              }}
              pointerCursor="pointer"
              disableSelect
              listMenus={[]}
              checkRecallDocs={checkRecallDocs}
              deleteUrl={API_GOING_DOCUMENT}
            />
          )}
            {/* ủy quyền, xử lý đã ban hành */}
          {rootTab === 'processors' && (
            <>
              <ListPage
                withPagination
                showDepartmentAndEmployeeFilter
                exportExcel
                mapFunction={mapFunction}
                disableAdd
                disableEdit
                codeStatus="3"
                disableEmployee
                reload={reloadPage}
                code="OutGoingDocument"
                employeeFilterKey="createdBy"
                // apiUrl={url1}
                apiUrl={props.isAuthory ? `${url1}&code=processPromulgated` : url1}
                kanban={code.receive}
                filter={
                  {
                    processeds: { $in: [profile._id] },
                    $or: [
                      {
                        stage: 'complete',
                        completeStatus: 'promulgated',
                      },
                      {
                        releasePartStatus: 'released',
                        completePartUnit: profile && profile.organizationUnit && profile.organizationUnit.organizationUnitId,
                        stage: {$ne:'receive'},
                      }
                    ]
                  }
                }
                kanbanKey="type"
                onRowClick={row => {
                  props.history.push(`OutGoingDocument/editGoDocuments/${row._id}`);
                }}
                disableSelect
                listMenus={[]}
                checkRecallDocs={checkRecallDocs}
                deleteUrl={API_GOING_DOCUMENT}
              />
            </>
          )}
          {/* ban hành */}
          {rootTab === 'promulgate' && (
            <ListPage
              withPagination
              showDepartmentAndEmployeeFilter
              exportExcel
              disableEmployee
              mapFunction={mapFunction}
              reload={reloadPage}
              code="OutGoingDocument"
              employeeFilterKey="createdBy"
              codeStatus="3"
              // apiUrl={`${url1}`}
              apiUrl={props.isAuthory ? `${url1}&code=promulgated` : url1}
              filter={{
                $or: [
                  {
                    stage: 'complete',
                    completeStatus: 'promulgated',
                    completeUnit: profile && profile.organizationUnit && profile.organizationUnit.organizationUnitId,
                    releaseDepartment: { $exists: false }
                  },
                  {
                    stage: 'complete',
                    completeStatus: 'promulgated',
                    releaseDepartment: profile && profile.organizationUnit && profile.organizationUnit.organizationUnitId
                  },
                  {
                    releasePartStatus: 'released',
                    completePartUnit: profile && profile.organizationUnit && profile.organizationUnit.organizationUnitId

                  }
                ]
              }}
              kanban={code.promulgate}
              kanbanKey="type"
              disableSelect
              onSelectCustomers={val => {
                const docIds = Array.isArray(val) ? val.map(v => v._id) : [];
                setSelectedDocs(docIds);
              }}
              onRowClick={row => {
                openTitleDialog(row._id, 'release', tab)
                if (typePage === '') {
                  props.history.push(
                    {
                      pathname: `OutGoingDocument/editGoDocuments/${id}?role=release`,
                      id: row._id
                    });
                } else {
                  props.history.push(
                    {
                      pathname: `OutGoingDocument/editGoDocuments/${id}?role=release&isAuthory=true`,
                      id: row._id
                    });
                }
              }}
              pointerCursor="pointer"
              disableOneEdit
              disableAdd
              listMenus={[]}
              checkRecallDocs={checkRecallDocs}
              deleteUrl={API_GOING_DOCUMENT}
            />
          )}
          {rootTab === 'feedback' && (
            <ListPage
              withPagination
              showDepartmentAndEmployeeFilter
              exportExcel
              disableAdd
              mapFunction={mapFunction}
              disableEmployee
              reload={reloadPage}
              code="OutGoingDocument"
              employeeFilterKey="createdBy"
              // apiUrl={url5}
              apiUrl={props.isAuthory ? `${url1}&code=commented` : url1}
              kanban={code.processors}
              kanbanKey="type"
              disableSelect
              filter={{ commandeds: { $in: [profile._id] } }}
              disableOneEdit
              onRowClick={item => {
                openTitleDialog(item._id, 'feedback', tab);
              }}
              pointerCursor="pointer"
              listMenus={['createTask']}
              codeStatus="commented"
              checkRecallDocs={checkRecallDocs}
              createdDraft={true}
              deleteUrl={API_GOING_DOCUMENT}
            />
          )}
        </>
      )}

      {tab === 6 && (
        <>
          <ListPage
            withPagination
            showDepartmentAndEmployeeFilter
            exportExcel
            disableEmployee
            disableAdd
            mapFunction={mapFunction}
            reload={reloadPage}
            code="OutGoingDocument"
            employeeFilterKey="createdBy"
            // apiUrl={url1}
            apiUrl={props.isAuthory ? `${url1}&code=processed` : url1}
            codeStatus='3'
            kanban={code.processors}
            kanbanKey="type"
            selectMultiple={false}
            onSelectCustomers={val =>
              handleRefactor && handleRefactor(val, rootTab)
            }
            filter={{
              processeds: { $in: [profile._id] },
              completeStatus: { $ne: 'promulgated' },
              signingStatus: { $in: ["none", "signed"] },
              // releasePartStatus: {$nin: ["waitting", "released"] }
            }}
            getStateSelection={e => getStateSelection(e)}
            disableOneEdit
            onRowClick={item => {
              openTitleDialog(item._id, 'processors', tab);
            }}
            pointerCursor="pointer"
            listMenus={[]}
            checkRecallDocs={checkRecallDocs}
            deleteUrl={API_GOING_DOCUMENT}
          />
        </>
      )}
      {tab === 8 && (
        <>

          {rootTab === 'textGo' && (
            <ListPage
              withPagination
              showDepartmentAndEmployeeFilter
              exportExcel
              disableOneEdit
              disableEmployee
              mapFunction={mapFunction}
              disableAdd
              history={history}
              reload={reloadPage}
              getStateSelection={e => getStateSelection(e)}
              onEdit={row => {
                props.history.push(`./${row._id}`);
              }}
              code="OutGoingDocument"
              employeeFilterKey="createdBy"
              // apiUrl={url1}
              apiUrl={props.isAuthory ? `${url1}&code=vieweds` : url1}
              kanban={code.promulgate}
              filter={{
                stage: 'complete',
                vieweds: { $in: profile._id },
                completeStatus: 'promulgated',
                releaseDate: {
                  $lte: moment()
                    .endOf('day')
                    .toDate(),
                },
              }}
              kanbanKey="type"
              onSelectCustomers={val => {
                handleRefactor(val, rootTab);
              }}
              onRowClick={item => openTitleDialog(item._id, 'textGo', tab)}
              pointerCursor="pointer"
              listMenus={[]}
              checkRecallDocs={checkRecallDocs}
              deleteUrl={API_GOING_DOCUMENT}
            />
          )}
        </>
      )
      }
      <Dialog dialogAction={false} onClose={() => {
        setOpenDialog(false)
        // setFilterDocs()
      }} open={openDialog}>
        <FilterDocs handleCloseFilter={() => {
          setOpenDialog(false)
          // setFilterDocs()
        }} 
        onRowClick={item => openTitleDialog(item._id, 'view', 7)}

        filterDocs={filterDocs} 
        />
      </Dialog>
    </div>
  );
}

// export default WrapperListPageGo;
function mapDispatchToProps(dispatch) {
  return {
    onChangeSnackbar: obj => dispatch(changeSnackbar(obj)),
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);


export default compose(
  memo,
  withConnect,
)(WrapperListPageGo);
