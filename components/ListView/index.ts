import {ROOT_ID, API_SERVICE_ENDPOINT, TITLE_HEADER} from '../../config';
import Utils from '../../util';

import {getRecords, getNewestRecord} from '../../service/RecordManager';
import Button from '../BaseComponent/Button/index';
import Popup from '../Popup/index';
import Card from './components/Card/index';
import Loading from './components/Loading/index';

import './index.css';
import {CardDTO} from './types';
import {RecordDTO, HistoryImageDTO} from '../Popup/types';

class ListView {
  private rootElm: HTMLElement;
  private pageIdx: number;
  private isLoading: boolean;

  constructor() {
    this.rootElm = document.getElementById(ROOT_ID);
    this.pageIdx = 0;
    this.isLoading = false;
  }

  public async renderItem() {
    const result = await getNewestRecord();
    if (result) {
      this.getListViewContentEl().prepend(this.createCardItem(result));
    }
  }

  public init() {
    const container = this.createDivContainer();
    const navBar = this.createNavBar();
    container.appendChild(navBar);
    navBar.appendChild(this.createHeader());
    navBar.appendChild(this.createButtonUpload());
    container.appendChild(this.createDivContent());
    this.rootElm.appendChild(container);
  }

  public async bind() {
    await this.showCards(this.pageIdx);
  }

  public async lazyLoading() {
    if (this.pageIdx > -1 && this.isLoading === false) {
      await this.showCards(this.pageIdx);
    }
  }

  private getListViewContentEl() {
    return this.rootElm.querySelector('.cim-listview-content') as HTMLDivElement;
  }

  private openDetailPage(recordId: number): void {
    window.location.href = `${API_SERVICE_ENDPOINT}/k/${kintone.app.getId()}/show#record=${recordId}`;
  }

  private onloadStart() {
    const divContain = this.getListViewContentEl();
    if (divContain) {
      divContain.appendChild(Loading.render());
    }
  }

  private onloadEnd() {
    Loading.remove();
  }

  private createButtonUpload() {
    const buttonUpload = Button.render({
      id: 'btn_open_popup',
      class: 'success',
      text: 'Upload',
    });
    buttonUpload.addEventListener('click', () => new Popup().open());
    return buttonUpload;
  }

  private createHeader() {
    const header = document.createElement('div');
    header.classList.add('cim-listview-header');
    header.innerText = TITLE_HEADER.TITLE_LIST_IMAGE;
    return header;
  }

  private createDivContainer() {
    const container = document.createElement('div');
    container.classList.add('cim-listview-container');
    return container;
  }

  private createNavBar() {
    const navBar = document.createElement('div');
    navBar.classList.add('cim-nav-bar');
    return navBar;
  }

  private createDivContent() {
    const content = document.createElement('div');
    content.classList.add('cim-listview-content');
    return content;
  }

  private createCardItem(item: RecordDTO) {
    const histories = item?.fcHistoryImages?.value || '';
    const fileName = item?.fcFileName?.value || '';
    const uniqueId: number = item?.Record_number?.value || 0;
    const time = item?.Created_datetime?.value || '';
    const createdAt: string = Utils.utcToString(time);
    const card: CardDTO = {
      src: this.getDataImg(histories),
      fileName,
      uniqueId,
      createdAt
    };
    const divCard = Card.render(card);
    return divCard;
  }

  private async showCards(pageIdx: number) {
    this.isLoading = true;
    const result = await getRecords(pageIdx, () => {
      this.onloadStart();
    }, () => {
      this.onloadEnd();
    });
    if (!result || result.length === 0) {
      this.pageIdx = -1;
    } else {
      this.pageIdx++;
      for (const item of result) {
        this.getListViewContentEl().append(this.createCardItem(item));
      }
    }
    this.isLoading = false;
  }

  private getDataImg(histories: string) {
    if (!histories) {
      return '';
    }
    const historyArrayObj = JSON.parse(histories);
    const totalFiles = historyArrayObj.length;
    if (totalFiles > 0) {
      return historyArrayObj[totalFiles - 1].base64;
    }
    return '';
  }
}
export default ListView;
