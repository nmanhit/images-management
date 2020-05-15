import {ROOT_ID, TITLE_HEADER} from '../../config';

import './index.css';

class Restore {
  protected root: HTMLElement;
  constructor() {
    this.root = document.getElementById(ROOT_ID);
    this.render();
  }

  private getRestoreEl() {
    return this.root.querySelector('.cim-restore');
  }

  private resetRestore() {
    (document.getElementById('restoreBody') as HTMLElement).innerHTML = '';
  }

  public open() {
    const rootRestore = this.getRestoreEl();
    rootRestore.classList.add('display-block');
    rootRestore.classList.remove('display-none');
  }

  public close() {
    const rootRestore = this.getRestoreEl();
    rootRestore.classList.add('display-none');
    rootRestore.classList.remove('display-block');
  }

  public render() {
    if (this.getRestoreEl()) {
      this.resetRestore();
    } else {
      const container = document.createElement('div');
      container.classList.add('cim-restore-container');

      const header = document.createElement('div');
      header.classList.add('cim-restore-header');
      header.innerText = TITLE_HEADER.TITLE_POPUP_RESTORE;
      container.appendChild(header);

      const body = document.createElement('div');
      body.classList.add('cim-restore-body');
      body.setAttribute('id', 'restoreBody');
      container.appendChild(body);

      const footer = document.createElement('div');
      footer.classList.add('cim-restore-footer');
      container.appendChild(footer);
      this.root.appendChild(container);
    }
  }
}
export default Restore;