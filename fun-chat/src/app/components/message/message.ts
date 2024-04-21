import deleteIcon from '../../assets/delete.svg';
import editIcon from '../../assets/edit.svg';
import type { Message } from '../../utils/api';
import { BaseComponent } from '../base-component';
import { div, img, p } from '../tags';
import style from './styles.module.scss';

export default class MessageBox extends BaseComponent {
  private message: Message;

  private textDiv;

  private deliveredDiv;

  private readDiv;

  private editDiv;

  constructor(self: boolean, message: Message) {
    super({ className: style.box });
    if (self) this.addClass(style.self);

    this.message = message;
    this.deliveredDiv = p(`${style.text} ${this.message.status?.isDelivered ? '' : style.hide}`, 'delivered');
    this.readDiv = p(`${style.text} ${this.message.status?.isReaded ? '' : style.hide}`, 'read');
    this.editDiv = p(`${style.text} ${this.message.status?.isEdited ? '' : style.hide}`, 'edited');
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

    const bottomText = self ? div({}, this.deliveredDiv, this.readDiv, this.editDiv) : div({});
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

  public lineOn() {
    this.getNode().before(div({ className: style.line, txt: 'New messages' }).getNode());
  }

  public lineOff() {
    const prev = this.getNode().previousSibling;
    if (prev && (prev as HTMLElement).classList.contains(style.line)) {
      prev.remove();
    }
  }

  public override destroy(): void {
    this.lineOff();
    super.destroy();
  }

  public edit(txt: string) {
    this.message.text = txt;
    this.textDiv.getNode().textContent = txt;
    this.editDiv.removeClass(style.hide);
  }

  public deliver() {
    this.message.status!.isDeleted = true;
    this.deliveredDiv.removeClass(style.hide);
  }

  public read() {
    this.message.status!.isReaded = true;
    this.readDiv.removeClass(style.hide);
  }
}
