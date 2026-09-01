import {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import {
  Alert,
  Button,
  Pagination,
  Spinner,
  Table,
} from "react-bootstrap";

import {
  FiPlus,
  FiSearch,
  FiUsers,
  FiX,
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

type FiltroAttivazione =
  | ""
  | "true"
  | "false";

const DIMENSIONE_PAGINA = 10;

const normalizzaFiltroAttivo = (
  valore: string | null,
): FiltroAttivazione => {
  if (
    valore === "true" ||
    valore === "false"
  ) {
    return valore;
  }

  return "";
};

const normalizzaPagina = (
  valore: string | null,
): number => {
  const pagina = Number(valore);

  if (
    Number.isInteger(pagina) &&
    pagina >= 0
  ) {
    return pagina;
  }

  return 0;
};

const ClientiPage = () => {
  const dispatch = useAppDispatch();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const {
    elenco,
    caricamento,
    errore,
    totaleElementi,
    totalePagine,
    paginaCorrente,
  } = useAppSelector(
    (state) => state.clienti,
  );

  const filtroAttivo =
    normalizzaFiltroAttivo(
      searchParams.get("attivo"),
    );

  const termineUrl =
    searchParams.get("q") ?? "";

  const paginaUrl = normalizzaPagina(
    searchParams.get("page"),
  );

  const [
    termineRicerca,
    setTermineRicerca,
  ] = useState(termineUrl);

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
    setTermineRicerca(termineUrl);
  }, [termineUrl]);

  useEffect(() => {
    const timeoutRicerca =
      window.setTimeout(() => {
        const termineNormalizzato =
          termineRicerca.trim();

        if (
          termineNormalizzato === termineUrl
        ) {
          return;
        }

        const nuoviParametri =
          new URLSearchParams(
            searchParams,
          );

        if (termineNormalizzato) {
          nuoviParametri.set(
            "q",
            termineNormalizzato,
          );
        } else {
          nuoviParametri.delete("q");
        }

        nuoviParametri.set("page", "0");

        setSearchParams(
          nuoviParametri,
          {
            replace: true,
          },
        );
      }, 350);

    return () => {
      window.clearTimeout(
        timeoutRicerca,
      );
    };
  }, [
    searchParams,
    setSearchParams,
    termineRicerca,
    termineUrl,
  ]);

  useEffect(() => {
    void dispatch(
      caricaClienti({
        page: paginaUrl,
        size: DIMENSIONE_PAGINA,
        sort: "cognome,asc",
        termine: termineUrl || undefined,
        attivo:
          filtroAttivo === ""
            ? undefined
            : filtroAttivo ===
              "true",
      }),
    );
  }, [
    dispatch,
    filtroAttivo,
    paginaUrl,
    termineUrl,
  ]);

  const aggiornaParametri = (
    aggiornamenti: Record<
      string,
      string | null
    >,
  ) => {
    const nuoviParametri =
      new URLSearchParams(searchParams);

    Object.entries(
      aggiornamenti,
    ).forEach(([chiave, valore]) => {
      if (valore === null) {
        nuoviParametri.delete(chiave);
        return;
      }

      nuoviParametri.set(
        chiave,
        valore,
      );
    });

    setSearchParams(
      nuoviParametri,
      {
        replace: true,
      },
    );
  };

  const ricaricaClienti = () => {
    void dispatch(
      caricaClienti({
        page: paginaUrl,
        size: DIMENSIONE_PAGINA,
        sort: "cognome,asc",
        termine: termineUrl || undefined,
        attivo:
          filtroAttivo === ""
            ? undefined
            : filtroAttivo ===
              "true",
      }),
    );
  };

  const cambiaFiltroAttivo = (
    valore: FiltroAttivazione,
  ) => {
    aggiornaParametri({
      attivo:
        valore === ""
          ? null
          : valore,
      page: "0",
    });
  };

  const cambiaPagina = (
    nuovaPagina: number,
  ) => {
    aggiornaParametri({
      page: String(nuovaPagina),
    });
  };

  const primaPagina =
    paginaCorrente === 0;

  const ultimaPagina =
    totalePagine === 0 ||
    paginaCorrente >= totalePagine - 1;

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
              setMostraNuovoCliente(true)
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
          <div className="clienti-toolbar">
            <div className="clienti-search">
              <FiSearch />

              <input
                type="search"
                value={termineRicerca}
                onChange={(event) =>
                  setTermineRicerca(
                    event.target.value,
                  )
                }
                placeholder="Cerca per nome, codice fiscale, email o telefono..."
                aria-label="Cerca cliente"
              />

              {termineRicerca && (
                <button
                  type="button"
                  className="clienti-search__clear"
                  aria-label="Cancella ricerca"
                  onClick={() =>
                    setTermineRicerca("")
                  }
                >
                  <FiX />
                </button>
              )}
            </div>

            <div
              className="clienti-status-filters"
              role="group"
              aria-label="Filtra clienti per stato"
            >
              {(
                [
                  ["", "Tutti"],
                  ["true", "Attivi"],
                  ["false", "Da attivare"],
                ] as Array<[
                  FiltroAttivazione,
                  string,
                ]>
              ).map(([valore, etichetta]) => (
                <button
                  key={valore || "tutti"}
                  type="button"
                  className={
                    filtroAttivo === valore
                      ? "clienti-status-filters__button clienti-status-filters__button--active"
                      : "clienti-status-filters__button"
                  }
                  aria-pressed={
                    filtroAttivo === valore
                  }
                  onClick={() =>
                    cambiaFiltroAttivo(valore)
                  }
                >
                  {etichetta}
                </button>
              ))}
            </div>
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

        {caricamento &&
        elenco.length === 0 ? (
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
          <>
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
                        Nessun cliente trovato.
                      </td>
                    </tr>
                  ) : (
                    elenco.map((cliente) => (
                      <tr
                        key={cliente.id}
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
                              {cliente.nome}{" "}
                              {cliente.cognome}
                            </strong>
                          </div>
                        </td>

                        <td>
                          <span className="clienti-table__secondary">
                            {cliente.codiceFiscale}
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
                            {cliente.email}
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
                    ))
                  )}
                </tbody>
              </Table>
            </div>

            {totalePagine > 1 && (
              <footer className="clienti-panel__footer">
                <p>
                  Pagina {paginaCorrente + 1} di{" "}
                  {totalePagine}
                </p>

                <Pagination className="clienti-pagination">
                  <Pagination.Prev
                    disabled={primaPagina}
                    onClick={() =>
                      cambiaPagina(
                        paginaCorrente - 1,
                      )
                    }
                  />

                  <Pagination.Next
                    disabled={ultimaPagina}
                    onClick={() =>
                      cambiaPagina(
                        paginaCorrente + 1,
                      )
                    }
                  />
                </Pagination>
              </footer>
            )}
          </>
        )}
      </section>

      <NuovoClienteModal
        show={mostraNuovoCliente}
        onHide={() =>
          setMostraNuovoCliente(false)
        }
        onClienteCreato={ricaricaClienti}
      />

      <ClienteDettaglioModal
        show={
          clienteSelezionatoId !== null
        }
        clienteId={clienteSelezionatoId}
        onHide={() =>
          setClienteSelezionatoId(null)
        }
        onClienteAggiornato={
          ricaricaClienti
        }
      />
    </section>
  );
};

export default ClientiPage;
