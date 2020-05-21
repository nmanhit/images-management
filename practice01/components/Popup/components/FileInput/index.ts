import './index.css';

function render(params?: any) {
  const opts = {
    ...{
      'label': '',
      'class': 'file-input-class',
      'isShow': true
    },
    ...params
  };
  const container = document.createElement('div');
  container.classList.add('cim-input-group');
  if (opts.label) {
    const label = document.createElement('label');
    label.classList.add('label-file');
    label.innerText = opts.label;
    container.appendChild(label);
  }
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.classList.add('cim-file-input');
  input.classList.add(opts.class);
  if (opts.isShow === false) {
    input.classList.add('display-none');
  }
  container.appendChild(input);
  return container;
}

export default {render};
