import './index.css';

class Thumbnail {
  public render(src: string) {
    const td = document.createElement('td');
    td.classList.add('thumbnail');
    const img = document.createElement('img');
    img.setAttribute('src', src);
    td.appendChild(img);
    return td;
  }
}

export default Thumbnail;