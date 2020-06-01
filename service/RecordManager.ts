import {APP_ID, API_URL_RECORD, API_URL_RECORDS} from '../constants/index';
import {ITEMS_PER_PAGE} from '../config';
import {get, post, put} from './kintone/restapi/index';

async function getRecordById(RecordId: number) {
  const data = {
    '__REQUEST_TOKEN__': kintone.getRequestToken(),
    'app': APP_ID,
    'id': RecordId
  };
  const result = await get(API_URL_RECORD, data);
  return result?.record;
}

async function getNewestRecord() {
  const query = 'order by $id desc limit 1 offset 0';
  const data = {
    '__REQUEST_TOKEN__': kintone.getRequestToken(),
    'app': APP_ID,
    'query': query
  };
  const result = await get(API_URL_RECORDS, data);
  const total = result?.records?.length;
  return total > 0 ? result?.records[0] : null;
}

async function getRecords(pageNum: number, onloadStart?: Function, onloadEnd?: Function) {
  const offset = pageNum * ITEMS_PER_PAGE;
  const query = `order by $id desc limit ${ITEMS_PER_PAGE} offset ${offset}`;
  const data = {
    '__REQUEST_TOKEN__': kintone.getRequestToken(),
    'app': APP_ID,
    'query': query
  };
  const result = await get(API_URL_RECORDS, data, null, null, onloadStart, onloadEnd);
  return result?.records;
}

async function addRecord(params: any) {
  const data = {
    '__REQUEST_TOKEN__': kintone.getRequestToken(),
    'app': APP_ID,
    'record': {
      ...params
    },
  };
  const header = {'Content-Type': 'application/json'};
  const result = await post(API_URL_RECORD, JSON.stringify(data), header);
  return result;
}

async function updateRecord(recordId: number, params: any) {
  const data = {
    '__REQUEST_TOKEN__': kintone.getRequestToken(),
    'app': APP_ID,
    'id': recordId,
    'record': {
      ...params
    },
  };
  const header = {'Content-Type': 'application/json'};
  const result = await put(API_URL_RECORD, JSON.stringify(data), header);
  return result;
}

export default {getRecordById, getNewestRecord, getRecords, addRecord, updateRecord};
