import {API_SERVICE_ENDPOINT, API_TOKEN} from '../../config';
import {CALL_KINTONE_API_ERROR} from '../../constants/message';

function post(url: string, params: any, addContentType: boolean = true) {
  const action = `${API_SERVICE_ENDPOINT}${url}.json`;
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', action);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('X-Cybozu-API-Token', API_TOKEN);
    if (addContentType) {
      xhr.setRequestHeader('Content-Type', 'application/json');
    }
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

export {post};

