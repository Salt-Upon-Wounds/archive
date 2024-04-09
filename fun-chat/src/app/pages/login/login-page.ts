import { BaseComponent } from '../../components/base-component';
import { button, div, h1, input, p } from '../../components/tags';
import go from '../../utils/routing';
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
  constructor() {
    super({ className: style.login });

    const title = h1(style.title, 'Login');
    const name = input(style.textInput, { type: 'text' });
    const password = input(style.textInput, { type: 'text' });
    const port = input(style.textInput, { type: 'text' });
    const hint = p(style.port, '?');
    const portRow = div({ className: style.rowWrapper }, port, hint);
    const info = button(style.button, 'Info', () => go('about'));
    const ok = button(style.button, 'Ok');
    const btns = div({ className: style.buttonsWrapper }, info, ok);

    this.appendChildren([title, name, password, portRow, btns]);
  }
}
