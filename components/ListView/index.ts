import {ROOT_ID, TITLE_HEADER} from '../../config';
import Utils from '../../util';
import {LIST_VIEW_NO_PHOTO} from '../../constants/message';

import RecordManager from '../../service/RecordManager';
import Button from '../BaseComponent/Button/index';
import Popup from '../Popup/index';
import Card from './components/Card/index';
import Loading from './components/Loading/index';

import {CardDTO} from './types';
import {RecordDTO} from '../Popup/types';

import './index.css';
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
    const result = await RecordManager.getNewestRecord();
    const divMessage = this.getListViewContentEl().querySelector('.cim-listview-message');
    if (result) {
      if (divMessage) {
        divMessage.remove();
      }
      this.getListViewContentEl().prepend(this.createCardItem(result));
    }
  }

  public init() {
    const container = this.createDivContainer();
    const navBar = this.createNavBar();
    container.appendChild(navBar);
    navBar.appendChild(this.createHeader());
    container.appendChild(this.createDivContent());
    this.rootElm.appendChild(container);
    kintone.app.getHeaderMenuSpaceElement().appendChild(this.createButtonUpload());
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
    const fcFileAttachment = item?.fcFileAttachment.value || [];
    let fileKey: string = '';
    let name: string = '';

    if (fcFileAttachment.length > 0) {
      const data = fcFileAttachment[fcFileAttachment.length - 1];
      fileKey = data.fileKey;
      name = data.name;
    }
    const createdAt: string = Utils.utcToString(time);
    const card: CardDTO = {
      src: this.getDataImg(histories),
      fileName,
      uniqueId,
      createdAt,
      fileKey,
      name
    };
    return Card.render(card);
  }

  private async showCards(pageIdx: number) {
    try {
      this.isLoading = true;
      const result = await RecordManager.getRecords(pageIdx, () => {
        this.onloadStart();
      }, () => {
        this.onloadEnd();
      });
      if (!result || result.length === 0) {
        if (this.pageIdx === 0) {
          const divMessage = document.createElement('div');
          divMessage.classList.add('cim-listview-message');
          divMessage.innerText = LIST_VIEW_NO_PHOTO;
          this.getListViewContentEl().appendChild(divMessage);
        }
        this.pageIdx = -1;
      } else {
        this.pageIdx++;
        for (const item of result) {
          this.getListViewContentEl().append(this.createCardItem(item));
        }
      }
    } catch (error) {
      Utils.handleError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private getDataImg(histories: string) {
    if (!histories) {
      return '';
    }
    const historiesObj = JSON.parse(histories);
    const totalFiles = historiesObj.length;
    if (totalFiles > 0) {
      return historiesObj[totalFiles - 1].base64;
    }
    return '';
  }
}
export default ListView;
