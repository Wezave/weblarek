// src/components/view/Modal.ts
import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export class Modal extends Component<{}> {
    protected content: HTMLElement;
    protected closeButton: HTMLElement;
    protected events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        this.content = this.container.querySelector('.modal__content') as HTMLElement;
        this.closeButton = this.container.querySelector('.modal__close') as HTMLElement;

        this.closeButton.addEventListener('click', () => this.close());
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.close();
            }
        });
    }

    open(): void {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.content.innerHTML = '';
        this.events.emit('modal:close');
    }

    setContent(content: HTMLElement): void {
        this.content.innerHTML = '';
        this.content.appendChild(content);
    }

    render(): HTMLElement {
        return this.container;
    }
}