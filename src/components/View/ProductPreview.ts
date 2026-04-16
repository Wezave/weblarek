import { Component } from "../base/Component";
import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { categoryMap, CDN_URL } from "../../utils/constants";

interface ProductPreviewActions {
  onToggle: (id: string) => void;
}

export class ProductPreview extends Component<IProduct> {
  private imageElement: HTMLImageElement;
  private categoryElement: HTMLElement;
  private titleElement: HTMLElement;
  private descriptionElement: HTMLElement;
  private priceElement: HTMLElement;
  private buttonElement: HTMLButtonElement;
  private actions: ProductPreviewActions;

  constructor(container: HTMLElement, actions: ProductPreviewActions) {
    super(container);
    this.actions = actions;
    this.imageElement = ensureElement(
      ".card__image",
      container,
    ) as HTMLImageElement;
    this.categoryElement = ensureElement(".card__category", container);
    this.titleElement = ensureElement(".card__title", container);
    this.descriptionElement = ensureElement(".card__text", container);
    this.priceElement = ensureElement(".card__price", container);
    this.buttonElement = ensureElement(
      ".card__button",
      container,
    ) as HTMLButtonElement;

    this.buttonElement.addEventListener("click", () => {
      const id = this.container.dataset.id;
      if (id) this.actions.onToggle(id);
    });
  }

  setButtonState(inCart: boolean): void {
    if (this.buttonElement.disabled) return;
    this.buttonElement.textContent = inCart ? "Удалить из корзины" : "Купить";
  }

  render(data?: IProduct): HTMLElement {
    if (data) {
      this.container.dataset.id = data.id;
      this.imageElement.src = CDN_URL + data.image;
      this.imageElement.alt = data.title;
      this.titleElement.textContent = data.title;
      this.descriptionElement.textContent = data.description;
      this.priceElement.textContent = data.price
        ? `${data.price} синапсов`
        : "Бесценно";

      const categoryClass =
        categoryMap[data.category as keyof typeof categoryMap] ||
        "card__category_other";
      this.categoryElement.className = `card__category ${categoryClass}`;
      this.categoryElement.textContent = data.category;

      if (data.price === null) {
        this.buttonElement.disabled = true;
        this.buttonElement.textContent = "Недоступно";
      } else {
        this.buttonElement.disabled = false;
        this.buttonElement.textContent = "Купить";
      }
    }
    return this.container;
  }
}
