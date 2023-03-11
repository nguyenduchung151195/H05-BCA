/**
 *
 * AddPlanProcess
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Button } from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAddPlanProcess from './selectors';
import reducer from './reducer';
import saga from './saga';
import { handleChange, postTemplate, getDefault, getTemplate, putTemplate, mergeData } from './actions';
import { TextField, Grid, Paper, Breadcrumbs } from '../../components/LifetekUi';
import Treeview from './Treeview';
import { convertTree } from '../../helper';
import './style.css';

import CustomAppBar from 'components/CustomAppBar';

// import { API_USERS } from '../../config/urlConfig';

/* eslint-disable react/prefer-stateless-function */
export class AddPlanProcess extends React.Component {
  constructor(props) {
    super(props);
    const configs = JSON.parse(localStorage.getItem('taskStatus'));
    const taskStatus = configs.find(item => item.code === 'TASKTYPE').data;
    this.state = { taskStatus };
    this.saveRef = React.createRef();
  }

  onGoBack = () => {
    this.props.history.goBack();
  };

  render() {
    const { addPlanProcess, intl } = this.props;
    const { treeData, _id } = addPlanProcess;
    const id = this.props.id ? this.props.id : this.props.match.params.id;

    return (
      <div style={{ width: '100%' }}>
        <CustomAppBar
          title={
            id === 'add'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm mới quy trình lập kế hoạch' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'cập nhật quy trình mẫu lập kế hoạch' })}`
          }
          onGoBack={this.onGoBack}
          disableAdd
        />
        <Helmet>
          <title>{intl.formatMessage(messages.themquytrinh || { id: 'themquytrinh', defaultMessage: 'themquytrinh' })}</title>
          <meta name="description" content="Description of TaskPage" />
        </Helmet>
        <Grid container>
          <Grid md={12} item>
            <Breadcrumbs
              links={[
                { title: 'Dashboard', to: '/' },
                {
                  title: 'Quy trình mẫu',
                  to: '/Task/TemplateTask',
                },
              ]}
              title="Thêm mới"
            />

            <Paper className="py-3" style={{ height: '100%' }}>
              {/* <div style={{ display: 'flex', alignItems: 'center' }}>
                <Edit />
                <Typography color="primary" variant="subtitle1">
                  {intl.formatMessage(messages.themmoiquytrinh || { id: 'themmoiquytrinh', defaultMessage: 'themmoiquytrinh' })}
                </Typography>
              </div> */}
              <Grid md={8}>
                <TextField
                  fullWidth
                  required
                  // label={intl.formatMessage(messages.ten || { id: 'ten', defaultMessage: 'ten' })}
                  label="Tên quy trình"
                  onChange={e => this.handleChange('name', e.target.value)}
                  value={addPlanProcess.name}
                  name="name"
                  error={addPlanProcess.errorName}
                  // helperText={addPlanProcess.errorName ? intl.formatMessage(messages.nhapten || { id: 'nhapten', defaultMessage: 'nhapten' }) : false}
                  helperText={addPlanProcess.errorName ? 'Nhập tên quy trình' : null}
                />
              </Grid>
              <Treeview treeData={treeData} saveRef={this.saveRef} templateId={_id} onSave={this.onSave} configs={this.state.taskStatus} />
              <Gird xs={12} container >
                <Grid xs={6} />
                <Grid xs={6} style={{textAlign: "right"}} >
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      this.setState({ isFinished: true });
                      this.saveRef.current.click();
                    }}
                  >
                    Lưu
                  </Button>
                </Grid>
              </Gird>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    if (id === 'add') this.props.getDefault();
    else this.props.getTemplate(id);
  }

  handleChange = (name, value) => {
    const rex = /^[a-zA-Z0-9_-]+.{4,}$/g;
    const errorName = !rex.test(value);
    this.props.mergeData({ name: value, errorName });
  };

  onSave = treeData => {
    const date = new Date();
    convertTree(treeData, date, 'DATA', [], true);
    // console.log('TREE', treeData);

    if (this.props.addPlanProcess.errorName) return;
    const id = this.props.match.params.id;
    const addPlanProcess = this.props.addPlanProcess;
    treeData.type = 'Plan';
    const data = { name: addPlanProcess.name, treeData, type: 'Plan' };
    if (id === 'add') this.props.postTemplate(data);
    else this.props.putTemplate(data, id);
  };
}

const mapStateToProps = createStructuredSelector({
  addPlanProcess: makeSelectAddPlanProcess(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    handleChange: (name, value) => {
      dispatch(handleChange(name, value));
    },
    postTemplate: data => {
      dispatch(postTemplate(data));
    },
    getDefault: () => {
      dispatch(getDefault());
    },
    getTemplate: id => {
      dispatch(getTemplate(id));
    },
    putTemplate: (data, id) => {
      dispatch(putTemplate(data, id));
    },
    mergeData: data => dispatch(mergeData(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addPlanProcess', reducer });
const withSaga = injectSaga({ key: 'addPlanProcess', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(AddPlanProcess);
