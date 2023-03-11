import React, { useState, useEffect } from 'react';
import { Loading } from '../../components/LifetekUi';
import { fetchData, serialize } from '../../helper';
import { API_TASK_EXPORT, API_ORIGANIZATION } from 'config/urlConfig'
import moment from 'moment'
import _ from 'lodash';

const TASK = "Task"

function ExportTable(props) {
  const { filter, open, onClose, listKanbanStatus } = props;
  const url = API_TASK_EXPORT

  const [customData, setCustomData] = useState({})
  const [departments, setDepartments] = useState();
  const [dataPageExcell, setDataPageExcell] = useState({
    data: [],
    totalPage: 1,
    pageNumber: 1,
    numberOrderFirstPage: 1,
  });
  const [viewConfigData, setViewConfigData] = useState([]);

  const { data, totalPage, pageNumber, numberOrderFirstPage } = dataPageExcell;
  const { category, startDate, department, endDate, employee } = customData || {}

  useEffect(() => {
    fetchData(API_ORIGANIZATION, 'GET', null).then(departmentsData => {
      const mapItem = (array) => {
        array.forEach(item => {
          if (item && item._id) result.push({ id: item._id, name: item.name });
          if (item.child) mapItem(item.child);
        });
      };

      let result = []
      mapItem(departmentsData)
      setDepartments(result)
    });
    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const list = viewConfig.find(item => item.code === TASK);
    const data = (list && list.listDisplay && list.listDisplay.type.fields.type.columns) || [];
    const others = (list && list.listDisplay && list.listDisplay.type.fields.type.others) || [];
    const exportColumns = data && data.concat(others).filter(c => c.exportTable);
    setViewConfigData(exportColumns);
  }, []);

  useEffect(() => {
    setCustomData(props.customData)
  }, [props.customData])

  useEffect(
    () => {
      if (url && open) {
        getDataFirstTime()
      }
    },
    [filter, open],
  );

  const getDataFirstTime = async () => {
    try {
      let arr =[]
      viewConfigData.forEach((item)=>{
        arr.push(item.name)
      })
      const selectors = _.join(arr,' ')
      // console.log(selectors,'selectors')
      const query = serialize({ filter, modelName: TASK });
      const apiUrl = `${url}?selector=${selectors}`;

      const res = await fetchData(apiUrl);
      const numberRecordLimitBackEnd = res.limit;
      if (!res.data) throw res
      if (res.count > numberRecordLimitBackEnd) {
        const numberTotalPageLimitBackEnd = (Math.ceil(res.count / numberRecordLimitBackEnd));
        for (let i = 0; i < numberTotalPageLimitBackEnd; i++) {
          await getDataPagination(numberRecordLimitBackEnd * i, numberRecordLimitBackEnd, numberTotalPageLimitBackEnd, i + 1);
        }
      } else {
        setDataPageExcell({ ...dataPageExcell, data: res.data, totalPage: 1, pageNumber: 1, numberOrderFirstPage: 1, });
        onClose({ lastPage: true });
      }

    } catch (err) { onClose({ res: err, error: true, lastPage: true }) }
  };

  const getDataPagination = async (skip, limit, totalPage, pageNumber) => {
    const lastPage = totalPage === pageNumber
    try {
      let newFilter = { filter: { ...filter }, skip: skip, limit: limit, modelName: TASK };
      const query = serialize(newFilter);
      const apiUrl = `${url}?${query}`;
      const res = await fetchData(apiUrl);
      if (!res.data) throw res
      setDataPageExcell({ ...dataPageExcell, data: res.data, totalPage: totalPage, pageNumber: pageNumber, numberOrderFirstPage: skip + 1, });

      onClose({ totalPage, pageNumber, lastPage });
    } catch (err) { onClose({ error: true, lastPage }) }
  };

  return (
    <React.Fragment>
      {open ? <Loading /> : null}
      <div id="excel-table-task" style={{ display: 'none' }}>
        <table>
          <tbody>
            {(department && departments)
              ? <tr>
                <td></td>
                <td>Phòng ban/ chi nhánh:</td>
                <td>{departments.find(e => e.id === department).name}</td>
              </tr>
              : null
            }
            {(startDate && endDate)
              ? <tr>
                <td></td>
                <td>Ngày tháng:</td>
                <td>Từ ngày {moment(startDate).format('DD/MM/YYYY')} đến ngày {moment(endDate).format('DD/MM/YYYY')}</td>
              </tr>
              : null
            }

            {category
              ? <tr>
                <td></td>
                <td>Loại công việc:</td>
                <td>{category.name}</td>
              </tr>
              : null}

            {employee
              ? <tr>
                <td></td>
                <td>Nhân viên:</td>
                <td>{employee.name}</td>
              </tr>
              : null
            }

            <tr>
              <td></td>
              <td>Ngày xuất báo cáo:</td>
              <td>{moment().format('DD/MM/YYYY')}</td>
            </tr>

            <tr></tr>
          </tbody>
        </table>

        <table>
          <thead>
          <tr>
              <th style={{ width: 80 }}>STT</th>
              {viewConfigData.map(cols => (
                <th style={{ width: cols.width }}>{cols.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
          {data.map((row, index) => {
              return (
                <tr>
                  <td style={{ width: 80 }}>{index + 1}</td>
                  {viewConfigData.map(cols => (
                    <td style={{ width: cols.width,float: cols.type === 'Number' ? 'right' : null, textAlign: cols.type === 'Date' ? 'center' : null }}>{typeof row[cols.name] === 'string' || typeof row[cols.name] === 'number' ? row[cols.name] : ''}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td style={{ textAlign: 'center', background: '#959a95' }}>Trang số </td>
              <td style={{ textAlign: 'center', background: '#959a95' }}>{pageNumber}</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td style={{ textAlign: 'center', background: '#959a95' }}>Tổng số trang</td>
              <td style={{ textAlign: 'center', background: '#959a95' }}>{totalPage}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </React.Fragment >
  );
}

export default ExportTable;
