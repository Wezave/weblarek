import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export abstract class Form<T> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsSpan: HTMLElement;

  constructor(
    protected container: HTMLFormElement,
    protected events: EventEmitter,
  ) {
    super(container);
    this.submitButton = ensureElement<HTMLButtonElement>(
      '.button[type="submit"]',
      container,
    );
    this.errorsSpan = ensureElement(".form__errors", container);
    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      this.events.emit(`${this.constructor.name.toLowerCase()}:submit`);
    });
  }

  setValid(isValid: boolean) {
    this.submitButton.disabled = !isValid;
  }

  showErrors(errors: string[]) {
    this.errorsSpan.textContent = errors.join(", ");
  }
}
