import {API_SERVICE_ENDPOINT, API_TOKEN} from '../../config';

function put(url: string, params: any) {
  const action = `${API_SERVICE_ENDPOINT}${url}.json`;
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', action);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('X-Cybozu-API-Token', API_TOKEN);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(xhr.responseText);
      }
    };
    xhr.send(params);
  });
}

export {put};