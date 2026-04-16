import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";
import { TPayment, IBuyerValidate } from "../../types";

export class OrderForm extends Component<{
  payment?: TPayment;
  address?: string;
  errors?: IBuyerValidate;
}> {
  private cardButton: HTMLButtonElement;
  private cashButton: HTMLButtonElement;
  private addressInput: HTMLInputElement;
  private submitButton: HTMLButtonElement;
  private errorsSpan: HTMLElement;
  private events: EventEmitter;

  constructor(container: HTMLFormElement, events: EventEmitter) {
    super(container);
    this.events = events;
    this.cardButton = this.container.querySelector(
      'button[name="card"]',
    ) as HTMLButtonElement;
    this.cashButton = this.container.querySelector(
      'button[name="cash"]',
    ) as HTMLButtonElement;
    this.addressInput = this.container.querySelector(
      'input[name="address"]',
    ) as HTMLInputElement;
    this.submitButton = this.container.querySelector(
      ".order__button",
    ) as HTMLButtonElement;
    this.errorsSpan = this.container.querySelector(
      ".form__errors",
    ) as HTMLElement;

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
    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      this.events.emit("order:submit");
    });
  }

  setPayment(payment: TPayment) {
    this.cardButton.classList.toggle("button_alt-active", payment === "card");
    this.cashButton.classList.toggle("button_alt-active", payment === "cash");
  }

  setAddress(address: string) {
    this.addressInput.value = address;
  }

  setValid(isValid: boolean) {
    this.submitButton.disabled = !isValid;
  }

  showErrors(errors: string[]) {
    this.errorsSpan.textContent = errors.join(", ");
  }

  setErrors(errors: IBuyerValidate) {
    const messages = [];
    if (errors.payment) messages.push(errors.payment);
    if (errors.address) messages.push(errors.address);
    this.showErrors(messages);
    this.setValid(messages.length === 0);
  }

  clear() {
    this.addressInput.value = "";
    this.cardButton.classList.remove("button_alt-active");
    this.cashButton.classList.remove("button_alt-active");
    this.setValid(false);
    this.showErrors([]);
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
