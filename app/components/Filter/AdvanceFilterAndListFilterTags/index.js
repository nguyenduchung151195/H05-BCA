/**
 *
 * AdvanceSearch
 *
 */

import React, { memo, useState, useCallback, useEffect } from 'react';
import { compose } from 'redux';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import CustomButton from '../../Button/CustomButton';
import AdvanceSearch from '../../CustomDialog/AdvanceSearch';
import CustomTag from '../../Button/CustomButton/CustomTags';
import SearchIcon from '@material-ui/icons/Search';
import { Fab } from 'components/LifetekUi';
function AdvanceFilterAndListFilterTags(props) {
  const { onSearch, org = [] } = props;
  const [query, setQuery] = useState({
    findCustomerWithoutManager: false,
  });
  const [tags, setTags] = useState([]);
  const [openAdvanceSearch, setOpenAdvanceSearch] = useState(false);

  // useEffect(() => {
  //   if (onSearch) {
  //     onSearch(parseQuery(query));
  //   }
  // }, [])

  const onOpenAdvanceSearch = useCallback(() => {
    setOpenAdvanceSearch(true);
  }, []);

  const onCloseAdvanceSearch = useCallback(() => {
    setOpenAdvanceSearch(false);
  }, []);

  const parseQuery = newQuery => {
    const { age, ageFilter, revenue, revenueFilter, lastUsingServiceYear, lastUsingServiceYearFilter, department, employee, provincial, findCustomerWithoutManager, ...rest } = newQuery;
    const newTags = [];
    const parsedQuery = {};

    if (findCustomerWithoutManager) {
      parsedQuery.findCustomerWithoutManager = findCustomerWithoutManager;
      newTags.push({
        label: 'Khách hàng chưa có người phụ trách',
        key: 'findCustomerWithoutManager'
      })
    }

    if (department) {
      parsedQuery.organizationUnitId = department;
      newTags.push({
        label: (org.find(o => o.id === department) || {}).name,
        key: 'department'
      })
    }

    if (provincial) {
      parsedQuery.provincial = provincial.title;
      newTags.push({
        label: `${provincial.label} ${provincial.title}`,
        key: 'provincial'
      })
    }

    if (employee && employee._id) {
      // parsedQuery.viewEmployeeId = employee._id;
      parsedQuery.manageEmployeeId = employee._id;
      newTags.push({
        label: `Người phụ trách ${employee.name}`,
        key: 'employee'
      })
    }

    if (rest) {
      Object.keys(rest).forEach(key => {
        if (!rest[key]) return;
        parsedQuery[key] = rest[key].value;
        newTags.push({
          label: `${rest[key].label} ${rest[key].title}`,
          key: key
        })
      });
    }
    if (ageFilter) {
      parsedQuery.minAge = age[0];
      parsedQuery.maxAge = age[1];
      newTags.push({
        label: `Độ tuổi KH từ ${parsedQuery.minAge} đến ${parsedQuery.maxAge}`,
        key: 'age',
      });
    }
    if (revenueFilter) {
      parsedQuery.minRevenue = revenue[0];
      parsedQuery.maxRevenue = revenue[1];
      newTags.push({
        label: `Doanh thu KH từ ${parsedQuery.minRevenue} đến ${parsedQuery.maxRevenue}`,
        key: 'revenue',
      });
    }
    if (lastUsingServiceYearFilter) {
      parsedQuery.minLastUsingServiceYear = lastUsingServiceYear[0];
      parsedQuery.maxLastUsingServiceYear = lastUsingServiceYear[1];
      newTags.push({
        label: `Lần sử dụng dịch vụ gần nhất từ ${parsedQuery.minLastUsingServiceYear} đến ${parsedQuery.maxLastUsingServiceYear} năm`,
        key: 'lastUsingServiceYear',
      });
    }


    setTags(newTags);
    return parsedQuery;
  };

  const handleSearch = useCallback(newQuery => {
    setQuery(newQuery);
    if (onSearch) {
      onSearch(parseQuery(newQuery));
    }
    onCloseAdvanceSearch();
  }, []);

  const handleRemove = item => {
    setTags(tags.filter(t => t.key !== item.key));
    const newQuery = {};
    Object.keys(query).forEach(key => {
      if (item.key === key || item.key + 'Filter' === key) return;
      newQuery[key] = query[key];
    });
    setQuery(newQuery);
    onSearch(parseQuery(newQuery));
  }

  return (
    <>
      <Grid container spacing={8}>
        <Grid item>
          {/* <CustomButton onClick={onOpenAdvanceSearch}>

          </CustomButton> */}
          <Fab onClick={onOpenAdvanceSearch}>
            <SearchIcon />
          </Fab>
        </Grid>
        {tags.map(tag => (
          <Grid item>
            <CustomTag item={tag} onClick={() => handleRemove(tag)} />
          </Grid>
        ))}

      </Grid>
      <AdvanceSearch open={openAdvanceSearch} query={query} onSave={handleSearch} onClose={onCloseAdvanceSearch} />
    </>
  );
}

AdvanceFilterAndListFilterTags.propTypes = {
  title: PropTypes.string,
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  handleSave: PropTypes.func,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
};

export default compose(
  memo,
)(AdvanceFilterAndListFilterTags);
