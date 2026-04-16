import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

export class SuccessView extends Component<{ total: number }> {
  private description: HTMLElement;
  private button: HTMLButtonElement;
  private events: EventEmitter;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;
    this.description = this.container.querySelector(
      ".order-success__description",
    ) as HTMLElement;
    this.button = this.container.querySelector(
      ".order-success__close",
    ) as HTMLButtonElement;
    this.button.addEventListener("click", () =>
      this.events.emit("success:close"),
    );
  }

  setTotal(total: number) {
    this.description.textContent = `Списано ${total} синапсов`;
  }

  render(data?: { total: number }): HTMLElement {
    if (data) this.setTotal(data.total);
    return this.container;
  }
}
