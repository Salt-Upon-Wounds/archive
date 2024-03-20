import { BaseComponent } from '../../components/base-component';
import style from './styles.module.scss';

export default class Winners extends BaseComponent {
  constructor() {
    super({ className: style.winners });

    this.appendChildren([]);
  }
}
