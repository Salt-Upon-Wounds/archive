import { BaseComponent } from '../../components/base-component';
import { button, div } from '../../components/tags';
import style from './styles.module.scss';

export default class GamePage extends BaseComponent {
  private bottomfield: BaseComponent;

  private mainfield: BaseComponent;

  private FieldCounter: (plus?: boolean) => number;

  private Field: number;

  constructor() {
    super({ className: style.game });
    if (!localStorage.getItem('surname') || !localStorage.getItem('name'))
      window.history.pushState({ path: 'game' }, '', `${window.location.origin}/rss-puzzle/`);

    const test = 'as asdaadsd qwe zccc [pop[o nbnbnbnbmbbn ui';
    this.FieldCounter = GamePage.makeCounter();
    this.Field = this.FieldCounter();

    this.bottomfield = div(
      {
        className: style.bottomField,
        onclick: this.bottomClick.bind(this),
      },
      ...GamePage.shuffleArray(GamePage.words(test)),
    );
    this.mainfield = div(
      { className: style.fieldWrapper },
      div({ className: style.rowNumbers }),
      div(
        { className: style.field },
        ...new Array<number>(10)
          .fill(1)
          .map<BaseComponent>(() =>
            div({ className: `${style.bottomField} ${style.hide}`, onclick: GamePage.upperClick }),
          ),
      ),
    );
    const tmp = GamePage.words(test);
    for (let idx = 0; idx < tmp.length; idx += 1) {
      tmp[idx].getNode().style.order = `${idx + 1}`;
      tmp[idx].getNode().setAttribute('answer', `${idx}`);
    }
    this.mainfield.children[1].children[0].appendChildren(tmp);

    this.appendChildren([
      div(
        { className: style.game },
        div(
          { className: style.buttons },
          div({ className: 'level-selections' }),
          div({ className: 'hints' }),
          button(style.btn, 'Logout', () => {
            localStorage.removeItem('name');
            localStorage.removeItem('surname');
            window.history.pushState({ path: '' }, '', `${window.location.origin}/rss-puzzle/`);
          }),
        ),
        div({ className: 'sound-hint' }),
        this.mainfield,
        this.bottomfield,
        button(style.btn, "I don't know"),
      ),
    ]);
  }

  private bottomClick(e: Event) {
    const { target } = e;
    const idx = this.Field;
    const fields = document.querySelectorAll<HTMLElement>(`.${style.bottomField}`);
    const fieldToSwap = [...fields[0].querySelectorAll<HTMLElement>(`.${style.element}`)]
      .filter(
        (el) =>
          !el.checkVisibility({ contentVisibilityAuto: true, visibilityProperty: true } as CheckVisibilityOptions),
      )
      .sort((a, b) => Number(a.style.order) - Number(b.style.order))[0];
    const fieldOrig = fields[idx].querySelectorAll<HTMLElement>(`.${style.element}`)[
      Number((target as HTMLElement).getAttribute('answer'))
    ];
    const tmp = fieldToSwap.style.order;
    fieldToSwap.style.order = fieldOrig.style.order;
    fieldOrig.style.order = tmp;
    fieldOrig.style.visibility = 'visible';
    (target as HTMLElement).style.visibility = 'hidden';
  }

  private static upperClick(e: Event) {
    const { target } = e;
    const fields = document.querySelectorAll<HTMLElement>(`.${style.bottomField}`);
    (target as HTMLElement).style.visibility = 'hidden';
    [...fields[fields.length - 1].querySelectorAll<HTMLElement>(`.${style.element}`)].filter(
      (el) => el.getAttribute('answer') === (target as HTMLElement).getAttribute('answer'),
    )[0].style.visibility = 'visible';
  }

  private static makeCounter() {
    let num = -1;
    return (plus: boolean = true) => {
      if (plus) num += 1;
      else num -= 1;
      return num;
    };
  }

  private static words(str: string): BaseComponent[] {
    const tmp = str.split(' ');
    return tmp.map<BaseComponent>((el, idx) => {
      const elDiv = div({ className: style.element, textContent: el });
      elDiv.getNode().setAttribute('answer', `${idx}`);
      if (idx === 0) elDiv.addClass(style.first);
      else if (idx === tmp.length - 1) elDiv.addClass(style.last);
      else elDiv.addClass(style.center);
      return elDiv;
    });
  }

  private static shuffleArray(arr: BaseComponent[]) {
    const res = arr.slice();
    for (let i = res.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = res[i];
      res[i] = res[j];
      res[j] = temp;
    }
    if (!res[0].containsClass(style.first)) {
      for (let i = 0; i < res.length; i += 1) {
        if (i === 0 && res[i].containsClass(style.center)) res[i].addClass(style.toleft);
        else if (res[i].containsClass(style.first)) {
          if (!(i > 0 && res[i - 1].containsClass(style.last))) res[i].addClass(style.toright);
          break;
        }
      }
    }
    return res;
  }
}
