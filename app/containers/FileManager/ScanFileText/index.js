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
 import { Button, OutlinedInput, MenuItem, Select, Grid, CircularProgress } from '@material-ui/core';
 import _ from 'lodash';
 import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
 //  import AsyncSelect from '../AsyncComponent';
 import request from '../../../utils/request';
 import { API_SMART_FORM_PDF_URL } from 'config/urlConfig'; // {
 const dic = {
   cmnd: _.invert({
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
     'Địa điểm làm CMND': 'poi',
     'Giám đốc CA': 'poi',
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
     Email: 'email',
     Website: 'website',
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
     id: 'id_def',
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
 
 /* eslint-disable react/prefer-stateless-function */
 const DOC_TYPES = [
   {
     name: 'cmnd',
     title: 'CMND',
   },
   {
     name: 'dkkd',
     title: 'Đăng ký kinh doanh',
   },
   {
     name: 'sohong',
     title: 'Chứng nhận quyền sử dụng đất',
   },
   {
     name: 'hc',
     title: 'Họ chiếu',
   },
 ];
 class ScanFileText extends React.Component {
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
   };
 
   handleChangeSelect = (selectedOption, key) => {
     const { project } = this.state;
     project[key] = selectedOption;
     this.setState({ project });
     this.props.onChangeNewProject(project);
   };
 
   render() {
     const { project, smartForms, viewConfig, arrayData, data } = this.state;
     return (
       <div >
         <ValidatorForm
           onSubmit={() => {
             this.props.onSubmit('ok');
           }}
         >
           <Grid container>
             <Grid item sm={12} className="my-2">
               <input
                 type="file"
                 id="fileUpload"
                 name="fileUpload"
                 onChange={event => {
                   project.fullPath = event.target.value;
                   this.setState({ project });
                   this.props.onChangeNewProject(project);
                 }}
                 value={project.fullPath}
                 accept=".pdf,.jpeg,.png,.jpg"
               />
             </Grid>
             
             <Grid item sm={6}>
               <Select
                 style={{ height: '38px', width: '100%' }}
                 name="type"
                 title="Lựa chọn trường để import"
                 value={this.state.type}
                 onChange={e => {
                   const val = e.target.value;
                   if (val && val.includes('smart_forms')) {
                     this.setState({
                       type: val,
                       smartForm: val,
                       content: null,
                     });
                     return;
                   }
                   this.setState({
                     type: e.target.value,
                     content: null,
                   });
                 }}
                 input={<OutlinedInput name="age" id="outlined-age-simple" />}
               >
                 <MenuItem value="">Chọn loại văn bản</MenuItem>
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
                   color="primary"
                   onClick={() => {
                     this.setState({ isLoading: true });
                     const file = document.getElementById('fileUpload').files[0];
                     const smartForm = this.state.smartForms.find(s => `smart_forms_${s.code}` === this.state.smartForm);
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
                           this.setState({ isLoading: false, data: data });
                         })
                         .catch(error => {
                           this.setState({ isLoading: false });
                           console.log('error', error);
                         });
                       return;
                     }
                     var reader = new FileReader();
                     const type = this.state.type;
                     var that = this;
                     reader.readAsDataURL(file);
                     reader.onload = () => {
                       const body = {
                         data: {
                           images: [reader.result.split(',')[1]],
                           type: type,
                         },
                       };
                       request('https://g.lifetek.vn:298/detection', {
                         method: 'POST',
                         headers: {
                           Authorization: `Bearer ${localStorage.getItem('token')}`,
                           'Content-Type': 'application/json',
                         },
                         body: JSON.stringify(body),
                       })
                         .then(res => {
                           const newContent = { image: reader.result, content: res.data };
                           that.setState({
                             content: res.data,
                             isLoading: false,
                             arrContent: [newContent],
                             // arrContent: Array.isArray(this.state.arrContent) ? [...this.state.arrContent, newContent] : [newContent]
                           });
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
                   Trích xuất văn bản
                 </Button>
               </Grid>
             )}
             <Grid item sm={12} className="text-center" style={{paddingTop:10}}>
               <Button
                 className="mx-3"
                 type="button"
                 onClick={() => {
                   this.props.onSubmit('cancel');
                 }}
                 variant="outlined"
                 color="secondary"
               >
                 Hủy
               </Button>
               <Button
                 onClick={() => {
                   this.props.onSubmit('ok',this.state.data)
                 }}
                 variant="outlined"
                 color="primary"
                 type="submit"
                 style={{ marginRight: 10 }}
               >
                 Tải lên
               </Button>
             </Grid>
             {/* {this.state.content &&
               Object.keys(this.state.content).map(key => (
                 <>
                   {' '}
                   <Grid item sm={6}>
                     {key}:
                   </Grid>
                   <Grid item sm={6}>
                     {this.state.content[key]}{' '}
                   </Grid>
                 </>
               ))} */}
             {Array.isArray(this.state.arrayData) &&
               this.state.arrayData.map(item => {
                 return (
                   <>
                     <Grid item sm={12}>
                       <Grid container>
                         <Grid item sm={4} alignItems="flex-start" style={{ textAlign: 'left' }}>
                           {item.title + ' : '}
                         </Grid>
                         <Grid item sm={8} alignItems="flex-start" style={{ textAlign: 'left' }}>
                           {data && data[item.name]}
                         </Grid>
                       </Grid>
                     </Grid>
                   </>
                 );
               })}
             {Array.isArray(this.state.arrContent) &&
               this.state.arrContent.map(item => {
                 return (
                   <>
                     <Grid item sm={12} style={{ marginTop: '20px' }}>
                       <img src={item.image} alt="new" style={{ maxHeight: '400px', maxWidth: '400px' }} />
                     </Grid>
                     <Grid item sm={12}>
                       {Object.keys(item.content).map(key => (
                         <Grid container>
                           <Grid item sm={4} alignItems="flex-start" style={{ textAlign: 'left' }}>
                             {(dic[this.state.type] && dic[this.state.type][key]) || key}:
                           </Grid>
                           <Grid item sm={8} alignItems="flex-start" style={{ textAlign: 'left' }}>
                             {this.state.content[key]}
                           </Grid>
                         </Grid>
                       ))}
                     </Grid>
                   </>
                 );
               })}
             
           </Grid>
         </ValidatorForm>
       </div>
     );
   }
 }
 
 ScanFileText.propTypes = {};
 
 export default ScanFileText;
 