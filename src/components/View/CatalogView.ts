import { Component } from "../base/Component";

export class CatalogView extends Component<{ items: HTMLElement[] }> {
  constructor(protected container: HTMLElement) {
    super(container);
  }

  setItems(items: HTMLElement[]) {
    this.container.innerHTML = "";
    items.forEach((item) => this.container.appendChild(item));
  }

  render(data?: { items: HTMLElement[] }): HTMLElement {
    if (data) this.setItems(data.items);
    return this.container;
  }
}
