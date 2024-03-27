import { BaseComponent } from '../../components/base-component';
import { button, div, p } from '../../components/tags';
import go from '../../utils/routing';
import style from './styles.module.scss';

export default class Winners extends BaseComponent {
  constructor() {
    super({ className: style.winners });
    const numberBtn = button(style.tableBtn, 'Numbers');
    const carBtn = button(style.tableBtn, 'Car');
    const nameBtn = button(style.tableBtn, 'Name');
    const winsBtn = button(style.tableBtn, 'Wins');
    const bestTimeBtn = button(style.tableBtn, 'Best time (seconds)');
    const title = p(style.title, `Winners (???)`);
    const page = p(style.page, `Page #???`);
    const prevBtn = button(style.btn, 'prev');
    const nextBtn = button(style.btn, 'next');
    const garage = button(style.btn, 'garage', () => go(''));
    numberBtn.addClass(style.up);
    carBtn.addClass(style.down);

    const columns = new Array(5).fill(1).map(() => div({ className: style.column }));
    const [numbers, cars, names, wins, bestTime] = columns;
    numbers.appendChildren([numberBtn, div({ textContent: '1' }), div({ textContent: '1' })]);
    cars.appendChildren([carBtn, div({ textContent: 'car' }), div({ textContent: 'car' })]);
    names.appendChildren([nameBtn, div({ textContent: 'test' }), div({ textContent: 'test' })]);
    wins.appendChildren([winsBtn, div({ textContent: '1' }), div({ textContent: '32' })]);
    bestTime.appendChildren([bestTimeBtn, div({ textContent: '1.12' }), div({ textContent: '13' })]);

    const table = div({ className: style.table }, ...columns);

    const list = div({ className: style.list }, title, page, table, div({ className: style.row }, prevBtn, nextBtn));

    this.appendChildren([list, garage]);
  }
}
