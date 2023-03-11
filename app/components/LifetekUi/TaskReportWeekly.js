/* eslint-disable eqeqeq */
/* eslint-disable func-names */
import React, { useEffect } from 'react';
import { Button } from '@material-ui/core';
import './table.css';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import { fetchData, tableToExcel, groupBy } from '../../helper';
import { API_REPORT } from '../../config/urlConfig';

const nameStage = [
  'GIAI ĐOẠN THÔNG TIN THỊ TRƯỜNG CHỐT CHỦ TRƯƠNG',
  'NHÓM VIỆC TIỀN DỰ ÁN',
  'NHÓM VIỆC THI CÔNG',
  'NHÓM VIỆC TỒN ĐỌNG/THU HỒI CÔNG NỢ',
];

export default function TaskReportWeekly() {
  const [data, setData] = React.useState({ backlogWeek: [], groupWeek: {}, others: {}, otherWorkWeek: [] });
  const [startDate, setStartDate] = React.useState(new Date());

  useEffect(
    () => {
      if (startDate) {
        async function getData() {
          try {
            fetchData(`${API_REPORT}/taskPlan?dateChoose=${startDate}`).then(respon => {
              mapData(respon);
            });
          } catch (error) {
            // eslint-disable-next-line
            // console.log(error);
          }
        }
        getData();
      }
    },
    [startDate],
  );

  function handleDateChange(date) {
    setStartDate(date);
  }

  function mapData(dataReport) {
    let date = new Date(startDate);
    let dayOfLastWeek = date.getDate() - date.getDay();
    let lastDayOfLastWeek = new Date(date.setDate(dayOfLastWeek));
    const backlogTask = mapItem(dataReport.backlogWeek.filter(i => i.projectId && (i.finishDate == null || i.finishDate > lastDayOfLastWeek)));
    const otherTask = mapItem(dataReport.otherWorkWeek.filter(i => i.projectId));
    // const groupTask = mapItem(dataReport.group);
    const z = groupByTask(dataReport.groupWeek);
    const w = GroupByOne(dataReport.groupWeek);
    const data = { backlogWeek: backlogTask, groupWeek: z, others: w, otherWorkWeek: otherTask };
    setData(data);
  }
  function mapName(item) {
    if (item && item.length) return item.map(i => i.name).join();
    return '';
  }
  const ROOT_PARENT_LEVEL = 0;

  function getParentId(item, parents, tasks) {
    if (!item.level) return parents.findIndex(element => element._id === item._id);
    const foundItem = tasks.find(element => element._id === item.parentId);
    return getParentId(foundItem, parents, tasks);
  }

  function getOrderCode(item, tasks) {
    if (!item.level) return (tasks.find(element => element._id === item._id).order + 1).toString();
    const foundItem = tasks.find(element => element._id === item.parentId);
    return `${getOrderCode(foundItem, tasks)}.${(item.order + 1).toString()}`;
  }

  function assignOrderCode(tasks) {
    const parents = tasks
      .filter(item => item.level === ROOT_PARENT_LEVEL)
      .sort((a, b) => a.order - b.order)
      .map(item => ({ ...item, child: [] }));
    const children = tasks
      .filter(item => item.level !== ROOT_PARENT_LEVEL)
      .sort((a, b) => a.order - b.order)
      .sort((a, b) => a.level - b.level);

    for (const child of children) {
      try {
        const parentIdx = getParentId(child, parents, tasks);
        child.orderCode = getOrderCode(child, tasks);
        parents[parentIdx].child.push(child);
      } catch (e) {
        // console.log('Error in assign task code:', e);
      }
    }
  }
  function GroupByOne(groupWeek) {
    const list = groupWeek.filter(i => !i.parentId && !i.isProject);
    const groupTask = groupBy(list, 'category');
    const w = {};
    Object.keys(groupTask).forEach(i => {
      w[i] = mapItem(groupTask[i]);
    });
    return w;
  }
  const sortOrder = (a, b) => {
    const x = a.orderCode.split('.').map(Number);
    const y = b.orderCode.split('.').map(Number);
    const maxLength = x.length > y.length ? x.length : y.length;
    for (let i = 0; i < maxLength; i++) {
      if (x[i] > y[i]) return true ? 1 : -1;
      if (x[i] < y[i]) return true ? -1 : 1;
      // eslint-disable-next-line
      if (!isNaN(x[i]) && isNaN(y[i])) return true ? 1 : -1;
      // eslint-disable-next-line
      if (isNaN(x[i]) && !isNaN(y[i])) return true ? -1 : 1;
    }
    return 0;
  };
  function groupByTask(groupWeek) {
    const list = groupWeek.filter(i => !i.parentId && i.projectId);
    list.map(e => ((e.order = list.indexOf(e)), (e.orderCode = (list.indexOf(e) + 1).toString())));
    const groupTask = groupBy(list, 'taskStage');

    const z = {};
    assignOrderCode(groupWeek);
    groupWeek.sort(sortOrder);
    Object.keys(groupTask).forEach(i => {
      groupWeek.forEach(element => {
        if (groupTask[i].map(x => x.projectId).includes(element.projectId)) {
          if (z[i]) z[i].push(element);
          else z[i] = [element];
        }
      });
    });
    const w = {};
    Object.keys(z).forEach(i => {
      w[i] = mapItem(z[i]);
    });
    return w;
  }

  function mapItem(item) {
    return item
      .map(i => {
        let task;
        if (i.parentId) {
          if (i.projectId) {
            task = `${i.projectId}B`;
          } else {
            task = i._id;
          }
        } else {
          task = i._id;
        }

        return {
          ...i,
          join: mapName(i.join),
          start_date: new Date(i.startDate).toLocaleDateString('vi'),
          end_date: new Date(i.endDate).toLocaleDateString('vi'),
          dayLater: `${Math.ceil((new Date() - new Date(i.endDate)) / 86400000)}`,
          datePlan: Math.ceil((new Date(i.endDate) - new Date(i.startDate)) / 86400000),
          inCharge: mapName(i.inCharge),
          support: mapName(i.support),
          dayFinish: i.finishDate ? Math.ceil((new Date(i.finishDate) - new Date(i.startDate)) / 86400000) : null,
          task,
        };
      })

      .sort((a, b) => a.task.localeCompare(b.task));
  }

  return (
    <div style={{ overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          color="primary"
          style={{ cursor: 'pointer' }}
          type="button"
          onClick={() => tableToExcel('report-task', 'W3C Example Table')}
        >
          Xuất File Excel Kế Hoạch tháng hiện tại
        </Button>
        <form noValidate>
          <TextField
            id="date"
            label="Chọn ngày"
            type="date"
            defaultValue={moment(new Date()).format('YYYY-MM-DD')}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={val => handleDateChange(val.target.value)}
          />
        </form>
      </div>
      <table id="report-task" className="border_table">
        <thead>
          <tr style={{ background: '#959a95' }}>
            <th rowSpan={2}> STT</th>
            <th rowSpan={2}>Mã Dự Án</th>
            <th rowSpan={2}>Mã công việc</th>
            <th rowSpan={2}>Nội dung công việc</th>
            <th rowSpan={2}>Giá trị DA</th>
            <th rowSpan={2}>Nhân sự phụ trách DA</th>
            <th rowSpan={2}>Nhân sự thực hiện</th>
            <th rowSpan={2}>Nhân sự phối hợp </th>
            <th colSpan={2}>Thời gian thực hiên</th>
            <th rowSpan={2}>Phân bổ theo KH Tháng</th>
            <th rowSpan={2}>Kết Quả</th>
            <th rowSpan={2}>Tồn đọng</th>
          </tr>
          <tr style={{ background: '#959a95' }}>
            <th> BĐ</th>
            <th> KT</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ textAlign: 'center' }}>
            {Array.from({ length: 13 }, (v, u) => (
              <td>{u + 1}</td>
            ))}
          </tr>
          <tr style={{ backgroundColor: '#90ea90e6', fontWeight: 'bold' }}>
            {Array.from({ length: 13 }, (v, u) => (
              <td style={{ textAlign: 'center' }}>{u == 0 ? 'A' : u == 2 ? 'A' : u == 3 ? 'NHÓM TỒN ĐỌNG' : null}</td>
            ))}
          </tr>


          {data.backlogWeek.map(i => (
            <tr>
              <td />
              <td />
              <td>{i.code ? i.code : null}</td>
              {i.parentId ? <td>{i.name}</td> : <td style={{ fontWeight: 'bold' }}>{i.name}</td>}
              <td />
              <td>{i.inCharge}</td>
              <td>{i.join}</td>
              <td>{i.support}</td>
              <td>{i.start_date}</td>
              <td>{i.end_date}</td>
              <td />
              <td />
              <td />
            </tr>
          ))}

          <tr style={{ backgroundColor: '#90ea90e6', fontWeight: 'bold' }}>
            {Array.from({ length: 13 }, (v, u) => (
              <td style={{ textAlign: 'center' }}>{u == 0 ? 'B' : u == 2 ? 'B' : u == 3 ? 'NHÓM DỰ ÁN' : null}</td>
            ))}
          </tr>

          {Object.keys(data.groupWeek).map((i, v) => {

            const y = data.groupWeek[i].map((o, i) => (
              <tr>
                <td style={{ textAlign: 'center' }} />
                {o.businessOpportunities ? <td>{o.businessOpportunities.code}</td> : <td />}
                <td>{o.code ? o.code : null}</td>
                {o.parentId ? (
                  <td>
                    {o.orderCode}.{o.name}
                  </td>
                ) : (
                  <td style={{ fontWeight: 'bold' }}>{o.name}</td>
                )}
                <td />
                <td>{o.inCharge}</td>
                <td>{o.join}</td>
                <td>{o.support}</td>
                <td>{o.start_date}</td>
                <td>{o.end_date}</td>
                <td />
                <td />
                <td />
              </tr>
            ));
            return y.concat();
          })}

          <tr style={{ backgroundColor: '#90ea90e6', fontWeight: 'bold' }}>
            {Array.from({ length: 13 }, (v, u) => (
              <td style={{ textAlign: 'center' }}>{u == 0 ? 'C' : u == 3 ? 'CÔNG VIỆC KHÁC' : null}</td>
            ))}
          </tr>

          {data.otherWorkWeek.map(i => (
            <tr>
              <td />
              <td />
              <td>{i.code ? i.code : null}</td>
              {i.parentId ? <td>{i.name}</td> : <td style={{ fontWeight: 'bold' }}>{i.name}</td>}
              <td />
              <td>{i.inCharge}</td>
              <td>{i.join}</td>
              <td>{i.support}</td>
              <td>{i.start_date}</td>
              <td>{i.end_date}</td>
              <td />
              <td />
              <td />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
