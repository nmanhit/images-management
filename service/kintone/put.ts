import {API_SERVICE_ENDPOINT} from '../../constants/index';

function put(url: string, params: any) {
  const action = `${API_SERVICE_ENDPOINT}${url}.json`;
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', action);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
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