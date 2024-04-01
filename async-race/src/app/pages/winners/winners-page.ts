import { BaseComponent } from '../../components/base-component';
import { button, div, p } from '../../components/tags';
import { getCar, getWinners } from '../../utils/api';
import go from '../../utils/routing';
import style from './styles.module.scss';

export default class Winners extends BaseComponent {
  constructor(
    private pageCounter = 1,
    private pageLimit = -1,
    private sort: 'id' | 'wins' | 'time' = 'id',
    private order: 'ASC' | 'DESC' = 'ASC',
    private title = p(style.title, `Winners (???)`),
    private page = p(style.page, `Page #???`),
    private numberBtn = button(style.tableBtn, 'Numbers'), // , () => this.sortClick('id', numberBtn)),
    private carBtn = button(style.tableBtn, 'Car'),
    private nameBtn = button(style.tableBtn, 'Name'),
    private winsBtn = button(style.tableBtn, 'Wins', () => this.sortClick('wins', winsBtn)),
    private bestTimeBtn = button(style.tableBtn, 'Best time (seconds)', () => this.sortClick('time', bestTimeBtn)),
    private columns = new Array(5).fill(1).map(() => div({ className: style.column })),
  ) {
    super({ className: style.winners });

    const prevBtn = button(style.btn, 'prev', () => this.updateList(this.pageCounter - 1, this.sort, this.order));
    const nextBtn = button(style.btn, 'next', () => this.updateList(this.pageCounter + 1, this.sort, this.order));
    const garage = button(style.btn, 'garage', () => go(''));
    // numberBtn.addClass(style.up);
    // carBtn.addClass(style.down);

    const [numbers, cars, names, wins, bestTime] = columns;
    numbers.appendChildren([numberBtn]);
    cars.appendChildren([carBtn]);
    names.appendChildren([nameBtn]);
    wins.appendChildren([winsBtn]);
    bestTime.appendChildren([bestTimeBtn]);

    const table = div({ className: style.table }, ...columns);

    const list = div({ className: style.list }, title, page, table, div({ className: style.row }, prevBtn, nextBtn));

    this.appendChildren([list, garage]);
    this.updateList(pageCounter, sort, order);
  }

  public update() {
    this.updateList(this.pageCounter, this.sort, this.order);
    return this;
  }

  private clearBtnsStyles() {
    this.columns.forEach((el) => {
      el.children[0].getNode().classList.remove(style.up, style.down);
    });
  }

  private sortClick(type: 'id' | 'wins' | 'time', btn: BaseComponent) {
    this.sort = type;
    this.clearBtnsStyles();
    if (this.order === 'ASC') {
      btn.addClass(style.up);
      this.order = 'DESC';
    } else {
      btn.addClass(style.down);
      this.order = 'ASC';
    }
    this.updateList(this.pageCounter, this.sort, this.order);
  }

  private async updateList(page: number, sort: 'id' | 'wins' | 'time', order: 'ASC' | 'DESC') {
    this.pageCounter = page < 1 ? this.pageLimit : page;
    this.pageCounter = page > this.pageLimit ? 1 : this.pageCounter;
    const { arr, total } = await getWinners(this.pageCounter, 7, sort, order);
    this.pageLimit = Math.ceil(total / 7);
    this.title.getNode().textContent = `Winners (${total})`;
    this.page.getNode().textContent = `Page #${this.pageCounter}`;
    const all = await Promise.all(new Array(arr.length).fill(1).map((_, idx) => getCar(Number(arr[idx].id))));
    const tableData = arr.map((el, idx) => Object.assign(el, all[idx]));

    const [numbers, cars, names, wins, bestTime] = this.columns;
    this.columns.forEach((column) => {
      column.destroyChildren();
    });
    numbers.appendChildren([
      this.numberBtn,
      // ...tableData.map((el) => div({ textContent: el.id.toString(), className: style.text })),
      ...tableData.map((_, idx) =>
        div({ textContent: (7 * (this.pageCounter - 1) + idx + 1).toString(), className: style.text }),
      ),
    ]);
    cars.appendChildren([
      this.carBtn,
      ...tableData.map((el) => {
        const car = div({ className: style.car });
        car.getNode().style.backgroundColor = el.color;
        return car;
      }),
    ]);
    names.appendChildren([
      this.nameBtn,
      ...tableData.map((el) => div({ textContent: el.name, className: style.text })),
    ]);
    wins.appendChildren([
      this.winsBtn,
      ...tableData.map((el) => div({ textContent: el.wins.toString(), className: style.text })),
    ]);
    bestTime.appendChildren([
      this.bestTimeBtn,
      ...tableData.map((el) => div({ textContent: el.time, className: style.text })),
    ]);
  }
}
