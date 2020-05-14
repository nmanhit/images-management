import {API_SERVICE_ENDPOINT, API_TOKEN} from '../../config';
import {CALL_KINTONE_API_ERROR} from '../../constants/message';

function get(url: string, params: any) {
  let action = `${API_SERVICE_ENDPOINT}${url}.json`;
  const query = toQueryString(params);
  action = query ? `${action}?${query}` : action;
  return new kintone.Promise((resolve: Function, reject: Function) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', action);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('X-Cybozu-API-Token', API_TOKEN);
    xhr.onload = function() {
      if (xhr.status === 200) {
        resolve({
          error: false,
          message: null,
          data: xhr.responseText,
        });
      } else {
        reject({
          error: true,
          message: CALL_KINTONE_API_ERROR,
          data: xhr.responseText,
        });
      }
    };
    xhr.send(params);
  });
}

function toQueryString(params: any) {
  const parts = [];
  for (const i in params) {
    if (params.hasOwnProperty.call(i)) {
      parts.push(encodeURIComponent(i) + '=' + encodeURIComponent(params[i]));
    }
  }
  return parts.join('&');
}

export {get};
