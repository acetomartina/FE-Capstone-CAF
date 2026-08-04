import { Navigate } from "react-router-dom";

import { useAppSelector } from "../../app/hooks";
import { percorsoPerRuolo } from "../../features/auth/percorsiRuolo";

/**
 * Ingresso unico dell'area riservata: non mostra nulla, rimanda all'area
 * del ruolo. Serve ad avere un indirizzo stabile da usare come destinazione
 * del login e nei link, senza che chi lo scrive debba sapere il ruolo di chi
 * lo aprira'.
 */
const AreaRiservataPage = () => {
  const utente = useAppSelector((stato) => stato.auth.utente);

  /* La guardia garantisce che qui l'utente ci sia. Se manca e' uno stato
     imprevisto, e il login e' il posto giusto da cui ripartire. */
  if (!utente) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={percorsoPerRuolo(utente.ruolo)} replace />;
};

export default AreaRiservataPage;
