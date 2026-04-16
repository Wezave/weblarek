import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class Catalog {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;
  private events: EventEmitter;

  constructor(events: EventEmitter) {
    this.events = events;
  }

  setProducts(products: IProduct[]): void {
    this.products = products;
    this.events.emit("catalog:changed");
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find((p) => p.id === id);
  }

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit("catalog:selected-changed");
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
