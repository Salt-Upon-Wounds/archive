import deleteIcon from '../../assets/delete.svg';
import editIcon from '../../assets/edit.svg';
import type { Message } from '../../utils/api';
import { BaseComponent } from '../base-component';
import { div, img, p } from '../tags';
import style from './styles.module.scss';

export default class MessageBox extends BaseComponent {
  private message: Message;

  private textDiv;

  constructor(self: boolean, message: Message) {
    super({ className: style.box });
    if (self) this.addClass(style.self);

    this.message = message;
    const name = p(style.text, message.from ?? '???');
    const date = p(
      style.text,
      `${new Date(message.datetime!).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false, minute: '2-digit', second: '2-digit' })}`,
    );
    const deleteBtn = img(style.icon, deleteIcon, 'delete');
    const editBtn = img(style.icon, editIcon, 'edit');
    deleteBtn.getNode().addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent<Message>('DELETE_CLICK_EVENT', { detail: this.message }));
    });
    editBtn.getNode().addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent<Message>('EDIT_CLICK_EVENT', { detail: this.message }));
    });
    const topRow = div({ className: style.row }, name, self ? div({}, deleteBtn, editBtn) : div({}));

    this.textDiv = div({ className: style.center, txt: message.text });

    const bottomText = p(style.text, `${self ? 'отправлено' : ''}`);
    const bottomRow = div({ className: style.row }, bottomText, date);
    this.appendChildren([topRow, this.textDiv, bottomRow]);
  }

  public get id() {
    return this.message.id;
  }

  public get status() {
    return this.message.status;
  }

  public get messageFull() {
    return this.message;
  }

  public edit(txt: string) {
    this.message.text = txt;
    this.textDiv.getNode().textContent = txt;
  }
}
