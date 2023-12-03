export function burger(menu, menuBtn) {
    let body = document.querySelector('.body');
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        menu.classList.toggle('active');
        body.classList.toggle('block');
    });
    document.querySelectorAll('.menu .item__link').forEach(el => {
        el.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            menu.classList.remove('active');
            body.classList.remove('block');
        });
    });
}