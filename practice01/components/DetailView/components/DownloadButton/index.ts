import './index.css';
import Button from '../../../BaseComponent/Button/index';

function render(dataIndex: number): HTMLButtonElement {
  // const td = document.createElement('td');
  // const btnDownload = Button.render({'text': 'Download', 'class': 'success', 'dataIndex': dataIndex});
  return Button.render({'text': 'Download', 'class': 'success', 'dataIndex': dataIndex});
  // td.appendChild(btnDownload);
  // return td;
}

export default {render};
