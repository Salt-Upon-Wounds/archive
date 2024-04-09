import { BaseComponent } from './components/base-component';
import AboutPage from './pages/about/about-page';
import ChatPage from './pages/chat/chat-page';
import ErrorPage from './pages/error/error-page';
import LoginPage from './pages/login/login-page';
import go from './utils/routing';

class App {
  private chat = new ChatPage();

  private about = new AboutPage();

  private pref = import.meta.env.VITE_urlprefix ?? '/';

  private routes: { [str: string]: () => BaseComponent } = {
    '404': () => new ErrorPage('404'),
    [this.pref]: () => go('login'),
    [`${this.pref}login`]: () => new LoginPage(),
    [`${this.pref}chat`]: () => this.chat,
    [`${this.pref}about`]: () => this.about,
  };

  private pageWrapper: BaseComponent = new BaseComponent({ className: 'main' });

  private root: HTMLElement;

  constructor() {
    const appdiv = document.createElement('div');
    appdiv.setAttribute('id', 'app');
    document.querySelector('body')!.prepend(appdiv);
    this.root = document.querySelector<HTMLDivElement>('#app')!;
  }

  public start(): void {
    this.root.append(this.pageWrapper.getNode());
  }

  public route(path: string) {
    while (this.pageWrapper.getNode().firstChild) {
      this.pageWrapper.getNode().removeChild(this.pageWrapper.getNode().lastChild as Node);
    }
    const page = (this.routes[path] ?? this.routes['404'])()?.getNode();
    if (page) this.pageWrapper.getNode().append(page);
  }
}
const app = new App();

app.start();

window.history.pushState = new Proxy(window.history.pushState, {
  apply: (
    target,
    thisArg,
    argArray: [data: { [str: string]: string }, unused: string, url?: string | URL | null | undefined],
  ) => {
    const e = new CustomEvent('pushState', { detail: argArray[0] });
    window.dispatchEvent(e);
    return target.apply(thisArg, argArray);
  },
});
window.history.replaceState = new Proxy(window.history.replaceState, {
  apply: (
    target,
    thisArg,
    argArray: [data: { [str: string]: string }, unused: string, url?: string | URL | null | undefined],
  ) => {
    const e = new CustomEvent('replaceState', { detail: argArray[0] });
    window.dispatchEvent(e);
    return target.apply(thisArg, argArray);
  },
});

function handleStateChange(path: string) {
  app.route(`${import.meta.env.VITE_urlprefix}${path}`);
}

window.addEventListener('pushState', ((e: CustomEvent) => {
  handleStateChange(e.detail.path);
}) as EventListener);
window.addEventListener('replaceState', ((e: CustomEvent) => {
  handleStateChange(e.detail.path);
}) as EventListener);
window.addEventListener('popstate', () => {
  handleStateChange(window.location.pathname.replace(`${import.meta.env.VITE_urlprefix}`, ''));
});

app.route(window.location.pathname);
