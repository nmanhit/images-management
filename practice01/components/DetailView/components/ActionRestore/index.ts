
import './index.css';
import Button from '../../../BaseComponent/Button/index';

class ActionRestore {
  public render(dataIndex: number) {
    const td = document.createElement('td');
    const btnRestore = new Button().render({'text': 'Restore', 'dataIndex': dataIndex});
    td.appendChild(btnRestore);
    return td;
  }
}

export default ActionRestore;