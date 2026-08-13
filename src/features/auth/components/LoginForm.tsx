import { useState, type FormEvent } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiAlertCircle,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
} from "react-icons/fi";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { tokenService } from "../../../services/tokenService";
import { authService } from "../authService";
import {
  impostaAutenticazione,
  impostaCaricamento,
  impostaErrore,
} from "../authSlice";
import { PERCORSO_AREA_RISERVATA } from "../percorsiRuolo";

const MESSAGGIO_CREDENZIALI =
  "Email o password non corrette. Controlla i dati e riprova.";

const MESSAGGIO_TECNICO =
  "Non è stato possibile completare l'accesso per un problema tecnico. Riprova tra qualche minuto.";

/* Qui il 401 puo' essere esplicito: chi prova ad accedere dichiara di
   conoscere quelle credenziali, quindi dirgli che sono sbagliate non
   rivela niente che non sappia gia'. Diverso dal recupero password. */
const messaggioPerErrore = (errore: unknown): string => {
  if (!axios.isAxiosError(errore)) {
    return MESSAGGIO_TECNICO;
  }

  const stato = errore.response?.status;

  if (stato === 401) {
    return MESSAGGIO_CREDENZIALI;
  }

  return MESSAGGIO_TECNICO;
};

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostraPassword, setMostraPassword] = useState(false);

  const caricamento = useAppSelector((stato) => stato.auth.caricamento);
  const errore = useAppSelector((stato) => stato.auth.errore);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const posizione = useLocation();

  /* La guardia ha salvato qui la pagina che l'utente voleva aprire. */
  const destinazione =
    (posizione.state as { da?: string } | null)?.da ??
    PERCORSO_AREA_RISERVATA;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    dispatch(impostaCaricamento(true));

    try {
      const risposta = await authService.login(email, password);

      /*
       * Salviamo solo il token JWT.
       * Email e password vengono eventualmente gestite
       * dal password manager del browser.
       */
      tokenService.salvaToken(risposta.accessToken);

      dispatch(
        impostaAutenticazione({
          token: risposta.accessToken,
          utente: {
            id: risposta.id,
            nome: risposta.nome,
            cognome: risposta.cognome,
            email: risposta.email,
            ruolo: risposta.ruolo,
            attivo: risposta.attivo,
            urlImmagineProfilo: risposta.urlImmagineProfilo,
          },
        }),
      );

      navigate(destinazione, { replace: true });
    } catch (erroreChiamata) {
      dispatch(impostaErrore(messaggioPerErrore(erroreChiamata)));
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="login-form"
      autoComplete="on"
    >
      {errore && (
        <div className="password-alert" role="alert">
          <span className="password-alert__icon">
            <FiAlertCircle />
          </span>

          <p className="password-alert__text">{errore}</p>
        </div>
      )}

      <Form.Group className="login-form__group" controlId="email">
        <Form.Label>Email</Form.Label>

        <div className="login-form__field">
          <FiMail />

          <Form.Control
            type="email"
            name="email"
            placeholder="nome@email.it"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="username"
            disabled={caricamento}
            required
          />
        </div>
      </Form.Group>

      <Form.Group className="login-form__group" controlId="password">
        <div className="login-form__label-row">
          <Form.Label>Password</Form.Label>

          <Link to="/recupera-password" className="login-form__forgot">
            Password dimenticata?
          </Link>
        </div>

        <div className="login-form__field">
          <FiLock />

          <Form.Control
            type={mostraPassword ? "text" : "password"}
            name="password"
            placeholder="Inserisci la password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            disabled={caricamento}
            required
          />

          <button
            type="button"
            className="login-form__password-toggle"
            onClick={() => setMostraPassword((valore) => !valore)}
            aria-label={
              mostraPassword
                ? "Nascondi la password"
                : "Mostra la password"
            }
          >
            {mostraPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
      </Form.Group>

      <Button
        type="submit"
        className="login-form__submit"
        disabled={caricamento}
      >
        <span>{caricamento ? "Accesso in corso…" : "Accedi"}</span>
        <FiArrowRight />
      </Button>
    </Form>
  );
};

export default LoginForm;