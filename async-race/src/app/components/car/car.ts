import { BaseComponent } from '../base-component';
import { button, div, p } from '../tags';
import style from './styles.module.scss';

export default class Car extends BaseComponent {
  constructor(
    public id: number,
    public name: string,
    public color: string,
    private car = div({ className: style.car }),
  ) {
    super({ className: style.box });
    const selectBtn = button(style.btn, 'Select', () =>
      this.getNode().dispatchEvent(new CustomEvent<number>('selectClick', { detail: this.id })),
    );
    const removeBtn = button(style.btn, 'Remove', () =>
      this.getNode().dispatchEvent(new CustomEvent<number>('removeClick', { detail: this.id })),
    );
    const ABtn = button(style.switch, 'A');
    const BBtn = button(style.switch, 'B');
    BBtn.addClass(style.disabled);
    const title = p(style.title, name);
    const btnsRow = div({ className: style.buttons }, selectBtn, removeBtn, title);
    const switchBtnsRow = div({ className: style.buttons }, ABtn, BBtn);
    const flag = div({ className: style.flag });
    const road = div({ className: style.road }, switchBtnsRow, car, flag);
    this.changeColor(color);
    this.appendChildren([btnsRow, road]);
  }

  public changeColor(color: string) {
    this.car.getNode().style.backgroundColor = color;
  }
}
