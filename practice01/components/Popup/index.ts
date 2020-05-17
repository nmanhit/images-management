import {addRecord, getRecordById, uploadFile, updateRecord} from '../../service/ImageManager';
import {
  POPUP_PLEASE_ENTER_YOUR_FILE_IMAGE,
  POPUP_PLEASE_ENTER_YOUR_FILE_NAME,
  POPUP_FILE_TYPE_IS_NOT_SUPPORTED,
  POPUP_INPUT_DEFAULT_VALUE
} from './../../constants/message';
import {TITLE_HEADER} from '../../config';
import TextInput from './components/TextInput/index';
import Button from '../BaseComponent/Button/index';

import '../Popup/index.css';
import FileInput from './components/FileInput/index';
import ListView from '../ListView/index';
import {fileToBase64} from '../../utils/index';

class Popup {
  protected root: HTMLElement;
  private recordId : number;
  constructor(rootId: string, recordId: number = 0) {
    this.root = document.getElementById(rootId);
    this.recordId = recordId;
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

  async handleUploading(recordId: number) {
    const fileName = (this.root.querySelector('#fileNameId') as HTMLInputElement).value;
    const fileAttachment = (this.root.querySelector('#fileUploadId') as HTMLInputElement).files[0];
    const params = {
      'fileName': fileName,
      'fileAttachment': fileAttachment
    };
    if (this.validateData(params)) {
      const uploadEffect: any = await uploadFile(fileAttachment);
      const base64 = await fileToBase64(fileAttachment);
      const fileType = fileAttachment.type;
      let record: any = {
        'fcFileName': {'value': params.fileName},
        'fcFileAttachment': {'value': [{'fileKey': uploadEffect.fileKey}]},
        'fcHistoryImages': {'value': [{'fileType': fileType, 'createAt': new Date().getTime(), 'base64': base64}]}
      };
      if (recordId > 0){
        const currentRecord = await getRecordById(recordId);
        const currentHistory = JSON.parse(currentRecord?.fcHistoryImages?.value);
        record.fcHistoryImages.value = JSON.stringify([...record.fcHistoryImages.value, ...currentHistory]);
        await updateRecord(recordId, record);
      } else {
        record.fcHistoryImages.value = JSON.stringify(record.fcHistoryImages.value);
        await addRecord(record);
        new ListView().renderItem();
      }
      this.close();
      return true;
    }
    return false;
  }

  validateData(params: any) {
    const file: File = (params.fileAttachment as File);
    if (!params.fileName) {
      this.setMessage(POPUP_PLEASE_ENTER_YOUR_FILE_NAME);
      return false;
    }
    const isEmptyFileInput = !file || file.size === 0;
    if (isEmptyFileInput) {
      this.setMessage(POPUP_PLEASE_ENTER_YOUR_FILE_IMAGE);
      return false;
    }
    if (!file.type.match('image.*')) {
      this.setMessage(POPUP_FILE_TYPE_IS_NOT_SUPPORTED);
      return false;
    }
    return true;
  }

  setMessage(message: string) {
    const divMessage = this.root.querySelector('.cim-popup-message');
    divMessage.innerHTML = '';
    const divDanger = document.createElement('div');
    divDanger.classList.add('message-danger');
    divDanger.innerText = message;
    divMessage.appendChild(divDanger);
  }

  resetPopup() {
    (document.getElementById('fileNameId') as HTMLInputElement).value = '';
    (document.getElementById('fileUploadId') as HTMLInputElement).value = '';
  }

  render() {
    if (!this.getPopupEl()) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('cim-popup-wrapper');

      const container = document.createElement('div');
      container.classList.add('cim-popup-container');

      const header = document.createElement('div');
      header.classList.add('cim-popup-header');
      header.innerText = TITLE_HEADER.TITLE_POPUP_UPLOAD;
      container.appendChild(header);

      const textInput = new TextInput();
      container.appendChild(textInput.render({'label': 'File Name', 'id': 'fileNameId', 'value': POPUP_INPUT_DEFAULT_VALUE}));
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
      btnUpload.addEventListener('click', () => this.handleUploading(this.recordId));

      const btnCancel = new Button().render({'id': 'btn_cancel', 'class': 'danger', 'text': 'Cancel'});
      footer.appendChild(btnCancel);
      btnCancel.addEventListener('click', () => this.close());

      this.root.appendChild(wrapper);
    } else {
      this.resetPopup();
    }
  }
}

export default Popup;
