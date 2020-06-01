import Util from '../../util';
import {API_SERVICE_ENDPOINT} from '../../constants/index';

function download(url: string, data: any, header: any = {}, onloadStart: any = null, onloadEnd: any = null) {
  let apiUrl = `${API_SERVICE_ENDPOINT}${url}.json`;
  const queryString = toQueryString(data);
  apiUrl = queryString ? `${apiUrl}?${queryString}` : apiUrl;
  return Util.request(apiUrl, 'GET', data, header, 'blob', onloadStart, onloadEnd)
    .then((result: any) => {
      const blob = new Blob([result]);
      const urlBlob = window.URL || window.webkitURL;
      const blobUrl = urlBlob.createObjectURL(blob);
      return ({blob, blobUrl});
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