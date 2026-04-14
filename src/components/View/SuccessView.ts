// src/components/view/SuccessView.ts
import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export class SuccessView extends Component<{ total: number }> {
    protected description: HTMLElement;
    protected button: HTMLButtonElement;
    protected events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        
        this.description = this.container.querySelector('.order-success__description') as HTMLElement;
        this.button = this.container.querySelector('.order-success__close') as HTMLButtonElement;

        this.button.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    private updateText(element: HTMLElement, value: string): void {
        if (element) {
            element.textContent = value;
        }
    }

    setTotal(total: number): void {
        this.updateText(this.description, `Списано ${total} синапсов`);
    }

    render(data?: { total: number }): HTMLElement {
        if (data) {
            this.setTotal(data.total);
        }
        return this.container;
    }
}