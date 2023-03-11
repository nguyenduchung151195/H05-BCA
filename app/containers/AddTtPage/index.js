/**
 *
 * AddTtPage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Grid, TextField, withStyles, Checkbox } from '@material-ui/core';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAddTtPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getTemplateType, handleChange, postTemplateType, putTemplateType, mergeData } from './actions';
import CustomAppBar from 'components/CustomAppBar';


/* eslint-disable react/prefer-stateless-function */
const styles = {
  textField: {
    marginBottom: '25px',
    color: 'black',
  },
};
export class AddTtPage extends React.Component {
  state = {
    modules: JSON.parse(localStorage.getItem('viewConfig')),
    moduleValue: null,
    id: this.props.match.params.id,
    disableButton: false
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    this.props.getTemplateType(id);
    let newModules = ['IncommingDocument', 'OutGoingDocument', 'AuthorityDocument', 'Task', 'PersonPlan', 'OrganizationPlan', 'MeetingCalendar'];
    let allData = [];
    newModules.forEach(element => {
      let data = this.state.modules.find(i => i.code === element);
      allData.push(data);
    });
    this.setState({ modules: allData });
  }

  saveTemplateType = () => {
    const id = this.props.match.params.id;
    const addTtPage = this.props.addTtPage;
    try {
      this.setState({ disableButton: true })
      if (id === 'add') this.props.postTemplateType(addTtPage);
      else this.props.putTemplateType(id, addTtPage);
    } catch (error) {
      this.setState({ disableButton: false })
    }
  };
  componentDidUpdate(prevState) {
    const { addTtPage } = this.props
    if (addTtPage !== undefined && addTtPage.error === true && addTtPage.loading === false && addTtPage.success === false && this.state.disableButton === true)
      this.setState({ disableButton: false })
  }
  render() {
    const { classes, addTtPage, addTemplatePage } = this.props;
    const { id } = this.state;
    return (
      <div>
        <Helmet>
          <title>Thêm mới loại văn bản</title>
          <meta name="description" content="Description of AddTtPage" />
        </Helmet>
        <Grid container>
          <CustomAppBar
            title={
              id === 'add'
                ? 'thêm mới loại văn bản'
                : 'cập nhật loại văn bản'
            }
            onGoBack={() => this.props.history.push('/setting/template_type')}
            onSubmit={this.saveTemplateType}
            disableSave={this.state.disableButton}
          />
          <Grid item md={12} style={{ marginTop: 30 }} >
            <TextField
              className={classes.textField}
              onChange={this.props.handleChange('title')}
              value={addTtPage.title}
              required
              label="Tiêu đề"
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              className={classes.textField}
              value={addTtPage.code}
              onChange={this.props.handleChange('code')}
              required
              label="Mã"
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
            Luôn sử dụng
            <Checkbox onChange={this.props.handleCheck('alwaysUsed')} checked={addTtPage.alwaysUsed} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

// AddTtPage.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  addTtPage: makeSelectAddTtPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    handleChange: name => e => dispatch(handleChange({ name, value: e.target.value })),
    handleCheck: name => e => dispatch(handleChange({ name, value: e.target.checked })),
    getTemplateType: id => dispatch(getTemplateType(id)),
    postTemplateType: data => dispatch(postTemplateType(data)),
    putTemplateType: (id, data) => dispatch(putTemplateType(id, data)),
    select: data => dispatch(mergeData({ modules: data })),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addTtPage', reducer });
const withSaga = injectSaga({ key: 'addTtPage', saga });

export default compose(
  withReducer,
  withSaga,
  withStyles(styles),
  withConnect,
)(AddTtPage);
