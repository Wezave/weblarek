import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export class CartView extends Component<{
  items: HTMLElement[];
  total: number;
}> {
  private list: HTMLElement;
  private priceElement: HTMLElement;
  private button: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);
    this.list = ensureElement(".basket__list", container);
    this.priceElement = ensureElement(".basket__price", container);
    this.button = ensureElement<HTMLButtonElement>(
      ".basket__button",
      container,
    );
    this.button.addEventListener("click", () => {});
  }

  setItems(items: HTMLElement[]) {
    this.list.innerHTML = "";
    items.forEach((item) => this.list.appendChild(item));
  }

  setTotal(total: number) {
    this.priceElement.textContent = `${total} синапсов`;
  }

  setButtonEnabled(enabled: boolean) {
    this.button.disabled = !enabled;
  }

  render(data?: { items: HTMLElement[]; total: number }): HTMLElement {
    if (data) {
      this.setItems(data.items);
      this.setTotal(data.total);
      this.setButtonEnabled(data.items.length > 0);
    }
    return this.container;
  }
}
