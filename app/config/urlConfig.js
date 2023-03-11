/* eslint-disable no-undef */
// // config common

// export const BASE_URL = 'http://localhost:10201';
// export const APP_URL = 'http://localhost:10020';

export const BASE_URL = BASE;
export const API_ROLE_PORTAL = `${BASE_URL}/roles-portal`;
export const UPLOAD_APP_URL = UPLOAD_APP;
// export const UPLOAD_APP_URL = 'http://localhost:10203/api';
// //
export const APP_URL = APP;
export const APP_REPORT_URL = APP_REPORT;
export const DYNAMIC_FORM_URL = DYNAMIC_FORM;
export const AUTOMATION_URL = AUTOMATION;

// export const AUTOMATION_URL = 'http://localhost:10208';

//  Api tim kiem bang hinh anh
export const URL_FACE_API_URL = URL_FACE_API;
// export const SEARCH_IMAGE = `${URL_FACE_API_URL}/search_image`;
//  Api tim kiem bang video
export const SEARCH_VIDEO = `${URL_FACE_API_URL}/search_video`;
//
export const PROPERTIES_APP_URL = PROPERTIES_APP;
export const APPROVE_URL = APPROVE;
export const UPLOAD_AI_URL = UPLOAD_AI;
export const ALLOW_FILE_EXT_UPLOAD = ALLOW_FILE_EXT;
export const FILE_SIZE_UPLOAD = FILE_SIZE;
export const DASHBOARD_TREE_SETTING = DASHBOARD_TREE_SETTINGS;
export const MIN_ORDER = MIN_ORDER_SHOW_IN_LIST;
export const orderHidden = orderCanHidden
export const SPEECH_2_TEXT = `${SPEECH2TEXT}/speech2text`;
export const URL_ENCODE_KEY = URL_FILE_ENCODE_KEY;


// export const APPROVE_URL = 'http://localhost:10010';

// FACE_RECONIZE
// export const FACE_RECONIZE_URL = 'http://192.168.1.238:5000';
export const FACE_RECONIZE_WS = 'ws://192.168.1.238:5000';
export const HRM_UPLOAD_AVATAR = `http://192.168.1.238:10099/async-images`;

// api auth
export const API_LOGIN = `${BASE_URL}/oauth/token`;
export const API_GET_TOKEN = `${BASE_URL}/oauth/authorize`;
export const REGISTER = `${BASE_URL}/users/register`;
export const CREATE = `${BASE_URL}/users/create`;
export const CREATE_USER = `${BASE_URL}/users/create-user`;
export const API_ROLE = `${BASE_URL}/roles`;
export const API_ROLE_GROUP = `${BASE_URL}/role-groups`;
export const API_ROLE_GROUP_PORTAL = `${BASE_URL}/api/role-groups-portal`;
export const API_CHANGE_MY_PASSWORD = `${BASE_URL}/users/change-my-pass`;
export const API_CHANGE_PASSWORD = `${BASE_URL}/users/change-password`;

export const API_APPROVE_GROUPS = `${APPROVE_URL}/api/approve-group`;
export const API_APPROVE = `${APPROVE_URL}/api/approve-request`;

// api system config
export const SYS_CONF = `${APP_URL}/api/system-config`;

// api count 
export const COUNT_PLAN_PERSON = `${APP_URL}/api/workingCalendar/count-person`;
export const COUNT_PLAN_UNIT = `${APP_URL}/api/workingCalendar/count-unit`;
// api users
export const API_FIELD = `${APP_URL}/api/field`;
export const API_COMMON = `${APP_URL}/api/common`;
export const API_COMMON_MODULE = `${APP_URL}/api/common/module-dynamic`;
export const API_COMMON_APPROVE_FINISH = `${APP_URL}/api/common/approve/finish`;
export const WHO_AM_I = `${APP_URL}/api/users/whoami`; // GET users //POST user // DELETE user
export const API_USERS = `${APP_URL}/api/employees`; // GET users //POST user // DELETE user
export const API_USERS_SEARCH = `${APP_URL}/api/employees/search`; // GET users //POST user // DELETE user
export const API_USERS_INTERNAL = `${APP_URL}/api/employees/internal`; // GET users //POST user // DELETE user
export const API_ORIGIN = `${APP_URL}/api/inventory/origin`; // GET users //POST user // DELETE user
export const API_ORIGANIZATION = `${APP_URL}/api/organization-units`; // GET users //POST user // DELETE user
export const API_DELETE_ORIGANIZATION = `${APP_URL}/api/organization-units/remove-more`; // GET users //POST user // DELETE user
export const API_SEARCH_ORIGANIZATION = `${APP_URL}/api/organization-units/search`; // GET users //POST user // DELETE user
export const API_CHANGE_WORKING_ORIGANIZATION = `${APP_URL}/api/organization-units/change-working-organization`;
export const API_VIEWCONFIG = `${APP_URL}/api/view-configs/myconfig`; // +id user  //PUT view config
export const API_UNIT_STOCK = `${APP_URL}/api/inventory/unit`; // +id user  //PUT view config
export const API_CATEGORY_STOCK = `${APP_URL}/api/inventory/catalog`; // +id user  //PUT view config
export const API_CATEGORY_STOCK_TREE = `${APP_URL}/api/inventory/catalog/tree`; // +id user  //PUT view config
export const API_SERVICES_STOCK = `${APP_URL}/api/inventory/service`; // +id user  //PUT view config
export const API_TAG_STOCK = `${APP_URL}/api/inventory/tag`; // +id user  //PUT view config
export const API_ASSET_TYPE_STOCK = `${APP_URL}/api/inventory/assetType`; // +id user  //PUT view config
export const API_UPDATE_VIEWCONFIG = `${APP_URL}/api/view-configs`; // +id user  //PUT view config
export const DYNAMIC_COLLECTION = `${APP_URL}/api/dynamic-collections`; // +id user  //PUT view config
export const CRM_SOURCE = `${APP_URL}/api/crm-source`; // +id user  //PUT view config
export const API_ADD_NEW_PRODUCT = `${APP_URL}/api/inventory`;
// api properties
export const GET_PROP_SET = `${PROPERTIES_APP_URL}/attribute-temps`;
export const GET_PROP_GROUP = `${PROPERTIES_APP_URL}/attributesGroup`;
export const GET_PROP_LIST = `${PROPERTIES_APP_URL}/attributes`;

export const API_REPORT_TASK_STATUS = `${APP_URL}/api/report/report-taskstatus`;
export const API_EXPORT_TASKSTATUS = `${APP_URL}/api/report/export-taskstatus`;

export const API_REPORT_STATISTICAL_BOS = `${APP_URL}/api/report/report-statistical-bussinessoppotunities`;
export const API_REPORT_VISIT_CUSTOMER = `${APP_URL}/api/report/report-visit-customer`;
export const API_REPORT_TIME_FOR_JOB = `${APP_URL}/api/report-time`;

// api cusomers
export const API_CUSTOMERS = `${APP_URL}/api/customers`; // GET customer //POST customer // DELETE customer

export const API_KEY = '';
export const API_EXPORT = `${APP_URL}/api/customers`;
// api upload
export const UPLOAD_IMG_SINGLE = `${UPLOAD_APP_URL}/files/single`;
export const API_LOGOUT = `${APP_URL}/api/user-login`;
export const API_UPLOAD_SINGLE = `${UPLOAD_APP_URL}/url-single`;
export const API_UPLOAD_SIGN = `${UPLOAD_APP_URL}/url-sign`;
export const API_WORD_ADDON_UPLOAD = `${APP_URL}/api/file/file.rar`;
export const API_DOWNLOAD_SCAN_DOC = `${APP_URL}/api/file/scan-app.rar`;
export const API_DOWNLOAD_SIGN_DIGITAL = `${APP_URL}/api/file/e-signed-app.rar`;
export const API_GET_FILENAME_BY_ID = `${UPLOAD_APP_URL}/files/get-name-by-id`;
export const API_REPORT_USED = `${UPLOAD_APP_URL}/reportUsed`;
export const API_REPORT_USED_REPORT = `${UPLOAD_APP_URL}/reportCapacity`;
export const SEARCH_IMAGE = `${UPLOAD_APP_URL}/searchByType`;

// view config
export const API_VIEW_CONFIG = `${APP_URL}/api/view-configs`; // +id user  //PUT view config
export const API_UPDATE_ALL_SYSTEM = `${APP_URL}/api/view-configs/updateAllSystem`; // +id user  //PUT view config

// api supplier
export const API_SUPPLIERS = `${APP_URL}/api/suppliers`;
export const API_STATUS_CRMCONFIG = `${APP_URL}/api/crm-status`; // +id user  //PUT view config
export const API_SOURCE_CRMCONFIG = `${APP_URL}/api/crm-source`; // +id user  //PUT view config

// api supplier
export const SUPPLIER = `${APP_URL}/api/suppliers`; // +id user  //PUT view config

// api template
export const API_TEMPLATE = `${DYNAMIC_FORM_URL}/api/dynamic-forms`;
export const API_TEMPLATE_LIST = `${DYNAMIC_FORM_URL}/api/dynamic-forms/list`;
export const API_NEWS_FEED = `${APP_URL}/api/news-feed`;

export const API_ADD_CANDIDATE = `${APP_URL}/api/candidate`;

export const API_TO_LINK = `${APP_URL}/api/hrmEmployee/tolink`;
// CLONE MODULE

export const API_DOCS = `${APP_URL}/api/collections`;
export const API_PLUGINS = `${APP_URL}/api/plugins`;
// api expenses
export const API_EXPENSES = `${APP_URL}/api/cost-estimates`;

// api stock
export const API_STOCK = `${APP_URL}/api/inventory`;
export const API_LOWER_LIMIT_STOCK = `${APP_URL}/api/inventory/listlimit`;
export const API_UPPER_LIMIT_STOCK = `${APP_URL}/api/inventory/listlimit?flag=1`;
// api sales-quotations
export const API_PRICE = `${APP_URL}/api/sales-quotations`;
// api profile
export const API_PROFILE = `${APP_URL}/api/employees/profile`;
export const API_IMPORT = `${APP_URL}/api/import`;
export const API_IMPORT_FIELD = `${APP_URL}/api/import-field`;
export const API_IMPORT_CRM_CONFIG = `${APP_URL}/api/crm-source/createByEx`;
export const API_BOS = `${APP_URL}/api/business-opportunities`;
export const API_BUS_CALENDER = `${APP_URL}/api/business-opportunities/calendar`;
export const API_TRADINGS = `${APP_URL}/api/exchanging-agreements`;
export const API_CREATE_TRADDING_BY_BUS = `${APP_URL}/api/exchanging-agreements/create-by-businessOpportunities`;
export const API_TRADINGS_CALENDAR = `${APP_URL}/api/exchanging-agreements/calendar`;
export const API_AUTHORY_PROFILE = `${APP_URL}/api/employees`;

// API sales-policy
export const API_SALE_POLICY = `${APP_URL}/api/sales-policy`;

// CLONE MODULE
// export const API_DOCS = `${APP_URL}/api/collections`;

// Configuration CRM
export const API_CURRENCY = `${APP_URL}/api/currency`;
export const API_MONEY = `${APP_URL}/api/moneys`;
export const API_LOCATION = `${APP_URL}/api/location`;
export const API_TAX = `${APP_URL}/api/tax`;
export const API_SALE = `${APP_URL}/api/sales-quotations`;
export const API_SALE_FOR_CONTRACT = `${APP_URL}/api/sales-quotations/for-contract`;

// contract
export const GET_CONTRACT = `${APP_URL}/api/contract`;
export const GET_TASK_CONTRACT = `${APP_URL}/api/tasks/contract`;
export const GET_CONTRACT_BY_TYPE = `${APP_URL}/api/contract/by-type`;
export const API_DYNAMIC_FORM = `${DYNAMIC_FORM_URL}/api/dynamic-forms`;
export const API_AUTOMATION = `${AUTOMATION_URL}/api/automation-rule`;

export const API_QUESTION = `${APP_URL}/api/question`;
export const API_EXAM = `${APP_URL}/api/exam`;
export const API_ROUND_EXAM = `${APP_URL}/api/round-exam`;
export const API_VANCANCIES = `${APP_URL}/api/vacancies`;
export const API_CANDIDATE = `${APP_URL}/api/hrmEmployee/candidate`;
// bills
export const API_BILLS = `${APP_URL}/api/bills`;
export const API_HRM_EDUCATE = `${APP_URL}/api/hrmEducate`;
// order
export const API_ORDER_PO = `${APP_URL}/api/orders-po`;

// Task Project
export const API_TASK_PROJECT = `${APP_URL}/api/tasks`;
export const API_TASK_CONTRACT_PROJECT = `${APP_URL}/api/tasks/projects`;
export const API_PROGRESS = `${APP_URL}/api/tasks/progress`;
export const API_TRANFER = `${APP_URL}/api/tasks/tranfer`;
export const API_ADD_TASK_DOCUMENT = `${APP_URL}/api/incommingdocument/add-tasks`;
// Cấu hình Task Project
export const API_TASK_CONFIG = `${APP_URL}/api/tasks/config`;
export const API_TASK_ACCEPT = `${APP_URL}/api/tasks/accept`;
export const API_RETURN_TASK = `${APP_URL}/api/tasks/return-Task`;
export const API_UPDATE_TASK_CONFIG = `${APP_URL}/api/tasks/config/update`;
export const API_CREAT_TASK_CONFIG = `${APP_URL}/api/tasks/config/create`;
export const API_DELETE_TASK_CONFIG = `${APP_URL}/api/tasks/config/delete`;
export const API_TASK_HISTORY = `${APP_URL}/api/tasks-history`;

// Sample Process
export const API_SAMPLE_PROCESS = `${APP_URL}/api/templates`;

// thu chi
export const API_RNE = `${APP_URL}/api/revenue-expenditure`;
export const API_RNE_COUNT = `${APP_URL}/api/revenue-expenditure/count`;
export const API_RNE_ADVANCE = `${APP_URL}/api/advance-require`;
export const API_RNE_REMBUR = `${APP_URL}/api/reimbursement-require`;
export const API_PAYMENT = `${APP_URL}/api/payment-require`;
export const API_LOG = `${APP_URL}/api/logs`;
export const API_NOTIFY = `${APP_URL}/api/notifications`;
export const API_MEETING = `${APP_URL}/api/metting-schedule`;
export const API_MEETING_UPDATE_CALEN_DETAIL = `${APP_URL}/api/metting-schedule/calenDetail`;
export const API_MEETING_APPROVE = `${APP_URL}/api/metting-schedule/calenDetail/set-complete`;
export const API_MEETING_PUBLISH = `${APP_URL}/api/metting-schedule/calenDetail/set-publish`;

export const API_MEETING_CALEN_DETAIL = `${APP_URL}/api/metting-schedule/calenDetail`;
export const API_MEETING_RETURN_DOC = `${APP_URL}/api/metting-schedule/return-docs`;
export const API_MEETING_CANLEN_RETURN_DOC = `${APP_URL}/api/metting-schedule/calenDetail/return-docs`;
export const API_VISIT = `${APP_URL}/api/business-visit`;
// nhập kho
export const API_STOCK_IMPORT = `${APP_URL}/api/stock-import`;
export const API_STOCK_EXPORT = `${APP_URL}/api/stock-export`;
export const API_MAPPING_CONVERT = `${APPROVE_URL}/api/convert-mapping`;
export const CONTACT_CENTER = `${APP_URL}/api/contact-center`;

// chat
export const API_CONVERSATION = `${APP_URL}/api/conversation`;
// export const API_DATA_FORM = `${APP_URL}/api/collections/for-template`;

// delivery
export const API_DELIVERY = `${APP_URL}/api/delivery`;

export const API_CODE_CONFIG = `${APP_URL}/api/code-config`;
// HRM
export const API_STATUS_HRMCONFIG = `${APP_URL}/api/hrm-status`;
export const API_SOURCE_HRMCONFIG = `${APP_URL}/api/hrm-source`;

// công văn
export const API_DISPATCH = `${APP_URL}/api/documentary`;
export const API_DISPATCH_INCOMING = `${APP_URL}/api/documentary/incoming-document`;
export const API_DISPATCH_OUTGOING = `${APP_URL}/api/documentary/incoming-document`;

export const API_NOTE = `${APP_URL}/api/note`;
export const API_REPORT = `${APP_URL}/api/report`;

export const API_PERSONNEL = `${APP_URL}/api/hrmEmployee`;
export const API_PERSONNEL_REPORT = `${APP_URL}/api/report-employee-management/hrm`;
export const API_PERSONNEL_RECEIVER = `${APP_URL}/api/employees/internal`;
export const API_INCREASES_OR_DECREASES = `${APP_URL}/api/hrmEmployee/report-by-kanban-status-in-year`;
export const API_RECRUITMENT = `${APP_URL}/api/hrm-recruitment`;
export const API_RECRUITMENT_WAVE = `${APP_URL}/api/hrm-recruitment-wave`;
export const API_CAMPAIGN = `${APP_URL}/api/campaign`;

// vote
export const API_VOTE = `${APP_URL}/api/vote`;
export const API_COMMENT = `${APP_URL}/api/comment`;

export const API_ROLE_APP = `${APP_URL}/api/roleApp`;
export const API_MAIL = `${APP_URL}/api/mail`;

// dashboard hrm
export const API_HRM_REPORT = `${APP_URL}/api/hrmReport`;

// TT :
export const API_CREATE_CONFIG_CODE = `${APP_URL}/api/generate`;
export const API_GET_CONFIG_CODE = `${APP_URL}/api/generate`;

export const API_SALARY = `${APP_URL}/api/salary`;

export const API_HRM_SALARY = `${APP_URL}/api/salary-development`;
export const API_HRM_SOCIAL = `${APP_URL}/api/insurance-information`;
export const API_HRM_EXPERIENCE = `${APP_URL}/api/work-experience`;
export const API_HRM_PROCESS = `${APP_URL}/api/work-progress`;
export const API_HRM_MATERNITY = `${APP_URL}/api/maternity-process`;
export const API_HRM_INDENTURE = `${APP_URL}/api/contract-process`;
export const API_HRM_EDUCATION = `${APP_URL}/api/educate-process`;
export const API_HRM_BONUS = `${APP_URL}/api/bonus-process`;
export const API_HRM_DISCIPLINE = `${APP_URL}/api/discipline-process`;
export const API_HRM_SABBATICAL = `${APP_URL}/api/information-takeleave`;
export const API_HRM_RELATION = `${APP_URL}/api/informaion-relationship`;

export const API_HRM_DISMISSED = `${APP_URL}/api/concurrently`;
export const API_HRM_PRAISE = `${APP_URL}/api/bonusChild`;
export const API_HRM_BUSINESS_TRIP = `${APP_URL}/api/businessTrip`;

export const API_TIMEKEEPING = `${APP_URL}/api/timekeeping`;
export const API_TIMEKEEPING_TABLE = `${APP_URL}/api/timekeepingTable`;
export const API_TIMEKEEPING_LOG = `${APP_URL}/api/timekeeping/log`;
export const API_TIMEKEEPING_EQUIPMENT = `${APP_URL}/api/timekeepingequipment`;
export const API_TIMEKEEPING_ADDEQUIPMENT = `${APP_URL}/api/hrm2equipment`;
export const API_TAKE_LEAVE = `${APP_URL}/api/takeleave`;
export const API_OVER_TIME = `${APP_URL}/api/overtime`;
export const API_PLAN_OT = `${APP_URL}/api/overtime-plan`;

// TIMEKEEPING CHECK IN
export const API_TIMEKEEPING_2 = `${APP_URL}/api/timekeeping/face-check-in`;

// import
export const API_IMPORT_TIMEKEEPING = `${APP_URL}/api/timekeeping/import`;

export const API_BANK_ACCOUNT = `${APP_URL}/api/bank-account`;
// config hrm

export const API_HRM_HOLIDAY = `${APP_URL}/api/hrmHolidays`;
export const API_HRM_TIMEKEEP_TYPE = `${APP_URL}/api/hrmTimekeepingType`;
export const API_HRM_SYMBOL = `${APP_URL}/api/hrmTimekeepingSymbol`;
export const API_HRM_SALARY_CATEGORY = `${APP_URL}/api/hrmWageSource`;
export const API_HRM_SHIFT = `${APP_URL}/api/shift`;
export const API_HRM_PROJECT_BONUS = `${APP_URL}/api/project-bonus`;
// config salary
export const API_DATA_SALARY = `${APP_URL}/api/timekeeping/contract-2-allowance`;
export const API_SALARY_FORMULA = `${APP_URL}/api/formula`;
export const API_ATTRIBUTE_FORMULA = `${APP_URL}/api/attributeformula`;
export const API_ATTRIBUTE_LISTATTRIBUTE = `${APP_URL}/api/attributeformula/listattribute`;
// export const API_HRM_WAGES = `${APP_URL}/api/hrmHolidays`;
export const API_HRM_WAGES = `${APP_URL}/api/hrmWage`;

// check Duplicate data
export const API_CHECK_DUPLICATE_DATA = `${APP_URL}/api/check-duplicate`;
export const API_CHECK_DUPLICATE_USERNAME = `${BASE_URL}/check-duplicate`;

// wages Salary
export const API_TITLE_WAGES_SALARY = `${APP_URL}/api/attributeformula/attributeformula`;
export const API_TIMEKEEPING_PAYCHECK = `${APP_URL}/api/timekeeping/paycheck`;

// TakeLeaveManager
export const API_TAKE_LEAVE_MANAGER = `${APP_URL}/api/takeleave-manager`;
export const API_HRM_EMPLOYEE = `${APP_URL}/api/hrmEmployee`;
export const API_HUMAN_RESOURCE = `${APP_URL}/api/human-resource`;

export const API_VIEW_CONFIG_FORMULA = `${APP_URL}/api/viewconfig-formula`;

// reports
export const API_TASK_EXPORT = `${APP_REPORT_URL}/api/tasks/export`;

// KPI
export const API_CRITERIA = `${APP_REPORT_URL}/api/kpi`;

// Favorite
export const API_REPORT_FAVORITE_BANK_BLANCE = `${APP_REPORT_URL}/api/report-favorite/bank-balance`;
export const API_REPORT_FAVORITE_COST = `${APP_REPORT_URL}/api/report-favorite/cost-ratio-year`;
export const API_REPORT_FAVORITE_SALES = `${APP_REPORT_URL}/api/report-favorite/sales-employees`;

// General
export const API_REPORT_COST_REVENUE = `${APP_REPORT_URL}/api/report-debt/cost-revenue`;
export const API_REPORT_DEPT_COST_PRICE = `${APP_REPORT_URL}/api/report-debt/cost-price`;
// export const API_REPORT_REVENUE_INVENTORY_BY_TIME = `${APP_REPORT_URL}/api/report/revenue-inventory-by-time`;
export const API_REPORT_REVENUE_INVENTORY_BY_TIME = `https://g.lifetek.vn:220/api/report-debt/aggregate-revenue`;

export const API_REPORT_DEBT_BY_TIME = `${APP_REPORT_URL}/api/report-debt/business-situation`;

// Cost
export const API_REPORT_RATIO_ITME = `${APP_REPORT_URL}/api/cost-management/cost-ratio-item`;
export const API_REPORT_COST_MANAGEMENT = `${APP_REPORT_URL}/api/cost-management/cost-ratio`;

// dept
export const API_REPORT_ACCOMPLISH_GOAL = `${APP_REPORT_URL}/api/report-debt/to-pay`;
export const API_DEPT_EMPLOYEE = `${APP_REPORT_URL}/api/report-debt/employee`;
export const API_REPORT_RECEIVABLES = `${APP_REPORT_URL}/api/report-debt/receivables`;

// reports sales
// export const API_TOP_SALES_CUSTOMER = `${APP_REPORT_URL}/api/report/top-sales-customer`;
// export const API_TOP_SALES_PRODUCTS = `${APP_REPORT_URL}/api/report/top-sales-product`;
// export const API_SALES_MANAGEMENT = `${APP_REPORT_URL}/api/report-sales-management/kpi-sales`;
// export const API_TARGET_SALES_MONTH = `${APP_REPORT_URL}/api/report-sales-management/monthly-sales-target`;

export const API_TOP_SALES_CUSTOMER = `${APP_REPORT_URL}/api/report/top-sales-customer`;
export const API_TOP_SALES_PRODUCTS = `${APP_REPORT_URL}/api/report-sales-management/top-sales-product`;
export const API_SALES_MANAGEMENT = `${APP_REPORT_URL}/api/report-sales-management/kpi-sales`;
export const API_TARGET_SALES_MONTH = `${APP_REPORT_URL}/api/report-sales-management/monthly-sales-target`;

export const API_REPORT_INVENTORY = `${APP_REPORT_URL}/api/report/inventory-report-by-month`;
export const API_REPORT_SUM_IN_YEAR = `${APP_REPORT_URL}/api/report/report-expense-in-year`;
export const API_REPORT_CHARGE_PROPORTION = `${APP_REPORT_URL}/api/report/report-expense-by-type`;
export const API_REPORT_SUM_REVENUE_COST_IN_YEAR = `${APP_REPORT_URL}/api/report/aggregatesales-customer-merchandise`;
export const API_REPORT_SUM_REVENUE_INVENTORY_IN_YEAR = `${APP_REPORT_URL}/api/report/sales-inventory`;

export const API_REPORT_TASK_WEEK = `${APP_REPORT_URL}/api/report/task-week`;
export const API_REPORT_TASK_DEBT = `${APP_REPORT_URL}/api/report/task-debt`;
export const API_REPORT_TASK_SUMMARY = `${APP_REPORT_URL}/api/report/task-summary`;
export const API_REPORT_TASK_VALUE_AND_PAID = `${APP_REPORT_URL}/api/report/task-value-and-paid`;

// Employee
export const API_REPORT_FINISH_LEVEL = `${APP_REPORT_URL}/api/report-employee-management/accomplish-goal`;
export const API_REPORT_EMPLOYEE_KPI_SALES = `${APP_REPORT_URL}/api/report-employee-management/sales`;
// CASH
export const API_REPORT_MONEY_MANAGEMENT = `${APP_REPORT_URL}/api/money-management/statistical-receipt`;
export const API_REPORT_TOP_CUSTOMER_MONEY = `${APP_REPORT_URL}/api/money-management/top-customer-receipts-month`;

// process
export const API_REPORT_TASK_PROCESS = `${APP_REPORT_URL}/api/report-task/progress`;
// Customer
export const API_REPORT_CUSTOMER_SELL = `${APP_REPORT_URL}/api/report-customer/number-sell`;
export const API_REPORT_FREQUENCY_SELL = `${APP_REPORT_URL}/api/report-customer/frequency-sell`;

export const API_REPORT_EXPENSE_REPORT_BY_TYPE = `${APP_REPORT_URL}/api/report/business-synthesis-report`;
export const API_REPORT_AGGREGATE_SALES_OF_BUSINESS_STAff = `${APP_REPORT_URL}/api/report/aggregatesales-of-businesstaff`;
export const API_REPORT_AGGREGATE_SALES_OF_SALES_STAff = `${APP_REPORT_URL}/api/report/aggregatesales-of-salesstaff`;
export const API_REPORT_TASKS_STATUS = `${APP_REPORT_URL}/api/report/tasks-status`;

// report stock
export const API_REPORT_PRODUCT_INVENTORY = `${APP_REPORT_URL}/api/report-product/inventory`;
export const API_REPORT_STOCK_INVENTORY_BY_YEAR = `${APP_REPORT_URL}/api/report-product/inventory-by-year`;

//
export const API_UPLOAD_IMAGE_AI = `${UPLOAD_AI_URL}/getnewperson`;

export const UPLOAD_FILE_METADATA = `${UPLOAD_APP_URL}/file-system/company/metadata`;

export const API_LT_ACCOUNT = `${APP_URL}/api/lt-account`;

export const TRANSFER_FILE_DOCUMENT = `${APP_URL}/api/file-system/transfer/set-processor-is-any`;

// Asset
export const API_ASSET = `${APP_URL}/api/asset`;
export const API_ASSET_ALLOCATE_LOG = `${APP_URL}/api/asset/log`;
export const API_ASSET_ALLOCATION = `${APP_URL}/api/asset/allocation`;
export const API_GET_GEN_CODE = `${APP_URL}/api/generate/gen-code`;
export const API_GET_GEN_CODE_COUNT = `${APP_URL}/api/generate/get-count`;

export const API_INCOMMING_DOCUMENT = `${APP_URL}/api/incommingdocument`;
export const API_INCOMMING_DOCUMENT_SET_DEADLINE = `${APP_URL}/api/incommingdocument/set-deadline`;
export const API_DOCUMENT_PROCESS_TEMPLATE = `${APP_URL}/api/documentprocesstemplate`;
export const API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE = `${APP_URL}/api/documentprocesstemplate/active-v2`;
export const API_GOING_DOCUMENT = `${APP_URL}/api/outgoingdocument`;
export const API_CHECK_EXIST_OUT_GOING = `${APP_URL}/api/outgoingdocument/check-exist`;
export const API_CHECK_EXIST_RELEASE_DOCUMENT = `${APP_URL}/api/releasedocument/check-exist`;
export const API_CHECK_EXIST_TO_BOOK = `${APP_URL}/api/incommingdocument/exist-toBook`;
export const API_RELEASE_DOCUMENT = `${APP_URL}/api/releasedocument`;
export const API_FILE_SYSTERM_TRANSFER = `${UPLOAD_APP_URL}/file-system/transfer`;
export const API_INCOMMING_DOCUMENT_COUNT = `${APP_URL}/api/incommingdocument/count`;
export const API_OUTGOING_DOCUMENT_COUNT = `${APP_URL}/api/outgoingdocument/count`;
export const API_OUTGOING_DOCUMENT_SINGER = `${APP_URL}/api/outgoingdocument/singer`;
export const API_INCOMMING_DOCUMENT_RECALL = `${APP_URL}/api/incommingdocument/recall`;
export const API_GOING_DOCUMENT_RECALL = `${APP_URL}/api/outgoingdocument/recall`;
export const API_INCOMMING_DOCUMENT_RECOVER = `${APP_URL}/api/incommingdocument/recover`;
export const API_GOING_DOCUMENT_RECOVER = `${APP_URL}/api/outgoingdocument/recover`;
export const API_DOCUMENT_HISTORY = `${APP_URL}/api/document-history`;
export const API_AUTHORITY_DOCUMENT = `${APP_URL}/api/authoritydocument`;

export const API_LETTER = `${APP_URL}/api/letter`;
export const API_LETTER_PEOPLE = `${APP_URL}/api/letter/people`;
export const API_LETTER_ACCUSED = `${APP_URL}/api/letter/accused`;

export const API_PROVINCE = `${APP_URL}/api/maps/city`;
export const API_DISTRICT = `${APP_URL}/api/maps/district`;
export const API_COMMUNE = `${APP_URL}/api/maps/ward`;
export const API_STREET = `${APP_URL}/api/maps/street`;
export const API_PEOPLE = `${APP_URL}/api/letter/people`;
export const API_UPDATE_RELEASEDEPARTMENT = `${APP_URL}/api/employees/update-releaseDepartment`;

// bookDocument
export const API_BOOK_DOCUMENT = `${APP_URL}/api/bookDocument`;
// planWorking
export const API_PLAN_WORKING = `${APP}/api/workingCalendar`;

export const API_REFESH_ROLE_MODULE = `${APP}/api/roleApp/refresh`;

export const API_GIVE_BACK_CALENDE = `${APP}/return-docs`;
export const API_CHANGE_PASSWORD_PERSON = `${BASE_URL}/users/admin-change-password`;
export const API_ROLEAPP_CHANGE_PASSWORD_PERSON = `${APP_URL}/api/roleApp/admin-change-password`;

export const API_USERS_UPDATE_INFO = `${BASE_URL}/users/update-info`;
export const API_OAUTH_GET_TOKEN_INFO = `${BASE_URL}/oauth/get-tokenInfo`;
export const API_OAUTH_GET_USER = `${BASE_URL}/oauth/get-user-from-emailToken`;
export const API_TRANFER_SET_PROCESSOR_IS_ANY = `${UPLOAD_APP_URL}/file-system/transfer/set-processor-is-any`;
export const API_BEFORE_RECALL = `${APP_URL}/api/outgoingdocument/incomingdoc-internal`;

export const API_INSERT_TEXT_TO_PDF = `${UPLOAD_APP_URL}/files/insert-text-to-pdf-file`;
export const API_PREVIEW_TEXT_TO_PDF = `${UPLOAD_APP_URL}/files/preview-text-to-pdf-file`;
export const API_UPDATE_APOSTROPHE_STATUS = `${APP_URL}/api/outgoingdocument/set-signed-files`;
export const API_CHANGE_DIGITAL_SIGN = `${APP_URL}/api/outgoingdocument/change-digital-sign`;
// export const API_INCOMMING_DOCUMENT_LOOKUP_STATISTICS = `${APP_URL}/api/incommingdocument/lookup-statistics`;
// export const API_OUTGOING_DOCUMENT_LOOKUP_STATISTICS = `${APP_URL}/api/outgoingdocument/lookup-statistics`;
export const API_TASKS_STATISTICS = `${APP_URL}/api/tasks/statistics`;

// bên mình chạy đc
// export const API_INCOMMING_DOCUMENT_LOOKUP_STATISTICS = `${APP_URL}/api/incommingdocument-statistics`;
// export const API_OUTGOING_DOCUMENT_LOOKUP_STATISTICS = `${APP_URL}/api/outgoingdocument-statistics`;

// bên khách chạy đc
export const API_INCOMMING_DOCUMENT_LOOKUP_STATISTICS = `${APP_REPORT_URL}/api/incommingdocument-statistics`;
export const API_OUTGOING_DOCUMENT_LOOKUP_STATISTICS = `${APP_REPORT_URL}/api/outgoingdocument-statistics`;

// bên khách chạy đc
// export const API_INCOMMING_DOCUMENT_REPORT = `${APP_REPORT_URL}/api/incommingdocument-report`;
// export const API_GOING_DOCUMENT_REPORT = `${APP_REPORT_URL}/api/outgoingdocument-report`;
// bên mình chạy đc
export const API_INCOMMING_DOCUMENT_REPORT = `${APP_URL}/api/incommingdocument-report`;
export const API_GOING_DOCUMENT_REPORT = `${APP_URL}/api/outgoingdocument-report`;

// bên mình
// export const API_DASHBOARD_DOCUMENT_REPORT = `${APP_URL}/api/document-report`;
// bên khách
export const API_DASHBOARD_DOCUMENT_REPORT = `${APP_REPORT_URL}/api/document-report`;


export const API_OUTGOING_DOCUMENT_RETURN_DOCS = `${APP_URL}/api/outgoingdocument/return-docs`;
export const API_INCOMMING_DOCUMENT_COUNT_AUTHORIZED = `${APP_URL}/api/incommingdocument/authorized/count`;
export const API_OUTGOING_DOCUMENT_COUNT_AUTHORIZED = `${APP_URL}/api/outgoingdocument/authorized/count`;
export const API_EMPLOYEE_GET_AUTHORITY = `${APP_URL}/api/employees/get-authority`;

export const API_SMART_FORM_URL = `${API_SMART_FORM}/detect`;
export const API_SMART_FORM_PDF_URL = `${API_SMART_FORM}/detect_pdf`;
export const API_SQL_IN = `${APP_URL}/api/sql/add-file-incoming`;
export const API_SQL_OUT = `${APP_URL}/api/sql/add-file-outgoing`;
export const API_SALARY_STATISTIC = `${APP_URL}/api/salary/statistic`;
export const API_GET_COMMENT_BY_CODE = `${APP_URL}/api/comment/get-comment-by-code`;
export const API_EXPORT_BY_TIME = `${APP_URL}/api/workingCalendar/export-by-time`;
export const API_EXPORT_BY_TIME_RESULT = `${APP_URL}/api/workingCalendar/export-by-result`;
// Share files
export const API_SHARE_FILES = `${UPLOAD_APP_URL}/share`;





