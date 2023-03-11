// Recall

import React, { useState, useCallback, useEffect } from 'react';
import PropTypes, { array } from 'prop-types';
import { Tabs, Tab, SwipeableDrawer } from '../../components/LifetekUi';
import Buttons from 'components/CustomButtons/Button';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { mergeData } from './actions';
import makeSelectRecall from './selectors';
import reducer from './reducer';
import saga from './saga';
import { Grid, Fab, Tooltip } from '@material-ui/core';
import moment from 'moment';
import ListPage from '../../components/List';
import { API_GOING_DOCUMENT, API_INCOMMING_DOCUMENT, API_INCOMMING_DOCUMENT_RECALL } from '../../config/urlConfig';
import AddRecall from '../AddRecall';
import { Paper as PaperUI } from 'components/LifetekUi';
import { makeSelectMiniActive } from '../Dashboard/selectors';
import { changeSnackbar } from '../Dashboard/actions';
import { Add, Lock, LockOpen } from '@material-ui/icons';
import Withdrawn from '../Withdrawn';
import { getShortNote } from '../../utils/functions';
import { makeSelectProfile } from '../../containers/Dashboard/selectors';

function Bt(props) {
  return (
    <Buttons
      // color={props.tab === tab ? 'gradient' : 'simple'}
      color={props.color}
      right
      round
      size="sm"
      onClick={props.onClick}
    >
      {props.children}
    </Buttons>
  );
}

function Recall(props) {
  const { mergeData, recall, miniActive, onChangeSnackbar } = props;
  const { tab, reload } = recall;
  const [reloadPage, setReloadPage] = useState(null);

  const [index, setIndex] = useState('executiveDocuments');
  const [openDialog, setOpenDialog] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [tabs, setTabs] = useState(tab);
  const [isRecall, setIsRecall] = useState(false);
  const [codeDocs, setCodeDocs] = useState();


  useEffect(() => {
    localStorage.removeItem('IncommingDocumentTab');
    localStorage.removeItem('OutGoingDocumentTab');
    localStorage.removeItem('AuthoriyDocument');
    localStorage.removeItem('WorkingCalendarTab');
    localStorage.removeItem('WorkingMeetingTab');
    localStorage.removeItem('taskCallBack');
    localStorage.removeItem('taskAddCallBack');
    localStorage.removeItem('addWorkingScheduleCallback');
    localStorage.removeItem('editWorkingScheduleCallback');
    localStorage.removeItem('taskChildAddCallBack');
    localStorage.removeItem('taskChildEditCallBack');
    mergeData({ tab: 0 });
  }, []);

  useEffect(
    () => {
      const { tab, reload } = recall;
      setTabs(tab);
    },
    [recall],
  );

  useEffect(
    () => {
      if (props.location.index) {
        setIndex(props.location.index);
      }
    },
    [props.location.index],
  );

  useEffect(
    () => {
      if (props.location.tabtab) {
        setTabs(props.location.tabtab);
        mergeData({ tab: props.location.tabtab });
        setIsRecall(false);
      } else {
        setTabs(0);
        mergeData({ tab: 0 });
        setIsRecall(false);
      }
    },
    [props.location.tabtab],
  );

  const handleChangeTab = (event, newValue) => {
    mergeData({ tab: 0 });
    setIndex(newValue);
    setIsRecall(false);
  };

  const handleCloseAddRecallDialog = () => {
    setOpenDialog(false);
  };

  const WithdrawntDialog = () => {
    setWithdrawn(false);
  };

  const handleOpenAddRecallDialog = () => {
    setOpenDialog(true);
  };

  const OpenRecallsDialog = () => {
    setWithdrawn(true);
  };

  // const recallDocuments = () => (
  //     <Tooltip title="Thu hồi" onClick={handleOpenAddRecallDialog}>
  //         <Lock style={{ color: 'white' }} />
  //     </Tooltip>

  // );

  // const openRecall = () => (
  //     <Tooltip title="Khôi phục" onClick={OpenRecallsDialog}>
  //         <LockOpen style={{ color: 'white' }} />
  //     </Tooltip>
  // );

  const onSuccess = () => {
    setReloadPage(new Date() * 1);
    setSelectedFiles([]);
    setSelectedDocs([]);
  };
  const customProcessStatus = data => {
    let array = [
      { value: '0', name: 'Chưa thực hiện' },
      { value: '1', name: 'Đang thực hiện' },
      { value: '2', name: 'Đã thực hiện' },
      { value: '3', name: 'Đã xử lý' },
    ];
    let item = array.find(f => f.value == data);
    if (item) {
      return item.name;
    }
  };
  const mapFunction = item => {
    const kanbanStt = JSON.parse(localStorage.getItem('crmStatus'));
    const kanbanSttData = kanbanStt && kanbanStt.find(item => item.code === 'ST21').data;

    const customKanbanStt = data => {
      const data1 = data && kanbanSttData && kanbanSttData.find(item => item.type == data);
      return data1 && data1.name;
    };

    const customDate = data => {
      if (data) {
        const times = Number(moment(item.deadline) - moment()) / 86400000;
        if (times < 0) {
          return <p style={{ textAlign: 'left', color: '#e13a3a', wordBreak: 'break-all' }}>{data}</p>;
        } else if (times > 0 && times > 3) {
          return (
            <p
              style={{
                textAlign: 'left',
                wordBreak: 'break-all',
                width: 250,
              }}
            >
              {getShortNote(data, 60)}
            </p>
          );
        } else {
          return <p style={{ textAlign: 'left', color: '#3e9bfa', wordBreak: 'break-all' }}>{data}</p>;
        }
      }
    };
    return {
      ...item,
      documentDate: customDate(item.documentDate),
      toBook: index === "executiveDocuments " ? customDate(item.toBook) : customDate(item.toBook && item.textSymbols ? `${item.toBook}/${item.textSymbols}` : item.toBook ? item.toBook : ""),
      senderUnit: customDate(item.senderUnit),
      abstractNote: customDate(getShortNote(item.abstractNote, 80)),
      name: customDate(item.name),
      secondBook: customDate(item.secondBook),
      receiverUnit: customDate(item.receiverUnit),
      toBookCode: customDate(item.toBookCode),
      kanbanStatus: item.kanbanStatus && customDate(customKanbanStt(item.kanbanStatus)),
      documentType: customDate(item.documentType),
      documentField: customDate(item.documentField),
      receiveMethod: customDate(item.receiveMethod),
      privateLevel: customDate(item.privateLevel),
      urgencyLevel: customDate(item.urgencyLevel),
      signer: customDate(item.signer),
      processStatus: item.processStatus && customDate(customProcessStatus(item.processStatus)),
      currentNote: customDate(item.currentNote),
      currentRole: customDate(item.currentRole),
      nextRole: customDate(item.nextRole),
      letterType: customDate(item.letterType),
      processors: customDate(item.processors),
      processeds: customDate(item.processeds),
      createdBy: customDate(item.createdBy),
      stage: customDate(item.stage),
      currentNote: customDate(item.currentNote ? item.currentNote : ''),
      receiveDate: customDate(item.receiveDate),
      toBookDate: customDate(moment(item.toBookDate).format('DD/MM/YYYY')),
      deadline: item.deadline && item.deadline != 'dd/mm/yyyy' ? customDate(moment(item.deadline).format('DD/MM/YYYY')) : '',
      files: item.originItem.files ? (
        <>
          {item.originItem.files.map(f => (
            <div
              onClick={e => {
                let extension = f.name && getExtensionFile(f.name);
                e.stopPropagation();
                setOpenPreview(true);
                if (extension && FILES.indexOf(extension) === -1) {
                  setSelectedUrl(`${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${f.id}`);
                }
                if (FILES.indexOf(extension) !== -1) {
                  setSelectedUrl(extension);
                  setFilePreview(`${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${f.id}`);
                }
              }}
            >
              {f.name}{' '}
            </div>
          ))}
        </>
      ) : (
        ''
      ),
    };
  };

  function onOpenDetailPage(id, url) {
    props.history.push({
      pathname: `${url}/${id}`,
      recall: 'recall',
      tabtab: tab,
    });
  }

  return (
    <>
      <Grid container justifyContent="space-between">
        <Grid item sm="12">
          <Tabs onChange={handleChangeTab} value={index}>
            <Tab label="Văn bản đến" value="executiveDocuments" />
            <Tab label="Văn bản đi" value="goDocuments" />
          </Tabs>
        </Grid>
      </Grid>
      <PaperUI style={{ zIndex: '0 !important', boxShadow: '#c5c0c0 0.5px 1px 10px', borderRadius: '0px', height: '100%', width: '100%' }}>
        <Grid container>
          <Grid item sm={12}>
            <Bt
              onClick={() => {
                mergeData({ tab: 1 }), setTabs(1);
                setIsRecall(false);
              }}
              color={tab === 1 ? 'gradient' : 'simple'}
            >
              Đã thu hồi
            </Bt>
            <Bt
              onClick={() => {
                mergeData({ tab: 0 }), setTabs(0);
                setIsRecall(false);
              }}
              color={tab === 0 ? 'gradient' : 'simple'}
            >
              Danh sách
            </Bt>
          </Grid>
        </Grid>
        {/* 
                <Grid container justifyContent="space-between" >
                    <Grid item sm="11">
                    </Grid>
                    <Grid item sm style={{ textAlign: 'right', padding: '0 10px' }}>
                        {tab === 0 && (index == 'executiveDocuments' || index == 'goDocuments') && (
                            <Fab size='small' color='primary' variant="contained" onClick={handleOpenAddRecallDialog}>
                                <Tooltip title="Thu hồi" >
                                    <Lock style={{ color: 'white' }} />
                                </Tooltip>
                            </Fab>
                        )}
                        {tab === 1 && (index == 'executiveDocuments' || index == 'goDocuments') && (
                            <Fab size='small' color='primary' variant="contained" onClick={OpenRecallsDialog}>
                                <Tooltip title="Khôi phục" >
                                    <LockOpen style={{ color: 'white' }} />
                                </Tooltip>
                            </Fab>

                        )}
                    </Grid>
                </Grid> */}
        {
          console.log(tabs, "fdjnjv", props.profile)
        }
        {tabs === 0 && (
          <>
            {index === 'executiveDocuments' && (
              <ListPage
                filterStartEnd="documentDate"
                withPagination
                // settingBar={[recallDocuments()]}
                disableAdd
                disableEdit
                onSelectCustomers={val => {
                  const docIds = Array.isArray(val) ? val.map(v => v._id) : [];
                  let files = Array.isArray(val) ? val.map(v => (v.originItem ? v.originItem.files : [])) : [];
                  files = files.reduce((arr, child) => arr.concat([...child]), []);
                  setCodeDocs("IncommingDocument")
                  setSelectedFiles(files);
                  setSelectedDocs(docIds);
                  setIsRecall(true);
                }}
                isRecall={isRecall}
                handleOpenAddRecallDialog={handleOpenAddRecallDialog}
                OpenRecallsDialog={OpenRecallsDialog}
                docIds={selectedDocs}
                tab={tab}
                index={index}
                showDepartmentAndEmployeeFilter
                disableViewConfig
                disableImport
                disableEmployee
                mapFunction={mapFunction}
                code="IncommingDocument"
                employeeFilterKey="createdBy"
                apiUrl={`${API_INCOMMING_DOCUMENT}?receiverUnit=${props.profile && props.profile.organizationUnit && props.profile.organizationUnit.organizationUnitId}`}
                reload={reloadPage}
                enableView
                onRowClick={item => onOpenDetailPage(item._id, 'RecallDocument')}
              />
            )}
            {index === 'goDocuments' && (
              <ListPage
                withPagination
                // settingBar={[recallDocuments()]}
                disableAdd
                isRecall={isRecall}
                disableEdit
                onSelectCustomers={val => {
                  const docIds = Array.isArray(val) ? val.map(v => v._id) : [];
                  let files = Array.isArray(val) ? val.map(v => (v.originItem ? v.originItem.files : [])) : [];
                  files = files.reduce((arr, child) => arr.concat([...child]), []);
                  setSelectedFiles(files);
                  setSelectedDocs(docIds);
                  setIsRecall(true);
                  setCodeDocs("OutGoingDocument")
                }}
                handleOpenAddRecallDialog={handleOpenAddRecallDialog}
                OpenRecallsDialog={OpenRecallsDialog}
                tab={tab}
                index={index}
                docIds={selectedDocs}
                showDepartmentAndEmployeeFilter
                enableView
                disableEmployee
                disableViewConfig
                disableImport
                filter={{ completeStatus: 'promulgated', stage: 'complete' }}
                mapFunction={mapFunction}
                code="OutGoingDocument"
                employeeFilterKey="createdBy"
                apiUrl={`${API_GOING_DOCUMENT}?code=senderUnit`}
                reload={reloadPage}
                onRowClick={item => onOpenDetailPage(item._id, 'OutGoingDocument/editGoDocuments')}
              />
            )}
          </>
        )}
        {tabs === 1 && (
          <>
            {index === 'executiveDocuments' && (
              <ListPage
                withPagination
                // settingBar={[openRecall()]}
                disableAdd
                disableEdit
                onSelectCustomers={val => {
                  const docIds = Array.isArray(val) ? val.map(v => v._id) : [];
                  let files = Array.isArray(val) ? val.map(v => (v.originItem ? v.originItem.files : [])) : [];
                  files = files.reduce((arr, child) => arr.concat([...child]), []);
                  setSelectedFiles(files);
                  setSelectedDocs(docIds);
                  setIsRecall(true);
                }}
                isRecall={isRecall}
                handleOpenAddRecallDialog={handleOpenAddRecallDialog}
                OpenRecallsDialog={OpenRecallsDialog}
                tab={tab}
                index={index}
                docIds={selectedDocs}
                showDepartmentAndEmployeeFilter
                disableViewConfig
                disableImport
                disableEmployee
                mapFunction={mapFunction}
                code="IncommingDocument"
                employeeFilterKey="createdBy"
                // apiUrl={API_INCOMMING_DOCUMENT}
                apiUrl={`${API_INCOMMING_DOCUMENT}?receiverUnit=${props.profile && props.profile.organizationUnit && props.profile.organizationUnit.organizationUnitId}`}
                filter={{ status: 2 }}
                reload={reloadPage}
                enableView
                onRowClick={item => onOpenDetailPage(item._id, 'RecallDocument')}
              />
            )}
            {index === 'goDocuments' && (
              <ListPage
                withPagination
                // settingBar={[openRecall()]}
                disableAdd
                disableEdit
                onSelectCustomers={val => {
                  const docIds = Array.isArray(val) ? val.map(v => v._id) : [];
                  let files = Array.isArray(val) ? val.map(v => (v.originItem ? v.originItem.files : [])) : [];
                  files = files.reduce((arr, child) => arr.concat([...child]), []);
                  setSelectedFiles(files);
                  setSelectedDocs(docIds);
                  setIsRecall(true);
                }}
                handleOpenAddRecallDialog={handleOpenAddRecallDialog}
                OpenRecallsDialog={OpenRecallsDialog}
                isRecall={isRecall}
                tab={tab}
                index={index}
                docIds={selectedDocs}
                showDepartmentAndEmployeeFilter
                enableView
                disableEmployee
                disableViewConfig
                disableImport
                mapFunction={mapFunction}
                code="OutGoingDocument"
                employeeFilterKey="createdBy"
                apiUrl={`${API_GOING_DOCUMENT}?code=senderUnit`}
                filter={{ status: 2, completeStatus: 'promulgated', stage: 'complete' }}
                reload={reloadPage}
                onRowClick={item => onOpenDetailPage(item._id, 'OutGoingDocument/editGoDocuments')}
              />
            )}
          </>
        )}
      </PaperUI>
      <AddRecall
        // profile={props.profile}
        codeDocs={codeDocs}
        code="Documentary"
        onChangeSnackbar={onChangeSnackbar}
        open={openDialog}
        docIds={selectedDocs}
        onClose={handleCloseAddRecallDialog}
        files={selectedFiles}
        index={index}
        onSuccess={onSuccess}
        openDialog={openDialog}
      />

      <Withdrawn
        // profile={props.profile}
        code="Documentary"
        onChangeSnackbar={onChangeSnackbar}
        open={withdrawn}
        docIds={selectedDocs}
        files={selectedFiles}
        onClose={WithdrawntDialog}
        index={index}
        onSuccess={onSuccess}
        withdrawn={withdrawn}
      />
    </>
  );
}

Recall.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  recall: makeSelectRecall(),
  miniActive: makeSelectMiniActive(),
  // dashboardPage: makeSelectDashboardPage(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    mergeData: data => dispatch(mergeData(data)),
    onChangeSnackbar: obj => dispatch(changeSnackbar(obj)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'recall', reducer });
// const withSaga = injectSaga({ key: 'recall', saga });

export default compose(
  withReducer,
  // withSaga,
  withConnect,
)(Recall);
