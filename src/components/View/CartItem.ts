import { Component } from "../base/Component";
import { IProduct } from "../../types";
import { categoryMap, CDN_URL } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";

interface CartItemActions {
  onRemove: (id: string) => void;
}

export class CartItem extends Component<{ item: IProduct; index: number }> {
  private titleElement: HTMLElement;
  private priceElement: HTMLElement;
  private imageElement: HTMLImageElement;
  private categoryElement: HTMLElement;
  private indexElement: HTMLElement;
  private deleteButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    private actions: CartItemActions,
  ) {
    super(container);
    this.titleElement = ensureElement(".card__title", container);
    this.priceElement = ensureElement(".card__price", container);
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      container,
    );
    this.categoryElement = ensureElement(".card__category", container);
    this.indexElement = ensureElement(".basket__item-index", container);
    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container,
    );
    this.deleteButton.addEventListener("click", () => {
      const id = this.container.dataset.id;
      if (id) this.actions.onRemove(id);
    });
  }

  setTitle(value: string) {
    this.titleElement.textContent = value;
  }
  setPrice(value: number | null) {
    this.priceElement.textContent = value ? `${value} синапсов` : "Бесценно";
  }
  setCardImage(value: string) {
    const imageUrl = value.startsWith("http") ? value : CDN_URL + value;
    this.imageElement.src = imageUrl;
    this.imageElement.alt = this.titleElement.textContent;
  }
  setCategory(value: string) {
    const className =
      categoryMap[value as keyof typeof categoryMap] || "card__category_other";
    this.categoryElement.className = `card__category ${className}`;
    this.categoryElement.textContent = value;
  }
  setIndex(value: number) {
    this.indexElement.textContent = String(value);
  }

  render(data?: { item: IProduct; index: number }): HTMLElement {
    if (data) {
      this.container.dataset.id = data.item.id;
      this.setTitle(data.item.title);
      this.setPrice(data.item.price);
      this.setCardImage(data.item.image);
      this.setCategory(data.item.category);
      this.setIndex(data.index);
    }
    return this.container;
  }
}
