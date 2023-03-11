/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useCallback, useEffect, useState } from 'react';
import { TableHead, TableRow, TableCell, Table, TableBody, Checkbox } from '@material-ui/core';
import { ExpandMore, ExpandLess } from '@material-ui/icons';
import { API_ORIGANIZATION } from '../../config/urlConfig';
import { fetchData, flatChild } from '../../helper';
import CustomInputBase from 'components/Input/CustomInputBase';
function DepartmentSelect(props) {
  const { onChange, title, allowedDepartmentIds, allowedUsers = [], isMultiple, onChangeAddRoles, byOrg, recipientIds, note, setNote } = props;
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [columns, setColumns] = useState([
    {
      name: 'view',
      title: props.customTitle ? props.customTitle : 'Xem',
      _id: '5fb3ad613918a44b3053f080',
    },
  ]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(
    () => {
      if ((allowedDepartmentIds, departments)) {
        let ids = [];
        if (Array.isArray(allowedDepartmentIds)) {
          ids = allowedDepartmentIds;
        }
        setData(mergeDerpartment(ids, departments, [], allowedUsers));
      }
    },
    [allowedDepartmentIds, departments],
  );

  const getData = async () => {
    try {
      const departmentsRes = await fetchData(`${API_ORIGANIZATION}?${byOrg ? `byOrg=true` : ''}`);
      const flattedDepartment = flatChild(departmentsRes);


      let recipientId = []
      recipientIds && Array.isArray(recipientIds) && recipientIds.length > 0 && recipientIds.map((el) => {
        recipientId.push(el.recipientId._id)
      })
      // console.log("recipientIds; ", recipientIds)
      const result = flattedDepartment.filter(x => recipientId.includes(x._id));
      // console.log(result, "result")
      // console.log(recipientIds, "recipientIds", recipientId, flattedDepartment)
      setDepartments(result);


    } catch (error) { }
  };

  function mergeDerpartment(data, z, users = [], allowedEmployees = []) {
    const x = z.map(i => {
      const departmentUsers = (users.filter(u => u.organizationUnit && u.organizationUnit.organizationUnitId === i.id) || []).map(u => {
        const dt = allowedEmployees.find(it => it === u._id);
        if (dt) {
          return {
            is_user: true,
            userName: u.name,
            open: u.open,
            name: u.id,
            id: u._id,
            expand: u.expand,
            slug: u.slug,
            position: u.positions && u.positions.title,
            data: { view: true, edit: false, delete: false },
          };
        }
        return {
          is_user: true,
          userName: u.name,
          open: u.open,
          name: u.id,
          id: u._id,
          expand: u.expand,
          slug: u.slug,
          position: u.positions && u.positions.title,
          data: { view: false, edit: false, delete: false },
        };
      });
      if (Array.isArray(data) && data.length) {
        const dt = data.find(it => it === i.id);
        if (dt)
          return {
            open: i.open,
            name: i.id,
            id: i.id,
            expand: i.expand,
            slug: i.slug,
            data: { view: true, edit: false, delete: false },
            users: departmentUsers,
          };
      }
      return {
        open: i.open,
        name: i.id,
        id: i.id,
        expand: i.expand,
        slug: i.slug,
        data: { view: false, edit: false, delete: false },
        users: departmentUsers,
      };
    });
    return x;
  }

  function handleCheckDerpartment(name, valueName, checked) {
    try {
      const slug = data.find(i => i.name === name).slug;
      const list = slug.split('/');
      const newData = data
        .map(
          i =>
            i.slug.includes(slug)
              ? {
                ...i,
                data: { ...i.data, [valueName]: !checked, organizationId: data.id },
              }
              : i,
        );
      setData(newData);
      const viewedDepartmentIds = newData.filter(item => item.data.view).map(item => item.name);
      if (onChange) onChange(viewedDepartmentIds);
    } catch (error) {
      // console.log('error', error);
    }
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
            <TableCell>{props.titleDepartment ? props.titleDepartment : 'Phòng ban'}</TableCell>
            {columns.map(i => (
              <TableCell>{props.titleSelect ? props.titleSelect : i.title}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {departments.map(
            (i, rowIndex) =>
            (
              <>
                <TableRow>
                  <TableCell style={styles.codeCol}>
                    {/* <p
                        style={{ paddingLeft: i.level ? i.level * 10 : 0, fontWeight: i.child ? 'bold' : false }}
                        onClick={e => {
                          e.stopPropagation();
                          expandRow(i.slug, i.name, i.expand);
                        }}
                      > */}
                    {i.title}
                    {/* {i.child || (data[rowIndex] && data[rowIndex].users && data[rowIndex].users.length) ? (
                          i.expand ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )
                        ) : null}
                      </p> */}
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
            ) ,
          )}
        </TableBody>
      </Table>
      <CustomInputBase
        style={{ marginTop: 30 }}
        multiline
        rows={2}
        value={note ? note : ''}
        name="note"
        // showSpeaker
        onChange={e => setNote(e.target.value)}
        label="Nội dung thu hồi"
        checkedShowForm
        // error={!note}
        // helperText={!note ? 'Đồng chí chưa nhập nội dung xử lý' : ''}
        // required
        className={'CustomRequiredLetter'}
      />
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
