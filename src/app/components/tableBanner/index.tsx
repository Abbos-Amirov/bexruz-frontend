import React, { useEffect, useState } from "react";
import TableRestaurantRoundedIcon from "@mui/icons-material/TableRestaurantRounded";
import { useHistory } from "react-router-dom";
import WaiterService, { WaiterTableOrder } from "../../services/WaiterService";
import { useWaiter } from "../../context/WaiterContext";
import { useGlobals } from "../../hooks/useGlobals";
import { useLanguage } from "../../context/LanguageContext";
import { CURRENCY_SYMBOL } from "../../../lib/config";
import "../../../css/waiter.css";

const formatTime = (value: string) => {
  const d = new Date(value);
  return isNaN(d.getTime())
    ? ""
    : `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

/** Menyu tepasida: qaysi stol uchun buyurtma olinyapti va unga avval nima berilgan */
export default function TableBanner() {
  const { table } = useWaiter();
  const { orderBulder } = useGlobals();
  const { t } = useLanguage();
  const history = useHistory();
  const [orders, setOrders] = useState<WaiterTableOrder[]>([]);

  useEffect(() => {
    if (!table) {
      setOrders([]);
      return;
    }
    let alive = true;
    new WaiterService()
      .getTableOrders(table._id)
      .then((data) => alive && setOrders(data))
      .catch((err) => console.log("getTableOrders:", err));
    return () => {
      alive = false;
    };
  }, [table, orderBulder]);

  if (!table) {
    return (
      <div className="table-banner is-empty">
        <span>{t("selectTableFirst")}</span>
        <button type="button" className="table-banner-btn primary" onClick={() => history.push("/tables")}>
          {t("chooseTable")}
        </button>
      </div>
    );
  }

  const total = orders.reduce((s, o) => s + (o.orderTotal || 0), 0);

  return (
    <div className="table-banner">
      <div className="table-banner-head">
        <div className="table-banner-icon">
          <TableRestaurantRoundedIcon />
        </div>
        <div className="table-banner-text">
          <span className="table-banner-kicker">{t("orderingFor")}</span>
          <span className="table-banner-table">
            {t("table")} {table.tableNumber}
          </span>
        </div>
        <button type="button" className="table-banner-btn" onClick={() => history.push("/tables")}>
          {t("changeTable")}
        </button>
      </div>

      <details className="table-banner-orders" open={orders.length > 0 && orders.length <= 2}>
        <summary>
          <span>{t("currentOrders")}</span>
          <span className="table-banner-count">
            {orders.length > 0 ? `${orders.length} · ${CURRENCY_SYMBOL}${total.toLocaleString("en-US")}` : "0"}
          </span>
        </summary>
        {orders.length === 0 ? (
          <p className="table-banner-none">{t("noCurrentOrders")}</p>
        ) : (
          <ul>
            {orders.map((o) => (
              <li key={o._id}>
                <span className="table-banner-time">{formatTime(o.createdAt)}</span>
                <span className="table-banner-items">
                  {o.items.map((i) => `${i.productName} ×${i.itemQuantity}`).join(", ")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </details>
    </div>
  );
}
