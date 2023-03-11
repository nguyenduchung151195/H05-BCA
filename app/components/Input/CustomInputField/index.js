import React, { useEffect, memo, useState, useRef, useCallback } from 'react';
import { MenuItem } from '@material-ui/core';
import CustomInputBase from '../CustomInputBase';
import {
  GridList,
  Grid,
  Typography,
  Checkbox,
  TextField,
  FormControlLabel,
  Slider,
  FormControl,
  RadioGroup,
  Radio,
  FormLabel,
  Input,
} from '@material-ui/core';
import { NONE_MENU_ITEM_TYPES, MAPPING_TYPE } from './constants';
import WarrantyPeriodInput from './CustomInput/WarrantyPeriodInput';
import { APP_URL, API_APPROVE_GROUPS, API_TEMPLATE, API_HUMAN_RESOURCE, API_BOOK_DOCUMENT, API_OUTGOING_DOCUMENT_SINGER, API_USERS, API_ORIGANIZATION } from '../../../config/urlConfig';
import { Autocomplete, AsyncAutocomplete } from 'components/LifetekUi';
import CustomDatePicker from '../../CustomDatePicker';
// import { makeStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
import CustomRangeSlider from '../../Filter/CustomRangeSlider';
import { DateRangePickerComponent } from '@syncfusion/ej2-react-calendars';
import { DateRangePicker } from 'react-date-range';
import request from '../../../utils/request';
import { serialize } from '../../../helper';
// import Typography from "@material-ui/core/Typography";
// import Slider from "@material-ui/lab/Slider";
import moment from 'moment';
import './index.css';
import _ from 'lodash';
import { flatChild, fetchData } from 'helper';

const dateFilterTypeLabels = {
  week: 'Tuần',
  month: 'Tháng',
  quarter: 'Quý',
  year: 'Năm',
};
const weeks = 52;
const WEEKS = [];
for (let y = 0; y < weeks; y += 1) {
  WEEKS.push({
    name: `${y + 1}`,
    title: `Tuần  ${y + 1}`,
  });
}
const MONTHS = [
  {
    name: '1',
    title: 'Tháng 1',
  },
  {
    name: '2',
    title: 'Tháng 2',
  },
  {
    name: '3',
    title: 'Tháng 3',
  },
  {
    name: '4',
    title: 'Tháng 4',
  },
  {
    name: '5',
    title: 'Tháng 5',
  },
  {
    name: '6',
    title: 'Tháng 6',
  },
  {
    name: '7',
    title: 'Tháng 7',
  },
  {
    name: '8',
    title: 'Tháng 8',
  },
  {
    name: '9',
    title: 'Tháng 9',
  },
  {
    name: '10',
    title: 'Tháng 10',
  },
  {
    name: '11',
    title: 'Tháng 11',
  },
  {
    name: '12',
    title: 'Tháng 12',
  },
];
const QUARTERS = [
  {
    name: '1',
    title: 'Qúy 1',
  },
  {
    name: '2',
    title: 'Qúy 3',
  },
  {
    name: '3',
    title: 'Qúy 3',
  },
  {
    name: '4',
    title: 'Qúy 4',
  },
];

// const currentYear = moment().get('year');
// const YEARS = [];
// for (let y = 0; y < 5; y += 1) {
//   YEARS.push({
//     name: `${currentYear - y}`,
//     title: `${currentYear - y}`,
//   });
// }

// const obj = {
//   week: WEEKS,
//   month: MONTHS,
//   quarter: QUARTERS,
//   year: YEARS,
// };
/// cài thêm: npm install @material-ui/lab

// const useStyles = makeStyles({
//   root: {
//     width: 300
//   }
// });
function valuetext(valueNumber) {
  return `${valueNumber}°C`;
}

function CustomInputField(props) {
  // const classes = useStyles();
  const {
    min = 0,
    max = 100,
    type,
    name,
    value,
    label,
    onChange,
    configType,
    configCode,
    isBookDocument = false,
    typeDocument = '',
    isChecked,
    isCheckedNo,
    onChangeCheck,
    options,
    customFilter,
    profile,
    typeDoc = '',
    crmSource,
    disableDelete,
    hiddenOptionDefault,
    clone = false,
    onChangeSnackbar,
    isAddDocument,
    minYear,
    isLifeDrive,
    ...restProps
  } = props;
  console.log('props_customInput', props)
  const [menuItemData, setMenuItemData] = useState([]);
  const [valueNumber, setValueNumber] = useState([20, 37]);
  const [localState, setLocalState] = useState([min, max]);
  const [originMenuItemData, setOriginMenuItemData] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [organization, setOrganization] = useState([]);
  const currentYear = moment().get('year');
  const YEARS = [];
  const minYearSearch = minYear ? minYear : 5
  for (let y = 0; y < minYearSearch; y += 1) {
    YEARS.push({
      name: `${currentYear - y}`,
      title: `${currentYear - y}`,
    });
  }

  const obj = {
    week: WEEKS,
    month: MONTHS,
    quarter: QUARTERS,
    year: YEARS,
  };

  useEffect(() => {
    if (clone && name === "signer") {
      request(`${API_USERS}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
      }).then((res) => {
        setEmployee(res.data)

      })
    } else if (clone && (name === "receiverUnit" || name === "senderUnit")) {


      request(`${API_ORIGANIZATION}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
      }).then((res) => {
        const flattedDepartment = flatChild(res);
        setOrganization(flattedDepartment)
      })
    }
  }, [])
  useEffect(
    () => {
      if (Array.isArray(options)) {
        setMenuItemData(options);
      } else if (isBookDocument === false && configType && !NONE_MENU_ITEM_TYPES.includes(type) && (type || configCode)) {
        try {
          const listConfig = JSON.parse(localStorage.getItem(configType));
          if (Array.isArray(listConfig)) {
            const currentConfig = listConfig.find(config => config._id === type || config.code == configCode);
            if (currentConfig && Array.isArray(currentConfig.data)) {
              setOriginMenuItemData(currentConfig.data);
              if (customFilter) {
                setMenuItemData(customFilter(currentConfig.data));
              } else {
                let data = typeDoc !== '' ? currentConfig.data.filter(f => f.moduleCode && f.moduleCode.value == typeDoc) : currentConfig.data;
                if (name === "senderUnit" && isAddDocument) {
                  let defaultValue = {
                    label: "Đơn vị gửi",
                    title: `-- Chọn ${label} --`,
                    value: "",
                    _id: ""
                  }
                  data = [defaultValue, ...data]
                  console.log(data, 'data data')

                }
                setMenuItemData(data);
              }
            }
          }
        } catch (error) {
          // ignore
          // console.log('error', error);
        }
      }
    },
    [configCode, options],
  );
  useEffect(() => {
    if (isBookDocument) {
      let obj = {};
      if (typeDocument !== '') {
        obj = {
          filter: {
            "typeDocument.moduleCode.value": typeDocument,
            year: moment().format('YYYY'),
            active: true,
            senderUnit: profile && profile.organizationUnit && profile.organizationUnit.organizationUnitId
          }
        }
      } else {
        obj = {}
      }

      request(`${API_BOOK_DOCUMENT}?${serialize(obj)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
      }).then(res => {
        if (res && res.data) {
          let menu = res.data.map(f => ({ _id: f._id, title: f.name, enTitle: f.toBookCode, value: f._id, count: f.count })) || [];
          // const defaultMenu = 
          //   {
          //     "_id": "",
          //     "title": `-- Chọn ${label} --`,
          //     "enTitle": "",
          //     "value": "",
          //     "count": 0
          // }
          // setMenuItemData([defaultMenu, ...menu])
          setMenuItemData(menu)
        }
      }).catch(error => {
        console.log(error, "error")
        onChangeSnackbar && onChangeSnackbar({ variant: 'success', message: error, status: false })
      })
    }
  }, [configCode, options])

  useEffect(
    () => {
      if (isBookDocument === false && customFilter && props.onReload) {
        setMenuItemData(customFilter(originMenuItemData));
      }
    },
    [props.onReload],
  );

  const menuItemDataRef = useRef()
  useEffect(
    () => {
      if (menuItemData && menuItemData.length > 0 && !_.isEqual(menuItemData, menuItemDataRef.current)) {
        if (!isBookDocument) {
          if (clone) return
          let item = typeDoc == '' ? menuItemData[0] : menuItemData.find(f => f.moduleCode && f.moduleCode.value === typeDoc)
          if (typeof item === 'object' && item) {
            menuItemDataRef.current = [...menuItemData]
            const e = { target: { value: { ...item } } };
            e.target.value.label = label;
            onChange && onChange(e)
          }
        } else {
          let [item] = menuItemData;
          if (typeof item === 'object' && item) {
            menuItemDataRef.current = [...menuItemData]
            const e = { target: { value: { ...item } } };
            e.target.value.label = label;
            onChange && onChange(e)
          }
        }

      }
    },
    [menuItemData, typeDoc],
  );

  useEffect(
    () => {
      if (isBookDocument === false && props.name === 'vacancy.roleName') {
        fetch(API_HUMAN_RESOURCE, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(response => response.json())
          .then(data => {
            setMenuItemData(data.humanResourceSource);
          });
      }
    },
    [props.name, configCode],
  );

  useEffect(
    () => {
      setLocalState(value);
    },
    [value],
  );

  const handleChange = (event, newValue) => {
    setValueNumber(newValue);
  };

  const mapItem = array =>
    array.map((item, index) => (
      <MenuItem key={`${index}`} value={item}>
        {item.title ? item.title : item.name}
      </MenuItem>
    ));
  const changeApi = models => {
    if (models === 'Stock') {
      return 'inventory';
    } else {
      return `inventory/${models.toLowerCase()}`;
    }
  };
  const employeeOptionLabel = option => {
    const code = option.code ? option.code : '';
    const customerName = option.name ? option.name : '';
    if (customerName || code) {
      return `${code} - ${customerName}`;
    }
    return '';
  };

  const employeeOptionLabels = option => {
    const code = option.code ? option.code : '';
    const customerName = option.abstractNote ? option.abstractNote : '';
    if (customerName || code) {
      return `${code} - ${customerName}`;
    }
    return '';
  };

  const templateOptionLabel = option => {
    const customerName = option.title ? option.title : '';
    if (customerName) {
      return `${customerName}`;
    }
    return '';
  };

  const getSelectedValue = (val, typeDoc = '') => {
    if (typeDoc === '' && !isBookDocument) {
      if (!val) return null;
      return menuItemData && menuItemData.find(i => (i.value ? i.value == val.value || i.toBookCode && i.toBookCode === val.value : i.type ? i.type === val.type : i.name && i.name === val.name));

    }
    if (isBookDocument) {
      return menuItemData && menuItemData.find(i => (i._id && i._id === val._id));
    }
    if (typeDoc !== '') {
      return menuItemData && menuItemData.find(i => ((i.moduleCode && i.moduleCode.value === typeDoc) || i._id === val._id));
    }
  };
  const getSelectedValueCustom = (val, typeDoc = '') => {
    if (typeDoc === '' && !isBookDocument) {
      if (!val) return null;
      if (name === "signer" && clone)
        return employee && employee.find(i => (i.value ? i.value == val.value || i.toBookCode === val.value : i.type ? i.type === val.type : i.name === val.name));
      if (name === "receiverUnit" && clone)
        return organization && organization.find(i => (i.value ? i.value == val.value || i.toBookCode === val.value : i.type ? i.type === val.type : i.name === val.name));
      return menuItemData && menuItemData.find(i => (i.value ? i.value == val.value || i.toBookCode === val.value : i.type ? i.type === val.type : i.name === val.name));
    }
    if (isBookDocument) {
      return menuItemData && menuItemData.find(i => (i._id && i._id === val._id));
    }
    if (typeDoc !== '') {
      return menuItemData && menuItemData.find(i => ((i.moduleCode && i.moduleCode.value === typeDoc) || i._id === val._id));
    }
  };
  const findDocType = useCallback((array, typeDoc) => {
    if (array && array.length > 0) {
      if (typeDoc == '') {
        return array[0];
      }
      if (typeDoc !== '')
        return array.find(i => i.moduleCode && i.moduleCode.value === typeDoc);
    }
  }, [typeDoc])

  if (NONE_MENU_ITEM_TYPES.includes(type)) {
    return <CustomInputBase label={label} type={MAPPING_TYPE[type] || type} value={value} onChange={onChange} name={name} {...restProps} />;
  }
  if (type === 'WARRANTY_PERIOD_UNITS') {
    return <WarrantyPeriodInput {...props} />;
  }
  if (type) {
    const [firstEle, model, thirdEle] = type.split('|');
    const isMulti = thirdEle === 'Array' ? true : false;
    if (firstEle === 'ObjectId' && model) {
      let models;
      if (model === 'ExchangingAgreement') {
        models = 'exchanging-agreement';
      } else if (model === 'BusinessOpportunities') {
        models = 'business-opportunitie';
      } else if (model === 'TemplateTask') {
        models = 'template';
      } else if (model === 'SalesQuotation') {
        models = 'sales-quotation';
      } else if (model === 'OrganizationUnit') {
        models = 'organization-unit';
      } else if (model === 'dynamicForm') {
        models = 'dynamic-form';
      } else if (model === 'CostEstimate') {
        models = 'cost-estimate';
      } else {
        models = model;
      }
      return (
        <>
          {model === 'hrm' ? (
            <AsyncAutocomplete
              label={label}
              onChange={onChange}
              customOptionLabel={employeeOptionLabel}
              isMulti={isMulti}
              url={`${APP_URL}/api/hrmEmployee`}
              value={value}
            />
          ) : models === 'OrderPo' ? (
            <AsyncAutocomplete
              label={label}
              onChange={onChange}
              customOptionLabel={employeeOptionLabel}
              isMulti={isMulti}
              url={`${APP_URL}/api/orders-po`}
              value={value}
            />
          ) : models === 'sales-quotation' ? (
            <AsyncAutocomplete
              label={label}
              onChange={onChange}
              noLimit
              customOptionLabel={employeeOptionLabel}
              isMulti={isMulti}
              url={`${APP_URL}/api/${models.toLowerCase()}s`}
              value={value}
            />
          ) : models === 'Contract' ? (
            <AsyncAutocomplete
              label={label}
              onChange={onChange}
              customOptionLabel={employeeOptionLabel}
              isMulti={isMulti}
              url={`${APP_URL}/api/contract`}
              value={value}
            />
          ) : models === 'Tag' || models === 'Stock' || models === 'Catalog' ? (
            <AsyncAutocomplete
              label={label}
              onChange={onChange}
              customOptionLabel={employeeOptionLabel}
              isMulti={isMulti}
              url={`${APP_URL}/api/${changeApi(models)}`}
              value={value}
            />
          ) : models === 'Origin' ? (
            <AsyncAutocomplete
              label={label}
              onChange={onChange}
              customOptionLabel={employeeOptionLabel}
              isMulti={isMulti}
              url={`${APP_URL}/api/inventory/origin/list`}
              value={value}
            />
          ) : models.includes('Documentary') ? (
            <AsyncAutocomplete
              label={label}
              onChange={onChange}
              customOptionLabel={employeeOptionLabel}
              isMulti={isMulti}
              url={`${APP_URL}/api/${models.toLowerCase()}`}
              value={value}
            />
          ) : models.includes('MettingRoom') ? (
            <AsyncAutocomplete
              label={label}
              onChange={onChange}
              customOptionLabel={employeeOptionLabel}
              isMulti={isMulti}
              url={`${APP_URL}/api/metting-schedule/room`}
              value={value}
            />
          )
            // : models.includes('approve-group') ? (
            //   <AsyncAutocomplete
            //     label={label}
            //     onChange={onChange}
            //     customOptionLabel={employeeOptionLabel}
            //     isMulti={isMulti}
            //     url={`${API_APPROVE_GROUPS}`}
            //     value={value}
            //   />
            // ) 
            : models.includes('dynamic-form') ? (
              <AsyncAutocomplete
                label={label}
                filters={['title']}
                onChange={onChange}
                customOptionLabel={templateOptionLabel}
                isMulti={isMulti}
                url={`${API_TEMPLATE}/list`}
                value={value}
              />
            ) : models.includes('organization-unit') && clone ? (
                <Autocomplete
                label={label}
                suggestions={organization && organization.map(m => m)}
                optionLabel="title"
                optionValue="value"
                onChange={newE => {
                  const e = { target: { value: newE } };
                  if (typeof e.target.value === 'object' && e.target.value) {
                    e.target.value.label = label;
                  }
                  onChange(newE);
                }}
                value={value && organization && organization.length > 0 ? getSelectedValueCustom(value, typeDoc) : null}
                name={name}
                {...restProps}
                isClearable={!disableDelete}
              />
              // <AsyncAutocomplete
              //   label={label}
              //   filters={['title']}
              //   onChange={onChange}
              //   customOptionLabel={employeeOptionLabel}
              //   isMulti={isMulti}
              //   url={API_ORIGANIZATION}
              //   value={value}
              // />
            ) : models.includes('IncommingDocument') && clone ? (
              <AsyncAutocomplete
                label={label}
                onChange={onChange}
                customOptionLabel={employeeOptionLabels}
                isMulti={isMulti}
                url={`${APP_URL}/api/${models.toLowerCase()}`}
                value={value}
              />
            ) :
              (
                <AsyncAutocomplete
                  label={label}
                  onChange={onChange}
                  customOptionLabel={employeeOptionLabel}
                  isMulti={isMulti}
                  url={`${APP_URL}/api/${models.toLowerCase()}s`}
                  value={value}
                />
              )
          }
        </>
      );
    }
  }
  if ((type === 'Date' && props.filterType) || (type === 'Datetime' && props.filterType)) {
    return (
      <>
        <DateRangePickerComponent placeholder={label} onChange={onChange} value={value} />
      </>
    );
  } else if (type === 'Date' || type === 'Datetime') {
    if (props.dateFilterType) {
      return (
        <>
          <CustomInputBase
            id="select-month"
            select
            onChange={onChange}
            value={value || ''}
            label={`${props.label} theo ${dateFilterTypeLabels[props.dateFilterType]}`}
            name={props.name}
            style={{ width: '100%' }}
            variant="outlined"
            margin="normal"
            inputProps={{
              style: {
                padding: 0,
              },
            }}
            SelectProps={{
              MenuProps: {},
            }}
          >
            <MenuItem key="-999" value="">
              --- Chọn ---
            </MenuItem>
            {obj[props.dateFilterType].map(field => (
              <MenuItem key={field.name} value={field.name}>
                {field.title}
              </MenuItem>
            ))}
          </CustomInputBase>
        </>
      );
    }
    if (clone) {
      return <CustomDatePicker label={label} onChange={onChange} value={props.value ? value : null} required={props.noRequired} InputLabelProps={{ shrink: true }} clone={clone} />;
    }
    return <CustomDatePicker label={label} onChange={onChange} value={props.value ? value : null} />;
  }
  if (type === 'Number') {
    return (
      <>
        <CustomInputBase label={label} value={value} onChange={onChange} type="number" />
      </>
    );
  }
  if (type === 'Boolean') {
    return (
      <div>
        <FormControl component="fieldset">
          <RadioGroup aria-label="isCheckedNo" name="isCheckedNo" value={isCheckedNo} onChange={onChange}>
            <div>{label}:</div>
            <FormControlLabel value="true" control={<Radio />} label="Có" />
            <FormControlLabel value="false" control={<Radio />} label="Không" />
          </RadioGroup>
        </FormControl>
      </div>
    );
  }
  if (hiddenOptionDefault) {
    if (name === "signer") {
      return (
        <>
          <Autocomplete
            label={label}
            suggestions={employee && employee.map(m => m)}
            optionLabel="name"
            optionValue="value"
            onChange={newE => {
              const e = { target: { value: newE } };
              if (typeof e.target.value === 'object' && e.target.value) {
                e.target.value.label = label;
              }
              onChange(newE);
            }}
            value={value && employee && employee.length > 0 ? getSelectedValueCustom(value, typeDoc) : null}
            name={name}
            {...restProps}
            isClearable={!disableDelete}
          />
        </>
      );
    }
    return (
      <>
        <Autocomplete
          label={label}
          suggestions={typeDocument !== '' ? menuItemData && menuItemData.map(m => m) : menuItemData && menuItemData.map(m => ({ title: m.title || m.name, value: m.value || m.type }))}
          optionLabel="title"
          optionValue="value"
          onChange={newE => {
            const e = { target: { value: newE } };
            if (typeof e.target.value === 'object' && e.target.value) {
              e.target.value.label = label;
            }
            onChange(e);
          }}
          value={value && menuItemData && menuItemData.length > 0 ? getSelectedValueCustom(value, typeDoc) : null}
          name={name}
          {...restProps}
          isClearable={!disableDelete}
        />
      </>
    );
  }
  if(type === 'String'){
    return <CustomInputBase label={label} value={value} name={name} onChange={onChange} type="String" />

  }
  return (
    <Autocomplete
      label={label}
      suggestions={typeDocument !== '' ? menuItemData && menuItemData.map(m => m) : menuItemData && menuItemData.map(m => ({ title: m.title || m.name, value: m.value || m.type }))}
      optionLabel="title"
      optionValue="value"
      onChange={newE => {
        const e = { target: { value: newE } };
        console.log("sdbvhsdbv", e.target.value)

        if (typeof e.target.value === 'object' && e.target.value) {
          e.target.value.label = label;
        }
        if(isLifeDrive){
          e.target.name = name
        }

        onChange(e);
      }}
      value={value ? getSelectedValue(value, typeDoc) : menuItemData ? findDocType(menuItemData, typeDoc) : null}
      name={name}
      {...restProps}
      isClearable={!disableDelete}
    />
  );
  return (
    <CustomInputBase
      value={value ? getSelectedValue(value) : menuItemData ? menuItemData[0] : null}
      onChange={e => {
        if (typeof e.target.value === 'object' && e.target.value) {
          e.target.value.label = label;
        }
        onChange(e);
      }}
      label={label}
      name={name}
      select
      {...restProps}
    >
      <MenuItem key="-9999" value={null}>
        -- CHỌN {label} --
      </MenuItem>
      {mapItem(menuItemData)}
    </CustomInputBase>
  );
}
export default memo(CustomInputField);
// export default compose(
//   memo,
// )(CustomInputField);
