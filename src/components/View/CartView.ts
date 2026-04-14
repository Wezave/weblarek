import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";
import { IProduct } from "../../types";
import { CartItem } from "./CartItem";

export class CartView extends Component<{ items: IProduct[]; total: number }> {
  protected list: HTMLElement | null;
  protected priceElement: HTMLElement | null;
  protected button: HTMLButtonElement | null;
  protected events: EventEmitter;
  protected itemTemplate: HTMLTemplateElement;
  protected itemsMap: Map<string, CartItem> = new Map();

  constructor(
    template: HTMLTemplateElement,
    itemTemplate: HTMLTemplateElement,
    events: EventEmitter,
  ) {
    const container = template.content.firstElementChild as HTMLElement;
    if (!container) throw new Error("CartView: template has no content");
    super(container);
    this.events = events;
    this.itemTemplate = itemTemplate;

    this.list = this.container.querySelector(".basket__list");
    this.priceElement = this.container.querySelector(".basket__price");
    this.button = this.container.querySelector(".basket__button");

    if (this.button) {
      this.button.addEventListener("click", () => {
        this.events.emit("order:start");
      });
    }
  }

  private updateText(element: HTMLElement | null, value: string): void {
    if (element) element.textContent = value;
  }

  render(data?: Partial<{ items: IProduct[]; total: number }>): HTMLElement {
    if (!data || !data.items || data.total === undefined) {
      return this.container;
    }

    if (this.list) this.list.innerHTML = "";
    this.itemsMap.clear();

    const itemTemplateElement = this.itemTemplate.content.firstElementChild;
    if (!itemTemplateElement || !(itemTemplateElement instanceof HTMLElement)) {
      return this.container;
    }

    data.items.forEach((item, index) => {
      const clone = itemTemplateElement.cloneNode(true) as HTMLElement;
      const cartItem = new CartItem(clone, this.events);
      cartItem.render({ item, index: index + 1 });
      if (this.list) this.list.appendChild(cartItem.render());
      this.itemsMap.set(item.id, cartItem);
    });

    if (this.priceElement) {
      this.updateText(this.priceElement, `${data.total} синапсов`);
    }

    if (this.button) {
      this.button.disabled = data.items.length === 0;
    }

    return this.container;
  }

  clear(): void {
    if (this.list) this.list.innerHTML = "";
    this.itemsMap.clear();
    if (this.priceElement) this.updateText(this.priceElement, "0 синапсов");
    if (this.button) this.button.disabled = true;
  }
}
