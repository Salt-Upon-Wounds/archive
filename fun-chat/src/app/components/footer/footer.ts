import svg from '../../assets/rs_school.svg';
import { BaseComponent } from '../base-component';
import { a, img, p } from '../tags';
import style from './styles.module.scss';

export default class Footer extends BaseComponent {
  constructor() {
    super(
      { className: style.footer },
      img(style.logo, svg, 'logo'),
      a(style.git, 'https://github.com/Salt-Upon-Wounds', 'Salt-Upon-Wounds'),
      p(style.year, '2024'),
    );
  }
}
