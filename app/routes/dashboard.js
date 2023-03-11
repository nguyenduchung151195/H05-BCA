import ExecutiveDocuments from '../containers/ExecutiveDocuments';
import GoDocuments from '../containers/GoDocuments';
import ListOfDepartmentPage from 'containers/ListOfDepartmentPage/Loadable';
import AddUserPage from 'containers/AddUserPage/Loadable';
import UsersPage from 'containers/UsersPage/Loadable';
import PhoneBookPage from 'containers/PhoneBookPage/Loadable';
import RoleGroupPage from 'containers/RoleGroupPage';
import SystemConfigPage from 'containers/SystemConfigPage';
import { Widgets, DateRange, Settings, BusinessCenter, Assignment, Book } from '@material-ui/icons';
import AddRolesGroupPage from '../containers/AddRolesGroupPage';
import AddRolesGroupPortalPage from '../containers/AddRolesGroupPortalPage';
import CrmConfigPage from '../containers/CrmConfigPage';
import TemplatePage from '../containers/TemplatePage';
import TaskPage from '../containers/TaskPage/Loadable';
import AddTemplatePage from '../containers/AddTemplatePage/Loadable';
import AddTtPage from '../containers/AddTtPage/Loadable';
import HistotyLog from '../containers/UsersPage/HistoryLogin';
import TemplateTypePage from '../containers/TemplateTypePage';
import OrganizationalStructurePage from '../containers/OrganizationalStructurePage';
import TaskProgress from '../components/TaskProgress/Loadable';
import PersonalPage from '../containers/PersonalPage/Loadable';
import ImportPage from '../containers/ImportPage';
import EditProfilePage from '../containers/EditProfilePage';
import SampleProcess from '../containers/SampleProcess/Loadable';
import AddSampleProcess from '../containers/AddSampleProcess/Loadable';
import AddProjects from '../containers/AddProjects/Loadable';
import ConfigTask from '../containers/ConfigTask/Loadable';
import DashboardHome from '../containers/DashboardHome';
import AddMeetingSchedule from '../containers/AddMeetingSchedule/Loadable';
import MeetingRoom from '../containers/MeetingRoom/Loadable';
import FileManager from '../containers/FileManager';
import LifeDrive from '../containers/LifeDrive';


import MeetingCalendar from '../containers/MeetingPage';
import WorkingSchedule from '../containers/WorkingSchedule/Loadable';
import WorkingScheduleViewCalender from '../containers/WorkingSchedule/viewCalender';

import TimeKeeping from '../containers/TimeKeeping/Loadable';

import AddWorkingSchedule from '../containers/AddWorkingSchedule/Loadable';
import AddExecutiveDocuments from '../containers/AddExecutiveDocuments';
import EditExecutiveDocuments from '../containers/EditExecutiveDocuments';
import EditGoDocuments from '../containers/EditGoDocuments';
import EditPromulgate from '../containers/EditPromulgate';
import AddSignedDocument from '../containers/AddSignedDocument';

import AddPromulgate from '../containers/AddPromulgate';
import Authority from '../containers/Authority';
import Recall from '../containers/Recall';
import ProcessFlow from '../containers/ProcessFlow';
import AddProcessFlow from '../containers/AddProcessFlow';
import AddPlanProcess from '../containers/AddPlanProcess';
import TaskInvite from '../components/TaskInvite';
import EditMeetingPage from '../containers/EditMeetingPage';
import EditProjects from '../containers/EditProjects';
import EditWorkingSchedulePage from '../containers/EditWorkingSchedulePage';
import EditMeetingRoomPage from '../containers/EditMeetingRoomPage';
import PlanWorkingPage from '../containers/PlanWorkingPage/Loadable';
import PlanWorkingOrganization from '../containers/PlanWorkingOrganization/Loadable';
import BookDocument from '../containers/BookDocument/Loadable';
import AddPlanWorkingPerson from '../containers/AddPlanWorkingPerson/Loadable';
import AddPlanWorkingOrganization from '../containers/AddPlanWorkingOrganization/Loadable';
import ViewDetailBookDocument from '../containers/ViewDetailBookDocument/Loadable';
const dashRoutes = [
  {
    path: '/',
    name: 'dashboard',
    // icon: Dashboard,
    state: 'opemDashboard',
    extract: true,
    component: DashboardHome,
  },
  {
    path: '/BookDocument/add',
    name: 'Thêm mới sổ văn bản',
    state: 'openAddBookDocument',
    icon: Book,
    component: ViewDetailBookDocument,
    empty: true,
  },
  {
    path: '/BookDocument/:id',
    name: 'Xem chi tiết sổ văn bản',
    state: 'openAddBookDocument',
    icon: Book,
    component: ViewDetailBookDocument,
    empty: true,
  },

  {
    collapse: true,
    path: '/IncommingDocument',
    name: 'Văn bản điều hành',
    state: 'openIncomingDoc',
    dynamicNode: true,
    icon: Book,
    component: ExecutiveDocuments,
    defaultModuleCode: 'IncommingDocument',
    views: [
      {
        path: '/IncommingDocument',
        name: 'Văn bản đến',
        // mini: 'ICD',
        component: ExecutiveDocuments,
        moduleCode: 'IncommingDocument',
      },
      {
        path: '/IncommingDocument/add',
        name: 'Thêm văn bản đến',
        // mini: 'CV',
        component: AddExecutiveDocuments,
        moduleCode: 'IncommingDocument',
        hide: true,
      },

      {
        path: '/IncommingDocument/:id',
        name: 'Chỉnh sửa văn bản đến',
        // mini: 'CV',
        component: AddExecutiveDocuments,
        moduleCode: 'IncommingDocument',
        hide: true,
      },
      {
        path: '/incomming-document-detail/:id',
        name: 'Chi tiết văn bản đến',
        // mini: 'CV',
        component: EditExecutiveDocuments,
        moduleCode: 'IncommingDocument',
        hide: true,
      },
      {
        path: '/OutGoingDocument/editGoDocuments/:id',
        name: 'Chi tiết văn bản đi',
        // mini: 'CV',
        component: EditGoDocuments,
        moduleCode: 'OutGoingDocument',
        hide: true,
      },
      {
        path: '/OutGoingDocument/editPromulgate/:id',
        name: 'Chi tiết ban hành',
        // mini: 'CV',
        component: EditPromulgate,
        moduleCode: 'Documentary',
        hide: true,
      },
      {
        path: '/OutGoingDocument',
        name: 'Văn bản đi',
        // mini: 'CV',
        component: GoDocuments,
        moduleCode: 'OutGoingDocument',
      },
      {
        path: '/OutGoingDocument/add',
        name: 'Thêm văn bản đi',
        // mini: 'CV',
        component: AddSignedDocument,
        moduleCode: 'OutGoingDocument',
        hide: true,
      },
      {
        path: '/OutGoingDocument/:id',
        name: 'Sửa văn bản đi',
        // mini: 'CV',
        component: AddSignedDocument,
        moduleCode: 'OutGoingDocument',
        hide: true,
      },
      {
        path: '/ReleaseDocument/add',
        name: 'Thêm mới ban hành',
        // mini: 'CV',
        component: AddPromulgate,
        moduleCode: 'ReleaseDocument',
        hide: true,
      },
      {
        path: '/RecallDocument',
        name: 'Thu hồi',
        // mini: 'CV',
        component: Recall,
        moduleCode: 'RecallDocument',
      },
      {
        path: '/RecallDocument/:id',
        name: 'Thu hồi',
        // mini: 'CV',
        hide: true,
        component: EditExecutiveDocuments,
        // moduleCode: 'RecallDocument',
      },
      {
        path: '/AuthorityDocument',
        name: 'Ủy quyền',
        // mini: 'CV',
        component: Authority,
        moduleCode: 'AuthorityDocument',
      },
      {
        path: '/BookDocument',
        name: 'Sổ văn bản',
        state: 'openBookDocument',
        icon: Book,
        // mini: 'CV',
        component: BookDocument,
        moduleCode: 'BookDocument',
        views: [],
      },
      {
        path: '/DocumentProcessTemplate',
        name: 'Luồng quy trình',
        // mini: 'CV',
        component: ProcessFlow,
        moduleCode: 'DocumentProcessTemplate',
      },
      {
        path: '/DocumentProcessTemplate/:id',
        name: 'Thêm mới luồng quy trình',
        // mini: 'CV',
        component: AddProcessFlow,
        moduleCode: 'DocumentProcessTemplate',
        hide: true,
      },
      {
        path: '/DocumentConfig',
        component: CrmConfigPage,
        name: 'config',
        // mini: 'CF',
        moduleCode: 'DocumentConfig',
      },
    ],
  },
  {
    path: '/Task/PlanProcess/:id',
    name: 'Thêm mới quy trình lập kế hoạch',
    // mini: 'SP',
    component: AddPlanProcess,
    empty: true,
    hide: true,
  },
  {
    collapse: true,
    path: '/Task',
    name: 'Hồ sơ công việc',
    state: 'openTask',
    component: TaskPage,
    dynamicNode: true,
    defaultModuleCode: 'Task',
    icon: BusinessCenter,
    views: [
      {
        path: '/Task/TemplateTask',
        name: 'Quy trình thực hiện',
        // mini: 'SP',
        component: SampleProcess,
        moduleCode: 'TemplateTask',
      },
      {
        path: '/Task/TaskConfig',
        name: 'configtask',
        // mini: 'CF',
        component: ConfigTask,
        moduleCode: 'TaskConfig',
      },
      {
        path: '/Task/invite',
        name: 'Danh sách lời mời',
        // mini: 'SP',
        component: TaskInvite,
        hide: true,
      },
      {
        path: '/Task/task-detail/:id',
        name: 'Chi tiết công việc',
        // mini: 'CV',
        component: EditProjects,
        // moduleCode: 'TaskConfig',
        hide: true,
      },
      {
        path: '/TaskProcessFlow',
        name: 'Luồng quy trình',
        // mini: 'CV',
        component: ProcessFlow,
        moduleCode: 'TaskProcessFlow',
      },
      {
        path: '/TaskProcessFlow/:id',
        name: 'Cập nhật luồng quy trình',
        // mini: 'CV',
        component: AddProcessFlow,
        moduleCode: 'TaskProcessFlow',
        hide: true,
      },
    ],
  },
  {
    path: '/Task/:id',
    name: 'Chỉnh sửa công việc cho dự án',
    // mini: 'SP',
    component: AddProjects,
    empty: true,
    hide: true,
  },
  {
    path: '/Task/add',
    name: 'Thêm công việc cho dự án',
    // mini: 'SP',
    component: AddProjects,
    empty: true,
    hide: true,
  },

  {
    path: '/Task/TemplateTask/:id',
    name: 'Mẫu công việc',
    // mini: 'SP',
    empty: true,
    hide: true,
    component: AddSampleProcess,
  },
  {
    path: '/import',
    name: 'Nhập excel',
    icon: Widgets,
    component: ImportPage,
    empty: true,
  },

  {
    path: '/Documentary/share/:id',
    name: 'File được chia sẻ',
    icon: Settings,
    component: FileManager,
    empty: true,
  },
  {
    path: '/PlanWorking',
    name: 'Kế hoạch công tác',
    state: 'openPlanWorking',
    icon: DateRange,
    dynamicNode: true,
    component: PlanWorkingPage,
    defaultModuleCode: 'PlanWorking',
    collapse: true,
    views: [
      {
        path: '/PlanWorking/personWorking',
        name: 'Kế hoạch cá nhân',
        // mini: 'CV',
        component: PlanWorkingPage,
        moduleCode: 'PlanWorking',
      },
      {
        path: '/PlanWorking/personWorking/add',
        name: 'Thêm mới lịch đơn vị',
        // mini: 'CV',
        component: AddPlanWorkingPerson,
        // moduleCode: 'AddPlanWorkingPerson',
        hide: true,
      },
      {
        path: '/PlanWorking/personWorking/:id',
        name: 'Cập nhật lịch đơn vị',
        // mini: 'CV',
        component: AddPlanWorkingPerson,
        // moduleCode: 'AddPlanWorkingPerson',
        hide: true,
      },
      {
        path: '/PlanWorking/organizationPlan',
        name: 'Kế hoạch đơn vị',
        // mini: 'CV',
        component: PlanWorkingOrganization,
        // moduleCode: 'PlanWorking',
      },
      {
        path: '/PlanWorking/organizationPlan/add',
        name: 'Thêm mới kế hoạch đơn vị',
        // mini: 'CV',
        component: AddPlanWorkingOrganization,
        // moduleCode: 'AddPlanWorkingOrganization',
        hide: true,
      },
      {
        path: '/PlanWorking/organizationPlan/:id',
        name: 'Cật nhật kế hoạch đơn vị',
        // mini: 'CV',
        component: AddPlanWorkingOrganization,
        // moduleCode: 'AddPlanWorkingOrganization',
        hide: true,
      },
      {
        path: '/PlanProcessTemplate',
        name: 'Luồng quy trình',
        // mini: 'CV',
        component: ProcessFlow,
        moduleCode: 'PlanProcessTemplate',
      },
      {
        path: '/PlanProcessTemplate/:id',
        name: 'Thêm mới luồng kế hoạch',
        // mini: 'CV',
        component: AddProcessFlow,
        moduleCode: 'PlanProcessTemplate',
        hide: true,
      }
    ],
  },
  {
    // path: '/AllCalendar',
    path: '/AllCalendar/Calendar',
    name: 'Lịch',
    icon: DateRange,
    component: WorkingSchedule,
    dynamicNode: true,
    defaultModuleCode: "AllCalendar",
    collapse: true,
    state: 'openCalendar',
    views: [
      {
        path: '/AllCalendar/Calendar',
        name: 'workingschedule',
        // mini: 'WS',
        component: WorkingSchedule,
        moduleCode: 'Calendar',
      },
      {
        path: '/AllCalendar/ViewCalendar',
        name: 'workingschedule',
        // mini: 'WS',
        component: WorkingScheduleViewCalender,
        hide:true,
        moduleCode: 'Calendar'
      },
      {
        path: '/AllCalendar/MeetingCalendar',
        name: 'meetingschedule',
        // mini: 'CV',
        component: MeetingCalendar,
        moduleCode: 'MeetingCalendar',
      },
      {
        path: '/AllCalendar/MeetingCalendar/add',
        name: 'Thêm lịch cá nhân',
        // mini: 'MC',
        component: AddMeetingSchedule,
        hide: true,
      },
      {
        path: '/AllCalendar/MeetingCalendar/:id',
        name: 'Chỉnh sửa lịch cá nhân',
        // mini: 'MC',
        component: AddMeetingSchedule,
        hide: true,
      },

      {
        path: '/AllCalendar/MeetingCalendar-detail/:id',
        name: 'Chi tiết lịch cá nhân',
        // mini: 'MC',
        component: EditMeetingPage,
        hide: true,
      },

      {
        path: '/AllCalendar/Calendar/:id',
        name: 'Sửa lịch đơn vị',
        // mini: 'MC',
        component: AddWorkingSchedule,
        hide: true,
      },
      {
        path: '/AllCalendar/Calendar/add',
        name: 'Thêm lịch đơn vị',
        // mini: 'MC',
        component: AddWorkingSchedule,
        hide: true,
      },
      {
        path: '/AllCalendar/Calendar/working-schedule-detail/:id',
        name: 'Chi tiết lịch đơn vị',
        // mini: 'MC',
        component: EditWorkingSchedulePage,
        hide: true,
      },
      {
        path: '/AllCalendar/room',
        name: 'meetingroom',
        // mini: 'MR',
        component: MeetingRoom,
        moduleCode: 'MettingRoom',
      },
      {
        path: '/CalendarProcessFlow',
        name: 'Luồng quy trình',
        // mini: 'CV',
        component: ProcessFlow,
        moduleCode: 'CalendarProcessFlow',
      },
      {
        path: '/CalendarProcessFlow/:id',
        name: 'Cập nhật luồng quy trình',
        // mini: 'CV',
        component: AddProcessFlow,
        moduleCode: 'CalendarProcessFlow',
        hide: true,
      },

      {
        path: '/AllCalendar/Calendar/working-schedule-detail-room/:id',
        name: 'meetingroom',
        // mini: 'MR',
        component: EditMeetingRoomPage,
        moduleCode: 'MettingRoom',
        hide: true,
      },
      // Báo cáo quân số
      {
        path: '/AllCalendar/TimeKeeping',
        name: 'Báo cáo quân số',
        // mini: 'WS',
        component: TimeKeeping,
        moduleCode: 'Salary',
      },
      {
        path: '/CalendarConfig',
        component: CrmConfigPage,
        name: 'config',
        // mini: 'CF',
        moduleCode: 'CalendarConfig',
      },



    ],
  },
  {
    path: '/PhoneBook',
    name: 'Danh bạ điện tử',
    component: PhoneBookPage,
    dynamicNode: true,
    defaultModuleCode: "PhoneBookPage",
    state: 'openCalendar',
    moduleCode: 'PhoneBook',
  },
  {
    path: '/userprofile/:id',
    name: 'Người dùng',
    hide: true,
    state: 'openExpense',
    icon: Settings,
    empty: true,
    component: PersonalPage,
  },
  {
    path: '/Documentary/file-manager',
    name: 'Kho dữ liệu số',
    state: 'openDocumentary',
    component: LifeDrive,
    icon: Assignment,
    exact: false,
    views: [],
  },
  {
    collapse: true,
    path: '/setting',
    name: 'settings',
    icon: Settings,
    dynamicNode: true,
    // defaultModuleCode: 'setting',
    component: SystemConfigPage,
    views: [
      {
        path: '/setting/general',
        name: 'systemconfig',
        // mini: 'TP',
        component: SystemConfigPage,
        moduleCode: 'setting',
      },
      {
        name: 'template',
        path: '/setting/DynamicForm',
        // mini: 'BM',
        component: TemplatePage,
        moduleCode: 'DynamicForm',
      },
      {
        name: 'template',
        path: '/setting/DynamicForm/:id',
        // mini: 'BM',
        component: AddTemplatePage,
        hide: true,
      },
      {
        name: 'Loại văn bản',
        path: '/setting/template_type',
        // mini: 'BM',
        component: TemplateTypePage,
        hide: true,
        // moduleCode: 'setting',
      },
      {
        name: 'Chi tiết văn bản',
        path: '/setting/template_type/:id',
        // mini: 'BM',
        component: AddTtPage,
        hide: true,
      },
      {
        hide: true,
        name: 'Vai trò',
        path: '/setting/roleGroup',
        // mini: 'PQ',
        component: RoleGroupPage,
      },
      {
        name: 'users',
        path: '/setting/Employee',
        // mini: 'ND',
        component: UsersPage,
        moduleCode: 'Employee',
      },
    ],
  },
  {
    name: 'Lịch sử đăng nhập',
    path: '/crm/Employee/history',
    icon: Widgets,
    empty: true,
    component: HistotyLog,
  },
  {
    path: '/setting/roleGroup/add',
    name: 'Thêm mới quyền',
    icon: Widgets,
    component: AddRolesGroupPage,
    empty: true,
  },
  {
    path: '/setting/roleGroup/edit/:id',
    name: 'Chỉnh sửa quyền',
    icon: Widgets,
    component: AddRolesGroupPage,
    empty: true,
  },
  {
    path: '/setting/roleGroupPortal/add',
    name: 'Thêm mới quyền Portal',
    icon: Widgets,
    component: AddRolesGroupPortalPage,
    empty: true,
  },
  {
    path: '/setting/roleGroupPortal/edit/:id',
    name: 'Chỉnh sửa quyền Portal',
    icon: Widgets,
    component: AddRolesGroupPortalPage,
    empty: true,
  },
  {
    path: '/setting/Employee/add',
    name: 'Thêm mới cán bộ',
    icon: Widgets,
    component: AddUserPage,
    empty: true,
  },
  {
    path: '/setting/Employee/add/:id',
    name: 'Sửa thông tin cán bộ',
    icon: Widgets,
    component: AddUserPage,
    empty: true,
  },
  {
    path: '/setting/Employee/department',
    name: 'Danh sách phòng ban',
    icon: Widgets,
    component: ListOfDepartmentPage,
    empty: true,
  },
  {
    path: '/setting/Employee/structure',
    name: 'Cấu trúc doanh nghiệp',
    icon: Widgets,
    component: OrganizationalStructurePage,
    empty: true,
  },
  {
    path: '/admin/profile',
    name: 'Thông tin cá nhân',
    icon: Widgets,
    component: EditProfilePage,
    empty: true,
  },
  {
    path: '/crm/TaskContract',
    name: 'TaskContract',
    component: AddProjects,
    icon: Widgets,
    empty: true,
  },
  {
    path: '/crm/TaskProgress',
    name: 'TaskProgress',
    component: TaskProgress,
    icon: Widgets,
    empty: true,
  },
  {
    path: '/crm/TaskUserReplacement',
    name: 'TaskUserReplacement',
    component: AddProjects,
    icon: Widgets,
    empty: true,
  },
  {
    path: '/crm/TemplateTask',
    name: 'TemplateTask',
    component: SampleProcess,
    icon: Widgets,
    empty: true,
  },
];

export default dashRoutes;
