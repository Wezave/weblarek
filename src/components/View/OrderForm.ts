// src/components/view/OrderForm.ts
import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { TPayment, IBuyer } from '../../types';

export class OrderForm extends Component<{
    payment?: TPayment;
    address?: string;
    errors?: Partial<Record<keyof IBuyer, string>>;
}> {
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected addressInput: HTMLInputElement;
    protected submitButton: HTMLButtonElement;
    protected errorsSpan: HTMLElement;
    protected events: EventEmitter;
    protected currentPayment: TPayment | null = null;

    constructor(container: HTMLFormElement, events: EventEmitter) {
        super(container);
        this.events = events;
        
        this.cardButton = this.container.querySelector('button[name="card"]') as HTMLButtonElement;
        this.cashButton = this.container.querySelector('button[name="cash"]') as HTMLButtonElement;
        this.addressInput = this.container.querySelector('input[name="address"]') as HTMLInputElement;
        this.submitButton = this.container.querySelector('.order__button') as HTMLButtonElement;
        this.errorsSpan = this.container.querySelector('.form__errors') as HTMLElement;

        this.cardButton.addEventListener('click', () => {
            this.setPayment('card');
            this.events.emit('order:payment-select', { payment: 'card' });
        });

        this.cashButton.addEventListener('click', () => {
            this.setPayment('cash');
            this.events.emit('order:payment-select', { payment: 'cash' });
        });

        this.addressInput.addEventListener('input', () => {
            this.events.emit('order:address-change', { address: this.addressInput.value });
        });

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.currentPayment) {
                this.events.emit('order:submit', {
                    payment: this.currentPayment,
                    address: this.addressInput.value
                });
            }
        });
    }

    private updateText(element: HTMLElement, value: string): void {
        if (element) {
            element.textContent = value;
        }
    }

    protected setPayment(payment: TPayment): void {
        this.currentPayment = payment;
        
        if (payment === 'card') {
            this.cardButton.classList.add('button_alt-active');
            this.cashButton.classList.remove('button_alt-active');
        } else {
            this.cashButton.classList.add('button_alt-active');
            this.cardButton.classList.remove('button_alt-active');
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
        this.addressInput.value = '';
        this.currentPayment = null;
        this.cardButton.classList.remove('button_alt-active');
        this.cashButton.classList.remove('button_alt-active');
        this.submitButton.disabled = true;
        this.updateText(this.errorsSpan, '');
    }

    render(data?: Partial<{ payment?: TPayment; address?: string; errors?: Partial<Record<keyof IBuyer, string>> }>): HTMLElement {
        if (data) {
            if (data.payment) {
                this.setPayment(data.payment);
            }
            if (data.address !== undefined) {
                this.addressInput.value = data.address;
            }
            if (data.errors) {
                const errorMessages = Object.values(data.errors);
                this.showErrors(errorMessages);
            }
        }
        return this.container;
    }
}