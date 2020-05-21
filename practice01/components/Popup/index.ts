import {TITLE_HEADER} from '../../config';
import Utils from '../../utils/index';
import {addRecord, getRecordById, uploadFile, updateRecord} from '../../service/ImageManager';
import {
  POPUP_PLEASE_ENTER_YOUR_FILE_IMAGE,
  POPUP_PLEASE_ENTER_YOUR_FILE_NAME,
  POPUP_FILE_TYPE_IS_NOT_SUPPORTED,
  POPUP_INPUT_DEFAULT_VALUE,
  POPUP_INPUT_DEFAULT_TEXT_CHOOSE_FILE
} from './../../constants/message';

import {ListView, DetailView} from '../index';
import {TextInput, FileInput} from './components/index';
import Button from '../BaseComponent/Button/index';
import {ButtonDTO} from '../BaseComponent/Button/types';
import {HistoryDTO, FileKeyDTO} from '../DetailView/types';
import {GalleryDTO, RecordDTO} from './types';

import '../Popup/index.css';
class Popup {
  protected root: HTMLElement;
  private recordId: number;
  constructor(recordId: number = 0) {
    this.root = document.body;
    this.recordId = recordId;
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
      this.resetPopup();
    } else {
      const wrapper = this.createPopupWrapper();
      const container = this.createPopupContainer();
      const header = this.createPopupHeader();
      container.appendChild(header);

      container.appendChild(this.createFileNameInput());
      wrapper.appendChild(container);
      container.appendChild(this.createFileInput());
      container.appendChild(this.createDivMessageError());
      const footer = this.createButtonUploadAndCancel();
      container.appendChild(footer);
      this.root.appendChild(wrapper);
    }
  }

  private getPopupEl(): Element {
    return this.root.querySelector('.cim-popup-wrapper');
  }

  private async getDataFromClient() {
    const fileName = (this.root.querySelector('.file-name-input') as HTMLInputElement).value || '';
    const file = (this.root.querySelector('.file-upload-class') as HTMLInputElement).files[0];
    const result: GalleryDTO = {
      file: file,
      fcFileName: {value: fileName},
      fcHistoryImages: {
        value: [{
          fileName: fileName,
          fullName: file?.name,
          fileType: file?.type,
          createAt: new Date().getTime().toString(),
          base64: await Utils.fileToBase64(file)
        }]
      }
    };
    return result;
  }

  private validateData(params: GalleryDTO) {
    const file: File = (params.file as File);
    if (!params.fcFileName.value && this.recordId > 0) {
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

  private async updateGallery(recordId: number, params: any, history: any) {
    const data = await getRecordById(recordId);
    const histories = JSON.parse(data?.fcHistoryImages?.value);
    params.fcHistoryImages.value = JSON.stringify([...histories, history]);
    try {
      await updateRecord(recordId, params);
      DetailView.getInstance().addRecordAtLocal(({
        'base64': history.base64,
        'createAt': history.createAt,
        'fullName': history.fullName,
        'fileType': history.fileType,
        'fileName': history.fileName
      }) as HistoryDTO);
    } catch (error) {
      Utils.handleError(error);
    }
  }

  private async addNewGallery(params: any) {
    try {
      params.fcHistoryImages.value = JSON.stringify(params.fcHistoryImages.value);
      await addRecord(params);
      new ListView().renderItem();
    } catch (error) {
      Utils.handleError(error);
    }
  }

  private async handleUploading(recordId: number) {
    try {
      const dataClient = await this.getDataFromClient();
      if (this.validateData(dataClient)) {
        delete (dataClient.file);
        const history = dataClient.fcHistoryImages.value[0];
        const blob = new Blob([dataClient.file], {type: history.fileType});
        const result: FileKeyDTO = await uploadFile(blob, history.fileName);
        const params: RecordDTO = Object.assign(dataClient, {'fcFileAttachment': {'value': [{'fileKey': result.fileKey}]}}) as RecordDTO;
        if (recordId > 0) {
          delete (params.fcFileName);
          this.updateGallery(recordId, params, history);
        } else {
          this.addNewGallery(params);
        }
        this.close();
      }
    } catch (error) {
      Utils.handleError(error);
    }
  }

  private setMessage(message: string) {
    const divMessage = this.root.querySelector('.cim-popup-message');
    divMessage.innerHTML = '';
    const divDanger = document.createElement('div');
    divDanger.classList.add('message-danger');
    divDanger.innerText = message;
    divMessage.appendChild(divDanger);
  }

  private resetPopup() {
    if (this.recordId === 0) {
      (document.querySelector('.file-name-input') as HTMLInputElement).value = '';
    }
    (document.querySelector('.file-upload-class') as HTMLInputElement).value = '';
  }

  private chooseFile() {
    const divFileUpload = (document.querySelector('.file-upload-class')) as HTMLElement;
    divFileUpload.click();
  }

  private createPopupWrapper(): HTMLDivElement {
    const wrapper = document.createElement('div');
    wrapper.classList.add('cim-popup-wrapper');
    return wrapper;
  }

  private createPopupContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.classList.add('cim-popup-container');
    return container;
  }

  private createPopupHeader(): HTMLDivElement {
    const header = document.createElement('div');
    header.classList.add('cim-popup-header');
    header.innerText = TITLE_HEADER.TITLE_POPUP_UPLOAD;
    return header;
  }

  private createDivMessageError(): HTMLDivElement {
    const divMessage = document.createElement('div');
    divMessage.classList.add('cim-popup-message');
    return divMessage;
  }

  private createFileNameInput(): HTMLDivElement {
    return TextInput.render({
      'label': 'File Name',
      'class': 'file-name-input',
      'isShow': this.recordId === 0,
      'value': POPUP_INPUT_DEFAULT_VALUE
    });
  }

  private createFileInput(): HTMLDivElement {
    const fileInput = FileInput.render({'label': 'File Upload', 'class': 'file-upload-class', 'isShow': false});
    fileInput.appendChild(this.createInputFileUpload());
    return fileInput;
  }

  private createInputFileUpload(): HTMLDivElement {
    const divChooseFile = document.createElement('div');
    divChooseFile.classList.add('cim-popup-choose-file');
    divChooseFile.innerText = POPUP_INPUT_DEFAULT_TEXT_CHOOSE_FILE;
    divChooseFile.addEventListener('click', () => this.chooseFile());
    return divChooseFile;
  }

  private createButtonUploadAndCancel(): HTMLDivElement {
    const footer = document.createElement('div');
    footer.classList.add('cim-popup-footer');
    const dataUploadBtn: ButtonDTO = {'id': 'btn_upload', 'class': 'success', 'text': 'Upload'};
    const btnUpload = Button.render(dataUploadBtn);
    footer.appendChild(btnUpload);
    btnUpload.addEventListener('click', () => this.handleUploading(this.recordId));

    const dataBtnCancel: ButtonDTO = {'id': 'btn_cancel', 'class': 'light', 'text': 'Cancel'};
    const btnCancel = Button.render(dataBtnCancel);
    footer.appendChild(btnCancel);
    btnCancel.addEventListener('click', () => this.close());
    return footer;
  }
}

export default Popup;
