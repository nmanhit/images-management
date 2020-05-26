import {ButtonDTO} from './types';
import './index.css';

function render(params: ButtonDTO): HTMLButtonElement {
  const opts: ButtonDTO = {
    ...{
      'class': 'primary',
      'text': 'Button',
      'dataIndex': 0
    },
    ...params
  };
  const container = document.createElement('button');
  if (opts.id) {
    container.setAttribute('id', opts.id);
  }
  container.classList.add('btn');
  container.classList.add(opts.class);
  container.setAttribute('data-index', opts.dataIndex.toString());
  container.innerText = opts.text;
  return container;
}

export default {render};
