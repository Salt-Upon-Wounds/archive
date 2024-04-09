import { BaseComponent } from '../../components/base-component';
import Footer from '../../components/footer/footer';
import Header from '../../components/header/header';
import style from './styles.module.scss';

export default class ChatPage extends BaseComponent {
  constructor() {
    super({ className: style.chat });
    this.appendChildren([new Header(), new Footer()]);
  }
}
