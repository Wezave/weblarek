import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export class Header extends Component<{ count: number }> {
  private counter: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.counter = ensureElement(".header__basket-counter", container);
  }

  setCount(count: number) {
    this.counter.textContent = String(count);
  }

  render(data?: { count: number }): HTMLElement {
    if (data) this.setCount(data.count);
    return this.container;
  }
}
