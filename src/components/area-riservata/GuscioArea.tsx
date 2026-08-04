import type { ReactNode } from "react";
import { Badge, Button, Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";
import type { Ruolo } from "../../features/auth/authTypes";
import { tokenService } from "../../services/tokenService";

/* Come chiamare i ruoli davanti all'utente: "USER" a schermo non
   significherebbe nulla per un dipendente del CAF. */
const ETICHETTE: Record<Ruolo, string> = {
  SUPER_ADMIN: "Super amministratore",
  ADMIN: "Amministratore",
  USER: "Dipendente",
  CLIENTE: "Cliente",
};

interface GuscioAreaProps {
  titolo: string;
  descrizione: string;
  children?: ReactNode;
}

const GuscioArea = ({
  titolo,
  descrizione,
  children,
}: GuscioAreaProps) => {
  const utente = useAppSelector((stato) => stato.auth.utente);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  /* L'uscita vive qui e non nelle singole pagine: se un domani servira'
     avvisare anche il server, ci sara' un solo punto da cambiare. */
  const esci = () => {
    tokenService.rimuoviToken();
    dispatch(logout());

    navigate("/login");
  };

  return (
    <Container className="py-5">
      <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">{titolo}</h1>
          <p className="text-secondary mb-0">{descrizione}</p>
        </div>

        <Button
          variant="outline-secondary"
          className="d-inline-flex align-items-center gap-2"
          onClick={esci}
        >
          <FiLogOut />
          Esci
        </Button>
      </div>

      <Card className="mb-4">
        <Card.Body>
          {utente ? (
            <>
              <Card.Title as="h2" className="h5 mb-2">
                {utente.nome} {utente.cognome}
              </Card.Title>

              <p className="text-secondary mb-3">{utente.email}</p>

              <Badge bg="success">{ETICHETTE[utente.ruolo]}</Badge>
            </>
          ) : (
            <p className="mb-0 text-secondary">
              Nessuna sessione attiva.
            </p>
          )}
        </Card.Body>
      </Card>

      {children}
    </Container>
  );
};

export default GuscioArea;
