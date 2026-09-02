import { MemoryRouter } from "react-router-dom";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ResetPasswordForm from "./ResetPasswordForm";
import { authService } from "../authService";

vi.mock("../authService", () => ({
  authService: {
    richiediRecuperoPassword: vi.fn(),
    resetPassword: vi.fn(),
    attivaAccount: vi.fn(),
  },
}));

const resetPassword = vi.mocked(authService.resetPassword);
const attivaAccount = vi.mocked(authService.attivaAccount);

const TOKEN = "token-valido-123";
const PASSWORD_BUONA = "Password1!";

/*
 * Renderizziamo sempre ResetPasswordForm dentro MemoryRouter,
 * perché il componente contiene elementi <Link> di React Router.
 */
const renderForm = (token?: string) =>
  render(
    <MemoryRouter>
      <ResetPasswordForm token={token} />
    </MemoryRouter>,
  );

const renderFormAttivazione = (token?: string) =>
  render(
    <MemoryRouter>
      <ResetPasswordForm token={token} modalita="attivazione" />
    </MemoryRouter>,
  );

/*
 * Riproduce solo ciò che il componente legge davvero
 * di un errore Axios:
 * - flag riconosciuto da isAxiosError
 * - status HTTP
 * - corpo della risposta
 */
const erroreAxios = (status?: number, data?: unknown) => {
  const errore = new Error("errore simulato") as Error & {
    isAxiosError: boolean;
    response?: {
      status: number;
      data?: unknown;
    };
  };

  errore.isAxiosError = true;

  if (status !== undefined) {
    errore.response = {
      status,
      data,
    };
  }

  return errore;
};

/* Il testo del pulsante cambia con la modalità: il default resta quello
   del reset, così i test già scritti non si accorgono della differenza. */
const compila = async (
  password: string,
  conferma: string,
  etichettaInvio: RegExp = /reimposta la password/i,
) => {
  const utente = userEvent.setup();

  await utente.type(
    screen.getByLabelText("Nuova password"),
    password,
  );

  await utente.type(
    screen.getByLabelText("Conferma password"),
    conferma,
  );

  await utente.click(
    screen.getByRole("button", {
      name: etichettaInvio,
    }),
  );
};

const ATTIVA = /attiva il tuo account/i;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ResetPasswordForm", () => {
  describe("token mancante", () => {
    it("mostra l'errore e non renderizza il form", () => {
      renderForm();

      expect(
        screen.getByRole("alert"),
      ).toHaveTextContent(
        /non è valido, è scaduto oppure è già stato usato/i,
      );

      expect(
        screen.queryByLabelText("Nuova password"),
      ).not.toBeInTheDocument();
    });
  });

  describe("validazione prima della rete", () => {
    it("blocca le password non coincidenti senza chiamare il server", async () => {
      renderForm(TOKEN);

      await compila(
        PASSWORD_BUONA,
        "Password2!",
      );

      expect(
        screen.getByRole("alert"),
      ).toHaveTextContent(
        "Le due password non coincidono.",
      );

      expect(
        resetPassword,
      ).not.toHaveBeenCalled();
    });

    it("blocca una password troppo debole senza chiamare il server", async () => {
      renderForm(TOKEN);

      await compila(
        "password",
        "password",
      );

      expect(
        screen.getByRole("alert"),
      ).toHaveTextContent(/maiuscola/i);

      expect(
        resetPassword,
      ).not.toHaveBeenCalled();
    });
  });

  describe("percorso felice", () => {
    it("invia token e password, poi mostra la conferma", async () => {
      resetPassword.mockResolvedValue({});

      renderForm(TOKEN);

      await compila(
        PASSWORD_BUONA,
        PASSWORD_BUONA,
      );

      expect(
        resetPassword,
      ).toHaveBeenCalledExactlyOnceWith(
        TOKEN,
        PASSWORD_BUONA,
      );

      expect(
        await screen.findByText(
          "Password aggiornata",
        ),
      ).toBeVisible();
    });

    it("a conferma avvenuta non resta nessun campo password in pagina", async () => {
      resetPassword.mockResolvedValue({});

      renderForm(TOKEN);

      await compila(
        PASSWORD_BUONA,
        PASSWORD_BUONA,
      );

      expect(
        await screen.findByRole("status"),
      ).toBeInTheDocument();

      expect(
        screen.queryByLabelText(
          "Nuova password",
        ),
      ).not.toBeInTheDocument();

      expect(
        screen.queryByRole("alert"),
      ).not.toBeInTheDocument();
    });
  });

  describe("errori del server", () => {
    it("tratta un 400 senza validationErrors come token bruciato", async () => {
      resetPassword.mockRejectedValue(
        erroreAxios(400, {
          message: "ko",
        }),
      );

      renderForm(TOKEN);

      await compila(
        PASSWORD_BUONA,
        PASSWORD_BUONA,
      );

      expect(
        await screen.findByRole("alert"),
      ).toHaveTextContent(
        /richiedine uno nuovo/i,
      );
    });

    it("tratta un 400 con validationErrors come password rifiutata", async () => {
      resetPassword.mockRejectedValue(
        erroreAxios(400, {
          validationErrors: {
            password: "troppo debole",
          },
        }),
      );

      renderForm(TOKEN);

      await compila(
        PASSWORD_BUONA,
        PASSWORD_BUONA,
      );

      expect(
        await screen.findByRole("alert"),
      ).toHaveTextContent(
        /non rispetta i requisiti richiesti/i,
      );
    });

    it("tratta il 500 come guasto tecnico, non come token invalido", async () => {
      resetPassword.mockRejectedValue(
        erroreAxios(500),
      );

      renderForm(TOKEN);

      await compila(
        PASSWORD_BUONA,
        PASSWORD_BUONA,
      );

      expect(
        await screen.findByRole("alert"),
      ).toHaveTextContent(
        /problema tecnico/i,
      );
    });

    it("tratta l'assenza di risposta come guasto tecnico", async () => {
      resetPassword.mockRejectedValue(
        erroreAxios(),
      );

      renderForm(TOKEN);

      await compila(
        PASSWORD_BUONA,
        PASSWORD_BUONA,
      );

      expect(
        await screen.findByRole("alert"),
      ).toHaveTextContent(
        /problema tecnico/i,
      );
    });

    it("non mostra mai il messaggio grezzo del backend", async () => {
      resetPassword.mockRejectedValue(
        erroreAxios(400, {
          message:
            "utente non trovato: mario.rossi",
        }),
      );

      renderForm(TOKEN);

      await compila(
        PASSWORD_BUONA,
        PASSWORD_BUONA,
      );

      expect(
        await screen.findByRole("alert"),
      ).toBeInTheDocument();

      expect(
        document.body,
      ).not.toHaveTextContent(
        /mario\.rossi/,
      );
    });
  });

  describe("interazione", () => {
    it("l'occhio scopre entrambi i campi insieme", async () => {
      const utente = userEvent.setup();

      renderForm(TOKEN);

      const nuova =
        screen.getByLabelText(
          "Nuova password",
        );

      const conferma =
        screen.getByLabelText(
          "Conferma password",
        );

      expect(
        nuova,
      ).toHaveAttribute(
        "type",
        "password",
      );

      expect(
        conferma,
      ).toHaveAttribute(
        "type",
        "password",
      );

      await utente.click(
        screen.getByRole("button", {
          name: "Mostra le password",
        }),
      );

      expect(
        nuova,
      ).toHaveAttribute(
        "type",
        "text",
      );

      expect(
        conferma,
      ).toHaveAttribute(
        "type",
        "text",
      );
    });

    it("disabilita il bottone durante l'invio, così non parte due volte", async () => {
      let sblocca:
        | (() => void)
        | undefined;

      resetPassword.mockReturnValue(
        new Promise((risolvi) => {
          sblocca = () =>
            risolvi({});
        }),
      );

      renderForm(TOKEN);

      await compila(
        PASSWORD_BUONA,
        PASSWORD_BUONA,
      );

      const bottone =
        screen.getByRole("button", {
          name: /salvataggio/i,
        });

      expect(
        bottone,
      ).toBeDisabled();

      expect(
        resetPassword,
      ).toHaveBeenCalledTimes(1);

      sblocca?.();

      expect(
        await screen.findByText(
          "Password aggiornata",
        ),
      ).toBeVisible();
    });
  });

  /*
   * L'attivazione è la stessa schermata del reset con un altro endpoint
   * dietro: i test qui verificano che il bivio sia quello giusto, perché
   * sbagliarlo significa mandare il token di invito all'API sbagliata.
   */
  describe("modalità attivazione", () => {
    it("chiama attivaAccount e non resetPassword", async () => {
      attivaAccount.mockResolvedValue({});

      renderFormAttivazione(TOKEN);

      await compila(
        PASSWORD_BUONA,
        PASSWORD_BUONA,
        ATTIVA,
      );

      expect(attivaAccount).toHaveBeenCalledWith(
        TOKEN,
        PASSWORD_BUONA,
      );

      expect(resetPassword).not.toHaveBeenCalled();
    });

    it("a token mancante spiega di contattare la sede", () => {
      renderFormAttivazione();

      expect(
        screen.getByRole("alert"),
      ).toHaveTextContent(/contatta la sede/i);
    });

    it("conferma l'attivazione, non l'aggiornamento password", async () => {
      attivaAccount.mockResolvedValue({});

      renderFormAttivazione(TOKEN);

      await compila(
        PASSWORD_BUONA,
        PASSWORD_BUONA,
        ATTIVA,
      );

      expect(
        await screen.findByRole("status"),
      ).toHaveTextContent(/account attivato/i);
    });

    it("su token bruciato non rimanda a «Password dimenticata»", async () => {
      attivaAccount.mockRejectedValue(
        erroreAxios(400, { message: "ko" }),
      );

      renderFormAttivazione(TOKEN);

      await compila(
        PASSWORD_BUONA,
        PASSWORD_BUONA,
        ATTIVA,
      );

      const avviso = await screen.findByRole("alert");

      expect(avviso).toHaveTextContent(
        /link di attivazione non è valido/i,
      );

      expect(avviso).not.toHaveTextContent(
        /password dimenticata/i,
      );
    });
  });
});
