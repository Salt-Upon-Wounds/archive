import { BaseComponent } from '../../components/base-component';
import { button, div } from '../../components/tags';
import style from './styles.module.scss';

type Data = {
  rounds: [
    {
      levelData: { [key: string]: string };
      words: [{ [key: string]: string }];
    },
  ];
  roundsCount: number;
};

export default class GamePage extends BaseComponent {
  private bottomfield: BaseComponent = new BaseComponent({});

  private mainfield: BaseComponent = new BaseComponent({});

  private continueBtn: BaseComponent = new BaseComponent({});

  private checkBtn: BaseComponent = new BaseComponent({});

  private field: number = 0;

  private data: Data[] = [];

  private level: number = 0;

  private round: number = 0;

  constructor() {
    super({ className: style.game });
    if (!localStorage.getItem('surname') || !localStorage.getItem('name'))
      window.history.pushState({ path: 'game' }, '', `${window.location.origin}/rss-puzzle/`);

    const links: string[] = [];
    for (let i = 1; i < 7; i += 1) {
      links.push(
        `https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/data/wordCollectionLevel${i}.json`,
      );
    }
    (async () => {
      this.data = await Promise.all(links.map((link) => GamePage.api<Data>(link)));

      const str = this.data[this.level].rounds[this.round].words[this.field].textExample;

      this.bottomfield = div(
        {
          className: style.bottomField,
        },
        ...GamePage.shuffleArray(this.words(str, this.bottomClick)),
      );
      this.mainfield = div(
        { className: style.fieldWrapper },
        div({ className: style.rowNumbers }),
        div(
          { className: style.field },
          ...new Array<number>(10)
            .fill(1)
            .map<BaseComponent>(() => div({ className: `${style.bottomField} ${style.hide}` })),
        ),
      );
      this.populateField();

      this.continueBtn = button(`${style.btn} ${style.completeHide}`, 'Continue', this.continueClick.bind(this));
      this.checkBtn = button(`${style.btn} ${style.completeHide}`, 'Check', this.checkClick.bind(this));

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
          div({ className: style.bottomBtns }, button(style.btn, "I don't know"), this.continueBtn, this.checkBtn),
        ),
      ]);
    })();
  }

  private populateField() {
    for (let i = 0; i < 10; i += 1) {
      const tmp = this.words(this.data[this.level].rounds[this.round].words[i].textExample, this.upperClick);
      for (let idx = 0; idx < tmp.length; idx += 1) {
        tmp[idx].getNode().style.order = `${idx + 1}`;
        tmp[idx].getNode().setAttribute('answer', `${idx}`);
      }
      this.mainfield.children[1].children[i].destroyChildren();
      this.mainfield.children[1].children[i].appendChildren(tmp);
    }
  }

  private populateBottom() {
    this.bottomfield.destroyChildren();
    this.bottomfield.appendChildren(
      GamePage.shuffleArray(
        this.words(this.data[this.level].rounds[this.round].words[this.field].textExample, this.bottomClick),
      ),
    );
  }

  private checkClick() {
    this.mainfield.children[1].children[this.field].children.forEach((el) => {
      if (Number(el.getNode().getAttribute('answer')) !== Number(el.getNode().style.order) - 1) {
        (async () => {
          el.addClass(style.error);
          await new Promise((resolve) => {
            setTimeout(resolve, 2000);
          });
          el.removeClass(style.error);
        })();
      }
    });
  }

  private continueClick() {
    if (this.field >= 9) {
      this.field = 0;
      this.round += 1;
      if (this.round >= Number(this.data[this.level].roundsCount)) {
        this.round = 0;
        if (this.field !== 5) this.field += 1;
      }
      this.populateField();
      this.populateBottom();
    } else {
      this.mainfield.children[1].children[this.field].children.forEach((el) => {
        const tmp = el;
        tmp.getNode().onclick = () => {};
      });
      this.field += 1;
      this.populateBottom();
    }
    this.continueBtn.addClass(style.completeHide);
  }

  private static api<T>(url: string): Promise<T> {
    return fetch(url).then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json() as Promise<T>;
    });
  }

  private bottomClick(e: Event) {
    const { currentTarget } = e;
    const idx = this.field;
    const fields = document.querySelectorAll<HTMLElement>(`.${style.bottomField}`);
    const fieldToSwap = [...fields[idx].querySelectorAll<HTMLElement>(`.${style.element}`)]
      .filter(
        (el) =>
          !el.checkVisibility({ contentVisibilityAuto: true, visibilityProperty: true } as CheckVisibilityOptions),
      )
      .sort((a, b) => Number(a.style.order) - Number(b.style.order))[0];
    const fieldOrig = fields[idx].querySelectorAll<HTMLElement>(`.${style.element}`)[
      Number((currentTarget as HTMLElement).getAttribute('answer'))
    ];
    const tmp = fieldToSwap.style.order;
    fieldToSwap.style.order = fieldOrig.style.order;
    fieldOrig.style.order = tmp;
    fieldOrig.style.visibility = 'visible';
    (currentTarget as HTMLElement).style.visibility = 'hidden';
    const flags = GamePage.checkLine([...fields[idx].querySelectorAll<HTMLElement>(`.${style.element}`)]);
    if (flags[0]) {
      if (flags[1]) this.continueBtn.removeClass(style.completeHide);
      else this.checkBtn.removeClass(style.completeHide);
    } else {
      this.checkBtn.addClass(style.completeHide);
      this.continueBtn.addClass(style.completeHide);
    }
  }

  private static checkLine(line: HTMLElement[]) {
    let right = true;
    for (let i = 0; i < line.length; i += 1) {
      if (!line[i].checkVisibility({ contentVisibilityAuto: true, visibilityProperty: true } as CheckVisibilityOptions))
        return [false, false];
      if (Number(line[i].getAttribute('answer')) !== Number(line[i].style.order) - 1) right = false;
    }
    return [true, right];
  }

  private upperClick(e: Event) {
    const { currentTarget } = e;
    const fields = document.querySelectorAll<HTMLElement>(`.${style.bottomField}`);
    (currentTarget as HTMLElement).style.visibility = 'hidden';
    [...fields[fields.length - 1].querySelectorAll<HTMLElement>(`.${style.element}`)].filter(
      (el) => el.getAttribute('answer') === (currentTarget as HTMLElement).getAttribute('answer'),
    )[0].style.visibility = 'visible';
    this.checkBtn.addClass(style.completeHide);
    this.continueBtn.addClass(style.completeHide);
  }

  /* private static makeCounter() {
    let num = -1;
    return (plus: boolean = true) => {
      if (plus) num += 1;
      else num -= 1;
      return num;
    };
  } */

  private words(str: string, click: (e: Event) => void): BaseComponent[] {
    const tmp = str.split(' ');
    return tmp.map<BaseComponent>((el, idx) => {
      const elDiv = div({ className: style.element, textContent: el, onclick: click.bind(this) });
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
