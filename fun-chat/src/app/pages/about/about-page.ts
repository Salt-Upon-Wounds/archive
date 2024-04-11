import { BaseComponent } from '../../components/base-component';
import { a, button, h1, p } from '../../components/tags';
import { go } from '../../utils/routing';
import style from './styles.module.scss';

export default class AboutPage extends BaseComponent {
  constructor(prev?: string) {
    super(
      { className: style.about },
      h1(style.title, 'FunChat'),
      p(
        style.description,
        'Fusce vel erat sagittis ipsum pharetra vestibulum vitae et ex. Fusce tempus nulla nisi, nec bibendum arcu placerat pretium. Sed sit amet libero sodales, finibus neque posuere, fringilla turpis. In sagittis gravida ex a fermentum. Fusce egestas eu neque sit amet ornare. In quis ex justo. In et mi fermentum odio auctor mollis. Donec cursus lacus in dapibus fermentum. Curabitur tincidunt suscipit ultrices. Cras augue ex, efficitur in lacinia eget, sodales vel risus. Praesent vehicula efficitur orci eget aliquet. Cras ut consequat nisi, id scelerisque ligula. Curabitur ac tellus eu erat pharetra semper at ut nibh.',
      ),
      a(style.link, 'https://github.com/Salt-Upon-Wounds', 'Author: Salt-Upon-Wounds'),
      button(style.btn, 'Go back', () => go(prev && prev !== 'about' ? prev : 'login')),
    );
  }
}
