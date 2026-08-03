import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAppSelector } from "../../../app/hooks";
import type { Ruolo } from "../authTypes";
import { percorsoPerRuolo } from "../percorsiRuolo";

interface RottaProtettaProps {
  /** Se assente, basta essere autenticati. */
  ruoliAmmessi?: Ruolo[];
}

/**
 * Guardia sulle rotte dell'area riservata.
 * <p>
 * Non e' una misura di sicurezza: nasconde, non nega. Chi apre gli strumenti
 * per sviluppatori la aggira in un minuto. A negare davvero i dati sono le
 * @PreAuthorize del backend; questa evita solo di trovarsi davanti pagine
 * che non riguardano il proprio ruolo.
 */
const RottaProtetta = ({ ruoliAmmessi }: RottaProtettaProps) => {
  const utente = useAppSelector((stato) => stato.auth.utente);
  const autenticato = useAppSelector((stato) => stato.auth.autenticato);

  const posizione = useLocation();

  if (!autenticato || !utente) {
    /* Ricorda dove voleva andare: dopo il login ce lo riportiamo. */
    return (
      <Navigate
        to="/login"
        replace
        state={{ da: posizione.pathname }}
      />
    );
  }

  /* Ruolo sbagliato: alla propria area, non a una pagina di errore.
     L'utente non ha sbagliato nulla, ha solo aperto la porta di un altro. */
  if (ruoliAmmessi && !ruoliAmmessi.includes(utente.ruolo)) {
    return <Navigate to={percorsoPerRuolo(utente.ruolo)} replace />;
  }

  return <Outlet />;
};

export default RottaProtetta;
