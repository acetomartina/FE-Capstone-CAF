import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css";

import App from "./App";
import { store } from "./app/store";

const elementoRoot = document.getElementById("root");

if (!elementoRoot) {
  throw new Error("Elemento con id 'root' non trovato.");
}

createRoot(elementoRoot).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);