import Util from '../../../util';
import {API_SERVICE_ENDPOINT} from '../../../constants/index';

function put(url: string, data: any, header: any = {}, onloadStart: any = null, onloadEnd: any = null) {
  const apiUrl = `${API_SERVICE_ENDPOINT}${url}.json`;
  return Util.request(apiUrl, 'PUT', data, header, onloadStart, onloadEnd)
    .then((result: any) => {
      return JSON.parse(result);
    });
}

export {put};