import { Spinner } from "react-bootstrap";
import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { useAppSelector } from "../../../app/hooks";
import type { Ruolo } from "../authTypes";
import { percorsoPerRuolo } from "../percorsiRuolo";

interface RottaProtettaProps {
  /** Se assente, basta essere autenticati. */
  ruoliAmmessi?: Ruolo[];
}

/**
 * Guardia sulle rotte dell'area riservata.
 *
 * Non è una misura di sicurezza:
 * il frontend decide soltanto cosa mostrare.
 *
 * L'autorizzazione reale alle risorse viene gestita
 * dal backend tramite i controlli sui ruoli.
 */
const RottaProtetta = ({
  ruoliAmmessi,
}: RottaProtettaProps) => {
  const utente = useAppSelector(
    (stato) => stato.auth.utente,
  );

  const autenticato = useAppSelector(
    (stato) => stato.auth.autenticato,
  );

  const sessioneVerificata = useAppSelector(
    (stato) => stato.auth.sessioneVerificata,
  );

  const posizione = useLocation();

  /*
   * Conserviamo l'intera destinazione richiesta,
   * comprese query string e hash.
   *
   * Dopo il login l'utente potrà quindi tornare
   * esattamente alla pagina che aveva richiesto.
   */
  const destinazioneRichiesta =
    posizione.pathname +
    posizione.search +
    posizione.hash;

  /*
   * All'avvio la verifica del token può essere ancora
   * in corso. Non possiamo decidere se effettuare
   * il redirect finché non conosciamo lo stato
   * effettivo della sessione.
   */
  if (!sessioneVerificata) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner
          animation="border"
          variant="success"
          role="status"
        >
          <span className="visually-hidden">
            Verifica della sessione…
          </span>
        </Spinner>
      </div>
    );
  }

  /*
   * Nessuna sessione valida:
   * mandiamo l'utente al login ricordando
   * dove stava cercando di andare.
   */
  if (!autenticato || !utente) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          da: destinazioneRichiesta,
        }}
      />
    );
  }

  /*
   * L'utente è autenticato ma il suo ruolo
   * non può accedere a questa sezione.
   *
   * Lo riportiamo nella propria area invece
   * di mostrargli una pagina di errore.
   */
  if (
    ruoliAmmessi &&
    !ruoliAmmessi.includes(utente.ruolo)
  ) {
    return (
      <Navigate
        to={percorsoPerRuolo(utente.ruolo)}
        replace
      />
    );
  }

  return <Outlet />;
};

export default RottaProtetta;