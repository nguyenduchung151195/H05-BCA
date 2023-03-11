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
  'Giai đoạn thông tin thị trường chốt chủ trương',
  'Giai đoạn tiền dự án',
  'Dự Án GĐ Đang Thi Công',
  'Dự Án GĐ Chuẩn Bị Thi Công',
  'Dự Án Giai Đoạn Nghiệm Thu',
  'Dự Án Giai Đoạn Thu Hồi Công Nợ',
];

export default function TaskReport() {
  const [data, setData] = React.useState({ backlog: [], group: {}, others: {}, otherWork: [] });
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
    const currentMonth = new Date(startDate);
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth();
    const firsttDayCurrMonth = new Date(y, m, 1);
    const backlogTask = mapItem(dataReport.backlog.filter(i => i.projectId && (i.finishDate == null || i.finishDate > firsttDayCurrMonth)));
    const otherTask = mapItem(dataReport.otherWork.filter(i => i.projectId));
    const z = groupByTask(dataReport.group);
    const w = GroupByOne(dataReport.group);
    const data = { backlog: backlogTask, group: z, others: w, otherWork: otherTask };
    setData(data);
  }

  function mapName(item) {
    if (item && item.length) return item.map(i => i.name).join();
    return '';
  }

  function GroupByOne(group) {
    const list = group.filter(i => !i.parentId && !i.projectId);
    const groupTask = groupBy(list, 'category');
    const w = {};
    Object.keys(groupTask).forEach(i => {
      w[i] = mapItem(groupTask[i]);
    });
    return w;
  }

  function groupByTask(group) {
    const list = group.filter(i => !i.parentId && i.projectId);
    const groupTask = groupBy(list, 'taskStage');
    const z = {};
    Object.keys(groupTask).forEach(i => {
      group.forEach(element => {
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
            <th rowSpan={2}>Phân bổ theo KH Quý</th>
            <th rowSpan={2}>Tồn đọng </th>
            <th rowSpan={2}>Số ngày chậm tiến độ</th>
            <th rowSpan={2}>Tông ngày thực hiện theo KH</th>
            <th rowSpan={2}>Thực tế thực hiện</th>
          </tr>
          <tr style={{ background: '#959a95' }}>
            <th> BĐ</th>
            <th> KT</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ textAlign: 'center' }}>
            {Array.from({ length: 15 }, (v, u) => (
              <td>{u + 1}</td>
            ))}
          </tr>
          <tr style={{ background: '#90ea90e6', fontWeight: 'bold' }}>
            {Array.from({ length: 15 }, (v, u) => (
              <td>{u == 0 ? 'A' : u == 3 ? 'NHÓM TỒN ĐỌNG' : null}</td>
            ))}
          </tr>
          {data.backlog.map(i => (
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
              <td>{i.dayLater}</td>
              <td>{i.datePlan + 1}</td>
              <td />
            </tr>
          ))}
          <tr style={{ background: '#90ea90e6', fontWeight: 'bold' }}>
            {Array.from({ length: 15 }, (v, u) => (
              <td>{u == 0 ? 'B' : u == 3 ? 'NHÓM DỰ ÁN' : null}</td>
            ))}
          </tr>

          {Object.keys(data.group).map((i, v) => {
            const x = [
              <tr>
                <td>B{v + 1}</td>
                <td />
                <td />
                <td style={{ fontWeight: 'bold' }}>{nameStage[i - 1]}</td>
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
              </tr>,
            ];

            const y = data.group[i].map(o => (
              <tr>
                <td />
                <td />
                <td>{o.code ? o.code : null}</td>
                {o.parentId ? <td>{o.name}</td> : <td style={{ fontWeight: 'bold' }}>{o.name}</td>}
                <td />
                <td>{o.inCharge}</td>
                <td>{o.join}</td>
                <td>{o.support}</td>
                <td>{o.start_date}</td>
                <td>{o.end_date}</td>
                <td />
                <td />
                <td>{o.dayLater}</td>
                <td>{o.datePlan + 1}</td>
                <td />
              </tr>
            ));
            return x.concat(y);
          })}
          <tr style={{ background: '#90ea90e6', fontWeight: 'bold' }}>
            {Array.from({ length: 15 }, (v, u) => (
              <td>{u == 0 ? 'C' : u == 3 ? 'HÀNH CHÍNH QUY TRÌNH' : null}</td>
            ))}
          </tr>

          {data.otherWork.map(i => (
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
              <td style={{ textAlign: 'center' }}>{i.dayLater}</td>
              <td style={{ textAlign: 'center' }}>{i.datePlan + 1}</td>
              <td />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
