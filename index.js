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
let guessesCounter = 0;
document.addEventListener('keydown', function (event) {
  console.log(event.key);
  if (keyboard.includes(event.key.toLowerCase())) {
    for (let i = 0; i < buttons.length; i += 1) {
      if (buttons[i].innerHTML === event.key.toLowerCase()) {
        if (!buttons[i].classList.contains('pressed')) {
          buttons[i].classList.add('pressed');
          if (wordArr.includes(event.key.toLowerCase())) {
            for (let i = 0; i < wordArr.length; i += 1) {
              if (wordArr[i] === event.key.toLowerCase())
                letters[i].innerHTML = event.key.toLowerCase();
            }
          } else {
            parts[guessesCounter].classList.toggle('figure-part');
            guessesCounter += 1;
            guesses.innerHTML = `${guessesCounter} / 6`;
          }
          break;
        } else {
          break;
        }
      }
    }
  }
});
