// eslint-disable-next-line import/extensions
import word from './create.js';

console.log(word);

const parts = document.querySelectorAll('.figure-part');
// 0 - head
// 1 - body
// 2, 3 - arms
// 4, 5 - legs

const letters = document.querySelectorAll('.letter');
const buttons = document.querySelectorAll('.btn');
const guesses = document.querySelector('.guesses');
let guessesCounter = 0;
