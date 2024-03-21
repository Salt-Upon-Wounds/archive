import { BaseComponent } from '../../components/base-component';
import Car from '../../components/car/car';
import { button, div, input, p } from '../../components/tags';
import style from './styles.module.scss';

export default class Garage extends BaseComponent {
  constructor() {
    super({ className: style.garage });
    const crTextInput = input(style.input, { type: 'text' });
    const crColorInput = input(style.colorInput, { type: 'color' });
    const crBtn = button(style.btn, 'Create');
    const upTextInput = input(style.input, { type: 'text' });
    const upColorInput = input(style.colorInput, { type: 'color' });
    const upBtn = button(style.btn, 'update');
    const raceBtn = button(style.btn, 'race');
    raceBtn.addClass(style.green);
    const resetBtn = button(style.btn, 'reset');
    resetBtn.addClass(style.green);
    const generateBtn = button(style.btn, 'generate cars');
    generateBtn.addClass(style.wide);

    const title = p(style.title, `Garage (???)`);
    const page = p(style.page, `Page (???)`);
    const test = [];
    for (let i = 0; i < 10; i += 1) {
      test.push(new Car(`Asadasd ${i + 1}`));
    }

    const wrapper = div(
      { className: style.wrapper },
      div({ className: style.row }, crTextInput, crColorInput, crBtn),
      div({ className: style.row }, upTextInput, upColorInput, upBtn),
      div({ className: style.row }, raceBtn, resetBtn, generateBtn),
    );
    const list = div({ className: style.list }, title, page, ...test);
    this.appendChildren([wrapper, list]);
  }
}
