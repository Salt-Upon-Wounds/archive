import { BaseComponent, type ElementFnProps } from './base-component';

export const input = (className: string, props: ElementFnProps & Partial<HTMLInputElement>) =>
  new BaseComponent<HTMLInputElement>({ ...props, className, tag: 'input' });

export const h1 = (className: string, txt: string): BaseComponent<HTMLElementTagNameMap['h1']> =>
  new BaseComponent({ tag: 'h1', className, txt });

export const h2 = (className: string, txt: string): BaseComponent<HTMLElementTagNameMap['h2']> =>
  new BaseComponent({ tag: 'h2', className, txt });

export const p = (className: string, txt: string): BaseComponent<HTMLElementTagNameMap['p']> =>
  new BaseComponent({ tag: 'p', className, txt });

export const button = (className: string, txt: string, onClick?: () => void) =>
  new BaseComponent({
    tag: 'button',
    className,
    txt,
    onclick: (e: Event) => {
      e.preventDefault();
      onClick?.();
    },
  });

export const div = (props: ElementFnProps<HTMLDivElement>, ...children: (BaseComponent | HTMLElement | null)[]) =>
  new BaseComponent<HTMLDivElement>(props, ...children);
