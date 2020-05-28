import './index.css';

function render(createdTime: string) {
  const td = document.createElement('td');
  td.innerText = createdTime;
  return td;
}

export default {render};
