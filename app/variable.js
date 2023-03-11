/* eslint-disable no-undef */
import moment from 'moment';
import {
  printGroupSaleClosure,
  printSaleOffer,
  addressPoint,
  destinationPoint,
  getCustomer,
  getAddress,
  getPhone,
  getTax,
  getBank,
  getRepresent,
  getPosition,
  printGroupTask,
  printUndertakingPerson,
  printSupervisor,
  getIncharge,
  getJoin,
  getViewable,
  getApproved,
  printQuotation,
  printCustomerInfo,
  printName,
  getNameByApi,
  printTable,
  printCode,
  printPall,
  printRate,
  printProduct,
  contentTable,
  organizationPlanTable,
  personPlanTable,
  contentTableBook,
  contentTableBookNormal,
  contentTableBookInPrivate,
  contentTableBookInNormal,
} from './helper';

export const showMap = false;


export const appointments = [
  {
    title: 'Customer Workshop',
    startDate: new Date(2018, 6, 1),
    endDate: new Date(2018, 6, 2),
    allDay: true,
    id: 39,
    location: 'Room 1',
    priorityId: 1,
  },
];

export const priorities = [
  {
    id: 0,
    title: 'Low',
  },
  {
    id: 1,
    title: 'Medium',
  },
  {
    id: 2,
    title: 'High',
  },
];

// template
export const fieldColumns = [
  // { name: '_id', title: 'ID', checked: false },
  { name: 'name', title: 'Tên', checked: true },
  { name: 'fields', title: 'Các trường', checked: true },
  { name: 'code', title: 'Module', checked: true },
  // { name: 'categoryDynamicForm', title: 'Loại văn bản', checked: true },
  // { name: 'createdAt', title: 'Ngày tạo', checked: true },
];

export const templateTypeColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'title', title: 'Tiêu đề', checked: true },
  { name: 'code', title: 'Mã', checked: true },
  // { name: 'categoryDynamicForm', title: 'Loại văn bản', checked: true },
  { name: 'createdAt', title: 'Ngày tạo', checked: true },
];

export const customers = [
  { label: 'NGUYEN VAN A', value: 1 },
  { label: 'NGUYEN VAN B', value: 2 },
  { label: 'NGUYEN VAN C', value: 3 },
  { label: 'NGUYEN VAN D', value: 4 },
  { label: 'NGUYEN VAN E', value: 5 },
  { label: 'NGUYEN VAN F', value: 6 },
];

// CRM Location
export const locationColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'code', title: 'ID', checked: true },
  { name: 'sort', title: 'Sắp xếp', checked: true },
  { name: 'type', title: 'Kiểu', checked: true },
  { name: 'name', title: 'Name', checked: true },
  { name: 'edit', title: 'Sửa', checked: true },
];

// CRM Tax
export const taxColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'name', title: 'Tên/miêu tả', checked: true },
  { name: 'code', title: 'Các mức thuế', checked: true },
  { name: 'updatedAt', title: 'Đã tạo vào', checked: true },
  { name: 'edit', title: 'Sửa', checked: true },
];
export const taxVATColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'name', title: 'Tên', checked: true },
  { name: 'exchangeRate', title: 'Tỷ giá', checked: true },
  { name: 'effective', title: 'Có hiệu lực', checked: true },
  { name: 'classify', title: 'Phân Loại', checked: true },
  { name: 'edit', title: 'Sửa', checked: true },
];


// Lịch sử Tiến độ Dự án
export const historyColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'index', title: 'STT', checked: true },
  { name: 'taskId.name', title: 'Tên công việc', checked: true },
  { name: 'progress', title: 'Tiến độ', checked: true },
  { name: 'taskStatus', title: 'Tình trạng', checked: true },
  { name: 'priority', title: 'Ưu tiên', checked: true },
  { name: 'updatedBy.name', title: 'Người thay đổi', checked: true },
  { name: 'updatedAt', title: 'Ngày cập nhật', checked: true },
  { name: 'note', title: 'Ghi chú', checked: true },
];
// Phê duyệt Tiến độ Dự án
export const approvedColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'index', title: 'STT', checked: true },
  { name: 'name', title: 'Tên dự án', checked: true },
  { name: 'taskStatus', title: 'Trạng thái', checked: true },
  { name: 'pheduyet', title: 'Phê duyệt', checked: true },
  { name: 'dateFinish', title: 'Thời gian hoàn thành', checked: true },
  { name: 'dateApproved', title: 'Thời gian phê duyệt', checked: true },
  { name: 'approved', title: 'Người phê duyệt', checked: true },
];
// Tiến độ Dự án
export const progressColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'name', title: 'Tên công việc', checked: true },
  { name: 'progress', title: 'Tiến độ', checked: true },
  { name: 'taskStatus', title: 'Tình trạng', checked: true },
  { name: 'priority', title: 'Ưu tiên', checked: true },
  { name: 'approved', title: 'Người phụ trách', checked: true },
  { name: 'join', title: 'Người tham gia', checked: true },
  { name: 'startDate', title: 'Ngày bắt đầu', checked: true },
  { name: 'endDate', title: 'Ngày kết thúc', checked: true },
  { name: 'desHtml', title: 'Mô tả chi tiết', checked: true },
];
// người thay thế/chuyen cong viec Dự án
export const replaceColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'tranferEmployees', title: 'Người thay thế', checked: true },
  { name: 'currentEmployees', title: 'Người bị thay thế', checked: true },
  { name: 'createdAt', title: 'Thời gian', checked: true },
];
// Danh sách công việc đang thực hiện

// Email - SMS
export const EmaiColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'index', title: 'STT', checked: true },
  { name: 'title', title: 'Biểu mẫu mail', checked: true },
  { name: 'code', title: 'Mã', checked: true },
];

export const EmailReportCols = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'campaignId.name', title: 'Tên chiến dịch', checked: true, width: 200 },
  { name: 'subject', title: 'Tiêu đề', checked: true, width: 200 },
  { name: 'employee.name', title: 'Người gửi', checked: true, width: 200 },
  { name: 'updatedAt', title: 'Ngày gửi', checked: true, width: 150 },
  { name: 'campaignId.template.title', title: 'Biểu mẫu', checked: true },
  { name: 'status', title: 'Trạng thái', checked: true },
  { name: 'error', title: 'Mã lỗi', checked: true, width: 200 },
];

export const logNames = {
  UPDATE: 'update',
  VIEW: 'view',
  MESSAGE: 'message',
  REMINDER: 'Reminder',
  MEETING: 'Meeting',
  VISIT: 'Visit',
  TASK: 'task',
};
// dự toán chi phí chi tiết trong cơ hội kinh doanh, trao doi thoa thuan
export const expensesDetail = [
  { name: 'add', title: 'Hành động', checked: true },
  { name: 'code', title: 'Mã', checked: true },
  { name: 'name', title: 'Tên', checked: true },
  { name: 'businessOpportunities', title: 'Cơ hội kinh doanh', checked: true },
  { name: 'exchangingAgreement', title: 'Trao đổi thỏa thuận', checked: true },
  { name: 'salesQuotation', title: 'salesQuotation', checked: true },
  { name: '_id', title: 'ID', checked: false },
];

export const taskStatusArr = ['Chưa thực hiện', 'Đang thực hiện', 'Hoàn thành', 'Đóng', 'Tạm dừng', 'Không thực hiện'];

export const categoryTaskArr = ['Bán hàng ( Mở rộng thị trường)', 'Công việc hành chính', 'Công việc thi công', 'Công việc bảo hành'];
// bo tieu chi tron KPI
export const criteriaColumns = [
  // { name: '_id', title: 'ID', checked: false },
  // { name: 'ratio', title: 'Tỷ trọng', checked: true },
  { name: 'criterionType', title: 'Bộ tiêu chí', checked: true },
  { name: 'name', title: 'Tiêu chí', checked: true },
  { name: 'formula', title: 'Công thức tính', checked: true },
  { name: 'expected', title: 'Kỳ vọng', checked: true },
  { name: 'unit', title: 'Đơn vị đo', checked: true },
  { name: 'frequency', title: 'Tần suất đo', checked: true },
  { name: 'ranges', title: 'Phạm vi', checked: true },
  { name: 'order', title: 'Thứ tự', checked: true },
  { name: 'use', title: 'Sử dụng', checked: true },
  { name: 'note', title: 'Ghi chú', checked: true },
];
// KPI ca nhan
export const kpiPersonColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'index', title: 'STT', checked: true },
  { name: 'name', title: 'Tên dự án', checked: true },
  { name: 'code', title: 'Mã KPI', checked: true },
  { name: 'codeProject', title: 'Mã dự án', checked: true },
  { name: 'customer', title: 'Khách hàng', checked: true },
  { name: 'status', title: 'Trang thái', checked: true },
  { name: 'join', title: 'Tần suất đo', checked: true },
  { name: 'action', title: 'Thao tác', checked: true },
  { name: 'delete', title: 'Xóa', checked: true },
];

export const priorityArr = ['Rất cao', 'Cao', 'Trung bình', 'Thấp', 'Rất thấp'];

// KPI loai pham vi
export const kpiTypeColumns = [
  'Sơ đồ tổ chức công ty',
  'Khách hàng',
  'Nhà cung cấp',
  'Danh mục sản phẩm trong kho',
  'Danh mục cấu hình CMR',
  'Sản phẩm và nhóm sản phẩm',
  'Nhân viên',
  // 'Chức vụ',
];

// KPI loai cong thuc
export const kpiFormulaColumns = [
  'Tổng doanh số theo nhân viên,phòng ban công ty',
  // 'Nhóm sản phẩm số đơn hàng thành công/thất bại',
  'Khách hàng mới',
  // 'Số lần tương tác với khách hàng',
  // 'Tổng chi phí cho 1 nhân sự,1 phòng',
  'Nhập công thức',
  'Theo tiêu chí chuẩn',
];

// KPI loai quy trinh
export const kpiProcessTypeColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'index', title: 'STT', checked: true },
  { name: 'code', title: 'Mã loại quy trình', checked: true },
  { name: 'name', title: 'Tên loại quy trình', checked: true },
  { name: 'method', title: 'Phương pháp', checked: true },
  // { name: 'process', title: 'Quy trình', checked: true },
];

// KPI quy trinh Danh gia
export const kpiProcessColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'code', title: 'Mã loại quy trình', checked: true },
  { name: 'name', title: 'Tên loại quy trình', checked: true },
  { name: 'processType', title: 'Loại quy trình', checked: true },
];

// KPI quan ly nhom Danh gia
export const kpiEvaluateGroupColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'code', title: 'Mã nhóm', checked: true },
  { name: 'name', title: 'Tên nhóm', checked: true },
  { name: 'nameTA', title: 'Tên TA', checked: true },
  { name: 'startDate', title: 'Ngày bắt đầu đánh giá', checked: true },
  { name: 'endDate', title: 'Ngày kết thúc đánh giá', checked: true },
  { name: 'startDateDetail', title: 'Ngày bắt đầu nhập chỉ tiêu', checked: true },
  { name: 'endDateDetail', title: 'Ngày kết thúc nhập chỉ tiêu', checked: true },
  { name: 'target', title: 'Có thiết lập mục tiêu', checked: true },
  { name: 'evaluate', title: 'Có tự đánh giá', checked: true },
  { name: 'active', title: 'Sử dụng', checked: true },
];

// KPI Bản đánh giá
export const kpiReviewColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'employee', title: 'Nhân viên', checked: true },
  { name: 'processType', title: 'Loại đánh giá', checked: true },
  { name: 'process', title: 'Quy trình đánh giá', checked: true },
  { name: 'startDate', title: 'Ngày bắt đầu ', checked: true },
  { name: 'endDate', title: 'Ngày kết thúc ', checked: true },
  { name: 'finishDate', title: 'Hạn hoàn thành đánh giá', checked: true },
];

// KPI Bang quy doi diem so
export const kpiExchangeColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'frequency', title: 'Tần suất', checked: true },
  { name: 'unit', title: 'Đơn vị đo', checked: true },
  { name: 'coefficient', title: 'Hệ số KPI', checked: true },
  { name: 'tendency', title: 'Xu hướng', checked: true },
  // { name: 'points', title: 'Điểm đánh giá', checked: true },
];

// KPI cau hinh he so K
export const kpiConfigColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'name', title: 'Tên công thức', checked: true },
  { name: 'code', title: 'Mã công thức', checked: true },
  { name: 'formula', title: 'Công thức K', checked: true },
  { name: 'range', title: 'Phạm vi', checked: true },
  { name: 'module', title: 'Mã Module', checked: true },
];
export const taskStageArr = [
  'Giai đoạn thông tin thị trường, chốt chủ trương',
  'Giai đoạn tiền dự án',
  'Dự Án GĐ Đang Thi Công',
  'Dự Án GĐ Chuẩn Bị Thi Công',
  'Dự Án Giai Đoạn Nghiệm Thu',
  'Dự Án Giai Đoạn Thu Hồi Công Nợ',
];

export const campaignEmailColums = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'index', title: 'STT', checked: true },
  { name: 'name', title: 'Tên chiến dịch', checked: true },
  { name: 'title', title: 'Tiêu đề gửi Email', checked: true },
  { name: 'senderName', title: 'Người gửi, nhóm gửi', checked: true },
  // { name: 'receiver', title: 'Người nhận, nhóm nhận', checked: true },
  { name: 'timer', title: 'Thời gian gửi', checked: true },
  { name: 'repeat', title: 'Lặp lại', checked: true },
  { name: 'active', title: 'Đang hoạt động', checked: true },
];


export const extraFields = [
  {
    code: 'SalesQuotation',
    data: [
      { name: 'PRODUCT_GROUP', type: 'extra', title: 'BẢNG NHÓM SẢN PHẨM', function: printGroupSaleClosure() },
      { name: 'PRODUCT_GROUP_EN', type: 'extra', title: 'BẢNG NHÓM SẢN PHẨM', function: printGroupSaleClosure('en') },
      { name: 'SALES_VINCAS', type: 'extra', title: 'Bao gia Vincas', function: printQuotation },
      { name: 'SALES_PALL', type: 'extra', title: 'Bao gia PALL', function: printPall },
      { name: 'RATE', type: 'extra', title: 'Tỷ giá ngoại tệ', function: printRate },
    ],
  },
  {
    code: 'CostEstimate',
    data: [
      { name: 'SALE_OFFER', type: 'extra', title: 'MẪU ĐỀ XUẤT BÁN HÀNG', function: printSaleOffer },
      { name: 'DELIVERY_POINT', type: 'extra', title: 'ĐIỂM GIAO HÀNG', function: addressPoint },
      { name: 'DENTINATION_POINT', type: 'extra', title: 'ĐIỂM NHẬN HÀNG', function: destinationPoint },
    ],
  },
  {
    code: 'Stock',
    data: [{ name: 'Product_Pall', type: 'extra', title: 'BIỂU MẪU SẢN PHẨM PALL', function: printProduct }],
  },
  {
    code: 'Contract',
    data: [
      { name: 'CUSTOMER_NAME', type: 'extra', title: 'TÊN KHÁCH HÀNG', function: getCustomer },
      { name: 'ADDRESS', type: 'extra', title: 'ĐỊA CHỈ', function: getAddress },
      { name: 'PHONENUMBER', type: 'extra', title: 'SỐ ĐIỆN THOẠI', function: getPhone },
      { name: 'TAXCODE', type: 'extra', title: 'MÃ SỐ THUẾ', function: getTax },
      { name: 'BANKACCCOUNTNUMBER', type: 'extra', title: 'TÀI KHOẢN', function: getBank },
      { name: 'REPRESENTNAME', type: 'extra', title: 'ĐẠI DIỆN', function: getRepresent },
      { name: 'POSITION', type: 'extra', title: 'CHỨC VỤ', function: getPosition },
      // { name: 'DOB', type: 'extra', title: 'Ngày sinh', function: getDob },
      // { name: 'CARDNUMBER', type: 'extra', title: 'CMTND', function: getCard },
      // { name: 'GENDER', type: 'extra', title: 'GIỚI TÍNH', function: getGender },
    ],
  },

  {
    code: 'Task',
    data: [
      { name: 'TASK_GROUP', type: 'extra', title: 'BẢNG NHÓM DỰ ÁN', function: printGroupTask },
      { name: 'INCHARGE', type: 'extra', title: 'NGƯỜI PHỤ TRÁCH', function: getIncharge },
      { name: 'JOIN', type: 'extra', title: 'NGƯỜI THAM GIA', function: getJoin },
      { name: 'VIEWABLE', type: 'extra', title: 'NGƯỜI ĐƯỢC XEM', function: getViewable },
      { name: 'APPROVED', type: 'extra', title: 'NGƯỜI PHÊ DUYỆT', function: getApproved },
    ],
  },
  {
    code: 'ExchangingAgreement',
    data: [
      { name: 'UNDERTAKING_PERSON', type: 'extra', title: 'NGƯỜI CHỐT CHỦ TRƯƠNG', function: printUndertakingPerson },
      { name: 'SUPERVISOR', type: 'extra', title: 'THEO DÕI DỰ ÁN', function: printSupervisor },
    ],
  },
  {
    code: 'BusinessOpportunities',
    data: [{ name: 'CUSTOMER_INFO', type: 'extra', title: 'THÔNG TIN KH', function: printCustomerInfo }],
  },
  {
    code: 'Customer',
    data: [
      { name: 'NAME', type: 'extra', title: 'TÊN DỰ ÁN', function: printName },
      { name: 'CODE', type: 'extra', title: 'Mã DỰ ÁN', function: printCode },
    ],
  },
  {
    code: 'InsuranceInformation',
    data: [
      { name: 'NAME', type: 'extra', title: 'Tên doanh nghiệp', function: getNameByApi },
      { name: 'ADDRESS', type: 'extra', title: 'Địa chỉ', function: getAddress },
      { name: 'PHONENUMBER', type: 'extra', title: 'Số điện thoại', function: getPhone },
      { name: 'CODE', type: 'extra', title: 'Mã số thuế', function: getCustomer },
      { name: 'TABLE', type: 'extra', title: 'Tình hình sử dụng lao động', function: printTable },
    ],
  },
  {
    code: 'PersonPlan',
    data: [
      { name: 'personPlanTable', title: 'Nội dung bảng', function: data => personPlanTable({ data: data }) },
      {
        name: 'endTime',
        title: 'Đến ngày',
        function: data => {
          return data && data.timeEnd ? moment(data.timeEnd).format('DD/MM/YYYY') : '';
        },
      },
      {
        name: 'startTime',
        title: 'Từ ngày',
        function: data => {
          return data && data.timeStart ? moment(data.timeStart).format('DD/MM/YYYY') : '';
        },
      },
      {
        name: 'todayDate',
        title: 'Ngày',
        function: () => moment().format('D'),
        // .date(),
      },
      {
        name: 'todayMonth',
        title: 'Tháng',
        function: () => moment().format('M'),
        // .month(),
      },
      {
        name: 'todayYear',
        title: 'Năm',
        function: () => moment().format('YYYY'),
        // .year(),
      },
      {
        name: 'cuc_info',
        title: 'Tên cục',
        function: () => {
          const cuc_info = (JSON.parse(localStorage.getItem('crmSource')).find(i => i.code === 'cuc cong nghe thong tin') || {}).data;
          return cuc_info && cuc_info[0] && cuc_info[0].title;
        },
      },
      {
        name: 'number',
        title: 'Số cục',
        function: () => {
          const number = (JSON.parse(localStorage.getItem('crmSource')).find(i => i.code === 'so') || {}).data;
          return number && number[0] && number[0].title;
        },
      },
      {
        name: 'createdBy',
        title: 'Tên người tạo',
        function: data => {
          return data && data['createdBy.name'] ? data['createdBy.name'] : '';
        },
      },
      {
        name: 'name',
        title: 'Tên kế hoạch',
        function: data => {
          return data && data.name ? data.name : '';
        },
      },
    ],
  },
  {
    code: 'OrganizationPlan',
    data: [
      { name: 'organizationPlanTable', title: 'Nội dung bảng', function: data => organizationPlanTable({ data: data }) },
      {
        name: 'endTime',
        title: 'Đến ngày',
        function: data => {
          return data && data.timeEnd ? moment(data.timeEnd).format('DD/MM/YYYY') : '';
        },
      },
      {
        name: 'startTime',
        title: 'Từ ngày',
        function: data => {
          return data && data.timeStart ? moment(data.timeStart).format('DD/MM/YYYY') : '';
        },
      },
      {
        name: 'todayDate',
        title: 'Ngày',
        function: () => moment().format('D'),
        // .date(),
      },
      {
        name: 'todayMonth',
        title: 'Tháng',
        function: () => moment().format('M'),
        // .month(),
      },
      {
        name: 'todayYear',
        title: 'Năm',
        function: () => moment().format('YYYY'),
        // .year(),
      },
      {
        name: 'cuc_info',
        title: 'Tên cục',
        function: () => {
          const cuc_info = (JSON.parse(localStorage.getItem('crmSource')).find(i => i.code === 'cuc cong nghe thong tin') || {}).data;
          return cuc_info && cuc_info[0] && cuc_info[0].title;
        },
      },
      {
        name: 'number',
        title: 'Số cục',
        function: () => {
          const number = (JSON.parse(localStorage.getItem('crmSource')).find(i => i.code === 'so') || {}).data;
          return number && number[0] && number[0].title;
        },
      },
      {
        name: 'organizationUnitName',
        title: 'Tên đơn vị',
        function: data => {
          return data.organizationUnitName || '';
        },
      },
      {
        name: 'name',
        title: 'Tên kế hoạch',
        function: data => {
          return data && data.name ? data.name : '';
        },
      },
    ],
  },
  {
    code: 'Calendar',
    data: [
      {
        name: 'startTime',
        title: 'Thời gian bắt đầu',
        function: () =>
          moment(localStorage.getItem('datePicker'))
            .startOf('weeks')
            .format('DD/MM/YYYY'),
      },
      {
        name: 'endTime',
        title: 'Thời gian kết thúc',
        function: () =>
          moment(localStorage.getItem('datePicker'))
            .endOf('weeks')
            .format('DD/MM/YYYY'),
      },
      { name: 'todayDate', title: 'Ngày hôm nay', function: () => moment().format('DD') },
      { name: 'todayMonth', title: 'Tháng hôm nay', function: () => moment().format('MM') },
      { name: 'todayYear', title: 'Năm hôm nay', function: () => moment().format('YYYY') },
      { name: 'contentTable', title: 'Nội dung bảng', function: data => contentTable({ data: data }) },
      {
        name: 'duty',
        title: 'Đồng chí trực',
        function: () => {
          const duty = (JSON.parse(localStorage.getItem('crmSource')).find(i => i.code === 'truc chi huy') || {}).data;
          return duty && duty[0] && duty[0].title;
        },
      },
      {
        name: 'receive1',
        title: 'Nơi nhận1',
        function: () => {
          const receive = (JSON.parse(localStorage.getItem('crmSource')).find(i => i.code === 'noi nhan lich tuan') || {}).data;
          return receive && receive[0] && receive[0].title;
        },
      },
      {
        name: 'receive2',
        title: 'Nơi nhận2',
        function: () => {
          const receive = (JSON.parse(localStorage.getItem('crmSource')).find(i => i.code === 'noi nhan lich tuan') || {}).data;
          return receive && receive[1] && receive[1].title;
        },
      },
      {
        name: 'receive3',
        title: 'Nơi nhận3',
        function: () => {
          const receive = (JSON.parse(localStorage.getItem('crmSource')).find(i => i.code === 'noi nhan lich tuan') || {}).data;
          return receive && receive[2] && receive[2].title;
        },
      },
      {
        name: 'receive4',
        title: 'Nơi nhận4',
        function: () => {
          const receive = (JSON.parse(localStorage.getItem('crmSource')).find(i => i.code === 'noi nhan lich tuan') || {}).data;
          return receive && receive[3] && receive[3].title;
        },
      },
      {
        name: 'signer1',
        title: 'Chức vụ ký 1',
        function: () => {
          const signer1 = (JSON.parse(localStorage.getItem('crmSource')).find(i => i.code === 'chuc vu ky') || {}).data;
          return signer1 && signer1[0] && signer1[0].title;
        },
      },
      {
        name: 'signer2',
        title: 'Chức vụ ký 2',
        function: () => {
          const signer2 = (JSON.parse(localStorage.getItem('crmSource')).find(i => i.code === 'chuc vu ky') || {}).data;
          return signer2 && signer2[1] && signer2[1].title;
        },
      },
      {
        name: 'signer3',
        title: 'Chức vụ ký 3',
        function: () => {
          const signer2 = (JSON.parse(localStorage.getItem('crmSource')).find(i => i.code === 'chuc vu ky') || {}).data;
          return signer2 && signer2[2] && signer2[2].title;
        },
      },
      {
        name: 'nameSigner',
        title: 'Tên người ký',
        function: () => {
          const nameSigner = (JSON.parse(localStorage.getItem('crmSource')).find(i => i.code === 'nguời ky') || {}).data;
          return nameSigner && nameSigner[0] && nameSigner[0].title;
        },
      },
      {
        name: 'cuc_info',
        title: 'Tên cục',
        function: () => {
          const cuc_info = (JSON.parse(localStorage.getItem('crmSource')).find(i => i.code === 'cuc cong nghe thong tin') || {}).data;
          return cuc_info && cuc_info[0] && cuc_info[0].title;
        },
      },
      {
        name: 'number',
        title: 'Số cục',
        function: () => {
          const number = (JSON.parse(localStorage.getItem('crmSource')).find(i => i.code === 'so') || {}).data;
          return number && number[0] && number[0].title;
        },
      },
    ],
  },
  {
    code: 'IncommingDocument',
    data: [
      {
        name: 'TICKET_NOTE',
        title: 'Nội dung đề xuất ',
        function: data => {
          return data ? (data.ticketNote ? data.ticketNote : ' ') : ' ';
        },
      },
      {
        name: 'TICKET_USERNAME',
        title: 'Tên cán bộ',
        function: data => {
          return data ? (data.ticketUsername ? data.ticketUsername : ' ') : ' ';
        },
      },
      {
        // , type: 'extra'
        name: 'TICKET_DATEPRINT',
        title: 'Ngày in phiếu',
        function: () => {
          return moment().format('DD/MM/YYYY');
        },
      },
      {
        // , type: 'extra'
        name: 'toBookCodeNumber',
        title: 'Số đến',
        function: (data) => {
          const { toBookCode } = data
          let toBookCodeNumber = ""
          if (toBookCode) {
            const list = toBookCode.split('/');
            toBookCodeNumber = list.slice(-1)[0]
          }
          return toBookCodeNumber;
        },
      },


      // in sổ văn bản
      {
        // , type: 'extra'
        name: 'date',
        title: 'Ngày in',
        function: () => {
          return moment().format('DD');
        },
      },

      {
        // , type: 'extra'
        name: 'month',
        title: 'Tháng in',
        function: () => {
          return moment().format('MM');
        },
      },
      {
        // , type: 'extra'
        name: 'year',
        title: 'Năm in',
        function: () => {
          return moment().format('YYYY');
        },
      },
      {
        // , type: 'extra'
        name: 'nameOfBook',
        title: 'Tên sổ vb',
        function: () => {
          console.log(localStorage.getItem('nameOfBook'), 'bshdbv')
          return localStorage.getItem('nameOfBook') || ""
        },
      },
      {
        // , type: 'extra'
        name: 'datePrint',
        title: 'Ngày in',
        function: (data) => {
          console.log(data, 'data')
          const startDate = localStorage.getItem('startDate') ? `Từ ngày: ${localStorage.getItem('startDate')}` : ""
          const endDate = localStorage.getItem('endDate') ? `Từ ngày: ${localStorage.getItem('endDate')}` : ""
          return `${startDate} ${endDate}`;
        },
      },
      {
        // , type: 'extra'
        name: 'subordinateUnit',
        title: 'Đơn vị trực thuộc',
        function: () => {
          const unitConfig = localStorage.getItem('unitConfig') ? JSON.parse(localStorage.getItem('unitConfig')) : {}
          return unitConfig.subordinateUnit || ""
        },
      },
      {
        // , type: 'extra'
        name: 'hostUnit',
        title: 'Đơn vị chủ quản',
        function: () => {
          const unitConfig = localStorage.getItem('unitConfig') ? JSON.parse(localStorage.getItem('unitConfig')) : {}
          return unitConfig.hostUnit || ""
        },
      },
      {
        name: 'contentTable', title: 'Nội dung bảng', function: data => {
          const typecode = localStorage.getItem('templateCode') || ""
          let idx = typecode.indexOf('_')
          let typeDocPrint = typecode.slice(idx + 1) || ""
          idx = typeDocPrint.indexOf('_')
          typeDocPrint = typeDocPrint.slice(0, idx) || ""
          console.log(typecode, typeDocPrint, "idx")
          if (typeDocPrint === "mat") {
            return contentTableBookInPrivate({ data: data })
          } else {
            return contentTableBookInNormal({ data: data })
          }

          // contentTableBook({ data: data })
        }
      },


    ],
  },

  {
    code: 'OutGoingDocument',
    data: [



      // in sổ văn bản
      {
        // , type: 'extra'
        name: 'date',
        title: 'Ngày in',
        function: () => {
          return moment().format('DD');
        },
      },

      {
        // , type: 'extra'
        name: 'month',
        title: 'Tháng in',
        function: () => {
          return moment().format('MM');
        },
      },
      {
        // , type: 'extra'
        name: 'year',
        title: 'Năm in',
        function: () => {
          return moment().format('YYYY');
        },
      },
      {
        // , type: 'extra'
        name: 'nameOfBook',
        title: 'Tên sổ vb',
        function: () => {
          console.log(localStorage.getItem('nameOfBook'), 'bshdbv')
          return localStorage.getItem('nameOfBook') || ""
        },
      },
      {
        // , type: 'extra'
        name: 'datePrint',
        title: 'Ngày in',
        function: (data) => {
          const startDate = localStorage.getItem('startDate') ? `Từ ngày: ${localStorage.getItem('startDate')}` : ""
          const endDate = localStorage.getItem('endDate') ? `Từ ngày: ${localStorage.getItem('endDate')}` : ""
          return `${startDate} ${endDate}`;
        },
      },
      {
        name: 'contentTable', title: 'Nội dung bảng', function: data => {
          const typecode = localStorage.getItem('templateCode') || ""
          let idx = typecode.indexOf('_')
          let typeDocPrint = typecode.slice(idx + 1) || ""
          idx = typeDocPrint.indexOf('_')
          typeDocPrint = typeDocPrint.slice(0, idx) || ""
          if (typeDocPrint === "mat") {
            return contentTableBook({ data: data })
          } else {
            return contentTableBookNormal({ data: data })
          }
        }
      },


    ],
  },
];

// KPI Du an
export const kpiProjectColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'taskCode', title: 'Mã dự án', checked: true },
  { name: 'code', title: 'Mã KPI', checked: true },
  { name: 'employees', title: 'Nhân viên', checked: true },
  { name: 'status', title: 'Trang thái', checked: true },
  { name: 'state', title: 'Trạng thái phê duyệt', checked: true },
];

// Lịch
// export const calendarColumns = [
//   { name: '_id', title: 'ID', checked: false },
//   { name: 'name', title: 'Lịch', checked: true },
//   { name: 'typeCalendar', title: 'Loại', checked: true },
//   { name: 'people', title: 'Người tham gia', checked: true },
//   { name: 'organizer', title: 'Người tổ chức', checked: true },
//   { name: 'prepare', title: 'Người chuẩn bị', checked: true },
//   { name: 'date', title: 'Ngày họp', checked: true },
//   { name: 'timeStart', title: 'Thời gian bắt đầu', checked: true },
//   { name: 'timeEnd', title: 'Thời gian kết thúc', checked: true },
//   { name: 'kanbanStatus', title: 'Trạng thái', checked: true },
//   { name: 'roomMetting', title: 'Phòng họp', checked: true },
//   { name: 'address', title: 'Địa điểm', checked: true },
//   { name: 'prepareMeeting', title: 'Chuẩn bị cuộc họp', checked: true },
//   // { name: 'editcustom', title: 'Tạo Công việc', checked: true },
// ];

// Phong hop
export const meetingRoomColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'name', title: 'Tên phòng họp', checked: true },
  { name: 'address', title: 'Địa chỉ', checked: true },
  { name: 'acreage', title: 'Diện tích', checked: true },
  // { name: 'utilities', title: 'Tiện ích', checked: true },
];

export const provincialColumns = ['Khu vực phía Bắc', 'Khu vực phía Nam'];

// Bao cao tong hop cong no khach hang
export const liabilitiesColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'customer', title: 'Tên khách hàng', checked: true },
  { name: 'totalAmount', title: 'Tổng tiền', checked: true },
  { name: 'pay', title: 'Thanh toàn thực tế', checked: true },
  { name: 'totalDebt', title: 'Còn thiếu', checked: true },
  { name: 'completionRate', title: 'Tỷ lệ hoàn thành', checked: true },
  // { name: 'utilities', title: 'Deadline thanh toán', checked: true },
];


export const typeCustomer = [
  { value: 1, name: 'Khách hàng loại 1' },
  { value: 2, name: 'Khách hàng loại 2' },
  { value: 3, name: 'Khách hàng loại 3' },
];

export const typeEmployee = [{ value: 1, name: 'Nhân viên loại 1' }, { value: 2, name: 'Nhân viên loại 2' }, { value: 3, name: 'Nhân viên loại 3' }];
export const clientId = CLIENT;
export const isPort = ISPORTAL;

export const enableSso = ENABLE_SSO;
export const nameLocation = NAME_LOCATION;
export const emailSso = EMAIL;
export const portalSso = POTAL;
export const ssoHost = SSO_HOST;
export const allowedFileExts = ALLOW_FILE_EXT;
export const DriveId = '03_Driver';
// export const DriveId = 'DRIVE';


export const VIEWCONFIG_FILTER_FIELD_CONFIG = {
  Calendar: {
    columns: ['typeCalendar'],
    defaultFieldList: {
      typeCalendar: [
        {
          title: 'Lịch cá nhân',
          value: '1',
        },
        {
          title: 'Lịch đơn vị',
          value: '2',
        },
      ],
    },
  },
  TaskContract: {
    columns: ['typeContract'],
    defaultFieldList: {
      typeContract: [
        {
          title: 'HỢP ĐỒNG KHÁCH HÀNG',
          value: '1',
        },
        {
          title: 'HỢP ĐỒNG NHÀ CUNG CẤP',
          value: '2',
        },
      ],
    },
  },
};

export const svb = INSERT_SOVANBAN;
