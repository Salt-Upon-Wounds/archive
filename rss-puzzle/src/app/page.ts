import { BaseComponent } from './components/base-component';
import LoginPage from './pages/login/login-page';

class PageWrapperComponent extends BaseComponent {
  constructor() {
    super({ className: 'main' });
    this.appendChildren([new LoginPage(this.switchPage.bind(this))]);
  }

  private switchPage(page: BaseComponent) {
    this.destroyChildren();
    this.append(page);
  }
}

export default () => new PageWrapperComponent();
