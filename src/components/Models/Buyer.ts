// src/components/Models/Buyer.ts
import { IBuyer, IBuyerValidate, TPayment } from "../../types";
import { EventEmitter } from "../base/Events";

export class Buyer {
  private payment: TPayment | null = null;
  private email: string = "";
  private phone: string = "";
  private address: string = "";
  private events: EventEmitter;

  constructor(events: EventEmitter) {
    this.events = events;
  }

  setData(data: Partial<IBuyer>): void {
    let changed = false;

    if (data.payment !== undefined && this.payment !== data.payment) {
      this.payment = data.payment;
      changed = true;
    }
    if (data.email !== undefined && this.email !== data.email) {
      this.email = data.email;
      changed = true;
    }
    if (data.phone !== undefined && this.phone !== data.phone) {
      this.phone = data.phone;
      changed = true;
    }
    if (data.address !== undefined && this.address !== data.address) {
      this.address = data.address;
      changed = true;
    }

    if (changed) {
      this.events.emit("buyer:changed", this.getData());
      this.events.emit("buyer:validation-changed", this.validate());
    }
  }

  getData(): IBuyer {
    return {
      payment: this.payment as TPayment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clear(): void {
    this.payment = null;
    this.email = "";
    this.phone = "";
    this.address = "";
    this.events.emit("buyer:changed", this.getData());
    this.events.emit("buyer:validation-changed", this.validate());
  }

  validate(): IBuyerValidate {
    const errors: IBuyerValidate = {};

    if (!this.payment) {
      errors.payment = "Выберите способ оплаты";
    }
    if (!this.email.trim()) {
      errors.email = "Укажите email";
    }
    if (!this.phone.trim()) {
      errors.phone = "Укажите телефон";
    }
    if (!this.address.trim()) {
      errors.address = "Укажите адрес";
    }

    return errors;
  }
}
