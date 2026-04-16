import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { IProduct } from '../../types';
import { CartItem } from './CartItem';

export class CartView extends Component<{ items: IProduct[]; total: number }> {
    protected list: HTMLElement;
    protected priceElement: HTMLElement;
    protected button: HTMLButtonElement;
    protected events: EventEmitter;
    protected itemTemplate: HTMLTemplateElement;

    constructor(template: HTMLTemplateElement, itemTemplate: HTMLTemplateElement, events: EventEmitter) {
        super(template.content.firstElementChild as HTMLElement);
        this.events = events;
        this.itemTemplate = itemTemplate;
        this.list = this.container.querySelector('.basket__list') as HTMLElement;
        this.priceElement = this.container.querySelector('.basket__price') as HTMLElement;
        this.button = this.container.querySelector('.basket__button') as HTMLButtonElement;

        if (this.button) {
            this.button.addEventListener('click', () => this.events.emit('order:start'));
        }
    }

    render(data?: { items: IProduct[]; total: number }): HTMLElement {
        if (!data) return this.container;
        this.list.innerHTML = '';
        const itemTemplate = this.itemTemplate.content.firstElementChild as HTMLElement;

        data.items.forEach((item, idx) => {
            const clone = itemTemplate.cloneNode(true) as HTMLElement;
            const cartItem = new CartItem(clone, this.events);
            cartItem.setData(item, idx + 1);
            this.list.appendChild(cartItem.render());
        });

        this.priceElement.textContent = `${data.total} синапсов`;
        this.button.disabled = data.items.length === 0;
        return this.container;
    }
}