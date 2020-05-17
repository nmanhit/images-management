import './index.css';

class CreatedAt {
  public render(createAt: string) {
    const td = document.createElement('td');
    td.innerText = createAt;
    return td;
  }
}

export default CreatedAt;