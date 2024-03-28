import { BaseComponent } from '../../components/base-component';
import Car from '../../components/car/car';
import { button, div, input, p } from '../../components/tags';
import { getColor, getName } from '../../utils/100-cars-data';
import type { TableRowType } from '../../utils/api';
import {
  createCar,
  createWinner,
  deleteCar,
  deleteWinner,
  engine,
  getCars,
  getWinner,
  updateCar,
  updateWinner,
} from '../../utils/api';
import go from '../../utils/routing';
import style from './styles.module.scss';

export default class Garage extends BaseComponent {
  constructor(
    private crTextInput = input(style.input, { type: 'text' }),
    private crColorInput = input(style.colorInput, { type: 'color' }),
    private crBtn = button(style.btn, 'Create'),
    private upTextInput = input(style.input, { type: 'text' }),
    private upColorInput = input(style.colorInput, { type: 'color' }),
    private upBtn = button(style.btn, 'update'),
    private raceBtn = button(style.btn, 'race'),
    private resetBtn = button(style.btn, 'reset'),
    private generateBtn = button(style.btn, 'generate cars'),
    private title = p(style.title, `Garage (???)`),
    private page = p(style.page, `Page #???`),
    private carList: Car[] = [],
    private list = div({ className: style.list }),
    private prevBtn = button(style.btn, 'prev'),
    private nextBtn = button(style.btn, 'next'),
    private pageCounter = 1,
    private pageLimit = -1,
    private selectedId = -1,
    private winner = p(style.winner, ''),
  ) {
    super({ className: style.garage });
    [this.raceBtn, this.resetBtn, this.prevBtn, this.nextBtn].forEach((el) => {
      el.addClass(style.green);
    });
    this.generateBtn.addClass(style.wide);
    this.crBtn.getNode().onclick = this.createClick.bind(this);
    this.upBtn.getNode().onclick = this.updateClick.bind(this);
    this.nextBtn.getNode().onclick = () => this.updateList(this.pageCounter + 1);
    this.prevBtn.getNode().onclick = () => this.updateList(this.pageCounter - 1);
    this.generateBtn.getNode().onclick = () => this.create100Click();
    this.raceBtn.getNode().onclick = () => this.startRace();
    this.resetBtn.getNode().onclick = () => this.resetRace();

    const crudContainer = div(
      { className: style.crudContainer },
      div({ className: style.row }, this.crTextInput, this.crColorInput, this.crBtn),
      div({ className: style.row }, this.upTextInput, this.upColorInput, this.upBtn),
      div({ className: style.row }, this.raceBtn, this.resetBtn, this.generateBtn),
    );
    const winnersPageBtn = button(style.btn, 'winners', () => go('winners'));
    const wrapper = div({ className: style.wrapper }, crudContainer, winnersPageBtn);
    const bottomBtns = div({ className: style.row }, this.prevBtn, this.nextBtn);

    this.appendChildren([wrapper, list, bottomBtns, winner]);
    this.updateList(this.pageCounter);
  }

  private anounce(message: string) {
    const el = this.winner.getNode();
    el.textContent = message;
    el.style.animation = 'none';
    el.focus();
    el.style.animation = '';
  }

  private async startRace() {
    await this.resetRace();
    Promise.any(
      new Array(this.carList.length).fill(1).map((_, idx) => {
        this.carList[idx].onButtons();
        return Garage.carDrive(this.carList[idx]);
      }),
    )
      .then((value) => {
        this.anounce(`${value.name} won! (${value.time.toFixed(2)}s)`);
        getWinner(value.id).then((response) => {
          if (response.ok)
            response
              .json()
              .then((car: TableRowType) =>
                updateWinner(
                  car.id,
                  Number(car.wins) + 1,
                  Number(car.time) < value.time ? car.time : value.time.toFixed(2),
                ),
              );
          else createWinner(value.id, 1, value.time.toFixed(2));
        });
      })
      .catch((err) => {
        if (!(err as AggregateError).errors.filter((el) => el.name === 'AbortError').length)
          this.anounce(`Everyone lost`);
      });
  }

  private async resetRace() {
    new Array(this.carList.length).fill(1).map((_, idx) => {
      this.carList[idx].offButtons();
      return Garage.carStop(this.carList[idx]);
    });
  }

  private async updateList(page: number) {
    this.selectedId = -1;
    this.carList = [];
    this.pageCounter = page < 1 ? this.pageLimit : page;
    this.pageCounter = page > this.pageLimit ? 1 : this.pageCounter;
    const { arr, total } = await getCars(this.pageCounter, 7);
    this.pageLimit = Math.ceil(total / 7);
    this.title.getNode().textContent = `Garage (${total})`;
    this.page.getNode().textContent = `Page #${this.pageCounter}`;

    for (let i = 0; i < arr.length; i += 1) {
      this.carList.push(new Car(Number(arr[i].id), arr[i].name, arr[i].color));
      this.carList[i].getNode().addEventListener('selectClick', ((e: CustomEvent<number>) => {
        this.selectedId = e.detail;
      }) as EventListener);
      this.carList[i].getNode().addEventListener('removeClick', ((e: CustomEvent<number>) => {
        deleteCar(e.detail);
        deleteWinner(e.detail);
        // TODO: remove from winners list
        this.updateList(this.pageCounter);
      }) as EventListener);
      this.carList[i].getNode().addEventListener('AClick', ((e: CustomEvent<Car>) => {
        Garage.carDrive(e.detail);
      }) as EventListener);
      this.carList[i].getNode().addEventListener('BClick', ((e: CustomEvent<Car>) => {
        Garage.carStop(e.detail);
      }) as EventListener);
    }
    this.list.destroyChildren();
    this.list.appendChildren([this.title, this.page, ...this.carList]);
  }

  private static async carDrive(car: Car) {
    const { id } = car;
    const controller = new AbortController();
    car.setSignal(controller);
    let time = 0;
    // TODO: start smoke animation
    return engine(id, 'started', controller.signal)
      .then((response) => response.json())
      .then((data) => {
        time = data.distance / data.velocity / 1000;
        car.animationDuration(time);
        car.on();
        return engine(id, 'drive', controller.signal);
      })
      .then((response) => {
        if (!response.ok) {
          car.pause();
          // TODO: fire animation
          return Promise.reject(new Error('car broken'));
        }
        return Promise.resolve({ name: car.name, time, id });
      });
  }

  private static async carStop(car: Car) {
    car.off();
    car.getSignal().abort();
    return engine(car.id, 'stopped');
  }

  private async updateClick() {
    const el = this.upTextInput;
    if (Garage.checkInput(el) && this.selectedId > 0) {
      await updateCar(this.selectedId, el.getNode().value, this.upColorInput.getNode().value);
      this.updateList(this.pageCounter);
    }
  }

  private async createClick() {
    const el = this.crTextInput;
    if (Garage.checkInput(el)) {
      await createCar(el.getNode().value, this.crColorInput.getNode().value);
      this.updateList(this.pageCounter);
    }
  }

  private async create100Click() {
    await Promise.all(new Array(100).fill(1).map(() => createCar(getName(), getColor())));
    this.updateList(this.pageCounter);
  }

  private static checkInput(elem: BaseComponent<HTMLInputElement>) {
    if (elem.getNode().value === '') {
      (async () => {
        elem.addClass(style.red);
        await new Promise((resolve) => {
          setTimeout(resolve, 2000);
        });
        elem.removeClass(style.red);
      })();
      return false;
    }
    return true;
  }
}
