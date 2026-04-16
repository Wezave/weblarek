import { Component } from "../base/Component";
import { CDN_URL, categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";

export abstract class Card<T> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.titleElement = ensureElement(".card__title", container);
    this.priceElement = ensureElement(".card__price", container);
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      container,
    );
    this.categoryElement = ensureElement(".card__category", container);
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
}
