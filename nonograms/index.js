const games = [
  {
    name: 'Динозавр',
    top: [[1], [3], [2], [5], [1]],
    left: [[2], [1], [3], [3], [2, 1]],
    square: 
      [0,0,0,1,1,
       0,0,0,1,0,
       0,1,1,1,0,
       0,1,1,1,0,
       1,1,0,1,0],
  }
];

function create() {
  const body = document.querySelector('body');
  let tmp = document.createElement('button');
  tmp.className = 'hide-btn';
  tmp.innerHTML = '->';
  body.append(tmp);
  const div = document.createElement('div');
  div.className = 'side-list-wrapper';
  tmp = document.createElement('ul');
  tmp.className = 'side-list';
  for (let i = 0; i < games.length; i++) {
    const li = document.createElement('li');
    li.className = 'list-item';
    li.innerHTML = games[i].name;
    li.dataset.id = i;
    tmp.append(li);
  }
  div.append(tmp);
  body.append(div);
  tmp = document.createElement('div');
  tmp.className = 'frame-wrapper';
  body.append(tmp);
  tmp = document.createElement('div');
  tmp.className = 'btns-wrapper';
  let p = document.createElement('p');
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
  for (let i = 0; i < picture.top.length; i++) {
    const tmp = document.createElement('div');
    tmp.className = 'row';
    for (let j = 0; j < picture.top[i].length; j++) {
      const btn = document.createElement('button');
      btn.innerHTML = picture.top[i][j];
      tmp.append(btn);
    }
    top.append(tmp);
  }
  for (let i = 0; i < picture.left.length; i++) {
    const tmp = document.createElement('div');
    tmp.className = 'row';
    for (let j = 0; j < picture.left[i].length; j++) {
      const btn = document.createElement('button');
      btn.innerHTML = picture.left[i][j];
      tmp.append(btn);
    }
    left.append(tmp);
  }
  for (let i = 0; i < picture.square.length; i++) {
    const btn = document.createElement('button');
    btn.dataset.secret = picture.square[i];
    square.append(btn);
  }
  const nl = document.createElement('div');
  nl.className = 'new-line';
  frame.append(top, nl, left, square);
}

create();
createFrame(games[0]);

const body = document.querySelector('body');
const frame = document.querySelector('.frame-wrapper');

