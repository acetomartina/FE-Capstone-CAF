import { useState, type FormEvent } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import {
  FiAlertCircle,
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

const MESSAGGIO_TOKEN =
  "Il link di recupero non è valido, è scaduto oppure è già stato usato. Richiedine uno nuovo dalla pagina «Password dimenticata».";

const MESSAGGIO_TECNICO =
  "Non è stato possibile reimpostare la password per un problema tecnico. Riprova tra qualche minuto.";

const MESSAGGIO_PASSWORD_RIFIUTATA =
  "La password non rispetta i requisiti richiesti. Scegline un'altra.";

const REQUISITI = `Almeno ${LUNGHEZZA_MINIMA_PASSWORD} caratteri, con una maiuscola, una minuscola, un numero e un carattere speciale.`;

/* Il backend valorizza validationErrors solo quando fallisce la Bean
   Validation: è l'unico modo per distinguere "password rifiutata" da
   "token bruciato", che altrimenti sarebbero entrambi un 400. */
const haErroriDiValidazione = (dati: unknown): boolean =>
  typeof dati === "object" &&
  dati !== null &&
  "validationErrors" in dati &&
  Boolean((dati as { validationErrors?: unknown }).validationErrors);

const messaggioPerErrore = (errore: unknown): string => {
  if (!axios.isAxiosError(errore)) {
    return MESSAGGIO_TECNICO;
  }

  const stato = errore.response?.status;

  if (stato === undefined || stato >= 500) {
    return MESSAGGIO_TECNICO;
  }

  if (haErroriDiValidazione(errore.response?.data)) {
    return MESSAGGIO_PASSWORD_RIFIUTATA;
  }

  return MESSAGGIO_TOKEN;
};

interface ResetPasswordFormProps {
  token?: string;
}

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const [password, setPassword] = useState("");
  const [conferma, setConferma] = useState("");
  const [mostraPassword, setMostraPassword] = useState(false);
  const [stato, setStato] = useState<StatoOperazione>("inattivo");
  const [errore, setErrore] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    /* Senza token il form non viene nemmeno renderizzato: la guardia serve
       a stringere il tipo senza ricorrere a un cast. */
    if (!token) {
      return;
    }

    const esito = validaNuovaPassword(password, conferma);

    /* Validazione prima della rete: una password che sappiamo già
       sbagliata non deve consumare il token. */
    if (!esito.valida) {
      setStato("errore");
      setErrore(esito.errore);

      return;
    }

    setStato("invio");
    setErrore(null);

    try {
      await authService.resetPassword(token, password);

      setStato("completato");
    } catch (erroreChiamata) {
      setStato("errore");
      setErrore(messaggioPerErrore(erroreChiamata));
    }
  };

  if (!token) {
    return (
      <div className="password-alert" role="alert">
        <span className="password-alert__icon">
          <FiAlertCircle />
        </span>

        <p className="password-alert__text">{MESSAGGIO_TOKEN}</p>
      </div>
    );
  }

  if (stato === "completato") {
    return (
      <div className="password-note" role="status">
        <span className="password-note__icon">
          <FiCheckCircle />
        </span>

        <div className="password-note__text">
          <strong>Password aggiornata</strong>

          <p>
            Da adesso puoi accedere alla tua area personale con la nuova
            password.
          </p>
        </div>
      </div>
    );
  }

  const etichettaToggle = mostraPassword
    ? "Nascondi le password"
    : "Mostra le password";

  return (
    <Form onSubmit={handleSubmit} className="login-form">
      {stato === "errore" && errore && (
        <div className="password-alert" role="alert">
          <span className="password-alert__icon">
            <FiAlertCircle />
          </span>

          <p className="password-alert__text">{errore}</p>
        </div>
      )}

      <Form.Group className="login-form__group" controlId="nuovaPassword">
        <Form.Label>Nuova password</Form.Label>

        <div className="login-form__field">
          <FiLock />

          <Form.Control
            type={mostraPassword ? "text" : "password"}
            placeholder="Inserisci la nuova password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            disabled={stato === "invio"}
            required
          />

          <button
            type="button"
            className="login-form__password-toggle"
            onClick={() => setMostraPassword((valore) => !valore)}
            aria-label={etichettaToggle}
          >
            {mostraPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <p className="password-form__hint">{REQUISITI}</p>
      </Form.Group>

      <Form.Group className="login-form__group" controlId="confermaPassword">
        <Form.Label>Conferma password</Form.Label>

        <div className="login-form__field">
          <FiLock />

          <Form.Control
            type={mostraPassword ? "text" : "password"}
            placeholder="Ripeti la nuova password"
            value={conferma}
            onChange={(event) => setConferma(event.target.value)}
            autoComplete="new-password"
            disabled={stato === "invio"}
            required
          />
        </div>
      </Form.Group>

      <Button
        type="submit"
        className="login-form__submit password-form__submit"
        disabled={stato === "invio"}
      >
        <span>
          {stato === "invio" ? "Salvataggio…" : "Reimposta la password"}
        </span>

        <FiCheckCircle />
      </Button>
    </Form>
  );
};

export default ResetPasswordForm;
