import React, { useState, useEffect } from 'react';
import { Grid, Fab, Menu, MenuItem, withStyles } from '@material-ui/core';
import { ArrowDropDown, ChatBubbleOutline, Replay, Send, CheckBox } from '@material-ui/icons';
// import styles from './styles';

function FabsBtn(props) {
  const {
    rootTab = '',
    canView = false,
    openDialog,
    openDialogResponse,
    handleOpen,
    handleOpenDialogReturn,
    handleOpenDialogDoc,
    handleSelectTemplate,
    handleSelectReturnTemplate,
    templates = [],
    checkShowReturn,
    handleClose,
    handleSelectTemplateYk,
    docType = '',
    typePage = '',
    openSetCommanders,
    employeeReturn = [],
    data,
    profile,
    openDialogSupport,
    openDialogCommand,
    roles,
    tab,
    docData,
    roleDepartment,
  } = props || {};

  const [showTemplates, setShowTemplates] = useState(false);
  const [item] = employeeReturn;
  const handleShowTemplates = () => {
    setShowTemplates(true);
  };

  const checkProcess = data => {
    if (data && templates && rootTab !== 'viewers') {
      return true;
    }
    return false;
  };
  const checkEndFlow = array => {
    let result = true;
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
    } else {
      result = false;
    }
    return result;
  };

  const getDataSupport = () => {
    const { supporteds = [] } = data || {};
    const { supporters = [] } = data || {};
    if (data && data.childrenSupport) {
      const support = [...supporteds, ...supporters];
      const childrenSupport = data.childrenSupport.filter(f => f && f.code == profile.roleGroupSource);
      if (data && data.supportAndIdTree && data.supportAndIdTree.length) {
        // const
        const supportAndIdTree = data.supportAndIdTree.find(it => it.idSupporter === profile._id) || {};
        const dataSP = childrenSupport.find(it => it.idTree === supportAndIdTree.idTree)
          ? [childrenSupport.find(it => it.idTree === supportAndIdTree.idTree)]
          : [];
        return dataSP;
      }
      return [];
    }
  };

  const isAuthority = data && profile && data.authorized && data.authorized === profile._id;

  const canFeedBack =
    roles && roles.set_feedback && (rootTab === 'processors' || rootTab === 'supporters' || rootTab === 'viewers') && (tab == 0 || tab == 4);
  const canProcess = data && checkProcess(data);
  const commandHasProcess =
    rootTab === 'processors' && data && data.processors && profile && data.processors.findIndex(f => f === profile._id) !== -1 ? true : false;
  const isCommandeds =
    data && data.commander && data.processors && profile && data.commander.findIndex(f => f === profile._id) !== -1 && data.processors.length === 0
      ? true
      : false;
  const isProcessor = data && data.processors && profile && data.processors.findIndex(f => f === profile._id) !== -1 ? true : false;
  const isSupporter = data && data.supporters && profile && data.supporters.findIndex(f => f === profile._id) !== -1 ? true : false;
  // Authory
  const isProcessorAuthor = data && data.processors && data.author && data.processors.findIndex(f => f === data.author) !== -1 ? true : false;
  const isSupporterAuthor = data && data.author && data.supporters && data.supporters.findIndex(f => f === data.author) !== -1 ? true : false;
  const isEndFlow = checkEndFlow(data.children);

  const isEndCommand = data.childrenCommander && data.childrenCommander.length > 0 ? checkEndFlow(data.childrenCommander) : false;
  const dataSupport = getDataSupport() || [];
  const isEndSupport = checkEndFlow(dataSupport);
  const canDraft = rootTab !== 'receive' && rootTab !== 'viewers';

  const isDocFormAny = data && profile && !data.complete ? true : data.complete && data.complete.indexOf(profile._id) === -1 ? true : false;
  const rootTabCanProcess =
    rootTab === 'receive' ||
    (rootTab !== 'supporters' &&
      rootTab !== 'commander' &&
      canProcess &&
      (((isProcessor && isEndFlow) || (isProcessorAuthor && isEndFlow)) && isDocFormAny));

  return (
    <>

      {rootTab !== 'feedback' &&
        canView && (
          <Grid item container spacing={16} sm={5} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            {canDraft && (
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
                    props.history && props.history.push(`/OutGoingDocument/add?docId=${docData._id}&toBookCode=${data.toBookCode}&isDraft=true`);
                  }}
                >
                  Tạo dự thảo
                </span>
              </Fab>
            )}
            {rootTab === 'viewers' && (
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
                    props.setOpenDialogViewer && props.setOpenDialogViewer(true, 'in');
                  }}
                >
                  Đã xem
                </span>
              </Fab>
            )}

            {(canFeedBack || (canFeedBack && isAuthority)) && (
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
                    handleOpen && handleOpen(e, 'command');
                  }}
                >
                  Xin ý kiến
                </span>
              </Fab>
            )}
            {/* {checkShowReturn() && */}
            {commandHasProcess || isCommandeds || isProcessor || (isAuthority && (isCommandeds || commandHasProcess || isProcessorAuthor)) ? (
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
                  id="idBtnReturn"
                  onClick={e => {
                    if (rootTab !== 'receive') {
                      handleOpen && handleOpen(e, rootTab, true);
                      return;
                    }
                  }}
                >
                  Trả lại
                </span>
              </Fab>
            ) : null}

            {/* đến */}

            {rootTabCanProcess && (
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
                    handleOpen && handleOpen(e, rootTab);
                    return;
                  }}
                >
                  Chuyển xử lý
                </span>
              </Fab>
            )}
            {rootTab === 'supporters' &&
              ((isSupporter && isEndSupport) || (isAuthority && isSupporterAuthor && isEndSupport)) && (
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
                      handleOpen && handleOpen(e, rootTab);
                      return;
                    }}
                  >
                    Chuyển xử lý
                  </span>
                </Fab>
              )}
            {/* {
              <Fab variant="extended" size="small" color="primary" aria-label="add" style={{
                  minWidth: '150px!important',
                  height: '30px!important',
                  marginRight: 10,
                  boxShadow: 'none',
                }}>
                <span
                  style={{ fontSize: '0.8125rem' }}
                  onClick={e => {
                    handleOpenDialogReturn && handleOpenDialogReturn(e, rootTab);
                    return;
                  }}
                >
                  Thu hồi
                </span>
              </Fab>
            } */}
            {rootTab === 'commander' &&
              isEndCommand && (
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
                      handleOpen && handleOpen(e, rootTab);
                      return;
                    }}
                  >
                    Chuyển xử lý
                  </span>
                </Fab>
              )}

            {/* tra lai */}
            {openDialogResponse && (
              <Menu
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
                {/* <MenuItem
                value="any"
                onClick={e => {
                  handleOpenDialogDoc && handleOpenDialogDoc(true, 'any');
                }}
              >
                Trả bất kỳ
              </MenuItem> */}
                <MenuItem
                  value="flow"
                  onClick={e => {
                    handleOpenDialogDoc && handleOpenDialogDoc(true, 'flow', 'backFlow');
                    handleSelectReturnTemplate && handleSelectReturnTemplate(true, data.children, 'flow');
                  }}
                >
                  Trả theo luồng
                </MenuItem>
                <MenuItem
                  value="startFlow"
                  onClick={e => {
                    handleOpenDialogDoc && handleOpenDialogDoc(true, 'startFlow', 'startFlow');
                  }}
                >
                  Trả cho văn thư
                </MenuItem>
              </Menu>
            )}

            {/* chuyen xu ly */}
            <Menu open={Boolean(openDialog)} anchorEl={openDialog} onClose={handleClose}>
              {data.children && data.children.length > 0 ? (
                <>
                  <div style={{ alignItems: 'center', padding: '0 10px' }}>
                    {rootTab !== 'supporters' && (
                      <MenuItem
                        value={'name'}
                        onClick={() => {
                          handleSelectTemplate && handleSelectTemplate(true, data.children, 'any');
                        }}
                      >
                        <span style={{ paddingLeft: 10 }}>Chuyển tùy chọn</span>
                      </MenuItem>
                    )}
                    {Array.isArray(data.children) &&
                      data.children.length > 0 &&
                      data.children.map(t => (
                        <>
                          {t.children &&
                            t.children.length > 0 &&
                            t.children.map(item => (
                              <MenuItem
                                value={item && item.code}
                                onClick={() => {
                                  handleSelectTemplate && handleSelectTemplate(true, item, 'flow');
                                }}
                              >
                                <span style={{ paddingLeft: 10 }}> Chuyển cho {item.name}</span>
                              </MenuItem>
                            ))}
                          {t.children &&
                            t.children.length === 0 && (
                              <MenuItem
                                value={t && t.code}
                                onClick={() => {
                                  handleSelectTemplate && handleSelectTemplate(true, t, 'flow');
                                }}
                              >
                                <span style={{ paddingLeft: 10 }}> Chuyển cho {t.name}</span>
                              </MenuItem>
                            )}
                        </>
                      ))}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ alignItems: 'center', padding: '0 10px' }}>
                    {rootTab !== 'supporters' && (
                      <MenuItem
                        value={'name'}
                        onClick={() => {
                          handleSelectTemplate && handleSelectTemplate(true, templates[0].children, 'any');
                        }}
                      >
                        <span style={{ paddingLeft: 10 }}>Chuyển tùy chọn</span>
                      </MenuItem>
                    )}
                    {Array.isArray(templates) &&
                      rootTab !== 'receive' &&
                      templates.map(t => (
                        <MenuItem
                          value={t && t.code}
                          onClick={() => {
                            handleSelectTemplate && handleSelectTemplate(true, t);
                          }}
                        >
                          <span style={{ paddingLeft: 10 }}>{t.name}</span>
                        </MenuItem>
                      ))}

                    {Array.isArray(templates) &&
                      templates.map(t => (
                        <>
                          {
                            <>
                              {Array.isArray(t.children) &&
                                t.children.length > 0 &&
                                t.children[0] &&
                                t.children[0].code === profile.roleGroupSource &&
                                t.children[0].children.length > 0 && (
                                  <>
                                    {t.children[0].children.map(item => (
                                      <MenuItem
                                        value={item && item.code}
                                        onClick={() => {
                                          handleSelectTemplate && handleSelectTemplate(true, item, 'flow');
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
            {/* xin yk */}
            <Menu open={Boolean(openSetCommanders)} anchorEl={openSetCommanders} onClose={handleClose}>
              {data.children && data.children.length > 0 ? (
                <>
                  <div style={{ alignItems: 'center', padding: '0 10px' }}>
                    <MenuItem
                      value={'name'}
                      onClick={() => {
                        handleSelectTemplateYk && handleSelectTemplateYk(true, data.children, 'any');
                      }}
                    >
                      <span style={{ paddingLeft: 10 }}>
                        {/* Xin ý kiến bất kỳ */}
                        Xin ý kiến tùy chọn
                      </span>
                    </MenuItem>
                    {/* {
                      Array.isArray(data.children) && data.children.length > 0 &&
                      data.children.map(t => (
                        <>
                          {t.children && t.children.length > 0 && t.children.map(item => (
                            <MenuItem
                              value={item.code}
                              onClick={() => {
                                handleSelectTemplateYk && handleSelectTemplateYk(true, item, 'flow');
                              }}
                            >
                              <span style={{ paddingLeft: 10 }}> Xin ý kiến {item.name}</span>
                            </MenuItem>
                          ))}
                          {t.children && t.children.length === 0 && (
                            <MenuItem
                              value={t.code}
                              onClick={() => {
                                handleSelectTemplateYk && handleSelectTemplateYk(true, t, 'flow');
                              }}
                            >
                              <span style={{ paddingLeft: 10 }}> Xin ý kiến {t.name}</span>
                            </MenuItem>
                          )}

                        </>
                      ))} */}
                    {data.children[0].consult !== null &&
                      data.children[0].consult !== undefined &&
                      data.children[0] && (
                        <>
                          <MenuItem
                            value={data && data.children && data.children[0] && data.children[0].code}
                            onClick={() => {
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
                        <span style={{ paddingLeft: 10 }}>
                          {/* Xin ý kiến bất kỳ */}
                          Xin ý kiến tùy chọn
                        </span>
                      </MenuItem>
                    )}
                    {/* {
                        Array.isArray(templates) &&
                        rootTab !== 'receive' &&
                        templates.map(t => (
                          <MenuItem
                            value={t.code}
                            onClick={() => {
                              handleSelectTemplateYk && handleSelectTemplateYk(true, t);
                            }}
                          >
                            <span style={{ paddingLeft: 10 }}>{t.name}</span>
                          </MenuItem>
                        ))} */}

                    {/* {Array.isArray(templates) &&
                        templates.map(t => (
                          <>
                            {
                              <>
                                {Array.isArray(t.children) && t.children.length > 0 && t.children[0] && t.children[0].code === profile.roleGroupSource && t.children[0].children.length > 0 && (
                                  <>
                                    {t.children[0].children.map(item => (
                                      <MenuItem
                                        value={item.code}
                                        onClick={() => {
                                          handleSelectTemplateYk && handleSelectTemplateYk(true, item, 'flow');
                                        }}
                                      >
                                        <span>Xin ý kiến {item.name}</span>
                                      </MenuItem>
                                    ))}
                                  </>
                                )}
                              </>
                            }
                          </>
                        ))} */}
                  </div>
                </>
              )}
            </Menu>
            {/* chỉ đạo*/}

            <Menu open={Boolean(openDialogCommand)} anchorEl={openDialogCommand} onClose={handleClose}>
              <>
                <div style={{ alignItems: 'center', padding: '0 10px' }}>
                  <MenuItem
                    value={'name'}
                    onClick={() => {
                      handleSelectTemplate && handleSelectTemplate(true, data.childrenCommander, 'any');
                    }}
                  >
                    <span style={{ paddingLeft: 10 }}>Chuyển tùy chọn</span>
                  </MenuItem>
                  {/* chỉ đạo like process*/}
                  {Array.isArray(data.childrenCommander) &&
                    data.childrenCommander.length > 0 &&
                    data.childrenCommander.map(t => (
                      <>
                        {t.children &&
                          t.children.length > 0 &&
                          t.children.map(item => (
                            <MenuItem
                              value={item && item.code}
                              onClick={() => {
                                handleSelectTemplate && handleSelectTemplate(true, item, 'command');
                              }}
                            >
                              <span style={{ paddingLeft: 10 }}> Chuyển cho {item.name}</span>
                            </MenuItem>
                          ))}
                        {t.children &&
                          t.children.length === 0 && (
                            <MenuItem
                              value={t && t.code}
                              onClick={() => {
                                handleSelectTemplate && handleSelectTemplate(true, t, 'command');
                              }}
                            >
                              <span style={{ paddingLeft: 10 }}> Chuyển cho {t.name}</span>
                            </MenuItem>
                          )}
                      </>
                    ))}
                </div>
              </>
            </Menu>
            {/* phối hợp xử lý */}
            <Menu open={Boolean(openDialogSupport)} anchorEl={openDialogSupport} onClose={handleClose}>
              <>
                <div style={{ alignItems: 'center', padding: '0 10px' }}>
                  <MenuItem
                    value={'name'}
                    onClick={() => {
                      handleSelectTemplate && handleSelectTemplate(true, dataSupport, 'any');
                    }}
                  >
                    <span style={{ paddingLeft: 10 }}>Chuyển tùy chọn</span>
                  </MenuItem>
                  {dataSupport &&
                    dataSupport.length > 0 &&
                    dataSupport.map(t => (
                      <>
                        {t.children &&
                          t.children.length > 0 &&
                          t.children.map(item => (
                            <MenuItem
                              value={item && item.code}
                              onClick={() => {
                                handleSelectTemplate && handleSelectTemplate(true, item, 'support');
                              }}
                            >
                              <span style={{ paddingLeft: 10 }}> Chuyển cho {item.name}</span>
                            </MenuItem>
                          ))}
                        {t.children &&
                          t.children.length === 0 && (
                            <MenuItem
                              value={t && tab.code}
                              onClick={() => {
                                handleSelectTemplate && handleSelectTemplate(true, t, 'support');
                              }}
                            >
                              <span style={{ paddingLeft: 10 }}> Chuyển cho {t.name}</span>
                            </MenuItem>
                          )}
                      </>
                    ))}
                  {/* : data.childrenSupport.map(t => (
                        <>
                          {t.children && t.children.length > 0 && t.children.map(item => (
                            <MenuItem
                              value={item.code}
                              onClick={() => {
                                handleSelectTemplate && handleSelectTemplate(true, item, 'support');
                              }}
                            >
                              <span style={{ paddingLeft: 10 }}> Chuyển cho {item.name}</span>
                            </MenuItem>
                          ))}
                          {t.children && t.children.length === 0 && (
                            <MenuItem
                              value={t.code}
                              onClick={() => {
                                handleSelectTemplate && handleSelectTemplate(true, t, 'support');
                              }}
                            >
                              <span style={{ paddingLeft: 10 }}> Chuyển cho {t.name}</span>
                            </MenuItem>
                          )}

                        </>
                      ))} */}
                </div>
              </>
            </Menu>
          </Grid>
        )}
    </>
  );
}

// export default withStyles(styles)(FabsBtn);
export default FabsBtn;
