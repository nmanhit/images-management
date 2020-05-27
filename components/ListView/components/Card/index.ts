import {API_SERVICE_ENDPOINT} from '../../../../config';
import Utils from '../../../../util';
import {downloadFileAttachment} from '../../../../service/ImageManager';

import {CardDTO} from '../../types';
import {FileKeyDTO} from '../../../DetailView/types';
import './index.css';

function openDetailPage(recordId: number): void {
  window.location.href = `${API_SERVICE_ENDPOINT}/k/${kintone.app.getId()}/show#record=${recordId}`;
}

async function dowloadImage(fileKey: string, name: string) {
  try {
    const file = await downloadFileAttachment(fileKey);
    Utils.createElmDownloadFile(file.blobUrl, name);
  } catch (error) {
    Utils.handleError(error);
  }
}

function render(params?: CardDTO) {
  const opts = {
    ...{
      'src': '',
      'fileName': '',
      'createdAt': '',
      'uniqueId': 0,
      'fileKey': '',
      'name': ''
    },
    ...params
  };
  const container = document.createElement('div');
  container.classList.add('cim-card');
  container.setAttribute('data-id', opts.uniqueId.toString());

  const group = document.createElement('div');
  group.classList.add('cim-card-group');
  const item = document.createElement('div');
  item.classList.add('cim-card-item');

  const card = document.createElement('div');
  card.classList.add('cim-card-image');
  const image = document.createElement('img');
  image.setAttribute('src', opts.src);
  image.addEventListener('click', () => openDetailPage(opts.uniqueId));
  card.appendChild(image);

  const fileName = document.createElement('div');
  fileName.innerText = opts.fileName;
  fileName.classList.add('cim-card-file-name');

  const footer = document.createElement('div');
  footer.classList.add('cim-card-footer');

  const downloadIcon = document.createElement('div');
  downloadIcon.classList.add('cim-card-download-icon');
  if (opts.fileKey) {
    downloadIcon.addEventListener('click', () => dowloadImage(opts.fileKey, opts.name));
  }

  const createdAt = document.createElement('div');
  createdAt.innerText = opts.createdAt;
  createdAt.classList.add('cim-card-created-at');

  footer.appendChild(downloadIcon);
  footer.appendChild(createdAt);

  item.appendChild(card);
  item.appendChild(fileName);
  item.appendChild(footer);
  group.appendChild(item);
  container.appendChild(group);
  return container;
}
export default {render};