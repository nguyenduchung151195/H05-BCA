/**
 *
 * Field
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { MenuItem } from '@material-ui/core';
import { Add, Delete } from '@material-ui/icons';
import makeSelectField from './selectors';
import CustomAppBar from 'components/CustomAppBar';

import reducer from './reducer';
import saga from './saga';
import { fetchData } from '../../helper';
import { API_FIELD } from '../../config/urlConfig';
import { TextField, Breadcrumbs } from '../../components/LifetekUi';

import './style.css';
import CustomInputField from '../../components/Input/CustomInputField';
import moment from 'moment';
import Snackbar from 'components/Snackbar';
import { handleChange, getAllModuleCode } from './actions';

function Field(props) {
  const [state, setState] = React.useState({ name: '', fields: [], code: 'Customer', modules: JSON.parse(localStorage.getItem('viewConfig')) });
  const [snackbar, setSnackbar] = useState({
    open: false,
    variant: 'success',
    message: '',
  });

  const viewConfig = React.useState(JSON.parse(localStorage.getItem('viewConfig')))[0];
  const { field } = props;
  useEffect(() => {
    getData(props.match.params.id);
    props.onGetAllModuleCode();
  }, []);

  async function getData(id) {
    if (id === 'add') return;
    const data = await fetchData(`${API_FIELD}/${id}`);
    setState(data);
  }

  async function addField() {
    const url = props.match.params.id === 'add' ? API_FIELD : `${API_FIELD}/${props.match.params.id}`;
    const method = props.match.params.id === 'add' ? 'POST' : 'PUT';

    if (!state.name || !state.code) {
      if (method === 'POST') {
        setSnackbar({ open: false, message: 'Thêm file thất bại', variant: 'error' });
      } else {
        setSnackbar({ open: false, message: 'Sửa file thất bại', variant: 'error' });
      }
    } else {
      if (method === 'POST') {
        await fetchData(url, method, state);
        setState({ name: '', fields: [], code: '' });
        setSnackbar({ open: true, message: 'Thêm flle thành công', variant: 'success' });
        setTimeout(() => {
          props.history.push('/setting/field');
        }, 500);
      } else {
        await fetchData(url, method, state);
        setState({ name: '', fields: [], code: '' });
        setSnackbar({ open: true, message: 'Cập nhật flle thành công', variant: 'success' });
        setTimeout(() => {
          props.history.push('/setting/field');
        }, 500);
      }
    }
  }
  function changeField(index, value) {
    const newFields = [...state.fields];
    newFields[index] = {
      ...state.fields[index],
      name: value,
      title: viewConfig.find(i => i.code === state.code).listDisplay.type.fields.type.columns.find(e => e.name === value).title,
      valueType: viewConfig.find(i => i.code === state.code).listDisplay.type.fields.type.columns.find(e => e.name === value).type,
      configType: viewConfig.find(i => i.code === state.code).listDisplay.type.fields.type.columns.find(e => e.name === value).configType
        ? viewConfig.find(i => i.code === state.code).listDisplay.type.fields.type.columns.find(e => e.name === value).configType
        : null,
      configCode: viewConfig.find(i => i.code === state.code).listDisplay.type.fields.type.columns.find(e => e.name === value).configCode
        ? viewConfig.find(i => i.code === state.code).listDisplay.type.fields.type.columns.find(e => e.name === value).configCode
        : null,
      options: viewConfig.find(i => i.code === state.code).listDisplay.type.fields.type.columns.find(e => e.name === value).menuItem
        ? viewConfig.find(i => i.code === state.code).listDisplay.type.fields.type.columns.find(e => e.name === value).menuItem
        : null,
    };
    setState({ ...state, fields: newFields });
  }
  // function changeSource(index, value) {
  //   const newFields = [...state.fields];
  //   newFields[index] = {
  //     ...state.fields[index],
  //     name: value,
  //     title: viewConfig.find(i => i.code === state.code).listDisplay.type.fields.type.columns.find(e => e.name === value).title,
  //     valueType: viewConfig.find(i => i.code === state.code).listDisplay.type.fields.type.columns.find(d => d.name === value).type,

  //   };
  //   setState({ ...state, fields: newFields });
  //   console.log(state.fields, 'state.ssssss')
  // }

  function changeTitle(index, value) {
    const newFields = [...state.fields];
    newFields[index] = { ...state.fields[index], value };
    setState({ ...state, fields: newFields });
  }

  function handleInputChange(index, e) {
    const newFields = [...state.fields];
    // console.log(index, e, 'index, e ,name')
    const value = moment(e).format('YYYY-MM-DD');
    newFields[index] = {
      ...state.fields[index],
      value: value,
    };
    setState({ ...state, fields: newFields });
  }

  function onGoBack() {
    props.history.goBack();
  }
  const id = props.match.params.id;
  //console.log('state', state)
  return (
    <React.Fragment>
      <div style={{ background: '#fff', padding: '40px 20px' }}>
        <CustomAppBar
          title={
            id === 'add'
              ? `${props.intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới Field' })}`
              : `${props.intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật field' })}`
          }
          onGoBack={onGoBack}
          onSubmit={() => addField()}
        />
        <Breadcrumbs
          links={[
            { title: 'Dashboard', to: '/' },
            {
              title: 'Setting',
              to: '/setting',
            },
            {
              title: 'Field',
              to: '/setting/field',
            },
          ]}
          title="Thêm mới"
        />
        <TextField
          helperText={state.name ? null : 'Tên là trường bắt buộc'}
          error={!state.name}
          label="Tên"
          fullWidth
          onChange={e => setState({ ...state, name: e.target.value })}
          value={state.name}
        />
        <TextField label="Mã" fullWidth select onChange={e => setState({ ...state, code: e.target.value, fields: [] })} value={state.code}>
          {viewConfig.map(i => (
            <MenuItem value={i.code}>{props.field && props.field.modules && props.field.modules[i.code] ? props.field.modules[i.code].title : i.code}</MenuItem>
          ))}
        </TextField>
        {/* <TextField label="Mã" select value={state.code} fullWidth onChange={handleChange('moduleCode')} InputLabelProps={{ shrink: true }}>
          {state.field &&
            state.field.modules &&
            Object.keys(state.field.modules).map(
              key =>
                state.field.modules[key] && state.field.modules[key].title ? (
                  <MenuItem value={state.field.modules[key] && state.field.modules[key].code}>
                    {state.field.modules[key].title ? state.field.modules[key].title : ''}
                    {state.field.modules[key].code ? `(${state.field.modules[key].code})` : ''}
                  </MenuItem>
                ) : null,
            )}
        </TextField> */}
        {/* {console.log(1, state.field)} */}

        <Add
          onClick={() =>
            setState({
              ...state,
              fields: state.fields.concat({
                name: '',
                title: '',
                value: '',
                valueType: '',
                valueInfor: '',
                configType: '',
                configCode: '',
                options: '',
              }),
            })
          }
          style={{ float: 'right' }}
        />
        {state.fields.map((i, idx) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              style={{ width: '40%', marginRight: 20 }}
              onChange={e => changeField(idx, e.target.value)}
              value={i.name}
              label="Tên trường"
              select
            >
              {viewConfig.find(ix => ix.code === state.code).listDisplay.type.fields.type.columns.map(e => (
                <MenuItem value={e.name}>{e.title}</MenuItem>
              ))}
            </TextField>

            {/* <TextField style={{ width: '40%' }} onChange={e => changeTitle(idx, e.target.value)} value={i.value} /> */}

            {state.fields[idx].valueType === '' || state.fields[idx].valueType === 'String' ? (
              <TextField
                // validators={['required']}
                // errorMessages={['Trường bắt buộc']}
                onChange={e => changeTitle(idx, e.target.value)}
                value={i.value}
                label="Giá trị *"
                variant="outlined"
                fullWidth
                margin="dense"
              />
            ) : state.fields[idx].valueType === 'Datetime' ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CustomInputField
                  onChange={e => handleInputChange(idx, e)}
                  value={state.fields[idx].value}
                  name="date"
                  label="Giá trị *"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  type={state.fields[idx].valueType}
                />
                {/* <TextField
                onChange={e => changeTitle(idx, e.target.value)}
                value={i.value}
                label="Giá trị *"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                type={state.fields[idx].currentDay ? 'number' : 'date'}
                margin="dense"
              /> */}
              </div>
            ) : (
              // <TextField
              //   style={{ width: '40%' }}
              //   onChange={e => changeTitle(idx, e.target.value)}
              //   value={i.value}
              //   label="Giá trị *"
              //   variant="outlined"
              //   fullWidth
              //   margin="dense"
              // />
              <CustomInputField
                // validators={['required']}
                // errorMessages={['Trường bắt buộc']}
                // onChange={event => {
                //   const { dialogData } = this.state;
                //   dialogData.conditions[index].valueInfor = dialogData.conditions[index].valueType.includes('Source') ? event.target.value : event;
                //   this.setState({ dialogData });
                // }}
                onChange={e => {
                  state.fields[idx].valueInfor = state.fields[idx].valueType.includes('Source') ? e.target.value : e;
                  setState({ ...state });
                }}
                name={state.fields[idx].field}
                value={state.fields[idx].valueInfor}
                type={state.fields[idx].valueType}
                label="Giá trị *"
                configType={state.fields[idx].configType ? state.fields[idx].configType : null}
                configCode={state.fields[idx].configCode ? state.fields[idx].configCode : null}
                options={state.fields[idx].options ? state.fields[idx].options : null}
              />
            )}
            <Delete onClick={() => setState({ ...state, fields: state.fields.filter((i, ix) => ix !== idx) })} />
          </div>
        ))}
        {/* <Button style={{ float: 'right' }} color="primary" onClick={addField}>
          Lưu
        </Button> */}
      </div>
      <Snackbar
        open={snackbar.open}
        variant={snackbar.variant}
        message={snackbar.message}
        onClose={() =>
          setSnackbar({
            open: false,
            message: '',
            variant: '',
          })
        }
      />
    </React.Fragment>
  );
}

Field.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  field: makeSelectField(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    handleChange: name => e => dispatch(handleChange({ name, value: e.target.value })),
    onGetAllModuleCode: () => dispatch(getAllModuleCode()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'field', reducer });
const withSaga = injectSaga({ key: 'field', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Field);
