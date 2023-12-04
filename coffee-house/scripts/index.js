import { burger } from "./burger.js";

burger(document.querySelector('.menu'), document.querySelector('.burger-menu'));

let back = document.querySelector('.back');
let body = document.querySelector('body');
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('back')) {
            back.classList.remove('active');
            body.classList.remove('block');
        }
});

let slider_frames = document.querySelectorAll('.slider__frame');
let k = 0;

document.querySelector('.slider__arrow.right').addEventListener('click', (e) => {
    k -= 1;
    if (k == -3) k = 0;
    [...slider_frames].forEach(x => x.style.transform = `translateX(${k * 100}%)`);
});

document.querySelector('.slider__arrow.left').addEventListener('click', (e) => {
    k += 1;
    if (k == 1) k = -2;
    [...slider_frames].forEach(x => x.style.transform = `translateX(${k * 100}%)`);
});