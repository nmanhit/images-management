import {APP_FIELD_CODE} from '../../config';
import Utils from '../../util';
import {THUMBNAIL, CREATED_AT} from '../../constants/message';
import RecordManager from '../../service/RecordManager';
import {uploadFileAttachment, downloadFileAttachment} from '../../service/ImageManager';
import Button from '../BaseComponent/Button/index';
import Popup from '../Popup/index';
import {Thumbnail, CreatedAtLabel, RestoreButton, DownloadButton} from './components/index';
import {HistoryDTO, FileAttachmentDTO, FileKeyDTO, RestoreDTO} from './types';

import './index.css';
import ShowImage from '../ShowImage/index';
import Loading from '../ListView/components/Loading/index';

type Props = {
  recordId?: number;
  histories?: HistoryDTO[];
  fileAttachments?: FileAttachmentDTO;
}
class DetailView {
  private static instance: DetailView;
  private props: Props;

  constructor(props?: Props) {
    if (props) {
      this.props = props;
    }
  }

  public static getInstance(props?: Props): DetailView {
    if (!DetailView.instance) {
      DetailView.instance = new DetailView(props);
    }
    return DetailView.instance;
  }

  public initUI() {
    const container = document.createElement('div');
    container.classList.add('cim-detailview-container');
    const content = document.createElement('div');
    content.classList.add('cim-detailview-content');
    kintone.app.record.getHeaderMenuSpaceElement().appendChild(this.createButtonUpdate());
    container.appendChild(this.createHeader());
    content.appendChild(this.createTableView());
    container.appendChild(content);
    const detailSpaceElm = kintone.app.record.getSpaceElement(APP_FIELD_CODE.FC_IMAGE_DETAIL) as HTMLDivElement;
    detailSpaceElm.appendChild(container);
  }

  public render(record: any) {
    const strHistories = record?.fcHistoryImages?.value || null;
    const fileAttachments = record?.fcFileAttachment || null;
    if (strHistories) {
      this.props.histories = JSON.parse(strHistories);
      this.props.fileAttachments = fileAttachments;
    }
    const detailElm = this.getDetailElm();
    if (detailElm) {
      detailElm.innerHTML = '';
    }
    this.createHtml();
  }

  private createHtml() {
    const totalItem = this.props.histories.length - 1;
    const recordElm = this.getDetailElm();
    for (let i = totalItem; i > -1; i--) {
      const history = this.props.histories[i];
      const fileAttachment: FileKeyDTO = this.props.fileAttachments.value[i] || null;
      if (history && fileAttachment) {
        const isNewest = totalItem === i;
        recordElm.appendChild(this.createRow(history, fileAttachment, isNewest, i));
      }
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
    btnOpenPopup.addEventListener('click', () => new Popup(this.props.recordId).open());
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
    tHeadTr.appendChild(thThumbnail);

    const thCreatedAt = document.createElement('th');
    thCreatedAt.innerText = CREATED_AT;
    tHeadTr.appendChild(thCreatedAt);

    const thAction = document.createElement('th');
    tHeadTr.appendChild(thAction);
    thead.appendChild(tHeadTr);

    const tbody = document.createElement('tbody');
    tbody.classList.add('detail-record');
    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
  }

  private createRow(history: HistoryDTO, fileAttachment: FileKeyDTO, isNewest: boolean, index: number = 0) {
    const row = document.createElement('tr');
    const thumbnail = Thumbnail.render(history.base64);
    thumbnail.addEventListener('click', () => this.showALargerImage(fileAttachment));

    row.appendChild(thumbnail);
    row.appendChild(CreatedAtLabel.render(Utils.timestampToString(history.createAt)));

    const restoreBtn: HTMLTableDataCellElement = RestoreButton.render(index, isNewest);
    const dowloadBtn: HTMLButtonElement = DownloadButton.render(index);
    if (isNewest === false) {
      restoreBtn.addEventListener('click', () => this.restoreImage(history, fileAttachment));
    }
    dowloadBtn.addEventListener('click', () => this.dowloadImage(event, fileAttachment, history.fullName));
    restoreBtn.appendChild(dowloadBtn);
    row.appendChild(restoreBtn);
    return row;
  }

  private getDetailElm() {
    return document.querySelector('.cim-detailview-table').querySelector('.detail-record');
  }

  private async restoreImage(history: HistoryDTO, fileAttachment: FileKeyDTO) {
    try {
      Loading.beforeSend();
      history.createAt = new Date().getTime().toString();
      this.props.histories.push(history);
      const {blob} = await downloadFileAttachment(fileAttachment.fileKey);
      const upload: FileKeyDTO = await uploadFileAttachment(blob, fileAttachment.name);
      const fileKey = upload?.fileKey || '';
      this.props.fileAttachments.value.push({'fileKey': fileKey});
      const data: RestoreDTO = {
        'fcFileAttachment': this.props.fileAttachments,
        'fcHistoryImages': {'value': JSON.stringify(this.props.histories)}
      };
      await RecordManager.updateRecord(this.props.recordId, data);
      const record = await RecordManager.getRecordById(this.props.recordId);
      this.render(record);
    } catch (error) {
      Utils.handleError(error);
    } finally {
      Loading.success();
    }
  }

  private async dowloadImage(event: Event, fileAttachment: FileKeyDTO, fullName: string) {
    event.stopPropagation();
    if (fileAttachment) {
      try {
        const {blobUrl} = await downloadFileAttachment(fileAttachment.fileKey);
        Utils.createElmDownloadFile(blobUrl, fullName);
      } catch (error) {
        Utils.handleError(error);
      }
    }
  }

  private async showALargerImage(fileAttachment: FileKeyDTO) {
    const {blob} = await downloadFileAttachment(fileAttachment.fileKey);
    const fileBase64: string = await Utils.fileToBase64(blob) as string;
    new ShowImage(fileBase64).open();
  }
}
export default DetailView;