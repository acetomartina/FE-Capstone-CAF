import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

/* Smonta il DOM dopo ogni test: senza questo i componenti montati
   restano appesi e le query trovano nodi di test precedenti. */
afterEach(() => {
  cleanup();
});
