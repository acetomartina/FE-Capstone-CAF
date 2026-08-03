import { useState, type FormEvent } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { FiAlertCircle, FiMail, FiSend } from "react-icons/fi";

import { authService } from "../authService";
import type { StatoOperazione } from "../authTypes";

const MESSAGGIO_NEUTRO =
  "Se l'indirizzo è associato a un account, riceverai a breve una mail con le istruzioni per reimpostare la password.";

const MESSAGGIO_ERRORE =
  "Non è stato possibile inviare la richiesta per un problema tecnico. Riprova tra qualche minuto.";

/* Solo un guasto vero merita il corallo: 5xx o rete assente. Qualsiasi altra
   risposta ricade sul messaggio neutro, altrimenti il codice di stato
   diventerebbe un modo per capire se l'account esiste. */
const erroreTecnico = (errore: unknown): boolean => {
  if (!axios.isAxiosError(errore)) {
    return true;
  }

  const stato = errore.response?.status;

  return stato === undefined || stato >= 500;
};

const RecuperoPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [stato, setStato] = useState<StatoOperazione>("inattivo");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setStato("invio");

    try {
      await authService.richiediRecuperoPassword(email);

      setStato("completato");
    } catch (errore) {
      setStato(erroreTecnico(errore) ? "errore" : "completato");
    }
  };

  if (stato === "completato") {
    return (
      <div className="password-note" role="status">
        <span className="password-note__icon">
          <FiMail />
        </span>

        <div className="password-note__text">
          <strong>Controlla la tua casella di posta</strong>

          <p>{MESSAGGIO_NEUTRO}</p>

          <div className="password-note__aiuto">
            Non ricevi nulla? Controlla lo spam oppure contatta la sede —{" "}
            <a href="tel:+393779609155">377 960 9155</a>.
          </div>
        </div>
      </div>
    );
  }

  return (
    <Form onSubmit={handleSubmit} className="login-form">
      {stato === "errore" && (
        <div className="password-alert" role="alert">
          <span className="password-alert__icon">
            <FiAlertCircle />
          </span>

          <p className="password-alert__text">{MESSAGGIO_ERRORE}</p>
        </div>
      )}

      <Form.Group className="login-form__group" controlId="email">
        <Form.Label>Email</Form.Label>

        <div className="login-form__field">
          <FiMail />

          <Form.Control
            type="email"
            placeholder="nome@email.it"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
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
          {stato === "invio" ? "Invio in corso…" : "Invia link di recupero"}
        </span>

        <FiSend />
      </Button>
    </Form>
  );
};

export default RecuperoPasswordForm;
