import { describe, it, expect, beforeEach } from "vitest";
import { form } from "../core/form";

function mount(node: HTMLElement) {
  document.body.appendChild(node);
}

function createValidForm() {
  const formEl = document.createElement("form");

  const labelEl = document.createElement("label");
  const inputEl = document.createElement("input");
  const spanEl = document.createElement("span");

  inputEl.type = "text";
  inputEl.name = "test";
  inputEl.id = "test-input";

  labelEl.htmlFor = inputEl.id;
  labelEl.textContent = "Test";

  spanEl.id = "test-error";
  inputEl.setAttribute("aria-describedby", spanEl.id);

  formEl.appendChild(labelEl);
  formEl.appendChild(inputEl);

  return { formEl, inputEl, labelEl, spanEl };
}

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("form() — тексты ошибок", () => {
  it("ошибка: отсутствует name у input", () => {
    const { formEl, inputEl, spanEl } = createValidForm();
    inputEl.removeAttribute("name");

    mount(formEl);
    mount(spanEl);

    expect(() => form(formEl)).toThrowError(
      "У каждого поля ввода должно быть указано имя (name)."
    );
  });

  it("ошибка: отсутствует label", () => {
    const { formEl, labelEl, spanEl } = createValidForm();
    formEl.removeChild(labelEl);

    mount(formEl);
    mount(spanEl);

    expect(() => form(formEl)).toThrowError(
      "Поле ввода должно быть связано хотя бы с одним label."
    );
  });

  it("ошибка: отсутствует aria-describedby", () => {
    const { formEl, inputEl, spanEl } = createValidForm();
    inputEl.removeAttribute("aria-describedby");

    mount(formEl);
    mount(spanEl);

    expect(() => form(formEl)).toThrowError(
      "Поле ввода должно содержать атрибут aria-describedby."
    );
  });

  it("ошибка: aria-describedby указывает на несуществующий span", () => {
    const { formEl } = createValidForm();

    mount(formEl);
    // span намеренно НЕ добавляем

    expect(() => form(formEl)).toThrowError(
      "Не найден элемент span, связанный через aria-describedby."
    );
  });

  it("ошибка: field() — поле с таким именем не найдено", () => {
    const { formEl, spanEl } = createValidForm();

    mount(formEl);
    mount(spanEl);

    const api = form(formEl);

    expect(() => api.field("unknown")).toThrowError(
      "Поле с указанным именем не найдено."
    );
  });
});