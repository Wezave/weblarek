import "./scss/styles.scss";
import { Catalog } from "./components/Models/Catalog";
import { apiProducts } from "./utils/data";
import { Api } from "./components/base/Api";
import { LarekApi } from "./components/LarekApi";
import { API_URL } from "./utils/constants";
import { Cart } from "./components/Models/Cart";
import { Buyer } from "./components/Models/Buyer";

console.log("===Тестирование каталога===");
const catalog = new Catalog();
catalog.setProducts(apiProducts.items);
console.log("Все товары: ", catalog.getProducts());
console.log(
  "Первый товар: ",
  catalog.getProductById("b06cde61-912f-4663-9751-09956c0eed67"),
);
catalog.setSelectedProduct(apiProducts.items[0]);
console.log("Сохраненный товар: ", catalog.getSelectedProduct());

console.log("===Тестирование корзины===");
const cart = new Cart();
cart.addItem(apiProducts.items[0]);
console.log("Товары в корзине: ", cart.getItems());
cart.addItem(apiProducts.items[1]);
cart.addItem(apiProducts.items[2]);
console.log("Товары в корзине: ", cart.getItems());
cart.removeItem("b06cde61-912f-4663-9751-09956c0eed67");
console.log("Товары в корзине после удаления одной позиции: ", cart.getItems());
console.log("Позиций в корзине: ", cart.getCount());
console.log(
  "Есть ли конкретная позиция: ",
  cart.isInCart("b06cde61-912f-4663-9751-09956c0eed67"),
);
console.log("Общая стоимость товаров в корзине", cart.getTotal());
cart.clear();
console.log("Очищенная корзина: ", cart.getItems());

console.log("===Тестирование оформления покупателя===");
const buyer = new Buyer();
buyer.setData({
  payment: "card",
  email: "hhh@hh.hh",
  phone: "+777777",
  // специально без адреса
});
console.log("Данные покупателя: ", buyer.getData());
console.log("Валидация: ", buyer.validate());
buyer.clear();
console.log("Пустые данные: ", buyer.getData());

console.log("API base URL:", API_URL);
const api = new Api(API_URL);
const larekApi = new LarekApi(api);

larekApi
  .getProducts()
  .then((data) => {
    catalog.setProducts(data.items);
    console.log("Каталог: ", catalog.getProducts());
  })
  .catch((err) => {
    console.error("Ошибка загрузки:", err);
  });
