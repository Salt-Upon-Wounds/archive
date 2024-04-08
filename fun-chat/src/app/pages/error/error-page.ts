import { BaseComponent } from '../../components/base-component';

export default class ErrorPage extends BaseComponent {
  constructor(code: string) {
    super({ className: `error${code}` });
  }
}
