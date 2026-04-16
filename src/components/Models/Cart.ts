import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class Cart {
  private items: IProduct[] = [];
  private events: EventEmitter;

  constructor(events: EventEmitter) {
    this.events = events;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    if (!this.isInCart(product.id)) {
      this.items.push(product);
      this.events.emit("cart:changed");
    }
  }

  removeItem(productId: string): void {
    const wasPresent = this.isInCart(productId);
    this.items = this.items.filter((item) => item.id !== productId);
    if (wasPresent) {
      this.events.emit("cart:changed");
    }
  }

  clear(): void {
    this.items = [];
    this.events.emit("cart:changed");
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  isInCart(productId: string): boolean {
    return this.items.some((item) => item.id === productId);
  }
}
