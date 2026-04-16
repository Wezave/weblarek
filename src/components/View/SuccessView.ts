import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export class SuccessView extends Component<{ total: number }> {
  private description: HTMLElement;
  private button: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    private events: EventEmitter,
  ) {
    super(container);
    this.description = ensureElement(".order-success__description", container);
    this.button = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      container,
    );
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
