
import './index.css';
import Button from '../../../BaseComponent/Button/index';
import {CURRENT_VERSION} from '../../../../constants/message';

function render(dataIndex: number, isNewestVersion: boolean = false): HTMLTableCellElement {
  const td = document.createElement('td');
  td.classList.add('row');
  if (isNewestVersion) {
    td.classList.add('newest');
  }
  const divText = document.createElement('div');
  divText.innerText = CURRENT_VERSION;
  divText.classList.add('text-current');
  td.append(divText);
  const btnRestore = Button.render({'text': 'Restore', 'class': 'danger', 'dataIndex': dataIndex});
  td.appendChild(btnRestore);
  return td;
}

export default {render};