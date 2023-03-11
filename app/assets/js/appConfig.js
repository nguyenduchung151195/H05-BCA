const filterConsoleErrors = () => {
    const consoleError = console.error;

    if (window && window.console) {
        window.console.error = (...args) => {
            if (typeof args[0] === 'string') {
                if (args[0].indexOf('React Intl') > -1) {
                    return;
                }
                if (args[0].indexOf('Warning') > -1) {
                    return;
                }

                consoleError(args[0]);
                return;
            }

            consoleError(...args);
        };
    }
};
filterConsoleErrors();
/* eslint-disable no-unused-vars */
const BASE = 'https://g.lifetek.vn:201';
const UPLOAD_APP = 'https://g.lifetek.vn:203/api';
// Pall start
// const CLIENT = '60_CRM';
// const APP = 'https://g.lifetek.vn:260';
// Pall end
const UPLOAD_AI = 'https://g.lifetek.vn:225';
// Staging start
const CLIENT = 'itek';
const APP = 'https://g.lifetek.vn:257';
const APP_REPORT = 'https://g.lifetek.vn:254';
// const APP = 'http://172.16.10.13:10020';
// Staging end

// Internal start
// const CLIENT = '80_LIFETEK';
// const APP = 'https://g.lifetek.vn:280';
// Internal end

// Local start
// const CLIENT = 'APP_CRM';
//   const APP = 'http://localhost:10020';
// Local end

const DYNAMIC_FORM = 'https://g.lifetek.vn:219';
const AUTOMATION = 'https://g.lifetek.vn:208';
const PROPERTIES_APP = 'https://g.lifetek.vn:207/api';
const APPROVE = 'https://g.lifetek.vn:210';
const ALLOW_FILE_EXT = ['.pdf', '.txt', '.docx', '.doc', '.xls', '.xlsx', '.csv', '.jpeg', '.jpg', '.png', '.mp4'];
// const APP = 'http://localhost:10020';
// const BASE = 'http://localhost:10201';
// const AUTOMATION = 'http://localhost:10208';
// const BASE = 'http://admin.lifetek.vn:1000';
// const UPLOAD_APP = 'http://admin.lifetek.vn:1003/api';
// const CLIENT = '2077App';
// const APP = 'http://admin.lifetek.vn:2077';
// const DYNAMIC_FORM = 'http://admin.lifetek.vn:1019';
// const AUTOMATION = 'http://admin.lifetek.vn:1008';
// const PROPERTIES_APP = 'http://admin.lifetek.vn:1007/api';
// const APPROVE = 'http://admin.lifetek.vn:1010';

// const BASE = 'http://admin.lifetek.vn:1000';
// const UPLOAD_APP = 'http://admin.lifetek.vn:1003/api';
// const CLIENT = '2090App';
// const APP = 'http://admin.lifetek.vn:2090';
// const DYNAMIC_FORM = 'http://admin.lifetek.vn:1019';
// const AUTOMATION = 'http://admin.lifetek.vn:1008';
// const PROPERTIES_APP = 'http://admin.lifetek.vn:1007/api';
// const APPROVE = 'http://admin.lifetek.vn:1010';

const NAME_LOCATION = 'CÔNG AN THÀNH PHỐ HÀ NỘI - BỘ CÔNG AN';
const USER_AFK_TIME = 15 * 60 * 1000;
const ENABLE_SSO = false;
const SSO_HOST = 'https://172.16.0.20/service/soap';
const POTAL = 'https://g.lifetek.vn:8080/vi/web/qlh05';
const EMAIL = 'https://g.lifetek.vn:500/h/search?mesg=welcome&init=true';
const URL_FACE_API = 'https://g.lifetek.vn:7978';
const API_SMART_FORM = 'https://g.lifetek.vn:3001';
const URL_MEETING = 'https://meeting.lifetek.vn:448';
const SPEECH2TEXT = 'https://g.lifetek.vn:227';
const URL_FILE_ENCODE_KEY = 'https://g.lifetek.vn:1717';

const FILE_SIZE = 1000 * 1000 * 1000 * 8 * 5


const INSERT_SOVANBAN = {
    A4: {
        "x": 150,
        "y": 130,
        // "content": "already broken",
        'fontSize': 16,

    }
}
// 'company: cục', 'department: phòng', 'stock', 'factory', 'workshop', 'salePoint: đội', 'corporation'
const DASHBOARD_TREE_SETTINGS = [
    {
        ROLE: ['CUCTRUONG', 'CUCPHO', 'GIAMDOC', 'PHOGIAMDOC'],
        UNITS: ['company', 'department']
    },
    {
        ROLE: ['TRUONGPHONG', 'PHOTRUONGPHONG'],
        UNITS: ['department', 'salePoint']
    },
    {
        ROLE: ['DOITRUONG', 'DOIPHO', 'CANBO'],
        UNITS: ['salePoint']
    }
]
const MIN_ORDER_SHOW_IN_LIST = 3.5
const orderCanHidden = 2
const ISPORTAL = false
