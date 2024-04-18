import { BaseComponent } from '../../components/base-component';
import Footer from '../../components/footer/footer';
import Header from '../../components/header/header';
import MessageBox from '../../components/message/message';
import { button, div, input, p } from '../../components/tags';
import type { Message, User } from '../../utils/api';
import Api from '../../utils/api';
import { loadUser } from '../../utils/storage';
import style from './styles.module.scss';

export default class ChatPage extends BaseComponent {
  private dialogTarget = '';

  constructor(
    private users: User[] = [],
    private usersList = div({ className: style.list }),
    private messageList = div({ className: style.list }),
    private messageInput = input(style.input, { type: 'text', placeholder: 'Message' }),
    private targetUser = p(style.name, ''),
    private targetUserStatus = p(style.status, ''),
  ) {
    super({ className: style.chat });

    const topRow = div({ className: style.top }, targetUser, targetUserStatus);
    const sendBtn = button(style.send, 'Send', () => this.sendMessageTo());
    const bottomRow = div({ className: style.bottom }, messageInput, sendBtn);
    const messagesDiv = div({ className: style.messages }, topRow, messageList, bottomRow);
    const userInput = input(style.search, { type: 'text', placeholder: 'Search...' });
    const usersDiv = div({ className: style.users }, userInput, this.usersList);
    const wrapper = div({ className: style.center }, usersDiv, messagesDiv);

    this.appendChildren([new Header(), wrapper, new Footer()]);

    window.addEventListener('USERS_EVENT', ((e: CustomEvent<User[]>) => {
      this.users = this.users.concat(e.detail);
      const name = loadUser()?.login ?? '';
      this.usersList.destroyChildren();
      this.usersList.appendChildren(
        this.users
          .filter((el) => el.login !== name)
          .map((el) => {
            const btn = button(style.elem, `${el.login}`, () => this.updateMessageList(el));
            if (el.isLogined) btn.addClass(style.active);
            return btn;
          }),
      );
    }) as EventListener);
    window.addEventListener('USER_EXTERNAL_LOGIN_EVENT', ((e: CustomEvent<User>) => {
      if (this.users.map((el) => el.login).includes(e.detail.login)) {
        this.usersList.children.filter((el) => el.getNode().textContent === e.detail.login)[0].addClass(style.active);
      } else {
        this.usersList.append(
          button(`${style.elem} ${style.active}`, `${e.detail.login}`, () => this.updateMessageList(e.detail)),
        );
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
    window.addEventListener('MSG_FROM_USER_EVENT', ((e: CustomEvent<Message[]>) => {
      const messages = e.detail;
      const name = loadUser()?.login ?? '';
      this.messageList.appendChildren(messages.map((el) => new MessageBox(el.to !== name, el)));
      setTimeout(() => {
        this.messageList.getNode().scrollTop = this.messageList.getNode().scrollHeight;
      });
    }) as EventListener);
    window.addEventListener('MSG_SEND_EVENT', ((e: CustomEvent<Message>) => {
      const message = e.detail;
      const name = loadUser()?.login ?? '';
      this.messageList.append(new MessageBox(message.to !== name, message));
      setTimeout(() => {
        this.messageList.getNode().scrollTop = this.messageList.getNode().scrollHeight;
      });
    }) as EventListener);

    this.updateUsersList();
  }

  private async sendMessageTo() {
    Api.getInstance().sendMessageTo(this.dialogTarget, this.messageInput.getNode().value);
    this.messageInput.getNode().value = '';
  }

  private async updateMessageList(targetUser: User) {
    Api.getInstance().fetchMessageHistory(targetUser.login);
    this.dialogTarget = targetUser.login;
    this.targetUser.getNode().textContent = targetUser.login;
    if (targetUser.isLogined) {
      this.targetUserStatus.addClass(style.active);
      this.targetUserStatus.getNode().textContent = 'online';
    } else {
      this.targetUserStatus.removeClass(style.active);
      this.targetUserStatus.getNode().textContent = 'offline';
    }
  }

  private async updateUsersList() {
    this.users = [];
    Api.getInstance()
      .allAuthUsers()
      .then(() => Api.getInstance().allNonAuthUsers());
  }
}
