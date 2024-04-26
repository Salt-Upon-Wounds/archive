import { BaseComponent } from '../../components/base-component';
import { button, div, p, select } from '../../components/tags';
import { sourceLink, URLprefix } from '../../utils';
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
  private field: number = 0;

  private data: Data[] = [];

  private level: number = 0;

  private round: number = 0;

  private toggler = 1;

  constructor(
    private continueBtn = new BaseComponent({}),
    private checkBtn = new BaseComponent({}),
    private soundHint = new BaseComponent({}),
    private translateHint = new BaseComponent({}),
    private translateBtn = new BaseComponent({}),
    private pictureBtn = new BaseComponent({}),
    private soundBtn = new BaseComponent({}),
    private levelSelect = new BaseComponent({}),
    private roundSelect = new BaseComponent({}),
    private bottomfield: BaseComponent = div({ className: style.bottomField }),
    private mainfield: BaseComponent = div(
      { className: style.fieldWrapper },
      div({ className: style.rowNumbers }),
      div(
        { className: style.field },
        ...new Array<number>(10)
          .fill(1)
          .map<BaseComponent>(() => div({ className: `${style.bottomField} ${style.hide}` })),
      ),
    ),
  ) {
    super({ className: style.game });

    this.loadGame();
  }

  private async loadGame() {
    const links: string[] = [];
    for (let i = 1; i < 7; i += 1) {
      links.push(`${sourceLink}/data/wordCollectionLevel${i}.json`);
    }

    this.data = await Promise.all(links.map((link) => GamePage.api<Data>(link)));

    if (!localStorage.getItem('surname') || !localStorage.getItem('name'))
      window.history.pushState({ path: 'game' }, '', `${window.location.origin}${URLprefix}`);

    this.continueBtn = button(`${style.btn} ${style.completeHide}`, 'Continue', () => this.continueClick());
    this.checkBtn = button(`${style.btn} ${style.completeHide}`, 'Check', () => this.checkClick());
    this.levelSelect = select(
      '',
      new Array(this.data.length).fill(0).map((_, idx) => String(idx + 1)),
      this.selectLevel.bind(this),
    );
    this.roundSelect = select(
      '',
      new Array(this.data[0].roundsCount).fill(0).map((_, idx) => String(idx + 1)),
      this.selectRound.bind(this),
    );
    this.soundHint = button(`${style.btn} ${style.soundHint}`, '', async () => this.playSound());
    this.translateHint = p(style.translation, ' ');
    this.translateBtn = button(style.btn, 'translate', (e: Event) => this.translateClick(e));
    this.pictureBtn = button(style.btn, 'picture', (e: Event) => this.pictureClick(e));
    this.soundBtn = button(style.btn, 'sound', (e: Event) => this.soundClick(e));

    const lastSave = localStorage.getItem('last');
    if (lastSave) {
      const arr = JSON.parse(lastSave);
      this.level = arr.level;
      this.round = arr.round;
      (this.levelSelect.getNode() as HTMLSelectElement).value = String(this.level + 1);
      (this.roundSelect.getNode() as HTMLSelectElement).value = String(this.round + 1);
    }
    this.populateBottom();
    this.populateField();

    this.appendChildren([
      div(
        { className: style.buttons },
        div({ className: style.changeLevel }, p('', 'Level: '), this.levelSelect, p('', 'Round: '), this.roundSelect),
        div({ className: style.hints }, this.translateBtn, this.pictureBtn, this.soundBtn),
        button(style.btn, 'Logout', this.logout.bind(this)),
      ),
      this.soundHint,
      this.translateHint,
      this.mainfield,
      this.bottomfield,
      div(
        { className: style.bottomBtns },
        button(style.btn, 'Autocomplete', this.autocompleteClick.bind(this)),
        this.continueBtn,
        this.checkBtn,
      ),
    ]);
    this.loadSavedHintState();
    this.loadState();
  }

  private loadState() {
    const levels = localStorage.getItem(`Levels`);
    if (levels) {
      const arr = JSON.parse(levels);
      this.levelSelect.children.forEach((el) => {
        const tmp = el;
        if (arr.includes(Number(tmp.getNode().textContent))) tmp.getNode().style.backgroundColor = 'green';
      });
    }
    const rounds = localStorage.getItem(`Level${this.level}`);
    if (rounds) {
      const arr = JSON.parse(rounds);
      this.roundSelect.children.forEach((el) => {
        const tmp = el;
        if (arr.includes(Number(tmp.getNode().textContent) - 1)) tmp.getNode().style.backgroundColor = 'green';
      });
    }
  }

  private saveState(l: number, r: number) {
    const tmp = localStorage.getItem(`Level${l}`);
    if (tmp) {
      let res = JSON.parse(tmp);
      if (!res.includes(r)) res.push(r);
      localStorage.setItem(`Level${l}`, JSON.stringify(res));
      if (res.length === this.data[l].rounds.length) {
        res = JSON.parse('Levels');
        if (!res.includes(l)) res.push(l);
        localStorage.setItem(`Levels`, JSON.stringify(res));
      }
    } else {
      localStorage.setItem(`Level${l}`, JSON.stringify([r]));
    }
  }

  private selectLevel(e: Event) {
    this.level = Number((e.currentTarget as HTMLSelectElement).value) - 1;
    this.round = 0;
    this.roundSelect.destroyChildren();
    this.roundSelect.appendChildren(
      new Array(this.data[this.level].roundsCount).fill(0).map((_, idx) => {
        return new BaseComponent<HTMLElementTagNameMap['option']>({
          tag: 'option',
          txt: String(idx + 1),
          selected: idx === 0,
        });
      }),
    );
    this.populateField();
    this.populateBottom();
    const flag = !this.pictureBtn.containsClass(style.toggle);
    this.backgroundInit();
    this.backgroundBottomInit(flag);
    this.translate();
    this.loadState();
    localStorage.setItem('last', JSON.stringify({ level: this.level, round: this.round }));
  }

  private selectRound(e: Event) {
    this.round = Number((e.currentTarget as HTMLSelectElement).value) - 1;
    this.populateField();
    this.populateBottom();
    this.backgroundInit();
    this.backgroundBottomInit();
    this.translate();
    localStorage.setItem('last', JSON.stringify({ level: this.level, round: this.round }));
  }

  private loadSavedHintState() {
    Object.entries({ tHint: this.translateBtn, sHint: this.soundBtn, pHint: this.pictureBtn }).forEach((el) => {
      if (!localStorage.getItem(el[0])) {
        el[1].getNode().click();
      }
    });
  }

  private logout() {
    localStorage.removeItem('name');
    localStorage.removeItem('surname');
    localStorage.removeItem('tHint');
    localStorage.removeItem('pHint');
    localStorage.removeItem('sHint');
    localStorage.removeItem('Levels');
    localStorage.removeItem('last');
    for (let i = 0; i < this.data.length; i += 1) {
      localStorage.removeItem(`Level${i}`);
    }
    window.history.pushState({ path: '' }, '', `${window.location.origin}${URLprefix}`);
  }

  private backgroundInit() {
    const str = `${sourceLink}/images/`;
    const path = this.data[this.level].rounds[this.round].levelData.imageSrc;
    let x = 0;
    let y = 0;
    this.mainfield.children[1].children.forEach((row, idx) => {
      row.children.forEach((el) => {
        const tmp = el;
        tmp.getNode().style.backgroundRepeat = 'no-repeat';
        tmp.getNode().style.backgroundImage = this.field - this.toggler < idx ? '' : `url(${str.concat(path)})`;
        tmp.getNode().style.backgroundSize = `${this.mainfield.children[1].getNode().offsetWidth}px ${this.mainfield.getNode().offsetHeight}px`;
        tmp.getNode().style.backgroundPositionX = `${x}px`;
        tmp.getNode().style.backgroundPositionY = `${y}px`;
        x -= tmp.getNode().offsetWidth - 15;
      });
      y -= this.mainfield.getNode().offsetHeight / 10;
      x = 0;
    });
  }

  private backgroundBottomInit(remove: boolean = false): void {
    const str = `${sourceLink}/images/`;
    const path = this.data[this.level].rounds[this.round].levelData.imageSrc;
    let x = 0;
    const y = -(this.field * this.mainfield.getNode().offsetHeight) / 10;
    this.bottomfield.children
      .sort((a, b) => Number(a.getNode().getAttribute('answer')) - Number(b.getNode().getAttribute('answer')))
      .forEach((el) => {
        const tmp = el;
        tmp.getNode().style.backgroundRepeat = 'no-repeat';
        tmp.getNode().style.backgroundImage = remove ? '' : `url(${str.concat(path)})`;
        tmp.getNode().style.backgroundSize = `${this.mainfield.children[1].getNode().offsetWidth}px ${this.mainfield.getNode().offsetHeight}px`;
        tmp.getNode().style.backgroundPositionX = `${x}px`;
        tmp.getNode().style.backgroundPositionY = `${y}px`;
        x -= tmp.getNode().offsetWidth - 15;
      });
  }

  private pictureClick(e: Event) {
    (e.currentTarget as HTMLElement).classList.toggle(style.toggle);
    const flag = !(e.currentTarget as HTMLElement).classList.contains(style.toggle);
    if (flag) this.toggler = 1;
    else this.toggler = 0;
    this.backgroundInit();
    this.backgroundBottomInit(flag);
    localStorage.setItem('pHint', flag ? '1' : '');
  }

  private soundClick(e: Event) {
    (e.currentTarget as HTMLElement).classList.toggle(style.toggle);
    const flag = (e.currentTarget as HTMLElement).classList.contains(style.toggle);
    if (flag) this.soundHint.addClass(style.active);
    else this.soundHint.removeClass(style.active);
    localStorage.setItem('sHint', !flag ? '1' : '');
  }

  private async playSound() {
    if (!this.soundHint.containsClass(style.on)) {
      this.soundHint.addClass(style.on);
      const str = `${sourceLink}/`;
      await new Promise((resolve) => {
        const audio = new Audio(str.concat(this.data[this.level].rounds[this.round].words[this.field].audioExample));
        audio.addEventListener('loadedmetadata', () => {
          audio.play();
          setTimeout(resolve, audio.duration * 1000);
        });
      });
      this.soundHint.removeClass(style.on);
    }
  }

  private translateClick(e: Event) {
    (e.currentTarget as HTMLElement).classList.toggle(style.toggle);
    this.translate();
    const flag = !(e.currentTarget as HTMLElement).classList.contains(style.toggle);
    localStorage.setItem('tHint', flag ? '1' : '');
  }

  private translate() {
    if (this.translateBtn.containsClass(style.toggle)) {
      this.translateHint.setTextContent(
        this.data[this.level].rounds[this.round].words[this.field].textExampleTranslate,
      );
    } else {
      this.translateHint.setTextContent('');
    }
  }

  private autocompleteClick() {
    this.mainfield.children[1].children[this.field].children.forEach((el, idx) => {
      const tmp = el;
      tmp.getNode().style.visibility = 'visible';
      tmp.getNode().style.order = `${idx + 1}`;
    });
    this.bottomfield.children.forEach((el) => {
      const tmp = el;
      tmp.getNode().style.visibility = 'hidden';
    });
    this.continueBtn.removeClass(style.completeHide);
    this.checkBtn.addClass(style.completeHide);
    this.soundHint.addClass(style.active);
    this.toggler = 0;
    this.backgroundInit();
    this.translateHint.setTextContent(this.data[this.level].rounds[this.round].words[this.field].textExampleTranslate);
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
    const row = this.mainfield.children[1].children[this.field].children;
    const flags = GamePage.checkLine(row.map((el) => el.getNode()));
    if (flags[0]) {
      if (flags[1]) {
        this.soundHint.addClass(style.active);
        this.toggler = 0;
        this.backgroundInit();
        this.translateHint.setTextContent(
          this.data[this.level].rounds[this.round].words[this.field].textExampleTranslate,
        );
        this.continueBtn.removeClass(style.completeHide);
        this.checkBtn.addClass(style.completeHide);
        row.forEach((el) => {
          (async () => {
            el.addClass(style.right);
            await new Promise((resolve) => {
              setTimeout(resolve, 2000);
            });
            el.removeClass(style.right);
          })();
        });
      } else {
        row.forEach((el) => {
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
    }
  }

  private continueClick() {
    if (this.field >= 9) {
      this.saveState(this.level, this.round);
      if (this.soundBtn.containsClass(style.toggle)) this.soundHint.removeClass(style.active);
      this.field = 0;
      this.round += 1;
      if (this.round >= Number(this.data[this.level].roundsCount)) {
        this.round = 0;
        if (this.level !== 5) this.level += 1;
        else this.level = 0;
      }
      (this.levelSelect.getNode() as HTMLSelectElement).value = String(this.level + 1);
      (this.roundSelect.getNode() as HTMLSelectElement).value = String(this.round + 1);
      this.populateField();
      this.populateBottom();
      const flag = !this.pictureBtn.containsClass(style.toggle);
      this.toggler = 1;
      this.backgroundInit();
      this.backgroundBottomInit(flag);
      this.loadState();
      localStorage.setItem('last', JSON.stringify({ level: this.level, round: this.round }));
    } else {
      this.mainfield.children[1].children[this.field].children.forEach((el) => {
        const tmp = el;
        tmp.getNode().onclick = () => {};
      });
      this.field += 1;
      this.populateBottom();
      const flag = !this.pictureBtn.containsClass(style.toggle);
      this.backgroundBottomInit(flag);
    }
    this.continueBtn.addClass(style.completeHide);
    if (!this.soundBtn.containsClass(style.toggle)) this.soundHint.removeClass(style.active);
    this.translate();
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
      this.checkBtn.removeClass(style.completeHide);
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
    this.translate();
    if (this.soundBtn.containsClass(style.toggle)) this.soundHint.addClass(style.active);
    else this.soundHint.removeClass(style.active);
    this.toggler = 1;
    this.backgroundInit();
  }

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
        if (res[i].containsClass(style.first) && i !== 0 && !res[i - 1].containsClass(style.last)) break;
        res[i].addClass(style.toleft);
      }
    }
    return res;
  }
}
