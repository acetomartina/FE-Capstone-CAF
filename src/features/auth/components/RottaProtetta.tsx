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

  ruoliAmmessi?: Ruolo[];
}

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

  const destinazioneRichiesta =
    posizione.pathname +
    posizione.search +
    posizione.hash;

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