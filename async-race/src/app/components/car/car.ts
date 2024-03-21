import { BaseComponent } from '../base-component';
import { button, div, p } from '../tags';
import style from './styles.module.scss';

export default class Car extends BaseComponent {
  constructor(
    name: string,
    color?: string,
    private car = div({ className: style.car }),
  ) {
    super({ className: style.box });
    const selectBtn = button(style.btn, 'Select');
    const removeBtn = button(style.btn, 'Remove');
    const ABtn = button(style.switch, 'A');
    const BBtn = button(style.switch, 'B');
    BBtn.addClass(style.disabled);
    const title = p(style.title, name);
    const btnsRow = div({ className: style.buttons }, selectBtn, removeBtn, title);
    const switchBtnsRow = div({ className: style.buttons }, ABtn, BBtn);
    const flag = div({ className: style.flag });
    const road = div({ className: style.road }, switchBtnsRow, car, flag);
    if (color) this.changeColor(color);
    this.appendChildren([btnsRow, road]);
  }

  public changeColor(color: string) {
    this.car.getNode().style.backgroundColor = color;
  }
}
