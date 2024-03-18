import type { BaseComponent } from './components/base-component';
import PageWrapper from './page';
import GamePage from './pages/game/game-page';
import LoginPage from './pages/login/login-page';

class App {
  private routes: { [str: string]: () => BaseComponent } = {
    '404': () => new LoginPage(),
    '/salt-upon-wounds-JSFE2023Q4/rss-puzzle/': () => new LoginPage(),
    '/salt-upon-wounds-JSFE2023Q4/rss-puzzle/game': () => new GamePage(),
  };

  constructor(
    private pageWrapper: BaseComponent,
    private root: HTMLElement,
  ) {}

  public start(): void {
    this.root.append(this.pageWrapper.getNode());
  }

  public route(path: string) {
    this.pageWrapper.switchPage((this.routes[path] ?? this.routes['404'])());
  }
}
const app = new App(PageWrapper(), document.querySelector<HTMLDivElement>('#app')!);

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
  app.route(`/salt-upon-wounds-JSFE2023Q4/rss-puzzle/${path}`);
}

window.addEventListener('pushState', ((e: CustomEvent) => {
  handleStateChange(e.detail.path);
}) as EventListener);
window.addEventListener('replaceState', ((e: CustomEvent) => {
  handleStateChange(e.detail.path);
}) as EventListener);

if (window.location.pathname !== '/salt-upon-wounds-JSFE2023Q4/rss-puzzle/') app.route(window.location.pathname);
