import {get, post, put} from './Kintone/index';
import {API_URL_FILE, API_URL_RECORD, API_URL_RECORDS} from '../constants/index';
import {APP_ID, ITEMS_PER_PAGE} from '../config';
import {FileKeyDTO} from '../components/DetailView/types';

export const addRecord = async (params: any) => {
  const data = {
    app: APP_ID,
    record: {
      ...params
    },
  };
  const result = await post(API_URL_RECORD, JSON.stringify(data));
  return result;
};

export const getRecordById = async (RecordId: number) => {
  const data = {
    app: APP_ID,
    id: RecordId
  };
  const result = await get(API_URL_RECORD, data);
  return result?.record;
};

export const getRecords = async (pageNum: number, onloadStart?: Function, onloadEnd?: Function) => {
  const offset = pageNum * ITEMS_PER_PAGE;
  const query = `order by $id desc limit ${ITEMS_PER_PAGE} offset ${offset}`;
  const data = {
    app: APP_ID,
    query: query
  };
  const result = await get(API_URL_RECORDS, data, onloadStart, onloadEnd);
  return result?.records;
};

export const getNewestRecord = async () => {
  const query = 'order by $id desc limit 1 offset 0';
  const data = {
    app: APP_ID,
    query: query
  };
  const result = await get(API_URL_RECORDS, data);
  const total = result?.records?.length;
  return total > 0 ? result?.records[0] : null;
};

export const updateRecord = async (recordId: number, params: any) => {
  const data = {
    app: APP_ID,
    id: recordId,
    record: {
      ...params
    },
  };
  const result = await put(API_URL_RECORD, JSON.stringify(data));
  return result;
};

export const uploadFile = async (blob: Blob, fileName: string) => {
  const formData = new FormData();
  formData.append('file', blob, fileName);
  const result = await post(API_URL_FILE, formData, false);
  return result as FileKeyDTO;
};