import React, { useCallback, useEffect, useState } from "react";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import { useHistory } from "react-router-dom";
import WaiterService from "../../services/WaiterService";
import { useWaiter } from "../../context/WaiterContext";
import { useLanguage } from "../../context/LanguageContext";
import "../../../css/waiter.css";

const MAX_PIN = 8;
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "back"];

export default function WaiterLoginPage() {
  const { login } = useWaiter();
  const { t } = useLanguage();
  const history = useHistory();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const press = useCallback(
    (key: string) => {
      if (loading) return;
      setError("");
      if (key === "back") setPin((p) => p.slice(0, -1));
      else if (key === "clear") setPin("");
      else setPin((p) => (p.length < MAX_PIN ? p + key : p));
    },
    [loading]
  );

  const submit = useCallback(async () => {
    if (!pin || loading) return;
    setLoading(true);
    try {
      const token = await new WaiterService().login(pin);
      login(token);
      history.replace("/tables");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Error");
      setPin("");
    } finally {
      setLoading(false);
    }
  }, [pin, loading, login, history]);

  // Kompyuter klaviaturasidan ham kiritish mumkin
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) press(e.key);
      else if (e.key === "Backspace") press("back");
      else if (e.key === "Enter") submit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [press, submit]);

  return (
    <div className="waiter-login">
      <div className="waiter-login-card">
        <img src="/icons/zomin.svg" alt="BEXRUZ" className="waiter-login-logo" />
        <h1 className="waiter-login-title">{t("waiterLogin")}</h1>
        <p className="waiter-login-hint">{t("pinHint")}</p>

        <div className={`waiter-pin-dots${error ? " has-error" : ""}`} aria-label={t("enterPin")}>
          {Array.from({ length: Math.max(4, pin.length) }).map((_, i) => (
            <span key={i} className={i < pin.length ? "filled" : ""} />
          ))}
        </div>
        <div className="waiter-login-error" role="alert">{error}</div>

        <div className="waiter-keypad">
          {KEYS.map((key) => (
            <button
              key={key}
              type="button"
              className={`waiter-key${key === "clear" || key === "back" ? " is-action" : ""}`}
              onClick={() => press(key)}
              aria-label={key === "back" ? "Backspace" : key === "clear" ? "Clear" : key}
            >
              {key === "back" ? <BackspaceOutlinedIcon /> : key === "clear" ? "C" : key}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="waiter-login-submit"
          disabled={!pin || loading}
          onClick={submit}
        >
          {t("login")}
        </button>
      </div>
    </div>
  );
}
