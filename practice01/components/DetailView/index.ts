import Utils from '../../utils/index';
import {THUMBNAIL, CREATED_AT} from '../../constants/message';
import {getRecordById, updateRecord} from '../../service/RecordManager';
import {uploadFileAttachment, downloadFileAttachment} from '../../service/ImageManager';
import Button from '../BaseComponent/Button/index';
import Popup from '../Popup/index';
import {Thumbnail, CreatedAtLabel, RestoreButton, DownloadButton} from './components/index';
import {HistoryDTO, FileAttachmentDTO, FileKeyDTO, RestoreDTO} from './types';

import './index.css';
import ShowImage from '../ShowImage/index';
class DetailView {
  private static instance: DetailView;
  private recordId: number;
  private histories: HistoryDTO[];
  private fileAttachments: FileAttachmentDTO;
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

    container.appendChild(this.createButtonUpdate());
    container.appendChild(this.createHeader());
    content.appendChild(this.createTableView());
    container.appendChild(content);
    return container;
  }

  public async bind() {
    try {
      const result = await getRecordById(this.recordId);
      const strHistory = result?.fcHistoryImages?.value || null;
      const fileAttachments = result?.fcFileAttachment || null;
      if (strHistory) {
        this.histories = JSON.parse(strHistory);
        this.fileAttachments = fileAttachments;
        const recordElm = this.getDetailElm();
        if (recordElm) {
          recordElm.innerHTML = '';
        }
        this.render(this.histories, fileAttachments);
      }
    } catch (error) {
      Utils.handleError(error);
    }
  }

  private createButtonUpdate(): HTMLDivElement {
    const buttonUpdate = document.createElement('div');
    buttonUpdate.classList.add('cim-detailview-top');
    const btnOpenPopup = Button.render({
      id: 'btn_open_popup',
      class: 'success',
      text: 'Update',
    });
    buttonUpdate.appendChild(btnOpenPopup);
    btnOpenPopup.addEventListener('click', () => new Popup(this.recordId).open());
    return buttonUpdate;
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

  private createRecord(history: HistoryDTO, fileAttachment: FileKeyDTO, isNewest: boolean, index: number = 0) {
    const rowItem = document.createElement('tr');
    const thumbanil = Thumbnail.render(history.base64);
    thumbanil.addEventListener('click', () => this.showALargerImage(fileAttachment));
    rowItem.appendChild(thumbanil);
    rowItem.appendChild(CreatedAtLabel.render(Utils.timestampToString(history.createAt)));
    const restoreBtn: HTMLTableDataCellElement = RestoreButton.render(index, isNewest);
    const dowloadBtn: HTMLButtonElement = DownloadButton.render(index);
    if (isNewest === false) {
      restoreBtn.addEventListener('click', () => this.restoreImage(history, fileAttachment));
    }
    dowloadBtn.addEventListener('click', () => this.dowloadImage(fileAttachment, history.fullName));
    restoreBtn.appendChild(dowloadBtn);
    rowItem.appendChild(restoreBtn);
    return rowItem;
  }

  private render(histories: HistoryDTO[], fileAttachments: FileAttachmentDTO) {
    const maxLength = histories.length - 1;
    const recordElm = this.getDetailElm();
    for (let i = maxLength; i > -1; i--) {
      const history = histories[i];
      const fileAttachment: FileKeyDTO = fileAttachments.value[i] || null;
      if (history) {
        const isNewest = maxLength === i;
        recordElm.appendChild(this.createRecord(history, fileAttachment, isNewest, i));
      }
    }
  }

  private getDetailElm() {
    return document.querySelector('.cim-detailview-table').querySelector('.detail-record');
  }

  private async restoreImage(history: HistoryDTO, fileAttachment: FileKeyDTO) {
    try {
      history.createAt = new Date().getTime().toString();
      this.histories.push(history);
      const {blob} = await downloadFileAttachment(fileAttachment.fileKey);
      const upload: FileKeyDTO = await uploadFileAttachment(blob, fileAttachment.name);
      const fileKey = upload?.fileKey || '';
      this.fileAttachments.value.push({'fileKey': fileKey});
      const record: RestoreDTO = {
        'fcFileAttachment': this.fileAttachments,
        'fcHistoryImages': {'value': JSON.stringify(this.histories)}
      };
      await updateRecord(this.recordId, record);
      await this.bind();
    } catch (error) {
      Utils.handleError(error);
    }
  }

  private async dowloadImage(fileAttachment: FileKeyDTO, fullName: string) {
    if (fileAttachment) {
      try {
        const file = await downloadFileAttachment(fileAttachment.fileKey);
        this.createElmDownloadFile(file.blobUrl, fullName);
      } catch (error) {
        Utils.handleError(error);
      }
    }
  }

  private createElmDownloadFile(blobUrl: string, fileName: string) {
    const root = document.querySelector('.download-attachement');
    if (!root) {
      const divElm = document.createElement('div');
      divElm.classList.add('download-attachement');

      const aElm = document.createElement('a');
      aElm.setAttribute('href', blobUrl);
      aElm.setAttribute('download', fileName);
      divElm.appendChild(aElm);
      document.body.appendChild(divElm);
    } else {
      const aElm = root.querySelector('a');
      aElm.setAttribute('href', blobUrl);
      aElm.setAttribute('download', fileName);
    }
    const divFileDownload = (document.querySelector('.download-attachement a')) as HTMLElement;
    divFileDownload.click();
  }

  private async showALargerImage(fileAttachment: FileKeyDTO) {
    const {blob} = await downloadFileAttachment(fileAttachment.fileKey);
    const fileBase64: string = await Utils.fileToBase64(blob) as string;
    new ShowImage(fileBase64).open();
  }
}
export default DetailView;