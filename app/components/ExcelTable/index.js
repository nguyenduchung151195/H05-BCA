import moment from 'moment';
import React from 'react';

function ProcessTask(item) {
  let date;
  let total;
  if (item.finishDate) {
    if (new Date(item.finishDate) > new Date(item.endDate)) {
      date = ((new Date(item.finishDate) - new Date(item.endDate)) / 3600000).toFixed(2);
      const date2 = Number(date) / 24;
      const date3 = Math.floor(date2);
      const date4 = Number(((date2 - date3) * 24).toFixed());
      total = `Trễ ${date3} ngày ${date4} giờ`;
    } else {
      date = ((new Date(item.endDate) - new Date(item.finishDate)) / 3600000).toFixed(2);
      const date2 = Number(date) / 24;
      const date3 = Math.floor(date2);
      const date4 = Number(((date2 - date3) * 24).toFixed());
      total = `Sớm ${date3} ngày ${date4} giờ`;
    }
  } else {
    // eslint-disable-next-line no-lonely-if
    if (new Date(item.endDate) > new Date()) {
      date = ((new Date(item.endDate) - new Date()) / 3600000).toFixed(2);
      const date2 = Number(date) / 24;
      const date3 = Math.floor(date2);
      const date4 = Number(((date2 - date3) * 24).toFixed());
      total = `Còn ${date3} ngày ${date4} giờ`;
    } else {
      date = ((new Date() - new Date(item.endDate)) / 3600000).toFixed(2);
      const date2 = Number(date) / 24;
      const date3 = Math.floor(date2);
      const date4 = Number(((date2 - date3) * 24).toFixed());
      total = `Quá ${date3} ngày ${date4} giờ`;
    }
  }

  return total;
}
export default function (props) {
  const { data, columns } = props;
  // const { backlog = [], group = [], otherWork = [] } = data;

  function formatDate(date) {
    return moment(date).format('HH:mm DD/MM/YYYY');
  }
  function getTaskStatus(taskStatus) {
    if (!taskStatus) return null;
    if (Object.keys(columns)) {
      const statusObj = columns.find(it => it.type == taskStatus);
      return statusObj && statusObj.name;
    }
    return null

  }
  // console.log(1, data, columns)
  return (
    <table id="excel-table-instance" style={{ display: 'none' }} className="border_table">
      <thead>
        <tr style={{ background: '#959a95' }}>
          <th rowSpan={2}> STT</th>
          <th rowSpan={2}>Mã DA/CV</th>
          {/* <th rowSpan={2}>Mã công việc</th> */}
          <th rowSpan={2}>Nội dung công việc</th>
          {/* <th rowSpan={2}>Giá trị DA</th> */}
          <th rowSpan={2}>Nhân sự quản lý DA</th>
          <th rowSpan={2}>Nhân sự phụ trách DA</th>
          <th rowSpan={2}>Nhân sự tham gia</th>
          <th rowSpan={2}>Nhân sự hỗ trợ</th>
          <th colSpan={2}>Thời gian thực hiên</th>
          {/* <th rowSpan={2}>Phân bổ theo KH Quý</th> */}
          {/* <th rowSpan={2}>Tồn đọng </th> */}
          <th rowSpan={2}>Tiến độ %</th>
          <th rowSpan={2}>Trạng thái</th>
          {/* <th rowSpan={2}>Tổng ngày thực hiện theo KH</th> */}
          {/* <th rowSpan={2}>Thực tế thực hiện</th> */}
        </tr>
        <tr style={{ background: '#959a95' }}>
          <th> BĐ</th>
          <th> KT</th>
        </tr>
      </thead>
      <tbody>
        {/* <tr style={{ textAlign: 'center' }}>
          {Array.from({ length: 15 }, (v, u) => (
            <td>{u + 1}</td>
          ))}
        </tr>
        <tr style={{ background: '#90ea90e6', fontWeight: 'bold' }}>
          {Array.from({ length: 15 }, (v, u) => (
            <td>{u == 0 ? 'A' : u == 3 ? 'NHÓM TỒN ĐỌNG' : null}</td>
          ))}
        </tr> */}
        {Array.isArray(data) && data.map((i, index) => (
          <tr>
            <td >{index + 1}</td>
            {/* <td /> */}
            <td>{i.code ? i.code : null}</td>
            {i.parentId ? <td>{i.name}</td> : <td style={{ fontWeight: 'bold' }}>{i.name}</td>}
            {/* <td /> */}
            <td>{i.taskManager.map(it => it.name).join()}</td>
            <td>{i.inCharge.map(it => it.name).join()}</td>
            <td>{i.join.map(it => it.name).join()}</td>
            <td>{i.support.map(it => it.name).join()}</td>
            <td>{formatDate(i.startDate)}</td>
            <td>{formatDate(i.endDate)}</td>
            <td >
              {`${i.progress}% - ${ProcessTask(i)}`}
            </td>
            {/* <td /> */}
            {/* <td>{i.dayLater}</td>
            <td>{i.datePlan + 1}</td> */}
            <td >
              {getTaskStatus(i.taskStatus)}
            </td>
          </tr>
        ))}
        {/* <tr style={{ background: '#90ea90e6', fontWeight: 'bold' }}>
          {Array.from({ length: 15 }, (v, u) => (
            <td>{u == 0 ? 'B' : u == 3 ? 'NHÓM DỰ ÁN' : null}</td>
          ))}
        </tr>

        {Object.keys(group).map((i, v) => {
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

          const y = group[i].map(o => (
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

        {otherWork.map(i => (
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
        ))} */}
      </tbody>
    </table>
  )
}