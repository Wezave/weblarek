import { Component } from "../base/Component";
import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { categoryMap, CDN_URL } from "../../utils/constants";

interface CatalogItemActions {
  onClick: (id: string) => void;
}

export class CatalogItem extends Component<IProduct> {
  private categoryElement: HTMLElement;
  private titleElement: HTMLElement;
  private imageElement: HTMLImageElement;
  private priceElement: HTMLElement;
  private actions: CatalogItemActions;

  constructor(container: HTMLElement, actions: CatalogItemActions) {
    super(container);
    this.actions = actions;
    this.categoryElement = ensureElement(".card__category", container);
    this.titleElement = ensureElement(".card__title", container);
    this.imageElement = ensureElement(
      ".card__image",
      container,
    ) as HTMLImageElement;
    this.priceElement = ensureElement(".card__price", container);

    this.container.addEventListener("click", () => {
      const id = this.container.dataset.id;
      if (id) this.actions.onClick(id);
    });
  }

  render(data?: IProduct): HTMLElement {
    if (data) {
      this.container.dataset.id = data.id;
      this.titleElement.textContent = data.title;
      this.imageElement.src = CDN_URL + data.image;
      this.imageElement.alt = data.title;
      this.priceElement.textContent = data.price
        ? `${data.price} синапсов`
        : "Бесценно";

      const categoryClass =
        categoryMap[data.category as keyof typeof categoryMap] ||
        "card__category_other";
      this.categoryElement.className = `card__category ${categoryClass}`;
      this.categoryElement.textContent = data.category;
    }
    return this.container;
  }
}
