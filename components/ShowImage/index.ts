import {TITLE_HEADER} from '../../config';
import {ButtonDTO} from '../BaseComponent/Button/types';
import Button from '../BaseComponent/Button/index';

import '../ShowImage/index.css';
class ShowImage {
  protected root: HTMLElement;
  private image: string;
  constructor(image: string) {
    this.root = document.body;
    this.image = image;
    this.render();
  }

  public open() {
    const rootPopup = this.getPopupEl();
    rootPopup.classList.add('display-block');
    rootPopup.classList.remove('display-none');
  }

  public close() {
    const rootPopup = this.getPopupEl();
    rootPopup.classList.add('display-none');
    rootPopup.classList.remove('display-block');
  }

  public render() {
    if (this.getPopupEl()) {
      this.showImage();
    } else {
      const wrapper = this.createPopupWrapper();
      const container = this.createPopupContainer();
      const header = this.createPopupHeader();
      container.appendChild(header);
      const divImg = document.createElement('div');
      divImg.classList.add('show-image-large');
      const elmImg = document.createElement('img');
      elmImg.setAttribute('src', this.image);
      divImg.appendChild(elmImg);
      container.appendChild(divImg);
      wrapper.appendChild(container);
      const footer = this.createButtonCancel();
      container.appendChild(footer);
      this.root.appendChild(wrapper);
    }
  }

  private getPopupEl(): Element {
    return this.root.querySelector('.cim-show-image-wrapper');
  }

  private showImage() {
    if (this.image) {
      (document.querySelector('.show-image-large img') as HTMLImageElement).src = this.image;
    }
  }

  private createPopupWrapper(): HTMLDivElement {
    const wrapper = document.createElement('div');
    wrapper.classList.add('cim-show-image-wrapper');
    wrapper.addEventListener('click', () => this.close());
    return wrapper;
  }

  private createPopupContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.classList.add('cim-show-image-container');
    return container;
  }

  private createPopupHeader(): HTMLDivElement {
    const header = document.createElement('div');
    header.classList.add('cim-show-image-header');
    header.innerText = TITLE_HEADER.TITLE_POPUP_VIEW_IMAGE;
    return header;
  }

  private createButtonCancel(): HTMLDivElement {
    const footer = document.createElement('div');
    footer.classList.add('cim-show-image-footer');
    const dataBtnCancel: ButtonDTO = {'id': 'btn_cancel', 'class': 'danger', 'text': 'Close'};
    const btnCancel = Button.render(dataBtnCancel);
    footer.appendChild(btnCancel);
    btnCancel.addEventListener('click', () => this.close());
    return footer;
  }
}

export default ShowImage;
