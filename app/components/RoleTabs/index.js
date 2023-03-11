import React, { useState, useEffect } from 'react';
import { Grid, Typography, Tab, Badge } from '@material-ui/core';
import { Tabs } from '../LifetekUi';
import FabsBtn from '../FabsBtn';
import FabsBtnGo from '../FabsBtnGo';
function RoleTabs({ roles = {}, rolesByTab, templates = [], rootTab = '', tab, profile, data, docData, ok, isAuthory = false, ...rest }) {
  const { document = {}, handleChangeTab, docType = '', typePage = '', employeeReturn = [] } = rest || {};
  const [localRoles, setLocalRoles] = useState([]);
  const getCountByRole = value => {
    if (docType === 'goDocument') {
      switch (value) {
        case 'receive':
          return (document && document.countDocumentarys) || 0;
        case 'processing':
          return (document && document.documentarysProcessors) || 0;
        case 'release':
          return (document && document.documentarysRelease) || 0;
        case 'outgoing':
          return (document && document.documentGoing) || 0;
        case 'feedback':
          return (document && document.feedBackCount) || 0;
        case 'findStatistics':
          return (document && document.findStatistics) || 0;
        default:
          '';
      }
    }

    switch (value) {
      case 'receive':
        return (document && document.countDocumentarys) || 0;
      case 'processing':
        return (document && document.documentarysProcessors) || 0;
      case 'support':
        return (document && document.documentarysSupporters) || 0;
      case 'view':
        return (document && document.documentarysViewers) || 0;
      case 'command':
        return (document && document.documentCommanders) || 0;
      case 'feedback':
        return (document && document.feedBackCount) || 0;
      case 'findStatistics':
        return (document && document.findStatistics) || 0;
      default:
        0;
    }
  };
  const getValueTabByRole = value => {
    if (docType === 'goDocument') {
      switch (value) {
        case 'receive':
        case 'feedback':
          return value;
        case 'processing':
          return 'processors';
        case 'release':
          return 'promulgate';
        case 'outgoing':
          return 'textGo';
        case 'findStatistics':
          return 'findStatistics';
        default:
          '';
      }
    }

    switch (value) {
      case 'receive':
      case 'feedback':
        return value;
      case 'processing':
        return 'processors';
      case 'support':
      case 'view':
        let newValue = `${value}ers`;
        return newValue;
      case 'command':
        return 'commander';
      case 'findStatistics':
        return 'findStatistics';
    }
  };

  const getContentByRole = value => {
    if (docType === 'goDocument') {
      switch (value) {
        case 'receive':
          return 'Trình ký';
        case 'processing':
          return 'Xử lý';
        case 'release':
          return 'Ban hành';
        case 'outgoing':
          return 'Nhận để biết';
        case 'feedback':
          return 'Ý kiến';
        case 'findStatistics':
          return 'Tra cứu Thống kê';
        default:
          0;
      }
    }
    switch (value) {
      case 'receive':
        return 'Tiếp nhận';
      case 'processing':
        return 'Xử lý chính';
      case 'support':
        return 'Phối hợp';
      case 'view':
        return 'Nhận để biết';
      case 'command':
        return 'Chỉ đạo';
      case 'feedback':
        return 'Ý kiến';
      case 'findStatistics':
        return 'Tra cứu Thống kê';
      default:
        0;
    }
  };

  useEffect(
    () => {
      if (roles) {
        let roleArr = (roles && Object.keys(roles).filter(f => !f.includes('_') && roles[f])) || [];
        setLocalRoles(roleArr);
      }
    },
    [roles],
  );
  return (
    <Grid container justifyContent="space-between" style={{ marginTop: 8, paddingBottom: 10 }}>
      <Grid item container sm={!rest.canView ? 12 : docType !== '' ? 8 : 7} >
        <Tabs value={rootTab} onChange={handleChangeTab} aria-label="basic tabs example" variant="scrollable">
          {localRoles && Array.isArray(localRoles) && localRoles.length && 
            localRoles.filter((el)=> {
              if(docType === "goDocument" && isAuthory && el !== 'receive') {
                return el
              }
              else if(docType !== "goDocument" || !isAuthory){
                return el
              }
            }).map(role => (
              <Tab
                value={role ? getValueTabByRole(role) : ''}
                label={
                  <Badge color="primary" badgeContent={getCountByRole(role)} max={9999}>
                    <Typography style={{ fontSize: 12, fontWeight: 600 }}>{getContentByRole(role)}</Typography>
                  </Badge>
                }
              />
            ))}
        </Tabs>
        {/* {localRoles &&
          localRoles.map(role => (
            <Button variant="outlined" style={{ fontSize: 12, fontWeight: 600, marginRight: 20 }}>{getContentByRole(role)}</Button>

          ))} */}
      </Grid>

      {docType !== '' ? (
        <FabsBtnGo
          {...rest}
          rootTab={rootTab}
          roles={rolesByTab}
          templates={templates}
          docType={docType}
          tab={tab}
          data={data}
          profile={profile}
          employeeReturn={employeeReturn}
          typePage={typePage}
        />
      ) : (
        <FabsBtn
          {...rest}
          docData={docData}
          rootTab={rootTab}
          data={data}
          roles={rolesByTab}
          templates={templates}
          docType={docType}
          tab={tab}
          profile={profile}
          employeeReturn={employeeReturn}
          typePage={typePage}
        />
      )}
    </Grid>
  );
}

export default RoleTabs;
