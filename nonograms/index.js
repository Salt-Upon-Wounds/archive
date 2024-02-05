/* eslint-disable no-loop-func */
/* eslint-disable import/extensions */
import games from './games.js';

const buttonSize = 20;
let counter = 0;
let intervalId = null;

function updateScore() {
  const arr = JSON.parse(localStorage.getItem('arr'));
  const list = document.querySelector('.score-box-list');
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
  if (!arr) list.append(document.createTextNode('Пусто'));
  else {
    arr.sort((a, b) => a.time - b.time);
    arr.forEach((el) => {
      const tmp = document.createElement('li');
      tmp.innerHTML = `${el.name} | ${el.time} s`;
      list.append(tmp);
    });
  }
}

function checker(picture) {
  const field = document.querySelectorAll('.square button');
  let win = true;

  field.forEach((el) => {
    if (el.dataset.secret === '1') {
      if (!el.classList.contains('black')) win = false;
    } else if (el.classList.contains('black')) win = false;
  });
  if (win) {
    clearInterval(intervalId);
    const modal = document.querySelector('.modal');
    modal.querySelector('.message').innerHTML =
      `Отлично! Вы решили нонограмму за ${counter} с`;
    modal.classList.add('active');
    document.querySelector('.block').classList.add('active');
    let arr = JSON.parse(localStorage.getItem('arr'));
    if (!arr) arr = [];
    arr.push({ name: picture.name, time: counter });
    if (arr.length > 5) arr = arr.slice(-5);
    localStorage.setItem('arr', JSON.stringify(arr));
    counter = 0;
    intervalId = null;
    updateScore();
    new Audio('./sounds/win.wav').play();
  }
}

function createFrame(picture) {
  clearInterval(intervalId);
  counter = 0;
  intervalId = null;
  document.querySelector('.timer').innerHTML = `${counter} s`;
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
        if (e.currentTarget.classList.contains('cross')) {
          new Audio('./sounds/cross.wav').play();
        } else {
          new Audio('./sounds/clear.wav').play();
        }
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
        if (e.currentTarget.classList.contains('cross')) {
          new Audio('./sounds/cross.wav').play();
        } else {
          new Audio('./sounds/clear.wav').play();
        }
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
      if (intervalId === null) {
        intervalId = setInterval(() => {
          counter += 1;
          document.querySelector('.timer').innerHTML = `${counter} s`;
        }, 1000);
      }
      if (e.currentTarget.classList.contains('black') && e.button !== 2) {
        e.currentTarget.classList.remove('black');
        new Audio('./sounds/clear.wav').play();
        checker(picture);
      } else if (
        e.currentTarget.classList.contains('cross') &&
        e.button === 2
      ) {
        e.currentTarget.classList.remove('cross');
        new Audio('./sounds/clear.wav').play();
      } else {
        e.currentTarget.classList.remove('cross', 'black');
        if (e.button === 2) {
          e.currentTarget.classList.add('cross');
          new Audio('./sounds/cross.wav').play();
        } else {
          e.currentTarget.classList.add('black');
          new Audio('./sounds/black.wav').play();
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
  lineContainer.className = 'line-container';
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
  /* document.querySelectorAll('.line-container div').forEach((el) => {
    el.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }); */
  document
    .querySelector('.frame-wrapper')
    .addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
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
  let p = document.createElement('p');
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
    });
    clearInterval(intervalId);
    counter = 0;
    intervalId = null;
    document.querySelector('.timer').innerHTML = `${counter} s`;
  });
  tmp.append(btn);
  btn = document.createElement('button');
  btn.className = 'random';
  btn.innerHTML = 'random game';
  btn.addEventListener('mouseup', () => {
    document.querySelector('.block').classList.remove('active');
    clearInterval(intervalId);
    counter = 0;
    intervalId = null;
    document.querySelector('.timer').innerHTML = `${counter} s`;
    createFrame(games[Math.floor(Math.random() * games.length)]);
  });
  tmp.append(btn);
  btn = document.createElement('button');
  btn.className = 'solution';
  btn.innerHTML = 'solution';
  btn.addEventListener('mouseup', () => {
    document.querySelector('.block').classList.add('active');
    clearInterval(intervalId);
    counter = 0;
    intervalId = null;
    document.querySelector('.timer').innerHTML = `${counter} s`;
    document.querySelectorAll('.square button').forEach((el) => {
      if (el.dataset.secret === '1') {
        el.classList.remove('cross');
        el.classList.add('black');
      } else {
        el.classList.add('cross');
        el.classList.remove('black');
      }
    });
  });
  tmp.append(btn);
  btn = document.createElement('button');
  btn.className = 'save';
  btn.innerHTML = 'save';
  btn.addEventListener('mouseup', () => {
    if (intervalId) {
      const top = [];
      const topCross = [];
      const left = [];
      const leftCross = [];
      const square = [];
      const squareCross = [];
      const time = counter;
      document.querySelectorAll('.top .row').forEach((el) => {
        const row = [];
        const rowC = [];
        el.querySelectorAll('button').forEach((button) => {
          row.push(button.innerHTML);
          rowC.push(button.classList.contains('cross'));
        });
        top.push(row);
        topCross.push(rowC);
      });
      document.querySelectorAll('.left .row').forEach((el) => {
        const row = [];
        const rowC = [];
        el.querySelectorAll('button').forEach((button) => {
          row.push(button.innerHTML);
          rowC.push(button.classList.contains('cross'));
        });
        left.push(row);
        leftCross.push(rowC);
      });
      document.querySelectorAll('.square button').forEach((button) => {
        square.push(button.dataset.secret);
        squareCross.push({
          cross: button.classList.contains('cross'),
          black: button.classList.contains('black'),
        });
      });
      localStorage.setItem(
        'save',
        JSON.stringify({
          top,
          left,
          square,
          topCross,
          leftCross,
          squareCross,
          time,
        })
      );
    }
  });
  tmp.append(btn);
  btn = document.createElement('button');
  btn.className = 'load';
  btn.innerHTML = 'load';
  btn.addEventListener('mouseup', () => {
    document.querySelector('.block').classList.add('active');
    clearInterval(intervalId);
    const arr = JSON.parse(localStorage.getItem('save'));
    if (arr) {
      createFrame({ top: arr.top, left: arr.left, square: arr.square });
      document.querySelectorAll('.square button').forEach((el, id) => {
        if (arr.squareCross[id].cross) el.classList.add('cross');
        if (arr.squareCross[id].black) el.classList.add('black');
      });
      document.querySelectorAll('.top .row').forEach((el, idx) => {
        el.querySelectorAll('button').forEach((button, idy) => {
          if (arr.topCross[idx][idy]) button.classList.add('cross');
        });
      });
      document.querySelectorAll('.left .row').forEach((el, idx) => {
        el.querySelectorAll('button').forEach((button, idy) => {
          if (arr.leftCross[idx][idy]) button.classList.add('cross');
        });
      });
      counter = arr.time;
      document.querySelector('.timer').innerHTML = `${counter} s`;
      intervalId = setInterval(() => {
        counter += 1;
        document.querySelector('.timer').innerHTML = `${counter} s`;
      }, 1000);
    }
  });
  tmp.append(btn);
  btn = document.createElement('button');
  btn.className = 'theme-switch';
  btn.innerHTML = 'theme switch';
  btn.addEventListener('mouseup', () => {
    document.querySelector('body').classList.toggle('night');
  });
  tmp.append(btn);
  body.append(tmp);
  tmp = document.createElement('div');
  tmp.className = 'score-box';
  p = document.createElement('p');
  p.className = 'title';
  p.innerHTML = 'Таблица результатов';
  tmp.append(p);
  const ul = document.createElement('ul');
  ul.className = 'score-box-list';
  tmp.append(ul);
  body.append(tmp);
  tmp = document.createElement('div');
}

create();
createFrame(games[0]);
updateScore();
