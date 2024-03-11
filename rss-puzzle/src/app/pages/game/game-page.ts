import { BaseComponent } from '../../components/base-component';
import { h1 } from '../../components/tags';

export default class GamePage extends BaseComponent {
  private readonly title: BaseComponent;

  constructor() {
    super({ className: '' });
    this.title = h1('', 'ENGLISH PUZZLE GAME');

    this.appendChildren([this.title]);
  }
}
