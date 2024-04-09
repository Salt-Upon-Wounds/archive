import { BaseComponent } from '../base-component';
import { p } from '../tags';
import style from './styles.module.scss';

export default class Header extends BaseComponent {
  constructor() {
    super({ className: style.header });
    const title = p(style.title, 'FunChat');
    this.appendChildren([title]);
  }
}
