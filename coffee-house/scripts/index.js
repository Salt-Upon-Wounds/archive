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
let slider_pads = document.querySelectorAll('.slider__pads');
let k = 0;

function toLeft() {
    slider_pads[Math.abs(k)].classList.toggle('active');
    k += 1;
    if (k == 1) k = -2;
    slider_pads[Math.abs(k)].classList.toggle('active');
    [...slider_frames].forEach(x => x.style.transform = `translateX(${k * 100}%)`);
}

function toRight() {
    slider_pads[Math.abs(k)].classList.toggle('active');
    k -= 1;
    if (k == -3) k = 0;
    slider_pads[Math.abs(k)].classList.toggle('active');
    [...slider_frames].forEach(x => x.style.transform = `translateX(${k * 100}%)`);
}

document.querySelector('.slider__arrow.right').addEventListener('click', (e) => {
    toRight();
});

document.querySelector('.slider__arrow.left').addEventListener('click', (e) => {
    toLeft();
});

setInterval(function() {
    toRight();
}, 5000);

let touchstartX = 0;
let touchendX = 0;

document.addEventListener('touchstart', e => {
  touchstartX = e.changedTouches[0].screenX;
});

document.querySelector('.slider').addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    if (Math.abs(touchendX - touchstartX) > 1) {
        if (touchendX > touchstartX) toLeft();
        if (touchendX < touchstartX) toRight();
    }
});
    
  