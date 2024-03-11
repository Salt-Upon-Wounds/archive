import { BaseComponent } from '../../components/base-component';
import { button, div } from '../../components/tags';

export default class GamePage extends BaseComponent {
  constructor() {
    super({ className: '' });
    if (!localStorage.getItem('surname') || !localStorage.getItem('name'))
      window.history.pushState({ path: 'game' }, '', `${window.location.origin}/rss-puzzle/`);
    this.appendChildren([
      div(
        { className: '' },
        button('', 'Logout', () => {
          localStorage.removeItem('name');
          localStorage.removeItem('surname');
          window.history.pushState({ path: '' }, '', `${window.location.origin}/rss-puzzle/`);
        }),
      ),
    ]);
  }
}
