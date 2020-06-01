import Util from '../../../util';
import {API_SERVICE_ENDPOINT} from '../../../constants/index';

function get(url: string, data: any, header: any = {}, 
  responseType: XMLHttpRequestResponseType = null, onloadStart: any = null, onloadEnd: any = null) {
  let apiUrl = `${API_SERVICE_ENDPOINT}${url}.json`;
  const queryString = toQueryString(data);
  apiUrl = queryString ? `${apiUrl}?${queryString}` : apiUrl;

  return Util.request(apiUrl, 'GET', data, header, responseType, onloadStart, onloadEnd)
    .then((result: any) => {
      return JSON.parse(result);
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

export {get};
