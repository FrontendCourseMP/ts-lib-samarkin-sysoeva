import Input from "./Input";

export function form(formElement: HTMLFormElement) {
  const inputElements = formElement.querySelectorAll("input");
  const inputsByName = new Map<string, HTMLInputElement>();
  const inputInstances: Input[] = [];

  for (const inputElement of inputElements) {
    if (!inputElement.name) {
      throw new Error("У каждого поля ввода должно быть указано имя (name).");
    }

    if (!inputElement.labels || inputElement.labels.length === 0) {
      throw new Error("Поле ввода должно быть связано хотя бы с одним label.");
    }

    const describedById = inputElement.getAttribute("aria-describedby");

    if (!describedById) {
      throw new Error(
        "Поле ввода должно содержать атрибут aria-describedby."
      );
    }

    if (!document.querySelector(`span#${describedById}`)) {
      throw new Error(
        "Не найден элемент span, связанный через aria-describedby."
      );
    }

    inputsByName.set(inputElement.name, inputElement);
  }

  return {
    field(fieldName: string) {
      const inputElement = inputsByName.get(fieldName);

      if (!inputElement) {
        throw new Error("Поле с указанным именем не найдено.");
      }

      const inputInstance = new Input(inputElement);
      inputInstances.push(inputInstance);

      return inputInstance;
    },

    validate(handler: (formData: FormData) => void) {
      formElement.addEventListener("submit", (event) => {
        event.preventDefault();

        const isFormValid = inputInstances.every((input) =>
          input.validate()
        );

        if (isFormValid) {
          const formData = new FormData(formElement);
          handler(formData);
        }
      });
    },
  };
}
