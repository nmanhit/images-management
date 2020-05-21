import {SCROLL_OFFSET, APP_FIELD_CODE} from './config';
import {ListView, DetailView} from './components/index';

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

function hideFields(fields: string[]) {
  fields.forEach(field => {
    kintone.app.record.setFieldShown(field, false);
  });
}

kintone.events.on('app.record.detail.show', (event: any) => {
  const fieldsToHide = [APP_FIELD_CODE.FC_FILE_NAME, APP_FIELD_CODE.FC_FILE_ATTACHMENT, APP_FIELD_CODE.FC_HISTORY_IMAGES];
  hideFields(fieldsToHide);
  const detailView = DetailView.getInstance(event.recordId);
  const detailSpaceElm = kintone.app.record.getSpaceElement(APP_FIELD_CODE.FC_IMAGE_DETAIL);
  detailSpaceElm.appendChild(detailView.init());
  detailView.bind();
});