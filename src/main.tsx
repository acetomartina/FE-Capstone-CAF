import React from "react";
import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
} from "react-router-dom";

import {
  Provider,
} from "react-redux";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/tokens.css";
import "./styles/global.css";

import App from "./App";

import {
  store,
} from "./app/store";

import {
  CookieConsentProvider,
} from "./components/common/CookieConsent/CookieConsentContext";

ReactDOM.createRoot(
  document.getElementById(
    "root",
  )!,
).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <CookieConsentProvider>
          <App />
        </CookieConsentProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);