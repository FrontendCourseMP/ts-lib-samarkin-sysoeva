class Input {
  private inputEl: HTMLInputElement;
  private errorTexts: Partial<Record<keyof ValidityState, string>> = {};

  constructor(inputEl: HTMLInputElement) {
    this.inputEl = inputEl;
  }

  string() {
    if (this.inputEl.type !== "text") {
      throw new Error("Ожидался input типа text.");
    }
    return this;
  }

  number() {
    if (this.inputEl.type !== "number") {
      throw new Error("Ожидался input типа number.");
    }
    return this;
  }

  email() {
    if (this.inputEl.type !== "email") {
      throw new Error("Ожидался input типа email.");
    }
    return this;
  }

  min(message: string) {
    if (["number", "range"].includes(this.inputEl.type)) {
      if (this.inputEl.min === "") {
        throw new Error("Для этого поля не задан атрибут min.");
      }
      this.errorTexts.rangeUnderflow = message;
    } else {
      if (this.inputEl.minLength === -1) {
        throw new Error("Для этого поля не задан атрибут minLength.");
      }
      this.errorTexts.tooShort = message;
    }

    return this;
  }

  max(message: string) {
    if (["number", "range"].includes(this.inputEl.type)) {
      if (this.inputEl.max === "") {
        throw new Error("Для этого поля не задан атрибут max.");
      }
      this.errorTexts.rangeOverflow = message;
    } else {
      if (this.inputEl.maxLength === -1) {
        throw new Error("Для этого поля не задан атрибут maxLength.");
      }
      this.errorTexts.tooLong = message;
    }

    return this;
  }

  pattern(message: string) {
    if (this.inputEl.pattern === "") {
      throw new Error("Для этого поля не задан атрибут pattern.");
    }

    this.errorTexts.patternMismatch = message;
    return this;
  }

  required(message: string) {
    if (this.inputEl.required === false) {
      throw new Error("Для этого поля не задан атрибут required.");
    }

    this.errorTexts.valueMissing = message;
    return this;
  }

  validate() {
    const describedById = this.inputEl.getAttribute("aria-describedby")!;
    const hintEl = document.querySelector<HTMLElement>(`#${describedById}`)!;

    for (const rule in this.inputEl.validity) {
      const isTriggered = this.inputEl.validity[rule as keyof ValidityState];

      if (rule === "valid" && isTriggered) {
        hintEl.textContent = "";
        return true;
      }

      if (isTriggered) {
        const text = this.errorTexts[rule as keyof ValidityState];
        hintEl.textContent = text || "Проверьте корректность введённых данных.";
        return false;
      }
    }

    return true;
  }
}

export default Input;
