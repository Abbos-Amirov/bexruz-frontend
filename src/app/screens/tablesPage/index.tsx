import React, { useCallback, useEffect, useState } from "react";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { useHistory } from "react-router-dom";
import WaiterService, { WaiterTable } from "../../services/WaiterService";
import { useWaiter } from "../../context/WaiterContext";
import { useLanguage } from "../../context/LanguageContext";
import "../../../css/waiter.css";

const REFRESH_MS = 15000;

const statusKey: Record<WaiterTable["tableStatus"], string> = {
  AVAILABLE: "statusAvailable",
  OCCUPIED: "statusOccupied",
  CLEANING: "statusCleaning",
};

export default function TablesPage() {
  const { table: selected, setTable } = useWaiter();
  const { t } = useLanguage();
  const history = useHistory();
  const [tables, setTables] = useState<WaiterTable[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setTables(await new WaiterService().getTables());
    } catch (err) {
      console.log("getTables:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => clearInterval(id);
  }, [load]);

  const choose = (item: WaiterTable) => {
    setTable({ _id: item._id, tableNumber: item.tableNumber });
    history.push("/products");
  };

  return (
    <div className="waiter-tables-page">
      <div className="waiter-tables-head">
        <div>
          <span className="waiter-kicker">{t("tables")}</span>
          <h1 className="waiter-title">{t("chooseTable")}</h1>
          <p className="waiter-subtitle">{t("chooseTableHint")}</p>
        </div>
        <button type="button" className="waiter-refresh" onClick={load} aria-label={t("refresh")}>
          <RefreshRoundedIcon />
        </button>
      </div>

      {!loading && tables.length === 0 ? (
        <div className="waiter-empty">{t("noTables")}</div>
      ) : (
        <div className="waiter-tables-grid">
          {tables.map((item) => (
            <button
              type="button"
              key={item._id}
              className={`waiter-table-tile status-${item.tableStatus.toLowerCase()}${
                selected?._id === item._id ? " is-selected" : ""
              }`}
              onClick={() => choose(item)}
            >
              <span className="waiter-table-label">{t("table")}</span>
              <span className="waiter-table-number">{item.tableNumber}</span>
              <span className="waiter-table-status">{t(statusKey[item.tableStatus] ?? "statusAvailable")}</span>
              {item.activeOrders > 0 && (
                <span
                  className="waiter-table-badge"
                  title={`${item.activeOrders} ${t("ordersShort")}`}
                  aria-label={`${item.activeOrders} ${t("ordersShort")}`}
                >
                  {item.activeOrders}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
