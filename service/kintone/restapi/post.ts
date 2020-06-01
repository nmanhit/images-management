import Util from '../../../util';

import {API_SERVICE_ENDPOINT} from '../../../constants/index';

function post(url: string, data: any, header: any = {}, onloadStart: any = null, onloadEnd: any = null) {
  const apiUrl = `${API_SERVICE_ENDPOINT}${url}.json`;
  return Util.request(apiUrl, 'POST', data, header, onloadStart, onloadEnd)
    .then((result: any) => {
      return JSON.parse(result);
    });
}

export {post};
