import {API_SERVICE_ENDPOINT} from '../../constants/index';

function download(url: string, params: any, onloadStart?: any, onloadEnd?: any) {
  let action = `${API_SERVICE_ENDPOINT}${url}.json`;
  const query = toQueryString(params);
  action = query ? `${action}?${query} ` : action;
  return new kintone.Promise((resolve: Function, reject: Function) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', action);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.responseType = 'blob';
    if (onloadStart) {
      xhr.onloadstart = onloadStart;
    }
    if (onloadEnd) {
      xhr.onloadend = onloadEnd;
    }
    xhr.onload = function() {
      if (xhr.status === 200) {
        const blob = new Blob([xhr.response]);
        const urlBlob = window.URL || window.webkitURL;
        const blobUrl = urlBlob.createObjectURL(blob);
        resolve({blob, blobUrl});
      } else {
        reject(xhr.responseText);
      }
    };
    xhr.send(params);
  });
}

function toQueryString(params: any) {
  const parts = [];
  for (const i in params) {
    if (Object.prototype.hasOwnProperty.call(params, i)) {
      parts.push(encodeURIComponent(i) + '=' + encodeURIComponent(params[i]));
    }
  }
  return parts.join('&');
}

export {download};
