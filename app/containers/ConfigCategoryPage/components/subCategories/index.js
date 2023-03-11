import { Fab, Grid, withStyles, Button, DialogTitle, DialogContent, DialogActions, Dialog, TextField } from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import React, { memo, useEffect, useState } from 'react';
import SortableTree from 'react-sortable-tree';
import CustomTheme from 'components/ThemeSortBar/index';
import styles from './styles';
import { compose } from 'redux';
import { Add } from '@material-ui/icons';
import CustomInputBase from '../../../../components/Input/CustomInputBase';
// import { Dialog } from '../../../../components/LifetekUi';
import DialogAcceptRemove from 'components/DialogAcceptRemove';
import ConfirmDialog from 'components/CustomDialog/ConfirmDialog';
import CustomInputField from '../../../../components/Input/CustomInputField';
import { Autocomplete } from '../../../../components/LifetekUi';
import { differenceBy } from 'lodash';
import NumberFormat from 'react-number-format';

function SubDocumentCategory(props) {
  const { data, onSave, classes, documentCategoryId, onChangeSnackbar, updateDocumentCategorySuccess } = props;
  const [treeData, setTreeData] = useState([]);
  const [localData, setLocalData] = useState({
    name: '',
    value: '',
    code: '',
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogRemove, setOpenDialogRemove] = useState(false);
  const [errors, setErrors] = useState({});
  const [column, setColumn] = useState({
    title: 'Tiêu đề',
    code: 'Mã'
  });
  const [titleCoefficient, setTitelCoefficient] = useState([]);

  useEffect(() => {
    let hrmSource = JSON.parse(localStorage.getItem('hrmSource'));
    if (props.item.code === 'HWS03' || props.item.code === 'HWS04') {
      hrmSource = hrmSource.find(i => i.code === 'S04')
    }
    if (props.item.code === 'HWS02') {
      hrmSource = hrmSource.find(i => i.code === 'S16')
    }
    const { data } = hrmSource;
    const newData = Array.isArray(data) && data.length && data.map(item => ({ value: item.value, name: item.title }))
    setTitelCoefficient(newData);
  }, [props.item])

  useEffect(() => {
    const newData = data && data.map(item => ({ ...item, title: item.name }))
    setTreeData(newData);
  }, [data])

  useEffect(
    () => {
      if (updateDocumentCategorySuccess === true) {
        // setReload(true);
        handleCloseDialog();
      }
      if (!updateDocumentCategorySuccess) {
        // setReload(false);
      }
    },
    [updateDocumentCategorySuccess],
  );

  useEffect(() => {
    if (Array.isArray(titleCoefficient) && titleCoefficient.length && (props.item.code === 'HWS03' || props.item.code === 'HWS02' || props.item.code === 'HWS04')) {
      let newData = [];
      treeData && treeData.map(item => newData = newData.concat(item.hrmTitle));
      const newTitleCoefficient = differenceBy(titleCoefficient, newData, 'value');
      setTitelCoefficient(newTitleCoefficient)
    }
  }, [treeData]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setLocalData({
      name: '',
      value: '',
      code: ''
    });
    setErrors({});
  }

  const handleAddEdit = () => {
    let newData = [];
    if (Object.keys(errors).length === 0) {
      if (localData && localData._id) {
        // update
        treeData.map(item => {
          if (item._id === localData._id) {
            if (props.item.code === 'HWS03' || props.item.code === 'HWS02' || props.item.code === 'HWS04')
              newData.push({ ...item, name: localData.name, value: localData.value, code: localData.code, hrmTitle: localData.hrmTitle });
            else
              newData.push({ ...item, name: localData.name, value: localData.value, code: localData.code });
          } else {
            newData.push(item)
          }
        })
        if (Object.keys(errors).length === 0) {
          onSave(documentCategoryId, newData, 'update');
        }
      } else {
        if (props.item.code === 'HWS03' || props.item.code === 'HWS02' || props.item.code === 'HWS04')
          newData = treeData.concat({ name: localData.name, value: localData.value, code: localData.code, hrmTitle: localData.hrmTitle });
        else
          newData = treeData.concat({ name: localData.name, value: localData.value, code: localData.code });
        if (Object.keys(errors).length === 0) {

          onSave(documentCategoryId, newData, 'add');
        }
      }
    } else {
      onChangeSnackbar({ variant: 'error', message: `${localData && localData._id ? 'Cập nhật thất bại' : 'Thêm mới thất bại'}`, status: true });
    }
  }

  const handleDelete = (e) => {
    setOpenDialogRemove(false);
    if (localData && localData._id) {
      const index = treeData.findIndex(item => item._id === localData._id);
      treeData.splice(index, 1)
      onSave(documentCategoryId, treeData, 'delete');
      handleCloseDialog();
    }

  }

  const handleChange = (e) => {
    const { target } = e;
    const { value, name } = target;
    if (name === 'value') {
      const newValue = parseInt(value.replace(/\,/g,''))
      setLocalData({
        ...localData,
        [name]: newValue
      })
    } else {
      setLocalData({
        ...localData,
        [name]: value
      })
    }
    
    let foundData = false;
    if (name === 'name' || name === 'code') {
      if (!localData._id) {
        foundData = Array.isArray(treeData) && treeData.find(item => (item[name] === value)) ? true : false;
      } else {
        let newTreeData = [];
        newTreeData.push(...treeData);
        const index = newTreeData.findIndex(item => item._id === localData._id);
        if (index !== -1) {
          newTreeData.splice(index, 1);
          foundData = Array.isArray(newTreeData) && newTreeData.find(item => (item[name] === value)) ? true : false;
        }
      }
    }
    if (value.length > 0) {
      if (foundData) {
        setErrors({ ...errors, [name]: `Không được trùng ${column[name]}` });
      } else {
        let newErrors = errors;
        delete newErrors[name];
        setErrors(newErrors);
      }
    } else {
      setErrors({ ...errors, [name]: `Không được để trống ${column[name]}` })
    }
  }

  const changeMutil = value => {
    const newLocalData = { ...localData, hrmTitle: value };
    const newTreeData = [...treeData];
    const newData = [];
    newTreeData.map(item => {
      if (newLocalData._id === item._id) {
        newData.push(newLocalData);
      } else {
        newData.push(item)
      }
    })
    setTreeData(newData);
    setLocalData({
      ...localData,
      hrmTitle: value
    })
  }
  return (
    <Grid className={classes.root} style={{ height: '80%' }}>
      <div className="text-right">
        <Button
          color="primary"
          size="small"
          variant="contained"
          round
          onClick={handleOpenDialog}
        >
          {/* <Add />  */}
          Thêm mới
          </Button>
        <div style={{ width: '100%', height: '500px' }}>
          <SortableTree
            treeData={treeData}
            // onChange={treeData => {
            //   setTreeData({ treeData });
            // }}
            theme={CustomTheme}
            canDrag={({ node }) => !node.noDragging}
            isVirtualized
            // eslint-disable-next-line consistent-return
            generateNodeProps={rowInfo => {
              // if (!rowInfo.node.noDragging) {
              return {
                buttons: [
                  <Fab
                    color="primary"
                    size="small"
                    onClick={(e) => {
                      const newData = {
                        ...rowInfo.node, hrmTitle: Array.isArray(rowInfo.node.hrmTitle) && rowInfo.node.hrmTitle.length ? rowInfo.node.hrmTitle : []
                      }
                      setLocalData(newData)
                      setOpenDialog(true)
                    }}
                    style={{ marginLeft: 10 }}
                  >
                    <Edit />
                  </Fab>,
                  <Fab
                    color="secondary"
                    size="small"
                    style={{ marginLeft: 10 }}
                    title="Xóa"
                    onClick={(e) => {
                      setLocalData(rowInfo.node)
                      setOpenDialogRemove(true);
                    }}
                  >
                    <Delete />
                  </Fab>,
                ],
                // };
              }
            }}
            style={{ fontFamily: 'Tahoma' }}
          />
          <ConfirmDialog
            open={openDialogRemove}
            handleClose={() => setOpenDialogRemove(false)}
            description={'Đồng chí có chắc xóa không?'}
            handleSave={handleDelete}
          />
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle id="alert-dialog-title">{localData && localData._id ? 'Cập nhật danh mục' : 'Thêm mới danh mục'}</DialogTitle>
            <DialogContent style={{ width: 600 }}>
              <CustomInputBase
                label="Mã"
                className={classes.textField}
                value={localData.code}
                onChange={handleChange}
                name="code"
                error={errors && errors.code}
                helperText={errors && errors.code}
              />
              <CustomInputBase
                label="Tên danh mục"
                className={classes.textField}
                value={localData.name}
                onChange={handleChange}
                name="name"
                error={errors && errors.name}
                helperText={errors && errors.name}
              />
              {props.item && (props.item.code === 'HWS03' || props.item.code === 'HWS02' || props.item.code === 'HWS04') &&
                <Autocomplete
                  onChange={value => changeMutil(value)}
                  suggestions={titleCoefficient}
                  value={localData.hrmTitle}
                  label={props.item.code === 'HWS02' ? "Chức vụ" : "Chức danh"}
                  optionLabel="name"
                  optionValue="value"
                  isMulti
                />
              }
              {/* <CustomInputBase
                label="Giá trị"
                className={classes.textField}
                value={localData.value}
                onChange={handleChange}
                name="value"

              /> */}

              <NumberFormat 
                label="Giá trị"
                customInput={TextField} 
                thousandSeparator={true} 
                variant="outlined"
                className={classes.textField}
                value={localData.value}
                onChange={handleChange}
                name="value"
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleAddEdit}
                variant="contained"
                color="primary"
              >
                {localData && localData._id ? 'LƯU' : 'LƯU'}
              </Button>
              <Button
                onClick={handleCloseDialog}
                variant="contained"
                color="secondary"
                autoFocus
              >
                Hủy
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </Grid>
  )
}

export default compose(withStyles(styles), memo)(SubDocumentCategory);