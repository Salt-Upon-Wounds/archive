export type Props<T extends HTMLElement = HTMLElement> = Partial<
  Omit<T, 'style' | 'dataset' | 'classList' | 'children' | 'tagName'>
> & {
  txt?: string;
  tag?: keyof HTMLElementTagNameMap;
};

export type ElementFnProps<T extends HTMLElement = HTMLElement> = Omit<Props<T>, 'tag'>;

export class BaseComponent<T extends HTMLElement = HTMLElement> {
  protected node: T;

  protected children: BaseComponent[] = [];

  constructor(props: Props<T>, ...children: (BaseComponent | HTMLElement | null)[]) {
    this.node = document.createElement(props.tag ?? 'div') as T;
    this.node.textContent = props.txt ?? null;
    if (children) {
      this.appendChildren(children.filter((el): el is BaseComponent | HTMLElement => el !== null));
    }
  }

  public append(child: BaseComponent | HTMLElement): void {
    if (child instanceof BaseComponent) {
      this.children.push(child);
      this.node.append(child.getNode());
    } else {
      this.node.append(child);
    }
  }

  public appendChildren(children: (BaseComponent | HTMLElement | null)[]): void {
    children
      .filter((el): el is BaseComponent | HTMLElement => el !== null)
      .forEach((el) => {
        this.append(el);
      });
  }

  public setTextContent(text: string): void {
    this.node.textContent = text;
  }

  public getNode() {
    return this.node;
  }

  public addClass(className: string): void {
    this.node.classList.add(className);
  }

  public toggleClass(className: string): void {
    this.node.classList.toggle(className);
  }

  public removeClass(className: string): void {
    this.node.classList.remove(className);
  }

  public destroy(): void {
    this.children.reduce((_, child) => {
      child.destroy();
      return null;
    }, null);
    this.children = [];
    this.node.remove();
  }
}
