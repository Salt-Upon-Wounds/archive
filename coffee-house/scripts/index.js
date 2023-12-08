import { burger } from "./burger.js";

burger(document.querySelector('.menu'), document.querySelector('.burger-menu'));

let frame_time = new Date().getTime();
let frame_diff = 5000;
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
    clearTimer();
    slider_pads[Math.abs(k)].classList.toggle('active');
    k += 1;
    if (k == 1) k = -2;
    slider_pads[Math.abs(k)].classList.toggle('active');
    [...slider_frames].forEach(x => x.style.transform = `translateX(${k * 100}%)`);
}

function toRight() {
    clearTimer();
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

let timer = setTimeout(function() {
    toRight();
}, 5000);

function pauseTimer() {
    clearTimeout(timer);
    frame_diff -= new Date().getTime() - frame_time;
    
    slider_pads[Math.abs(k)].style.animationPlayState = 'paused';
    //console.log('in ', frame_diff);
}

function resumeTimer() {
    frame_time = new Date().getTime();
    timer = setTimeout(function() {
        toRight();
    }, frame_diff);
    slider_pads[Math.abs(k)].style.animationPlayState = 'running';
    //console.log('out');
}

function clearTimer() {
    clearTimeout(timer);
    timer = setTimeout(function() {
        toRight();
    }, 5000);
    frame_time = new Date().getTime();
    frame_diff = 5000;
}

let touchstartX = 0;
let touchendX = 0;

document.querySelector('.slider').addEventListener('touchstart', e => {
    pauseTimer();
    touchstartX = e.changedTouches[0].screenX;
});

document.querySelector('.slider').addEventListener('touchend', e => {
    resumeTimer();
    touchendX = e.changedTouches[0].screenX;
    if (Math.abs(touchendX - touchstartX) > 2) {
        if (touchendX > touchstartX) toLeft();
        if (touchendX < touchstartX) toRight();
    }
});

document.querySelector('.slider__wrapper').addEventListener('mouseover', e => {
    pauseTimer();
});

document.querySelector('.slider__wrapper').addEventListener('mouseout', e => {
    resumeTimer();
});
  