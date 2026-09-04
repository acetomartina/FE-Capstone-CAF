import {
  useState,
  type FormEvent,
} from "react";

import {
  Button,
  Form,
} from "react-bootstrap";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
  FiAlertCircle,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
} from "react-icons/fi";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

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

const messaggioPerErrore = (
  errore: unknown,
): string => {
  if (!axios.isAxiosError(errore)) {
    return MESSAGGIO_TECNICO;
  }

  const stato =
    errore.response?.status;

  if (stato === 401) {
    return MESSAGGIO_CREDENZIALI;
  }

  return MESSAGGIO_TECNICO;
};

const LoginForm = () => {

  const emailRicordata =
    tokenService.recuperaEmailRicordata();

  const [email, setEmail] =
    useState(
      emailRicordata ?? "",
    );

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    mostraPassword,
    setMostraPassword,
  ] = useState(false);

  const [
    ricordami,
    setRicordami,
  ] = useState(
    Boolean(emailRicordata),
  );

  const caricamento =
    useAppSelector(
      (stato) =>
        stato.auth.caricamento,
    );

  const errore =
    useAppSelector(
      (stato) =>
        stato.auth.errore,
    );

  const dispatch =
    useAppDispatch();

  const navigate =
    useNavigate();

  const posizione =
    useLocation();

  const destinazione =
    (
      posizione.state as {
        da?: string;
      } | null
    )?.da ??
    PERCORSO_AREA_RISERVATA;

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    dispatch(
      impostaCaricamento(true),
    );

    try {
      const risposta =
        await authService.login(
          email,
          password,
        );

      tokenService.salvaToken(
        risposta.accessToken,
        ricordami,
      );

      if (ricordami) {
        tokenService.salvaEmailRicordata(
          email.trim(),
        );
      } else {
        tokenService.rimuoviEmailRicordata();
      }

      dispatch(
        impostaAutenticazione({
          token:
            risposta.accessToken,

          utente: {
            id:
              risposta.id,

            nome:
              risposta.nome,

            cognome:
              risposta.cognome,

            email:
              risposta.email,

            ruolo:
              risposta.ruolo,

            attivo:
              risposta.attivo,

            urlImmagineProfilo:
              risposta.urlImmagineProfilo,
          },
        }),
      );

      navigate(
        destinazione,
        {
          replace: true,
        },
      );
    } catch (erroreChiamata) {
      dispatch(
        impostaErrore(
          messaggioPerErrore(
            erroreChiamata,
          ),
        ),
      );
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="login-form"
    >
      {errore && (
        <div
          className="password-alert"
          role="alert"
        >
          <span
            className="password-alert__icon"
          >
            <FiAlertCircle
              aria-hidden="true"
            />
          </span>

          <p
            className="password-alert__text"
          >
            {errore}
          </p>
        </div>
      )}

      <Form.Group
        className="login-form__group"
        controlId="email"
      >
        <Form.Label>
          Email
        </Form.Label>

        <div
          className="login-form__field"
        >
          <FiMail
            aria-hidden="true"
          />

          <Form.Control
            type="email"
            name="email"
            placeholder="nome@email.it"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value,
              )
            }
            autoComplete="username"
            disabled={
              caricamento
            }
            required
          />
        </div>
      </Form.Group>

      <Form.Group
        className="login-form__group"
        controlId="password"
      >
        <Form.Label>
          Password
        </Form.Label>

        <div
          className="login-form__field"
        >
          <FiLock
            aria-hidden="true"
          />

          <Form.Control
            type={
              mostraPassword
                ? "text"
                : "password"
            }
            name="password"
            placeholder="Inserisci la password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value,
              )
            }
            autoComplete="current-password"
            disabled={
              caricamento
            }
            required
          />

          <button
            type="button"
            className="login-form__password-toggle"
            onClick={() =>
              setMostraPassword(
                (valore) =>
                  !valore,
              )
            }
            aria-label={
              mostraPassword
                ? "Nascondi la password"
                : "Mostra la password"
            }
            disabled={
              caricamento
            }
          >
            {mostraPassword ? (
              <FiEyeOff
                aria-hidden="true"
              />
            ) : (
              <FiEye
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      </Form.Group>

      <div
        className="login-form__options"
      >
        <label
          className="login-form__remember"
        >
          <input
            type="checkbox"
            checked={
              ricordami
            }
            onChange={(event) =>
              setRicordami(
                event.target.checked,
              )
            }
            disabled={
              caricamento
            }
          />

          <span
            className="login-form__checkmark"
            aria-hidden="true"
          />

          <span>
            Ricordami
          </span>
        </label>

        <Link
          to="/recupera-password"
          className="login-form__forgot"
        >
          Password dimenticata?
        </Link>
      </div>

      <Button
        type="submit"
        className="login-form__submit"
        disabled={
          caricamento
        }
      >
        <span>
          {caricamento
            ? "Accesso in corso…"
            : "Accedi"}
        </span>

        <FiArrowRight
          aria-hidden="true"
        />
      </Button>
    </Form>
  );
};

export default LoginForm;