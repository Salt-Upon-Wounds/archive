import { BaseComponent } from '../../components/base-component';
import { h1, input, p } from '../../components/tags';
import style from './styles.module.scss';

export default class LoginPage extends BaseComponent {
  private readonly name: BaseComponent;

  private readonly surname: BaseComponent;

  private readonly title: BaseComponent;

  private readonly desc: BaseComponent;

  private readonly btn: BaseComponent;

  constructor() {
    super({
      className: style.loginPage,
      tag: 'form',
      onsubmit: (e: SubmitEvent) => {
        e.preventDefault();
        function formExtractor(name: string) {
          const form = e.target as HTMLFormElement;
          const elem = form.elements.namedItem(name) as HTMLInputElement;
          return elem.value ?? 'error';
        }
        localStorage.setItem('name', formExtractor('name'));
        localStorage.setItem('surname', formExtractor('surname'));
        window.history.pushState({ path: 'game' }, '', `${window.location.origin}/rss-puzzle/game`);
      },
    });
    if (localStorage.getItem('surname') && localStorage.getItem('name'))
      window.history.pushState({ path: 'game' }, '', `${window.location.origin}/rss-puzzle/game`);
    this.title = h1('', 'ENGLISH PUZZLE');
    this.desc = p(
      style.text,
      'Click on words, collect phrases. Words can be drag and drop. Select tooltips in the menu',
    );
    this.name = input(style.input, {
      name: 'name',
      placeholder: 'Name',
      required: true,
      pattern: '[A-Z]{1}[A-Za-z\\-]{2,}',
      title: 'First letter must be capital && word length > 1',
    });
    this.surname = input(style.input, {
      name: 'surname',
      placeholder: 'Surname',
      required: true,
      pattern: '[A-Z]{1}[A-Za-z\\-]{3,}',
      title: 'First letter must be capital && word length > 2',
    });
    this.btn = input(style.btn, { type: 'submit', value: 'Login' });

    this.appendChildren([this.title, this.desc, this.name, this.surname, this.btn]);
  }
}
