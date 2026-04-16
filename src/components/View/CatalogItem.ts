import { Card } from "./Card";
import { IProduct } from "../../types";

interface CatalogItemActions {
  onClick: (id: string) => void;
}

export class CatalogItem extends Card {
  constructor(
    container: HTMLElement,
    private actions: CatalogItemActions,
  ) {
    super(container);
    this.container.addEventListener("click", () => {
      const id = this.container.dataset.id;
      if (id) this.actions.onClick(id);
    });
  }

  render(data?: IProduct): HTMLElement {
    if (data) {
      this.container.dataset.id = data.id;
      this.setTitle(data.title);
      this.setPrice(data.price);
      this.setCardImage(data.image);
      this.setCategory(data.category);
    }
    return this.container;
  }
}
