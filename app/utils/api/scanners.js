const SOCKET = 'ws://localhost:4649'
const API_DEVICE_LIST = `${SOCKET}/DeviceScanners`
const API_SCAN = `${SOCKET}/ScanImg`

export const startSocket = (api) => {
    return new WebSocket(api);
}

export const getDevice = ({ socket, onGetMessage, onGetError }) => {
    try {
        const websocket = socket || startSocket(API_DEVICE_LIST);
        websocket.onopen = function (evt) { websocket.send('') };
        websocket.onclose = function (evt) { };
        websocket.onmessage = function (evt) { onGetMessage(evt) };
        websocket.onerror = function (evt) { onGetError && onGetError() };
    } catch (err) { }
}


export const scan = ({ socket, onGetMessage, body }) => {
    try {
        const websocket = socket || startSocket(API_SCAN);
        websocket.onopen = function (evt) { websocket.send(JSON.stringify(body)) };
        websocket.onclose = function (evt) { console.log(evt) };
        websocket.onmessage = function (evt) { onGetMessage(evt) };
        websocket.onerror = function (evt) { console.log(evt) };
    } catch (err) { }
}