
### Модели данных

#### Класс Catalog
**Назначение:** хранение каталога товаров и выбранного для детального просмотра товара.

**Конструктор:**  
`constructor(events: EventEmitter)` – принимает брокер событий.

**Поля:**
- `private products: IProduct[]` – массив всех товаров.
- `private selectedProduct: IProduct | null` – выбранный товар (для детального отображения).

**Методы:**
- `setProducts(products: IProduct[]): void` – сохраняет массив товаров, генерирует событие `catalog:changed`.
- `getProducts(): IProduct[]` – возвращает массив всех товаров.
- `getProductById(id: string): IProduct | undefined` – возвращает товар по его идентификатору или `undefined`, если товар не найден.
- `setSelectedProduct(product: IProduct): void` – сохраняет товар для подробного отображения, генерирует событие `catalog:selected-changed`.
- `getSelectedProduct(): IProduct | null` – возвращает сохранённый выбранный товар.

#### Класс Cart
**Назначение:** хранение товаров, добавленных пользователем в корзину.

**Конструктор:**  
`constructor(events: EventEmitter)` – принимает брокер событий.

**Поля:**
- `private items: IProduct[]` – массив товаров в корзине.

**Методы:**
- `getItems(): IProduct[]` – возвращает массив товаров в корзине.
- `addItem(product: IProduct): void` – добавляет товар в корзину (если ещё не добавлен), генерирует `cart:changed`.
- `removeItem(productId: string): void` – удаляет товар из корзины по `id`, генерирует `cart:changed`.
- `clear(): void` – полностью очищает корзину, генерирует `cart:changed`.
- `getTotal(): number` – вычисляет общую стоимость товаров в корзине.
- `getCount(): number` – возвращает количество товаров в корзине.
- `isInCart(productId: string): boolean` – проверяет, находится ли товар с указанным `id` в корзине.

#### Класс Buyer
**Назначение:** хранение и валидация данных покупателя при оформлении заказа.

**Конструктор:**  
`constructor(events: EventEmitter)` – принимает брокер событий.

**Поля:**
- `private payment: TPayment | null` – выбранный способ оплаты.
- `private email: string` – email покупателя.
- `private phone: string` – телефон покупателя.
- `private address: string` – адрес покупателя.

**Методы:**
- `setData(data: Partial<IBuyer>): void` – сохраняет одно или несколько полей данных покупателя (частичное обновление), генерирует `buyer:changed` и `buyer:validation-changed`.
- `getData(): IBuyer` – возвращает все сохранённые данные (если поле не заполнено, возвращается пустая строка или `null`).
- `clear(): void` – сбрасывает все данные в начальное состояние, генерирует события.
- `validate(): IBuyerValidate` – проверяет валидность полей. Возвращает объект с ошибками, где ключ – имя поля, значение – текст ошибки. Поле считается валидным, если оно не пустое (для строк – не пустая строка после `trim()`, для `payment` – выбран вариант). Если ошибок нет, объект пуст.

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
- `constructor(container: HTMLElement, events: EventEmitter)`

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
- `constructor(container: HTMLElement, events: EventEmitter)`

Поля:
- `container: HTMLElement` – корневой элемент карточки
- `category: HTMLElement` – элемент категории
- `title: HTMLElement` – элемент заголовка
- `image: HTMLImageElement` – элемент изображения
- `price: HTMLElement` – элемент цены
- `events: EventEmitter` – брокер событий
- `productId: string` – идентификатор товара (устанавливается при рендере)

Методы:
- `setData(data: IProduct): void` – заполняет карточку данными товара
- `render(data?: IProduct): HTMLElement` – отображает карточку

Генерируемые события:
- `catalog:item-selected` – при клике на карточку (передаётся `{ id: string }`)

**Класс `CatalogView`** – отображение списка товаров (галерея).

Конструктор:
- `constructor(container: HTMLElement, cardTemplate: HTMLTemplateElement, events: EventEmitter)`

Поля:
- `container: HTMLElement` – контейнер галереи
- `events: EventEmitter` – брокер событий
- `cardTemplate: HTMLTemplateElement` – шаблон карточки
- `itemsMap: Map<string, CatalogItem>` – карта созданных карточек

Методы:
- `render(data?: { items: IProduct[] }): HTMLElement` – отображает список товаров
- `clear(): void` – очищает галерею

**Класс `ProductPreview`** – детальный просмотр товара.

Конструктор:
- `constructor(container: HTMLElement, events: EventEmitter)`

Поля:
- `container: HTMLElement` – корневой элемент
- `image: HTMLImageElement` – элемент изображения
- `category: HTMLElement` – элемент категории
- `title: HTMLElement` – элемент заголовка
- `description: HTMLElement` – элемент описания
- `price: HTMLElement` – элемент цены
- `button: HTMLButtonElement` – кнопка
- `events: EventEmitter` – брокер событий
- `productId: string` – идентификатор текущего товара

Методы:
- `setData(data: IProduct): void` – заполняет данными товара
- `render(data?: IProduct): HTMLElement` – отображает карточку
- `setButtonState(inCart: boolean): void` – меняет состояние кнопки

Генерируемые события:
- `cart:toggle` – при клике на кнопку (передаётся `{ id: string }`)

**Класс `CartItem`** – элемент корзины.

Конструктор:
- `constructor(container: HTMLElement, events: EventEmitter)`

Поля:
- `container: HTMLElement` – корневой элемент
- `indexElement: HTMLElement` – элемент порядкового номера
- `title: HTMLElement` – элемент заголовка
- `price: HTMLElement` – элемент цены
- `deleteButton: HTMLButtonElement` – кнопка удаления
- `events: EventEmitter` – брокер событий
- `productId: string` – идентификатор товара

Методы:
- `setData(data: IProduct, index: number): void` – заполняет данными
- `render(data?: { item: IProduct; index: number }): HTMLElement` – отображает элемент

Генерируемые события:
- `cart:remove` – при клике на кнопку удаления (передаётся `{ id: string }`)

**Класс `CartView`** – отображение корзины.

Конструктор:
- `constructor(template: HTMLTemplateElement, itemTemplate: HTMLTemplateElement, events: EventEmitter)`

Поля:
- `container: HTMLElement` – корневой элемент
- `list: HTMLElement | null` – контейнер для списка товаров (`.basket__list`)
- `priceElement: HTMLElement | null` – элемент общей стоимости
- `button: HTMLButtonElement | null` – кнопка оформления заказа
- `events: EventEmitter` – брокер событий
- `itemTemplate: HTMLTemplateElement` – шаблон элемента корзины
- `itemsMap: Map<string, CartItem>` – карта элементов корзины

Методы:
- `render(data?: { items: IProduct[]; total: number }): HTMLElement` – отображает корзину, при пустом списке показывает сообщение «Корзина пуста»
- `clear(): void` – очищает список

Генерируемые события:
- `order:start` – при клике на кнопку оформления заказа

**Класс `OrderForm`** – форма заказа (способ оплаты и адрес).

Конструктор:
- `constructor(container: HTMLFormElement, events: EventEmitter)`

Поля:
- `container: HTMLFormElement` – корневой элемент формы
- `cardButton: HTMLButtonElement` – кнопка оплаты картой
- `cashButton: HTMLButtonElement` – кнопка оплаты наличными
- `addressInput: HTMLInputElement` – поле ввода адреса
- `submitButton: HTMLButtonElement` – кнопка «Далее»
- `errorsSpan: HTMLElement` – элемент для отображения ошибок
- `events: EventEmitter` – брокер событий

Методы:
- `render(data?: { payment?: TPayment; address?: string; errors?: IBuyerValidate }): HTMLElement`
- `setValid(isValid: boolean): void` – устанавливает состояние кнопки
- `showErrors(errors: string[]): void` – отображает ошибки
- `clear(): void` – очищает форму

Генерируемые события:
- `order:payment-select` – при выборе способа оплаты (передаётся `{ payment: TPayment }`)
- `order:address-change` – при изменении адреса (передаётся `{ address: string }`)
- `order:submit` – при отправке формы

**Класс `ContactsForm`** – форма контактов (email и телефон).

Конструктор:
- `constructor(container: HTMLFormElement, events: EventEmitter)`

Поля:
- `container: HTMLFormElement` – корневой элемент формы
- `emailInput: HTMLInputElement` – поле ввода email
- `phoneInput: HTMLInputElement` – поле ввода телефона
- `submitButton: HTMLButtonElement` – кнопка «Оплатить»
- `errorsSpan: HTMLElement` – элемент для отображения ошибок
- `events: EventEmitter` – брокер событий

Методы:
- `render(data?: { email?: string; phone?: string; errors?: IBuyerValidate }): HTMLElement`
- `setValid(isValid: boolean): void` – устанавливает состояние кнопки
- `showErrors(errors: string[]): void` – отображает ошибки
- `clear(): void` – очищает форму

Генерируемые события:
- `contacts:email-change` – при изменении email (передаётся `{ email: string }`)
- `contacts:phone-change` – при изменении телефона (передаётся `{ phone: string }`)
- `contacts:submit` – при отправке формы

**Класс `SuccessView`** – окно успешного оформления заказа.

Конструктор:
- `constructor(container: HTMLElement, events: EventEmitter)`

Поля:
- `container: HTMLElement` – корневой элемент
- `description: HTMLElement` – элемент с описанием (сумма списания)
- `button: HTMLButtonElement` – кнопка закрытия
- `events: EventEmitter` – брокер событий

Методы:
- `render(data?: { total: number }): HTMLElement` – отображает окно успеха
- `setTotal(total: number): void` – устанавливает сумму

Генерируемые события:
- `success:close` – при клике на кнопку закрытия

### Система событий

Все события генерируются через `EventEmitter` и обрабатываются в презентере.

#### События каталога

**`catalog:item-selected`**
- Генерируется: `CatalogItem` при клике на карточку товара.
- Данные: `{ id: string }` – идентификатор выбранного товара.
- Назначение: открыть модальное окно с детальным просмотром товара.

#### События корзины

**`cart:toggle`**
- Генерируется: `ProductPreview` при клике на кнопку.
- Данные: `{ id: string }` – идентификатор товара.
- Назначение: добавить товар в корзину, если его там нет, или удалить, если есть.

**`cart:remove`**
- Генерируется: `CartItem` при клике на кнопку удаления товара.
- Данные: `{ id: string }` – идентификатор удаляемого товара.
- Назначение: удалить товар из модели корзины и обновить отображение.

**`order:start`**
- Генерируется: `CartView` при клике на кнопку «Оформить».
- Данные: `{}` (без данных).
- Назначение: открыть форму заказа (способ оплаты и адрес).

**`cart:open`**
- Генерируется: кликом по иконке корзины в шапке.
- Данные: `{}`.
- Назначение: открыть модальное окно корзины.

#### События формы заказа

**`order:payment-select`**
- Генерируется: `OrderForm` при клике на кнопку выбора способа оплаты.
- Данные: `{ payment: 'cash' | 'card' }` – выбранный способ оплаты.
- Назначение: сохранить способ оплаты в модели `Buyer` и проверить валидность формы.

**`order:address-change`**
- Генерируется: `OrderForm` при вводе адреса в текстовое поле.
- Данные: `{ address: string }` – введённый адрес.
- Назначение: сохранить адрес в модели `Buyer` и проверить валидность формы.

**`order:submit`**
- Генерируется: `OrderForm` при отправке формы (клик на кнопку «Далее»).
- Данные: `{ payment: TPayment, address: string }` – данные формы заказа.
- Назначение: открыть форму контактов (email и телефон).

#### События формы контактов

**`contacts:email-change`**
- Генерируется: `ContactsForm` при вводе email в текстовое поле.
- Данные: `{ email: string }` – введённый email.
- Назначение: сохранить email в модели `Buyer` и проверить валидность формы.

**`contacts:phone-change`**
- Генерируется: `ContactsForm` при вводе телефона в текстовое поле.
- Данные: `{ phone: string }` – введённый телефон.
- Назначение: сохранить телефон в модели `Buyer` и проверить валидность формы.

**`contacts:submit`**
- Генерируется: `ContactsForm` при отправке формы (клик на кнопку «Оплатить»).
- Данные: `{ email: string, phone: string }` – данные формы контактов.
- Назначение: отправить заказ на сервер через `LarekApi`.

#### События модального окна

**`modal:open`**
- Генерируется: `Modal` при открытии модального окна.
- Данные: `{}`.
- Назначение: уведомить другие компоненты об открытии модального окна (при необходимости).

**`modal:close`**
- Генерируется: `Modal` при закрытии модального окна (клик на крестик или на оверлей).
- Данные: `{}`.
- Назначение: очистить временные данные, вернуться к предыдущему состоянию.

**`success:close`**
- Генерируется: `SuccessView` при клике на кнопку «За новыми покупками!».
- Данные: `{}`.
- Назначение: закрыть модальное окно, очистить корзину и данные покупателя.

#### События моделей данных

**`catalog:changed`**
- Генерируется: `Catalog` при сохранении массива товаров.
- Данные: `{ products: IProduct[] }` – массив всех товаров.
- Назначение: обновить отображение каталога.

**`catalog:selected-changed`**
- Генерируется: `Catalog` при сохранении выбранного товара.
- Данные: `{ selectedProduct: IProduct | null }` – выбранный товар.
- Назначение: открыть детальный просмотр товара.

**`cart:changed`**
- Генерируется: `Cart` при добавлении, удалении или очистке товаров.
- Данные: `{ items: IProduct[], total: number, count: number }` – текущее состояние корзины.
- Назначение: обновить отображение корзины и счётчик в шапке.

**`buyer:changed`**
- Генерируется: `Buyer` при изменении любого поля данных покупателя.
- Данные: `IBuyer` – текущие данные покупателя.
- Назначение: обновить отображение форм.

**`buyer:validation-changed`**
- Генерируется: `Buyer` при изменении валидности данных.
- Данные: `IBuyerValidate` – объект с ошибками валидации.
- Назначение: включить/выключить кнопку отправки формы, показать ошибки.

### Презентер

Презентер реализован непосредственно в основном скрипте `main.ts`. Он связывает модели и представления, обрабатывает все события.

#### Принципы работы презентера

- Презентер не генерирует события, только обрабатывает их
- Презентер подписывается на события от моделей данных и представлений
- При обработке события презентер вызывает соответствующие методы моделей или представлений
- Представление перерисовывается только при обработке события от модели данных или при открытии модального окна

#### Обрабатываемые события

**От моделей данных:**
- `catalog:changed` – отобразить каталог товаров на главной странице
- `cart:changed` – обновить счётчик в шапке и перерисовать корзину (если открыта)
- `buyer:validation-changed` – обновить состояние кнопок и ошибки в формах

**От представлений:**
- `catalog:item-selected` – открыть модальное окно с детальным просмотром товара
- `cart:toggle` – добавить или удалить товар из корзины
- `cart:remove` – удалить товар из корзины
- `cart:open` – открыть модальное окно корзины
- `order:start` – открыть форму заказа
- `order:payment-select` – сохранить выбранный способ оплаты в модели `Buyer`
- `order:address-change` – сохранить адрес в модели `Buyer`
- `order:submit` – открыть форму контактов
- `contacts:email-change` – сохранить email в модели `Buyer`
- `contacts:phone-change` – сохранить телефон в модели `Buyer`
- `contacts:submit` – отправить заказ на сервер
- `modal:close` – очистить временные ссылки на формы
- `success:close` – закрыть модальное окно, очистить корзину и данные покупателя