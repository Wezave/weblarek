import "./scss/styles.scss";
import { EventEmitter } from "./components/base/Events";
import { Catalog } from "./components/Models/Catalog";
import { Cart } from "./components/Models/Cart";
import { Buyer } from "./components/Models/Buyer";
import { Api } from "./components/base/Api";
import { LarekApi } from "./components/LarekApi";
import { API_URL } from "./utils/constants";
import { cloneTemplate } from "./utils/utils";
import { Modal } from "./components/View/Modal";
import { Header } from "./components/View/Header";
import { CatalogView } from "./components/View/CatalogView";
import { CartView } from "./components/View/CartView";
import { ProductPreview } from "./components/View/ProductPreview";
import { OrderForm } from "./components/View/OrderForm";
import { ContactsForm } from "./components/View/ContactsForm";
import { SuccessView } from "./components/View/SuccessView";
import { CatalogItem } from "./components/View/CatalogItem";
import { CartItem } from "./components/View/CartItem";
import { IOrderData } from "./types";

const events = new EventEmitter();

const catalog = new Catalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

const api = new Api(API_URL);
const larekApi = new LarekApi(api);

const modalContainer = document.querySelector(
  "#modal-container",
) as HTMLElement;
const galleryContainer = document.querySelector(".gallery") as HTMLElement;
const headerContainer = document.querySelector(".header") as HTMLElement;
const catalogItemTemplate = document.querySelector(
  "#card-catalog",
) as HTMLTemplateElement;
const productPreviewTemplate = document.querySelector(
  "#card-preview",
) as HTMLTemplateElement;
const basketTemplate = document.querySelector("#basket") as HTMLTemplateElement;
const cartItemTemplate = document.querySelector(
  "#card-basket",
) as HTMLTemplateElement;
const orderTemplate = document.querySelector("#order") as HTMLTemplateElement;
const contactsTemplate = document.querySelector(
  "#contacts",
) as HTMLTemplateElement;
const successTemplate = document.querySelector(
  "#success",
) as HTMLTemplateElement;

const modal = new Modal(modalContainer, events);
const header = new Header(headerContainer);
const catalogView = new CatalogView(galleryContainer);
const cartContainer = cloneTemplate(basketTemplate);
const cartView = new CartView(cartContainer, events);
const productPreview = new ProductPreview(
  cloneTemplate(productPreviewTemplate),
  {
    onToggle: (id) => events.emit("cart:toggle", { id }),
  },
);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);

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

function renderCatalog(): void {
  const products = catalog.getProducts();
  const cards = products.map((product) => {
    const cardElement = cloneTemplate(catalogItemTemplate);
    const card = new CatalogItem(cardElement, {
      onClick: (id) => events.emit("catalog:item-selected", { id }),
    });
    return card.render(product);
  });
  catalogView.setItems(cards);
}

function updateCartView(): void {
  const items = cart.getItems();
  const cards = items.map((item, idx) => {
    const cardElement = cloneTemplate(cartItemTemplate);
    const cartItem = new CartItem(cardElement, {
      onRemove: (id) => events.emit("cart:remove", { id }),
    });
    return cartItem.render({ item, index: idx + 1 });
  });
  cartView.setItems(cards);
  cartView.setTotal(cart.getTotal());
  header.setCount(cart.getCount());
}

events.on("catalog:changed", () => renderCatalog());
events.on("cart:changed", () => updateCartView());
events.on("buyer:changed", () => {
  const modalContent = modalContainer.querySelector(".modal__content");
  if (modalContent) {
    if (modalContent.querySelector('form[name="order"]')) {
      const data = buyer.getData();
      orderForm.setPayment(data.payment || "card");
      orderForm.setAddress(data.address);
      orderForm.setErrors(buyer.validate());
    } else if (modalContent.querySelector('form[name="contacts"]')) {
      const data = buyer.getData();
      contactsForm.setEmail(data.email);
      contactsForm.setPhone(data.phone);
      contactsForm.setErrors(buyer.validate());
    }
  }
});

events.on("catalog:item-selected", (data: { id: string }) => {
  const product = catalog.getProductById(data.id);
  if (product) catalog.setSelectedProduct(product);
});

events.on("catalog:selected-changed", () => {
  const product = catalog.getSelectedProduct();
  if (product) {
    productPreview.render(product);
    productPreview.setButtonState(cart.isInCart(product.id));
    modal.setContent(productPreview.render());
    modal.open();
  }
});

events.on("cart:toggle", (data: { id: string }) => {
  if (cart.isInCart(data.id)) {
    cart.removeItem(data.id);
  } else {
    const product = catalog.getProductById(data.id);
    if (product && product.price !== null) cart.addItem(product);
  }
  modal.close();
});

events.on("cart:remove", (data: { id: string }) => {
  cart.removeItem(data.id);
});

events.on("cart:open", () => {
  modal.setContent(cartView.render());
  modal.open();
});

events.on("order:start", () => {
  orderForm.clear();
  const buyerData = buyer.getData();
  orderForm.render({
    payment: buyerData.payment || undefined,
    address: buyerData.address,
    errors: buyer.validate(),
  });
  modal.setContent(orderForm.render());
  modal.open();
});

events.on("order:payment-select", (data: { payment: "cash" | "card" }) => {
  buyer.setData({ payment: data.payment });
});

events.on("order:address-change", (data: { address: string }) => {
  buyer.setData({ address: data.address });
});

events.on("order:submit", () => {
  contactsForm.clear();
  const buyerData = buyer.getData();
  contactsForm.render({
    email: buyerData.email,
    phone: buyerData.phone,
    errors: buyer.validate(),
  });
  modal.setContent(contactsForm.render());
});

events.on("contacts:email-change", (data: { email: string }) => {
  buyer.setData({ email: data.email });
});

events.on("contacts:phone-change", (data: { phone: string }) => {
  buyer.setData({ phone: data.phone });
});

events.on("contacts:submit", () => {
  const buyerData = buyer.getData();
  const orderData: IOrderData = {
    payment: buyerData.payment!,
    email: buyerData.email,
    phone: buyerData.phone,
    address: buyerData.address,
    total: cart.getTotal(),
    items: cart.getItems().map((i) => i.id),
  };
  larekApi
    .postOrder(orderData)
    .then((response) => {
      cart.clear();
      buyer.clear();
      const successContainer = cloneTemplate(successTemplate);
      const successView = new SuccessView(successContainer, events);
      successView.render({ total: response.total });
      modal.setContent(successView.render());
    })
    .catch((err) => {
      console.error("Ошибка оформления заказа:", err);
      alert("Произошла ошибка при оформлении заказа. Попробуйте позже.");
    });
});

events.on("modal:close", () => {
  orderForm.clear();
  contactsForm.clear();
});

events.on("success:close", () => {
  modal.close();
  cart.clear();
  buyer.clear();
});

larekApi
  .getProducts()
  .then((data) => catalog.setProducts(data.items))
  .catch((err) => console.error("Ошибка загрузки товаров:", err));

const headerBasket = headerContainer.querySelector(
  ".header__basket",
) as HTMLElement;
if (headerBasket)
  headerBasket.addEventListener("click", () => events.emit("cart:open"));
