import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

export class CartView extends Component<{
  items: HTMLElement[];
  total: number;
}> {
  private list: HTMLElement;
  private priceElement: HTMLElement;
  private button: HTMLButtonElement;
  private events: EventEmitter;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;
    this.list = this.container.querySelector(".basket__list") as HTMLElement;
    this.priceElement = this.container.querySelector(
      ".basket__price",
    ) as HTMLElement;
    this.button = this.container.querySelector(
      ".basket__button",
    ) as HTMLButtonElement;

    if (this.button) {
      this.button.addEventListener("click", () =>
        this.events.emit("order:start"),
      );
    }
  }

  setItems(items: HTMLElement[]): void {
    this.list.innerHTML = "";
    items.forEach((item) => this.list.appendChild(item));
    this.button.disabled = items.length === 0;
  }

  setTotal(total: number): void {
    this.priceElement.textContent = `${total} синапсов`;
  }

  render(data?: { items: HTMLElement[]; total: number }): HTMLElement {
    if (data) {
      this.setItems(data.items);
      this.setTotal(data.total);
    }
    return this.container;
  }
}
