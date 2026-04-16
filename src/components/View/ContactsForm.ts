import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { IBuyerValidate } from '../../types';

export class ContactsForm extends Component<{ email?: string; phone?: string; errors?: IBuyerValidate }> {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;
    private submitButton: HTMLButtonElement;
    private errorsSpan: HTMLElement;
    private events: EventEmitter;

    constructor(container: HTMLFormElement, events: EventEmitter) {
        super(container);
        this.events = events;
        this.emailInput = this.container.querySelector('input[name="email"]') as HTMLInputElement;
        this.phoneInput = this.container.querySelector('input[name="phone"]') as HTMLInputElement;
        this.submitButton = this.container.querySelector('.button') as HTMLButtonElement;
        this.errorsSpan = this.container.querySelector('.form__errors') as HTMLElement;

        this.emailInput.addEventListener('input', () => this.events.emit('contacts:email-change', { email: this.emailInput.value }));
        this.phoneInput.addEventListener('input', () => this.events.emit('contacts:phone-change', { phone: this.phoneInput.value }));
        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.events.emit('contacts:submit');
        });
    }

    setEmail(email: string) { this.emailInput.value = email; }
    setPhone(phone: string) { this.phoneInput.value = phone; }

    setValid(isValid: boolean) {
        this.submitButton.disabled = !isValid;
    }

    showErrors(errors: string[]) {
        this.errorsSpan.textContent = errors.join(', ');
    }

    setErrors(errors: IBuyerValidate) {
        const messages = [];
        if (errors.email) messages.push(errors.email);
        if (errors.phone) messages.push(errors.phone);
        this.showErrors(messages);
        this.setValid(messages.length === 0);
    }

    render(data?: { email?: string; phone?: string; errors?: IBuyerValidate }): HTMLElement {
        if (data) {
            if (data.email !== undefined) this.setEmail(data.email);
            if (data.phone !== undefined) this.setPhone(data.phone);
            if (data.errors) this.setErrors(data.errors);
        }
        return this.container;
    }
}