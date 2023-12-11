import { burger } from "./burger.js";
import data from "./data.js";

burger(document.querySelector('.menu'), document.querySelector('.burger-menu'));

let back = document.querySelector('.back');
let body = document.querySelector('body');
let modal = document.querySelector('.modal');
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('back')) {
            back.classList.remove('active');
            body.classList.remove('block');
            body.classList.remove('block-all');
            modal.classList.remove('active');
        }
});

let coffee = [];
let tea = [];
let dessert = [];

data.forEach(x => {
    if (x.category === 'coffee') coffee.push(x);
    if (x.category === 'tea') tea.push(x);
    if (x.category === 'dessert') dessert.push(x);
});

coffee.forEach((x, i) => {
    document.querySelector('.menu__list').insertAdjacentHTML("beforeend",
    `<div class="menu__card active coffee" data-id=${i} data-type="coffee">
        <div class="card__img__wrap">
            <img class="card__img" src="./resources/coffee-${i + 1}.jpg" alt="${i + 1}">
        </div>
        <p class="card__title">${x.name}</p>
        <p class="card__desc">${x.description}</p>
        <p class="card__price">$${x.price}</p>
    </div>`);
});

tea.forEach((x, i) => {
    document.querySelector('.menu__list').insertAdjacentHTML("beforeend",
    `<div class="menu__card tea" data-id=${i} data-type="tea">
        <div class="card__img__wrap">
            <img class="card__img" src="./resources/tea-${i + 1}.png" alt="${i + 1}">
        </div>
        <p class="card__title">${x.name}</p>
        <p class="card__desc">${x.description}</p>
        <p class="card__price">$${x.price}</p>
    </div>`);
});

dessert.forEach((x, i) => {
    document.querySelector('.menu__list').insertAdjacentHTML("beforeend",
    `<div class="menu__card dessert" data-id=${i} data-type="dessert">
        <div class="card__img__wrap">
            <img class="card__img" src="./resources/dessert-${i + 1}.png" alt="${i + 1}">
        </div>
        <p class="card__title">${x.name}</p>
        <p class="card__desc">${x.description}</p>
        <p class="card__price">$${x.price}</p>
    </div>`);
});

[...document.querySelectorAll('.menu__button')].forEach( x => {
    x.addEventListener('click', e => {
        if (!e.target.closest('a').classList.contains('active')) {
            document.querySelector('.menu__list').classList.add('hide');
            document.querySelector('.menu__refresh-btn').classList.add('active');
        }
        [...document.querySelectorAll('.menu__button')].forEach(y => {
            y.classList.remove('active');
        });
        [...document.querySelectorAll('.menu__card')].forEach(y => {
            y.classList.remove('active');
        });
        [...document.querySelectorAll(`.menu__card.${e.target.closest('a').dataset.type}`)].forEach(y => {
            y.classList.toggle('active');
        });
        [...document.querySelectorAll(`.menu__card.${e.target.closest('a').dataset.type}`)].reverse().forEach(y => {
            document.querySelector('.menu__list').prepend(y);
        });
        e.target.closest('a').classList.toggle('active');
    });
});

let size = document.querySelectorAll('.modal__btn-wrapper.size .modal__btn');
let additives = document.querySelectorAll('.modal__btn-wrapper.additives .modal__btn');
let total = document.querySelector('.modal__total-sum');

[...document.querySelectorAll('.menu__card')].forEach( x => {
    x.addEventListener('click', e => {
        back.classList.toggle('active');
        body.classList.toggle('block-all');
        modal.classList.toggle('active');
        let arr = eval(e.target.closest('.menu__card').dataset.type);
        document.querySelector('.modal .img__wrapper .img').src =
            `./resources/${e.target.closest('.menu__card').dataset.type}-${+e.target.closest('.menu__card').dataset.id + 1}.` +
            `${e.target.closest('.menu__card').dataset.type == 'coffee' ? 'jpg' : 'png'}`;
        document.querySelector('.modal .modal__title').innerHTML = arr[e.target.closest('.menu__card').dataset.id].name;
        document.querySelector('.modal .modal__desc').innerHTML = arr[e.target.closest('.menu__card').dataset.id].description;
        [...document.querySelectorAll('.modal__btn-wrapper .modal__btn')].forEach( x => {
            x.classList.remove('active');
        });
        document.querySelector('.modal__btn-wrapper.size .modal__btn').classList.add('active');
        for (let i = 0; i < 3; i++) {
            size[i].querySelector('.text').innerHTML =  arr[e.target.closest('.menu__card').dataset.id].sizes[i].size;
            size[i].dataset.price = arr[e.target.closest('.menu__card').dataset.id].sizes[i]['add-price'];
            additives[i].querySelector('.text').innerHTML =  arr[e.target.closest('.menu__card').dataset.id].additives[i].name;
            additives[i].dataset.price = arr[e.target.closest('.menu__card').dataset.id].additives[i]['add-price'];
        }
        total.innerHTML = `$${arr[e.target.closest('.menu__card').dataset.id].price}`;
        total.dataset.price = `${arr[e.target.closest('.menu__card').dataset.id].price}`;
    });
});

size.forEach(x => {
    x.addEventListener('click', e => {
        size.forEach(y => {
            y.classList.remove('active');
        });
        e.target.closest('button').classList.add('active');
        let adds = 0;
        [...document.querySelectorAll('.modal__btn-wrapper.additives .modal__btn.active')].forEach(y => {
            adds += +y.dataset.price;
        });
        console.log(adds);
        total.innerHTML = `$${(+total.dataset.price + +e.target.closest('button').dataset.price + adds).toFixed(2)}`;
    });
});

additives.forEach(x => {
    x.addEventListener('click', e => {
        e.target.closest('button').classList.toggle('active');
        let adds = 0;
        [...document.querySelectorAll('.modal__btn-wrapper.additives .modal__btn.active')].forEach(y => {
            adds += +y.dataset.price;
        });
        [...document.querySelectorAll('.modal__btn-wrapper.size .modal__btn.active')].forEach(y => {
            adds += +y.dataset.price;
        });
        console.log(adds);
        total.innerHTML = `$${(+total.dataset.price + adds).toFixed(2)}`;
    });
});

[...document.querySelectorAll('.modal__btn-wrapper.size .modal__btn')].forEach( x => {
    x.addEventListener('click', e => {
        
    });
});

[...document.querySelectorAll('.modal__btn-wrapper.additives .modal__btn')].forEach( x => {
    x.addEventListener('click', e => {
        
    });
});

document.querySelector('.modal__close').addEventListener('click', (e) => {
    back.classList.remove('active');
    body.classList.remove('block');
    body.classList.remove('block-all');
    modal.classList.remove('active');
});

document.querySelector('.menu__refresh-btn').addEventListener('click', e => {
    document.querySelector('.menu__list').classList.remove('hide');
    document.querySelector('.menu__refresh-btn').classList.remove('active');
});