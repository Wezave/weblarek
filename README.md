
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
- `setData(data: Partial<IBuyer>): void` – сохраняет одно или несколько полей данных покупателя (частичное обновление), генерирует `buyer:changed`.
- `getData(): IBuyer` – возвращает все сохранённые данные (если поле не заполнено, возвращается пустая строка или `null`).
- `clear(): void` – сбрасывает все данные в начальное состояние, генерирует `buyer:changed`.
- `validate(): IBuyerValidate` – проверяет валидность полей. Возвращает объект с ошибками, где ключ – имя поля, значение – текст ошибки. Поле считается валидным, если оно не пустое (для строк – не пустая строка после `trim()`, для `payment` – выбран вариант). Если ошибок нет, объект пуст.

### Слой коммуникации

#### Класс LarekApi
**Назначение:** инкапсулирует логику взаимодействия с API сервера. Использует композицию с классом `Api`, который выполняет HTTP-запросы.

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
- Действия пользователя передаются через колбэки (`actions`), которые вызывают события через `EventEmitter`

#### Компоненты представления

**Класс `Header`** – управление шапкой (счётчик корзины).

Конструктор:
- `constructor(container: HTMLElement)`

Поля:
- `counter: HTMLElement` – элемент счётчика

Методы:
- `setCount(count: number): void` – обновляет счётчик

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

**Класс `CatalogItem`** – карточка товара в каталоге.

Конструктор:
- `constructor(container: HTMLElement, actions: { onClick: (id: string) => void })`

Поля:
- `container: HTMLElement` – корневой элемент карточки
- `categoryElement: HTMLElement` – элемент категории
- `titleElement: HTMLElement` – элемент заголовка
- `imageElement: HTMLImageElement` – элемент изображения
- `priceElement: HTMLElement` – элемент цены

Методы:
- `render(data?: IProduct): HTMLElement` – отображает карточку

**Класс `CatalogView`** – отображение списка товаров (галерея).

Конструктор:
- `constructor(container: HTMLElement)`

Поля:
- `container: HTMLElement` – контейнер галереи

Методы:
- `setItems(items: HTMLElement[]): void` – заменяет содержимое галереи переданными карточками
- `render(data?: { items: HTMLElement[] }): HTMLElement` – отображает список

**Класс `ProductPreview`** – детальный просмотр товара.

Конструктор:
- `constructor(container: HTMLElement, actions: { onToggle: (id: string) => void })`

Поля:
- `container: HTMLElement` – корневой элемент
- `imageElement: HTMLImageElement`
- `categoryElement: HTMLElement`
- `titleElement: HTMLElement`
- `descriptionElement: HTMLElement`
- `priceElement: HTMLElement`
- `buttonElement: HTMLButtonElement`

Методы:
- `setButtonState(inCart: boolean): void` – меняет текст кнопки в зависимости от наличия товара в корзине
- `render(data?: IProduct): HTMLElement` – отображает карточку

**Класс `CartItem`** – элемент корзины.

Конструктор:
- `constructor(container: HTMLElement, actions: { onRemove: (id: string) => void })`

Поля:
- `container: HTMLElement`
- `indexElement: HTMLElement`
- `titleElement: HTMLElement`
- `priceElement: HTMLElement`
- `deleteButton: HTMLButtonElement`

Методы:
- `render(data?: { item: IProduct; index: number }): HTMLElement` – отображает элемент корзины

**Класс `CartView`** – отображение корзины.

Конструктор:
- `constructor(container: HTMLElement, events: EventEmitter)`

Поля:
- `list: HTMLElement` – контейнер списка товаров
- `priceElement: HTMLElement` – элемент общей стоимости
- `button: HTMLButtonElement` – кнопка оформления
- `events: EventEmitter` – брокер событий

Методы:
- `setItems(items: HTMLElement[]): void` – заполняет список товаров
- `setTotal(total: number): void` – обновляет общую стоимость
- `render(data?: { items: HTMLElement[]; total: number }): HTMLElement` – отображает корзину

Генерируемые события:
- `order:start` – при клике на кнопку «Оформить»

**Класс `OrderForm`** – форма заказа (способ оплаты и адрес).

Конструктор:
- `constructor(container: HTMLFormElement, events: EventEmitter)`

Поля:
- `cardButton: HTMLButtonElement`
- `cashButton: HTMLButtonElement`
- `addressInput: HTMLInputElement`
- `submitButton: HTMLButtonElement`
- `errorsSpan: HTMLElement`
- `events: EventEmitter`

Методы:
- `setPayment(payment: TPayment): void` – устанавливает активную кнопку оплаты
- `setAddress(address: string): void` – заполняет поле адреса
- `setValid(isValid: boolean): void` – активирует/деактивирует кнопку отправки
- `showErrors(errors: string[]): void` – отображает ошибки
- `setErrors(errors: IBuyerValidate): void` – обновляет состояние формы по ошибкам
- `clear(): void` – очищает поля и ошибки
- `render(data?: { payment?: TPayment; address?: string; errors?: IBuyerValidate }): HTMLElement`

Генерируемые события:
- `order:payment-select` – при выборе способа оплаты
- `order:address-change` – при изменении адреса
- `order:submit` – при отправке формы

**Класс `ContactsForm`** – форма контактов (email и телефон).

Конструктор:
- `constructor(container: HTMLFormElement, events: EventEmitter)`

Поля:
- `emailInput: HTMLInputElement`
- `phoneInput: HTMLInputElement`
- `submitButton: HTMLButtonElement`
- `errorsSpan: HTMLElement`
- `events: EventEmitter`

Методы:
- `setEmail(email: string): void`
- `setPhone(phone: string): void`
- `setValid(isValid: boolean): void`
- `showErrors(errors: string[]): void`
- `setErrors(errors: IBuyerValidate): void`
- `clear(): void`
- `render(data?: { email?: string; phone?: string; errors?: IBuyerValidate }): HTMLElement`

Генерируемые события:
- `contacts:email-change`
- `contacts:phone-change`
- `contacts:submit`

**Класс `SuccessView`** – окно успешного оформления заказа.

Конструктор:
- `constructor(container: HTMLElement, events: EventEmitter)`

Поля:
- `description: HTMLElement`
- `button: HTMLButtonElement`

Методы:
- `setTotal(total: number): void`
- `render(data?: { total: number }): HTMLElement`

Генерируемые события:
- `success:close` – при клике на кнопку закрытия

### Система событий

Все события генерируются через `EventEmitter` и обрабатываются в презентере. События позволяют компонентам обмениваться информацией без прямого обращения друг к другу.

#### События каталога

**`catalog:item-selected`**
- Генерируется: `CatalogItem` при клике на карточку товара.
- Данные: `{ id: string }` – идентификатор выбранного товара.
- Назначение: сохранить выбранный товар в модели `Catalog`.

**`catalog:selected-changed`**
- Генерируется: `Catalog` при изменении выбранного товара.
- Назначение: открыть модальное окно с детальным просмотром товара.

**`catalog:changed`**
- Генерируется: `Catalog` при сохранении массива товаров.
- Назначение: обновить отображение каталога.

#### События корзины

**`cart:toggle`**
- Генерируется: `ProductPreview` при клике на кнопку.
- Данные: `{ id: string }` – идентификатор товара.
- Назначение: добавить/удалить товар в/из корзины.

**`cart:remove`**
- Генерируется: `CartItem` при клике на кнопку удаления.
- Данные: `{ id: string }`.
- Назначение: удалить товар из корзины.

**`cart:open`**
- Генерируется: кликом по иконке корзины в шапке.
- Данные: `{}`.
- Назначение: открыть модальное окно корзины.

**`cart:changed`**
- Генерируется: `Cart` при любом изменении списка товаров.
- Назначение: обновить счётчик корзины и отображение корзины (если она открыта).

#### События форм заказа

**`order:start`**
- Генерируется: `CartView` при клике на кнопку «Оформить».
- Данные: `{}`.
- Назначение: открыть форму заказа.

**`order:payment-select`**
- Генерируется: `OrderForm` при выборе способа оплаты.
- Данные: `{ payment: 'cash' | 'card' }`.
- Назначение: сохранить способ оплаты в модели `Buyer`.

**`order:address-change`**
- Генерируется: `OrderForm` при вводе адреса.
- Данные: `{ address: string }`.
- Назначение: сохранить адрес в модели `Buyer`.

**`order:submit`**
- Генерируется: `OrderForm` при отправке формы.
- Данные: `{}`.
- Назначение: открыть форму контактов.

**`contacts:email-change`**
- Генерируется: `ContactsForm` при вводе email.
- Данные: `{ email: string }`.
- Назначение: сохранить email в модели `Buyer`.

**`contacts:phone-change`**
- Генерируется: `ContactsForm` при вводе телефона.
- Данные: `{ phone: string }`.
- Назначение: сохранить телефон в модели `Buyer`.

**`contacts:submit`**
- Генерируется: `ContactsForm` при отправке формы.
- Данные: `{}`.
- Назначение: отправить заказ на сервер.

#### События модального окна

**`modal:open`**
- Генерируется: `Modal` при открытии.
- Данные: `{}`.
- Назначение: опциональное

**`modal:close`**
- Генерируется: `Modal` при закрытии.
- Данные: `{}`.
- Назначение: сбросить состояние форм.

**`success:close`**
- Генерируется: `SuccessView` при клике на кнопку.
- Данные: `{}`.
- Назначение: закрыть модальное окно, очистить корзину и данные покупателя.

### Презентер

Презентер реализован непосредственно в файле `main.ts`. Он связывает модели и представления, обрабатывает все события.

#### Принципы работы презентера

- Презентер не генерирует события, только обрабатывает их.
- Презентер подписывается на события от моделей данных и представлений.
- При обработке события презентер вызывает соответствующие методы моделей или представлений.
- Представление перерисовывается только при обработке события от модели данных.
- Презентер не хранит глобальных переменных, все экземпляры классов – константы.

#### Обрабатываемые события

**От моделей данных:**
- `catalog:changed` – обновить каталог.
- `catalog:selected-changed` – открыть предпросмотр товара.
- `cart:changed` – обновить счётчик корзины и отображение корзины (если она открыта).
- `buyer:changed` – обновить текущую открытую форму (если есть).

**От представлений:**
- `catalog:item-selected` – сохранить выбранный товар в модели.
- `cart:toggle` – добавить/удалить товар в корзине.
- `cart:remove` – удалить товар из корзины.
- `cart:open` – открыть корзину.
- `order:start` – открыть форму заказа.
- `order:payment-select` – сохранить способ оплаты.
- `order:address-change` – сохранить адрес.
- `order:submit` – открыть форму контактов.
- `contacts:email-change` – сохранить email.
- `contacts:phone-change` – сохранить телефон.
- `contacts:submit` – отправить заказ.
- `modal:close` – сбросить состояние форм.
- `success:close` – закрыть модальное окно, очистить корзину и данные покупателя.
