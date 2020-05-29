import './index.css';

function render() {
  const container = document.createElement('div');
  container.classList.add('cim-loading');
  container.setAttribute('id', 'cim-loading');
  const card = document.createElement('div');
  card.classList.add('cim-loading-image', 'icon-loading');
  container.appendChild(card);
  return container;
}

function remove() {
  document.getElementById('cim-loading').remove();
}

function beforeSend() {
  const wapper = document.createElement('div');
  wapper.classList.add('wapper-loader');

  const loader = document.createElement('div');
  loader.classList.add('loader', 'icon-loading');

  wapper.appendChild(loader);
  document.body.appendChild(wapper);
}

function success() {
  document.body.querySelector('.wapper-loader').remove();
}

export default {render, remove, beforeSend, success};