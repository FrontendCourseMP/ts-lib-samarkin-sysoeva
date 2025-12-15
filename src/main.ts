import * as s from "./core";
import "./styles.css";

function submitLog(tag: string) {
  return (data: FormData) => {
    console.log(tag, Object.fromEntries(data.entries()));
  };
}

const registerElement =
  document.querySelector<HTMLFormElement>("#register-form");
if (!registerElement) throw new Error("Форма регистрации не найдена");

const registerForm = s.form(registerElement);

registerForm
  .field("email")
  .email()
  .required("Укажи email.");

registerForm
  .field("password")
  .string()
  .required("Введите пароль.")
  .min("Пароль должен быть не короче 6 символов.")
  .max("Пароль должен быть не длиннее 32 символов.");

registerForm
  .field("age")
  .number()
  .required("Укажи возраст.")
  .min("Минимальный возраст — 18.")
  .max("Максимальный возраст — 99.");

registerForm.validate(submitLog("REGISTER"));

const loginElement =
  document.querySelector<HTMLFormElement>("#login-form");
if (!loginElement) throw new Error("Форма авторизации не найдена");

const loginForm = s.form(loginElement);

loginForm
  .field("email")
  .email()
  .required("Введите email.");

loginForm
  .field("password")
  .string()
  .required("Введите пароль.")
  .min("Пароль должен быть не короче 6 символов.");

loginForm.validate(submitLog("LOGIN"));

const feedbackElement =
  document.querySelector<HTMLFormElement>("#feedback-form");
if (!feedbackElement) throw new Error("Форма обратной связи не найдена");

const feedbackForm = s.form(feedbackElement);

feedbackForm
  .field("name")
  .string()
  .required("Введите имя.")
  .min("Имя слишком короткое.")
  .max("Имя слишком длинное.");

feedbackForm
  .field("email")
  .email()
  .required("Введите email.");

feedbackForm
  .field("code")
  .string()
  .required("Укажите код заявки.")
  .pattern("Формат: ABC-123.");

feedbackForm.validate(submitLog("FEEDBACK"));