import { BaseComponent } from '../../components/base-component';
import { button, div, h1, input, p } from '../../components/tags';
import Api from '../../utils/api';
import { go } from '../../utils/routing';
import { saveUser } from '../../utils/storage';
import style from './styles.module.scss';
/*
TODO:
(+10) The authentication form validates the entered data based on at least two different criteria.
Such as, for example, case sensitivity and the use of special characters. The selection of validation
criteria and their display options is at the student's discretion and must be evaluated solely based on
the quantity and functionality.
(+5) The user is unable to submit an authentication request with data that has not passed validation.
(+5) In case of an authentication error (based on the server response), a message indicating the
corresponding error sent by the server must be displayed.
(+5) User authentication is possible both by clicking the button with the mouse or by pressing the
"Enter" key without the need to focus on the button.
*/
export default class Login extends BaseComponent {
  constructor(
    private name = input(style.textInput, { type: 'text', placeholder: 'name' }),
    private password = input(style.textInput, { type: 'password', placeholder: 'password' }),
    private port = input(style.textInput, { type: 'text', placeholder: `${import.meta.env.VITE_port}` }),
  ) {
    super({ className: style.login });

    const title = h1(style.title, 'Login');
    const hint = p(style.port, '?');
    const portRow = div({ className: style.rowWrapper }, port, hint);
    const info = button(style.button, 'Info', () => go('about'));
    const ok = button(style.button, 'Ok', () => this.submit());
    const btns = div({ className: style.buttonsWrapper }, info, ok);

    this.appendChildren([title, name, password, portRow, btns]);
  }

  private submit() {
    const login = this.name.getNode().value;
    const password = this.password.getNode().value;
    const port = this.port.getNode().value;

    saveUser(login, password, port);

    Api.getInstance(port)
      .login(login, password)
      .then(() => go('chat'));
  }
}
