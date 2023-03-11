import React, { useEffect, memo, useRef } from 'react';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
import { Close, Save } from '@material-ui/icons';
import { Typography, Button, IconButton, AppBar, Toolbar } from '@material-ui/core';
import styles from './styles';
import makeSelectDashboardPage, { makeSelectMiniActive } from '../../containers/Dashboard/selectors';
import { mergeData } from '../../containers/Dashboard/actions';
import './index.css';
function MyAppBar(props) {
  const { classes, miniActive = true, onMergeData, dashboardPage, module, disableSave = false } = props;
  const { hiddenHeader } = dashboardPage;

  const isClosing = useRef();
  // console.log(dashboardPage);
  useEffect(
    () => {
      if (!isClosing.current) onMergeData({ hiddenHeader: true });
    },
    [dashboardPage.hiddenHeader],
  );

  const handleClose = async () => {
    isClosing.current = true;
    setTimeout(() => (isClosing.current = false), 100);

    if(props.nonDisableAppBar === false){
      await onMergeData({ hiddenHeader: true })
    }else{
      await onMergeData({ hiddenHeader: false })
    }
    props.onGoBack();
  };

  return (
    <>
      {hiddenHeader === true ? (
        <AppBar
          className={
            miniActive
              ? props.className
                ? classes.AppBarMinimizeActiveProject
                : classes.AppBarMinimizeActive
              : props.className
                ? classes.AppBarMinimizeInActiveProject
                : classes.AppBarMinimizeInActive
          }
        >
          <Toolbar className={miniActive ? classes.ToolBarMinimizeActive : classes.ToolBarMinimizeInActive}>
            {props.onGoBack && (
              <IconButton color="inherit" variant="contained" onClick={() => handleClose()} aria-label="Close">
                <Close />
              </IconButton>
            )}
            <Typography
              variant="h6"
              color="inherit"
              className="flex"
              style={!props.onGoBack ? { flex: 1, fontSize: 16, fontWeight: 600, marginLeft: 10 } : { flex: 1, fontSize: 16, fontWeight: 600 }}
            >
              {props.title}
            </Typography>
            {props.frontBtn ? props.frontBtn : null}
            {props.onChangePass && props.id !== 'add' ? (
              <Button variant="outlined" color="inherit" onClick={props.onChangePass} style={{ marginRight: 20, fontWeight: 'bold' }}>
                Đổi mật khẩu
              </Button>
            ) : null}
            {props.moreButtons && props.moreButtons}
            {props.disableAdd ? null : (
              <Button variant="outlined" color="inherit" disabled={disableSave} onClick={props.onSubmit} style={{ fontWeight: 'bold' }}>
                {/* <span style={{ marginRight: 5 }}>
                  <Save />
                </span> */}
                Lưu
              </Button>
            )}
          </Toolbar>
        </AppBar>
      ) : null}
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  miniActive: makeSelectMiniActive(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onMergeData: data => dispatch(mergeData(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  memo,
  withConnect,
  withStyles(styles),
)(MyAppBar);
