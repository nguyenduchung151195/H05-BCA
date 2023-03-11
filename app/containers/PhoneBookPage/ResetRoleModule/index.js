import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, FormLabel, FormControl, FormGroup, FormControlLabel, FormHelperText, Checkbox, Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core'
import { AsyncAutocomplete } from './../../../components/LifetekUi';
import { API_USERS, API_COMMON_MODULE, API_REFESH_ROLE_MODULE } from '../../../config/urlConfig';
import request from 'utils/request';
import { changeSnackbar } from './../../Dashboard/actions';
import { serialize } from '../../../utils/common';
const styles = theme => ({
    root: {
        display: 'flex',
    },
    formControl: {
        margin: theme.spacing.unit * 3,
    },
});

class ResetRoleModule extends React.Component {
    state = {
        moduleCode: [],
        userId: [], //userId của employEee chứ không phải _id
        moduleCode: [],
        openDialog: false,
    };
    componentWillMount = () => {
        const query = { reset: true };
        const getModuleCode = async () => {
            const res = await request(`${API_COMMON_MODULE}?${serialize(query)}`, { method: 'GET' });
            const newModuleList = [];
            Object.keys(res).forEach(key => {
                if (key) {
                    newModuleList.push({
                        value: key,
                        label: res[key].title
                    })
                }
            });
            this.setState({ moduleCode: newModuleList })
        }
        getModuleCode();
        const onGetAllUser = async () => {
            const res = await request(API_USERS, { method: 'GET' });
            this.setState({ users: res.data })
        }
        onGetAllUser();

    }
    handleChange = (name, event) => {
        const { moduleListChoseReset } = this.props;
        const findIndex = moduleListChoseReset.findIndex(f => f.name === name)
        if (findIndex === -1) {
            moduleListChoseReset.push({
                name: name,
                checked: event.target.checked
            })
        }
        else {
            moduleListChoseReset.splice(findIndex, 1);
            if (!moduleListChoseReset || moduleListChoseReset.length <= 0) {
                this.props.mergeData({ checkedAllModule: false })
            }
        }
        this.props.mergeData({ moduleListChoseReset: moduleListChoseReset })
        this.setState({ [name]: event.target.checked });
    };
    handleAddUser = (users) => {
        this.props.mergeData({ users: users })
        if (!users || users.length <= 0) {
            this.props.mergeData({ checkedAllUser: false })
        }
    }
    addAllUsers = (e) => {
        if (e.target.checked === true) this.props.mergeData({ users: this.state.users, checkedAllUser: e.target.checked })
        else this.props.mergeData({ users: [], checkedAllUser: e.target.checked })
    }
    addAllModule = (e) => {
        const newList = this.state.moduleCode.map(item => ({
            name: item.value,
            checked: e.target.checked
        }));
        if (e.target.checked === true) this.props.mergeData({ moduleListChoseReset: newList, checkedAllModule: e.target.checked })
        else this.props.mergeData({ moduleListChoseReset: [], checkedAllModule: e.target.checked })
    }
    resetRoleModule = () => {
        const moduleCode = [];
        const userId = [];
        this.props.moduleListChoseReset.map(item => {
            moduleCode.push(item.name)
        })
        this.props.users.map(item => {
            userId.push(item._id)
        })
        const body = {
            moduleCode: moduleCode,
            userId: userId
        }
        if (!body.moduleCode || body.moduleCode.length <= 0) {
            this.props.onChangeSnackbar({ variant: 'error', message: 'Đồng chí cần chọn ít nhất một module', status: true });
            return;
        }
        // if (!body.userId || body.userId.length <= 0) {
        //     this.props.onChangeSnackbar({ variant: 'error', message: 'Đồng chí cần chọn ít nhất một người dùng', status: true });
        //     return;
        // }
        request(`${API_REFESH_ROLE_MODULE}`, {
            method: 'POST',
            headers: {
                // Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(res => {
            if (Number(res.status) === 1) {
                this.props.onChangeSnackbar({ variant: 'success', message: 'Làm mới phân quyền thành công', status: true });
                this.props.mergeData({ users: [], moduleListChoseReset: [], checkedAllModule: false, checkedAllUser: false })
                this.setState({ openDialog: false })
            }
            else {
                this.props.onChangeSnackbar({ variant: 'error', message: 'Làm mới phân quyền thất bại 111', status: true })
            }
        }).catch(error => {
            this.props.onChangeSnackbar({ variant: 'error', message: 'Làm mới phân quyền thất bại 2222', status: true })
        })
    }
    render() {
        const { classes, users, moduleListChoseReset, checkedAllModule, checkedAllUser } = this.props;
        const { moduleCode, openDialog } = this.state;
        return (
            <div className={classes.root} >
                <FormControl component="fieldset" className={classes.formControl}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Button variant="outlined" color="primary" onClick={() => this.setState({ openDialog: true })} >Làm mới phân quyền</Button>
                    </div>
                    <Grid container md={8}>
                        {/* <Grid item md={4}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={checkedAllUser} onChange={this.addAllUsers} />
                                }
                                label="Chọn tất cả người dùng"
                            />
                        </Grid> */}
                        <Grid item md={4}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={checkedAllModule} onChange={this.addAllModule} />
                                }
                                label="Chọn tất cả module"
                            />
                        </Grid>
                    </Grid>
                    <Grid md={12} spacing={16}>
                        <FormLabel component="legend" style={{ color: 'black' }}>DANH SÁCH NGƯỜI DÙNG</FormLabel>
                        <AsyncAutocomplete
                            url={API_USERS}
                            value={users}
                            isMulti
                            label="TÌM KIẾM NGƯỜI DÙNG"
                            onChange={value => this.handleAddUser(value)}
                            fullWidth
                            filters={["name", "username"]}
                        // ltAcount={"ltAcount"}
                        // mapFunction={customerMapfunction}
                        />
                    </Grid>
                    <Grid md={12} style={{ marginTop: 20 }}>
                        <FormLabel component="legend" style={{ color: 'black' }}>DANH SÁCH CÁC MODULE</FormLabel>
                        <FormGroup>
                            <Grid container md={12}>
                                {Array.isArray(moduleCode) && moduleCode.map(item => {
                                    const findIndex = moduleListChoseReset.findIndex(f => f.name === item.value);
                                    const currentCheck = findIndex >= 0 ? moduleListChoseReset[findIndex].checked : false;
                                    return (
                                        <Grid item md={3}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox checked={currentCheck} onChange={(e) => this.handleChange(item.value, e)} />
                                                }
                                                label={item.label}
                                            />
                                        </Grid>
                                    )
                                })}
                            </Grid>

                        </FormGroup>
                    </Grid>
                    <Dialog
                        open={openDialog}
                        onClose={() => this.setState({ openDialog: false })}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">Thông báo</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">Đồng chí chắc chắn đồng ý làm mới phân quyền</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.resetRoleModule} color="primary" variant="contained" autoFocus>
                                Đồng ý
                            </Button>
                            <Button onClick={() => this.setState({ openDialog: false })} color="secondary" variant="contained">
                                Đóng
                            </Button>
                        </DialogActions>
                    </Dialog>

                </FormControl>
            </div>
        )
    }
}
ResetRoleModule.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ResetRoleModule);