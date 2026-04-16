import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";
import { IProduct } from "../../types";

export class CartItem extends Component<{ item: IProduct; index: number }> {
  protected indexElement: HTMLElement;
  protected title: HTMLElement;
  protected price: HTMLElement;
  protected deleteButton: HTMLButtonElement;
  protected events: EventEmitter;
  protected productId: string = "";

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;

    this.indexElement = this.container.querySelector(
      ".basket__item-index",
    ) as HTMLElement;
    this.title = this.container.querySelector(".card__title") as HTMLElement;
    this.price = this.container.querySelector(".card__price") as HTMLElement;
    this.deleteButton = this.container.querySelector(
      ".basket__item-delete",
    ) as HTMLButtonElement;

    this.deleteButton.addEventListener("click", () => {
      this.events.emit("cart:remove", { id: this.productId });
    });
  }

  private updateText(element: HTMLElement, value: string): void {
    if (element) element.textContent = value;
  }

  setData(data: IProduct, idx: number): void {
    this.productId = data.id;
    this.updateText(this.indexElement, idx.toString());
    this.updateText(this.title, data.title);
    this.updateText(
      this.price,
      data.price ? `${data.price} синапсов` : "Бесценно",
    );
  }

  render(data?: { item: IProduct; index: number }): HTMLElement {
    if (data) this.setData(data.item, data.index);
    return this.container;
  }
}
