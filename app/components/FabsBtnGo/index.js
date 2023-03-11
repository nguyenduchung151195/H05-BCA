import React, { useState, useEffect } from 'react';
import { Grid, Fab, Menu, MenuItem, withStyles } from '@material-ui/core';
import { API_AUTHORY_PROFILE } from '../../config/urlConfig';
import { ArrowDropDown, ChatBubbleOutline, Replay, Send, Check } from '@material-ui/icons';
import { fetchData, serialize } from '../../helper';
// import styles from './styles';

function FabsBtnGo(props) {
  const {
    classes,
    rootTab = '',
    canView = false,
    openDialog,
    openDialogResponse,
    handleOpen,
    handleOpenDialogDoc,
    handleSelectTemplate,
    templates = [],
    checkShowReturn,
    handleClose,
    isAuthory = false,
    docType = '',
    typePage = '',
    employeeReturn = [],
    data,
    profile,
    roles,
    tab,
    openDialogConsult,
    handleSelectTemplateYk,
    setOpenSetCommanders,
    canReturnDoc = false,
  } = props || {};

  const [showTemplates, setShowTemplates] = useState(false);
  const [item] = employeeReturn;
  const handleShowTemplates = () => {
    setShowTemplates(true);
  };

  const checkCanProcess = data => {
    if (data && templates) {
      return true;
    }
    return false;
    // console.log('templates', templates);
    // let result = false;
    // if (templates) {
    //     templates.map(temp => {
    //         if (temp.children) {
    //             let find = temp.children && temp.children.find(f => f.code === profile.roleGroupSource);
    //             if (find) {
    //                 if (!find.children) {
    //                     result = false;
    //                 }
    //                 if (find.children && find.children.length === 0) {
    //                     result = false;
    //                 }
    //                 if (find.children && find.children.length > 0) {
    //                     result = true;
    //                 }
    //             }
    //         }
    //     })
    // }
    // return result;
  };

  const checkEndFlow = (array = []) => {
    let result = false;
    if (array && array.length > 0) {
      array.map(item => {
        if (item.children && item.children.length === 0) {
          result = false;
        }
        if (!item.children) {
          result = false;
        }
        if (item.children && item.children.length > 0) {
          result = true;
        }
      });
    }
    if (array.length === 0) {
      result = false;
    }
    return result;
  };

  const isAuthority = data && profile && data.authorized && data.authorized === profile._id;
  const canFeedBack = roles && roles.set_feedback && rootTab !== 'receive';
  // const cantReturn = tab !== 6 && rootTab !== 'receive' && rootTab !== 'promulgate';
  const canReturn = roles && roles.returnDocs && tab !== 6 && rootTab !== 'receive' && rootTab !== 'promulgate';
  const isEndFlow = data && data.children && checkEndFlow(data.children);
  const isProcessor = data && data.processors && profile && data.processors.findIndex(f => f === profile._id) !== -1 ? true : false;
  const isProcessorAuthor =
    isAuthory && data && data.author && data.processors && data.processors.findIndex(f => f === data.author) !== -1 ? true : false;

  const canProcess = templates && profile && checkCanProcess(templates, profile);
  // check receive btn
  const isCanProcessor = (isProcessor || rootTab === 'receive' || isProcessorAuthor) && canProcess;
  // complete
  const completeAuthor = isAuthory && data && data.author && data.signer && data.author === data.signer._id ? true : false;
  const complete = data && profile && data.signer && data.signer._id === profile._id ? true : false;

  const canComplete = completeAuthor || complete;
  const isDocFormAny = data && profile && !data.complete ? true : data.complete && data.complete.indexOf(profile._id) === -1 ? true : false;
  const rootTabCanProcess =
    rootTab === 'receive' ||
    (rootTab !== 'supporters' &&
      rootTab !== 'commander' &&
      canProcess &&
      (((isProcessor && isEndFlow) || (isProcessorAuthor && isEndFlow)) && isDocFormAny));
  const canRransferProcessing = data && data.releasePartStatus === 'waitting' ? false : true; // khi đang chờ ban hành thì k đc chuyển

  return (
    <>
      {rootTab !== 'feedback' &&
        rootTab !== 'textGo' &&
        canView && (
          <Grid item container spacing={16} sm={4} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            {(canFeedBack || (isAuthority && canFeedBack)) && (
              <Fab
                variant="extended"
                size="small"
                color="primary"
                aria-label="add"
                style={{
                  minWidth: '150px!important',
                  height: '30px!important',
                  marginRight: 10,
                  boxShadow: 'none',
                }}
              >
                {/* <span className={classes.icon}>
                                <ChatBubbleOutline sx={{ mr: 1 }} />
                            </span> */}
                <span
                  style={{ fontSize: '0.8125rem' }}
                  onClick={e => {
                    handleOpen && handleOpen(e, 'command');
                  }}
                >
                  Xin ý kiến
                </span>
              </Fab>
            )}

            {/* {isReturn && (canReturn || (canReturn && isAuthority)) ? ( */}

            {canReturnDoc && (canReturn || (canReturn && isAuthority)) ? (
              <Fab
                variant="extended"
                size="small"
                color="primary"
                aria-label="add"
                style={{
                  minWidth: '150px!important',
                  height: '30px!important',
                  marginRight: 10,
                  boxShadow: 'none',
                }}
              >
                {/* <span className={classes.icon}>
                                <Replay sx={{ mr: 1 }} />
                            </span> */}
                <span
                  style={{ fontSize: '0.8125rem' }}
                  onClick={e => {
                    if (rootTab !== 'receive') {
                      // handleOpen && handleOpen(e, rootTab, true);
                      handleOpenDialogDoc && handleOpenDialogDoc(true, 'flow', 'OutgoingDocument');
                      return;
                    }
                  }}
                >
                  Trả lại
                </span>
              </Fab>
            ) : null}

            {/* đi */}

            {canRransferProcessing &&
              rootTabCanProcess &&
              isCanProcessor &&
              !canComplete && (
                <Fab
                  variant="extended"
                  size="small"
                  color="primary"
                  aria-label="add"
                  style={{
                    minWidth: '150px!important',
                    height: '30px!important',
                    marginRight: 10,
                    boxShadow: 'none',
                  }}
                >
                  {/* <span className={classes.icon}>
                                <Send sx={{ mr: 1 }} />
                            </span> */}
                  <span
                    style={{ fontSize: '0.8125rem' }}
                    onClick={e => {
                      if (rootTab === 'receive' || rootTab === 'processors') {
                        handleOpen && handleOpen(e, rootTab);
                        return;
                      }
                      handleOpenDialogDoc(true, 'assign');
                    }}
                  >
                    {rootTab === 'receive' ? 'Trình ký' : 'Chuyển xử lý'}
                  </span>
                </Fab>
              )}
            {/* tra lai */}
            {/* <Menu
                        open={Boolean(openDialogResponse)}
                        anchorEl={openDialogResponse}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        onClose={handleClose}
                    >
                        <MenuItem
                            value="flow"
                            onClick={e => {
                                handleOpenDialogDoc && handleOpenDialogDoc(true, 'flow');

                            }}
                        >
                            Trả cho {item ? item.name : ''}
                        </MenuItem>

                    </Menu> */}
            {rootTab === 'promulgate' ? (
              <Fab
                variant="extended"
                size="small"
                color="primary"
                style={{
                  minWidth: '150px!important',
                  height: '30px!important',
                  marginRight: 10,
                  boxShadow: 'none',
                }}
              >
                {/* <span style={{ marginRight: 5 }}>
                                <Check sx={{ mr: 1 }} />
                            </span> */}
                <span
                  style={{ fontSize: '0.8125rem' }}
                  onClick={e => {
                    handleOpenDialogDoc && handleOpenDialogDoc(true, 'release');
                  }}
                >
                  Ban hành
                </span>
              </Fab>
            ) : null}

            {/* chuyen xu ly */}

            <Menu open={Boolean(openDialog)} anchorEl={openDialog} onClose={handleClose}>
              {data.children && data.children.length > 0 ? (
                <>
                  <div style={{ alignItems: 'center', padding: '0 10px' }}>
                    {Array.isArray(data.children) &&
                      data.children.map(t => (
                        <>
                          {t.children &&
                            t.children.map(item => (
                              <MenuItem
                                value={item.code}
                                onClick={() => {
                                  handleSelectTemplate && handleSelectTemplate(true, item, t);
                                }}
                              >
                                <span style={{ paddingLeft: 10 }}> Chuyển cho {item.name}</span>
                              </MenuItem>
                            ))}
                        </>
                      ))}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ alignItems: 'center', padding: '0 10px' }}>
                    {Array.isArray(templates) &&
                      rootTab !== 'receive' &&
                      templates.map(t => (
                        <MenuItem
                          value={t.code}
                          onClick={() => {
                            handleSelectTemplate && handleSelectTemplate(true, t);
                          }}
                        >
                          <span style={{ paddingLeft: 10 }}>{t.name}</span>
                        </MenuItem>
                      ))}
                    {Array.isArray(templates) &&
                      rootTab === 'receive' &&
                      templates.map(t => (
                        <>
                          {
                            <>
                              {t.children && (
                                <>
                                  {t.children.find(f => f.code === profile.roleGroupSource) &&
                                    t.children.find(f => f.code === profile.roleGroupSource).children &&
                                    t.children.find(f => f.code === profile.roleGroupSource).children.map(item => (
                                      <MenuItem
                                        value={item.code}
                                        onClick={() => {
                                          handleSelectTemplate && handleSelectTemplate(true, item, t);
                                        }}
                                      >
                                        <span>Chuyển cho {item.name}</span>
                                      </MenuItem>
                                    ))}
                                </>
                              )}
                            </>
                          }
                        </>
                      ))}
                  </div>
                </>
              )}
            </Menu>

            {/* xin ý kiến */}

            <Menu open={Boolean(openDialogConsult)} anchorEl={openDialogConsult} onClose={handleClose}>
              {data.children && data.children.length > 0 ? (
                <>
                  <div style={{ alignItems: 'center', padding: '0 10px' }}>
                    <MenuItem
                      value={'name'}
                      onClick={() => {
                        setOpenSetCommanders(true);
                        handleSelectTemplateYk && handleSelectTemplateYk(true, data.children, 'any');
                      }}
                    >
                      <span style={{ paddingLeft: 10 }}>Xin ý kiến bất kỳ</span>
                    </MenuItem>
                    {data.children[0].consult !== null &&
                      data.children[0].consult !== undefined &&
                      data.children[0] && (
                        <>
                          <MenuItem
                            value={data.children[0].code}
                            onClick={() => {
                              setOpenSetCommanders(true);
                              handleSelectTemplateYk && handleSelectTemplateYk(true, data.children[0], 'flow');
                            }}
                          >
                            <span style={{ paddingLeft: 10 }}>
                              {' '}
                              Xin ý kiến{' '}
                              {data.children[0].consult === 'up'
                                ? 'cấp trên'
                                : data.children[0].consult === 'equal'
                                  ? 'ngang cấp'
                                  : data.children[0].consult === 'upandequal'
                                    ? 'cấp trên và ngang cấp'
                                    : ''}
                            </span>
                          </MenuItem>
                        </>
                      )}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ alignItems: 'center', padding: '0 10px' }}>
                    {rootTab !== 'supporters' && (
                      <MenuItem
                        value={'name'}
                        onClick={() => {
                          handleSelectTemplateYk && handleSelectTemplateYk(true, templates[0].children, 'any');
                        }}
                      >
                        <span style={{ paddingLeft: 10 }}>Xin ý kiến bất kỳ</span>
                      </MenuItem>
                    )}
                  </div>
                </>
              )}
            </Menu>
          </Grid>
        )}

      {canView && (
        <Grid item container spacing={16} sm={4} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          {rootTab === 'textGo' && (
            <Fab
              variant="extended"
              size="small"
              color="primary"
              aria-label="add"
              style={{
                minWidth: '150px!important',
                height: '30px!important',
                marginRight: 10,
                boxShadow: 'none',
              }}
            >
              <span
                style={{ fontSize: '0.8125rem' }}
                onClick={e => {
                  props.setOpenDialogViewer && props.setOpenDialogViewer(true, 'Out');
                }}
              >
                Đã xem
              </span>
            </Fab>
          )}
        </Grid>
      )}
    </>
  );
}

// export default withStyles(styles)(FabsBtnGo);
export default FabsBtnGo;

