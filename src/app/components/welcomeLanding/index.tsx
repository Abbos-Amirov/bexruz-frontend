import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { Language } from "../../../lib/translations";
import "../../../css/welcome-landing.css";

const WELCOME_STORAGE_KEY = "zomin_welcome_completed";

const languages: { code: Language; label: string }[] = [
  { code: "uz", label: "O'zbek" },
  { code: "ko", label: "한국어" },
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
];

// "Choose language" in each of the 4 languages
const chooseLangTexts: Record<Language, string> = {
  uz: "Tilni tanlang",
  ko: "언어를 선택하세요",
  en: "Choose your language",
  ru: "Выберите язык",
};

export function isWelcomeCompleted(): boolean {
  return localStorage.getItem(WELCOME_STORAGE_KEY) === "true";
}

export function setWelcomeCompleted(): void {
  localStorage.setItem(WELCOME_STORAGE_KEY, "true");
}

export default function WelcomeLanding() {
  const history = useHistory();
  const { setLanguage } = useLanguage();
  const [phase, setPhase] = useState<"welcome" | "language">("welcome");

  const handleContinue = () => {
    setPhase("language");
  };

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setWelcomeCompleted();
    history.push("/products");
  };

  return (
    <div className="welcome-landing">
      <div className="welcome-landing-content">
        {phase === "welcome" ? (
          <>
            <div className="welcome-logo">
              <img src="/icons/zomin.svg" alt="Client" />
            </div>
            <h1 className="welcome-title-uz">
              Xush kelibsiz!
            </h1>
            <p className="welcome-subtitle-uz">
              Siz oshxonasiga xush kelibsiz
            </p>
            <h2 className="welcome-title-en">Welcome!</h2>
            <p className="welcome-subtitle-en">
            Welcome to  Restaurant
            </p>
            <button className="welcome-continue-btn" onClick={handleContinue}>
              Davom etish / Continue
            </button>
          </>
        ) : (
          <>
            <div className="welcome-lang-title">
              {languages.map(({ code }) => (
                <div key={code} className="welcome-lang-title-item">
                  {chooseLangTexts[code]}
                </div>
              ))}
            </div>
            <div className="welcome-lang-buttons">
              {languages.map(({ code, label }) => (
                <button
                  key={code}
                  className="welcome-lang-btn"
                  onClick={() => handleLanguageSelect(code)}
                >
                  {label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
