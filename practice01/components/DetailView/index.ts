import {getRecordById} from '../../service/ImageManager';
import Button from '../BaseComponent/Button/index';
import Popup from '../Popup/index';
import Thumbnail from './components/Thumbnail/index';
import CreatedAt from './components/CreatedAt/index';
import ActionRestore from './components/ActionRestore/index';

import './index.css';
import { timestampToString } from '../../utils/index';

class DetailView {
  private rootId: string;
  private recordId: number;
  constructor(rootId: string, recordId: number) {
    this.rootId = rootId;
    this.recordId = recordId;
  }

  public createBaseHTML(): HTMLDivElement {
    const container = document.createElement('div');
    container.classList.add('cim-detailview-container');

    const topAction = document.createElement('div');
    topAction.classList.add('cim-detailview-top');
    container.appendChild(topAction);
    const btnOpenPopup = new Button().render({
      id: 'btn_open_popup',
      class: 'primary',
      text: 'Upload',
    });
    topAction.appendChild(btnOpenPopup);
    btnOpenPopup.addEventListener('click', () => new Popup(this.rootId, this.recordId).open());

    const header = document.createElement('div');
    header.classList.add('cim-detailview-header');
    container.appendChild(header);

    const content = document.createElement('div');
    content.classList.add('cim-detailview-content');
    const table = document.createElement('table');
    table.setAttribute('id', 'cim-detailview-table');
    table.classList.add('cim-detailview-table');
    const thead = document.createElement('thead');
    const tHeadTr = document.createElement('tr');
    const thThumbnail = document.createElement('th');
    thThumbnail.innerText = 'Thumbnail';
    const thCreatedAt = document.createElement('th');
    thCreatedAt.innerText = 'Created At'
    const thAction = document.createElement('th');
    tHeadTr.appendChild(thThumbnail);
    tHeadTr.appendChild(thCreatedAt);
    tHeadTr.appendChild(thAction);
    thead.appendChild(tHeadTr);
    const tbody = document.createElement('tbody');
    tbody.classList.add('detail-record')
    table.appendChild(thead);
    table.appendChild(tbody);

    content.appendChild(table);
    container.appendChild(content);
    return container;
  }

  public bindingData(recordId: number) {
    this.getData(recordId);
  }

  private render(record: any) {
    if(record?.fcHistoryImages) {
      const data = JSON.parse(record.fcHistoryImages.value);
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if(item){
          const rowItem = document.createElement('tr');
          rowItem.appendChild(new Thumbnail().render(item.base64));
          rowItem.appendChild(new CreatedAt().render(timestampToString(item.createAt)));
          rowItem.appendChild(new ActionRestore().render(i));
          document.getElementById('cim-detailview-table').querySelector('.detail-record').appendChild(rowItem);
        }
      }
    }
  }

  private async getData(recordId: number) {
    const result = await getRecordById(recordId);
    if(result){
      this.render(result);
    }
  }
}
export default DetailView;