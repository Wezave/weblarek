import { IProduct } from '../../types';

export class Cart {
    private items: IProduct[] = [];

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(product: IProduct): void {
        if (!this.isInCart(product.id)) {
            this.items.push(product);
        }
    }

    removeItem(productId: string): void {
        this.items = this.items.filter(item => item.id !== productId);
    }

    clear(): void {
        this.items = [];
    }

    getTotal(): number {
        return this.items.reduce((sum, item) => {
            return sum + (item.price ?? 0);
        }, 0);
    }

    getCount(): number {
        return this.items.length;
    }

    isInCart(productId: string): boolean {
        return this.items.some(item => item.id === productId);
    }
}