import {download} from './kintone/index';
import {post} from './kintone/restapi/index';
import {API_URL_FILE} from '../constants/index';
import {FileKeyDTO} from '../components/DetailView/types';

export const uploadFileAttachment = async (blob: Blob, fileName: string) => {
  const formData = new FormData();
  formData.append('__REQUEST_TOKEN__', kintone.getRequestToken());
  formData.append('file', blob, fileName);
  const result = await post(API_URL_FILE, formData, false);
  return result as FileKeyDTO;
};

export const downloadFileAttachment = async (fileKey: string) => {
  const data = {
    'fileKey': fileKey,
    '__REQUEST_TOKEN__': kintone.getRequestToken()
  };
  const result = await download(API_URL_FILE, data);
  return result;
};