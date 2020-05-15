import {SCROLL_OFFSET} from './config';
import ListView from './components/ListView/index';

kintone.events.on('app.record.index.show', () => {
  const listView = new ListView();
  listView.bindingData();

  window.onscroll = function() {
    const pageHeight = document.body.scrollHeight;
    const scrollPoint = window.scrollY + window.innerHeight;
    if (scrollPoint + SCROLL_OFFSET >= pageHeight) {
      console.log('lAZY loading....');
      listView.lazyLoading();
    }
  };
});