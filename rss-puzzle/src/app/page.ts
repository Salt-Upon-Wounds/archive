import { BaseComponent } from './components/base-component';
import LoginPage from './pages/login/login-page';

class PageWrapperComponent extends BaseComponent {
  constructor() {
    super({ className: 'main' });
    this.appendChildren([new LoginPage()]);
  }
}

export default () => new PageWrapperComponent();
