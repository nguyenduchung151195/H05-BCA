import { BASE_URL, APPROVE_URL, API_LOGIN, APP_URL } from '../config/urlConfig';

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  // console.log(response.json());
  // response.json().then(result => {
  //   // if(result.data.error_cod)
  // });
  return response.json();
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
// function checkStatus(response) {
//   if (response.status >= 200 && response.status < 300) {
//     // console.log(response);
//     return response;
//   }

//   const error = new Error(response.statusText);
//   error.response = response;
//   throw error;
// }

// eslint-disable-next-line consistent-return
async function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    // console.log(response);
    return response;
  }
  // if (response.status === 404) {
  //   // console.log(response);
  //   return response;
  // }
  await response.json().then(res => {
    const error = new Error(res.err || res.message || res.error||  '');
    // error.response = ;
    throw error;
  });
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */

/* eslint no-param-reassign: ["error", { "props": false }] */


export function requestCustom(url, options) {
  const newHeaders = Object.assign(
    {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    options.headers,
  );
  options.headers = newHeaders;
  return fetch(url, options)
    .then(checkStatusCustom)
    .then(parseJSON);
}
async function checkStatusCustom(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  await response.json().then(res => {
    throw res;
  });
}
export default function request(url, options) {
  const newHeaders = Object.assign(
    {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    options.headers,
  );
  options.headers = newHeaders;
  // options.credentials = 'include';
  // if (localStorage.getItem('tokenBase') && localStorage.getItem('token')) {
  //   const tokenBase = JSON.parse(localStorage.getItem('tokenBase'));
  //   if (new Date().getTime() / 1000 >= Number(tokenBase.expiried) - 100 && new Date().getTime() / 1000 < Number(tokenBase.expiried)) {
  //     refreshToken(options);
  //   } else if (new Date().getTime() / 1000 >= Number(tokenBase.expiried)) {
  //     localStorage.clear();
  //     // eslint-disable-next-line no-alert
  //     alert('Phiên làm việc đã hết hạn!');
  //     window.location.href = '/';
  //   }
  // }
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON);
}

export function requestAuth(url, options) {
  const newHeaders = Object.assign(
    {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenBase')).access_token}`,
    },
    options.headers,
  );
  options.headers = newHeaders;
  // options.credentials = 'include';
  if (localStorage.getItem('tokenBase') && localStorage.getItem('token')) {
    const tokenBase = JSON.parse(localStorage.getItem('tokenBase'));
    if (new Date().getTime() / 1000 >= Number(tokenBase.expiried) - 100 && new Date().getTime() / 1000 < Number(tokenBase.expiried)) {
      refreshToken(options);
    } else if (new Date().getTime() / 1000 >= Number(tokenBase.expiried)) {
      localStorage.clear();
      // eslint-disable-next-line no-alert
      alert('Phiên làm việc đã hết hạn!');
      window.location.href = '/';
    }
  }
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON);
}

export function refreshToken() {
  const tokenBase = JSON.parse(localStorage.getItem('tokenBase'));
  const newHeaders = Object.assign({
    // Authorization: `Bearer ${tokenBase.refresh_token}`,
    'Content-Type': 'application/json;charset=UTF-8',
  });
  // options.credentials = 'include';

  const body = {
    client_id: 'authServer',
    grant_type: 'refresh_token',
    scope: 'user',
    refresh_token: tokenBase.refresh_token,
  };

  return fetch(`${API_LOGIN}`, {
    headers: newHeaders,
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .then(result => {
      result.expiried = Math.floor(new Date().getTime() / 1000 + Number(result.expires_in));
      localStorage.setItem('tokenBase', JSON.stringify(result));
      requestBase({}, '70_CRM', `${APP_URL}/api/oauth/callback`).then(z => {
        const { data, success } = z;
        if (success === false) {
          throw new Error('Lỗi xác thực không thành công');
        }
        localStorage.setItem('token', data.token);
      });
      if (localStorage.getItem('approveToken')) {
        requestBase({}, '10_ApproveSystem', `${APPROVE_URL}/api/oauth/callback`).then(a => {
          const { data, success } = a;
          if (success === false) {
            throw new Error('Lỗi xác thực không thành công');
          }
          localStorage.setItem('approveToken', data.token);
        });
      }
    });
}

export function requestBase(options, clientId, clientURL) {
  const tokenBase = JSON.parse(localStorage.getItem('tokenBase'));
  const newHeaders = Object.assign(
    {
      Authorization: `Bearer ${tokenBase.access_token}`,
    },
    options.headers,
  );
  options.headers = newHeaders;
  // options.credentials = 'include';

  return fetch(
    `${BASE_URL}/oauth/authorize?client_id=${clientId}&allowed=true&redirect_uri=${clientURL}&state=antiCSRF&response_type=code&scope=user`,
    options,
  )
    .then(checkStatus)
    .then(parseJSON);
}

export function requestApprove(url, options) {
  const approveToken = localStorage.getItem('approveToken');
  // console.log(approveToken);
  if (approveToken) {
    const newHeaders = Object.assign(
      {
        Authorization: `Bearer ${approveToken}`,
      },
      options.headers,
    );
    options.headers = newHeaders;
    // options.credentials = 'include';

    return fetch(url, options)
      .then(checkStatus)
      .then(parseJSON);
  }
  return requestBase({}, '10_ApproveSystem', `${APPROVE_URL}/api/oauth/callback`)
    .then(result => {
      const { data, success } = result;
      if (success === false) {
        throw new Error('Lỗi xác thực không thành công');
      }
      localStorage.setItem('approveToken', data.token);
      const newHeaders = Object.assign(
        {
          Authorization: `Bearer ${data.token}`,
        },
        options.headers,
      );
      options.headers = newHeaders;
      // options.credentials = 'include';

      return fetch(url, options);
      // .then(checkStatus)
      // .then(parseJSON);
    })
    .then(checkStatus)
    .then(parseJSON);
}

export function requestFile(url, options) {
  const newHeaders = Object.assign(options.headers);
  options.headers = newHeaders;
  options.credentials = 'include';

  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON);
}

export function requestUploadImage(url, options) {
  const newHeaders = Object.assign(options.headers);
  options.headers = newHeaders;

  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON);
}
