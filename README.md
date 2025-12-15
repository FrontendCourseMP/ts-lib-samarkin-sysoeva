# form-validator

Минимальная TypeScript-библиотека для валидации HTML-форм поверх нативного
`ValidityState`.

Без фреймворков.  
Без зависимостей.  
Без магии.

Только DOM, стандартные HTML-атрибуты и явные ошибки.

Библиотека **не модифицирует разметку** и **не подменяет браузерную валидацию** —
она связывает нативные ограничения (`required`, `min`, `max`, `pattern`)
с пользовательскими сообщениями и строгой проверкой структуры формы.

---

## Требования к разметке

Каждый `input` внутри формы **обязан**:

- иметь атрибут `name`
- быть связан минимум с одним `<label>`
- иметь атрибут `aria-describedby`
- `aria-describedby` должен указывать на существующий `<span>`

Пример корректного поля:

```html
<label for="email">Email</label>
<input
  id="email"
  name="email"
  type="email"
  required
  aria-describedby="email-error"
/>
<span id="email-error"></span>
```

Если любое из условий нарушено — `form()` выбросит ошибку **при инициализации**.

---

## Использование

```ts
import { form } from "./form";

const formElement =
  document.querySelector<HTMLFormElement>("#login-form")!;

const validator = form(formElement);

validator
  .field("email")
  .email()
  .required("Введите email.");

validator
  .field("password")
  .string()
  .required("Введите пароль.")
  .min("Минимум 6 символов.");

validator.validate((data) => {
  console.log(Object.fromEntries(data.entries()));
});
```

---

## API

### `form(formElement: HTMLFormElement)`

Инициализирует валидацию формы и проверяет корректность разметки.

### Ошибки инициализации

- `У каждого поля ввода должно быть указано имя (name).`
- `Поле ввода должно быть связано хотя бы с одним label.`
- `Поле ввода должно содержать атрибут aria-describedby.`
- `Не найден элемент span, связанный через aria-describedby.`

Возвращает объект с методами `field` и `validate`.

---

### `field(name: string): Input`

Возвращает объект `Input`, связанный с `input[name]`.

Ошибка:

- `Поле с указанным именем не найдено.`

---

### `validate(handler: (formData: FormData) => void): void`

Подписывается на событие `submit` формы:

- отменяет стандартную отправку
- вызывает `validate()` у всех зарегистрированных `Input`
- вызывает `handler` **только если форма валидна**

---

## Input

`Input` — цепочный интерфейс для настройки сообщений валидации.

Все методы возвращают `this`.

---

### `string()`

Ожидает `input[type="text"]`.

Ошибка:

- `Ожидался input типа text.`

---

### `number()`

Ожидает `input[type="number"]`.

Ошибка:

- `Ожидался input типа number.`

---

### `email()`

Ожидает `input[type="email"]`.

Ошибка:

- `Ожидался input типа email.`

---

### `required(message: string)`

Сообщение для ошибки `valueMissing`.

Ошибка:

- `Для этого поля не задан атрибут required.`

---

### `min(message: string)`

- для `number` и `range` используется `min`
- для остальных типов используется `minLength`

Ошибки:

- `Для этого поля не задан атрибут min.`
- `Для этого поля не задан атрибут minLength.`

---

### `max(message: string)`

- для `number` и `range` используется `max`
- для остальных типов используется `maxLength`

Ошибки:

- `Для этого поля не задан атрибут max.`
- `Для этого поля не задан атрибут maxLength.`

---

### `pattern(message: string)`

Сообщение для ошибки `patternMismatch`.

Ошибка:

- `Для этого поля не задан атрибут pattern.`

---

### `validate(): boolean`

Проверяет `ValidityState` поля:

- при ошибке пишет сообщение в `span`, указанный в `aria-describedby`
- возвращает `false`
- при успехе очищает сообщение и возвращает `true`

Если сообщение для ошибки не задано, используется дефолтное:

```
Проверьте корректность введённых данных.
```

---

## Генерация типов

```bash
tsc --declaration --emitDeclarationOnly --outDir types
```

---

## Тесты

Тесты написаны на `vitest` с использованием `jsdom`.

Проверяется:

- корректность разметки формы
- тексты выбрасываемых ошибок
- контракт публичного API

```bash
npm run test
```

---

## Принципы

- никаких кастомных форматов
- никаких зависимостей
- никаких скрытых правил
- только HTML, DOM и стандартная браузерная валидация
