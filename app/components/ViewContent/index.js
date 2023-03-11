import React, { memo, useState, useEffect, useCallback } from 'react';

import { Grid as GridMaterialUI } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import toVietNamDate from '../../helper';
import moment from 'moment';
import axios from 'axios';
import { API_APPROVE, API_COMMON } from '../../config/urlConfig';
import { serialize } from '../../utils/common';
import { CustomTreeData } from '@devexpress/dx-react-grid';

const TypographyDetail = ({ children, data }) => {
  return (
    <div className="task-info-detail">
      <p>{children}:</p>
      <p>{data}</p>
    </div>
  );
};
function ViewContent(props) {
  const [urlData, setUrlData] = useState([]);
  const [dataInfor, setDataInfor] = useState(props.dataInfo);
  const dataInfo = dataInfor ? (dataInfor.length > 2 ? dataInfor.find(e => e._id === props.id) : dataInfor) : null;
  let code = '';
  if (props.code === 'Tas') {
    code = 'Task';
  } else {
    code = props.code;
  }
  const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
  const list = viewConfig.find(item => item.code === code);
  let data = [];
  if (list) {
    data = list.listDisplay.type.fields.type.columns.filter(i => i.checked);
  }
  useEffect(
    () => {
      let mdcode = '';
      let mdItem = '';
      if (props.code === 'Tas') {
        mdcode = 'Task';
        mdItem = props.objectId ? props.objectId : props.id;
      } else {
        mdcode = props.code;
        mdItem = props.idItem ? props.idItem : props.id;
      }
      //console.log(props, 'kkk');

      const api = `${API_COMMON}/${mdcode}/${mdItem}`;
      axios
        .get(api, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        })
        .then(res => {
          setDataInfor(res.data);
        })
        .catch(error => console.log(error, props, 'kkkk'));
    },
    [props.code, props.idItem, props.objectId],
  );
  return (
    <div>
      {props.viewMode === 'center' ? (
        <GridMaterialUI container>
          {dataInfo
            ? data.map(item => (
              <GridMaterialUI item xs={6}>
                <GridMaterialUI container>
                  <GridMaterialUI item xs={6} alignItems="flex-end">
                    <div style={{ textAlign: 'end', fontWeight: 'bold', paddingRight: 10 }}>{item.title}:</div>
                  </GridMaterialUI>
                  <GridMaterialUI item xs={6} alignItems="flex-start">
                    <div style={{ paddingLeft: 10 }}>
                      {Array.isArray(dataInfo[item.name])
                        ? dataInfo[item.name].length > 0
                          ? dataInfo[item.name].map(i => {
                            typeof i === Object ? (i ? `${i.name}` : []) : i ? `${i}` : [];
                          })
                          : []
                        : dataInfo[item.name]
                          ? dataInfo[item.name] && dataInfo[item.name].name
                            ? `${dataInfo[item.name].name}`
                            : dataInfo[item.name] && typeof dataInfo[item.name].search === 'function' && dataInfo[item.name].search('000Z') === -1
                              ? `${dataInfo[item.name]}`
                              : `${dataInfo[item.name]}`
                          : dataInfo[item.name]}
                    </div>
                  </GridMaterialUI>
                </GridMaterialUI>
              </GridMaterialUI>
            ))
            : null}
        </GridMaterialUI>
      ) : (
        <GridMaterialUI container>
          {dataInfo
            ? data.map(item => (
              <GridMaterialUI item xs={6}>
                <TypographyDetail
                  data={
                    Array.isArray(dataInfo[item.name])
                      ? dataInfo[item.name].length > 0
                        ? dataInfo[item.name].map(i => {
                          typeof i === Object ? (i ? `${i.name}` : []) : i ? `${i}` : [];
                        })
                        : []
                      : dataInfo[item.name]
                        ? dataInfo[item.name] && dataInfo[item.name].name
                          ? `${dataInfo[item.name].name}`
                          : dataInfo[item.name] && typeof dataInfo[item.name].search === 'function' && dataInfo[item.name].search('000Z') === -1
                            ? `${dataInfo[item.name]}`
                            : `${dataInfo[item.name]}`
                        : dataInfo[item.name]
                  }
                >
                  <span style={{ fontWeight: 'bold' }}>{item.title}:</span>
                </TypographyDetail>
              </GridMaterialUI>
            ))
            : null}
        </GridMaterialUI>
      )}
    </div>
  );
}

export default memo(ViewContent);
