import { BaseComponent } from '../../components/base-component';
import Footer from '../../components/footer/footer';
import Header from '../../components/header/header';
import Message from '../../components/message/message';
import { button, div, input, p } from '../../components/tags';
import type { User } from '../../utils/api';
import Api from '../../utils/api';
import { loadUser } from '../../utils/storage';
import style from './styles.module.scss';

export default class ChatPage extends BaseComponent {
  constructor(
    private users: User[] = [],
    private usersList = div({ className: style.list }),
  ) {
    super({ className: style.chat });

    const targetUser = p(style.name, 'Test');
    const targetUserStatus = p(style.status, 'online');
    const topRow = div({ className: style.top }, targetUser, targetUserStatus);

    const messageList = div(
      { className: style.list },
      ...new Array(50).fill(1).map((_, idx) => {
        return new Message(idx % 3 === 0);
      }),
    );
    setTimeout(() => {
      messageList.getNode().scrollTop = messageList.getNode().scrollHeight;
    });

    const messageInput = input(style.input, { type: 'text', placeholder: 'Message' });
    const sendBtn = button(style.send, 'Send');
    const bottomRow = div({ className: style.bottom }, messageInput, sendBtn);

    const messages = div({ className: style.messages }, topRow, messageList, bottomRow);

    const userInput = input(style.search, { type: 'text', placeholder: 'Search...' });
    /* const userList = div(
      { className: style.list },
      ...new Array(20).fill(1).map((_, idx) => button(style.elem, `test_test ${idx}`)),
    ); */
    const usersDiv = div({ className: style.users }, userInput, this.usersList);

    const wrapper = div({ className: style.center }, usersDiv, messages);

    this.appendChildren([new Header(), wrapper, new Footer()]);

    window.addEventListener('USERS_EVENT', ((e: CustomEvent<User[]>) => {
      this.users = this.users.concat(e.detail);
      const name = loadUser()?.login ?? '';
      this.usersList.destroyChildren();
      this.usersList.appendChildren(
        this.users
          .filter((el) => el.login !== name)
          .map((el) => {
            const btn = button(style.elem, `${el.login}`);
            if (el.isLogined) btn.addClass(style.active);
            return btn;
          }),
      );
    }) as EventListener);
    window.addEventListener('USER_EXTERNAL_LOGIN_EVENT', ((e: CustomEvent<User>) => {
      if (this.users.map((el) => el.login).includes(e.detail.login)) {
        this.usersList.children.filter((el) => el.getNode().textContent === e.detail.login)[0].addClass(style.active);
      } else {
        this.usersList.append(button(`${style.elem} ${style.active}`, `${e.detail.login}`));
      }
      // this.updateUsersList();
    }) as EventListener);
    window.addEventListener('USER_EXTERNAL_LOGOUT_EVENT', ((e: CustomEvent<User>) => {
      if (this.users.map((el) => el.login).includes(e.detail.login)) {
        this.usersList.children
          .filter((el) => el.getNode().textContent === e.detail.login)[0]
          .removeClass(style.active);
      }
      // this.updateUsersList();
    }) as EventListener);

    this.updateUsersList();
  }

  private async updateUsersList() {
    this.users = [];
    Api.getInstance()
      .allAuthUsers()
      .then(() => Api.getInstance().allNonAuthUsers());
  }
}
