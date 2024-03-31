import { BaseComponent } from '../base-component';
import { button, div, p } from '../tags';
import style from './styles.module.scss';

export default class Car extends BaseComponent {
  private anim = new Animation();

  private fireanim = new Animation();

  constructor(
    public id: number,
    public name: string,
    public color: string,
    public car = div({ className: style.car }),
    private fire = div({ className: style.fire }),
    private ABtn = button(style.switch, 'A'),
    private BBtn = button(style.switch, 'B'),
    private road = div({ className: style.road }),
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
    this.road.appendChildren([switchBtnsRow, car, fire, flag]);
    this.changeColor(color);
    this.appendChildren([btnsRow, this.road]);

    const rideKeyframes = new KeyframeEffect(
      this.car.getNode(),
      [
        { left: 'calc(0% + 70px)' }, // keyframe
        { left: 'calc(100% - 150px)' }, // keyframe
      ],
      { duration: 5000, fill: 'forwards', easing: 'linear' },
    );
    const fireKeyframes = new KeyframeEffect(
      this.fire.getNode(),
      [
        { left: 'calc(0% + 70px)' }, // keyframe
        { left: 'calc(100% - 150px)' }, // keyframe
      ],
      { duration: 5000, fill: 'forwards', easing: 'linear' },
    );
    this.anim = new Animation(rideKeyframes, document.timeline);
    this.fireanim = new Animation(fireKeyframes, document.timeline);
  }

  public getSignal() {
    return this.controller;
  }

  public onFire() {
    this.fire.addClass(style.on);
  }

  public offFire() {
    this.fire.removeClass(style.on);
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

  public on() {
    this.anim.play();
    this.fireanim.play();
  }

  public pause() {
    this.anim.pause();
    this.fireanim.pause();
  }

  public off() {
    this.anim.cancel();
    this.fireanim.cancel();
  }

  public animationDuration(sec: number) {
    this.anim.effect?.updateTiming({ duration: sec * 1000 });
    this.fireanim.effect?.updateTiming({ duration: sec * 1000 });
  }

  public changeColor(color: string) {
    this.car.getNode().style.backgroundColor = color;
  }
}
