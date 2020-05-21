import Utils from '../../utils/index';
import {THUMBNAIL, CREATED_AT} from '../../constants/message';
import {getRecordById, uploadFile, updateRecord} from '../../service/ImageManager';
import Button from '../BaseComponent/Button/index';
import Popup from '../Popup/index';
import {Thumbnail, CreatedAtLabel, ActionRestore} from './components/index';
import {HistoryDTO, FileKeyDTO, RestoreDTO} from './types';

import './index.css';
class DetailView {
  private static instance: DetailView;
  private recordId: number;
  private histories: HistoryDTO[];
  constructor(recordId?: number) {
    if (recordId) {
      this.recordId = recordId;
    }
  }

  public static getInstance(recordId?: number): DetailView {
    if (!DetailView.instance) {
      DetailView.instance = new DetailView(recordId);
    }
    return DetailView.instance;
  }

  public init(): HTMLDivElement {
    const container = document.createElement('div');
    container.classList.add('cim-detailview-container');
    const content = document.createElement('div');
    content.classList.add('cim-detailview-content');

    container.appendChild(this.createButtonUpload());
    container.appendChild(this.createHeader());
    content.appendChild(this.createTableView());
    container.appendChild(content);
    return container;
  }

  public async bind() {
    try {
      const result = await getRecordById(this.recordId);
      const strHistory = result?.fcHistoryImages?.value || null;
      if (strHistory) {
        this.histories = JSON.parse(strHistory);
        this.render(this.histories);
      }
    } catch (error) {
      Utils.handleError(error);
    }
  }

  public addRecordAtLocal(history: HistoryDTO) {
    this.histories.push(history);
    const recordElm = this.getDetailElm();
    const rowItem = this.createRecord(history, false, this.totalRecord());
    rowItem.setAttribute('class', 'row newest');
    recordElm.querySelector('.row.newest').setAttribute('class', 'row');
    recordElm.prepend(rowItem);
  }

  private createButtonUpload(): HTMLDivElement {
    const buttonUpload = document.createElement('div');
    buttonUpload.classList.add('cim-detailview-top');
    const btnOpenPopup = Button.render({
      id: 'btn_open_popup',
      class: 'success',
      text: 'Upload',
    });
    buttonUpload.appendChild(btnOpenPopup);
    btnOpenPopup.addEventListener('click', () => new Popup(this.recordId).open());
    return buttonUpload;
  }

  private createHeader(): HTMLDivElement {
    const header = document.createElement('div');
    header.classList.add('cim-detailview-header');
    return header;
  }

  private createTableView(): HTMLTableElement {
    const table = document.createElement('table');
    table.classList.add('cim-detailview-table');
    const thead = document.createElement('thead');
    const tHeadTr = document.createElement('tr');
    const thThumbnail = document.createElement('th');
    thThumbnail.innerText = THUMBNAIL;
    const thCreatedAt = document.createElement('th');
    thCreatedAt.innerText = CREATED_AT;
    const thAction = document.createElement('th');
    tHeadTr.appendChild(thThumbnail);
    tHeadTr.appendChild(thCreatedAt);
    tHeadTr.appendChild(thAction);
    thead.appendChild(tHeadTr);
    const tbody = document.createElement('tbody');
    tbody.classList.add('detail-record');
    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
  }

  private createRecord(history: HistoryDTO, isNewest: boolean, index: number = 0) {
    const rowItem = document.createElement('tr');
    rowItem.appendChild(Thumbnail.render(history.base64));
    rowItem.appendChild(CreatedAtLabel.render(Utils.timestampToString(history.createAt)));
    const restoreBtn: HTMLTableDataCellElement = ActionRestore.render(index, isNewest);
    restoreBtn.addEventListener('click', () => this.restoreImage(history));
    rowItem.appendChild(restoreBtn);
    return rowItem;
  }

  private render(histories: HistoryDTO[]) {
    const maxLength = histories.length - 1;
    const recordElm = this.getDetailElm();
    for (let i = maxLength; i > -1; i--) {
      const history = histories[i];
      if (history) {
        const isNewest = maxLength === i;
        recordElm.appendChild(this.createRecord(history, isNewest, i));
      }
    }
  }

  private getDetailElm() {
    return document.querySelector('.cim-detailview-table').querySelector('.detail-record');
  }

  private totalRecord() {
    const recordElm = this.getDetailElm();
    return recordElm.childElementCount;
  }

  private async restoreImage(history: HistoryDTO) {
    history.createAt = new Date().getTime().toString();
    this.addRecordAtLocal(history);
    const fileBlob: Blob = Utils.b64toBlob(history.base64, history.fileType);
    try {
      const upload: FileKeyDTO = await uploadFile(fileBlob, history.fullName);
      const fileKey = upload?.fileKey || '';
      const record: RestoreDTO = {
        'fcFileAttachment': {'value': [{fileKey}]},
        'fcHistoryImages': {'value': JSON.stringify(this.histories)}
      };
      await updateRecord(this.recordId, record);
    } catch (error) {
      Utils.handleError(error);
    }
  }
}
export default DetailView;