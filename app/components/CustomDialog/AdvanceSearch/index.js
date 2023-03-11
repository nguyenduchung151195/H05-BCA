/**
 *
 * AdvanceSearch
 *
 */

import React, { memo, useState, useEffect } from 'react';
import { compose } from 'redux';
import { Dialog, DialogActions, Button, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core';
import PropTypes from 'prop-types';
import CustomButton from '../../Button/CustomButton';
import AdvanceFilters from './AdvanceFilters';
// import styled from 'styled-components';

function AdvanceSearch(props) {
  const { onSave, query, onChange } = props
  const [localQuery, setLocalQuery] = useState({});

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const handFilterChange = newQuery => {
    setLocalQuery(newQuery);
  }

  const handleSave = () => {
    if (onSave) {
      onSave(localQuery);
    }
  }
  return (
    <>
      <Dialog fullWidth open={props.open} onClose={props.onClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Tìm kiếm khách hàng</DialogTitle>
        <DialogContent>
          <AdvanceFilters query={localQuery} onChange={handFilterChange} />
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={handleSave} color="primary" autoFocus>
            Tìm kiếm
          </CustomButton>
          <CustomButton onClick={props.onClose} color="default" >
            Trở về
          </CustomButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

AdvanceSearch.propTypes = {
  title: PropTypes.string,
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  handleSave: PropTypes.func,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
};

export default compose(
  memo,
)(AdvanceSearch);
