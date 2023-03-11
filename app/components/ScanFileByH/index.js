import React, { memo, useState, useEffect, useCallback } from 'react';

import { Button, OutlinedInput, MenuItem, Select, Grid, CircularProgress } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import toVietNamDate from '../../helper';
import moment from 'moment';
import axios from 'axios';
import swal from '@sweetalert/with-react';
import { API_APPROVE, API_COMMON, API_PERSONNEL, API_USERS } from '../../config/urlConfig';
// import { serialize } from '../../utils/common';
import { CustomTreeData } from '@devexpress/dx-react-grid';
import { setState } from '../../containers/ListPage/actions';
import { API_SMART_FORM_PDF_URL, APP_URL, API_APPROVE_GROUPS, API_TEMPLATE } from 'config/urlConfig';
import { customerColumns } from '../../variable';
import { serialize } from '../../helper';

function ScanFileByH(props) {
  const [project, setProject] = useState({
    fullPath: '',
  });
  const [smartFormX, setSmartFormX] = useState();
  const [arrayData, setArrayData] = useState();
  const [type, setType] = useState();
  const [localState, setLocalState] = useState([]);
  const smartForms = JSON.parse(localStorage.getItem('smartForms') || '[]');
  const viewConfig = JSON.parse(localStorage.getItem('viewConfig') || '[]');
  const viewConfigCode = viewConfig && viewConfig.find(it => it.code === props.code);
  const columns = viewConfigCode && viewConfigCode.editDisplay.type.fields.type.columns;
  console.log('columns',columns);
  return (
    <div>
      <Grid container>
        <Grid item sm={6} className="my-2">
          <input type="file" id="fileUploadH" name="fileUploadH" accept=".pdf,.jpeg,.png,.jpg" />
        </Grid>

        <Grid item sm={6}>
          <Select
            style={{ height: '38px', width: '100%' }}
            name="type"
            title="Lựa chọn trường để import"
            value={type}
            onChange={e => {
              const val = e.target.value;
              if (val && val.includes('smart_forms')) {
                setType(val);
                setSmartFormX(val);
                return;
              }
            }}
            input={<OutlinedInput name="age" id="outlined-age-simple" />}
          >
            <MenuItem value="">Chọn loại văn bản</MenuItem>
            {smartForms.map(i => (
              <MenuItem value={`smart_forms_${i.code}`}>{i.title}</MenuItem>
            ))}
          </Select>
        </Grid>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            const file = document.getElementById('fileUploadH').files[0];
            const smartForm = smartForms.find(s => `smart_forms_${s.code}` === smartFormX);
            if (smartForm && smartForm.config && smartForm.moduleCode) {
              const meta = [];
              smartForm.config.map(d => {
                meta.push({
                  fieldKey: d.fieldKey,
                  h: Math.floor(d.h * d.coefficient),
                  w: Math.floor(d.w * d.coefficient),
                  x: Math.floor(d.x * d.coefficient),
                  y: Math.floor(d.y * d.coefficient),
                  page: 1,
                });
              });
              const formData = new FormData();
              formData.append('file', file);
              formData.append('meta', JSON.stringify({ data: meta }));
              fetch(API_SMART_FORM_PDF_URL, {
                method: 'POST',
                body: formData,
              })
                .then(res => res.json())
                .then(data => {
                  if (data) {
                    let newValues = Object.values(data);
                    console.log('newValues', newValues);
                    let newKeys = Object.keys(data);
                    console.log('newKeys', newKeys);
                    newKeys.forEach((item, index) => {
                      console.log('item',item);
                      let column = columns && columns.find(it => it.name === item);
                      console.log('column',column);

                      if (column && column.name === 'gender') {
                        if (newValues[index].trim().toUpperCase() === 'NAM') {
                          props.onSaveDataScan({ [item]: 0 });
                        } else {
                          props.onSaveDataScan({ [item]: 1 });
                        }
                      }
                      if (column && column.type === 'String') {
                        props.onSaveDataScan({ [item]: newValues[index].trim() });
                      }
                      if ((column && column.type === 'Date') || (column && column.name === 'birthday')) {
                        if (newValues[index].includes('/')) {
                          let date = moment(
                            moment(newValues[index].trim(), 'DD/MM/YYYY')
                              .format('YYYY/MM/DD')
                              .trim(),
                          );
                          props.onSaveDataScan({ [item]: date });
                        } else {
                          let date = moment(
                            moment(newValues[index].trim(), 'DD-MM-YYYY')
                              .format('YYYY/MM/DD')
                              .trim(),
                          );
                          console.log(
                            'dateeee',
                            moment(newValues[index].trim(), 'DD-MM-YYYY')
                              .format('YYYY/MM/DD')
                              .trim(),
                          );
                          console.log('date', date);
                          props.onSaveDataScan({ [item]: date });
                        }
                      }
                      if (column && column.type.includes('Source')) {
                        let configCode = column && column.configCode;
                        console.log('configCode', configCode);
                        let configType = column && column.configType;
                        console.log('configType', configType);
                        let dataRenderLocal = JSON.parse(localStorage.getItem(configType)) || null;
                        console.log('dataRenderLocal', dataRenderLocal);
                        let dataRender = dataRenderLocal ? dataRenderLocal.find(item => item.code === configCode) : null;
                        console.log('dataRender', dataRender);
                        console.log('newValues[index].trim()', newValues[index].trim());
                        let valueData = dataRender && dataRender.data.find(item => item.title === newValues[index].trim());
                        console.log('valueData', valueData);

                        if (props.code === 'hrm') {
                          let newValueData = { ...valueData, label: column && column.title };
                          console.log('newValueData', newValueData);

                          props.onSaveDataScan({ [item]: newValueData });
                        } else {
                          props.onSaveDataScan({ [item]: valueData.value });
                        }
                      }
                      if (column && column.type.includes('ObjectId')) {
                        let [firstEle, model, thirdEle] = column && column.type.split('|');
                        console.log('firstEle',firstEle);
                        console.log('model',model);
                        let query = {
                          filter: {
                            name: newValues[index].trim(),
                          },
                          limit: 1,
                          skip: 0,
                        };
                        let url = '';

                        if (firstEle === 'ObjectId' && model) {
                          let models;
                          if (model === 'ExchangingAgreement') {
                            models = 'exchanging-agreement';
                          } else if (model === 'BusinessOpportunities') {
                            models = 'business-opportunitie';
                          } else if (model === 'businessOpportunities') {
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

                          if (model === 'hrm') {
                            url = `${APP_URL}/api/hrmEmployee?${serialize(query)}`;
                          } else if (models === 'OrderPo') {
                            url = `${APP_URL}/api/orders-po?${serialize(query)}`;
                          } else if (models === 'ContactCenter') {
                            url = `${APP_URL}/api/contact-center?${serialize(query)}`;
                          } else if (models === 'sales-quotation') {
                            url = `${APP_URL}/api/${models.toLowerCase()}s?${serialize(query)}`;
                          } else if (models === 'Contract') {
                            url = `${APP_URL}/api/contract?${serialize(query)}`;
                          } else if (models === 'Tag' || models === 'Stock' || models === 'Catalog') {
                            url = `${APP_URL}/api/${changeApi(models)}?${serialize(query)}`;
                          } else if (models === 'Origin') {
                            url = `${APP_URL}/api/inventory/origin/list?${serialize(query)}`;
                          } else if (models === 'Documentary') {
                            url = `${APP_URL}/api/${models.toLowerCase()}?${serialize(query)}`;
                          } else if (models === 'MettingRoom') {
                            url = `${APP_URL}/api/metting-schedule/room?${serialize(query)}`;
                          } else if (models === 'approve-group') {
                            url = `${API_APPROVE_GROUPS}?${serialize(query)}`;
                          } else if (models === 'dynamic-form') {
                            url = `${API_TEMPLATE}/list?${serialize(query)}`;
                          } else if (models === 'asset') {
                            url = `${APP_URL}/api/asset?${serialize(query)}`;
                          } else {
                            url = `${APP_URL}/api/${models.toLowerCase()}s?${serialize(query)}`;
                          }
                          fetch(url, {
                            method: 'GET',
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem('token')}`,
                            },
                          })
                            .then(data => data.json())
                            .then(dt => {
                              console.log('dt',dt);
                              let value = [];
                              if (dt) {
                                value.push(dt && dt.data && dt.data[0]);
                                props.onSaveDataScan({ [item]: value });
                              }
                            })
                            .catch(error => {
                              console.log(error);
                            });
                        }
                      }
                    });
                    props.onCloseDialogScan();
                    swal('Tải dữ liệu thành công!', '', 'success');
                  } else {
                    swal('Không có dữ liệu !', err.response.data.message, 'warning');
                  }
                  props.onSaveDataScan(data);
                })
                .catch(error => {
                  console.log('error', error);
                });
              return;
            }
          }}
        >
          Tải lên
        </Button>
      </Grid>
    </div>
  );
}

export default memo(ScanFileByH);
