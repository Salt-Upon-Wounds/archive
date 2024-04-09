import { BaseComponent } from '../../components/base-component';
import { h1 } from '../../components/tags';

export default class ErrorPage extends BaseComponent {
  constructor(code: string) {
    super({ className: `error${code}` });
    this.appendChildren([h1('error', `ERROR ${code}`)]);
  }
}
