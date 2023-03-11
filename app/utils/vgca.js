import _ from 'lodash'
import { API_UPLOAD_SIGN } from "../config/urlConfig";

// const {
//     vgca_show_config,
//     vgca_sign_msg,
//     vgca_sign_file,
//     vgca_sign_pdf,

//     vgca_verify_msg,
//     vgca_verify_pdf
// } = window

let FileUploadHandler
// FileUploadHandler = "http://localhost:16227/FileUploadHandler.aspx"
FileUploadHandler = API_UPLOAD_SIGN
const URL = 'https://127.0.0.1:8987/'
const WS = 'ws://127.0.0.1:8987/'

export const testPing = async () => {
    try {

        var http = new XMLHttpRequest();

        http.open("GET", URL, true);
        http.onreadystatechange = function () {
        };
        try {
            http.send(null);
        } catch (exception) {
            // this is expected
        }


        var ws = new WebSocket(WS);
        ws.onerror = function (e) {
            console.log(e)
        };

    } catch (err) { console.log(err) }
}


function showConfig() { vgca_show_config() }

function licenseRequest(email) {
    vgca_license_request(email, e => console.log('222', e), e => console.log('333', e))
}

function auth(sender, authCode, callback) {
    vgca_auth(sender, `<%=Session[${authCode}]%>`, (sender, rv) => {
        var json_rv = JSON.parse(rv);
        if (json_rv.Status == 0) {
            callback(json_rv.Signature);
        } else {
        }
    })
}

function getCertinfo(res, rej) {
    vgca_get_certinfo(e => {
        if (e) {
            const json = JSON.parse(e)
            if (_.get(json, 'Status') === 0) return res && res(json.CertInfo)
        }
        rej && rej()
    })
}

function sign_msg(sender, str, callback) {
    vgca_sign_msg(sender, Base64.encode(str), callback);
}

function verify_msg(str, signature, callback) {
    let prms = {};
    prms["Base64Content"] = Base64.encode(str);
    prms["Signature"] = signature;
    let json_prms = JSON.stringify(prms);
    vgca_verify_msg(json_prms, callback);
    return false;
}

function sign_file(sessionid, url, callback) {
    let prms = {};
    prms["FileUploadHandler"] = FileUploadHandler;
    prms["SessionId"] = sessionid;
    prms["FileName"] = url;
    prms["MetaData"] = [{ "Key": "abc", "Value": "abc" }];
    let json_prms = JSON.stringify(prms);
    vgca_sign_file(json_prms, callback);
}

function sign_pdf(sessionid, url, callback) {
    let prms = {};
    prms["FileUploadHandler"] = FileUploadHandler;
    prms["SessionId"] = sessionid;
    prms["FileName"] = url;
    prms["MetaData"] = [{ "Key": "abc", "Value": "abc" }];
    let json_prms = JSON.stringify(prms);
    vgca_sign_pdf(json_prms, callback);
}

function verify_pdf(sessionid, filename, callback) {
    let prms = {};
    prms["SessionId"] = sessionid;
    prms["FileName"] = filename;
    let json_prms = JSON.stringify(prms);
    vgca_verify_pdf(json_prms, callback);
}

export {
    showConfig,
    getCertinfo,
    licenseRequest,
    auth,

    sign_msg,
    sign_file,
    sign_pdf,

    verify_msg,
    verify_pdf,
}