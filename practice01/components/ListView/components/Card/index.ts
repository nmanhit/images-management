import './index.css';
import {CardDTO} from '../../types';

function render(params?: CardDTO) {
  const opts = {
    ...{
      'src': '',
      'fileName': '',
      'createdAt': '',
      'uniqueId': 0
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
  card.appendChild(image);

  const fileName = document.createElement('div');
  fileName.innerText = opts.fileName;
  fileName.classList.add('cim-card-file-name');

  const createdAt = document.createElement('div');
  createdAt.innerText = opts.createdAt;
  createdAt.classList.add('cim-card-created-at');
  item.appendChild(card);
  item.appendChild(fileName);
  item.appendChild(createdAt);
  group.appendChild(item);
  container.appendChild(group);
  return container;
}
export default {render};