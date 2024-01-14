const arr = [
  ['воздух', 'Мы им дышим'],
  ['молоко', 'Белое, вкусное, содержит лактозу'],
  ['рогачев', 'Где лучшая сгущенка'],
  ['тревога', 'Что мы чувствуем перед дедлайном'],
  [
    'облегчение',
    'Что чувствуем после дедлайна, когда все сделано и оценки стоят справедливо',
  ],
  ['человеконенавистничество', 'Синоним слову мизантропия'],
  ['плесень', 'Растет на испорченных продуктах'],
  ['сертификат', 'При успешном окончании курса получим получим'],
  ['прокрастинация', 'Почему разраб не доделал нормально проект'],
  ['костыли', 'Главный наш помощник в разработке'],
  ['программист', 'Кто не спит ночью'],
];
const keyboard = 'йцукенгшщзхъфывапролджэячсмитьбю'.split('');
const body = document.querySelector('body');

const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svg.classList.add('figure-container');
// Rod
let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
line.setAttribute('x1', 60);
line.setAttribute('y1', 20);
line.setAttribute('x2', 140);
line.setAttribute('y2', 20);
svg.append(line);

line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
line.setAttribute('x1', 140);
line.setAttribute('y1', 20);
line.setAttribute('x2', 140);
line.setAttribute('y2', 50);
svg.append(line);

line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
line.setAttribute('x1', 60);
line.setAttribute('y1', 20);
line.setAttribute('x2', 60);
line.setAttribute('y2', 230);
svg.append(line);

line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
line.setAttribute('x1', 20);
line.setAttribute('y1', 230);
line.setAttribute('x2', 100);
line.setAttribute('y2', 230);
svg.append(line);

// body
line = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
line.setAttribute('cx', 140);
line.setAttribute('cy', 70);
line.setAttribute('r', 20);
svg.classList.add('figure-part');
svg.append(line);

line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
line.setAttribute('x1', 140);
line.setAttribute('y1', 90);
line.setAttribute('x2', 140);
line.setAttribute('y2', 150);
svg.classList.add('figure-part');
svg.append(line);

line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
line.setAttribute('x1', 140);
line.setAttribute('y1', 120);
line.setAttribute('x2', 160);
line.setAttribute('y2', 100);
svg.classList.add('figure-part');
svg.append(line);

line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
line.setAttribute('x1', 140);
line.setAttribute('y1', 120);
line.setAttribute('x2', 120);
line.setAttribute('y2', 100);
svg.classList.add('figure-part');
svg.append(line);

line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
line.setAttribute('x1', 140);
line.setAttribute('y1', 150);
line.setAttribute('x2', 120);
line.setAttribute('y2', 180);
svg.classList.add('figure-part');
svg.append(line);

line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
line.setAttribute('x1', 140);
line.setAttribute('y1', 150);
line.setAttribute('x2', 160);
line.setAttribute('y2', 180);
svg.classList.add('figure-part');
svg.append(line);

const word = arr[Math.floor(Math.random() * arr.length)];

const panel = document.createElement('div');
panel.className = 'playground';
const wordDiv = document.createElement('div');
wordDiv.className = 'word';
// eslint-disable-next-line no-restricted-syntax, guard-for-in, no-unused-vars
for (const x in word[0].split('')) {
  const letter = document.createElement('span');
  letter.className = 'letter';
  letter.innerHTML = '_';
  wordDiv.append(letter);
}
const hint = document.createElement('p');
hint.className = 'hint';
hint.innerHTML = `Подсказка: <span class="hint-placer">${word[1]}</span>`;
const counter = document.createElement('p');
counter.className = 'counter';
counter.innerHTML = 'Попытки: <span class="guesses">0 / 6</span>';
const keys = document.createElement('div');
keys.className = 'keyboard';
let keysRow = document.createElement('div');
keysRow.className = 'keyboard__row';
let i = 0;
for (; i < 12; i += 1) {
  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.innerHTML = `${keyboard[i]}`;
  keysRow.append(btn);
}
keys.append(keysRow);
keysRow = document.createElement('div');
keysRow.className = 'keyboard__row';
for (; i - 12 < 11; i += 1) {
  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.innerHTML = `${keyboard[i]}`;
  keysRow.append(btn);
}
keys.append(keysRow);
keysRow = document.createElement('div');
keysRow.className = 'keyboard__row';
for (; i - 12 - 11 < 9; i += 1) {
  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.innerHTML = `${keyboard[i]}`;
  keysRow.append(btn);
}
keys.append(keysRow);

panel.append(wordDiv);
panel.append(hint);
panel.append(counter);
panel.append(keys);
body.prepend(panel);
body.prepend(svg);

export default word;
