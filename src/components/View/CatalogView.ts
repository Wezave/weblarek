import { Component } from "../base/Component";

export class CatalogView extends Component<{ items: HTMLElement[] }> {
  constructor(container: HTMLElement) {
    super(container);
  }

  setItems(items: HTMLElement[]): void {
    this.container.innerHTML = "";
    items.forEach((item) => this.container.appendChild(item));
  }

  render(data?: { items: HTMLElement[] }): HTMLElement {
    if (data) this.setItems(data.items);
    return this.container;
  }
}
