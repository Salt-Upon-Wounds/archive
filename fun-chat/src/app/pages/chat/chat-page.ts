import { BaseComponent } from '../../components/base-component';
import Footer from '../../components/footer/footer';
import Header from '../../components/header/header';
import { button, div, input, p } from '../../components/tags';
import style from './styles.module.scss';

export default class ChatPage extends BaseComponent {
  constructor() {
    super({ className: style.chat });

    const targetUser = p(style.name, 'Test');
    const targetUserStatus = p(style.status, 'online');
    const topRow = div({ className: style.top }, targetUser, targetUserStatus);

    const messageList = div(
      { className: style.list },
      ...new Array(50).fill(1).map((_, idx) => button(style.elem, `test_message ${idx}`)),
    );

    const messageInput = input(style.input, { type: 'text', placeholder: 'Message' });
    const sendBtn = button(style.send, 'Send');
    const bottomRow = div({ className: style.bottom }, messageInput, sendBtn);

    const messages = div({ className: style.messages }, topRow, messageList, bottomRow);

    const userInput = input(style.search, { type: 'text', placeholder: 'Search...' });
    const userList = div(
      { className: style.list },
      ...new Array(20).fill(1).map((_, idx) => button(style.elem, `test_test ${idx}`)),
    );
    const users = div({ className: style.users }, userInput, userList);
    userList.children[0].addClass(style.active);

    const wrapper = div({ className: style.center }, users, messages);

    this.appendChildren([new Header(), wrapper, new Footer()]);
  }
}
