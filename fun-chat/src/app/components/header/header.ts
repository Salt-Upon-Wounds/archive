import Api from '../../utils/api';
import { go } from '../../utils/routing';
import { loadUser } from '../../utils/storage';
import { BaseComponent } from '../base-component';
import { button, div, p } from '../tags';
import style from './styles.module.scss';

export default class Header extends BaseComponent {
  constructor() {
    super({ className: style.header });
    const name = p(style.text, 'Пользователь: Тест');
    const title = p(style.title, 'FunChat');
    const text = div({ className: style.textWrapper }, name, title);
    const info = button(style.button, 'Info', () => go('about'));
    const logout = button(style.button, 'Logout', () => Header.logoutClick());
    const btns = div({ className: style.buttonsWrapper }, info, logout);
    this.appendChildren([text, btns]);
  }

  private static logoutClick() {
    const user = loadUser();
    if (user) {
      Api.getInstance(user.port?.toString()).logout(user.login, user.password);
    }
    sessionStorage.clear();
    go('login');
  }
}
