import { Form } from "./Form";
import { EventEmitter } from "../base/Events";
import { TPayment, IBuyerValidate } from "../../types";
import { ensureElement } from "../../utils/utils";

export class OrderForm extends Form<{
  payment?: TPayment;
  address?: string;
  errors?: IBuyerValidate;
}> {
  private cardButton: HTMLButtonElement;
  private cashButton: HTMLButtonElement;
  private addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: EventEmitter) {
    super(container, events);
    this.cardButton = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      container,
    );
    this.cashButton = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      container,
    );
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      container,
    );

    this.cardButton.addEventListener("click", () =>
      this.events.emit("order:payment-select", { payment: "card" }),
    );
    this.cashButton.addEventListener("click", () =>
      this.events.emit("order:payment-select", { payment: "cash" }),
    );
    this.addressInput.addEventListener("input", () =>
      this.events.emit("order:address-change", {
        address: this.addressInput.value,
      }),
    );
  }

  setPayment(payment: TPayment) {
    this.cardButton.classList.toggle("button_alt-active", payment === "card");
    this.cashButton.classList.toggle("button_alt-active", payment === "cash");
  }

  setAddress(address: string) {
    this.addressInput.value = address;
  }

  setErrors(errors: IBuyerValidate) {
    const messages = [];
    if (errors.payment) messages.push(errors.payment);
    if (errors.address) messages.push(errors.address);
    this.showErrors(messages);
    this.setValid(messages.length === 0);
  }

  render(data?: {
    payment?: TPayment;
    address?: string;
    errors?: IBuyerValidate;
  }): HTMLElement {
    if (data) {
      if (data.payment) this.setPayment(data.payment);
      if (data.address !== undefined) this.setAddress(data.address);
      if (data.errors) this.setErrors(data.errors);
    }
    return this.container;
  }
}
