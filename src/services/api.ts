import axios from "axios";

import { tokenService } from "./tokenService";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = tokenService.recuperaToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (errore) => Promise.reject(errore),
);

api.interceptors.response.use(
  (risposta) => risposta,
  (errore) => {
    if (errore.response?.status === 401) {
      tokenService.rimuoviToken();
    }

    return Promise.reject(errore);
  },
);

export default api;