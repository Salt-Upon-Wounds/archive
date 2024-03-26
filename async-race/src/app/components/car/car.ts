import { BaseComponent } from '../base-component';
import { button, div, p } from '../tags';
import style from './styles.module.scss';

export default class Car extends BaseComponent {
  constructor(
    public id: number,
    public name: string,
    public color: string,
    private car = div({ className: style.car }),
    private ABtn = button(style.switch, 'A'),
    private BBtn = button(style.switch, 'B'),
    private controller = new AbortController(),
  ) {
    super({ className: style.box });
    const selectBtn = button(style.btn, 'Select', () =>
      this.getNode().dispatchEvent(new CustomEvent<number>('selectClick', { detail: this.id })),
    );
    const removeBtn = button(style.btn, 'Remove', () =>
      this.getNode().dispatchEvent(new CustomEvent<number>('removeClick', { detail: this.id })),
    );
    this.ABtn.addClass(style.aColor);
    this.BBtn.addClass(style.bColor);
    this.ABtn.getNode().onclick = () => {
      if (this.BBtn.containsClass(style.disabled)) {
        this.ABtn.toggleClass(style.disabled);
        this.BBtn.toggleClass(style.disabled);
        this.getNode().dispatchEvent(new CustomEvent<Car>('AClick', { detail: this }));
      }
    };
    this.BBtn.getNode().onclick = () => {
      if (this.ABtn.containsClass(style.disabled)) {
        this.ABtn.toggleClass(style.disabled);
        this.BBtn.toggleClass(style.disabled);
        this.getNode().dispatchEvent(new CustomEvent<Car>('BClick', { detail: this }));
      }
    };
    this.BBtn.addClass(style.disabled);
    const title = p(style.title, name);
    const btnsRow = div({ className: style.buttons }, selectBtn, removeBtn, title);
    const switchBtnsRow = div({ className: style.buttons }, this.ABtn, this.BBtn);
    const flag = div({ className: style.flag });
    const road = div({ className: style.road }, switchBtnsRow, car, flag);
    this.changeColor(color);
    this.appendChildren([btnsRow, road]);
  }

  public getSignal() {
    return this.controller;
  }

  public setSignal(controller: AbortController) {
    this.controller = controller;
  }

  public onButtons() {
    this.ABtn.addClass(style.disabled);
    this.BBtn.removeClass(style.disabled);
  }

  public offButtons() {
    this.ABtn.removeClass(style.disabled);
    this.BBtn.addClass(style.disabled);
  }

  private resetAnimation() {
    const el = this.car.getNode();
    el.style.animation = 'none';
    el.focus();
    el.style.animation = '';
  }

  public on() {
    this.car.getNode().style.animationPlayState = 'running';
  }

  public pause() {
    this.car.getNode().style.animationPlayState = 'paused';
  }

  public off() {
    this.resetAnimation();
    this.pause();
  }

  public animationDuration(sec: number) {
    this.car.getNode().style.animationDuration = `${sec}s`;
  }

  public changeColor(color: string) {
    this.car.getNode().style.backgroundColor = color;
  }
}
