// src/index.tsx
import React, { useMemo } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./app/App";
import reportWebVitals from "./reportWebVitals";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { getTheme } from "./app/MaterialTheme";
import { BrowserRouter as Router } from "react-router-dom";
import "./css/index.css";
import ContextProvider from "./app/context/ContextProvider";
import { LanguageProvider } from "./app/context/LanguageContext";
import { DarkModeProvider, useDarkMode } from "./app/context/DarkModeContext";
import { WaiterProvider } from "./app/context/WaiterContext";
import "./css/bexruz-theme.css";

function ThemedApp() {
  const { darkMode } = useDarkMode();
  const theme = useMemo(() => getTheme(darkMode ? "dark" : "light"), [darkMode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  );
}

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ContextProvider>
        <LanguageProvider>
        <DarkModeProvider>
        <WaiterProvider>
          <ThemedApp />
        </WaiterProvider>
        </DarkModeProvider>
        </LanguageProvider>
      </ContextProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
