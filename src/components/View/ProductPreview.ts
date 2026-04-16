import { Card } from "./Card";
import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";

interface ProductPreviewActions {
  onToggle: (id: string) => void;
}

export class ProductPreview extends Card {
  private descriptionElement: HTMLElement;
  private button: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    private actions: ProductPreviewActions,
  ) {
    super(container);
    this.descriptionElement = ensureElement(".card__text", container);
    this.button = ensureElement<HTMLButtonElement>(".card__button", container);
    this.button.addEventListener("click", () => {
      const id = this.container.dataset.id;
      if (id) this.actions.onToggle(id);
    });
  }

  setDescription(value: string) {
    this.descriptionElement.textContent = value;
  }

  setButtonText(text: string) {
    this.button.textContent = text;
  }

  setButtonEnabled(enabled: boolean) {
    this.button.disabled = !enabled;
  }

  render(data?: IProduct): HTMLElement {
    if (data) {
      this.container.dataset.id = data.id;
      this.setTitle(data.title);
      this.setPrice(data.price);
      this.setCardImage(data.image);
      this.setCategory(data.category);
      this.setDescription(data.description);
    }
    return this.container;
  }
}
