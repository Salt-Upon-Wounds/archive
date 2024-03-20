import { BaseComponent } from '../../components/base-component';
import style from './styles.module.scss';

export default class Garage extends BaseComponent {
  constructor() {
    super({ className: style.garage });

    this.appendChildren([]);
  }
}
