/* eslint-disable jsx-a11y/no-static-element-interactions */
/**
 *
 * AddTemplatePage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Editor, EditorTools, EditorUtils } from '@progress/kendo-react-editor';
// import content from './content';
import { Grid, List, ListItem, MenuItem, withStyles, Typography, TextField } from '@material-ui/core';
import { Dialog, Paper } from 'components/LifetekUi';
import { Edit } from '@material-ui/icons';
// import CKEditor from '@ckeditor/ckeditor5-react';
// import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import './style.scss';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { extraFields, clientId } from '../../variable';
import makeSelectAddTemplatePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { handleChangeTitle, getTemplate, handleChange, postTemplate, putTemplate, mergeData, getAllTemplate, getAllModuleCode } from './actions';

import CustomAppBar from 'components/CustomAppBar';
import CustomInputBase from '../../components/Input/CustomInputBase';
import ReactCrop from 'react-image-crop';

import 'react-image-crop/dist/ReactCrop.css';

import { Select } from '@material-ui/core';

const styles = {
  textField: {
    marginBottom: '25px',
    color: 'black',
  },
};

const {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Indent,
  Outdent,
  OrderedList,
  UnorderedList,
  Undo,
  Redo,
  FontSize,
  FontName,
  FormatBlock,
  Link,
  Unlink,
  InsertImage,
  ViewHtml,
  InsertTable,
  AddRowBefore,
  AddRowAfter,
  AddColumnBefore,
  AddColumnAfter,
  DeleteRow,
  DeleteColumn,
  DeleteTable,
  MergeCells,
  SplitCell,
} = EditorTools;

function PrintData({ data, column = 3 }) {
  if (!data.length) return <p>Không có viewConfig cho tham chiếu này</p>;
  const number = Math.ceil(data.length / column);
  const dataColumn = [];

  const count = column - 1;
  for (let index = 0; index <= count; index++) {
    switch (index) {
      case 0:
        dataColumn[index] = data.slice(0, number);
        break;
      case count:
        dataColumn[index] = data.slice(number * count, data.length);
        break;
      default:
        dataColumn[index] = data.slice(number * index, number * (index + 1));
        break;
    }
  }

  return (
    <React.Fragment>
      {dataColumn.map(item => (
        <List>
          {item.map(element => (
            <ListItem>{element}</ListItem>
          ))}
        </List>
      ))}
    </React.Fragment>
  );
}

/* eslint-disable react/prefer-stateless-function */
export class AddTemplatePage extends React.Component {
  state = {
    modules: JSON.parse(localStorage.getItem('viewConfig')),
    copyTemplate: {},
    disableButton: false,
    cropElements: [],
    ImageUrls: [],
    listImg: [],
    reload: new Date() * 1,
    others: '',
    width: 0,
    height: 0,
    crop: {
      unit: '%',
      width: 30,
    },
    src: null,
  };

  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this.moduleCode = React.createRef();
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);


  }
  handleChangeSize=()=>{
    cosole.log(window.innerHeight, 'jsndjvnsv')
  }
  componentDidMount() {
    const id = this.props.match.params.id;
    this.props.getTemplate(id, this.setHtml, this.getData);
    this.props.getAllTemplate();
    this.props.getAllModuleCode();

    let newModules = ['IncommingDocument', 'OutGoingDocument', 'AuthorityDocument', 'Task', 'PersonPlan', 'OrganizationPlan', 'Calendar', 'MeetingCalendar'];
    let allData = [];
    newModules.forEach(element => {
      let data = this.state.modules.find(i => i.code === element);
      allData.push(data);
    });
    this.setState({ modules: allData });
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
 
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  
  updateWindowDimensions() {
    console.log("resite")
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }
  componentWillReceiveProps(props) {
    if (props.addTemplatePage !== undefined) {
      // const convertedData = convertChildToItems(props.data);
      // console.log(convertedData);
      this.setState({
        treeData: props.data,
        selection: props.addTemplatePage.selection ? props.addTemplatePage.selection : 0,
        src: props.addTemplatePage.imageSrc ? props.addTemplatePage.imageSrc : '',
      });
    }
  }
  componentDidUpdate() {
    const { addTemplatePage } = this.props
    if (addTemplatePage !== undefined && addTemplatePage.loading === false && addTemplatePage.error === true && addTemplatePage.success === false && this.state.disableButton === true) {
      this.setState({ disableButton: false })
      //console.log('ssssssssss')
    }
  }

  saveTemplate = () => {
    const { cropElements, fieldKey, src, listImg, coefficient } = this.state;
    const dataElements = [];
    for (var i = 0; i < cropElements.length; i++) {
      if (cropElements[i].value) {
        dataElements.push({
          x: cropElements[i].x,
          y: cropElements[i].y,
          w: cropElements[i].widthCrop,
          h: cropElements[i].heightCrop,
          fieldKey: cropElements[i].value,
          coefficient: coefficient,
        });
      }
    }
    this.setState({ data: dataElements });
    const view = (this.editor && this.editor.view) || {};
    const id = (this.props.match && this.props.match.params && this.props.match.params.id) || 'add';
    const templateData = this.props.addTemplatePage;
    const data = {
      title: templateData.title,
      categoryDynamicForm: templateData.categoryDynamicForm,
      content: templateData.selection === 'null' || templateData.selection === 0 ? EditorUtils.getHtml(view && view.state) : '<p></p>',
      code: templateData.code,
      moduleCode: templateData.moduleCode,
      clientId,
      filterField: this.state.filterField,
      filterFieldValue: this.state.filterFieldValue,
      selection: templateData.selection,
      config: dataElements,
      imageSrc: src,
    };
    try {
      this.setState({ disableButton: true })
      if (id === 'add') this.props.postTemplate(data);
      else this.props.putTemplate(id, data);
    } catch (error) {
      this.setState({ disableButton: false })
    }
  };

  setHtml = () => {
    const view = this.editor.view;
    EditorUtils.setHtml(view, this.props.addTemplatePage.content);
    this.setState({ filterField: this.props.addTemplatePage.filterField, filterFieldValue: this.props.addTemplatePage.filterFieldValue });
  };
  getData = ( data = {} )=>{
    let {config} = data
    let dateNow = new Date()*1
    config = config.map( (el, index )=>{
      return {
        ...el, 
        value: el.fieldKey,
        heightCrop: el.h,
        widthCrop:  el.w,
        id: dateNow+index,
        height: el.h,
        width:  el.w,
      }
    })
    // for (let i = 0; i < config.length; i++) {
    //   newConfig.push(
    //     {
    //       ...config[i], 
    //       value: config[i].fieldKey,
    //       heightCrop: config[i].h,
    //       widthCrop:  config[i].w,
    //       id: this.handleGetId()
    //     }
    //   )
      
    // }
    // this.makeClientCrop()
    config.map(async (el, idx)=>{
      console.log(el, 'el')
      await this.makeClientCrop(el, `newFile${idx}.jpeg`)
    })
    console.log(config, 'newConfig')
    this.setState({cropElements: config || [] , listImg: config || []})
  }
  referenceDialog = (code = 'Customer', name) => {
    this.props.mergeData({ codeRef: code, dialogRef: true, name });
  };

  convertData = (code, ref = true, prefix = false) => {
    const result = [];
    if (code) {
      const data = this.state.modules.find(item => item.code === code);
      let dataExtra = extraFields.find(i => i.code === code);
      if (dataExtra) dataExtra = dataExtra.data;
      else dataExtra = [];
      if (!data) return [];
      const viewArr = data.listDisplay.type.fields.type;
      const { filterField, filterFieldValue } = this.state;
      const newData = [
        ...viewArr.columns.filter(item => {
          if (!item.checked) return false;
          if (
            filterField &&
            filterFieldValue &&
            item.filterConfig &&
            (!item.filterConfig[filterFieldValue.value] || !item.filterConfig[filterFieldValue.value].checkedShowForm)
          ) {
            return false;
          }
          return true;
        }),
        ...viewArr.others.filter(item => {
          if (!item.checked) return false;
          if (
            filterField &&
            filterFieldValue &&
            item.filterConfig &&
            (!item.filterConfig[filterFieldValue.value] || !item.filterConfig[filterFieldValue.value].checkedShowForm)
          ) {
            return false;
          }
          return true;
        }),
        ...dataExtra,
      ];
      newData.forEach((item, index) => {
        const dt = prefix ? `{${prefix}.${item.name}} : ${item.title}` : `{${item.name}} : ${item.title}`;
        if (!ref) result[index] = dt;
        else if (item.type && item.type.includes('ObjectId')) {
          result[index] = (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <p
              onClick={() => this.referenceDialog(item.type.substring(9), item.name)}
              onKeyDown={this.handleKeyDown}
              style={{ color: '#2196f3', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {dt}
            </p>
          );
        } else if (item.type && item.type.includes('Array')) {
          result[index] = (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <p>
              {`{${item.name}} :`}
              <span
                style={{ cursor: 'pointer', color: '#9c27b0', fontWeight: 'bold' }}
                onClick={() => this.referenceArray(item.type)}
                onKeyDown={this.handleKeyDown}
              >{`${item.title}`}</span>
            </p>
          );
        } else if (item.type && item.type.includes('Relation')) {
          result[index] = (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <p
              onClick={() => this.referenceDialog(item.type.split("'")[3], item.name)}
              onKeyDown={this.handleKeyDown}
              style={{ color: '#2196f3', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {dt}
            </p>
          );
        } else if (item.type && item.type === 'extra')
          result[index] = (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <p style={{ color: '#f47536', fontWeight: 'bold' }}>{dt}</p>
          );
        else if (item.type && item.type === 'required')
          result[index] = (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <p style={{ color: '#e3165b', fontWeight: 'bold' }}>{dt}</p>
          );
        else result[index] = dt;
      });
    }
    return result;
  };

  referenceArray(data) {
    const list = data.split('|');
    const items = list[1];
    let listItem = [];
    if (items) {
      listItem = items.split(',').map(i => `{${i}}`);
    }
    this.props.mergeData({ listItem, arrayDialog: true });
  }

  handleChangeTemplate = (e, nameData) => {
    this.props.handleChange(nameData)
    const {
      target: { value, name },
    } = e;
    this.setState(prevState => ({ ...prevState, [name]: value }));
    if (value) {
      const { content } = value;
      const view = this.editor.view;
      EditorUtils.setHtml(view, content);
    }
  };
  onGoBack = () => {
    this.props.history.goBack();
    // window.location.reload();
  };

  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        this.setState({ src: reader.result });
        this.props.mergeData({ imageSrc: reader.result });
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  onImageLoaded = image => {
    let k = parseInt(image.naturalHeight) / parseInt(image.height);
    this.imageRef = image;
    this.setState({ width: image.width, height: image.height, coefficient: k });
  };

  onCropComplete = async (crop) => {
    console.log(crop, "crop")
    await this.makeClientCrop(crop);
    const currentCroppedElements = [...this.state.cropElements];
    console.log(this.state.cropElements, 'this.state.cropElements')
    if (crop.x !== 0 && crop.y !== 0 && crop.height !== 0) {
      currentCroppedElements.push({
        x: crop.x,
        y: crop.y,
        widthCrop: crop.width,
        heightCrop: crop.height,
        id: new Date() * 1,
      });
    }
    this.setState({ cropElements: currentCroppedElements });
    //  document.getElementById("cropImageInReact").click()
   
  };

  onCropChange = (crop, percentCrop) => {
    this.setState({ crop });
  };
  // handleChangeData =()=>{

  // }
  async makeClientCrop(crop, nameCustom) {
    if (this.imageRef && crop.width && crop.height) {
      const UrlElements = [...this.state.ImageUrls];
      console.log(UrlElements, 'croppedImageUrl')

      
      console.log(UrlElements, 'croppedImageUrl')
      // this.setState({ ImageUrls: UrlElements });
      // this.state.ImageUrls= UrlElements
      if(nameCustom){
        const croppedImageUrl = await this.getCroppedImg(this.imageRef, crop, nameCustom || 'newFile.jpeg');
        this.setState(prevState =>{
          const newLink = [...prevState.ImageUrls, {croppedImageUrl}]
          console.log(newLink, 'croppedImageUrl')

          return {
               ImageUrls :newLink
          }
       })
      }else {
        const croppedImageUrl = await this.getCroppedImg(this.imageRef, crop,  'newFile.jpeg');
        UrlElements.push({
          croppedImageUrl,
        });
        this.setState({ ImageUrls: UrlElements });
      }
      
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const pixelRatio = window.devicePixelRatio;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY,
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        blob => {
          if (!blob) {
            console.error('Canvas is empty');
            return;
          }
          blob.name = fileName;
          // window.URL.revokeObjectURL(this.fileUrl);
          // this.fileUrl = window.URL.createObjectURL(blob);
          resolve(window.URL.createObjectURL(blob));
        },
        'image/jpeg',
        1,
      );
    });
  }

  handleChange = (item, value) => {
    console.log(item,  'item, value', value,)
    let list = [...this.state.cropElements];
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === item.id) {
        list[i].value = value;
      }
    }
    console.log(list, "list")
    this.setState({
      listImg: list,
      cropElements: list,
      reload: new Date() * 1,
    });
  };

  render() {
    const { modules, filterField, cropElements, ImageUrls, listImg, reload, width, height, crop, src } = this.state;
    const { classes, addTemplatePage, intl } = this.props;
    // console.log('thisaddTemplatePage',addTemplatePage)
    const { templates } = addTemplatePage;

    const id = this.props.match.params.id;
    // console.log('addTemplatePage',addTemplatePage)

    // const stock = nameAdd.match.path;
    // const addStock =  stock.slice(stock.length -3,nameAdd.length)
    // console.log("bbbbbbbb", this.props)
    let viewConfig = [];
    if (this.state.modules) {
      const data = this.state.modules.find(item => item.code === addTemplatePage.moduleCode);
      if (data) {
        viewConfig = data.listDisplay.type.fields.type.columns;
      }
    }

    let filterFieldConfig = {};
    if (filterField) {
      filterFieldConfig = viewConfig.find(i => i.name === filterField) || {};
    }
    // console.log('viewConfig', viewConfig)

    return (
      <Paper style={{ color: 'black' }}>
        <div>
          <Dialog
            maxWidth="xs"
            dialogAction={false}
            title="Tham chieu array"
            open={addTemplatePage.arrayDialog}
            onClose={() => this.props.mergeData({ arrayDialog: false })}
          >
            <PrintData column={1} data={addTemplatePage.listItem} />
          </Dialog>
          <Dialog
            dialogAction={false}
            title="Bang tham chieu"
            open={addTemplatePage.dialogRef}
            onClose={() => this.props.mergeData({ dialogRef: false })}
          >
            <Grid style={{ display: 'flex', justifyContent: 'space-between' }} item md={12}>
              <PrintData column={2} data={this.convertData(addTemplatePage.codeRef, false, addTemplatePage.name)} />
            </Grid>
          </Dialog>
          <Grid container>
            <Grid item md={12}>
              <CustomAppBar
                title={
                  id === 'add'
                    // ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới biểu mẫu' })}`
                    // : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'cập nhật biểu mẫu' })}`
                    ? "THÊM MỚI BIỂU MẪU" : "CẬP NHẬT BIỂU MẪU"
                }
                disableSave={this.state.disableButton}
                onGoBack={this.onGoBack}
                onSubmit={this.saveTemplate}
              />
              <h4 style={{ fontWeight: 'bold', display: 'inline' }}>
                <Edit /> Danh sách mẫu báo giá, hợp đồng
              </h4>{' '}
              <span style={{ fontWeight: 'normal' }}>(Các trường màu đỏ là cần nhập)</span>
              <h4>Thông tin các từ thay thế</h4>
            </Grid>

            <Grid style={{ display: 'flex', justifyContent: 'space-around' }} item md={12}>
              <PrintData data={this.convertData(addTemplatePage.moduleCode)} />
            </Grid>
            <Grid style={{ padding: 5 }} container>
              <Grid item md={12}>
                <Typography style={{ fontWeight: 'bold' }}>Ghi chú</Typography>
                <Typography>
                  <span style={{ fontStyle: 'italic' }}>Loại thường</span>
                </Typography>
                <Typography>
                  <span style={{ color: '#2196f3', fontWeight: 'bold', fontStyle: 'italic' }}>Loại tham chiếu: </span> Click vào để chọn trường tham
                  chiếu
                </Typography>
                <Typography>
                  <span style={{ color: '#9c27b0', fontWeight: 'bold', fontStyle: 'italic' }}>Loại mảng: </span> Dùng trong bảng
                </Typography>
              </Grid>
            </Grid>

            <Grid item md={12}>
              <CustomInputBase
                select
                name="copyTemplate"
                label="Chọn biểu mẫu động mẫu"
                fullWidth
                value={this.state.copyTemplate}
                onChange={(e) => this.handleChangeTemplate(e, 'copyTemplate')}
              >
                {templates && templates.map(template => <MenuItem value={template}>{template.title}</MenuItem>)}
              </CustomInputBase>
              <CustomInputBase
                value={addTemplatePage.title}
                onChange={this.props.handleChange('title')}
                required
                className={'CustomRequiredLetter'}
                // className={classes.textField}
                label="Tiêu đề"
                fullWidth
              />
              <CustomInputBase
                value={addTemplatePage.code}
                onChange={this.props.handleChange('code')}
                required
                className={'CustomRequiredLetter'}
                // className={classes.textField}
                label="Mã"
                fullWidth
              />

              <CustomInputBase
                required
                className={'CustomRequiredLetter'}
                // className={classes.textField}
                label="Loại mẫu"
                value={addTemplatePage.categoryDynamicForm}
                select
                onChange={e => this.props.handleChangeTitle(e)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              >
                {addTemplatePage.templateTypes.map(option => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.title}
                  </MenuItem>
                ))}
              </CustomInputBase>

              <CustomInputBase
                required
                className={'CustomRequiredLetter'}
                // className={classes.textField}
                label="Tính năng"
                select
                value={addTemplatePage.moduleCode}
                fullWidth
                onChange={this.props.handleChange('moduleCode')}
                InputLabelProps={{ shrink: true }}
              >
                {modules.map(item => (
                  <MenuItem value={item.code}>
                    {addTemplatePage && addTemplatePage.modules && addTemplatePage.modules[item.code]
                      ? addTemplatePage.modules[item.code].title
                      : item.code}
                  </MenuItem>
                ))}
              </CustomInputBase>
              <Grid container spacing={8}>
                <Grid item xs={6}>
                  <CustomInputBase
                    id="select-filter-field"
                    select
                    onChange={e => {
                      this.setState({ filterField: e.target.value });
                    }}
                    value={this.state.filterField}
                    label="Trường dữ liệu phân loại"
                    name="filterField"
                    style={{ width: '100%' }}
                    variant="outlined"
                    margin="normal"
                    SelectProps={{
                      MenuProps: {},
                    }}
                  >
                    {viewConfig.map((item, index) => (
                      <MenuItem value={item.name} key={`${item.name}_${index}`}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </CustomInputBase>
                </Grid>
                <Grid item xs={6}>
                  <CustomInputBase
                    value={addTemplatePage.selection}
                    fullWidth
                    select
                    name="selection"
                    onChange={this.props.handleChange('selection')}
                    label="Lựa chọn"
                    variant='outlined'
                    // required={checkRequired.provincial}
                    InputLabelProps={{ shrink: true }}
                  >
                    <MenuItem value={'null'}>---Chọn---</MenuItem>
                    <MenuItem value={0}>Biểu mẫu</MenuItem>
                    <MenuItem value={1}>Smart Form</MenuItem>
                  </CustomInputBase>
                </Grid>
                {/* <Grid item xs={6}>
                  <CustomInputField
                    value={this.state.filterFieldValue}
                    type={filterFieldConfig.type}
                    label="Dữ liệu"
                    configType="crmSource"
                    configCode={filterFieldConfig.code}
                    configId={filterFieldConfig.id}
                    onChange={e => this.setState({ filterFieldValue: e.target.value })}
                  />
                </Grid> */}
              </Grid>
              {(addTemplatePage && addTemplatePage.selection === 0) || (addTemplatePage && addTemplatePage.selection === 'null') ? <Editor
                tools={[
                  [Bold, Italic, Underline, Strikethrough],
                  [Subscript, Superscript],
                  [AlignLeft, AlignCenter, AlignRight, AlignJustify],
                  [Indent, Outdent],
                  [OrderedList, UnorderedList],
                  FontSize,
                  FontName,
                  FormatBlock,
                  [Undo, Redo],
                  [Link, Unlink, InsertImage, ViewHtml],
                  [InsertTable],
                  [AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter],
                  [DeleteRow, DeleteColumn, DeleteTable],
                  [MergeCells, SplitCell],
                ]}
                contentStyle={{ height: 300 }}
                contentElement={addTemplatePage.content}
                ref={editor => (this.editor = editor)}
              /> :  // <ReactCrops />
                <Grid container>
                  <Grid item sm={12}>
                    <div>
                      <input type="file" accept=".jpg, .png, .jpeg" multiple onChange={this.onSelectFile} />
                    </div>
                  </Grid>
                  <Grid
                    item
                    sm={12}
                    style={{
                      display: 'flex',
                    }}
                  >
                    <Grid item sm={6} style={{ margin: 5 }} id="cropImageInReact">
                      {addTemplatePage.imageSrc && (
                        <ReactCrop
                          src={addTemplatePage.imageSrc}
                          crop={crop}
                          ruleOfThirds
                          onImageLoaded={this.onImageLoaded}
                          onComplete={this.onCropComplete}
                          onChange={this.onCropChange}
                        />
                      )}
                    </Grid>
                    
                    <Grid item sm={6}>
                      <div
                        style={{
                          position: 'relative',
                          width: width,
                          height: height,
                          margin: 5,
                        }}
                      >
                        {
                          console.log(ImageUrls, 'ImageUrls')
                        }
                        {reload && Array.isArray(cropElements) && cropElements.length > 0
                          ? cropElements.map((item, idx) => {
                            return (
                              <Select
                                className="customSelect"
                                key={item.id}
                                // value={(listImg.find(i => i.id === item.id ) && listImg.find(i => i.id === item.id ).value)  || 0}
                                value={item.value}
                                onChange={e => this.handleChange(item, e.target.value)}
                                style={{
                                  top: item.y,
                                  left: item.x,
                                  position: 'absolute',
                                  backgroundImage: `url(${ImageUrls[idx] && ImageUrls[idx].croppedImageUrl})`,
                                  backgroundRepeat: 'no repeat',
                                  backgroundSize: 'cover',
                                  width: item.widthCrop,
                                  height: item.heightCrop,
                                }}
                              >
                                {viewConfig && viewConfig.filter(it => it.title != null).map(item => {
                                  // if (item.type === 'String') {
                                  return <MenuItem value={item.name}>{item.title || item.name || "Không xác định"}</MenuItem>;
                                  // }
                                })}
                              </Select>
                            );
                          })
                          : null}
                      </div>
                    </Grid>
                  </Grid>
                </Grid>}
            </Grid>
          </Grid>
        </div>
      </Paper>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  addTemplatePage: makeSelectAddTemplatePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    handleChangeTitle: e => dispatch(handleChangeTitle(e.target.value)),
    getTemplate: (id, getTem, getData) => dispatch(getTemplate(id, getTem, getData)),
    handleChange: name => e => dispatch(handleChange({ name, value: e.target.value })),
    postTemplate: data => dispatch(postTemplate(data)),
    putTemplate: (id, data) => dispatch(putTemplate(id, data)),
    mergeData: data => dispatch(mergeData(data)),
    getAllTemplate: () => dispatch(getAllTemplate()),

    getAllModuleCode: () => dispatch(getAllModuleCode()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addTemplatePage', reducer });
const withSaga = injectSaga({ key: 'addTemplatePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddTemplatePage);
