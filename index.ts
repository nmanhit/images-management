import {SCROLL_OFFSET, APP_FIELD_CODE} from './config';
import {ListView, DetailView} from './components/index';
import {MSG_HAVE_TO_USE_CUSTOMIZATION} from './constants/message';

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

function hideFields() {
  const fields = [APP_FIELD_CODE.FC_FILE_NAME, APP_FIELD_CODE.FC_FILE_ATTACHMENT, APP_FIELD_CODE.FC_HISTORY_IMAGES];
  fields.forEach(field => {
    kintone.app.record.setFieldShown(field, false);
  });
}

kintone.events.on('app.record.detail.show', (event: any) => {
  hideFields();
  const detailView = DetailView.getInstance(event.recordId);
  const detailSpaceElm = kintone.app.record.getSpaceElement(APP_FIELD_CODE.FC_IMAGE_DETAIL);
  detailSpaceElm.appendChild(detailView.init());
  detailView.bind();
});

kintone.events.on(['app.record.create.show', 'app.record.edit.show'], (event: any) => {
  hideFields();
});

kintone.events.on(['app.record.edit.submit', 'app.record.create.submit'], (event: any) => {
  event.error = MSG_HAVE_TO_USE_CUSTOMIZATION;
  return event;
});
