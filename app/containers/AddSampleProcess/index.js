/**
 *
 * AddSampleProcess
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAddSampleProcess from './selectors';
import reducer from './reducer';
import saga from './saga';
import { handleChange, postTemplate, getDefault, getTemplate, putTemplate, mergeData } from './actions';
import { TextField, Grid, Paper, Treeview, Breadcrumbs } from '../../components/LifetekUi';
import { convertTree } from '../../helper';
import './style.css';
import { injectIntl } from 'react-intl';
import messages from './messages';
import CustomAppBar from 'components/CustomAppBar';

// import { API_USERS } from '../../config/urlConfig';

/* eslint-disable react/prefer-stateless-function */
export class AddSampleProcess extends React.Component {
  constructor(props) {
    super(props);
    const configs = JSON.parse(localStorage.getItem('taskStatus'));
    const taskStatus = configs.find(item => item.code === 'TASKTYPE').data;
    this.state = { taskStatus, disableSave: false };
    this.saveRef = React.createRef();
  }

  componentWillReceiveProps(props) {
    if (props.addSampleProcess.error !== this.props.addSampleProcess.error) {
      this.setState({ disableSave: false });
    }
  }

  onGoBack = () => {
    this.props.history.goBack();
  };

  render() {
    const { addSampleProcess, intl } = this.props;
    const { treeData, _id } = addSampleProcess;
    const id = this.props.id ? this.props.id : this.props.match.params.id;

    return (
      <div style={{ width: '100%' }}>
        {/* <AppBar className='HearderappBarQTM'>
        <Toolbar>
          <IconButton
            // className={id !== 'add' ? '' : ''}
            className='BTNQTM'
            color="inherit"
            variant="contained"
            onClick={this.onGoBack}
            aria-label="Close"
          >
            <Close />
          </IconButton>
          <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
            {id === 'add'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm mới quy trình mẫu' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'cập nhật quy trình mẫu' })}`}
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => {
              this.saveRef.current.click();
            }}
          >
            {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
          </Button>
        </Toolbar>
      </AppBar>   */}
        <CustomAppBar
          title={
            id === 'add'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm mới quy trình mẫu' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'cập nhật quy trình mẫu' })}`
          }
          onGoBack={this.onGoBack}
          disableSave={this.state.disableSave}
          onSubmit={() => {
            this.setState({ isFinished: true });
            this.saveRef.current.click();
          }}
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
              <TextField
                fullWidth
                required
                label={intl.formatMessage(messages.ten || { id: 'ten', defaultMessage: 'ten' })}
                onChange={e => this.handleChange('name', e.target.value)}
                value={addSampleProcess.name}
                name="name"
                error={addSampleProcess.errorName}
                helperText={addSampleProcess.errorName ? intl.formatMessage(messages.nhapten || { id: 'nhapten', defaultMessage: 'nhapten' }) : false}
                className={'CustomRequiredLetter'}
              />

              <Treeview treeData={treeData} saveRef={this.saveRef} templateId={_id} onSave={this.onSave} configs={this.state.taskStatus} />
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
    this.props.mergeData({ name: value, errorName: null });
    this.setState({ disableSave: false });
  };

  onSave = treeData => {
    const date = new Date();
    convertTree(treeData, date, 'DATA', [], true);
    // console.log('TREE', treeData);
    if (this.props.addSampleProcess.errorName) return;
    const id = this.props.match.params.id;
    const addSampleProcess = this.props.addSampleProcess;
    treeData.type = 'Task';
    const data = { name: addSampleProcess.name, treeData, type: 'Task' };
    if (id === 'add') {
      this.setState({ disableSave: true });
      this.props.postTemplate(data);
    } else {
      this.setState({ disableSave: true });
      this.props.putTemplate(data, id);
    }
  };
}

const mapStateToProps = createStructuredSelector({
  addSampleProcess: makeSelectAddSampleProcess(),
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

const withReducer = injectReducer({ key: 'addSampleProcess', reducer });
const withSaga = injectSaga({ key: 'addSampleProcess', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(AddSampleProcess);
