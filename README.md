# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные

#### Сущности предметной области

**Интерфейс `IProduct`** – описывает товар.

- `id: string` – уникальный идентификатор товара.
- `description: string` – полное описание товара.
- `image: string` – URL изображения товара (относительный путь для `CDN_URL`).
- `title: string` – название товара.
- `category: string` – категория товара.
- `price: number | null` – цена товара в рублях. Если `null`, товар недоступен для покупки.

**Интерфейс `IBuyer`** – содержит данные покупателя, необходимые для оформления заказа.

- `payment: TPayment` – способ оплаты: `'cash'` (наличные) или `'card'` (карта).
- `email: string` – электронная почта покупателя.
- `phone: string` – номер телефона покупателя.
- `address: string` – адрес доставки.

#### Типы для обмена с сервером

**`IProductsResponse`** – ответ сервера при запросе списка товаров.

```
  items: IProduct[]; – массив товаров
  total: number; – общее количество товаров
```

**`IOrderData`** – данные, отправляемые на сервер при оформлении заказа.
```
  payment: TPayment; – способ оплаты
  email: string; – email покупателя
  phone: string; – телефон покупателя
  address: string; – адрес доставки
  items: string[]; – массив id выбранных товаров
```

**`IOrderResponse`** – ответ сервера после успешного создания заказа.
```
  id: string; – идентификатор заказа
  total: number; – итоговая сумма заказа
```

### Модели данных

#### Класс Catalog
**Назначение:** хранение каталога товаров и выбранного для детального просмотра товара.

**Конструктор:**  
`constructor()` – не принимает параметров.

**Поля:**
- `private products: IProduct[]` – массив всех товаров.
- `private selectedProduct: IProduct | null` – выбранный товар (для детального отображения).

**Методы:**
- `setProducts(products: IProduct[]): void` – сохраняет массив товаров.
- `getProducts(): IProduct[]` – возвращает массив всех товаров.
- `getProductById(id: string): IProduct | undefined` – возвращает товар по его идентификатору или `undefined`, если товар не найден.
- `setSelectedProduct(product: IProduct): void` – сохраняет товар для подробного отображения.
- `getSelectedProduct(): IProduct | null` – возвращает сохранённый выбранный товар.

#### Класс Cart
**Назначение:** хранение товаров, добавленных пользователем в корзину.

**Конструктор:**  
`constructor()` – не принимает параметров.

**Поля:**
- `private items: IProduct[]` – массив товаров в корзине.

**Методы:**
- `getItems(): IProduct[]` – возвращает массив товаров в корзине.
- `addItem(product: IProduct): void` – добавляет товар в корзину (если товара ещё нет в корзине).
- `removeItem(productId: string): void` – удаляет товар из корзины по `id`.
- `clear(): void` – полностью очищает корзину.
- `getTotal(): number` – вычисляет общую стоимость товаров в корзине.
- `getCount(): number` – возвращает количество товаров в корзине.
- `isInCart(productId: string): boolean` – проверяет, находится ли товар с указанным `id` в корзине.

#### Класс Buyer
**Назначение:** хранение и валидация данных покупателя при оформлении заказа.

**Конструктор:**  
`constructor()` – не принимает параметров.

**Поля:**
- `private payment: TPayment | null` – выбранный способ оплаты.
- `private email: string` – email покупателя.
- `private phone: string` – телефон покупателя.
- `private address: string` – адрес покупателя.

**Методы:**
- `setData(data: Partial<IBuyer>): void` – сохраняет одно или несколько полей данных покупателя (частичное обновление).
- `getData(): IBuyer` – возвращает все сохранённые данные (если поле не заполнено, возвращается пустая строка или `null`).
- `clear(): void` – сбрасывает все данные в начальное состояние.
- `validate(): Partial<Record<keyof IBuyer, string>>` – проверяет валидность полей. Возвращает объект с ошибками, где ключ – имя поля, значение – текст ошибки. Поле считается валидным, если оно не пустое (для строк – не пустая строка после `trim()`, для `payment` – выбран вариант). Если ошибок нет, объект пуст.

### Слой коммуникации

#### Класс LarekApi
**Назначение:** инкапсулирует логику взаимодействия с API сервера «Веб-ларёк». Использует композицию с классом `Api`, который выполняет HTTP-запросы.

**Конструктор:**  
`constructor(private api: IApi)` – принимает объект, реализующий интерфейс `IApi` (обычно экземпляр класса `Api`).

**Поля:**
- `private api: IApi` – ссылка на объект для выполнения запросов.

**Методы:**
- `getProducts(): Promise<IProductsResponse>` – выполняет GET-запрос к эндпоинту `/product`. Возвращает промис с объектом, содержащим массив товаров.
- `postOrder(order: IOrderData): Promise<IOrderResponse>` – выполняет POST-запрос к эндпоинту `/order`, передавая данные заказа. Возвращает промис с объектом подтверждения (идентификатор и итоговая сумма).

### Cлой Представления (View)

Классы представления отвечают за отображение интерфейса и взаимодействие с пользователем. Они отображают данные и генерируют события о действиях пользователя.

#### Базовые принципы

- Все DOM элементы находятся в конструкторе и сохраняются в поля класса
- Классы не хранят данные в полях (только DOM элементы)
- Все слушатели событий устанавливаются единожды в конструкторе
- Метод `render()` возвращает корневой DOM элемент
- Действия пользователя отображаются через брокер событий `EventEmitter`

#### Компоненты представления

**Класс `Modal`** – управление модальным окном.

Конструктор:
- `constructor(container: HTMLElement, events: EventEmitter)` – принимает корневой элемент модального окна и брокер событий.

Поля:
- `container: HTMLElement` – корневой элемент модального окна
- `content: HTMLElement` – контейнер для контента
- `closeButton: HTMLElement` – кнопка закрытия
- `events: EventEmitter` – брокер событий

Методы:
- `open(): void` – открывает модальное окно (добавляет класс `modal_active`)
- `close(): void` – закрывает модальное окно (удаляет класс `modal_active`)
- `setContent(content: HTMLElement): void` – устанавливает контент в модальное окно
- `render(): HTMLElement` – возвращает корневой элемент

Генерируемые события:
- `modal:open` – при открытии модального окна
- `modal:close` – при закрытии модального окна

**Класс `CatalogItem`** – карточка товара в каталоге.

Конструктор:
- `constructor(template: HTMLTemplateElement, events: EventEmitter)` – принимает шаблон карточки и брокер событий.

Поля:
- `container: HTMLElement` – корневой элемент карточки
- `category: HTMLElement` – элемент категории
- `title: HTMLElement` – элемент заголовка
- `image: HTMLImageElement` – элемент изображения
- `price: HTMLElement` – элемент цены
- `events: EventEmitter` – брокер событий
- `id: string` – идентификатор товара (устанавливается при рендере)

Методы:
- `setData(data: IProduct): void` – заполняет карточку данными товара
- `render(data?: IProduct): HTMLElement` – отображает карточку
- `getElement(): HTMLElement` – возвращает корневой элемент

Генерируемые события:
- `catalog:item-selected` – при клике на карточку (передаётся `{ id: string }`)

**Класс `CatalogView`** – отображение списка товаров (галерея).

Конструктор:
- `constructor(container: HTMLElement, events: EventEmitter)` – принимает контейнер для галереи (`.gallery`) и брокер событий.

Поля:
- `container: HTMLElement` – контейнер галереи
- `events: EventEmitter` – брокер событий
- `items: Map<string, CatalogItem>` – карта созданных карточек

Методы:
- `render(items: IProduct[]): HTMLElement` – отображает список товаров
- `clear(): void` – очищает галерею

**Класс `ProductPreview`** – детальный просмотр товара.

Конструктор:
- `constructor(template: HTMLTemplateElement, events: EventEmitter)` – принимает шаблон и брокер событий.

Поля:
- `container: HTMLElement` – корневой элемент
- `image: HTMLImageElement` – элемент изображения
- `category: HTMLElement` – элемент категории
- `title: HTMLElement` – элемент заголовка
- `description: HTMLElement` – элемент описания
- `price: HTMLElement` – элемент цены
- `button: HTMLButtonElement` – кнопка добавления в корзину
- `events: EventEmitter` – брокер событий
- `productId: string` – идентификатор текущего товара

Методы:
- `setData(data: IProduct): void` – заполняет данными товара
- `render(data?: IProduct): HTMLElement` – отображает карточку
- `setButtonState(inBasket: boolean): void` – меняет состояние кнопки

Генерируемые события:
- `cart:add` – при клике на кнопку добавления в корзину (передаётся `{ id: string }`)

**Класс `CartItem`** – элемент корзины.

Конструктор:
- `constructor(template: HTMLTemplateElement, events: EventEmitter)` – принимает шаблон и брокер событий.

Поля:
- `container: HTMLElement` – корневой элемент
- `index: HTMLElement` – элемент порядкового номера
- `title: HTMLElement` – элемент заголовка
- `price: HTMLElement` – элемент цены
- `deleteButton: HTMLButtonElement` – кнопка удаления
- `events: EventEmitter` – брокер событий
- `productId: string` – идентификатор товара

Методы:
- `setData(data: IProduct, index: number): void` – заполняет данными
- `render(data?: IProduct, index?: number): HTMLElement` – отображает элемент

Генерируемые события:
- `cart:remove` – при клике на кнопку удаления (передаётся `{ id: string }`)

**Класс `CartView`** – отображение корзины.

Конструктор:
- `constructor(template: HTMLTemplateElement, events: EventEmitter)` – принимает шаблон и брокер событий.

Поля:
- `container: HTMLElement` – корневой элемент
- `list: HTMLElement` – контейнер для списка товаров (`.basket__list`)
- `price: HTMLElement` – элемент общей стоимости
- `button: HTMLButtonElement` – кнопка оформления заказа
- `events: EventEmitter` – брокер событий
- `items: Map<string, CartItem>` – карта элементов корзины

Методы:
- `render(items: IProduct[], total: number): HTMLElement` – отображает корзину
- `clear(): void` – очищает список

Генерируемые события:
- `order:start` – при клике на кнопку оформления заказа

**Класс `OrderForm`** – форма заказа (способ оплаты и адрес).

Конструктор:
- `constructor(template: HTMLTemplateElement, events: EventEmitter)` – принимает шаблон и брокер событий.

Поля:
- `container: HTMLElement` – корневой элемент формы
- `cardButton: HTMLButtonElement` – кнопка оплаты картой
- `cashButton: HTMLButtonElement` – кнопка оплаты наличными
- `addressInput: HTMLInputElement` – поле ввода адреса
- `submitButton: HTMLButtonElement` – кнопка отправки
- `errorsSpan: HTMLElement` – элемент для отображения ошибок
- `events: EventEmitter` – брокер событий

Методы:
- `render(data?: { payment?: TPayment; address?: string; errors?: Partial<Record<keyof IBuyer, string>> }): HTMLElement` – отображает форму
- `setValid(isValid: boolean): void` – устанавливает состояние кнопки
- `showErrors(errors: string[]): void` – отображает ошибки
- `clear(): void` – очищает форму

Генерируемые события:
- `order:payment-select` – при выборе способа оплаты (передаётся `{ payment: TPayment }`)
- `order:address-change` – при изменении адреса (передаётся `{ address: string }`)
- `order:submit` – при отправке формы

**Класс `ContactsForm`** – форма контактов (email и телефон).

Конструктор:
- `constructor(template: HTMLTemplateElement, events: EventEmitter)` – принимает шаблон и брокер событий.

Поля:
- `container: HTMLElement` – корневой элемент формы
- `emailInput: HTMLInputElement` – поле ввода email
- `phoneInput: HTMLInputElement` – поле ввода телефона
- `submitButton: HTMLButtonElement` – кнопка отправки
- `errorsSpan: HTMLElement` – элемент для отображения ошибок
- `events: EventEmitter` – брокер событий

Методы:
- `render(data?: { email?: string; phone?: string; errors?: Partial<Record<keyof IBuyer, string>> }): HTMLElement` – отображает форму
- `setValid(isValid: boolean): void` – устанавливает состояние кнопки
- `showErrors(errors: string[]): void` – отображает ошибки
- `clear(): void` – очищает форму

Генерируемые события:
- `contacts:email-change` – при изменении email (передаётся `{ email: string }`)
- `contacts:phone-change` – при изменении телефона (передаётся `{ phone: string }`)
- `contacts:submit` – при отправке формы

**Класс `SuccessView`** – окно успешного оформления заказа.

Конструктор:
- `constructor(template: HTMLTemplateElement, events: EventEmitter)` – принимает шаблон и брокер событий.

Поля:
- `container: HTMLElement` – корневой элемент
- `description: HTMLElement` – элемент с описанием (сумма списания)
- `button: HTMLButtonElement` – кнопка закрытия
- `events: EventEmitter` – брокер событий

Методы:
- `render(total: number): HTMLElement` – отображает окно успеха
- `setTotal(total: number): void` – устанавливает сумму

Генерируемые события:
- `success:close` – при клике на кнопку закрытия
