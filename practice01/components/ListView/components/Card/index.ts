import './index.css';

class Card {
  public render(params?: any) {
    const opts = {
      ...{
        'src': '',
        'fileName': '',
        'id': 'card_id',
        'unique': ''
      },
      ...params
    };
    const container = document.createElement('div');
    container.classList.add('cim-card');
    container.setAttribute('data-id', opts.unique);

    const card = document.createElement('div');
    card.classList.add('cim-card-image');
    const image = document.createElement('img');
    image.setAttribute('src', opts.src);
    card.appendChild(image);

    const fileName = document.createElement('div');
    fileName.innerText = opts.fileName;
    fileName.classList.add('cim-card-file-name');

    container.appendChild(card);
    container.appendChild(fileName);
    return container;
  }
}
export default Card;