// https://docs.ccall.vn/api.html#truy-cap-restful-api-lay-cdr-file-ghi-am
export const SIP_URI = 'wss://sbcwrtchcm.ccall.vn:8080/ws';
export const default_phone = '02862875513'
export const api_key = '95400ee9'
export const api_secret = '8b72f759'
export const submission = {
  api_key,
  api_secret
}

export const configuration = {
  uri: 'sip:103@lifetekhcm026.ccall.vn',
  password: 'a.Kd.1xjnc',
};

// export const options = {
//   eventHandlers: eventHandlers,
//   sessionTimersExpires: 120,
//   mediaConstraints: { audio: true, video: false },
//   rtcOfferConstraints: {
//     offerToReceiveAudio: 1,
//     offerToReceiveVideo: 1,
//   },
//   rtcConstraints: { mandatory: { googIPv6: false } },
// };

// export const eventHandlers = {
//   accepted: function (e) {
//     console.trace('call accepted');
//   },
//   addstream: function (e) {
//     console.log('addstream');
//   },
//   confirmed: function (e) {
//     console.log('call confirmed');
//   },
//   connected: function (e) {
//     console.log('connected');
//   },
//   connecting: function (e) {
//     console.log('connecting');
//   },
//   disconnected: function (e) {
//     console.log('disconnected');
//   },
//   failed: function (e) {
//     console.log('call failed with cause: ' + e.data.cause);
//   },
//   ended: function (e) {
//     console.log('call ended with cause: ' + e.data.cause);
//   },
//   peerconnection: function (e) {
//     console.log('peerconnection');
//   },
//   progress: function (e) {
//     console.log('call is in progress');
//   },
// };
