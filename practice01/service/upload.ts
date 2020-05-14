// import KintoneAPI from './kintone';
// import { API_URL_FILE, API_URL_RECORD, API_URL_RECORDS } from '../constants/index';
// import { APP_ID, ITEMS_PER_PAGE } from '../config';

// export const uploadFile = async () => {
//   var blob = new Blob(["Sample Test File"], {type:"text\/plain"});
//   var formData = new FormData();
//   formData.append("file", blob , "test.txt");

//   await new KintoneAPI().post(API_URL_FILE ,formData).then(function(resp){
//     console.log(`upload:${resp}`)
//     return resp;
//   })
// }

// export const dowloadFile = async (fileKey: any) => {
//   await new KintoneAPI().get(API_URL_FILE, {fileKey: fileKey}).then(function(resp: any){
//     console.log(resp)
//     var blob = new Blob([resp.response]);
//     var url = window.URL || window.webkitURL;
//     var blobUrl = url.createObjectURL(blob);
//     console.log(blobUrl);
//     return resp;
//   })
// }

// export const addRecord = async(params: any) => {
//   var data = {
//     app: APP_ID,
//     record: {
//       ...params
//     },
//   };
//   await new KintoneAPI().post(API_URL_RECORD, data, false).then(function(resp: any){
//     console.log(resp)
//   })
// };

// export const getRecords = async(pageNum: number) => {
//   const offset = pageNum * ITEMS_PER_PAGE;
//   const query = `order by $id desc limit ${ITEMS_PER_PAGE} offset ${offset}`;
//   var data = {
//     app: APP_ID,
//     query: query
//   };
//   await new KintoneAPI().get(API_URL_RECORDS, data).then(function(resp: any){
//     console.log(resp)
//   })
// };
