import { BaseComponent } from './components/base-component';

class PageWrapperComponent extends BaseComponent {
  constructor() {
    super(
      {
        className: 'page-wrapper',
      },
      // Header(),
      // main({ className: 'main' }, MovieListPage(movieService)),
    );
  }
}

export default () => new PageWrapperComponent();
