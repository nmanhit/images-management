import {ButtonDTO} from './types';
import './index.css';

function render(params: ButtonDTO): HTMLButtonElement {
  const opts: ButtonDTO = {
    ...{
      'class': 'primary',
      'text': 'Button',
      'id': 'button_id',
      'dataIndex': 0
    },
    ...params
  };
  const container = document.createElement('button');
  container.classList.add('btn');
  container.classList.add(opts.class);
  container.setAttribute('id', opts.id);
  container.setAttribute('data-index', opts.dataIndex.toString());
  container.innerText = opts.text;
  return container;
}
export default {render};