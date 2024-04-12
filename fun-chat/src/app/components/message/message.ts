import { BaseComponent } from '../base-component';
import { div, p } from '../tags';
import style from './styles.module.scss';

export default class Message extends BaseComponent {
  constructor(self: boolean) {
    super({ className: style.box });
    if (self) this.addClass(style.self);

    const name = p(style.text, `${Math.random()}_test`);
    const date = p(
      style.text,
      `${new Date().toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false, minute: '2-digit', second: '2-digit' })}`,
    );
    const topRow = div({ className: style.top }, name, date);

    const center = div({ className: style.center, txt: 'asdsasda' });

    const bottomRow = div({ className: style.bottom, txt: `${self ? 'отправлено' : ''}` });
    this.appendChildren([topRow, center, bottomRow]);
  }
}
