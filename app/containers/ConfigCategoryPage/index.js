import React, { memo, useState, useEffect } from 'react';
import CustomerVerticalTabList from 'components/CustomVerticalTabList';
import AddDocumentCategory from './components/AddDocumentCategory/Loadable';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import { Paper } from 'components/LifetekUi';
import {
  getAllDocumentCategory,
  addDocumentCategory,
  updateDocumentCategory,
  deleteDocumentCategory,
  resetDocumentCategory
} from './actions';
import makeSelectConfigDocumentCategoryPage from './selectors';
import SubDocumentCategory from './components/subCategories/Loadable';
import { Grid } from '@material-ui/core';
import ConfirmDialog from '../../components/CustomDialog/ConfirmDialog';
import { changeSnackbar } from '../Dashboard/actions';

function ConfigCategoryPage(props) {
  const { getAllDocumentCategory, addDocumentCategory, updateDocumentCategory, deleteDocumentCategory, DocumentCategoryPage, onChangeSnackbar, resetDocumentCategory } = props;
  const { documentCategory, addDocumentCategorySuccess, updateDocumentCategorySuccess, deleteDocumentCategorySuccess } = DocumentCategoryPage;
  const [openCategory, setOpenCategory] = useState(false);
  const [openCategoryDelete, setOpenCategoryDelete] = useState(false);
  const [openCategoryReset, setOpenCategoryReset] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [localDocumentCategory, setLocalDocumentCategory] = useState([]);
  const [localData, setLocalData] = useState({});
  const [errors, setErrors] = useState({});
  const [column, setColumn] = useState({
    title: 'Tiêu đề',
    code: 'Mã'
  });

  useEffect(() => {
    const data = getAllDocumentCategory();
    return () => {
      data;
    }
  }, [])

  useEffect(() => {
    setLocalDocumentCategory(documentCategory);
  }, [documentCategory])

  useEffect(
    () => {
      if (addDocumentCategorySuccess === true) {
        handleCloseCategory();
      }
      if (!addDocumentCategorySuccess) {
      }
    },
    [addDocumentCategorySuccess],
  );

  useEffect(
    () => {
      if (updateDocumentCategorySuccess === true) {
        // setReload(true);
        handleCloseCategory();
      }
      if (!updateDocumentCategorySuccess) {
        // setReload(false);
      }
    },
    [updateDocumentCategorySuccess],
  );

  const handleCloseDelete = () => {
    setOpenCategoryDelete(false);
  }

  const handleOpenCategory = () => {
    setOpenCategory(true);
  }
  const handleCloseCategory = () => {
    setOpenCategory(false);
    setErrors({});
  }

  const handleAddEdit = (item, isEdit) => {
    setOpenCategory(true)
    if (item && item._id) {
      setLocalData(item);
      // sua
    } else {
      // them
      setLocalData({})
    }
  }

  const onDelete = () => {
    if (localData && localData._id) {
      //xoa 
      deleteDocumentCategory(localData);
      setOpenCategoryDelete(false);
    } else {

    }
  }

  // cap nhat them moi
  const handleSave = () => {
    if (Object.keys(errors).length === 0) {
      if (localData._id) {
        updateDocumentCategory(localData, 'update');
      } else {
        addDocumentCategory({ title: localData.title, code: localData.code, data: [] });
      }
    } else {
      onChangeSnackbar({ variant: 'error', message: `${localData && localData._id ? 'Cập nhật thất bại' : 'Thêm mới thất bại'}`, status: true });
    }
  }

  // cap nhat, them, xoa danh muc con
  const onSave = (id, newData, type) => {
    if (id && newData) {
      const foundDocumentCategory = localDocumentCategory && localDocumentCategory.find(item => item._id === id);
      if (foundDocumentCategory) {
        const newDocumentCategory = { ...foundDocumentCategory, data: newData };
        updateDocumentCategory(newDocumentCategory, type);
      }
    }
  }

  const handleChangeInput = (e) => {
    const { target: { value, name } } = e;
    setLocalData({ ...localData, [name]: value });

    let foundData = false;
    if (!localData._id) {
      foundData = Array.isArray(localDocumentCategory) && localDocumentCategory.find(item => item[name].trim() === value.trim()) ? true : false;
    } else {
      let newLocalDocumentCategory = [];
      newLocalDocumentCategory.push(...localDocumentCategory);
      const index = newLocalDocumentCategory.findIndex(item => item._id === localData._id);
      if (index !== -1) {
        newLocalDocumentCategory.splice(index, 1);
        foundData = Array.isArray(newLocalDocumentCategory) && newLocalDocumentCategory.find(item => item[name].trim() === value.trim()) ? true : false;
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

  const handleReset = () => {
    resetDocumentCategory();
    setOpenCategoryReset(false);
  }
  return (
    <Paper>
      <Grid container spacing={16}>
        <Grid item style={{ width: '300px' }}>
          <CustomerVerticalTabList
            value={tabIndex}
            data={localDocumentCategory}
            onChange={(_, tabIndex) => setTabIndex(tabIndex)}
            onChangeAdd={handleAddEdit}
            onChangeEdit={handleAddEdit}
            onChangeDelete={(item) => { setOpenCategoryDelete(true); setLocalData(item) }}
            onChangeUndo={(e) => setOpenCategoryReset(true)}
          />
        </Grid>
        <Grid item style={{ width: 'calc(100% - 300px)' }}>
          {
            localDocumentCategory && localDocumentCategory.map((item, index) => {
              let renderTabChild = null;
              if (tabIndex === index && localDocumentCategory[index]) {
                renderTabChild = <SubDocumentCategory documentCategoryId={item._id} data={item.data} item={item} onSave={onSave} onChangeSnackbar={onChangeSnackbar} updateDocumentCategorySuccess={updateDocumentCategorySuccess} />
              }
              return renderTabChild;
            })
          }
        </Grid>
      </Grid>

      {/* Them, sua */}
      <AddDocumentCategory
        openModal={openCategory}
        handleClose={handleCloseCategory}
        title="Danh mục lương"
        label={column}
        name={{ title: "title", code: "code" }}
        localData={localData}
        onChange={handleChangeInput}
        onSave={handleSave}
        error={errors}
      />

      {/* xóa */}
      <ConfirmDialog
        open={openCategoryDelete}
        handleClose={handleCloseDelete}
        description={'Đồng chí có chắc chắn xóa danh mục này không?'}
        handleSave={onDelete}
      />

      {/* hoan tac */}
      <ConfirmDialog
        open={openCategoryReset}
        handleClose={() => setOpenCategoryReset(false)}
        description={'Đồng chí có chắc hoàn tác không?'}
        handleSave={handleReset}
      />

    </Paper>
  )
}

const mapStateToProps = createStructuredSelector({
  DocumentCategoryPage: makeSelectConfigDocumentCategoryPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    getAllDocumentCategory: () => dispatch(getAllDocumentCategory()),
    addDocumentCategory: (data) => dispatch(addDocumentCategory(data)),
    updateDocumentCategory: (data, type) => dispatch(updateDocumentCategory(data, type)),
    deleteDocumentCategory: (data) => dispatch(deleteDocumentCategory(data)),
    resetDocumentCategory: () => dispatch(resetDocumentCategory()),
    onChangeSnackbar: (obj) => dispatch(changeSnackbar(obj)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'configDocumentCategory', reducer });
const withSaga = injectSaga({ key: 'configDocumentCategory', saga });

export default compose(
  memo,
  withReducer,
  withSaga,
  withConnect,
)(ConfigCategoryPage);