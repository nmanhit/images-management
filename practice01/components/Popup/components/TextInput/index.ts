import './index.css';

function render(params?: any) {
  const opts = {
    ...{
      'label': '',
      'value': '',
      'class': 'input-class',
      'isShow': true
    },
    ...params
  };
  const container = document.createElement('div');
  container.classList.add('cim-input-group');
  if (opts.label) {
    const label = document.createElement('label');
    label.innerText = opts.label;
    container.appendChild(label);
  }
  if (opts.isShow === false) {
    container.classList.add('display-none');
  }
  const input = document.createElement('input');
  input.classList.add('cim-input');
  input.classList.add(opts.class);
  input.value = opts.value;
  container.appendChild(input);
  return container;
}
export default {render};