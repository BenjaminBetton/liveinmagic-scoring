import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      add_team: "Add a team",
      team_name: "Team name",
      athlete1: "Athlete 1",
      athlete2: "Athlete 2",
      category: "Category",
      heat: "Heat",
      add: "Add",
      athletes: "Athletes",
      delete: "Delete"
    }
  },
  fr: {
    translation: {
      add_team: "Ajouter une équipe",
      team_name: "Nom de l'équipe",
      athlete1: "Athlète 1",
      athlete2: "Athlète 2",
      category: "Catégorie",
      heat: "Heat",
      add: "Ajouter",
      athletes: "Athlètes",
      delete: "Supprimer"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "fr",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;