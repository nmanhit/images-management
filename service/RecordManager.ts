import {get, post, put} from './Kintone/index';
import {APP_ID, API_URL_RECORD, API_URL_RECORDS} from '../constants/index';
import {ITEMS_PER_PAGE} from '../config';

async function getRecordById(RecordId: number) {
  const data = {
    app: APP_ID,
    id: RecordId
  };
  const result = await get(API_URL_RECORD, data);
  return result?.record;
}

async function getNewestRecord() {
  const query = 'order by $id desc limit 1 offset 0';
  const data = {
    app: APP_ID,
    query: query
  };
  const result = await get(API_URL_RECORDS, data);
  const total = result?.records?.length;
  return total > 0 ? result?.records[0] : null;
}

async function getRecords(pageNum: number, onloadStart?: Function, onloadEnd?: Function) {
  const offset = pageNum * ITEMS_PER_PAGE;
  const query = `order by $id desc limit ${ITEMS_PER_PAGE} offset ${offset}`;
  const data = {
    app: APP_ID,
    query: query
  };
  const result = await get(API_URL_RECORDS, data, onloadStart, onloadEnd);
  return result?.records;
}

async function addRecord(params: any) {
  const data = {
    app: APP_ID,
    record: {
      ...params
    },
  };
  const result = await post(API_URL_RECORD, JSON.stringify(data));
  return result;
}

async function updateRecord(recordId: number, params: any) {
  const data = {
    app: APP_ID,
    id: recordId,
    record: {
      ...params
    },
  };
  const result = await put(API_URL_RECORD, JSON.stringify(data));
  return result;
}

export default {getRecordById, getNewestRecord, getRecords, addRecord, updateRecord};
