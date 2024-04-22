import { BaseComponent } from '../../components/base-component';
import { button, div, h1, input, p } from '../../components/tags';
import type { User } from '../../utils/api';
import Api from '../../utils/api';
import { go } from '../../utils/routing';
import { saveUser } from '../../utils/storage';
import style from './styles.module.scss';

export default class Login extends BaseComponent {
  constructor(
    private name = input(style.textInput, { type: 'text', placeholder: 'name' }),
    private password = input(style.textInput, { type: 'password', placeholder: 'password' }),
    private port = input(style.textInput, { type: 'text', placeholder: `${import.meta.env.VITE_port}` }),
    private errormsg = p(`${style.error} ${style.hide}`, ''),
  ) {
    super({ className: style.login });

    const title = h1(style.title, 'Login');
    const hint = div({ className: style.port }, p(style.text, '?'));
    const portRow = div({ className: style.rowWrapper }, port, hint);
    const info = button(style.button, 'Info', () => go('about'));
    const ok = button(style.button, 'Ok', () => this.submit());
    const btns = div({ className: style.buttonsWrapper }, info, ok);
    const hintbox = div(
      { className: `${style.hintbox} ${style.hide}` },
      p(
        style.text,
        `You can set a port value in case of using a custom port for a server. Default value is ${import.meta.env.VITE_port}`,
      ),
    );

    hint.getNode().addEventListener('mousemove', (e: MouseEvent) => {
      hintbox.removeClass(style.hide);
      hintbox.getNode().style.left = `${e.clientX - 145}px`;
      hintbox.getNode().style.top = `${e.clientY - 100}px`;
    });
    hint.getNode().addEventListener('mouseleave', () => {
      hintbox.addClass(style.hide);
    });
    name.getNode().addEventListener('keyup', (e: Event) => {
      if ((e as KeyboardEvent).key === 'Enter') this.submit();
    });
    password.getNode().addEventListener('keyup', (e: Event) => {
      if ((e as KeyboardEvent).key === 'Enter') this.submit();
    });

    window.addEventListener('ERROR_EVENT', ((e: CustomEvent<string>) => {
      this.error(e.detail);
    }) as EventListener);

    window.addEventListener('USER_LOGIN_EVENT', ((e: CustomEvent<User>) => {
      saveUser(e.detail.login, this.password.getNode().value, this.port.getNode().value);
    }) as EventListener);

    window.addEventListener('SOCKET_OPEN', () => {
      window.dispatchEvent(new Event('CHAT_SPINNER_OFF'));
      go('chat');
    });

    window.addEventListener('SOCKET_CLOSE', () => {
      window.dispatchEvent(new Event('CHAT_SPINNER_OFF'));
      this.error('failed to connect. Please check the port');
    });

    this.appendChildren([title, name, password, portRow, errormsg, btns, hintbox]);
  }

  private error(txt: string): void {
    this.errormsg.removeClass(style.hide);
    this.errormsg.getNode().textContent = txt;
  }

  private submit() {
    window.dispatchEvent(new Event('CHAT_SPINNER_ON'));
    this.errormsg.addClass(style.hide);
    const login = this.name.getNode().value;
    const password = this.password.getNode().value;
    const port = this.port.getNode().value;

    if (login.length > 12) {
      this.error('login length must be < 12 characters');
      return;
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d]{6,}$/.test(login)) {
      this.error('login must be minimum 6 characters, at least one letter in uppercase and one letter in lowercase');
      return;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password)) {
      this.error('password must be minimum 6 characters, at least one letter and one number');
      return;
    }
    if (port) {
      const val = Number(port);
      if (!(Number.isInteger(val) && val >= 0 && val <= 65535)) {
        this.error('port value must be empty or integer from 0 to 65535');
        return;
      }
    }

    Api.getInstance(port).login(login, password);
  }
}
