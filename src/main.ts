import "./scss/styles.scss";
import { Catalog } from "./components/Models/Catalog";
import { apiProducts } from "./utils/data";
import { Api } from "./components/base/Api";
import { LarekApi } from "./components/LarekApi";
import { API_URL } from "./utils/constants";

const catalog = new Catalog();
catalog.setProducts(apiProducts.items);
console.log("Все товары: ", catalog.getProducts());
console.log(
  "Первый товар: ",
  catalog.getProductById("b06cde61-912f-4663-9751-09956c0eed67"),
);
catalog.setSelectedProduct(apiProducts.items[0]);
console.log("Сохраненный товар: ", catalog.getSelectedProduct());

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
