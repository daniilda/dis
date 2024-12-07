import i18next from "i18next";
import { zodI18nMap } from "zod-i18n-map";
import translation from "zod-i18n-map/locales/ru/zod.json";
import { z } from "zod";

export const applyZodRussianLanguage = () => {
  i18next.init({
    lng: "ru",
    resources: {
      ru: { zod: translation },
    },
  });
  z.setErrorMap(zodI18nMap);
};
