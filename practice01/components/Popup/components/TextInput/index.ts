import './index.css';

class TextInput {
  render(params?: any) {
    const opts = {
      ...{
        'label': '',
        'value': '',
        'id': 'input_id'
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
    const input = document.createElement('input');
    input.setAttribute('id', opts.id);
    input.classList.add('cim-input');
    input.value = opts.value;
    container.appendChild(input);
    return container;
  }
}

export default TextInput;