import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';

export class CatalogItem extends Component<IProduct> {
    protected category: HTMLElement | null;
    protected title: HTMLElement | null;
    protected image: HTMLImageElement | null;
    protected price: HTMLElement | null;
    protected events: EventEmitter;
    protected productId: string = '';

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        
        if (!this.container) {
            throw new Error('CatalogItem: container is null');
        }
        
        this.category = this.container.querySelector('.card__category');
        this.title = this.container.querySelector('.card__title');
        this.image = this.container.querySelector('.card__image');
        this.price = this.container.querySelector('.card__price');

        this.container.addEventListener('click', () => {
            this.events.emit('catalog:item-selected', { id: this.productId });
        });
    }

    private updateText(element: HTMLElement | null, value: string): void {
        if (element) {
            element.textContent = value;
        }
    }

    private updateImage(element: HTMLImageElement | null, src: string, alt: string): void {
        if (element) {
            element.src = src;
            element.alt = alt;
        }
    }

    setData(data: IProduct): void {
        this.productId = data.id;
        this.updateText(this.title, data.title);
        this.updateImage(this.image, data.image, data.title);
        this.updateText(this.price, data.price ? `${data.price} синапсов` : 'Бесценно');
        
        const categoryClass = categoryMap[data.category as keyof typeof categoryMap] || 'card__category_other';
        if (this.category) {
            this.category.className = `card__category ${categoryClass}`;
            this.updateText(this.category, data.category);
        }
    }

    render(data?: IProduct): HTMLElement {
        if (data) {
            this.setData(data);
        }
        return this.container;
    }
}