import './index.css';

class FileInput {
  private popupWrapper: HTMLElement;
  constructor() {
    this.popupWrapper = document.getElementById('cim-popup-wrapper');
  }

  public render(params?: any) {
    const opts = {
      ...{
        'label': '',
        'id': 'file_id'
      },
      ...params
    };
    const container = document.createElement('div');
    container.classList.add('cim-input-group');
    if (opts.label) {
      const label = document.createElement('label');
      label.innerText = opts.label;
      container.appendChild(label);
    }
    const input = document.createElement('input');
    input.setAttribute('id', opts.id);
    input.setAttribute('type', 'file');
    input.classList.add('cim-file-input');
    container.appendChild(input);
    return container;
  }

  public close() {
    this.popupWrapper
      .classList
      .add('display-none');
  }

  public open() {
    this.popupWrapper
      .classList
      .add('display-block');
  }

  public blobToBase64(blob: Blob) {

  }

  public fileToBlob(file: File) {
    //return new Blob(file, {type: file.type});
    return file;
  }
}

export default FileInput;
