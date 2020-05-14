import { ROOT_ID } from "../../config";
import Button from "../BaseComponent/Button/index";
import Popup from "../Popup/index";
import "../ListView/index.css";

class ListView {
  private root: HTMLElement;

  constructor() {
    this.root = document.getElementById(ROOT_ID);
    this.render();
  }

  private getHeaderEl() {
    return this.root.querySelector('.cim-listview-header');
  }

  public setHeader(headerContent: string): void {
    this.getHeaderEl().textContent = headerContent;
  }

  public render() {
    const container = document.createElement('div');
    container.classList.add('cim-listview-container');

    const topAction = document.createElement('div');
    topAction.classList.add('cim-listview-top');
    container.appendChild(topAction);
    const btnOpenPopup = new Button().render({
      id: 'btn_open_popup',
      class: 'primary',
      text: 'Upload',
    });
    topAction.appendChild(btnOpenPopup);
    btnOpenPopup.addEventListener('click', () => new Popup().open());

    const header = document.createElement('div');
    header.classList.add('cim-listview-header');
    container.appendChild(header);

    this.root.appendChild(container);
  }
}
export default ListView;
