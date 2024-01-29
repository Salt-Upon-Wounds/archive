/* eslint-disable import/extensions */
import games from './games.js';

const buttonSize = 20;

function checker(picture) {

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
      if (e.currentTarget.classList.contains('black') && e.button !== 2)
        e.currentTarget.classList.remove('black');
      else if (e.currentTarget.classList.contains('cross') && e.button === 2)
        e.currentTarget.classList.remove('cross');
      else {
        e.currentTarget.classList.remove('cross', 'black');
        if (e.button === 2) e.currentTarget.classList.add('cross');
        else e.currentTarget.classList.add('black');
      }
    });
    btn.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
    checker(picture);
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
  let tmp = document.createElement('button');
  tmp.className = 'hide-btn';
  tmp.innerHTML = '<-';
  tmp.addEventListener('click', () => {
    document.querySelector('.side-list-wrapper').classList.toggle('active');
    document.querySelector('.hide-btn').classList.toggle('active');
  });
  body.append(tmp);
  const div = document.createElement('div');
  div.className = 'side-list-wrapper';
  tmp = document.createElement('ul');
  tmp.className = 'side-list';
  for (let i = 0; i < games.length; i += 1) {
    const li = document.createElement('li');
    li.className = 'list-item';
    li.innerHTML = games[i].name;
    li.dataset.id = i;
    tmp.append(li);
    li.addEventListener('click', (e) => {
      createFrame(games[e.currentTarget.dataset.id]);
    });
  }
  div.append(tmp);
  body.append(div);
  tmp = document.createElement('div');
  tmp.className = 'frame-wrapper';
  body.append(tmp);
  tmp = document.createElement('div');
  tmp.className = 'btns-wrapper';
  const p = document.createElement('p');
  p.className = 'timer';
  p.innerHTML = '0s';
  tmp.append(p);
  let btn = document.createElement('button');
  btn.className = 'reset';
  btn.innerHTML = 'reset';
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
