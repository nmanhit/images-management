import {TITLE_HEADER} from './config';
import Popup from './components/Popup/index';
import ListView from './components/ListView/index';

kintone.events.on('app.record.index.show', () => {
  // const popup = new Popup();
  // popup.setHeader(TITLE_HEADER.TITLE_POPUP_UPLOAD);

  const listView = new ListView();


});