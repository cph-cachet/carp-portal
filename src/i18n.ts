import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import backend from "i18next-http-backend";

i18n
  .use(backend)
  .use(initReactI18next)
  .init({
    supportedLngs: ["en", "da"],
    lng: "en",
    fallbackLng: "en",
    ns: ["common", "error", "deployment"],
    backend: {
      loadPath: "./locales/{{lng}}/{{ns}}.json",
    },
  });

export default i18n;
