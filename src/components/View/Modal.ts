import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export class Modal extends Component<{}> {
  private content: HTMLElement;
  private closeButton: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.content = ensureElement(".modal__content", container);
    this.closeButton = ensureElement(".modal__close", container);
    this.closeButton.addEventListener("click", () => this.close());
    this.container.addEventListener("click", (e) => {
      if (e.target === this.container) this.close();
    });
  }

  open() {
    this.container.classList.add("modal_active");
  }

  close() {
    this.container.classList.remove("modal_active");
    this.content.innerHTML = "";
  }

  setContent(content: HTMLElement) {
    this.content.innerHTML = "";
    this.content.appendChild(content);
  }

  render(): HTMLElement {
    return this.container;
  }
}
