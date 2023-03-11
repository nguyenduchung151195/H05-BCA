/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable no-alert */
/* eslint-disable no-return-assign */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/**
 *
 * FileManager
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import axios from 'axios';
import { FileManagerComponent, Inject, NavigationPane, DetailsView, Toolbar, ContextMenu } from '@syncfusion/ej2-react-filemanager';
import swal from '@sweetalert/with-react';
import PropTypes from 'prop-types';
import { UPLOAD_FILE_METADATA } from 'config/urlConfig';
import { Tab, Tabs, Card, Fab as Fa, Button, } from '@material-ui/core';

import GridItem from 'components/Grid/ItemGrid';
import CustomGroupInputField from 'components/Input/CustomGroupInputField';
// import * as numberingSystems from 'cldr-data/main/vi/numberingSystems.json';
import * as gregorian from 'cldr-data/main/vi/ca-gregorian.json';
import * as numbers from 'cldr-data/main/vi/numbers.json';
import * as timeZoneNames from 'cldr-data/main/vi/timeZoneNames.json';
import { setCulture, loadCldr, L10n } from '@syncfusion/ej2-base';
import { makeSelectProfile, makeSelectRole } from '../Dashboard/selectors';

import makeSelectFileManager from './selectors';
import { language } from './messages';
import reducer from './reducer';
import saga from './saga';
import ShareFileContentDialog from '../../components/ShareFileContentDialog';
import CreateProjectContentDialog from '../../components/CreateProjectContentDialog';

import Scanfile from './ScanFile';
import SearchImage from './SearchImage';
import { SampleBase } from '../../components/SampleBase/sample-base';
import { serialize } from '../../utils/common';
import './styles.scss';
// import './custom-boostrap.css';
import { UPLOAD_APP_URL, API_PROFILE, API_WORD_ADDON_UPLOAD ,SEARCH_IMAGE, SEARCH_VIDEO } from '../../config/urlConfig';

import FormFile from './Form'
/* eslint-disable react/prefer-stateless-function */

import { clientId, allowedFileExts } from '../../variable';
import { fetchData } from '../../helper';

import { IntlProvider } from 'react-intl';
import XLSX from 'xlsx';
import * as docx from 'docx-preview';
import SearchVoice from './searchVoice';
import ScanFileText from './ScanFileText';

const allowedExtensions = allowedFileExts.join(',');
const sharedFileModel = {
  path: '',
  permissions: [],
  type: '',
  users: [],
  id: '',
  fullPath: '',
};
L10n.load(language);

const Fab = props => <Fa {...props} />;
Fab.defaultProps = {
  size: 'small',
  color: 'primary',
  style: { margin: '5px', float: 'right' },
};

const WORD_ADDIN = 'Chỉnh sửa dự thảo'
const SCAN_DOC = 'Quét văn bản'
let count = 0

export class FileManager extends SampleBase {
  constructor(props) {
    super(props);
    this.fileManager = React.createRef();
    this.timeout = 0;
    this.editor = React.createRef();

    this.hostUrl = `${UPLOAD_APP_URL}/file-system`;
    this.state = {
      cabin: 'company',
      sharedFileInfor: sharedFileModel,
      reload: 0,
      username: '',
      others: '',
      dialogAllFilter: false,
      localState: '',
      apiUrl: '',
      reload: false,
      filterType: 1,
      searchClient: '',
      otherLength: null,
      loading: false,
      openDialogForm: false,
      formFile: {},
      previewHtml: null,
      openDialog: false,
      reloadVoice: false,
      searchContent: "",
      searchImage: null,
      searchVideo: null,
      numberImage: 10,
      reset: false,
      distance : [],
      typeSearch: '',
      patchFolder : "/"

    };
  }

  convertUrl = path => path.replace(/\s/gi, '@zz_zz@');

  componentWillMount() {
    setCulture('vi');
    loadCldr(null, gregorian, numbers, timeZoneNames);

    if (this.props.match.params.id) {
      this.hostUrl = `${UPLOAD_APP_URL}/file-system/${this.props.match.params.id}`;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState && nextState.reload !== this.state.reload) {
      return true;
    }
    if (
      nextProps &&
      nextProps.role &&
      nextProps.role.roles &&
      nextProps.role.roles.length &&
      (!this.props.role.roles || nextProps.role.roles.length !== this.props.role.roles.length)
    ) {
      return true;
    }

    if (this.state.cabin !== nextState.cabin) {
      return true;
    }
    if (this.state.otherLength !== nextState.otherLength) {
      return true;
    }
    if (this.state.scanDialog !== nextState.scanDialog) {
      return true;
    }
    if (this.state.reset !== nextState.reset) {
      return true;
    }
    // if (this.state.previewHtml !== nextState.previewHtml) {
    //   return true;
    // }
    // if (this.state.searchClient !== nextState.searchClient) {
    //   return true;
    // }
    // if(this.state.filterType){
    //   return true
    // }
    // Rendering the component only if
    // passed props value is changed
    if (this.state.reloadVoice !== nextState.reloadVoice) {
      return true;
    }
    if (this.state.searchContent !== nextState.searchContent) {
      return true;
    }
    return false;
  }
  // componentDidUpdate = (prevProps, prevState) => {
  //   if (prevState && prevState.previewHtml !== this.state.previewHtml) {
  //     console.log(this.state.previewHtml);
  //     if (this.state.previewHtml) {
  //       let div = document.createElement('div');
  //       div.id = 'show';
  //       const show = document.getElementById('show') || {};
  //       const swalContent = document.getElementsByClassName('swal-content');
  //       show.innerHTML = this.state.previewHtml;
  //       if(swalContent && typeof swalContent.append==='function'){
  //         swalContent.append(show);
  //       }
  //     }

  //   }
  // }

  getData = async () => {
    const x = await fetchData(API_PROFILE);
    this.setState({ username: x.username });
  };
  convertString1 = (str)=> {
    if (typeof str !== 'string' || !str) return '';
    // Lấy text từ thẻ input title
    let newString = str || "";
    // Đổi chữ hoa thành chữ thường
    // newString = str.toLowerCase();
    // Đổi ký tự có dấu thành không dấu
    newString = newString.replaceAll(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    newString = newString.replaceAll(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    newString = newString.replaceAll(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    newString = newString.replaceAll(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    newString = newString.replaceAll(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    newString = newString.replaceAll(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    newString = newString.replaceAll(/đ/gi, 'd');
    // Gộp nhiều dấu space thành 1 space
    // newString = newString.replace(/\s+/g, ' ');
    // loại bỏ toàn bộ dấu space (nếu có) ở 2 đầu của xâu
    newString.trim();
    // In newString ra textbox có id “newString”
    return newString;
  }
  componentDidMount() {
    localStorage.removeItem('IncommingDocumentTab');
    localStorage.removeItem('OutGoingDocumentTab');
    localStorage.removeItem('AuthoriyDocument');
    localStorage.removeItem('WorkingCalendarTab');
    localStorage.removeItem('WorkingMeetingTab');
    localStorage.removeItem('taskCallBack');
    localStorage.removeItem('taskAddCallBack');
    localStorage.removeItem('addWorkingScheduleCallback');
    localStorage.removeItem('editWorkingScheduleCallback');
    localStorage.removeItem('taskChildAddCallBack');
    localStorage.removeItem('taskChildEditCallBack');
    this.getData();
  }

  toolbarClick = args => {
    let  folder = args.fileDetails[0];
    // if(folder)
    // this.state.patchFolder =  args.fileDetails[0]
    // else folder = this.state.patchFolder
    // console.log(args.fileDetails[0], 'args.fileDetails[0]')
    // console.log(folder, 'folder')
    if (args.item.id === `${this.fileObj.element.id}_tb_createproject`) {
      swal({
        closeOnClickOutside: false,
        title: 'Thêm mới thư mục dự án',
        content: (
          <CreateProjectContentDialog
            onChangeNewProject={data => {
              this.newProject = data;
            }}
            onSubmit={value => {
              if (value !== 'cancel') {
                if (this.newProject.users.lenght !== 0) {
                  this.newProject.users = this.newProject.users.map(item => item.userId);
                } else {
                  this.newProject.users = [];
                }
                const self = this;
                this.newProject.clientId = clientId;
                axios({
                  method: 'post',
                  url: `${UPLOAD_APP_URL}/projects`,
                  data: this.newProject,
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token_03')}`,
                  },
                })
                  .then(res => {
                    this.newSharedFileInfor = undefined;
                    swal('Tạo mới folder dự án thành công!', '', 'success');
                    this.setState({ reload: this.state.reload + 1 });
                    setTimeout(() => {
                      swal.close();
                    }, 3000);
                  })
                  .catch(err => {
                    this.newSharedFileInfor = undefined;
                    swal('Tạo mới folder dự án thất bại!', err.response.data.message, 'error');
                  });
              } else {
                swal.close();
              }
            }}
          />
        ),
        button: false,
      });
    }
    if (args.item.text === 'Trích xuất văn bản') {
      swal({
        closeOnClickOutside: false,
        title: 'Trích xuất văn bản',
        content: (
          <>
            <div style={{ maxHeight: 500, overflowY: 'auto' }} >
              <ScanFileText
                onChangeNewProject={data => {
                  this.newProject = data;
                }}
                onSubmit={(value, e) => {
                  if (value !== 'cancel') {
                    // const folder = args.fileDetails[0];
                    const data = folder || { name: this.state.cabin, clientId, fullPath: `${clientId}/${this.state.cabin}/`, filterPath: '' };
                    let file = document.getElementById('fileUpload').files[0];
                    if (typeof file === 'undefined') {
                      alert('Không tìm thấy tài liệu');
                      swal('Tải file thất bại!', '', 'error');
                      this.setState({ reload: this.state.reload + 1 });
                    } else {
                      this.setState({ loading: true });
                      swal({
                        title: 'Tải file',
                        text: 'Đang tải file. Vui lòng đợi',
                        showConfirmButton: false,
                        showCancelButton: false,
                        buttons: false,
                      });
                      const form = new FormData();
                      let path = '/';
                      if (folder) {
                        const paths = folder.fullPath.split('/');
                        path = `/${paths
                          .filter((i, idx) => {
                            return idx > 1;
                          })
                          .join('/')}/`;
                      }
                      form.append('uploadFiles', file);
                      form.append('path', path);
                      form.append('action', 'save');
                      form.append('data', JSON.stringify(data));
                      console.log('form', form);
                      // form.append('isScan', true);
                      // this.newProject.clientId = clientId;
                      // this.newProject.data
                      fetch(`${this.hostUrl}/${this.state.cabin}/Upload?clientId=${clientId}`, {
                        method: 'POST',
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem('token_03')}`,
                        },
                        body: form,
                      })
                        .then(response => response.json())
                        .then(res => {
                          let body = {
                            id: res && res.data && res.data[0] && res.data[0]._id,
                            model: 'FileManager',
                            metaData: {
                              others: e,
                            },
                          };
                          fetch(UPLOAD_FILE_METADATA, {
                            method: 'PUT',
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem('token')}`,
                              'Content-type': 'application/json',
                            },
                            body: JSON.stringify(body),
                          })
                            .then(response => response.json())
                            .then(res => {
                              console.log('res', res);
                              // setSnackbar({ open: true, message: 'Thêm file thành công', variant: 'success' });
                            })
                            .catch(() => {
                              // setSnackbar({ open: false, message: 'Thêm file thất bại', variant: 'error' });
                            });
                          this.newSharedFileInfor = undefined;
                          this.setState({ loading: false });
                          swal('Lưu file thành công!', '', 'success');
                          this.setState({ reload: this.state.reload + 1 });
                          setTimeout(() => {
                            swal.close();
                          }, 3000);
                        })
                        .catch(err => {
                          this.newSharedFileInfor = undefined;
                          swal('Lưu file thất bại!', err.response.data.message, 'error');
                        });
                    }
                  } else {
                    swal.close();
                  }
                }}
              />
            </div>

          </>
        ),
        button: false,
      });
    }
    if (args.item.text === 'Tìm kiếm hình ảnh/video') {
      console.log('vao');
      swal({
        closeOnClickOutside: false,
        title: 'Tìm kiếm hình ảnh/video',
        content: (
          <>
            <SearchImage
              onChangeNewProject={data => {
                this.newProject = data;
              }}
              numberImage={this.state.numberImage}
              handleChangeNumberImage={this.handleChangeNumberImage}
              handleChangeType={this.handleChangeType}
              onSubmit={value => {
                if (value !== 'cancel') {
                  // const folder = args.fileDetails[0];
                  const data = folder || { name: this.state.cabin, clientId, fullPath: `${clientId}/${this.state.cabin}/`, filterPath: '' };
                  let file = document.getElementById('fileUpload').files[0];
                  if (typeof file === 'undefined' || this.state.numberImage === null || this.state.typeSearch === '') {
                    alert('Không tìm thấy dữ liệu');
                    swal('Thực hiện tìm kiếm thất bại!', '', 'error');
                    this.setState({ reload: this.state.reload + 1 });
                  } else {
                    this.setState({ loading: true });
                    swal({
                      title: 'Tìm kiếm hình ảnh',
                      text: 'Đang tìm kiếm. Vui lòng đợi',
                      showConfirmButton: false,
                      showCancelButton: false,
                      buttons: false,
                    });

                    if (this.state.typeSearch === 'image') {
                      console.log('vao image');
                      const form = new FormData();

                      form.append('file', file, file.name);
                      form.append('meta', JSON.stringify({ topk: this.state.numberImage }));
                      axios
                        .post(`${SEARCH_IMAGE}`, form, {
                          headers: {
                            // 'Content-Type': 'application/json',
                          },
                        })
                        .then(response => {
                          console.log('response',response);
                          this.newSharedFileInfor = undefined;
                          this.setState({ loading: false, searchImage: response.data && response.data.id,distance : response.data && response.data.distance  ,reset: false });
                          swal('Tìm kiếm thành công!', '', 'success');
                          this.setState({ reload: this.state.reload + 1 });
                          setTimeout(() => {
                            swal.close();
                          }, 3000);
                        })
                        .catch(err => {
                          console.log('err', err);
                          this.newSharedFileInfor = undefined;
                          swal('Tìm kiếm thất bại!', err.response.data.message, 'error');
                        });
                    } else {
                      console.log('vao video');

                      const form = new FormData();
                      form.append('file', file, file.name);
                      axios
                        .post(`${SEARCH_VIDEO}`, form, {
                          headers: {
                            // 'Content-Type': 'application/json',
                          },
                        })
                        .then(response => {
                          this.newSharedFileInfor = undefined;
                          let arrayId = [];
                          if (response.data) {
                            arrayId.push(response.data.id);
                          }
                          this.setState({ loading: false, searchImage: arrayId, reset: false });
                          swal('Tìm kiếm thành công!', '', 'success');
                          this.setState({ reload: this.state.reload + 1 });
                          setTimeout(() => {
                            swal.close();
                          }, 3000);
                        })
                        .catch(err => {
                          console.log('err', err);
                          this.newSharedFileInfor = undefined;
                          swal('Tìm kiếm thất bại!', err.response.data.message, 'error');
                        });
                    }
                  }
                } else {
                  swal.close();
                }
              }}
            />
          </>
        ),
        button: false,
      });
    }
    if (args.item.text === 'Reset') {
      this.setState({ reset: true, reloadVoice: false, searchContent: "" });

      swal('Làm mới thành công!', '', 'success');
    }
    if (args.item.text === 'OCR') {
      swal({
        closeOnClickOutside: false,
        title: 'OCR tài liệu',
        content: (
          <>

            <Scanfile
              onChangeNewProject={data => {
                this.newProject = data;
              }}
              onSubmit={value => {
                if (value !== 'cancel') {
                  // const folder = args.fileDetails[0];
                  const data = folder || { name: this.state.cabin, clientId, fullPath: `${clientId}/${this.state.cabin}/`, filterPath: "" };
                  console.log(data, 'data', this.state.cabin, this.fileObj.pathNames)
                  let file = document.getElementById("fileUpload").files[0];
                  console.log(file,"file", document.getElementById("fileUpload"), "file")
                  if (typeof file === 'undefined') {
                    alert("Không tìm thấy tài liệu")
                    swal('Thực hiện OCR tài liệu thất bại!', '', 'error');
                    this.setState({ reload: this.state.reload + 1 })
                  } else {
                    this.setState({ loading: true })
                    swal({
                      title: 'OCR tài liệu',
                      text: 'Đang OCR tài liệu. Vui lòng đợi',
                      showConfirmButton: false,
                      showCancelButton: false,
                      buttons: false
                    });
                    const form = new FormData();
                    let path = '/';
                    console.log(folder, 'folder')
                    if (folder) {
                      let paths =''
                      if(folder.isFile){
                         paths = folder.parentPath.split('/');
                        path = `/${paths.filter((i, idx) => {
                          return idx > 1;
                        }).join('/')}/`;
                      }else {
                        paths = folder.fullPath.split('/');
                        path = `/${paths.filter((i, idx) => {
                        return idx > 1;
                      }).join('/')}/`;
                      }
                      console.log(path, 'paths')
                    }else{
                      path = `/${this.fileObj.pathNames.filter((i, idx) => {
                        return idx >= 1;
                      }).join('/')}/`;
                    }
                    const nameFile = this.convertString1(file.name)
                    const myNewFile = new File([file], nameFile, {type: file.type});
                    console.log(myNewFile, 'file')
                    form.append('uploadFiles', myNewFile);
                    form.append('path', path);
                    form.append('action', 'save');
                    form.append('data', JSON.stringify(data));
                    form.append('isScan', true);
                    // this.newProject.clientId = clientId;
                    // this.newProject.data 
                    // console.log(this.newProject,form.append('fileUpload', file),file,'newProject')
                    fetch(`${this.hostUrl}/${this.state.cabin}/Upload?clientId=${clientId}`, {
                      method: 'POST',
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem('token_03')}`,
                      },
                      body: form,
                    })
                      .then(res => {
                        this.newSharedFileInfor = undefined;

                        // this.setState({ loading: false })
                        swal('Thực hiện OCR tài liệu thành công!', '', 'success');
                        // this.setState({ reload: this.state.reload + 1 });
                        // history.push
                        console.log(this.props)
                        

                        setTimeout(() => {
                          swal.close();
                          this.props.history.push('/')

                          setTimeout(() => {
                            this.props.history.push('/Documentary/file-manager')
                          }, 1);
                        }, 3000);
                      })
                      .catch(err => {
                        this.newSharedFileInfor = undefined;
                        swal('Thực hiện OCR tài liệu thất bại!', err.response.data.message, 'error');
                      });
                  }
                } else {
                  swal.close();
                }
              }}
            />
          </>
        ),
        button: false,
      });
    }

    if (args.item.text === 'Tải file kèm cấu trúc') {
      swal({
        closeOnClickOutside: false,
        title: 'Thêm mới tài liệu',
        content: (
          <IntlProvider locale="vi"><FormFile onGetData={this.handleGetData} /></IntlProvider>
        ),
        buttons: {
          cancel: {
            text: "Hủy",
            value: 'no',
            visible: true,
            className: "",
            closeModal: true,
          },
          confirm: {
            text: "Lưu",
            value: 'save',
            visible: true,
            className: "",
            closeModal: true
          }
        }
      }).then(confirm => {
        // save form
        if (confirm) {
          const { formFile, cabin } = this.state;
          const { file = [], ...rest } = formFile || {};
          const form = new FormData();
          let path = '/';
          if (folder) {
            const paths = folder.fullPath.split('/');
            path = `/${paths.filter((i, idx) => {
              return idx > 1;
            }).join('/')}/`;
          }
          const data = folder || { name: cabin, clientId, fullPath: `${clientId}/${this.state.cabin}/`, filterPath: "" };
          if (file && file.length > 0) {
            file.map(f => {
              form.set('uploadFiles', f);
              form.set('path', path);
              form.set('action', 'save');
              form.set('data', JSON.stringify(data))

              const apiUrl = `${this.hostUrl}/${cabin}/Upload?clientId=${clientId}`;
              fetch(apiUrl, {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token_03')}`,
                },
                body: form,
              })
                .then(res => {
                  this.newSharedFileInfor = undefined;
                  this.setState({ loading: false })
                  swal('', 'Lưu file thành công!', 'success');
                  this.setState({ reload: this.state.reload + 1 });
                  setTimeout(() => {
                    swal.close();
                  }, 3000);
                })
                .catch(err => {
                  this.newSharedFileInfor = undefined;
                  swal('Lưu file thất bại!', err.response.data.message, 'error');
                });
            })
          }
        }
      })
    }

    if (args.item.text === WORD_ADDIN) {
      this.downloadFile(API_WORD_ADDON_UPLOAD, `${WORD_ADDIN}`)
    }
    if (args.item.text === SCAN_DOC) {
      this.setState({ scanDialog: {} })
    }
    if (args.item.text === 'Mic') {
      // this.setState({ reset: true });
      // swal('Làm mới thành công!', '', 'success');
      swal({
        closeOnClickOutside: false,
        title: 'Tìm kiếm bằng giọng nói',
        content: (
          <>
            <SearchVoice
              onSubmit={value => {
                this.setState({ searchContent: value })
              }}
              onStartVoice={() => this.setState({ reloadVoice: false })}
              setReloadVoice={() => this.setState({ reloadVoice: true })}
              onClose={value => {
                swal.close();
              }}
            />
          </>
        ),
        button: false,
      });
    }
  };

  handleGetData = (obj) => {
    this.setState({ formFile: obj })
  }

  handleChangeType = value => {
    this.setState({
      typeSearch: value,
    });
  };
  handleChangeNumberImage = value => {
    this.setState({ numberImage: value });
  };
  toolbarCreate = args => {
    console.log('args',args);
    for (let i = 0; i < args.items.length; i++) {
      if (args.items[i].id === `${this.fileObj.element.id}_tb_createproject`) {
        args.items[i].text = 'Thêm mới dự án';
        args.items[i].prefixIcon = 'e-sub-total';
      }
      if (args.items[i].id === this.fileObj.element.id + '_tb_scan') {
        args.items[i].prefixIcon = 'e-fe-tick';
      }
      if (args.items[i].id === this.fileObj.element.id + '_tb_uploadfile') {
        args.items[i].prefixIcon = 'e-icons e-table-header';
      }
      if (args.items[i].id === this.fileObj.element.id + '_tb_ocr') {
        args.items[i].prefixIcon = 'e-icons e-view-side';
      }
      if (args.items[i].id === this.fileObj.element.id + '_tb_trích xuất văn bản') {
        args.items[i].prefixIcon = 'e-icons e-fe-details';
      }
      if (args.items[i].id === this.fileObj.element.id + '_tb_tìm kiếm hình ảnh/video') {
        args.items[i].prefixIcon = 'e-icons e-fe-search';
      }
      if (args.items[i].id === this.fileObj.element.id + '_tb_reset') {
        args.items[i].prefixIcon = 'e-icons e-fe-refresh';
      }
      if (args.items[i].id === this.fileObj.element.id + '_tb_mic') {
        args.items[i].prefixIcon = 'e-icons e-fe-search';
      }
    }

   
  };

  // <div id="watermark">
  //   <img src="http://www.topchinatravel.com/pic/city/dalian/attraction/people-square-1.jpg">
  // </div>
  downloadFile(url, fileName) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
      const urlCreator = window.URL || window.webkitURL;
      const imageUrl = urlCreator.createObjectURL(this.response);
      const tag = document.createElement('a');
      tag.href = imageUrl;
      tag.download = fileName;
      document.body.appendChild(tag);
      tag.click();
      document.body.removeChild(tag);
    };
    xhr.send();
  }
  getViewFilePDF = async (args) => {
    const token = localStorage.getItem('token_3');
    let imageUrl;
    const url = `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${args.fileDetails[0]._id}`;
    try {
      fetch(url, {
        method: 'GET',
        headers: new Headers({
          "Authorization": "Bearer " + token
        })
      })
        .then(response => response.blob())
        .then(blob => {
          imageUrl = window.URL.createObjectURL(blob);
          if (imageUrl) {
            console.log(imageUrl, 'imageUrl')
            swal({
              content: (
                <div id="watermark" style={{ width: '100%', height: 'calc(80vh - 100px)' }}>
                  <iframe
                    title="PDF"
                    src={imageUrl}
                    width="100%"
                    style={{ height: '100%' }}
                    value="file"
                  />
                  <p>{this.state.username}</p>
                </div>
              ),
              className: 'swal-document',
              button: true,
            });
          }
        });

    } catch (error) {
      console.log(error)
    }

  }
  displayFileExcel = async (args) => {
    const token = localStorage.getItem('token_3');
    const url = `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${args.fileDetails[0]._id}`;
    try {
      let reader = new FileReader();
      let file;
      let htmlstr;
      file = await (await fetch(url, { method: 'GET', headers: { Authorization: `Bear ${token}` } })).blob();
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        var data = new Uint8Array(reader.result);

        const wb = XLSX.read(data, { type: 'array' });
        htmlstr = XLSX.utils.sheet_to_html(wb.Sheets[wb.SheetNames[0]], { editable: true }).replace('<table', '<table id="table-preview-excel" border="1"');
        if (htmlstr) {
          htmlstr = htmlstr.replace(
            '</head>',
            `<style>
            #table-preview-excel{
              border: 1px solid gray;
              font-family: 'roboto',
            }
            #table-preview-excel td,tr{
              border: 1px solid gray;
              font-family: 'roboto',
            }
          
          </style></head>`,
          );

          let div = document.createElement('div');
          div.innerHTML = htmlstr;
          swal({
            content: (
              div
            ),
            className: 'swal-document',
            button: true,
          });

          // htmlstr = htmlstr.replace('</body></html>', '');

        }

      };


    } catch (error) {

    }

  }
  loadDocX = (file, container) => {
    const docxOptions = Object.assign(docx.defaultOptions, {
      debug: true,
      experimental: true,
    });
    if (!file) return;
    docx
      .renderAsync(file, container, null, docxOptions)
      .then(function (x) { });
  }

  previewDoc = async (url, container) => {
    const token = localStorage.getItem('token_3');
    try {
      const blob = await (await fetch(url, { method: 'GET', headers: { Authorization: `Bear ${token}` } })).blob();
      let file = blob && new File([blob], 'new_file')
      if (file && container) {
        this.loadDocX(file, container);
      }
    } catch (error) {

    }
  }
  menuClick = args => {
    if (args.item.id === 'filemanager_cm_open') {
      args.fileDetails.forEach(element => {
        if (['.docx', '.doc'].includes(element.type)) {
          const url = `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${args.fileDetails[0]._id}`;
          const div = document.createElement('div');
          div.id = 'container';
          div.classList.add("file-manager-doc");
          this.previewDoc(url, div);
          swal({
            content: (
              div
            ),
            className: 'swal-document',
            button: true,
          });
          // window.open(`/Document?path=${element.filterPath + this.fileObj.pathNames[0]}/${element.name}&cabin=${this.state.cabin}`);
        }
        else if (element.type === ".pdf") {
          this.getViewFilePDF(args)

        }
        else if (['.xlsx', '.xls'].includes(element.type)) {
          this.displayFileExcel(args);
        }
        else if (element.isFile && element.type !== '.jpg' && element.type !== '.png' && element.type !== '.jpeg') {
          swal('Không có bản xem trước', 'Vui lòng tải về để mở file!', 'warning');
        }
      });
    }

    if (args.item.id === 'filemanager_cm_download') {
      const url = `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${args.fileDetails[0]._id}`;
      this.downloadFile(url, args.fileDetails[0].name);
      return;
    }

    if (args.item.text === 'Paste') {
      this.fileObj.refreshLayout();
    }
    if (args.item.id === 'filemanager_cm_share') {
      const fullPath = args.fileDetails[0].fullPath;

      axios({
        method: 'get',
        url: `${UPLOAD_APP_URL}/share/${args.fileDetails[0]._id}`,
        headers: { Authorization: `Bearer ${localStorage.getItem('token_03')}` },
      })
        .then(res => {
          let sharedFileInfor;
          if (res.data) {
            sharedFileInfor = res.data;
            return sharedFileInfor;
          }

          return axios({
            method: 'post',
            url: `${UPLOAD_APP_URL}/share`,
            data: {
              public: 1,
              users: [],
              permissions: ['copy', 'download', 'edit', 'editContents', 'read', 'upload'],
              path: fullPath,
              fullPath,
            },
            headers: { Authorization: `Bearer ${localStorage.getItem('token_03')}` },
          }).then(res => {
            this.setState({
              sharedFileInfor: res.data,
            });
            return res.data;
          });
        })
        .then(fileInfor => {
          this.newSharedFileInfor = fileInfor;
          swal({
            closeOnClickOutside: false,
            content: (
              <ShareFileContentDialog
                updateSharedFileInfor={data => {
                  this.newSharedFileInfor = data;
                }}
                path={fullPath}
                sharedFileInfor={this.newSharedFileInfor}
              />
            ),
            buttons: {
              cancel: 'Hủy',
              ok: { value: true, text: 'Đồng ý' },
            },
            className: 'custom-swal',
          })
            .then(isOk => {
              if (isOk) {
                this.newSharedFileInfor.users = this.newSharedFileInfor.users.map(item => item.username);
                this.newSharedFileInfor.fullPath = fullPath;
                return axios({
                  method: 'put',
                  url: `${UPLOAD_APP_URL}/share/${this.newSharedFileInfor._id}`,
                  data: this.newSharedFileInfor,
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token_03')}`,
                  },
                });
              }
            })
            .then(res => {
              if (res) {
                this.newSharedFileInfor = undefined;
                swal({
                  title: 'Chia sẻ file thành công',
                  icon: 'success',
                });
              }
            })
            .catch(err => {
              this.newSharedFileInfor = undefined;
              swal('Đã xảy ra lỗi khi chia sẻ', JSON.stringify(err.response.data.message), 'error');
            });
        });
    }
  };
  handleClose = () => {
    this.setState({
      openDialog: false
    })
  }
  dialogSave = e => {
    const listViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = listViewConfig.filter(item => item.listDisplay.type.fields.type && item.listDisplay.type.fields.type.fileColumns) || [];
    let others = [];
    currentViewConfig.forEach(item => {
      const other = item.listDisplay.type.fields.type.fileColumns;
      others = others.concat(other);
    });
    const filteredOthers = others.filter(item => item.checkedShowForm).map(i => ({ ...i, name: i.name ? i.name.split('.')[1] : '' }));
    const filter = {};
    filter.$and = filteredOthers
      .map(
        i =>
          !this.state.localState[i.name]
            ? null
            : i.type === 'text'
              ? { [`metaData.others.${i.name}`]: { $regex: this.state.localState[i.name] || '', $options: 'gi' } }
              : { [`metaData.others.${i.name}.value`]: this.state.localState[i.name].value },
      )
      .filter(i => !!i);

    let newFilter = { filter: { ...filter }, clientId: clientId };
    const body = serialize(newFilter);
    const apiUrl = `${UPLOAD_FILE_METADATA}?${body}`;
    this.setState({ apiUrl: apiUrl }, () => {
      this.setState({ reload: this.state.reload + 1 });
    });
  };

  menuOpen = args => {
    this.handleOpenMenuRole();

    if (this.fileObj.getSelectedFiles().length > 1) {
      this.fileObj.disableMenuItems(['Share', 'Download', 'Open']);
    }

    let condition = false;
    const ele = args.fileDetails[0];
    if (ele) {
      condition = (ele.public === 2 && ele.users.includes(this.state.username)) || ele.public === 4 || ele.username === this.state.username;
    }

    if (this.state.cabin === 'share' && !condition) {
      this.fileObj.disableMenuItems(['Share', 'Delete', 'Rename']);
    }

    if (args.fileDetails[0].filterPath === '/' && this.state.cabin === 'projects') {
      args.cancel = true;
    }
    if (args.fileDetails[0].permission && !args.fileDetails[0].permission.editContents) {
      this.fileObj.disableMenuItems(['Copy', 'Delete', 'Rename']);
    }
    for (const i in args.items) {
      if (args.items[i].id === `${this.fileObj.element.id}_cm_open`) {
        args.items[i].text = 'Xem trước';
      }
      if (args.items[i].id === `${this.fileObj.element.id}_cm_download`) {
        args.items[i].text = 'Tải xuống';
      }
      if (args.items[i].id === `${this.fileObj.element.id}_cm_share`) {
        args.items[i].text = 'Chia sẻ';
        args.items[i].iconCss = 'e-icons e-create-link';
      }
      if (args.items[i].id === `${this.fileObj.element.id}_cm_rename`) {
        args.items[i].text = 'Đổi tên';
      }
      if (args.items[i].id === `${this.fileObj.element.id}_cm_copy`) {
        args.items[i].text = 'Bản sao';
      }
      if (args.items[i].id === `${this.fileObj.element.id}_cm_delete`) {
        args.items[i].text = 'Xóa';
      }
    }
  };

  // changeSearch = (e) => {
  //   let dataSearch = e.target.value
  //   if (this.timeout) clearTimeout(this.timeout);
  //   this.timeout = setTimeout(() => {
  //     this.setState({ searchClient: dataSearch });

  //     const body = {
  //       action: "search",
  //       path: "/",
  //       showHiddenItems: false,
  //       caseSensitive: false,
  //       data: [
  //         {
  //           filterPath: "",
  //           _id: "5faa6ade3853661eac0707cc",
  //           updatedAt: "2020-11-10T10:26:38.719Z",
  //           createdAt: "2020-11-10T10:26:38.719Z",
  //           name: "company",
  //           fullPath: "20_CRM/company/",
  //           isFile: false,
  //           clientId: "20_CRM",
  //           __v: 0,
  //           status: 1,
  //           isApprove: false,
  //           public: 0,
  //           permissions: [],
  //           users: [],
  //           _fm_id: "fe_tree"
  //         }
  //       ],
  //       searchContent: dataSearch,
  //     };
  //     const urlApi = `https://g.lifetek.vn:203/api/file-system/company?clientId=20_CRM`
  //     fetch(urlApi, {
  //       method: 'POST',
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('token_03')}`,
  //         'Content-type': 'application/json',
  //       },
  //       body: JSON.stringify(body),
  //     })
  //       .then(() => {
  //         this.setState({ reload: this.state.reload + 1 });
  //       })
  //       .catch(() => {
  //         console.log(444)
  //       });
  //   }, 500);
  // }

  handleChange = (event, value) => {
    this.setState({ cabin: value, apiUrl: '', localState: { others: {} } });
  };

  handleOpenMenuRole() {
    const { roles } = this.props.role;

    const r = roles.find(e => e.codeModleFunction === 'file-manager');
    if (!r) this.fileObj.disableMenuItems(['Rename', 'Delete']);
    else {
      if (!r.methods.find(e => e.name === 'POST').allow) this.fileObj.disableMenuItems(['Rename']);
      if (!r.methods.find(e => e.name === 'DELETE').allow) this.fileObj.disableMenuItems(['Delete']);
    }
  }
  // icon =()=>{
  //   return(
  //     <CleaningServicesIcon />
  //   )
  // }
  customFileSize = size => {
    if (size < 1024) {
      return `${size} B`;
    } else if (1024 <= size && size < 1048576) {
      const amount = size / 1024;
      return `${amount.toFixed(2)} KB`;
    } else if (1048576 <= size && size < 1073741824) {
      const amount = size / 1048576;
      return `${amount.toFixed(2)} MB`;
    } else if (1073741824 <= size && size < 1099511627776) {
      const amount = size / 1073741824;
      return `${amount.toFixed(2)} GB`;
    }
  };
  handleOpenDialog = () => {
    this.setState({ dialogAllFilter: true });
  };
  handleChangeFilter = newOther => {
    this.setState({ ...this.state, localState: newOther });
  };
  changeFilter = e => {
    this.setState({ filterType: e.target.value });
  };
  handleReload = () => {
    this.setState({ apiUrl: '', localState: { others: {} } }, () => {
      this.setState({ reload: this.state.reload + 1 });
    });
  };

  render() {
    // console.log('state', this.state);
    // console.log('props', this.props);
    const { cabin } = this.state;
    const { roles = [] } = this.props.role || {};

    const listViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = listViewConfig && listViewConfig.filter(item => item.listDisplay.type.fields.type && item.listDisplay.type.fields.type.fileColumns) || [];
    let others = [];
    currentViewConfig.forEach(item => {
      const other = item.listDisplay.type.fields.type.fileColumns;
      others = others.concat(other);
    });
    const length = others.length;
    this.setState({ otherLength: length });
    // const { listDisplay = {} } = currentViewConfig;
    // const { type = {} } = listDisplay;
    // const { fields = {} } = type;
    // const { type: childType = {} } = fields;
    // const others = childType[source || 'others'] || [];
    // const filteredOthers = others.filter(item => item.checkedShowForm);

    const r = roles && roles.find(e => e.codeModleFunction === 'file-manager');
    const canDelete = r && r.methods.find(e => e.name === 'DELETE') && r.methods.find(e => e.name === 'DELETE').allow;

    const tabStyle = {
      padding: '6px',
    }

    const tabStyleP = (curTab) => {
      const result = {
        fontWeight: 600,
        fontFamily: `Roboto, Helvetica, Arial, sans-serif`,
        fontSize: '12px',
        margin: 0,
      }
      if (cabin === curTab) result.color = 'black'
      return result
    }


    return (

      <div>
        {!this.props.match.params.id ? (
          <Tabs value={cabin} onChange={this.handleChange} indicatorColor="primary" textColor="primary" >

            <Tab value="company" label={<div style={tabStyle}><p style={tabStyleP('company')}>Kho dữ liệu Cục</p></div>} />
            <Tab value="users" label={<div style={tabStyle}><p style={tabStyleP('users')}>Kho dữ liệu của tôi</p></div>} />
            <Tab value="share" label={<div style={tabStyle}><p style={tabStyleP('share')}>Được chia sẻ với tôi</p></div>} />
          </Tabs>
        ) : (
          ''
        )}

        {this.state.cabin === 'company' ? (
          <GridItem container style={{ marginTop: 5, marginLeft: -55 }}>
            {others.length ? (
              <>
                <GridItem xs={9} style={{ marginLeft: 10 }}>
                  <CustomGroupInputField
                    allModule
                    columnPerRow={6}
                    source="fileoClumns"
                    onChange={this.handleChangeFilter}
                    value={this.state.localState.others}
                    othersLength={this.state.otherLength}
                    onChangeSearch={this.dialogSave}
                    handleReload={this.handleReload}
                  />
                </GridItem>
                {this.state.otherLength >= 6 ? (
                  <GridItem x2={3}>
                    <div style={{ display: 'flex', width: 130 }}>
                      <div style={{ marginLeft: -35, marginTop: 15, height: 50 }}>
                        <Button variant="outlined" color="primary" onClick={this.dialogSave} style={{ height: 37 }}>
                          Tìm kiếm
                        </Button>
                      </div>
                      <div style={{ marginLeft: 5, marginTop: 15, height: 50 }}>
                        <Button variant="outlined" color="secondary" onClick={this.handleReload} style={{ height: 37, width: 100 }}>
                          Xóa tìm kiếm
                        </Button>
                      </div>
                    </div>
                  </GridItem>
                ) : null}
              </>
            ) : null}
          </GridItem>
        ) : null}

        <Card>
          {(this.state.cabin === 'shares') ? (
            ''
          ) : (
            <FileManagerComponent
              locale="vn"
              navigationPaneSettings={{ visible: true, maxWidth: '200px', minWidth: "100px" }}
              height={700}

              ref={s => (this.fileObj = s)}
              id="filemanager"
              toolbarClick={this.toolbarClick}
              toolbarCreate={this.toolbarCreate}
              toolbarSettings={{
                items:
                  // cabin === 'shares' ? [] : canDelete ? ['NewFolder', 'UploadFile', 'View', ` OCR`, ` Trích xuất văn bản`, WORD_ADDIN, 'Delete'] : ['NewFolder', 'UploadFile', 'View', ` OCR`, ` Trích xuất văn bản`, `${WORD_ADDIN}`],
                  cabin === 'shares' ? [] : canDelete ? ['NewFolder', 'UploadFile', 'View', 'Delete', 'Mic',` OCR`, ` Trích xuất văn bản`, 'Tìm kiếm hình ảnh/video', 'Reset'] : ['NewFolder', 'UploadFile', 'View', 'Mic'],

                visible: true,
              }}
              view="Details"
              allowMultiSelection
              // view table
              detailsViewSettings={{
                columns: [
                  {
                    field: 'name',
                    headerText: 'Tên',
                    minWidth: 100,
                    width: '150',
                    customAttributes: { class: 'e-fe-grid-name' },
                    template: '<div><div>${name}</div><div><i>${scanStatus}</i></div><div><i>${searchInfo}</i></div></div>',
                  },
                  {
                    field: 'approverName',
                    headerText: 'Người phê duyệt',
                    minWidth: 50,
                    width: '180',
                  },
                  {
                    field: 'approvedDate',
                    headerText: 'Ngày phê duyệt',
                    minWidth: 50,
                    width: '180',
                  },
                  {
                    field: 'isApprove',
                    headerText: 'Phê duyệt',
                    minWidth: 50,
                    width: '150',
                    template: '${isApprove == "true" && "Đã phê duyệt"}',
                  },
                  { field: 'size', headerText: 'Dung lượng', minWidth: 100, width: '120', template: '${size}' },
                  { field: 'createdAt', headerText: 'Ngày tạo', minWidth: 100, width: '150', type: 'date', format: 'dd/MM/yyyy HH:mm' },
                  { field: 'updatedAt', headerText: 'Ngày cập nhật', minWidth: 100, width: '150', type: 'date', format: 'dd/MM/yyyy HH:mm' },
                ],
              }}
              success={args => {
                // document.getElementById('filemanager_search').placeholder = 'Tìm kiếm nội dung trong file'
                // if (!count) {
                //   if (args.name === 'success') {
                //     var link = document.getElementsByClassName("e-input-group");
                //     console.log(args, 'argsargsargs');
                //     console.log(link, 'linklinklink');
                //     let span = document.createElement("img");
                //     span.setAttribute('src', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQM0/8EjFBUQ')
                //     link[0].appendChild(span);
                //     count = +1
                //   }
                // }
                let ele = null;
                ele = args.result.cwd;
                if (this.state.cabin === 'share') {
                  let condition = false;
                  if (ele) {
                    condition =
                      (ele.public === 2 && ele.users.includes(this.state.username)) || ele.public === 4 || ele.username === this.state.username;
                  }
                  if (condition) this.fileObj.enableToolbarItems(['NewFolder', 'Upload']);
                  else this.fileObj.disableToolbarItems(['NewFolder', 'Upload']);
                }

                if (args.action === 'Upload' && args.name === 'success') {
                  const result = JSON.parse(args.result.e.currentTarget.response)
                  if (result.data[0] === null) {
                    this.setState({ reload: this.state.reload + 1 });
                    alert('File đã tồn tại!')

                  } else {
                    setTimeout(() => {
                      document.getElementsByClassName('e-dlg-closeicon-btn')[0].click();
                      this.setState({ reload: this.state.reload + 1 });
                    }, 3000);
                  }
                }
                args.result.files.forEach(item => {
                  const size = this.customFileSize(item.size);
                  item.size = size;
                });
              }}
              failure={args => { }}
              // right mount click
              contextMenuSettings={{
                // file: ['Open', '|', 'Download', 'Share', '|', 'Rename', 'Copy', 'Delete'],
                // folder: ['Open', '|', 'Download', 'Share', '|', 'Rename', 'Copy', 'Delete'],
                // layout: ['Paste'],
                file: ['Open', '|', 'Share', 'Download', '|', 'Rename', 'Delete'],
                folder: ['Open', '|', 'Share', '|', 'Rename', 'Delete'],
                layout: [],
              }}
              menuClick={this.menuClick}
              menuOpen={this.menuOpen}
              fileOpen={args => {
                if (
                  args.fileDetails.isFile &&
                  ['.xlsx', '.csv', '.docx', '.doc', '.png', '.jpg', '.jpeg', '.pdf'].findIndex(d => d === args.fileDetails.type) === -1
                ) {
                  swal('Không có bản xem trước', 'Vui lòng tải về để mở file!', 'warning');
                }
              }}
              uploadSettings={{
                maxFileSize: 4000000000,
                
                allowedExtensions,
              }}
              beforeImageLoad={args => {
                args.imageUrl = `${args.imageUrl}&id=${args.fileDetails[0]._id}`;
              }}
              beforeDownload={args => {
                args.cancel = true
              }}
              ajaxSettings={{
                url: `${this.hostUrl}/${this.props.match.params.id ? '' : cabin}`,
                getImageUrl: `${this.hostUrl}/GetImage/${clientId}`,
                uploadUrl: `${this.hostUrl}/${cabin}/Upload?clientId=${clientId}`,
                downloadUrl: `${this.hostUrl}/download/file/Download`,
              }}
              beforeSend={args => {
                if (args.action === 'search') {
                  const dataSearch = JSON.parse(args.ajaxSettings.data);
                  const stringData = dataSearch.searchString.split('*').join('');
                  const filter = {};
                  filter.$or = [{ name: { $regex: stringData, $options: 'gi' } }];
                  delete dataSearch.searchString;
                  // dataSearch.filter = filter;
                  dataSearch.searchContent = stringData;
                  const filterData = JSON.stringify(dataSearch);
                  args.ajaxSettings.url = `${args.ajaxSettings.url}`;
                  args.ajaxSettings.data = filterData;
                  args.ajaxSettings.beforeSend = args => {
                    args.httpRequest.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token_03')}`);
                  };
                }
                else if (args.action === 'search' && this.state.filterType === 1) {
                  const dataSearch = JSON.parse(args.ajaxSettings.data);
                  const string = dataSearch.searchString.split('*').join('');
                  delete dataSearch.searchString;
                  dataSearch.searchContent = string;
                  const filterData = JSON.stringify(dataSearch);
                  args.ajaxSettings.url = `${args.ajaxSettings.url}`;
                  args.ajaxSettings.data = filterData;
                  args.ajaxSettings.beforeSend = args => {
                    args.httpRequest.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token_03')}`);
                  };
                }
                // search voice
                if (args.action === 'read' && this.state.reloadVoice && this.state.searchContent) {
                  // this.setState({ reloadVoice: false, searchContent: "" })
                  let dataSearch = JSON.parse(args.ajaxSettings.data);
                  let stringData = this.state.searchContent
                  const filter = {};
                  filter.$or = [{ name: { $regex: stringData, $options: 'gi' } }];
                  delete dataSearch.searchString;
                  dataSearch.searchContent = stringData
                  const filterData = JSON.stringify(dataSearch);
                  args.ajaxSettings.url = `${args.ajaxSettings.url}`;
                  args.ajaxSettings.data = filterData;
                  args.ajaxSettings.beforeSend = args => {
                    args.httpRequest.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token_03')}`);
                  };
                  // this.state.reloadVoice = false
                  // this.state.searchContent = ""
                } else {
                  this.state.reloadVoice = false
                  this.state.searchContent = ""
                }
                //search image
                if (args.action === 'read' && this.state.searchImage !== null && !this.state.reloadVoice) {
                  const dataSearch = JSON.parse(args.ajaxSettings.data);
                  let arrayImage = []
                  
                  if( Array.isArray(this.state.searchImage)){
                    arrayImage = this.state.searchImage.filter(item => {
                      return item.length === 24;
                    });

                  }
                  if(Array.isArray(this.state.distance)){
                    this.state.distance.forEach((item,index)=>{
                      if(item < 50){
                        arrayImage.splice(index,1)
                      }
                    })
                  }
                  console.log('arrayImage',arrayImage);

                  // filter.$or = [{ name: { $regex: stringData, $options: 'gi' } }];
                  delete dataSearch.searchString;
                  delete dataSearch.searchContent;
                  // dataSearch.filter = filter;
                  // dataSearch.searchContent = stringData;
                  dataSearch.filter = { _id: { $in: arrayImage } };
                  const filterData = JSON.stringify(dataSearch);

                  args.ajaxSettings.url = `${args.ajaxSettings.url}`;
                  args.ajaxSettings.data = filterData;
                  args.ajaxSettings.beforeSend = args => {
                    args.httpRequest.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token_03')}`);
                  };
                }
                //reset
                if (args.action === 'read' && this.state.reset === true && !this.state.reloadVoice) {
                  const dataSearch = JSON.parse(args.ajaxSettings.data);

                  // filter.$or = [{ name: { $regex: stringData, $options: 'gi' } }];
                  delete dataSearch.searchString;
                  delete dataSearch.searchContent;
                  delete dataSearch.filter;
                  // dataSearch.filter = filter;
                  // dataSearch.searchContent = stringData;
                  const filterData = JSON.stringify(dataSearch);

                  args.ajaxSettings.url = `${args.ajaxSettings.url}`;
                  args.ajaxSettings.data = filterData;
                  args.ajaxSettings.beforeSend = args => {
                    args.httpRequest.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token_03')}`);
                  };
                }
                args.ajaxSettings.url = this.state.apiUrl ? this.state.apiUrl : `${args.ajaxSettings.url}?clientId=${clientId}`;
                args.ajaxSettings.beforeSend = args => {
                  args.httpRequest.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token_03')}`);
                };
              }}
            >
              <Inject services={[NavigationPane, DetailsView, Toolbar, ContextMenu]} />
            </FileManagerComponent>
          )}
        </Card>
        {this.state.openDialogForm ? (
          <>
            form here
          </>
        ) : null}
        {/* <ScanDialog
          onSave={(file) => newWay ? uploadManyFileNew(file, name) : uploadManyFile(file, name)}
          scanDialog={this.state.scanDialog}
          setScanDialog={e => this.setState({ scanDialog: e })}
        /> */}
      </div>
    );
  }
}

FileManager.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  filemanager: makeSelectFileManager(),
  profile: makeSelectProfile(),
  role: makeSelectRole(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'fileManager', reducer });
const withSaga = injectSaga({ key: 'fileManager', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(FileManager);
