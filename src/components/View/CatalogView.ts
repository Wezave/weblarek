import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";
import { IProduct } from "../../types";
import { CatalogItem } from "./CatalogItem";

export class CatalogView extends Component<{ items: IProduct[] }> {
  protected container: HTMLElement;
  protected events: EventEmitter;
  protected itemsMap: Map<string, CatalogItem> = new Map();
  protected cardTemplate: HTMLTemplateElement;

  constructor(
    container: HTMLElement,
    cardTemplate: HTMLTemplateElement,
    events: EventEmitter,
  ) {
    super(container);
    this.container = container;
    this.cardTemplate = cardTemplate;
    this.events = events;
  }

  render(data?: Partial<{ items: IProduct[] }>): HTMLElement {
    if (!data || !data.items) {
      return this.container;
    }

    this.container.innerHTML = "";
    this.itemsMap.clear();

    if (!this.cardTemplate) {
      return this.container;
    }

    const templateElement = this.cardTemplate.content.firstElementChild;
    if (!templateElement || !(templateElement instanceof HTMLElement)) {
      return this.container;
    }

    data.items.forEach((item) => {
      const cardElement = templateElement.cloneNode(true) as HTMLElement;
      const card = new CatalogItem(cardElement, this.events);
      card.render(item);
      this.container.appendChild(card.render());
      this.itemsMap.set(item.id, card);
    });

    return this.container;
  }

  clear(): void {
    this.container.innerHTML = "";
    this.itemsMap.clear();
  }
}
