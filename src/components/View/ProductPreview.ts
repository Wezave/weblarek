import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';

export class ProductPreview extends Component<IProduct> {
    protected image: HTMLImageElement | null;
    protected category: HTMLElement | null;
    protected title: HTMLElement | null;
    protected description: HTMLElement | null;
    protected price: HTMLElement | null;
    protected button: HTMLButtonElement | null;
    protected events: EventEmitter;
    protected productId: string = '';

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        
        this.image = this.container.querySelector('.card__image');
        this.category = this.container.querySelector('.card__category');
        this.title = this.container.querySelector('.card__title');
        this.description = this.container.querySelector('.card__text');
        this.price = this.container.querySelector('.card__price');
        this.button = this.container.querySelector('.card__button');

        if (this.button) {
            this.button.addEventListener('click', () => {
                this.events.emit('cart:add', { id: this.productId });
            });
        }
    }

    private updateText(element: HTMLElement | null, value: string): void {
        if (element) element.textContent = value;
    }

    private updateImage(element: HTMLImageElement | null, src: string, alt: string): void {
        if (element) {
            element.src = src;
            element.alt = alt;
        }
    }

    setData(data: IProduct): void {
        this.productId = data.id;
        this.updateImage(this.image, data.image, data.title);
        this.updateText(this.title, data.title);
        this.updateText(this.description, data.description);
        this.updateText(this.price, data.price ? `${data.price} синапсов` : 'Бесценно');
        
        const categoryClass = categoryMap[data.category as keyof typeof categoryMap] || 'card__category_other';
        if (this.category) {
            this.category.className = `card__category ${categoryClass}`;
            this.updateText(this.category, data.category);
        }

        if (this.button) {
            if (data.price === null) {
                this.button.disabled = true;
                this.button.textContent = 'Недоступно';
            } else {
                this.button.disabled = false;
                this.button.textContent = 'В корзину';
            }
        }
    }

    setButtonState(inBasket: boolean): void {
        if (this.button) {
            if (inBasket && !this.button.disabled) {
                this.button.disabled = true;
                this.button.textContent = 'Уже в корзине';
            } else if (!inBasket && this.button.disabled && this.button.textContent === 'Уже в корзине') {
                this.button.disabled = false;
                this.button.textContent = 'В корзину';
            }
        }
    }

    render(data?: IProduct): HTMLElement {
        if (data) {
            this.setData(data);
        }
        return this.container;
    }
}