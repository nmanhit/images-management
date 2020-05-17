import {SCROLL_OFFSET} from './config';
import ListView from './components/ListView/index';
import DeailView from './components/DetailView/index';

kintone.events.on('app.record.index.show', () => {
  const listView = new ListView();
  listView.bindingData();
  window.onscroll = function() {
    const pageHeight = document.body.scrollHeight;
    const scrollPoint = window.scrollY + window.innerHeight;
    if (scrollPoint + SCROLL_OFFSET >= pageHeight) {
      listView.lazyLoading();
    }
  };
});

kintone.events.on('app.record.detail.show', (event: any) => {
  kintone.app.record.setFieldShown('fcFileName', false);
  kintone.app.record.setFieldShown('fcFileAttachment', false);
  kintone.app.record.setFieldShown('fcHistoryImages', false);
  const detailSpaceElm = kintone.app.record.getSpaceElement('fcImageDetail');
  const detailView = new DeailView(detailSpaceElm.getAttribute('id'), event.recordId);
  detailSpaceElm.appendChild(detailView.createBaseHTML());
  detailView.bindingData(event.recordId);
});