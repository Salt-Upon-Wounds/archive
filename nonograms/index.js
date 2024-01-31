/* eslint-disable no-loop-func */
/* eslint-disable import/extensions */
import games from './games.js';

const buttonSize = 20;
let counter = 0;
let intevalId = null;

function checker() {
  const field = document.querySelectorAll('.square button');
  let win = true;

  field.forEach((el) => {
    if (el.dataset.secret === '1') {
      if (!el.classList.contains('black')) win = false;
    } else if (el.classList.contains('black')) win = false;
  });
  if (win) {
    clearInterval(intevalId);
    const modal = document.querySelector('.modal');
    modal.querySelector('.message').innerHTML =
      `Отлично! Вы решили нонограмму за ${counter} с`;
    modal.classList.add('active');
    document.querySelector('.block').classList.add('active');
    counter = 0;
    intevalId = null;
  }
}

function createFrame(picture) {
  const frame = document.querySelector('.frame-wrapper');
  while (frame.firstChild) {
    frame.removeChild(frame.firstChild);
  }
  const top = document.createElement('div');
  top.className = 'top';
  const left = document.createElement('div');
  left.className = 'left';
  const square = document.createElement('div');
  square.className = 'square';

  const leftSize = [...picture.left].sort((a, b) => b.length - a.length)[0].length;
  frame.style.maxWidth = `${
    buttonSize * Math.sqrt(picture.square.length) + (buttonSize + 3) * leftSize
  }px`;
  square.style.maxWidth = `${buttonSize * Math.sqrt(picture.square.length)}px`;

  for (let i = 0; i < picture.top.length; i += 1) {
    const tmp = document.createElement('div');
    tmp.className = 'row';
    tmp.style.width = `${buttonSize}px`;
    for (let j = 0; j < picture.top[i].length; j += 1) {
      const btn = document.createElement('button');
      btn.addEventListener('mouseup', (e) => {
        e.currentTarget.classList.toggle('cross');
      });
      btn.addEventListener('contextmenu', (e) => {
        e.preventDefault();
      });
      btn.style.borderColor = 'transparent';
      btn.innerHTML = picture.top[i][j];
      tmp.append(btn);
    }
    top.append(tmp);
  }
  for (let i = 0; i < picture.left.length; i += 1) {
    const tmp = document.createElement('div');
    tmp.className = 'row';
    tmp.style.height = `${buttonSize}px`;
    for (let j = 0; j < picture.left[i].length; j += 1) {
      const btn = document.createElement('button');
      btn.addEventListener('mouseup', (e) => {
        e.currentTarget.classList.toggle('cross');
      });
      btn.addEventListener('contextmenu', (e) => {
        e.preventDefault();
      });
      btn.style.borderColor = 'transparent';
      btn.innerHTML = picture.left[i][j];
      tmp.append(btn);
    }
    left.append(tmp);
  }
  for (let i = 0; i < picture.square.length; i += 1) {
    const btn = document.createElement('button');
    btn.dataset.secret = picture.square[i];
    square.append(btn);
    btn.addEventListener('mouseup', (e) => {
      if (intevalId === null) {
        intevalId = setInterval(() => {
          counter += 1;
          document.querySelector('.timer').innerHTML = `${counter} s`;
        }, 1000);
      }
      if (e.currentTarget.classList.contains('black') && e.button !== 2) {
        e.currentTarget.classList.remove('black');
        checker(picture);
      } else if (e.currentTarget.classList.contains('cross') && e.button === 2)
        e.currentTarget.classList.remove('cross');
      else {
        e.currentTarget.classList.remove('cross', 'black');
        if (e.button === 2) e.currentTarget.classList.add('cross');
        else {
          e.currentTarget.classList.add('black');
          checker(picture);
        }
      }
    });
    btn.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }
  const nl = document.createElement('div');
  nl.className = 'new-line';
  frame.append(top, nl, left, square);
  const lineContainer = document.createElement('div');
  lineContainer.style.position = 'relative';
  lineContainer.style.width = '100%';
  lineContainer.style.height = '100%';
  frame.prepend(lineContainer);
  let line = document.createElement('div');
  line.style.position = 'absolute';
  line.style.width = `${frame.offsetWidth}px`;
  line.style.height = '3px';
  line.style.borderTop = '3px solid';
  line.style.top = `${top.offsetHeight}px`;
  lineContainer.prepend(line);
  line = document.createElement('div');
  line.style.position = 'absolute';
  line.style.height = `${frame.offsetHeight}px`;
  line.style.width = '3px';
  line.style.borderLeft = '3px solid';
  line.style.left = `${left.offsetWidth}px`;
  lineContainer.prepend(line);
  line = document.createElement('div');
  line.style.position = 'absolute';
  line.style.height = `${frame.offsetHeight}px`;
  line.style.width = `${frame.offsetWidth}px`;
  line.style.zIndex = '888';
  line.className = 'block';
  lineContainer.prepend(line);
  const lines = Math.sqrt(picture.square.length) / 5 + 1;
  if (lines > 1) {
    for (let i = 1; i < lines; i += 1) {
      line = document.createElement('div');
      line.style.position = 'absolute';
      line.style.width = `${frame.offsetWidth}px`;
      line.style.height = '3px';
      line.style.borderTop = '3px solid';
      line.style.top = `${top.offsetHeight + buttonSize * 5 * i}px`;
      lineContainer.prepend(line);

      line = document.createElement('div');
      line.style.position = 'absolute';
      line.style.height = `${frame.offsetHeight}px`;
      line.style.width = '3px';
      line.style.borderLeft = '3px solid';
      line.style.left = `${left.offsetWidth + buttonSize * 5 * i}px`;
      lineContainer.prepend(line);
    }
  }
}

function create() {
  const body = document.querySelector('body');
  const modal = document.createElement('div');
  modal.className = 'modal';
  const window = document.createElement('div');
  window.className = 'window';
  let tmp = document.createElement('p');
  tmp.innerHTML = 'Не забудь поменять текст тут';
  tmp.className = 'message';
  window.append(tmp);
  tmp = document.createElement('button');
  tmp.addEventListener('mouseup', () => {
    document.querySelector('.modal').classList.remove('active');
  });
  tmp.innerHTML = 'OK';
  tmp.className = 'btn';
  window.append(tmp);
  modal.append(window);
  body.prepend(modal);
  tmp = document.createElement('button');
  tmp.className = 'hide-btn';
  tmp.innerHTML = '<-';
  tmp.addEventListener('click', () => {
    document.querySelector('.side-list-wrapper').classList.toggle('active');
    document.querySelector('.hide-btn').classList.toggle('active');
  });
  body.append(tmp);
  const div = document.createElement('div');
  div.className = 'side-list-wrapper';
  function createList(arr, size) {
    const list = document.querySelector('.side-list');
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
    if (size) arr = arr.filter((game) => game.top.length === size);
    for (let i = 0; i < arr.length; i += 1) {
      const li = document.createElement('li');
      li.className = 'list-item';
      li.innerHTML = arr[i].name;
      li.dataset.id = i;
      list.append(li);
      li.addEventListener('click', (e) => {
        createFrame(arr[e.currentTarget.dataset.id]);
      });
    }
  }
  const buttons = document.createElement('div');
  buttons.className = 'buttons-wrappper';
  tmp = document.createElement('button');
  tmp.innerHTML = 'все';
  tmp.addEventListener('mouseup', () => {
    createList(games);
  });
  buttons.append(tmp);
  tmp = document.createElement('button');
  tmp.innerHTML = '5x5';
  tmp.addEventListener('mouseup', () => {
    createList(games, 5);
  });
  buttons.append(tmp);
  tmp = document.createElement('button');
  tmp.innerHTML = '10x10';
  tmp.addEventListener('mouseup', () => {
    createList(games, 10);
  });
  buttons.append(tmp);
  tmp = document.createElement('button');
  tmp.innerHTML = '15x15';
  tmp.addEventListener('mouseup', () => {
    createList(games, 15);
  });
  buttons.append(tmp);
  div.appendChild(buttons);
  tmp = document.createElement('ul');
  tmp.className = 'side-list';
  div.append(tmp);
  body.append(div);
  createList(games);
  tmp = document.createElement('div');
  tmp.className = 'frame-wrapper';
  body.append(tmp);
  tmp = document.createElement('div');
  tmp.className = 'btns-wrapper';
  const p = document.createElement('p');
  p.className = 'timer';
  p.innerHTML = '0 s';
  tmp.append(p);
  let btn = document.createElement('button');
  btn.className = 'reset';
  btn.innerHTML = 'reset';
  btn.addEventListener('mouseup', () => {
    document.querySelector('.block').classList.remove('active');
    document.querySelectorAll('.frame-wrapper button').forEach((el) => {
      el.classList.remove('black', 'cross');
      clearInterval(intevalId);
      counter = 0;
      intevalId = null;
      document.querySelector('.timer').innerHTML = `${counter} s`;
    });
  });
  tmp.append(btn);
  btn = document.createElement('button');
  btn.className = 'solution';
  btn.innerHTML = 'solution';
  tmp.append(btn);
  btn = document.createElement('button');
  btn.className = 'save';
  btn.innerHTML = 'save';
  tmp.append(btn);
  btn = document.createElement('button');
  btn.className = 'load';
  btn.innerHTML = 'load';
  tmp.append(btn);
  btn = document.createElement('button');
  btn.className = 'theme-switch';
  btn.innerHTML = 'theme switch';
  tmp.append(btn);
  body.append(tmp);
  tmp = document.createElement('div');
  tmp.className = 'score-box';
  const ul = document.createElement('ul');
  ul.className = 'score-box-list';
  tmp.append(ul);
  body.append(tmp);
}

create();
createFrame(games[0]);

const body = document.querySelector('body');
const frame = document.querySelector('.frame-wrapper');
const timer = document.querySelector('.timer');
