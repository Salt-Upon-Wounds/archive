import { burger } from "./burger.js";

burger(document.querySelector('.menu'), document.querySelector('.burger-menu'));

let modal = document.querySelector('.modal');
let back = document.querySelector('.back');
let body = document.querySelector('body');
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('back')) {
            modal.classList.remove('active');
            back.classList.remove('active');
            body.classList.remove('block');
        }
});