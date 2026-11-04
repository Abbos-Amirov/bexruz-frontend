import React, { FormEvent, useState } from "react";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import { useHistory } from "react-router-dom";
import WaiterService from "../../services/WaiterService";
import { useWaiter } from "../../context/WaiterContext";
import { useLanguage } from "../../context/LanguageContext";
import "../../../css/waiter.css";

/** PIN harf va raqamdan iborat (katta-kichik harf farqlanmaydi) */
export default function WaiterLoginPage() {
  const { login } = useWaiter();
  const { t } = useLanguage();
  const history = useHistory();
  const [pin, setPin] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const value = pin.trim();
    if (!value || loading) return;
    setLoading(true);
    try {
      const token = await new WaiterService().login(value);
      login(token);
      history.replace("/tables");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Error");
      setPin("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="waiter-login">
      <form className="waiter-login-card" onSubmit={submit}>
        <img src="/icons/zomin.svg" alt="BEXRUZ" className="waiter-login-logo" />
        <h1 className="waiter-login-title">{t("waiterLogin")}</h1>
        <p className="waiter-login-hint">{t("pinHint")}</p>

        <div className={`waiter-pin-field${error ? " has-error" : ""}`}>
          <input
            type={show ? "text" : "password"}
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError("");
            }}
            placeholder={t("enterPin")}
            aria-label={t("enterPin")}
            autoComplete="off"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            maxLength={32}
            autoFocus
          />
          <button
            type="button"
            className="waiter-pin-toggle"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide" : "Show"}
          >
            {show ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
          </button>
        </div>
        <div className="waiter-login-error" role="alert">{error}</div>

        <button type="submit" className="waiter-login-submit" disabled={!pin.trim() || loading}>
          {t("login")}
        </button>
      </form>
    </div>
  );
}
