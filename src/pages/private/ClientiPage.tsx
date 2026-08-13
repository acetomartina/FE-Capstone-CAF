import {
  useEffect,
  useState,
} from "react";
import {
  Alert,
  Button,
  Spinner,
  Table,
} from "react-bootstrap";
import {
  FiPlus,
  FiSearch,
  FiUsers,
} from "react-icons/fi";

import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";

import PrivatePageHeader from "../../components/private/PrivatePageHeader";

import {
  caricaClienti,
} from "../../features/clienti";

import NuovoClienteModal from "../../features/clienti/components/NuovoClienteModal";
import ClienteDettaglioModal from "../../features/clienti/components/ClienteDettaglioModal";

import "./ClientiPage.css";

const ClientiPage = () => {
  const dispatch = useAppDispatch();

  const {
    elenco,
    caricamento,
    errore,
    totaleElementi,
  } = useAppSelector(
    (state) => state.clienti,
  );

  const [
    mostraNuovoCliente,
    setMostraNuovoCliente,
  ] = useState(false);

  const [
    clienteSelezionatoId,
    setClienteSelezionatoId,
  ] = useState<number | null>(
    null,
  );

  useEffect(() => {
    void dispatch(
      caricaClienti({
        page: 0,
        size: 10,
        sort: "cognome,asc",
      }),
    );
  }, [dispatch]);

  const ricaricaClienti = () => {
    void dispatch(
      caricaClienti({
        page: 0,
        size: 10,
        sort: "cognome,asc",
      }),
    );
  };

  return (
    <section className="clienti-page">
      <PrivatePageHeader
        eyebrow="Gestione anagrafiche"
        title="Clienti"
        description="Gestisci tutti i clienti registrati al CAF e accedi rapidamente alle relative informazioni."
        action={
          <Button
            type="button"
            className="clienti-page__new-button"
            onClick={() =>
              setMostraNuovoCliente(
                true,
              )
            }
          >
            <FiPlus />

            <span>
              Nuovo cliente
            </span>
          </Button>
        }
      />

      <section className="clienti-panel">
        <header className="clienti-panel__header">
          <div className="clienti-search">
            <FiSearch />

            <input
              type="search"
              placeholder="Cerca per nome, cognome o codice fiscale..."
              aria-label="Cerca cliente"
            />
          </div>

          <div className="clienti-count">
            <FiUsers />

            <span>
              {totaleElementi}
            </span>

            <small>
              {totaleElementi === 1
                ? "cliente"
                : "clienti"}
            </small>
          </div>
        </header>

        {errore && (
          <Alert
            variant="danger"
            className="clienti-panel__alert"
          >
            {errore}
          </Alert>
        )}

        {caricamento ? (
          <div className="clienti-loading">
            <Spinner
              animation="border"
              size="sm"
            />

            <p>
              Caricamento clienti...
            </p>
          </div>
        ) : (
          <div className="clienti-table-wrapper">
            <Table
              responsive
              className="clienti-table"
            >
              <thead>
                <tr>
                  <th>
                    Cliente
                  </th>

                  <th>
                    Codice fiscale
                  </th>

                  <th>
                    Telefono
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Stato
                  </th>
                </tr>
              </thead>

              <tbody>
                {elenco.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="clienti-table__empty"
                    >
                      Nessun cliente
                      trovato.
                    </td>
                  </tr>
                ) : (
                  elenco.map(
                    (cliente) => (
                      <tr
                        key={
                          cliente.id
                        }
                        className="clienti-table__row"
                        onClick={() =>
                          setClienteSelezionatoId(
                            cliente.id,
                          )
                        }
                      >
                        <td>
                          <div className="clienti-table__cliente">
                            <span className="clienti-table__avatar">
                              {cliente.nome
                                .charAt(0)
                                .toUpperCase()}

                              {cliente.cognome
                                .charAt(0)
                                .toUpperCase()}
                            </span>

                            <strong>
                              {
                                cliente.nome
                              }{" "}
                              {
                                cliente.cognome
                              }
                            </strong>
                          </div>
                        </td>

                        <td>
                          <span className="clienti-table__secondary">
                            {
                              cliente.codiceFiscale
                            }
                          </span>
                        </td>

                        <td>
                          <span className="clienti-table__secondary">
                            {cliente.telefono ??
                              "—"}
                          </span>
                        </td>

                        <td>
                          <span className="clienti-table__email">
                            {
                              cliente.email
                            }
                          </span>
                        </td>

                        <td>
                          <span
                            className={`clienti-status ${
                              cliente.attivo
                                ? "clienti-status--active"
                                : "clienti-status--inactive"
                            }`}
                          >
                            {cliente.attivo
                              ? "Attivo"
                              : "Non attivo"}
                          </span>
                        </td>
                      </tr>
                    ),
                  )
                )}
              </tbody>
            </Table>
          </div>
        )}
      </section>

      <NuovoClienteModal
        show={
          mostraNuovoCliente
        }
        onHide={() =>
          setMostraNuovoCliente(
            false,
          )
        }
        onClienteCreato={
          ricaricaClienti
        }
      />

      <ClienteDettaglioModal
        show={
          clienteSelezionatoId !==
          null
        }
        clienteId={
          clienteSelezionatoId
        }
        onHide={() =>
          setClienteSelezionatoId(
            null,
          )
        }
        onClienteAggiornato={
          ricaricaClienti
        }
      />
    </section>
  );
};

export default ClientiPage;