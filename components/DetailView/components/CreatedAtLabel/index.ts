import './index.css';

function render(createAt: string) {
  const td = document.createElement('td');
  td.innerText = createAt;
  return td;
}

export default {render};
