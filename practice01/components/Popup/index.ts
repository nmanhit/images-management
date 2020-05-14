import {ROOT_ID} from '../../config';
import TextInput from './components/TextInput/index';
import Button from '../BaseComponent/Button/index';

import '../Popup/index.css';
import FileInput from './components/FileInput/index';
import { validate } from 'json-schema';

class Popup {
  protected root: HTMLElement;
  constructor() {
    this.root = document.getElementById(ROOT_ID);
    this.render();
  }

  getPopupEl() {
    return this.root.querySelector('.cim-popup-wrapper');
  }

  open() {
    const rootPopup = this.getPopupEl();
    rootPopup.classList.add('display-block');
    rootPopup.classList.remove('display-none');
  }

  close() {
    const rootPopup = this.getPopupEl();
    rootPopup.classList.add('display-none');
    rootPopup.classList.remove('display-block');
  }

  handleUploading() {
    console.log('vo');
    this.validateData();
    if(this.validateData()) {

    }
  }

  validateData() {    
    return true;
  }

  setHeader(headerContent: string): void {
    this.root.querySelector('.cim-popup-header').textContent = headerContent;
  }

  render() {
    if (!this.root.querySelector('.cim-popup-wrapper')) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('cim-popup-wrapper');

      const container = document.createElement('div');
      container.classList.add('cim-popup-container');

      const header = document.createElement('div');
      header.classList.add('cim-popup-header');
      container.appendChild(header);

      container.appendChild(new TextInput().render({'label': 'File Name', 'id': 'fileNameId'}));
      wrapper.appendChild(container);

      const fileInput = new FileInput();
      container.appendChild(fileInput.render({'label': 'Choose file', 'id': 'fileUploadId'}));

      const divMessage = document.createElement('div');
      divMessage.classList.add('cim-popup-message');
      container.appendChild(divMessage);

      const footer = document.createElement('div');
      footer.classList.add('cim-popup-footer');
      container.appendChild(footer);

      const btnUpload = new Button().render({'id': 'btn_upload', 'class': 'primary', 'text': 'Upload'});
      footer.appendChild(btnUpload);
      btnUpload.addEventListener('click', () => this.handleUploading());

      const btnCancel = new Button().render({'id': 'btn_cancel', 'class': 'danger', 'text': 'Cancel'});
      footer.appendChild(btnCancel);
      btnCancel.addEventListener('click', () => this.close());

      this.root.appendChild(wrapper);
    }
  }
}
export default Popup;