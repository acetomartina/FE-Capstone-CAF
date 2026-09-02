import { useState, type FormEvent } from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FiAlertCircle,
  FiArrowRight,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
} from "react-icons/fi";

import { authService } from "../authService";
import type { StatoOperazione } from "../authTypes";
import {
  LUNGHEZZA_MINIMA_PASSWORD,
  validaNuovaPassword,
} from "../passwordRules";

/*
 * Reset e attivazione sono lo stesso gesto — scegliere una password
 * presentando un token monouso — verso due endpoint diversi. Cambia
 * solo cosa raccontiamo all'utente: chi resetta ha già un account,
 * chi attiva sta entrando per la prima volta.
 */
type ModalitaPassword = "reset" | "attivazione";

const MESSAGGIO_TECNICO =
  "Non è stato possibile reimpostare la password per un problema tecnico. Riprova tra qualche minuto.";

const MESSAGGIO_PASSWORD_RIFIUTATA =
  "La password non rispetta i requisiti richiesti. Scegline un'altra.";

interface TestiModalita {
  tokenNonValido: string;
  etichettaInvio: string;
  etichettaInvioInCorso: string;
  titoloConferma: string;
  testoConferma: string;
}

const TESTI: Record<ModalitaPassword, TestiModalita> = {
  reset: {
    tokenNonValido:
      "Il link di recupero non è valido, è scaduto oppure è già stato usato. Richiedine uno nuovo dalla pagina «Password dimenticata».",
    etichettaInvio: "Reimposta la password",
    etichettaInvioInCorso: "Salvataggio…",
    titoloConferma: "Password aggiornata",
    testoConferma:
      "Da adesso puoi accedere alla tua area personale con la nuova password.",
  },

  attivazione: {
    tokenNonValido:
      "Il link di attivazione non è valido, è scaduto oppure è già stato usato. Contatta la sede per riceverne uno nuovo.",
    etichettaInvio: "Attiva il tuo account",
    etichettaInvioInCorso: "Attivazione…",
    titoloConferma: "Account attivato",
    testoConferma:
      "La tua Area Cliente è pronta: accedi con la tua email e la password appena scelta.",
  },
};

const REQUISITI =
  `Almeno ${LUNGHEZZA_MINIMA_PASSWORD} caratteri, ` +
  "con una maiuscola, una minuscola, un numero e un carattere speciale.";

/*
 * Il backend valorizza validationErrors quando fallisce
 * la validazione della nuova password.
 *
 * Questo permette di distinguere una password rifiutata
 * da un token non valido, scaduto oppure già utilizzato.
 */
const haErroriDiValidazione = (
  dati: unknown,
): boolean =>
  typeof dati === "object" &&
  dati !== null &&
  "validationErrors" in dati &&
  Boolean(
    (dati as { validationErrors?: unknown })
      .validationErrors,
  );

const messaggioPerErrore = (
  errore: unknown,
  testi: TestiModalita,
): string => {
  if (!axios.isAxiosError(errore)) {
    return MESSAGGIO_TECNICO;
  }

  const stato = errore.response?.status;

  if (stato === undefined || stato >= 500) {
    return MESSAGGIO_TECNICO;
  }

  if (
    haErroriDiValidazione(
      errore.response?.data,
    )
  ) {
    return MESSAGGIO_PASSWORD_RIFIUTATA;
  }

  return testi.tokenNonValido;
};

interface ResetPasswordFormProps {
  token?: string;

  /** Default "reset": è il caso già esistente, e non deve cambiare. */
  modalita?: ModalitaPassword;
}

const ResetPasswordForm = ({
  token,
  modalita = "reset",
}: ResetPasswordFormProps) => {
  const testi = TESTI[modalita];

  const [password, setPassword] =
    useState("");

  const [conferma, setConferma] =
    useState("");

  const [
    mostraPassword,
    setMostraPassword,
  ] = useState(false);

  const [stato, setStato] =
    useState<StatoOperazione>("inattivo");

  const [errore, setErrore] =
    useState<string | null>(null);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    /*
     * Senza token il form non viene renderizzato.
     * La guardia mantiene comunque il tipo
     * correttamente ristretto.
     */
    if (!token) {
      return;
    }

    const esito = validaNuovaPassword(
      password,
      conferma,
    );

    /*
     * Validazione prima della chiamata di rete:
     * una password già non valida lato client
     * non deve consumare inutilmente il token.
     */
    if (!esito.valida) {
      setStato("errore");
      setErrore(esito.errore);

      return;
    }

    setStato("invio");
    setErrore(null);

    try {
      if (modalita === "attivazione") {
        await authService.attivaAccount(
          token,
          password,
        );
      } else {
        await authService.resetPassword(
          token,
          password,
        );
      }

      setStato("completato");
    } catch (erroreChiamata) {
      setStato("errore");

      setErrore(
        messaggioPerErrore(
          erroreChiamata,
          testi,
        ),
      );
    }
  };

  if (!token) {
    return (
      <div
        className="password-alert"
        role="alert"
      >
        <span className="password-alert__icon">
          <FiAlertCircle aria-hidden="true" />
        </span>

        <p className="password-alert__text">
          {testi.tokenNonValido}
        </p>
      </div>
    );
  }

  if (stato === "completato") {
    return (
      <div
        className="password-note"
        role="status"
      >
        <span className="password-note__icon">
          <FiCheckCircle aria-hidden="true" />
        </span>

        <div className="password-note__text">
          <strong>{testi.titoloConferma}</strong>

          <p>{testi.testoConferma}</p>

          <Link
            to="/login"
            className="login-form__submit password-note__action"
          >
            <span>Vai all'accesso</span>

            <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    );
  }

  const etichettaToggle =
    mostraPassword
      ? "Nascondi le password"
      : "Mostra le password";

  return (
    <Form
      onSubmit={handleSubmit}
      className="login-form"
    >
      {stato === "errore" && errore && (
        <div
          className="password-alert"
          role="alert"
        >
          <span className="password-alert__icon">
            <FiAlertCircle aria-hidden="true" />
          </span>

          <p className="password-alert__text">
            {errore}
          </p>
        </div>
      )}

      <Form.Group
        className="login-form__group"
        controlId="nuovaPassword"
      >
        <Form.Label>
          Nuova password
        </Form.Label>

        <div className="login-form__field">
          <FiLock aria-hidden="true" />

          <Form.Control
            type={
              mostraPassword
                ? "text"
                : "password"
            }
            placeholder="Inserisci la nuova password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            autoComplete="new-password"
            disabled={stato === "invio"}
            required
          />

          <button
            type="button"
            className="login-form__password-toggle"
            onClick={() =>
              setMostraPassword(
                (valore) => !valore,
              )
            }
            aria-label={etichettaToggle}
            disabled={stato === "invio"}
          >
            {mostraPassword ? (
              <FiEyeOff aria-hidden="true" />
            ) : (
              <FiEye aria-hidden="true" />
            )}
          </button>
        </div>

        <p className="password-form__hint">
          {REQUISITI}
        </p>
      </Form.Group>

      <Form.Group
        className="login-form__group"
        controlId="confermaPassword"
      >
        <Form.Label>
          Conferma password
        </Form.Label>

        <div className="login-form__field">
          <FiLock aria-hidden="true" />

          <Form.Control
            type={
              mostraPassword
                ? "text"
                : "password"
            }
            placeholder="Ripeti la nuova password"
            value={conferma}
            onChange={(event) =>
              setConferma(event.target.value)
            }
            autoComplete="new-password"
            disabled={stato === "invio"}
            required
          />
        </div>
      </Form.Group>

      <Button
        type="submit"
        className="login-form__submit"
        disabled={stato === "invio"}
      >
        <span>
          {stato === "invio"
            ? testi.etichettaInvioInCorso
            : testi.etichettaInvio}
        </span>

        <FiCheckCircle aria-hidden="true" />
      </Button>
    </Form>
  );
};

export default ResetPasswordForm;
