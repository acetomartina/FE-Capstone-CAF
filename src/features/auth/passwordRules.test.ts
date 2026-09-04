import { describe, expect, it } from "vitest";

import {
  LUNGHEZZA_MASSIMA_PASSWORD,
  LUNGHEZZA_MINIMA_PASSWORD,
  validaNuovaPassword,
} from "./passwordRules";

const passwordLunga = (lunghezza: number): string =>
  `Aa1!${"x".repeat(lunghezza - 4)}`;

describe("validaNuovaPassword", () => {
  describe("lunghezza", () => {
    it("rifiuta la stringa vuota", () => {
      const esito = validaNuovaPassword("", "");

      expect(esito.valida).toBe(false);
      expect(esito.errore).toContain("almeno 8 caratteri");
    });

    it("rifiuta un carattere sotto il minimo, anche se complessa", () => {
      const esito = validaNuovaPassword("Pasw0r!", "Pasw0r!");

      expect("Pasw0r!").toHaveLength(LUNGHEZZA_MINIMA_PASSWORD - 1);
      expect(esito.valida).toBe(false);
    });

    it("accetta esattamente il minimo", () => {
      const esito = validaNuovaPassword("Passw0r!", "Passw0r!");

      expect("Passw0r!").toHaveLength(LUNGHEZZA_MINIMA_PASSWORD);
      expect(esito).toEqual({ valida: true, errore: null });
    });

    it("accetta esattamente il massimo", () => {
      const password = passwordLunga(LUNGHEZZA_MASSIMA_PASSWORD);

      expect(password).toHaveLength(72);
      expect(validaNuovaPassword(password, password).valida).toBe(true);
    });

    it("rifiuta un carattere sopra il massimo", () => {
      const password = passwordLunga(LUNGHEZZA_MASSIMA_PASSWORD + 1);
      const esito = validaNuovaPassword(password, password);

      expect(password).toHaveLength(73);
      expect(esito.valida).toBe(false);
      expect(esito.errore).toContain("72");
    });
  });

  describe("complessità", () => {
    const mancanti: ReadonlyArray<[string, string]> = [
      ["password1!", "manca la maiuscola"],
      ["PASSWORD1!", "manca la minuscola"],
      ["Password!!", "manca la cifra"],
      ["Password11", "manca il carattere speciale"],
    ];

    it.each(mancanti)("rifiuta %s perché %s", (password) => {
      const esito = validaNuovaPassword(password, password);

      expect(esito.valida).toBe(false);
      expect(esito.errore).toContain("maiuscola");
    });

    it("accetta una password con tutte e quattro le classi", () => {
      expect(validaNuovaPassword("Password1!", "Password1!")).toEqual({
        valida: true,
        errore: null,
      });
    });

    it("considera speciale una lettera accentata, come la regex del backend", () => {
      expect(validaNuovaPassword("Passwordà1", "Passwordà1").valida).toBe(
        true,
      );
    });

    it("accetta lo spazio come carattere speciale", () => {
      expect(validaNuovaPassword("Passw0rd 1", "Passw0rd 1").valida).toBe(
        true,
      );
    });

    it("rifiuta una password con a capo finale, come il '.' di Java", () => {
      expect(validaNuovaPassword("Password1!\n", "Password1!\n").valida).toBe(
        false,
      );
    });
  });

  describe("coincidenza", () => {
    it("rifiuta due password valide ma diverse", () => {
      const esito = validaNuovaPassword("Password1!", "Password2!");

      expect(esito.valida).toBe(false);
      expect(esito.errore).toBe("Le due password non coincidono.");
    });

    it("distingue maiuscole e minuscole nel confronto", () => {
      expect(validaNuovaPassword("Password1!", "password1!").valida).toBe(
        false,
      );
    });
  });

  describe("precedenza degli errori", () => {
    it("segnala la lunghezza prima della mancata coincidenza", () => {
      const esito = validaNuovaPassword("Aa1!", "tutt'altro");

      expect(esito.errore).toContain("almeno 8 caratteri");
    });

    it("segnala la complessità prima della mancata coincidenza", () => {
      const esito = validaNuovaPassword("passwordlunga", "tutt'altro");

      expect(esito.errore).toContain("maiuscola");
    });

    it("restituisce un solo errore per volta", () => {
      const esito = validaNuovaPassword("abc", "xyz");

      expect(esito.errore).not.toBeNull();
      expect(esito.errore?.split(".").filter(Boolean)).toHaveLength(1);
    });
  });
});
