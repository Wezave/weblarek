import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { IProduct } from '../../types';
import { CatalogItem } from './CatalogItem';

export class CatalogView extends Component<{ items: IProduct[] }> {
    protected container: HTMLElement;
    protected cardTemplate: HTMLTemplateElement;
    protected events: EventEmitter;

    constructor(container: HTMLElement, cardTemplate: HTMLTemplateElement, events: EventEmitter) {
        super(container);
        this.container = container;
        this.cardTemplate = cardTemplate;
        this.events = events;
    }

    render(data?: { items: IProduct[] }): HTMLElement {
        if (!data || !data.items) return this.container;
        this.container.innerHTML = '';
        const template = this.cardTemplate.content.firstElementChild as HTMLElement;
        if (!template) return this.container;

        data.items.forEach(item => {
            const cardElement = template.cloneNode(true) as HTMLElement;
            const card = new CatalogItem(cardElement, this.events);
            card.setData(item);
            this.container.appendChild(card.render());
        });
        return this.container;
    }
}