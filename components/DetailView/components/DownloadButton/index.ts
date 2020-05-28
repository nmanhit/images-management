import './index.css';
import Button from '../../../BaseComponent/Button/index';

function render(dataIndex: number): HTMLButtonElement {
  return Button.render({'text': 'Download', 'class': 'success', 'dataIndex': dataIndex});
}

export default {render};
