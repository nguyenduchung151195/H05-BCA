import { Button, CircularProgress, Grid, MenuItem, OutlinedInput, Select, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { API_SMART_FORM_PDF_URL, UPLOAD_APP_URL } from '../../../config/urlConfig';
import request from '../../../utils/request';
import _ from 'lodash';
import { AddCircle } from '@material-ui/icons';
import InputBase from '@material-ui/core/InputBase';
import { clientId } from '../../../variable';
const dic = {
  // abt: _.invert({
  //   "text":"text"
  // }),
  cmnd: _.invert({
    'Họ và tên': 'name',
    'Họ tên': 'name',
    'Họ và tên / Full name': 'name',
    'id': 'id_card',
    'Số / No': 'id_card',
    'Ngày, tháng, năm sinh': 'dob',
    'Sinh ngày': 'dob',
    'Ngày sinh / Date of birth': 'dob',
    'Giới tính': 'sex',
    'Giới tính / Sex': 'sex',
    'Quốc tịch': 'nationality',
    'Quốc tịch / Nationality': 'nationality',
    'Quê quán': 'poo',
    'Quê quán / Place of origin': 'poo',
    'Nguyên quán': 'poo',
    'Nơi thường trú': 'por',
    'Nơi thường trú / Place of residence': 'por',
    'Nơi ĐKHK thường trú': 'por',
    'Có giá trị đến': 'doe',
    'Có giá trị đến / Date of expiry': 'doe',
    'Đặc điểm nhận dạng': 'pi',
    'Dấu vết riêng và dị hình': 'pi',
    'Đặc điểm nhận dạng / Personal identification': 'pi',
    'Ngày làm CMND': 'dop',
    'Ngày, tháng, năm / Date, month, year': 'dop',
    'Địa điểm làm CMND': 'poi',
    'Giám đốc CA': 'poi',
  }),
  cccc: _.invert({
    'Họ và tên': 'name',
    'Họ tên': 'name',
    'Họ và tên / Full name': 'name',
    id: 'id_card',
    'Số / No': 'id_card',
    'Ngày, tháng, năm sinh': 'dob',
    'Sinh ngày': 'dob',
    'Ngày sinh / Date of birth': 'dob',
    'Giới tính': 'sex',
    'Giới tính / Sex': 'sex',
    'Quốc tịch': 'nationality',
    'Quốc tịch / Nationality': 'nationality',
    'Quê quán': 'poo',
    'Quê quán / Place of origin': 'poo',
    'Nguyên quán': 'poo',
    'Nơi thường trú': 'por',
    'Nơi thường trú / Place of residence': 'por',
    'Nơi ĐKHK thường trú': 'por',
    'Có giá trị đến': 'doe',
    'Có giá trị đến / Date of expiry': 'doe',
    'Đặc điểm nhận dạng': 'pi',
    'Dấu vết riêng và dị hình': 'pi',
    'Đặc điểm nhận dạng / Personal identification': 'pi',
    'Ngày làm CMND': 'dop',
    'Ngày, tháng, năm / Date, month, year': 'dop',
    'Giám đốc CA': 'poi',
  }),
  cccd: _.invert({
    'Họ và tên': 'name',
    'Họ tên': 'name',
    'Họ và tên / Full name': 'name',
    'id': 'id_card',
    'Số / No': 'id_card',
    'Ngày, tháng, năm sinh': 'dob',
    'Sinh ngày': 'dob',
    'Ngày sinh / Date of birth': 'dob',
    'Giới tính': 'sex',
    'Giới tính / Sex': 'sex',
    'Quốc tịch': 'nationality',
    'Quốc tịch / Nationality': 'nationality',
    'Quê quán': 'poo',
    'Quê quán / Place of origin': 'poo',
    'Nguyên quán': 'poo',
    'Nơi thường trú': 'por',
    'Nơi thường trú / Place of residence': 'por',
    'Nơi ĐKHK thường trú': 'por',
    'Có giá trị đến': 'doe',
    'Có giá trị đến / Date of expiry': 'doe',
    'Đặc điểm nhận dạng': 'pi',
    'Dấu vết riêng và dị hình': 'pi',
    'Đặc điểm nhận dạng / Personal identification': 'pi',
    'Ngày làm CMND': 'dop',
    'Ngày, tháng, năm / Date, month, year': 'dop',
    'Giám đốc CA': 'poi',
  }),
  ttk: _.invert({
    'SỐ SERI': 'seri_number',
    'SỐ CIF': 'CIF',
    'CHỦ SỞ HỮU': 'name',
    'PHÁP LÝ KHÁCH HÀNG': 'id_def',
    'NGÀY CẤP': 'datetime_id',
    'NƠI CẤP': 'addr_id',
    'SẢN PHẨM': 'product_number',
    'NGÀY GỬI TIỀN': 'period',
    'NGÀY ĐẾN HẠN': 'date_ex',
    'SỐ TK': 'TKFD',
  }),
  hc: _.invert({
    'Họ và tên / Full name': 'name',
    'Số hộ chiếu / Passport N': 'passport_id',
    'Số GCMND / ID card N': 'id_card',
    'Ngày sinh / Date of birth': 'dob',
    'Giới tính / Sex': 'sex',
    'Loại / Type': 'type',
    'Mã số / Code': 'code',
    'Quốc tịch / Nationality': 'nationality',
    'Ngày cấp / Date of issue': 'dop',
    'Có giá trị đến / Date of expiry': 'doe',
    'Nơi cấp / Place of issue': 'poi',
    'Nơi sinh / Place of birth': 'dob',
  }),
  dkkd: _.invert({
    'Tên công ty viết bằng tiếng Việt': 'name_VN',
    'Tên công ty viết bằng tiếng nước ngoài': 'name_other',
    'Tên công ty viết tắt': 'name_code',
    'Địa chỉ trụ sở chính': 'addr',
    'Điện thoại': 'phone_number',
    'Email': 'email',
    'Website': 'website',
    'Vốn điều lệ': 'equity',
    'Mã số doanh nghiệp': 'company_code',
    'Đăng ký lần đầu': 'dof',
    'Họ và tên': 'incharge',
    'Giới tính': 'sex',
    'Chức danh': 'title',

    'Sinh ngày': 'dob',
    'Loại giấy tờ pháp lý của cá nhân': 'id_def',
    'Ngày cấp': 'Ngày cấp',
    'Địa chỉ thường trú': 'incharge_addr',
    'Địa chỉ liên lạc': 'incharge_addr_now',
  }),
  sohong: _.invert({
    'id': 'id_def',
    'tên ông': 'name_mr',
    'Năm sinh ông': 'dob_mr',
    'id ông': 'id_card_mr',
    'Địa chỉ ông': 'addr_mr',
    'tên bà': 'name_mrs',
    'Năm sinh bà': 'dob_mrs',
    'id bà': 'id_card_mrs',
    'Địa chỉ bà': 'addr_mrs',
    'Thửa đất số': 'id_place',
    'Tờ bản đồ số': 'id_map',
    'Địa chỉ': 'addr_def',
    'Diện tích': 'vacant',
    'Mục đích sử dụng': 'objective',
    'Thời hạn sử dụng': 'datetime',
    'Nguồn gốc sử dụng': 'source',
    'Diện tích sàn': 'vacant_house_size',
    'Cấp (Hạng)': 'level_house',
    'Thời hạn sở hữu': 'datetime_house',
    'Ghi chú': 'note',
    'Địa điểm': 'place_def',
    'Ngày, tháng, năm': 'datetime_place',
    'Nội dung thay đổi và cơ sở pháp lý': 'change_content',
  }),
};
const DOC_TYPES = [
  {
    name: 'cmnd',
    title: 'CMND',
  },
  {
    name: 'cccd',
    title: 'Căn cước công dân',
  },
  {
    name: 'cccc',
    title: 'Căn cước công dân có chíp',
  },
  {
    name: 'abt',
    title: 'Chữ viết tay',
  },
  {
    name: 'dkkd',
    title: 'Đăng ký kinh doanh',
  },
  //  {
  //    name: 'sohong',
  //    title: 'Chứng nhận quyền sử dụng đất',
  //  },
  {
    name: 'hc',
    title: 'Hộ chiếu',
  },
];

function SmartForm(props) {
  const [urlFile, setUrlFile] = useState('');
  const [isFirst, setIsFirst] = useState(true);
  // const [smartForms] = useState(JSON.parse(localStorage.getItem('smartForms') || '[]'));
  // const [viewConfig] = useState(JSON.parse(localStorage.getItem('viewConfig') || '[]'));
  // const [arrayData, setArrayData] = useState([]);
  // const [data, setData] = useState(null);
  // const [smartForm, setSmartForm] = useState("");
  // const [contentVietTay, setContentVietTay] = useState([]);
  // const [content, setContent] = useState({});
  // const [isLoading, setIsLoading] = useState(false);
  // const [type, setType] = useState("");
  const [columnsScanFileGet, setColumnsScanFileGet] = useState();

  const [localData, setLocalData] = useState({
    smartForms: JSON.parse(localStorage.getItem('smartForms') || '[]'),

    viewConfig: JSON.parse(localStorage.getItem('viewConfig') || '[]'),
    arrayData: [],
    data: [],
    smartForm: '',
    contentVietTay: [],
    arrContent: [],
    content: {},
    type: '',
    isLoading: false,
  });
  const { smartForms, viewConfig, arrayData, data = [], smartForm, contentVietTay, content, type, isLoading, arrContent = [] } = localData;

  useEffect(
    () => {
        if(props.extract) {
            if (Object.keys(props.extract).length > 0) {
                const smartFormFound = localData.smartForms.find(s => `smart_forms_${s.code}` === props.extract.metaData.smartForms);
                if (smartFormFound && Object.keys(smartFormFound).length > 0) {
                  const scanViewConfig = localData.viewConfig && localData.viewConfig.find(item => item.code === smartFormFound.moduleCode);
                  console.log(scanViewConfig, 'scanViewConfig');
        
                  const columnsScanFile = scanViewConfig && scanViewConfig.listDisplay.type.fields.type.columns;
                  setColumnsScanFileGet(columnsScanFile);
                }
              }
        }
      
    },
    [props.extract],
  );
  useEffect(
    () => {
      setLocalData({ ...localData, arrayData: columnsScanFileGet });
    },
    [columnsScanFileGet],
  );
  const [newRowExtract, setNewRowExtract] = useState([]);
  const handleChangeExtract = (e, key, index) => {
    let value = e.target.value;
    const newData = localData.data.map((el, idx) => {
      if (idx === index) {
        return {
          ...el,
          [key]: value,
        };
      } else {
        return el;
      }
    });
    setLocalData({
      ...localData,
      data: newData,
    });
  };
  const handleAddRowExtract = () => {
    let newArr = newRowExtract || [];
    if (newArr.length >= 10) {
      props.onChangeSnackbar && props.onChangeSnackbar({ variant: 'warning', message: 'Chỉ thêm tối đa 10 trường ', status: true });
    } else {
      newArr.push({ name: '', value: '' });
      setNewRowExtract(newArr);
      setLocalData({
        ...localData,
      });
    }
  };
  const handleChangeNewExtract = (e, key, index) => {
    let value = e.target.value;
    const newList = newRowExtract.map((item, idx) => {
      if (idx === index) {
        return {
          ...item,
          [key]: value,
        };
      } else {
        return item;
      }
    });
    setNewRowExtract(newList);
    setLocalData({
      ...localData,
      ...newList,
    });
    console.log(localData);
  };

  useEffect(
    () => {
      const { files, extract } = props;
      console.log(files);
      if (files) {
        setUrlFile(URL.createObjectURL(files));
        setLocalData({ ...localData, data: extract && Object.keys(extract) && extract.metaData ? extract.metaData.others : [] });
      } else {
        setUrlFile();
      }
    },
    [props.files, props.extract],
  );

  useEffect(
    () => {
      const { localDataPrev = {} } = props;
      const { data } = localDataPrev;
      if (isFirst) {
        const { content } = localDataPrev;

        if (data && data.length) {
          props.handlechangeMeta && props.handlechangeMeta(data);
        }
        if (content && Object.keys(content).length) {
          // const result = []
          // Object.keys(content).map((key) => {
          //     result.push({ [key]: content[key] })
          // });
          props.handlechangeMeta && props.handlechangeMeta(content);
        }
        setLocalData({
          ...localData,
          ...localDataPrev,
          isLoading: false,
        });
        setIsFirst(false);
      }
    },
    [props.localDataPrev],
  );
  useEffect(
    () => {
      const { data } = localData;
      props.handlechangeMeta && props.handlechangeMeta((newRowExtract.length > 0) ? [...data, ...newRowExtract] : data);
    },
    [localData.data, newRowExtract],
  );
  // const { type } = props

  return (
    <Grid item md={12} container spacing={16}>
      <Grid item md={8} container style={{ height: 680 }}>
        {<iframe src={`${urlFile}`} width="100%" height="100%" value="file" />}
      </Grid>
      <Grid item md={4} style={{ maxHeight: 680, overflow: 'auto' }}>
        {/* trích xuất */}
        <Grid item md={12} container className="my-2" spacing={8}>
          <Grid item md={6}>
            <Select
              style={{ height: '38px', width: '100%' }}
              name="type"
              title="Lựa chọn trường để import"
              value={localData.type}
              onChange={e => {
                console.log(e.target.value, 'e.target.value');
                const val = e.target.value;
                if (val && val.includes('smart_forms')) {
                  setLocalData({
                    ...localData,
                    type: val,
                    smartForm: val,
                    content: null,
                    arrContent: [],
                    contentVietTay: [],
                  });
                console.log(val, 'valkjjjj');

                props.setSmartForms(val)
                  return;
                }
                setLocalData({
                  ...localData,
                  type: e.target.value,
                  smartForm: '',
                  content: {},
                  arrContent: [],
                  contentVietTay: [],
                });
                props.setSmartForms(val)

              }}
              input={<OutlinedInput name="age" id="outlined-age-simple" value />}
            >
              <MenuItem value="">Chọn form trích xuất</MenuItem>
              {DOC_TYPES.map(i => (
                <MenuItem value={i.name}>{i.title}</MenuItem>
              ))}
              {smartForms && smartForms.map(i => <MenuItem value={`smart_forms_${i.code}`}>{i.title}</MenuItem>)}
            </Select>
          </Grid>

          {isLoading ? (
            <CircularProgress />
          ) : (
            <Grid item md={6}>
              <Button
                variant="outlined"
                // color="primary"
                onClick={() => {
                  // const file = document.getElementById('fileUpload').files[0];
                  const smartFormFound = smartForms.find(s => `smart_forms_${s.code}` === smartForm);
                  const { files } = props;
                  const { type } = localData;

                  if (!files) {
                    props.onChangeSnackbar &&
                      props.onChangeSnackbar({ variant: 'warning', message: 'Vui lòng chọn file trước khi trích xuất!', status: true });
                    return;
                  }
                  if (!type) {
                    props.onChangeSnackbar &&
                      props.onChangeSnackbar({ variant: 'warning', message: 'Đồng chí chưa chọn loại văn bản!', status: true });
                    return;
                  }
                  setLocalData({
                    ...localData,
                    isLoading: true,
                    content: [],
                    arrContent: [],
                    contentVietTay: [],
                    data: [],
                  });

                  //   smart form biểu mẫu động
                  props.handleChangleMetaDataOthers && props.handleChangleMetaDataOthers('');
                  if (smartFormFound && smartFormFound.config && smartFormFound.moduleCode) {
                    const meta = [];
                    smartFormFound.config.map(d => {
                      meta.push({
                        fieldKey: d.fieldKey,
                        h: Math.floor(d.h * d.coefficient),
                        w: Math.floor(d.w * d.coefficient),
                        x: Math.floor(d.x * d.coefficient),
                        y: Math.floor(d.y * d.coefficient),
                        page: 1,
                      });
                    });
                    const scanViewConfig = viewConfig && viewConfig.find(item => item.code === smartFormFound.moduleCode);
                    const columnsScanFile = scanViewConfig && scanViewConfig.listDisplay.type.fields.type.columns;
                    console.log(columnsScanFile, 'columnsScanFile');
                    let newLocalData = { ...localData, arrayData: columnsScanFile };
                    const formData = new FormData();
                    formData.append('file', files);
                    formData.append('meta', JSON.stringify({ data: meta }));
                    fetch(API_SMART_FORM_PDF_URL, {
                      method: 'POST',
                      body: formData,
                    })
                      .then(res => res.json())
                      .then(data => {
                        props.handlechangeMeta && props.handlechangeMeta(data);
                        // const newData = Object.entries(data)
                        const newData = [];
                        for (const key in data) {
                          newData.push({ [key]: data[key] });
                        }
                        newLocalData = { ...newLocalData, isLoading: false, arrContent: [], data: newData };
                      })
                      .catch(error => {
                        newLocalData = { ...newLocalData, isLoading: false };

                        console.log('error', error);
                      })
                      .finally(() => {
                        setLocalData({ ...newLocalData });
                      });
                    return;
                  }
                  //  smart ảnh, chữ số viết tay
                  var reader = new FileReader();
                  console.log(type, 'type111111111');

                  reader.readAsDataURL(files);
                  reader.onload = () => {
                    const body = {
                      data: {
                        images: [reader.result.split(',')[1]],
                        type: type,
                      },
                    };
                    const url = type === 'hc' || type === 'dkkd' ? 'https://g.lifetek.vn:298/detection1' : 'https://g.lifetek.vn:298/detection';
                    console.log(url, 'url');
                    request(url, {
                      method: 'POST',
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(body),
                    })
                      .then(res => {
                        console.log(res, 'ress');
                        const newContent = { image: reader.result, content: res.data || [] };
                        setLocalData({
                          ...localData,
                          content: res.data || {},
                          isLoading: false,
                          arrContent: [newContent],
                          contentVietTay: res.data ? [] : res,
                          data: [],
                          // arrContent: Array.isArray(this.state.arrContent) ? [...this.state.arrContent, newContent] : [newContent]
                        });
                        const content = res.data || {};
                        // const result = []
                        // Object.keys(content).map((key) => {
                        //     result.push({ [key]: content[key] })
                        // });
                        props.handlechangeMeta && props.handlechangeMeta(content);
                      })
                      .catch(e => {
                        setLocalData({ ...localData, isLoading: false });
                        console.log('e', e);
                      });
                  };
                  reader.onerror = error => {
                    setLocalData({ ...localData, isLoading: true });
                    console.log('Error: ', error);
                  };
                }}
              >
                Trích xuất
              </Button>
            </Grid>
          )}
        </Grid>
        <div>
          {/* <Grid item md={12} container spacing={16} className="my-2"> */}
          {console.log(arrContent, type, 'arrContent', content)}
          {(arrContent &&
            Array.isArray(arrContent) &&
            arrContent.length &&
            arrContent.map(it => {
              return (
                <>
                  <Grid item sm={12}>
                    {type === 'abt' ? (
                      <>
                        {content && content.text && Array.isArray(content.text) && content.text.map(el => {
                          return (
                            <>
                              <Grid item sm={12} alignItems="flex-start" style={{ textAlign: 'left' }}>
                                {el}
                              </Grid>
                            </>
                          );
                        })}
                      </>
                    ) : (
                      <>
                        {Object.keys(it && it.content).map(key => (
                          <Grid container>
                            <Grid item sm={4} alignItems="flex-start" style={{ textAlign: 'left' }}>
                              {(dic[type] && dic[type][key]) || key || ''}:
                            </Grid>
                            {/* <Grid item sm={8} alignItems="flex-start" style={{ textAlign: 'left' }}>
                              <InputBase
                                style={{ border: 'solid 1px #ccc', width: '100%', borderRadius: '4px', padding: '0 5px' }}
                                onChange={e => handleChangeExtract(e, key, index)}
                              />
                            </Grid> */}
                            <Grid item sm={8} alignItems="flex-start" style={{ textAlign: 'left' }}>
                              {(content && content[key]) || ''}
                            </Grid>
                          </Grid>
                        ))}
                      </>
                    )}
                  </Grid>
                </>
              );
            })) ||
            ''}
          {(data &&
            Array.isArray(data) &&
            data.length &&
            data.map((el, index) => {
              const name = Object.keys(el) && Array.isArray(Object.keys(el)) && Object.keys(el).length ? Object.keys(el)[0] : Object.keys(el);
              console.log(name);
              return (
                <>
                  <Grid item md={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <b style={{ fontWeight: 'bold' }}>
                      {(arrayData && arrayData.find(it => it.name === name) && arrayData.find(it => it.name === name).title) || name}
                    </b>
                    <InputBase
                      value={Object.values(el) || ''}
                      style={{ border: 'solid 1px #ccc', width: '75%', borderRadius: '4px', padding: '0 5px', marginTop: '8px' }}
                      onChange={e => handleChangeExtract(e, name, index)}
                    />
                  </Grid>
                </>
              );
            })) ||
            ''}
          {Array.isArray(newRowExtract) &&
            newRowExtract.length  &&
            newRowExtract.map((item, index) => (
              <Grid item md={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                <Grid item xs={3}>
                  <InputBase
                    value={item.name ? item.name : ''}
                    style={{ border: 'solid 1px #ccc', borderRadius: '4px', padding: '0 5px', width: '80%' }}
                    onChange={e => handleChangeNewExtract(e, 'name', index)}
                  />
                </Grid>
                <Grid item xs={9}>
                  <InputBase
                    value={item.value ? item.value : ''}
                    style={{ border: 'solid 1px #ccc', borderRadius: '4px', padding: '0 5px', width: '100%' }}
                    onChange={e => handleChangeNewExtract(e, 'value', index)}
                  />
                </Grid>
              </Grid>
            ))}
          <Button>
            <AddCircle onClick={() => handleAddRowExtract()} />
          </Button>
        </div>
        {/* <Grid item md={12} style={{maxHeight: 600}}></Grid> */}
      </Grid>

      {/* </Grid> */}
    </Grid>
  );
}

export default SmartForm;
