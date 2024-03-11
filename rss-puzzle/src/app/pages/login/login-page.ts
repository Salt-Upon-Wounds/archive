import { BaseComponent } from '../../components/base-component';
import { h1, input, p } from '../../components/tags';
import GamePage from '../game/game-page';
import style from './styles.module.scss';

export default class LoginPage extends BaseComponent {
  private readonly name: BaseComponent;

  private readonly surname: BaseComponent;

  private readonly title: BaseComponent;

  private readonly desc: BaseComponent;

  private readonly btn: BaseComponent;

  constructor(pageSwitcher: (page: BaseComponent) => void) {
    super({
      className: style.loginPage,
      tag: 'form',
      onsubmit: (e: Event) => {
        e.preventDefault();
        pageSwitcher(new GamePage());
      },
    });
    this.title = h1('', 'ENGLISH PUZZLE');
    this.desc = p('', 'cogito ergo sum cogito ergo sum cogito ergo sum');
    this.name = input(style.input, { placeholder: 'Name', required: true });
    this.surname = input(style.input, { placeholder: 'Surname', required: true });
    this.btn = input(style.btn, { type: 'submit', value: 'Login' });

    this.appendChildren([this.title, this.desc, this.name, this.surname, this.btn]);
  }
}
