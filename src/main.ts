import "./scss/styles.scss";
import { EventEmitter } from "./components/base/Events";
import { Catalog } from "./components/Models/Catalog";
import { Cart } from "./components/Models/Cart";
import { Buyer } from "./components/Models/Buyer";
import { Api } from "./components/base/Api";
import { LarekApi } from "./components/LarekApi";
import { API_URL } from "./utils/constants";
import { ensureElement, cloneTemplate } from "./utils/utils";
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

const modalContainer = ensureElement("#modal-container");
const galleryContainer = ensureElement(".gallery");
const headerContainer = ensureElement(".header");
const catalogItemTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const productPreviewTemplate =
  ensureElement<HTMLTemplateElement>("#card-preview");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const cartItemTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");

const modal = new Modal(modalContainer);
const header = new Header(headerContainer);
const catalogView = new CatalogView(galleryContainer);
const cartView = new CartView(cloneTemplate(basketTemplate));
const productPreview = new ProductPreview(
  cloneTemplate(productPreviewTemplate),
  {
    onToggle: (id) => events.emit("cart:toggle", { id }),
  },
);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);
const successView = new SuccessView(cloneTemplate(successTemplate), events);

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

function renderCartContent(): void {
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
  cartView.setButtonEnabled(items.length > 0);
}

function updateHeaderCounter(): void {
  header.setCount(cart.getCount());
}

function openModal(content: HTMLElement): void {
  modal.setContent(content);
  modal.open();
}

events.on("catalog:changed", () => renderCatalog());
events.on("cart:changed", () => {
  updateHeaderCounter();
  renderCartContent();
});
events.on("buyer:changed", () => {
  const errors = buyer.validate();
  orderForm.setErrors(errors);
  contactsForm.setErrors(errors);
});

events.on("catalog:item-selected", (data: { id: string }) => {
  const product = catalog.getProductById(data.id);
  if (product) catalog.setSelectedProduct(product);
});

events.on("catalog:selected-changed", () => {
  const product = catalog.getSelectedProduct();
  if (product) {
    productPreview.render(product);
    const inCart = cart.isInCart(product.id);
    productPreview.setButtonText(inCart ? "Удалить" : "Купить");
    productPreview.setButtonEnabled(product.price !== null);
    openModal(productPreview.render());
  }
});

events.on("cart:toggle", (data: { id: string }) => {
  if (cart.isInCart(data.id)) cart.removeItem(data.id);
  else {
    const product = catalog.getProductById(data.id);
    if (product && product.price !== null) cart.addItem(product);
  }
});
events.on("cart:remove", (data: { id: string }) => cart.removeItem(data.id));
events.on("cart:open", () => openModal(cartView.render()));

events.on("order:start", () => {
  const data = buyer.getData();
  orderForm.setPayment(data.payment || "card");
  orderForm.setAddress(data.address);
  orderForm.setErrors(buyer.validate());
  openModal(orderForm.render());
});
events.on("order:payment-select", (data: { payment: "cash" | "card" }) =>
  buyer.setData({ payment: data.payment }),
);
events.on("order:address-change", (data: { address: string }) =>
  buyer.setData({ address: data.address }),
);
events.on("order:submit", () => openModal(contactsForm.render()));

events.on("contacts:email-change", (data: { email: string }) =>
  buyer.setData({ email: data.email }),
);
events.on("contacts:phone-change", (data: { phone: string }) =>
  buyer.setData({ phone: data.phone }),
);
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
      successView.setTotal(response.total);
      openModal(successView.render());
    })
    .catch((err) => console.error("Ошибка заказа:", err));
});

events.on("success:close", () => modal.close());

larekApi
  .getProducts()
  .then((data) => catalog.setProducts(data.items))
  .catch((err) => console.error("Ошибка загрузки:", err));

const headerBasket = headerContainer.querySelector(
  ".header__basket",
) as HTMLElement;
if (headerBasket)
  headerBasket.addEventListener("click", () => events.emit("cart:open"));
