import React, { useEffect, useState } from 'react';
import {
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody,
  Checkbox,
  Button,
  Grid,
} from '@material-ui/core';
import { ExpandMore, ExpandLess } from '@material-ui/icons';
import { API_ORIGANIZATION } from 'config/urlConfig';
import { fetchData, flatChild } from 'helper';
import { Autocomplete } from 'components/LifetekUi';
import lodash from 'lodash';

function DepartmentSelect(props) {
  const { onChange, title, allowedDepartmentIds, allowedDepartment, onSave, disabledAction, onClose } = props;
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [row, setRow] = useState([]);
  const [userRoles, setUserRoles] = useState();
  const [currentDepartment, setCurrentDepartment] = useState();
  const [columns, setColumns] = useState([
    {
      name: 'view',
      title: 'Xem',
      _id: '5fb3ad613918a44b3053f080',
    },
    {
      name: 'edit',
      title: 'Sửa',
      _id: '5fb3ad613918a44b3053f081',
    },
    {
      name: 'delete',
      title: 'Xóa',
      _id: '5fb3ad613918a44b3053f082',
    },
  ]);
  useEffect(() => {
    getData();
  }, []);

  useEffect(
    () => {
      if (props.requiredUserRoles && (!Array.isArray(userRoles) || userRoles.length > 0)) return;
      if (allowedDepartmentIds && departments) {
        let ids = [];
        if (Array.isArray(allowedDepartmentIds)) {
          ids = allowedDepartmentIds;
          // ids = [{ view: true, edit: true, delete: true, id: "1" }]
        }
        setData(mergeDepartment(ids, departments));
      }
    },
    [allowedDepartmentIds, departments, userRoles],
  );

  useEffect(
    () => {
      if (props.requiredUserRoles && (!Array.isArray(userRoles) || userRoles.length > 0)) return;
      if (allowedDepartmentIds.length > 0 && data.length === 0) return;
      if (props.currentDepartment !== currentDepartment)
        if (props.currentDepartment && Array.isArray(departments) && departments.length > 0) {
          const ids = [{ view: true, edit: true, delete: true, id: props.currentDepartment }];
          const data = mergeDepartment(ids, departments);
          const newData = data.map(
            i =>
              i.slug.includes(props.currentDepartment)
                ? {
                    ...i,
                    data: { view: true, edit: true, delete: true },
                  }
                : i,
          );
          setCurrentDepartment(props.currentDepartment);
          updateData(newData);
        }
    },
    [props.currentDepartment, departments, currentDepartment, allowedDepartmentIds, data],
  );

  useEffect(
    () => {
      if (!Array.isArray(departments) && departments.length === 0) return;
      if (!userRoles || userRoles.length === 0) return;
      let newData = mergeDepartment([], departments);
      newData = newData.map(i => {
        const role = userRoles.find(e => e.id === i.id);
        return {
          ...i,
          data: role ? role.data : i.data,
        };
      });

      updateData(newData);
    },
    [departments, userRoles],
  );

  useEffect(
    () => {
      if (!props.userRoles) return;
      let roles = props.userRoles.find(e => e.code === 'DERPARTMENT');
      roles = roles ? roles.data : [];
      if (!lodash.isEqual(roles, userRoles)) {
        setUserRoles(roles);
      }
    },
    [props.userRoles, userRoles],
  );

  const getData = async () => {
    try {
      const departmentsRes = await fetchData(API_ORIGANIZATION);
      const flattedDepartment = flatChild(departmentsRes);
      setDepartments(flattedDepartment);
      if (props.requiredUserRoles) {
        const newData = mergeDepartment([], flattedDepartment);
        updateData(newData);
      }
    } catch (error) {}
  };

  function mergeDepartment(data, z) {
    const x = z.map(i => {
      const dt = data.find(it => it.id === i.id);
      if (dt)
        return {
          open: i.open,
          open: i.open,
          name: i.id,
          id: i.id,
          expand: i.expand,
          slug: i.slug,
          data: { view: dt.view ? dt.view : false, edit: dt.edit ? dt.edit : false, delete: dt.delete ? dt.delete : false },
        };
      return {
        open: i.open,
        name: i.id,
        id: i.id,
        expand: i.expand,
        slug: i.slug,
        data: { view: false, edit: false, delete: false },
      };
    });
    return x;
  }

  const updateData = e => {
    setData(e);
    const viewedDepartmentIds = e.map(item => ({ ...item.data, id: item.name }));
    if (onChange) onChange(e, departments);
    if (allowedDepartment) allowedDepartment(viewedDepartmentIds);
  };

  async function handleCheckDerpartment(name, valueName, checked) {
    const slug = data.find(i => i.name === name).slug;
    const list = slug.split('/');
    const newData = data.map(
      i =>
        i.slug.includes(name)
          ? {
              ...i,
              data: { ...i.data, [valueName]: !checked },
            }
          : i,
    );
    updateData(newData);
    setRow(departments);
  }

  function expandRow(slug, name, expand) {
    let tabDerpartment;

    if (expand) {
      tabDerpartment = departments.map(i => {
        if (i.name === name) return { ...i, expand: false };
        if (i.slug.includes(slug)) return { ...i, open: false, hide: true };
        return i;
      });
    } else {
      tabDerpartment = departments.map(i => {
        if (i.name === name) return { ...i, expand: true };
        if (i.parent === name) return { ...i, open: true, hide: false };
        return { ...i, expand: false };
      });
    }

    setDepartments(tabDerpartment);
  }

  return (
    <>
      <div style={{ marginTop: '20px' }}>
        <p>{title}</p>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ color: 'black', fontWeight: '550' }}>{props.titleDepartment ? props.titleDepartment : 'Phòng ban'}</TableCell>
            {columns.map(
              i =>
                i.name === 'position' ? (
                  <TableCell>
                    <Autocomplete
                      suggestions={positions}
                      onChange={handleFilter}
                      value={filter.position}
                      label={filter.position ? '' : 'Chức vụ'}
                      optionLabel="title"
                      optionValue="value"
                      // name="position"
                      style={{ width: 500 }}
                      isMulti={isMultiple}
                    />
                  </TableCell>
                ) : (
                  <TableCell style={{ color: 'black', fontWeight: '550' }}>{i.title}</TableCell>
                ),
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {departments.map(
            (i, rowIndex) =>
              i.open ? (
                <>
                  <TableRow>
                    <TableCell style={styles.codeCol}>
                      <p
                        style={{ paddingLeft: i.level ? i.level * 10 : 0, fontWeight: i.child ? 'bold' : false }}
                        onClick={e => {
                          e.stopPropagation();
                          expandRow(i.slug, i.name, i.expand);
                        }}
                      >
                        {i.title}
                        {i.child || (data[rowIndex] && data[rowIndex].users && data[rowIndex].users.length) ? (
                          i.expand ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )
                        ) : null}
                      </p>
                    </TableCell>
                    {columns.map(it => (
                      <TableCell>
                        <CheckDerpartment
                          handleCheckDerpartment={handleCheckDerpartment}
                          checked={!!(data[rowIndex] && data[rowIndex].data && data[rowIndex].data[it.name])}
                          column={it.name}
                          row={i.name}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                </>
              ) : null,
          )}
        </TableBody>
      </Table>
      {!disabledAction ? (
        <Grid container spacing={16} justify="flex-end" style={{ marginTop: 15 }}>
          <Grid item>
            <Button variant="contained" color="primary" onClick={e => onSave(data, row)}>
              Lưu
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="secondary" onClick={onClose}>
              Hủy
            </Button>
          </Grid>
        </Grid>
      ) : (
        ''
      )}
    </>
  );
}

function CheckDerpartment({ handleCheckDerpartment, row, column, checked }) {
  function check() {
    handleCheckDerpartment(row, column, checked);
  }
  return <Checkbox onClick={check} checked={checked} />;
}

DepartmentSelect.propTypes = {};

export default DepartmentSelect;

const styles = {
  codeCol: {
    minWidth: '34vw',
  },
};
