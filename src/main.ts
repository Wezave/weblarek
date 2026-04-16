import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { Catalog } from './components/Models/Catalog';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { Api } from './components/base/Api';
import { LarekApi } from './components/LarekApi';
import { API_URL } from './utils/constants';
import { Modal } from './components/View/Modal';
import { CatalogView } from './components/View/CatalogView';
import { CatalogItem } from './components/View/CatalogItem';
import { CartView } from './components/View/CartView';
import { ProductPreview } from './components/View/ProductPreview';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { SuccessView } from './components/View/SuccessView';
import { IOrderData, IBuyerValidate } from './types';

const events = new EventEmitter();

const catalog = new Catalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

const api = new Api(API_URL);
const larekApi = new LarekApi(api);

const modalContainer = document.querySelector('#modal-container') as HTMLElement;
const galleryContainer = document.querySelector('.gallery') as HTMLElement;
const catalogItemTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const productPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cartItemTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

const modal = new Modal(modalContainer, events);
const catalogView = new CatalogView(galleryContainer, catalogItemTemplate, events);
const cartView = new CartView(basketTemplate, cartItemTemplate, events);

/*  тестирование

const testProduct: IProduct = { 
    id: 'test-1', 
    title: 'Тестовый товар', 
    description: 'Описание тестового товара', 
    image: 'https://via.placeholder.com/150', 
    category: 'софт-скил', 
    price: 1000 
}; 
if (galleryContainer) { 
    const testCardContainer = catalogItemTemplate.content.firstElementChild as HTMLElement; 
    const testCard = new CatalogItem(testCardContainer, events); 
    testCard.render(testProduct); 
    galleryContainer.replaceChildren(testCard.render()); 
    console.log('Тест карточки каталога: OK'); 
} 
*/

let currentOrderForm: OrderForm | null = null;
let currentContactsForm: ContactsForm | null = null;
let currentPreview: ProductPreview | null = null;

function renderCatalog(): void {
    const products = catalog.getProducts();
    catalogView.render({ items: products });
}

function updateCartCounter(): void {
    const counter = document.querySelector('.header__basket-counter') as HTMLElement;
    if (counter) counter.textContent = cart.getCount().toString();
}

function renderCart(): void {
    const items = cart.getItems();
    const total = cart.getTotal();
    const cartElement = cartView.render({ items, total });
    modal.setContent(cartElement);
}

function openCart(): void {
    renderCart();
    modal.open();
}

function openProductPreview(id: string): void {
    const product = catalog.getProductById(id);
    if (!product) return;

    const previewContainer = productPreviewTemplate.content.firstElementChild;
    if (!previewContainer || !(previewContainer instanceof HTMLElement)) return;
    const clone = previewContainer.cloneNode(true) as HTMLElement;
    const preview = new ProductPreview(clone, events);
    currentPreview = preview;
    preview.setData(product);
    const inCart = cart.isInCart(id);
    preview.setButtonState(inCart);
    modal.setContent(preview.render());
    modal.open();
}

function toggleCartItem(id: string): void {
    if (cart.isInCart(id)) {
        cart.removeItem(id);
    } else {
        const product = catalog.getProductById(id);
        if (product && product.price !== null) cart.addItem(product);
    }
    if (currentPreview) {
        currentPreview.setButtonState(cart.isInCart(id));
    }
    modal.close();
}

function removeFromCart(id: string): void {
    cart.removeItem(id);
    renderCart();
}

function validateOrderForm(): void {
    if (!currentOrderForm) return;
    const errors = buyer.validate();
    currentOrderForm.setErrors(errors);
}

function validateContactsForm(): void {
    if (!currentContactsForm) return;
    const errors = buyer.validate();
    currentContactsForm.setErrors(errors);
}

function openOrderForm(): void {
    const formContainer = orderTemplate.content.firstElementChild;
    if (!formContainer || !(formContainer instanceof HTMLFormElement)) return;
    const clone = formContainer.cloneNode(true) as HTMLFormElement;
    currentOrderForm = new OrderForm(clone, events);
    const buyerData = buyer.getData();
    const errors = buyer.validate();
    currentOrderForm.render({
        payment: buyerData.payment || undefined,
        address: buyerData.address,
        errors: errors,
    });
    modal.setContent(currentOrderForm.render());
    modal.open();
}

function openContactsForm(): void {
    const formContainer = contactsTemplate.content.firstElementChild;
    if (!formContainer || !(formContainer instanceof HTMLFormElement)) return;
    const clone = formContainer.cloneNode(true) as HTMLFormElement;
    currentContactsForm = new ContactsForm(clone, events);
    const buyerData = buyer.getData();
    const errors = buyer.validate();
    currentContactsForm.render({
        email: buyerData.email,
        phone: buyerData.phone,
        errors: errors,
    });
    modal.setContent(currentContactsForm.render());
}

function submitOrder(): void {
    const buyerData = buyer.getData();
    const cartItems = cart.getItems();
    const orderData: IOrderData = {
        payment: buyerData.payment!,
        email: buyerData.email,
        phone: buyerData.phone,
        address: buyerData.address,
        total: cart.getTotal(),
        items: cartItems.map((item) => item.id),
    };
    larekApi
        .postOrder(orderData)
        .then((response) => {
            cart.clear();
            buyer.clear();
            const successContainer = successTemplate.content.firstElementChild;
            if (successContainer && successContainer instanceof HTMLElement) {
                const clone = successContainer.cloneNode(true) as HTMLElement;
                const successView = new SuccessView(clone, events);
                successView.render({ total: response.total });
                modal.setContent(successView.render());
            }
        })
        .catch((err) => {
            console.error('Ошибка оформления заказа:', err);
            alert('Произошла ошибка при оформлении заказа. Попробуйте позже.');
        });
}

events.on('catalog:changed', () => renderCatalog());
events.on('cart:changed', () => updateCartCounter());
events.on('buyer:changed', () => {
    if (currentOrderForm) {
        const buyerData = buyer.getData();
        if (buyerData.payment) {
            currentOrderForm.setPayment(buyerData.payment);
        }
        currentOrderForm.setErrors(buyer.validate());
    }
    if (currentContactsForm) {
        currentContactsForm.setErrors(buyer.validate());
    }
});

events.on('catalog:item-selected', (data: { id: string }) => openProductPreview(data.id));
events.on('cart:toggle', (data: { id: string }) => toggleCartItem(data.id));
events.on('cart:remove', (data: { id: string }) => removeFromCart(data.id));
events.on('cart:open', () => openCart());
events.on('order:start', () => openOrderForm());
events.on('order:payment-select', (data: { payment: 'cash' | 'card' }) => buyer.setData({ payment: data.payment }));
events.on('order:address-change', (data: { address: string }) => buyer.setData({ address: data.address }));
events.on('order:submit', () => openContactsForm());
events.on('contacts:email-change', (data: { email: string }) => buyer.setData({ email: data.email }));
events.on('contacts:phone-change', (data: { phone: string }) => buyer.setData({ phone: data.phone }));
events.on('contacts:submit', () => submitOrder());
events.on('modal:close', () => {
    currentOrderForm = null;
    currentContactsForm = null;
    currentPreview = null;
});
events.on('success:close', () => {
    modal.close();
    cart.clear();
    buyer.clear();
});

larekApi
    .getProducts()
    .then((data) => catalog.setProducts(data.items))
    .catch((err) => console.error('Ошибка загрузки товаров:', err));

const headerBasket = document.querySelector('.header__basket') as HTMLElement;
if (headerBasket) headerBasket.addEventListener('click', () => events.emit('cart:open'));