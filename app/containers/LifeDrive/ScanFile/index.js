/* eslint-disable react/prop-types */
/* eslint-disable indent */
/**
 *
 * CreateProjectContentDialog
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
// import AsyncSelect from 'react-select/async';
import { TextField, Grid, Button, Select, OutlinedInput, MenuItem, CircularProgress } from '@material-ui/core';
import PrintOutlinedIcon from '@material-ui/icons/PrintOutlined';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
//  import AsyncSelect from '../AsyncComponent';
import { API_USERS } from 'config/urlConfig';
/* eslint-disable react/prefer-stateless-function */
import './styles.scss'
import SmartForm from './smartForm';
import request from '../../../utils/request';

import { API_SMART_FORM_PDF_URL } from '../../../config/urlConfig';
import _ from 'lodash';

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
    "Họ và tên": "name",
    "Họ tên": "name",
    "Họ và tên / Full name": "name",
    "id": "id_card",
    "Số / No": "id_card",
    "Ngày, tháng, năm sinh": "dob",
    "Sinh ngày": "dob",
    "Ngày sinh / Date of birth": "dob",
    "Giới tính": "sex",
    "Giới tính / Sex": "sex",
    "Quốc tịch": "nationality",
    "Quốc tịch / Nationality": "nationality",
    "Quê quán": "poo",
    "Quê quán / Place of origin": "poo",
    "Nguyên quán": "poo",
    "Nơi thường trú": "por",
    "Nơi thường trú / Place of residence": "por",
    "Nơi ĐKHK thường trú": "por",
    "Có giá trị đến": "doe",
    "Có giá trị đến / Date of expiry": "doe",
    "Đặc điểm nhận dạng": "pi",
    "Dấu vết riêng và dị hình": "pi",
    "Đặc điểm nhận dạng / Personal identification": "pi",
    "Ngày làm CMND": "dop",
    "Ngày, tháng, năm / Date, month, year": "dop",
    "Giám đốc CA": "poi",
  }),
  cccd: _.invert({
    "Họ và tên": "name",
    "Họ tên": "name",
    "Họ và tên / Full name": "name",
    "id": "id_card",
    "Số / No": "id_card",
    "Ngày, tháng, năm sinh": "dob",
    "Sinh ngày": "dob",
    "Ngày sinh / Date of birth": "dob",
    "Giới tính": "sex",
    "Giới tính / Sex": "sex",
    "Quốc tịch": "nationality",
    "Quốc tịch / Nationality": "nationality",
    "Quê quán": "poo",
    "Quê quán / Place of origin": "poo",
    "Nguyên quán": "poo",
    "Nơi thường trú": "por",
    "Nơi thường trú / Place of residence": "por",
    "Nơi ĐKHK thường trú": "por",
    "Có giá trị đến": "doe",
    "Có giá trị đến / Date of expiry": "doe",
    "Đặc điểm nhận dạng": "pi",
    "Dấu vết riêng và dị hình": "pi",
    "Đặc điểm nhận dạng / Personal identification": "pi",
    "Ngày làm CMND": "dop",
    "Ngày, tháng, năm / Date, month, year": "dop",
    "Giám đốc CA": "poi",
  }),
  ttk: _.invert({
    "SỐ SERI": "seri_number",
    "SỐ CIF": "CIF",
    "CHỦ SỞ HỮU": "name",
    "PHÁP LÝ KHÁCH HÀNG": "id_def",
    "NGÀY CẤP": "datetime_id",
    "NƠI CẤP": "addr_id",
    "SẢN PHẨM": "product_number",
    "NGÀY GỬI TIỀN": "period",
    "NGÀY ĐẾN HẠN": "date_ex",
    "SỐ TK": "TKFD",
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
class ScanFile extends React.Component {
  state = {
    type: '',
    isLoading: false,
    project: {
      fullPath: '',
    },
    smartForms: JSON.parse(localStorage.getItem('smartForms') || '[]'),
    viewConfig: JSON.parse(localStorage.getItem('viewConfig') || '[]'),
    arrayData: [],
    data: null,
    smartForm: "",
    contentVietTay: [],
    content: {}
  };

  render() {
    const { smartForms } = this.state;
    const { onChangeFile, nameFile, isChosseFile, files, onChangeSnackbar, type, handlechangeMeta, extract, setSmartForms, smartFormss, setScanDialog } = this.props
    console.log(type, 'type');
    return (
      <>
        {
          isChosseFile ? <>
            <Grid container className="my-2">
              <Grid item sm={8} >

                <label for="fileUpload" className='btnFile'>Chọn tệp</label>
                &nbsp; {nameFile && nameFile.length > 30 ? `${nameFile.slice(0, 30)} ...` : nameFile || "Up load file"}
                <input
                  type="file"
                  id="fileUpload"
                  name="fileUpload"
                  onChange={event => {
                    onChangeFile && onChangeFile(event)
                  }}
                  style={{
                    // visibility:"hidden"
                    display: "none"
                  }}
                  // value={project.fullPath}
                  accept=".pdf,.jpg, .png"
                />


              </Grid>
              <Grid item sm={4} className="iconsScan">
                <Button onClick={() => setScanDialog({})}>
                  <PrintOutlinedIcon />
                </Button>
              </Grid>

              <Grid item md={12} container className="my-2" spacing={16}>

                <Grid item sm={6}>
                  <Select
                    style={{ height: '38px', width: '100%' }}
                    name="type"
                    title="Lựa chọn trường để import"
                    value={this.state.type}
                    onChange={e => {
                      const val = e.target.value;
                      console.log(e.target.value, 'e.target.value');
                      if (val && val.includes('smart_forms')) {
                        this.setState({
                          type: val,
                          smartForm: val,
                          content: null,
                          arrContent: [],
                          contentVietTay: []
                        });
                        console.log(val, 'vallllllllllllll')
                        setSmartForms(val)
                        return;
                      }


                      this.setState({
                        type: e.target.value ,
                        smartForm: "",
                        content: {},
                        arrContent: [],
                        contentVietTay: []
                      });
                    }}
                    input={<OutlinedInput name="age" id="outlined-age-simple" />}
                  >
                    <MenuItem value="">Chọn form trích xuất</MenuItem>
                    {DOC_TYPES.map(i => (
                      <MenuItem value={i.name}>{i.title}</MenuItem>
                    ))}
                    {smartForms.map(i => (
                      <MenuItem value={`smart_forms_${i.code}`}>{i.title}</MenuItem>
                    ))}
                  </Select>
                </Grid>

                {this.state.isLoading ? (
                  <CircularProgress />
                ) : (
                  <Grid item sm={6}>
                    <Button
                      variant="outlined"
                      // color="primary"
                      onClick={() => {
                        const file = document.getElementById('fileUpload').files[0] || files;
                        console.log(file, 'jjjjjjjjjj');
                        console.log(this.state.smartForm, "this.state.smartForm")
                        const smartForm = this.state.smartForms.find(s => `smart_forms_${s.code}` === this.state.smartForm);
                        if (!file) {
                          this.props.onChangeSnackbar && this.props.onChangeSnackbar({ variant: 'warning', message: 'Vui lòng chọn file trước khi trích xuất!', status: true })
                          return
                        }
                        const type = this.state.type ;

                        if (!type) {
                          this.props.onChangeSnackbar && this.props.onChangeSnackbar({ variant: 'warning', message: 'Đồng chí chưa chọn loại văn bản!', status: true })
                          return
                        }
                        this.setState({
                          isLoading: true,
                          content: [],
                          arrContent: [],
                          contentVietTay: [],
                          data: []
                        });


                        //   smart form biểu mẫu động
                        this.props.handleChangleMetaDataOthers && this.props.handleChangleMetaDataOthers("")
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
                          const { viewConfig } = this.state
                          const scanViewConfig = viewConfig && viewConfig.find(item => item.code === smartForm.moduleCode);
                          const columnsScanFile = scanViewConfig && scanViewConfig.listDisplay.type.fields.type.columns;
                          this.setState({ arrayData: columnsScanFile });
                          const formData = new FormData();
                          formData.append('file', file);
                          formData.append('meta', JSON.stringify({ data: meta }));
                          fetch(API_SMART_FORM_PDF_URL, {
                            method: 'POST',
                            body: formData,
                          })
                            .then(res => res.json())
                            .then(data => {
                              console.log(data, 'dataaaaa')
                              this.props.handleChangleMetaDataOthers && this.props.handleChangleMetaDataOthers(data)
                              // const newData = Object.entries(data)                          
                              const newData = []
                              for (const key in data) {
                                newData.push({ [key]: data[key] })
                              }
                              this.setState({ isLoading: false, arrContent: [], data: newData });

                              this.props.handelChangeIsChosseFile && this.props.handelChangeIsChosseFile(false)

                            })
                            .catch(error => {
                              this.setState({ isLoading: false });
                              console.log('error', error);
                            });
                          return;
                        }
                        //  smart ảnh, chữ số viết tay
                        console.log(type, 'type12222222222');
                        var reader = new FileReader();
                        var that = this;
                        reader.readAsDataURL(file);
                        reader.onload = () => {
                          const body = {
                            data: {
                              images: [reader.result.split(',')[1]],
                              type: type,
                            },
                          };
                          console.log(type, 'type')
                          const url = (type === "hc" || type === "dkkd") ? 'https://g.lifetek.vn:298/detection1' : 'https://g.lifetek.vn:298/detection'
                          request(url, {
                            method: 'POST',
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem('token')}`,
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(body),
                          })
                            .then(res => {

                              const newContent = { image: reader.result, content: res.data || [] };
                              that.setState({
                                content: res.data || [],
                                isLoading: false,
                                arrContent: [newContent],
                                contentVietTay: res.data ? [] : res,
                                data: []
                                // arrContent: Array.isArray(this.state.arrContent) ? [...this.state.arrContent, newContent] : [newContent]
                              });
                              this.props.handelChangeIsChosseFile && this.props.handelChangeIsChosseFile(false)
                              const content = res.data || {};
                              console.log(res.data, "content")
                              // handlechangeMeta && handlechangeMeta(content);


                              // console.log('res', res);
                            })
                            .catch(e => {
                              this.setState({ isLoading: false });
                              console.log('e', e);
                            });
                        };
                        reader.onerror = error => {
                          this.setState({ isLoading: true });
                          console.log('Error: ', error);
                        };
                      }}
                    >
                      Trích xuất
                    </Button>
                  </Grid>
                )}
              </Grid>
              {/* ocr */}
            </Grid>
          </> : <>
            {/* chọn xong trích xuất */}


            <SmartForm
              {...this.props}
              localDataPrev={{
                arrayData: this.state.arrayData || [],
                data: this.state.data || [],
                smartForm: this.state.smartForm || "",
                contentVietTay: this.state.contentVietTay || [],
                arrContent: this.state.arrContent || [],
                content: this.state.content || {},
                type: this.state.type || "",
              }}
            />

          </>
        }
      </>

    );
  }
}

ScanFile.propTypes = {};

export default ScanFile;
