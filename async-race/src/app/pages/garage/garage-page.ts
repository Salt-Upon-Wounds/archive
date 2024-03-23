import { BaseComponent } from '../../components/base-component';
import Car from '../../components/car/car';
import { button, div, input, p } from '../../components/tags';
import { createCar, getCars } from '../../utils/api';
import style from './styles.module.scss';

export default class Garage extends BaseComponent {
  constructor(
    private crTextInput = input(style.input, { type: 'text' }),
    private crColorInput = input(style.colorInput, { type: 'color' }),
    private crBtn = button(style.btn, 'Create'),
    private upTextInput = input(style.input, { type: 'text' }),
    private upColorInput = input(style.colorInput, { type: 'color' }),
    private upBtn = button(style.btn, 'update'),
    private raceBtn = button(style.btn, 'race'),
    private resetBtn = button(style.btn, 'reset'),
    private generateBtn = button(style.btn, 'generate cars'),
    private title = p(style.title, `Garage (???)`),
    private page = p(style.page, `Page #???`),
    private carList: Car[] = [],
    private list = div({ className: style.list }),
    private prevBtn = button(style.btn, 'prev'),
    private nextBtn = button(style.btn, 'next'),
    private pageCounter = 1,
    private pageLimit = -1,
  ) {
    super({ className: style.garage });
    [this.raceBtn, this.resetBtn, this.prevBtn, this.nextBtn].forEach((el) => {
      el.addClass(style.green);
    });
    this.generateBtn.addClass(style.wide);
    this.crBtn.getNode().onclick = this.createClick.bind(this);
    this.nextBtn.getNode().onclick = () => this.updateList(this.pageCounter + 1);
    this.prevBtn.getNode().onclick = () => this.updateList(this.pageCounter - 1);

    const wrapper = div(
      { className: style.wrapper },
      div({ className: style.row }, this.crTextInput, this.crColorInput, this.crBtn),
      div({ className: style.row }, this.upTextInput, this.upColorInput, this.upBtn),
      div({ className: style.row }, this.raceBtn, this.resetBtn, this.generateBtn),
    );
    const bottomBtns = div({ className: style.row }, this.prevBtn, this.nextBtn);
    this.appendChildren([wrapper, list, bottomBtns]);
    this.updateList(this.pageCounter);
  }

  private async updateList(page: number) {
    this.list.destroyChildren();
    this.carList = [];
    this.pageCounter = page < 1 ? this.pageLimit : page;
    this.pageCounter = page > this.pageLimit ? 1 : this.pageCounter;
    const { arr, total } = await getCars(this.pageCounter, 7);
    if (this.pageLimit < 1) this.pageLimit = Math.ceil(total / 7);
    this.title.getNode().textContent = `Garage (${total})`;
    this.page.getNode().textContent = `Page #${this.pageCounter}`;

    for (let i = 0; i < arr.length; i += 1) {
      this.carList.push(new Car(arr[i].name, arr[i].color));
    }
    this.list.appendChildren([this.title, this.page, ...this.carList]);
  }

  private createClick() {
    const el = this.crTextInput;
    if (Garage.checkInput(el)) {
      createCar(el.getNode().value, el.getNode().value);
    }
  }

  private static checkInput(elem: BaseComponent<HTMLInputElement>) {
    if (elem.getNode().value === '') {
      (async () => {
        elem.addClass(style.red);
        await new Promise((resolve) => {
          setTimeout(resolve, 2000);
        });
        elem.removeClass(style.red);
      })();
      return false;
    }
    return true;
  }
}
