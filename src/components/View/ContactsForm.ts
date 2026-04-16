import { Form } from "./Form";
import { EventEmitter } from "../base/Events";
import { IBuyerValidate } from "../../types";
import { ensureElement } from "../../utils/utils";

export class ContactsForm extends Form<{
  email?: string;
  phone?: string;
  errors?: IBuyerValidate;
}> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: EventEmitter) {
    super(container, events);
    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      container,
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      container,
    );

    this.emailInput.addEventListener("input", () =>
      this.events.emit("contacts:email-change", {
        email: this.emailInput.value,
      }),
    );
    this.phoneInput.addEventListener("input", () =>
      this.events.emit("contacts:phone-change", {
        phone: this.phoneInput.value,
      }),
    );
  }

  setEmail(email: string) {
    this.emailInput.value = email;
  }
  setPhone(phone: string) {
    this.phoneInput.value = phone;
  }

  setErrors(errors: IBuyerValidate) {
    const messages = [];
    if (errors.email) messages.push(errors.email);
    if (errors.phone) messages.push(errors.phone);
    this.showErrors(messages);
    this.setValid(messages.length === 0);
  }

  render(data?: {
    email?: string;
    phone?: string;
    errors?: IBuyerValidate;
  }): HTMLElement {
    if (data) {
      if (data.email !== undefined) this.setEmail(data.email);
      if (data.phone !== undefined) this.setPhone(data.phone);
      if (data.errors) this.setErrors(data.errors);
    }
    return this.container;
  }
}
