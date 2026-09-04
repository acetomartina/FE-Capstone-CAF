import { Navigate } from "react-router-dom";

import { useAppSelector } from "../../app/hooks";
import { percorsoPerRuolo } from "../../features/auth/percorsiRuolo";

const AreaRiservataPage = () => {
  const utente = useAppSelector((stato) => stato.auth.utente);

  if (!utente) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={percorsoPerRuolo(utente.ruolo)} replace />;
};

export default AreaRiservataPage;
