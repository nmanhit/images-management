import {SCROLL_OFFSET, APP_FIELD_CODE} from './config';
import {ListView, DetailView} from './components/index';
import {MSG_HAVE_TO_USE_CUSTOMIZATION} from './constants/message';
import RecordManager from './service/RecordManager';

kintone.events.on('app.record.index.show', () => {
  const listView = new ListView();
  listView.init();
  listView.bind();
  window.onscroll = function() {
    const pageHeight = document.body.scrollHeight;
    const scrollPoint = window.scrollY + window.innerHeight;
    if (scrollPoint + SCROLL_OFFSET >= pageHeight) {
      listView.lazyLoading();
    }
  };
});

kintone.events.on('app.record.detail.show', async (event: any) => {
  hideFields();
  const recordId = event.recordId;
  const record = await RecordManager.getRecordById(recordId);
  const detailView = DetailView.getInstance({recordId});
  detailView.initUI();
  detailView.render(record);
});

kintone.events.on(['app.record.create.show', 'app.record.edit.show'], (event: any) => {
  hideFields();
});

kintone.events.on(['app.record.edit.submit', 'app.record.create.submit'], (event: any) => {
  event.error = MSG_HAVE_TO_USE_CUSTOMIZATION;
  return event;
});

function hideFields() {
  const fields = [APP_FIELD_CODE.FC_FILE_NAME, APP_FIELD_CODE.FC_FILE_ATTACHMENT, APP_FIELD_CODE.FC_HISTORY_IMAGES];
  fields.forEach(field => {
    kintone.app.record.setFieldShown(field, false);
  });
}
