import { BaseComponent } from './components/base-component';
import GaragePage from './pages/garage/garage-page';
import WinnersPage from './pages/winners/winners-page';

class App {
  private routes: { [str: string]: () => BaseComponent } = {
    '404': () => new GaragePage(),
    'salt-upon-wounds-JSFE2023Q4/async-race/': () => new GaragePage(),
    '/salt-upon-wounds-JSFE2023Q4/async-race/winners': () => new WinnersPage(),
  };

  private pageWrapper: BaseComponent = new BaseComponent({ className: 'main' });

  private root: HTMLElement;

  constructor(startPage: BaseComponent) {
    const appdiv = document.createElement('div');
    appdiv.setAttribute('id', 'app');
    document.querySelector('body')!.prepend(appdiv);
    this.root = document.querySelector<HTMLDivElement>('#app')!;
    this.pageWrapper.append(startPage);
  }

  public start(): void {
    this.root.append(this.pageWrapper.getNode());
  }

  public route(path: string) {
    this.pageWrapper.switchPage((this.routes[path] ?? this.routes['404'])());
  }
}
const app = new App(new GaragePage());

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
  app.route(`/salt-upon-wounds-JSFE2023Q4/async-race/${path}`);
}

window.addEventListener('pushState', ((e: CustomEvent) => {
  handleStateChange(e.detail.path);
}) as EventListener);
window.addEventListener('replaceState', ((e: CustomEvent) => {
  handleStateChange(e.detail.path);
}) as EventListener);
window.addEventListener('popstate', () => {
  handleStateChange(window.location.pathname.replace('/salt-upon-wounds-JSFE2023Q4/async-race/', ''));
});

if (window.location.pathname !== '/salt-upon-wounds-JSFE2023Q4/async-race/') app.route(window.location.pathname);
