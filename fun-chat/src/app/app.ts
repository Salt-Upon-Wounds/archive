import { BaseComponent } from './components/base-component';
import { div } from './components/tags';
import AboutPage from './pages/about/about-page';
import ChatPage from './pages/chat/chat-page';
import ErrorPage from './pages/error/error-page';
import LoginPage from './pages/login/login-page';
import Api from './utils/api';
import { redirect } from './utils/routing';
import { loadUser } from './utils/storage';

class App {
  private pref = import.meta.env.VITE_urlprefix ?? '/';

  private routes: { [str: string]: () => BaseComponent | undefined } = {
    '404': () => new ErrorPage('404'),
    [this.pref]: () => redirect('login'),
    [`${this.pref}login`]: () => {
      if (loadUser()) redirect('chat');
      else {
        const res = new LoginPage();
        Api.targetNode = res.getNode();
        return res;
      }
      return undefined;
    },
    [`${this.pref}chat`]: () => {
      if (!loadUser()) redirect('login');
      else {
        const res = new ChatPage();
        Api.targetNode = res.getNode();
        return res;
      }
      return undefined;
    },
    [`${this.pref}about`]: () =>
      new AboutPage(window.location.pathname.replace(`${import.meta.env.VITE_urlprefix}`, '')),
  };

  private pageWrapper = new BaseComponent({ className: 'main' });

  private spinner = div({ className: 'spinner' });

  private root: HTMLElement;

  constructor() {
    const appdiv = document.createElement('div');
    appdiv.setAttribute('id', 'app');
    document.querySelector('body')!.prepend(appdiv);
    this.root = document.querySelector<HTMLDivElement>('#app')!;
    window.addEventListener('CHAT_SPINNER_ON', () => this.spinner.addClass('active'));
    window.addEventListener('CHAT_SPINNER_OFF', () => this.spinner.removeClass('active'));
    window.addEventListener('USER_LOGOUT_LOGOUT', () => {
      this.spinner.removeClass('active');
    });
  }

  public start(): void {
    this.root.append(this.pageWrapper.getNode(), this.spinner.getNode());
  }

  public route(path: string) {
    this.pageWrapper.destroyChildren();
    /* while (this.pageWrapper.getNode().firstChild) {
      this.pageWrapper.getNode().removeChild(this.pageWrapper.getNode().lastChild as Node);
    } */
    const page = (this.routes[path] ?? this.routes['404'])();
    if (page) this.pageWrapper.appendChildren([page]);
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

const user = loadUser();
if (user) {
  const { login, password, port } = user;
  Api.getInstance(port.toString()).login(login, password);
}
app.route(window.location.pathname);
