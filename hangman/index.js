// eslint-disable-next-line import/extensions
import word from './create.js';

console.log(word[0]);

const parts = document.querySelectorAll('.figure-part');
// 0 - head
// 1 - body
// 2, 3 - arms
// 4, 5 - legs

const keyboard = 'йцукенгшщзхъфывапролджэячсмитьбю'.split('');
const wordArr = word[0].split('');

const letters = document.querySelectorAll('.letter');
const buttons = document.querySelectorAll('.btn');
const guesses = document.querySelector('.guesses');
const modal = document.querySelector('.modal');
const back = document.querySelector('.background');
let guessesCounter = 0;
let successCounter = 0;

function wordChecker(letter) {
  if (wordArr.includes(letter.toLowerCase())) {
    for (let j = 0; j < wordArr.length; j += 1) {
      if (wordArr[j] === letter.toLowerCase()) {
        letters[j].innerHTML = letter.toLowerCase();
        successCounter += 1;
      }
    }
  } else {
    parts[guessesCounter].classList.toggle('figure-part');
    guessesCounter += 1;
    guesses.innerHTML = `${guessesCounter} / 6`;
  }

  if (successCounter === word[0].length) {
    modal.querySelector('.modal-text').innerHTML = 'Победа!';
  }

  if (guessesCounter === 6) {
    modal.querySelector('.modal-text').innerHTML = 'Поражение!';
  }

  if (successCounter === word[0].length || guessesCounter === 6) {
    modal.classList.toggle('hide');
    back.classList.toggle('hide');
  }
}

function keyDownHandler(event) {
  console.log(event.code);
  if (
    keyboard.includes(event.key.toLowerCase()) &&
    !(successCounter === word[0].length || guessesCounter === 6)
  ) {
    for (let i = 0; i < buttons.length; i += 1) {
      if (buttons[i].innerHTML === event.key.toLowerCase()) {
        if (!buttons[i].classList.contains('pressed')) {
          buttons[i].classList.add('pressed');
          wordChecker(event.key);
          break;
        } else {
          break;
        }
      }
    }
  }
}

document.addEventListener('keydown', keyDownHandler);

for (let i = 0; i < buttons.length; i += 1) {
  buttons[i].addEventListener('click', (e) => {
    if (!e.currentTarget.classList.contains('pressed')) {
      e.currentTarget.classList.add('pressed');
      wordChecker(e.currentTarget.innerHTML);
    }
  });
}
