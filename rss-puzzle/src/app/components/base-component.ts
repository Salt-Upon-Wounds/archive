export type Props<T extends HTMLElement = HTMLElement> = Partial<
  Omit<T, 'style' | 'dataset' | 'classList' | 'children' | 'tagName'>
> & {
  txt?: string;
  tag?: keyof HTMLElementTagNameMap;
};

export type ElementFnProps<T extends HTMLElement = HTMLElement> = Omit<Props<T>, 'tag'>;

export class BaseComponent<T extends HTMLElement = HTMLElement> {
  protected node: T;

  public children: BaseComponent[] = [];

  protected parent: BaseComponent | null = null;

  constructor(props: Props<T>, ...children: (BaseComponent | HTMLElement | null)[]) {
    this.node = document.createElement(props.tag ?? 'div') as T;
    if (props.txt) this.node.textContent = props.txt;
    Object.assign(this.node, props);
    if (children) {
      this.appendChildren(children.filter((el): el is BaseComponent | HTMLElement => el !== null));
    }
  }

  public append(child: BaseComponent | HTMLElement) {
    if (child instanceof BaseComponent) {
      this.children.push(child);
      this.children[this.children.length - 1].parent = this;
      this.node.append(child.getNode());
    } else {
      this.node.append(child);
    }
  }

  public appendChildren(children: (BaseComponent | HTMLElement | null)[]) {
    children
      .filter((el): el is BaseComponent | HTMLElement => el !== null)
      .forEach((el) => {
        this.append(el);
      });
  }

  public setTextContent(text: string) {
    this.node.textContent = text;
  }

  public getNode() {
    return this.node;
  }

  public addClass(className: string) {
    this.node.classList.add(className);
  }

  public toggleClass(className: string) {
    this.node.classList.toggle(className);
  }

  public removeClass(className: string) {
    this.node.classList.remove(className);
  }

  public containsClass(className: string) {
    return this.node.classList.contains(className);
  }

  public destroyChildren() {
    this.children.forEach((child) => {
      child.destroy();
    });
    this.children = [];
  }

  public destroy() {
    this.destroyChildren();
    this.node.remove();
  }

  public switchPage(page: BaseComponent) {
    this.destroyChildren();
    this.append(page);
  }
}
