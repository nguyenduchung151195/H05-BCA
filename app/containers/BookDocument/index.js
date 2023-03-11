import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Tab, Tabs } from '../../components/LifetekUi';
import ListPage from 'components/List';
import { Paper, Tooltip, withStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons'
import { API_BOOK_DOCUMENT } from '../../config/urlConfig';
import AddBookDocument from './AddBookDocument';
import request from '../../utils/request';
import { changeSnackbar } from '../Dashboard/actions';

import { makeSelectProfile } from '../Dashboard/selectors';
import { createStructuredSelector } from 'reselect';
import styles from './styles';

function BookDocument(props) {
    const { onChangeSnackbar, profile, classes } = props;
    const [tab, setTab] = useState(localStorage.getItem('tabBookDocument') ? localStorage.getItem('tabBookDocument') : 'IncommingDocument')
    const [openDialog, setOpenDialog] = useState(false);
    const [error, setError] = useState(false)
    const [id, setId] = useState('');


    const handleOpenDialog = () => {
        setOpenDialog(true)
        setError(false);
    }

    const handleChangeTab = useCallback((value) => {
        setTab(value);
    }, [tab])

    useEffect(() => {
        localStorage.setItem('tabBookDocument', tab)
    }, [tab])


    const addButton = useCallback(() => {
        if (tab === 'IncommingDocument') {
            return (
                <Tooltip title="Thêm mới sổ văn bản đến" onClick={handleOpenDialog}>
                    <Add style={{ color: 'white' }} />
                </Tooltip>
            );
        }
        if (tab === 'OutGoingDocument') {
            return (
                <Tooltip title="Thêm mới sổ văn bản đi" onClick={handleOpenDialog}>
                    <Add style={{ color: 'white' }} />
                </Tooltip>
            );
        }
    }, [tab])


    const handleClose = () => {
        setOpenDialog(false);
        setId('');
    }
    const handleViewDetail = (id, tab) => {
        // props.history.push(`/BookDocument/${id}`)
        props.history.push({
            pathname: `/BookDocument/${id}`,
            state: {  // location state
                tab: tab,
            },
        })

    }
    const mapFunction = (item) => {
        return {
            ...item,
            active: (
                <p className={item.active ? classes.active : classes.deactive}   >{item.active ? 'Hoạt động' : 'Không hoạt động'}</p>
            )
        }
    }

    const handleSave = useCallback((data) => {
        try {
            setError(false)
            const { bookDocumentId, ...rest } = data;
            let body = { ...rest }
            body = {
                ...body,
                count: body.count ? parseInt(body.count) : 1,
                year: body && body.year ? body.year.value : '',
                typeDocument: bookDocumentId,
                senderUnit: profile && profile.organizationUnit && profile.organizationUnit.organizationUnitId
            }
            console.log(body, 'body')
            let url = id ? `${API_BOOK_DOCUMENT}/${id}` : `${API_BOOK_DOCUMENT}`
            request(url, {
                method: id ? 'PUT' : 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }).then(res => {
                setError(false);
                setOpenDialog(false)
                onChangeSnackbar({ variant: 'success', message: id ? "Cập nhật sổ văn bản thành công" : 'Thêm sổ văn bản thành công', status: true });
                handleClose();

            }).catch(error => {
                setError(true)
                if (error.message) {
                    onChangeSnackbar({ variant: 'error', message: error.message, status: true });
                }
            })
        } catch (error) {
            setError(true)
            // console.log(error)
        }

    }, [openDialog])


    return (
        <>
            <>
                <Tabs value={tab} onChange={(e, v) => handleChangeTab(v)} aria-label="simple tabs example">
                    <Tab value={'IncommingDocument'} label={'Văn bản đến'} />
                    <Tab value={'OutGoingDocument'} label={'Văn bản đi'} />
                </Tabs>
                {tab === 'IncommingDocument' && (
                    <Paper style={{ zIndex: '0 !important', boxShadow: '#c5c0c0 0.5px 1px 10px', borderRadius: '0px', height: '100%', width: '100%' }}>
                        <ListPage
                            // showDepartmentAndEmployeeFilter
                            exportExcel
                            // kanban="ST15"
                            reload={new Date()}
                            filter={{
                                "typeDocument.moduleCode.value": tab,
                            }}
                            // columns={calendarColumns}
                            code="BookDocument"
                            disableAdd
                            apiUrl={API_BOOK_DOCUMENT}
                            // mapFunction={this.mapFunctionCalendar}
                            columnExtensions={[{ columnName: 'edit', width: 150 }]}
                            className="mt-2"
                            settingBar={[addButton()]}
                            mapFunction={mapFunction}
                            onRowClick={item => {
                                handleViewDetail(item._id, 'IncommingDocument');
                                setError(false);
                            }}
                            pointerCursor="pointer"
                            onEdit={row => {
                                setId(row._id);
                                setOpenDialog(true);
                                setError(false);
                            }}
                            disableMenuAction
                        />
                    </Paper>
                )}
                {tab === 'OutGoingDocument' && (
                    <Paper style={{ zIndex: '0 !important', boxShadow: '#c5c0c0 0.5px 1px 10px', borderRadius: '0px', height: '100%', width: '100%' }}>
                        <ListPage
                            // showDepartmentAndEmployeeFilter
                            exportExcel
                            filter={{
                                "typeDocument.moduleCode.value": tab,
                            }}
                            reload={new Date()}
                            disableAdd
                            code="BookDocument"
                            apiUrl={API_BOOK_DOCUMENT}
                            columnExtensions={[{ columnName: 'edit', width: 150 }]}
                            className="mt-2"
                            mapFunction={mapFunction}
                            settingBar={[addButton()]}
                            onRowClick={item => {
                                handleViewDetail(item._id, 'OutGoingDocument')
                            }}
                            pointerCursor="pointer"
                            onEdit={row => {
                                setId(row._id);
                                setOpenDialog(true);
                            }}
                            disableMenuAction
                        />
                    </Paper>
                )}

            </>
            {
                openDialog && <AddBookDocument
                    title={id ? "Cập nhật sổ văn bản" : "Thêm mới sổ văn bản"}
                    id={id}
                    typeDoc={tab}
                    profile={profile}
                    openDialog={openDialog}
                    handleClose={handleClose}
                    onSave={handleSave}
                    error={error}
                />
            }
        </>
    )
}

const mapStateToProps = createStructuredSelector({
    profile: makeSelectProfile(),

});
function mapDispatchToProps(dispatch) {
    return {
        // mergeData: data => dispatch(mergeData(data)),
        // onAddExecutiveDocument: (query, cb) => {
        //     dispatch(addExecutiveDocument(query, cb));
        // },
        // onDeleteExecutiveDocument: ids => {
        //     dispatch(deleteExecutiveDocument(ids));
        // },
        // onUpdateExecutiveDocument: (data, cb) => {
        //     dispatch(updateExecutiveDocument(data, cb));
        // },
        onChangeSnackbar: obj => dispatch(changeSnackbar(obj)),
    };
}

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
);

export default compose(
    withConnect,
    withStyles(styles)
)(BookDocument);
