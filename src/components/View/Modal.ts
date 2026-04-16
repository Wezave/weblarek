import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export class Modal extends Component<{}> {
  private content: HTMLElement;
  private closeButton: HTMLElement;
  private events: EventEmitter;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;
    this.content = ensureElement(".modal__content", container);
    this.closeButton = ensureElement(".modal__close", container);
    this.closeButton.addEventListener("click", () => this.close());
    this.container.addEventListener("click", (e) => {
      if (e.target === this.container) this.close();
    });
  }

  open(): void {
    this.container.classList.add("modal_active");
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this.content.innerHTML = "";
  }

  setContent(content: HTMLElement): void {
    this.content.innerHTML = "";
    this.content.appendChild(content);
  }

  render(): HTMLElement {
    return this.container;
  }
}
