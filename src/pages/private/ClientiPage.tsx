import { useEffect, useState } from "react";
import { Alert, Button, Card, Spinner, Table } from "react-bootstrap";
import { FiPlus, FiSearch } from "react-icons/fi";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { caricaClienti } from "../../features/clienti";
import NuovoClienteModal from "../../features/clienti/components/NuovoClienteModal";
import ClienteDettaglioModal from "../../features/clienti/components/ClienteDettaglioModal";

const ClientiPage = () => {
  const dispatch = useAppDispatch();

  const {
    elenco,
    caricamento,
    errore,
    totaleElementi,
  } = useAppSelector((state) => state.clienti);

  useEffect(() => {
    void dispatch(
      caricaClienti({
        page: 0,
        size: 10,
        sort: "cognome,asc",
      })
    );
  }, [dispatch]);

  const [mostraNuovoCliente, setMostraNuovoCliente] =
  useState(false);

  const [
  clienteSelezionatoId,
  setClienteSelezionatoId,
] = useState<number | null>(null);

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Clienti</h1>
          <p className="text-secondary mb-0">
            Gestisci tutti i clienti registrati al CAF.
          </p>
        </div>

        <Button 
        variant="success" 
        className="d-flex align-items-center gap-2"
        onClick={() => setMostraNuovoCliente(true)}
        >
          <FiPlus />
          Nuovo cliente
        </Button>

        <NuovoClienteModal
  show={mostraNuovoCliente}
  onHide={() =>
    setMostraNuovoCliente(false)
  }
  onClienteCreato={() => {
    void dispatch(
      caricaClienti({
        page: 0,
        size: 10,
        sort: "cognome,asc",
      })
    );
  }}
/>

<ClienteDettaglioModal
  show={clienteSelezionatoId !== null}
  clienteId={clienteSelezionatoId}
  onHide={() =>
    setClienteSelezionatoId(null)
  }
  onClienteAggiornato={() => {
    void dispatch(
      caricaClienti({
        page: 0,
        size: 10,
        sort: "cognome,asc",
      })
    );
  }}
/>
      </div>

      <Card>
        <Card.Body>
          <div className="d-flex flex-wrap justify-content-between gap-3 mb-4">
            <div className="input-group" style={{ maxWidth: 420 }}>
              <span className="input-group-text bg-white">
                <FiSearch />
              </span>

              <input
                type="search"
                className="form-control"
                placeholder="Cerca per nome, cognome o codice fiscale..."
              />
            </div>

            <span className="text-secondary align-self-center">
              {totaleElementi} clienti
            </span>
          </div>

          {errore && <Alert variant="danger">{errore}</Alert>}

          {caricamento ? (
            <div className="py-5 text-center">
              <Spinner animation="border" />
              <p className="text-secondary mt-3 mb-0">
                Caricamento clienti...
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Codice fiscale</th>
                    <th>Telefono</th>
                    <th>Email</th>
                    <th>Stato</th>
                  </tr>
                </thead>

                <tbody>
                  {elenco.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-5 text-secondary">
                        Nessun cliente trovato.
                      </td>
                    </tr>
                  ) : (
                    elenco.map((cliente) => (
                      <tr
  key={cliente.id}
  role="button"
  style={{ cursor: "pointer" }}
  onClick={() =>
    setClienteSelezionatoId(cliente.id)
  }
>
                        <td>
                          <div className="fw-semibold">
                            {cliente.nome} {cliente.cognome}
                          </div>
                        </td>

                        <td>{cliente.codiceFiscale}</td>
                        <td>{cliente.telefono ?? "—"}</td>
                        <td>{cliente.email}</td>

                        <td>
                          <span
                            className={`badge ${
                              cliente.attivo
                                ? "text-bg-success"
                                : "text-bg-secondary"
                            }`}
                          >
                            {cliente.attivo ? "Attivo" : "Non attivo"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ClientiPage;