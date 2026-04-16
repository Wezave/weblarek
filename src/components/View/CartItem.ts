import { Component } from "../base/Component";
import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";

interface CartItemActions {
  onRemove: (id: string) => void;
}

export class CartItem extends Component<{ item: IProduct; index: number }> {
  private indexElement: HTMLElement;
  private titleElement: HTMLElement;
  private priceElement: HTMLElement;
  private deleteButton: HTMLButtonElement;
  private actions: CartItemActions;

  constructor(container: HTMLElement, actions: CartItemActions) {
    super(container);
    this.actions = actions;
    this.indexElement = ensureElement(".basket__item-index", container);
    this.titleElement = ensureElement(".card__title", container);
    this.priceElement = ensureElement(".card__price", container);
    this.deleteButton = ensureElement(
      ".basket__item-delete",
      container,
    ) as HTMLButtonElement;

    this.deleteButton.addEventListener("click", () => {
      const id = this.container.dataset.id;
      if (id) this.actions.onRemove(id);
    });
  }

  render(data?: { item: IProduct; index: number }): HTMLElement {
    if (data) {
      this.container.dataset.id = data.item.id;
      this.indexElement.textContent = String(data.index);
      this.titleElement.textContent = data.item.title;
      this.priceElement.textContent = data.item.price
        ? `${data.item.price} синапсов`
        : "Бесценно";
    }
    return this.container;
  }
}
