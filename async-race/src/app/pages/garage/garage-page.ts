import { BaseComponent } from '../../components/base-component';
import Car from '../../components/car/car';
import { button, div, input, p } from '../../components/tags';
import { createCar } from '../../utils/api';
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
    private page = p(style.page, `Page (???)`),
    private carList: Car[] = [],
  ) {
    super({ className: style.garage });
    this.raceBtn.addClass(style.green);
    this.resetBtn.addClass(style.green);
    this.generateBtn.addClass(style.wide);
    this.crBtn.getNode().onclick = this.createClick.bind(this);

    this.carList = [];
    for (let i = 0; i < 10; i += 1) {
      this.carList.push(new Car(`Asadasd ${i + 1}`));
    }

    const wrapper = div(
      { className: style.wrapper },
      div({ className: style.row }, this.crTextInput, this.crColorInput, this.crBtn),
      div({ className: style.row }, this.upTextInput, this.upColorInput, this.upBtn),
      div({ className: style.row }, this.raceBtn, this.resetBtn, this.generateBtn),
    );
    const list = div({ className: style.list }, this.title, this.page, ...this.carList);
    this.appendChildren([wrapper, list]);
  }

  // name: this.crTextInput.getNode().textContent === '' ? 'DefaultName' : this.crTextInput.getNode().textContent,
  // color: this.crColorInput.getNode().value,

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
