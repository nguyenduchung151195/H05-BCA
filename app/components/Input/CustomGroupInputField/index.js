import React, { useEffect, memo, useState, useCallback } from 'react';
import CustomInputField from '../CustomInputField';
import { Grid } from '../../LifetekUi';
import { Card, MenuItem, Fab as Fa, Tooltip, Button, IconButton, DialogTitle } from '@material-ui/core';
import { removeVietnameseTones } from 'utils/common';
import _ from 'lodash';
import moment from 'moment';
import CustomButton from 'components/Button/CustomButton';
import { FilterList, Search } from '@material-ui/icons';

const Fab = props => <Fa {...props} />;
Fab.defaultProps = {
  size: 'small',
  color: 'primary',
  style: { margin: '5px', float: 'right' },
};
function CustomGroupInputField(props) {
  const {
    code,
    value,
    onChange,
    columnPerRow = 2,
    handleReload,
    itemConfig,
    source,
    allModule,
    disabled = false,
    autoDown = false,
    isLifeDrive,
  } = props;
  const [listViewConfig, setListViewConfig] = useState([]);
  const [localState, setLocalState] = useState({});
  useEffect(
    () => {
      setLocalState({ ...(value || {}) });
    },
    [value],
  );

  useEffect(
    () => {
      if (allModule) {
        if (code && Array.isArray(code)) {
          const listViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
          let listItemConfig = [];
          code.map(it => {
            const currentViewConfig = listViewConfig.find(item => item.code === it) || {};
            const filteredOthersFiles =
              (currentViewConfig &&
                currentViewConfig.listDisplay &&
                currentViewConfig.listDisplay.type &&
                currentViewConfig.listDisplay.type.fields &&
                currentViewConfig.listDisplay.type.fields.type &&
                currentViewConfig.listDisplay.type.fields.type.fileColumns) ||
              [];
            listItemConfig = [...listItemConfig, ...filteredOthersFiles];
          });
          setListViewConfig(listItemConfig);
        } else {
          const listViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
          const currentViewConfig =
            listViewConfig.filter(item => item.listDisplay.type.fields.type && item.listDisplay.type.fields.type.fileColumns) || [];
          let others = [];
          currentViewConfig.forEach(item => {
            const other = item.listDisplay.type.fields.type.fileColumns;
            others = others.concat(other);
            others = _.uniqBy(others, 'name');
          });
          const filteredOthers = others.filter(item => item.checkedShowForm);
          setListViewConfig(filteredOthers);
        }
      } else if (code && !allModule && Array.isArray(itemConfig)) {
        // const listViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
        // const currentViewConfig = listViewConfig.find(item => item.code === code) || {};
        // console.log('currentViewConfig_',currentViewConfig)
        // const { listDisplay = {} } = currentViewConfig;
        // const { type = {} } = listDisplay;
        // const { fields = {} } = type;
        // const { type: childType = {} } = fields;
        // const others = childType[source || 'others'] || [];
        // const filteredOthers = others.filter(item => item.checkedShowForm);
        // console.log('filteredOthers_',filteredOthers)
        // setListViewConfig(filteredOthers);
        const listViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
        const currentViewConfig = listViewConfig.find(item => item.code === code) || {};
        console.log('currentViewConfig_', currentViewConfig);
        const { listDisplay = {} } = currentViewConfig;
        const { type = {} } = listDisplay;
        const { fields = {} } = type;
        const other = fields.type.columns;
        // const others = childType[source || 'others'] || [];
        const filteredOthers = other.filter(item => item.checkedShowForm);
        let itemViewConfig = [];
        itemConfig.map(it => {
          var itemNew = filteredOthers.find(el => el.name === it.fieldKey);
          itemViewConfig.push(itemNew);
        });
        setListViewConfig(itemViewConfig);
      } else if (code) {
        // const listViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
        // const currentViewConfig = listViewConfig.find(item => item.code === code) || {};
        // console.log('currentViewConfig_',currentViewConfig)
        // const { listDisplay = {} } = currentViewConfig;
        // const { type = {} } = listDisplay;
        // const { fields = {} } = type;
        // const { type: childType = {} } = fields;
        // const others = childType[source || 'others'] || [];
        // const filteredOthers = others.filter(item => item.checkedShowForm);
        // console.log('filteredOthers_',filteredOthers)
        // setListViewConfig(filteredOthers);
        const listViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
        const currentViewConfig = listViewConfig.find(item => item.code === code) || {};
        console.log('currentViewConfig_', currentViewConfig);
        const { listDisplay = {} } = currentViewConfig;
        const { type = {} } = listDisplay;
        const { fields = {} } = type;
        console.log('fields_', fields);
        const other = fields.type.columns;
        console.log('column_', other);
        // const others = childType[source || 'others'] || [];
        const filteredOthers = other.filter(item => item.checkedShowForm);
        // console.log('filteredOthers_',filteredOthers)
        setListViewConfig(filteredOthers);
      }
    },
    [source, code, itemConfig],
  );

  const handleChange = useCallback(
    (e, name) => {
      console.log('e_', e);
      console.log('name_', name);
      if (!(e.target && e.target.name)) {
        const found = listViewConfig.find(it => it.name === name);
        console.log(found, 'found');
        if (found && found.type === 'Date') {
          const newLocalState = {
            ...localState,
            [found.name]: moment(e).format('YYYY-MM-DD'),
          };
          setLocalState(newLocalState);
          if (onChange) {
            onChange(newLocalState);
          }
        }else if(found.configCode){
          const newLocalState = {
            ...localState,
            [found.name]: e.target.value,
          }
          setLocalState(newLocalState);
          if (onChange) {
            onChange(newLocalState);
          }
        }
      } else {
        const newLocalState = {
          ...localState,
          [e.target.name]: e.target.value,
        };
        if (source === 'fileColumns') {
          const found = listViewConfig.find(c => {
            const name = c.name.replace('others.', '');
            if (name === e.target.name) {
              return true;
            }
            return false;
          });
          console.log('run 0');
          if (found && found.type === 'text') {
            newLocalState[`${e.target.name}_en`] = removeVietnameseTones(e.target.value);
          }
        }
        setLocalState(newLocalState);
        if (onChange) {
          onChange(newLocalState);
        }
      }
    },
    [localState],
  );
  console.log('listViewConfig_', listViewConfig);
  console.log('localState_', localState);
  // console.log('item_', item);
  return (
    <>
      {autoDown ? (
        <>
          {listViewConfig.map(item => (
            <Grid item xs={12 / columnPerRow}>
              <CustomInputField
                value={value[item.name.replace('others.', '')]}
                isLifeDrive={isLifeDrive}
                name={item.name.replace('others.', '')}
                type={item.type}
                label={item.title}
                configType={item.configType}
                configCode={item.configCode}
                configId={item.id}
                onChange={(e, name) => handleChange(e, item.name.replace('others.', ''))}
                disabled={disabled}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          ))}
        </>
      ) : (
        <>
          <Grid spacing={8} container>
            {/* <Grid item x2={8}> */}
            {listViewConfig.map(item => (
              <Grid item xs={12 / columnPerRow}>
                <CustomInputField
                  value={localState[item.name.replace('others.', '')]}
                  name={item.name.replace('others.', '')}
                  type={item.type}
                  label={item.title}
                  configType={item.configType}
                  configCode={item.configCode}
                  configId={item.id}
                  onChange={handleChange}
                  disabled={disabled}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            ))}
            {/* </Grid> */}
            {props.othersLength < 6 ? (
              <Grid item xs={2}>
                <div style={{ display: 'flex' }}>
                  <div style={{ marginLeft: 5, marginTop: 8, height: 50 }}>
                    {/* <Fab onClick={props.onChangeSearch} color="primary" style={{ width: 40, height: 40, minWidth: 40, marginTop: 15, marginLeft: 5 }}>
                  <Tooltip title="Tìm kiếm">
                    <Search />
                  </Tooltip>
                </Fab> */}
                    <Button variant="outlined" color="primary" onClick={props.onChangeSearch} style={{ height: 47, width: 100 }}>
                      Tìm kiếm
                    </Button>
                  </div>
                  <div style={{ marginLeft: 5, marginTop: 8, height: 50 }}>
                    {/* <Fab
                  onClick={props.handleReload}
                  color="primary"
                  style={{ width: 40, height: 40, minWidth: 40, marginTop: 15 }}
                >
                  X
                </Fab> */}
                    <Button variant="outlined" color="secondary" onClick={props.handleReload} style={{ height: 47, width: 150 }}>
                      Xóa tìm kiếm
                    </Button>
                  </div>
                </div>
              </Grid>
            ) : null}
          </Grid>
        </>
      )}
    </>
  );
}

export default memo(CustomGroupInputField);
