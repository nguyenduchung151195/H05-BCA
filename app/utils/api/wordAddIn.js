import { closeWebsocket } from 'utils/common'

const SOCKET = 'ws://localhost:5963'
const API_CHECK_STATUS = `${SOCKET}/status`
const API_CONNECT = `${SOCKET}/file`

export const startSocket = (api) => {
    return new WebSocket(api);
}

export const statusWordAddIn = ({ socket, onGetMessage, onGetError }) => {
    try {
        const websocket = socket || startSocket(API_CHECK_STATUS);
        websocket.onopen = function (evt) { websocket.send('') };
        websocket.onclose = function (evt) { };
        websocket.onmessage = function (evt) { onGetMessage(evt) };
        websocket.onerror = function (evt) { onGetError && onGetError() };
    } catch (err) { }
}

export const connectWordAddIn = (props) => {
    const { onGetMessage, onGetError, onReconnect } = props
    try {
        const websocket = new WebSocket(API_CONNECT);
        websocket.onopen = function (evt) { };
        websocket.onclose = function (evt) {
            if (onReconnect) {
                const socket = connectWordAddIn(props)
                onReconnect(socket)
            }
        };
        websocket.onmessage = function (evt) { onGetMessage(JSON.parse(evt.data)) };
        websocket.onerror = function (evt) { onGetError && onGetError() };
        return websocket
    } catch (err) { }
}


