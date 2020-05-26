import {post, download} from './Kintone/index';
import {API_URL_FILE} from '../constants/index';
import {FileKeyDTO} from '../components/DetailView/types';

export const uploadFile = async (blob: Blob, fileName: string) => {
  const formData = new FormData();
  formData.append('file', blob, fileName);
  const result = await post(API_URL_FILE, formData, false);
  return result as FileKeyDTO;
};

export const downloadAttachFile = async (fileKey: string) => {
  const result = await download(API_URL_FILE, {fileKey});
  return result;
};