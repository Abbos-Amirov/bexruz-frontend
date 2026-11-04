import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { WAITER_TOKEN_KEY } from "../services/WaiterService";

const TABLE_KEY = "bexruz_waiter_table";

export interface SelectedTable {
  _id: string;
  tableNumber: string;
}

interface WaiterContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  table: SelectedTable | null;
  setTable: (table: SelectedTable | null) => void;
}

const WaiterContext = createContext<WaiterContextType | null>(null);

const readTable = (): SelectedTable | null => {
  try {
    const raw = localStorage.getItem(TABLE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export function WaiterProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(WAITER_TOKEN_KEY));
  const [table, setTableState] = useState<SelectedTable | null>(readTable);

  const login = useCallback((value: string) => {
    localStorage.setItem(WAITER_TOKEN_KEY, value);
    setToken(value);
  }, []);

  const setTable = useCallback((value: SelectedTable | null) => {
    if (value) localStorage.setItem(TABLE_KEY, JSON.stringify(value));
    else localStorage.removeItem(TABLE_KEY);
    setTableState(value);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(WAITER_TOKEN_KEY);
    setToken(null);
    setTable(null);
  }, [setTable]);

  // Token muddati tugasa (401) — PIN ekraniga qaytaramiz
  useEffect(() => {
    const id = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        const url: string = err?.config?.url ?? "";
        if (err?.response?.status === 401 && url.includes("/waiter/") && !url.endsWith("/waiter/login")) {
          logout();
        }
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(id);
  }, [logout]);

  return (
    <WaiterContext.Provider value={{ token, login, logout, table, setTable }}>
      {children}
    </WaiterContext.Provider>
  );
}

export function useWaiter() {
  const ctx = useContext(WaiterContext);
  if (!ctx) throw new Error("useWaiter must be used within WaiterProvider");
  return ctx;
}
