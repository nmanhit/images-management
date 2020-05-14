import './index.css';

class Button {
  render(params?: any) {
    const opts = {
      ...{
        'class': 'primary',
        'text': 'Button',
        'id': 'button_id'
      },
      ...params
    };
    const container = document.createElement('button');
    container.classList.add('btn');
    if (opts.class) {
      container.classList.add(opts.class);
    }
    container.setAttribute('id', opts.id);
    container.innerText = opts.text;
    return container;
  }
}

export default Button;