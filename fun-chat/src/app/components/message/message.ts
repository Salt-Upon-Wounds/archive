import type { Message } from '../../utils/api';
import { BaseComponent } from '../base-component';
import { div, p } from '../tags';
import style from './styles.module.scss';

export default class MessageBox extends BaseComponent {
  constructor(self: boolean, message: Message) {
    super({ className: style.box });
    if (self) this.addClass(style.self);

    const name = p(style.text, message.from ?? '???');
    const date = p(
      style.text,
      `${new Date(message.datetime!).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false, minute: '2-digit', second: '2-digit' })}`,
    );
    const topRow = div({ className: style.top }, name, date);

    const center = div({ className: style.center, txt: message.text });

    const bottomRow = div({ className: style.bottom, txt: `${self ? 'отправлено' : ''}` });
    this.appendChildren([topRow, center, bottomRow]);
  }
}
