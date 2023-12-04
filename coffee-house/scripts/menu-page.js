import { burger } from "./burger.js";
import { modal } from "./modal.js";

burger(document.querySelector('.menu'), document.querySelector('.burger-menu'));

let back = document.querySelector('.back');
let body = document.querySelector('body');
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('back')) {
            back.classList.remove('active');
            body.classList.remove('block');
        }
});