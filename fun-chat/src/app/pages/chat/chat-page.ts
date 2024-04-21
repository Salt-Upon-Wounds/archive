import { BaseComponent } from '../../components/base-component';
import Footer from '../../components/footer/footer';
import Header from '../../components/header/header';
import MessageBox from '../../components/message/message';
import { button, div, input, p } from '../../components/tags';
import type { Message, ServerResponse, User } from '../../utils/api';
import Api from '../../utils/api';
import { loadUser } from '../../utils/storage';
import style from './styles.module.scss';

export default class ChatPage extends BaseComponent {
  private dialogTarget = '';

  private editId = '';

  constructor(
    private users: User[] = [],
    private messages: { [key: string]: Message[] | string } = {},
    private usersList = div({ className: style.list }),
    private messageList = div({ className: style.list }),
    private messageInput = input(style.input, { type: 'text', placeholder: 'Choose user to enable chat' }),
    private sendBtn = button(style.send, 'Send', () => this.sendMessageTo()),
    private targetUser = p(style.name, ''),
    private targetUserStatus = p(style.status, ''),
  ) {
    super({ className: style.chat });

    messageInput.addClass(style.hide);
    sendBtn.addClass(style.hide);
    const userInput = input(style.search, { type: 'text', placeholder: 'Search...' });
    const topRow = div({ className: style.top }, targetUser, targetUserStatus);
    messageInput.getNode().addEventListener('keyup', (e: Event) => {
      if ((e as KeyboardEvent).key === 'Enter') this.sendMessageTo();
    });
    const bottomRow = div({ className: style.bottom }, messageInput, sendBtn);
    const messagesDiv = div({ className: style.messages }, topRow, messageList, bottomRow);
    const usersDiv = div({ className: style.users }, userInput, this.usersList);
    const wrapper = div({ className: style.center }, usersDiv, messagesDiv);

    this.appendChildren([new Header(), wrapper, new Footer()]);

    userInput.getNode().addEventListener('input', (e: Event) => {
      this.filterUsers((e as InputEvent).data ?? '');
    });

    window.addEventListener('USERS_EVENT', ((e: CustomEvent<User[]>) => {
      const name = loadUser()?.login ?? '';
      this.users = this.users.concat(e.detail).filter((el) => el.login !== name);
      this.users.forEach((el) => {
        const id = crypto.randomUUID();
        this.messages[`${el.login}`] = id;
        Api.getInstance().fetchMessageHistory(el.login, id);
      });
    }) as EventListener);

    window.addEventListener('USER_EXTERNAL_LOGIN_EVENT', ((e: CustomEvent<User>) => {
      if (this.users.map((el) => el.login).includes(e.detail.login)) {
        this.usersList.children.filter((el) => el.getNode().textContent === e.detail.login)[0].addClass(style.active);
        this.users.filter((el) => el.login === e.detail.login)[0].isLogined = true;
      } else {
        this.users.push(e.detail);
        this.messages[`${e.detail.login}`] = [];
        this.usersList.append(
          button(`${style.elem} ${style.active}`, `${e.detail.login}`, () => this.updateMessageList(e.detail)),
        );
      }
      if (this.targetUser.getNode().textContent === e.detail.login) {
        this.targetUserStatus.addClass(style.active);
        this.targetUserStatus.getNode().textContent = 'online';
      }
    }) as EventListener);

    window.addEventListener('USER_EXTERNAL_LOGOUT_EVENT', ((e: CustomEvent<User>) => {
      if (this.users.map((el) => el.login).includes(e.detail.login)) {
        this.usersList.children
          ?.filter((el) => el.getNode().textContent === e.detail.login)[0]
          ?.removeClass(style.active);
        this.users.filter((el) => el.login === e.detail.login)[0].isLogined = false;
      }
      if (this.targetUser.getNode().textContent === e.detail.login) {
        this.targetUserStatus.removeClass(style.active);
        this.targetUserStatus.getNode().textContent = 'offline';
      }
    }) as EventListener);

    window.addEventListener('MSG_FROM_USER_EVENT', ((e: CustomEvent<ServerResponse>) => {
      const response = e.detail;
      let allDoneFlag = true;
      for (const [key, val] of Object.entries(this.messages)) {
        if (val === response.id) this.messages[`${key}`] = response.payload!.messages!;
        if (typeof this.messages[`${key}`] === 'string') allDoneFlag = false;
      }
      if (allDoneFlag) this.filterUsers(userInput.getNode().value);
    }) as EventListener);

    window.addEventListener('MSG_SEND_EVENT', ((e: CustomEvent<Message>) => {
      const message = e.detail;
      const name = loadUser()?.login ?? '';
      const target = `${message.to === name ? message.from : message.to}`;
      if (this.messages[`${target}`] instanceof Array) (this.messages[`${target}`] as Array<Message>).push(message);
      else this.messages[`${target}`] = [message];
      if (!(this.dialogTarget === e.detail.from || this.dialogTarget === e.detail.to)) return;

      this.messageList.append(new MessageBox(message.to !== name, message));
      const btn = usersList.children.filter((el) => el.getNode().textContent === message.from)[0];
      if (message.from !== name) {
        const unreadMsgs = (this.messages[`${message.from}`] as Array<Message>).filter(
          (mes) => mes.from !== name && !mes.status?.isReaded,
        ).length;
        if (unreadMsgs > 0) {
          btn.addClass(style.unread);
          btn.getNode().dataset.unread = unreadMsgs.toString();
        }
      }
      setTimeout(() => {
        this.messageList.getNode().scrollTop = this.messageList.getNode().scrollHeight;
      });
    }) as EventListener);

    window.addEventListener('DELETE_CLICK_EVENT', ((e: CustomEvent<Message>) => {
      if (e.detail.id) {
        Api.getInstance().deleteMessage(e.detail.id);
        if (e.detail.id === this.editId) this.editId = '';
      }
    }) as EventListener);

    window.addEventListener('EDIT_CLICK_EVENT', ((e: CustomEvent<Message>) => {
      this.editId = e.detail.id ?? '';
      this.messageInput.getNode().value = e.detail.text!;
    }) as EventListener);

    window.addEventListener('MSG_DELETE_EVENT', ((e: CustomEvent<Message>) => {
      for (const key of Object.keys(this.messages)) {
        for (let i = 0; i < this.messages[`${key}`].length; i += 1) {
          if (
            typeof this.messages[`${key}`] === 'object' &&
            (this.messages[`${key}`][i] as Message).id === e.detail.id
          ) {
            (this.messages[`${key}`] as Array<Message>).splice(i, 1);
            break;
          }
        }
      }
      this.messageList.children.forEach((el) => {
        let box: MessageBox;
        if (el instanceof MessageBox) {
          box = el as MessageBox;
          if (box.id === e.detail.id) {
            const { status } = el as MessageBox;
            if (status && !status.isReaded) {
              const target = usersList.children.filter(
                (user) => user.getNode().textContent === box.messageFull.from,
              )[0];
              if (target) {
                target.getNode().dataset.unread = (Number(target.getNode().dataset.unread) - 1).toString();
                if (!Number(target.getNode().dataset.unread)) {
                  target.removeClass(style.unread);
                }
              }
            }
            box.destroy();
          }
        }
      });
    }) as EventListener);

    window.addEventListener('MSG_EDIT_EVENT', ((e: CustomEvent<Message>) => {
      for (const key of Object.keys(this.messages)) {
        for (let i = 0; i < this.messages[`${key}`].length; i += 1) {
          if (
            typeof this.messages[`${key}`] === 'object' &&
            (this.messages[`${key}`][i] as Message).id === e.detail.id
          ) {
            (this.messages[`${key}`][i] as Message).text = e.detail.text;
            break;
          }
        }
      }
      this.messageList.children.forEach((el) => {
        if (el instanceof MessageBox && (el as MessageBox).id === e.detail.id) {
          (el as MessageBox).edit(e.detail.text!);
        }
      });
    }) as EventListener);

    window.addEventListener('MSG_DELIVER_EVENT', ((e: CustomEvent<Message>) => {
      for (const key of Object.keys(this.messages)) {
        for (let i = 0; i < this.messages[`${key}`].length; i += 1) {
          if (
            typeof this.messages[`${key}`] === 'object' &&
            (this.messages[`${key}`][i] as Message).id === e.detail.id
          ) {
            (this.messages[`${key}`][i] as Message).status!.isDelivered = e.detail.status!.isDelivered;
            break;
          }
        }
      }
      this.messageList.children.forEach((el) => {
        if (el instanceof MessageBox && (el as MessageBox).id === e.detail.id) {
          (el as MessageBox).deliver();
        }
      });
    }) as EventListener);

    this.updateUsersList();
  }

  private async sendMessageTo() {
    if (this.messageInput.getNode().value === '') return;
    if (this.editId !== '') {
      Api.getInstance().editMessage(this.editId, this.messageInput.getNode().value);
      this.editId = '';
    } else {
      Api.getInstance().sendMessageTo(this.dialogTarget, this.messageInput.getNode().value);
    }
    this.messageInput.getNode().value = '';
  }

  private async updateMessageList(targetUser: User) {
    this.messageInput.getNode().placeholder = 'Message';
    this.messageInput.removeClass(style.hide);
    this.sendBtn.removeClass(style.hide);
    const name = loadUser()?.login ?? '';
    let firstUnreadFlag = true;
    this.messageList.destroyChildren();
    if (this.messages[`${targetUser.login}`] instanceof Array) {
      this.messageList.appendChildren(
        (this.messages[`${targetUser.login}`] as Array<Message>).map((el) => new MessageBox(el.to !== name, el)),
      );
    }
    this.messageList.children.forEach((el) => {
      const mes = el as MessageBox;
      if (firstUnreadFlag && mes.messageFull.from !== name && !mes.status?.isReaded) {
        mes.lineOn();
        firstUnreadFlag = false;
      }
    });
    setTimeout(() => {
      this.messageList.getNode().scrollTop = this.messageList.getNode().scrollHeight;
    });
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

  private filterUsers(txt: string) {
    const name = loadUser()?.login;
    this.usersList.destroyChildren();
    this.usersList.appendChildren(
      this.users
        .filter((el) => txt === '' || (txt !== '' && el.login.match(txt)))
        .map((el) => {
          const btn = button(style.elem, `${el.login}`, () => this.updateMessageList(el));
          const unreadMsgs = (this.messages[`${el.login}`] as Array<Message>).filter(
            (mes) => mes.from !== name && !mes.status?.isReaded,
          ).length;
          if (unreadMsgs > 0) {
            btn.addClass(style.unread);
            btn.getNode().dataset.unread = unreadMsgs.toString();
          }
          if (el.isLogined) btn.addClass(style.active);
          return btn;
        }),
    );
  }
}
