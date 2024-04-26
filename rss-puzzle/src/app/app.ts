import { BaseComponent } from './components/base-component';
import GamePage from './pages/game/game-page';
import LoginPage from './pages/login/login-page';
import { URLprefix } from './utils';

class App {
  private routes: { [str: string]: () => BaseComponent } = {
    '404': () => new LoginPage(),
    [`${URLprefix}`]: () => new LoginPage(),
    [`${URLprefix}game`]: () => new GamePage(),
  };

  constructor(
    private root: HTMLElement,
    private pageWrapper = new BaseComponent({ className: 'main' }, new LoginPage()),
  ) {}

  public start(): void {
    this.root.append(this.pageWrapper.getNode());
  }

  public route(path: string) {
    this.pageWrapper.switchPage((this.routes[path] ?? this.routes['404'])());
  }
}
const app = new App(document.querySelector<HTMLDivElement>('#app')!);

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
  app.route(`${URLprefix}${path}`);
}

window.addEventListener('pushState', ((e: CustomEvent) => {
  handleStateChange(e.detail.path);
}) as EventListener);
window.addEventListener('replaceState', ((e: CustomEvent) => {
  handleStateChange(e.detail.path);
}) as EventListener);

if (window.location.pathname !== `${URLprefix}`) app.route(window.location.pathname);
