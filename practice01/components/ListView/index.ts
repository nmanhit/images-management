import {ROOT_ID, API_SERVICE_ENDPOINT} from '../../config';

import {getRecords, getNewestRecord} from '../../service/ImageManager';
import Button from '../BaseComponent/Button/index';
import Popup from '../Popup/index';
import Card from './components/Card/index';

import './index.css';

class ListView {
  private rootElm: HTMLElement;
  private pageNum: number;
  private isLoading: boolean;

  constructor() {
    this.rootElm = document.getElementById(ROOT_ID);
    this.pageNum = 0;
    this.isLoading = false;
  }

  private getHeaderEl(): HTMLDivElement {
    return this.rootElm.querySelector('.cim-listview-header') as HTMLDivElement;
  }

  private getListViewContentEl() {
    return this.rootElm.querySelector('.cim-listview-content') as HTMLDivElement;
  }
  
  private openDetailPage(recordId: number): void {
    window.location.href = `${API_SERVICE_ENDPOINT}/k/${kintone.app.getId()}/show#record=${recordId}`;
  }

  public setHeader(headerContent: string): void {
    this.getHeaderEl().textContent = headerContent;
  }

  public async bindingData(pageNum?: number) {
    const result = await getRecords(pageNum | 0);
    if (result?.records) {
      await this.render(result.records);
    }
  }

  public async renderItem() {
    const result = await getNewestRecord();
    if (result?.records) {
      await this.render(result.records, true);
    }
  }

  private async render(cards: any, addFirst: boolean = false) {
    if (addFirst) {
      this.addImageToDOM(cards, this.getListViewContentEl(), true);
    } else {
      const container = document.createElement('div');
      container.classList.add('cim-listview-container');

      const topAction = document.createElement('div');
      topAction.classList.add('cim-listview-top');
      container.appendChild(topAction);
      const btnOpenPopup = new Button().render({
        id: 'btn_open_popup',
        class: 'primary',
        text: 'Upload',
      });
      topAction.appendChild(btnOpenPopup);
      btnOpenPopup.addEventListener('click', () => new Popup(ROOT_ID).open());

      const header = document.createElement('div');
      header.classList.add('cim-listview-header');
      container.appendChild(header);

      const content = document.createElement('div');
      content.classList.add('cim-listview-content');
      this.addImageToDOM(cards, content);
      container.appendChild(content);
      this.rootElm.appendChild(container);
    }
  }

  private addImageToDOM(cards: any, elm: HTMLDivElement, insertBefore: boolean = false): void {
    for (const card of cards) {
      const imageNewest = this.getImageNewest(card.fcHistoryImages.value);
      const recordId: number = card.Record_number.value;
      const recordElm = new Card().render({
        'src': imageNewest || '',
        'fileName': card.fcFileName.value,
        'id': `image-${recordId}`,
        'unique': recordId
      });
      recordElm.addEventListener('click', () => this.openDetailPage(recordId));
      insertBefore ? elm.prepend(recordElm) : elm.appendChild(recordElm);
    }
  }

  private async bindingRecords(pageNum: number) {
    const cards: HTMLDivElement[] = [];
    const result = await getRecords(pageNum);
    if (!result || !result.records) {
      return cards;
    }
    for (const item of result.records) {
      if (item) {
        const imageNewest = this.getImageNewest(item.fcHistoryImages.value);
        const recordId = item.Record_number.value;
        cards.push(new Card().render({
          'src': imageNewest || '',
          'fileName': item.fcFileName.value,
          'id': `image-${recordId}`,
          'unique': recordId
        }));
      }
    }
    return cards;
  }

  public async lazyLoading() {
    if (this.pageNum > -1 && this.isLoading === false) {
      this.pageNum++;
      this.isLoading = true;
      const cards = await this.bindingRecords(this.pageNum);
      if (cards.length === 0) {
        this.pageNum = -1;
      }
      for (const card of cards) {
        this.getListViewContentEl().append(card);
      }
      this.isLoading = false;
    }
  }

  private getImageNewest(data: any) {
    let result = '';
    if (!data) {
      return result;
    }
    const images = JSON.parse(data);
    if (!images[0] || !images[0].base64) {
      return result;
    }
    result = images[0].base64;
    return result;
  }
}
export default ListView;
