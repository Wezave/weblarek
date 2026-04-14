// src/components/view/ContactsForm.ts
import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { IBuyer } from '../../types';

export class ContactsForm extends Component<{
    email?: string;
    phone?: string;
    errors?: Partial<Record<keyof IBuyer, string>>;
}> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;
    protected submitButton: HTMLButtonElement;
    protected errorsSpan: HTMLElement;
    protected events: EventEmitter;

    constructor(container: HTMLFormElement, events: EventEmitter) {
        super(container);
        this.events = events;
        
        this.emailInput = this.container.querySelector('input[name="email"]') as HTMLInputElement;
        this.phoneInput = this.container.querySelector('input[name="phone"]') as HTMLInputElement;
        this.submitButton = this.container.querySelector('.button') as HTMLButtonElement;
        this.errorsSpan = this.container.querySelector('.form__errors') as HTMLElement;

        this.emailInput.addEventListener('input', () => {
            this.events.emit('contacts:email-change', { email: this.emailInput.value });
        });

        this.phoneInput.addEventListener('input', () => {
            this.events.emit('contacts:phone-change', { phone: this.phoneInput.value });
        });

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.events.emit('contacts:submit', {
                email: this.emailInput.value,
                phone: this.phoneInput.value
            });
        });
    }

    private updateText(element: HTMLElement, value: string): void {
        if (element) {
            element.textContent = value;
        }
    }

    setValid(isValid: boolean): void {
        this.submitButton.disabled = !isValid;
    }

    showErrors(errors: string[]): void {
        if (errors.length > 0) {
            this.updateText(this.errorsSpan, errors.join(', '));
        } else {
            this.updateText(this.errorsSpan, '');
        }
    }

    clear(): void {
        this.emailInput.value = '';
        this.phoneInput.value = '';
        this.submitButton.disabled = true;
        this.updateText(this.errorsSpan, '');
    }

    render(data?: { email?: string; phone?: string; errors?: Partial<Record<keyof IBuyer, string>> }): HTMLElement {
        if (data) {
            if (data.email !== undefined) {
                this.emailInput.value = data.email;
            }
            if (data.phone !== undefined) {
                this.phoneInput.value = data.phone;
            }
            if (data.errors) {
                const errorMessages = Object.values(data.errors);
                this.showErrors(errorMessages);
            }
        }
        return this.container;
    }
}