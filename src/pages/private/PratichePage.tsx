import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  Alert,
  Button,
  Form,
  Spinner,
  Table,
} from "react-bootstrap";
import {
  FiBriefcase,
  FiCalendar,
  FiPlus,
  FiSearch,
  FiUser,
  FiX,
} from "react-icons/fi";

import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";

import PrivatePageHeader from "../../components/private/PrivatePageHeader";
import NuovaPraticaModal from "../../features/pratiche/components/NuovaPraticaModal";

import {
  clientiService,
} from "../../features/clienti/api/clientiService";

import {
  praticheService,
} from "../../features/pratiche/api/praticheService";

import {
  caricaPratiche,
} from "../../features/pratiche";

import {
  ETICHETTE_PRIORITA_PRATICA,
  ETICHETTE_STATO_PRATICA,
} from "../../features/pratiche/constants/praticheConstants";

import type {
  Pratica,
  StatoPratica,
} from "../../features/pratiche/types/praticheTypes";

import "./PratichePage.css";

const STATI_PRATICA: StatoPratica[] = [
  "BOZZA",
  "DA_AVVIARE",
  "IN_LAVORAZIONE",
  "IN_ATTESA_DOCUMENTI",
  "IN_ATTESA_CLIENTE",
  "IN_ATTESA_ENTE",
  "COMPLETATA",
  "ANNULLATA",
];

const PratichePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const clienteIdDaUrl =
    useMemo(() => {
      const valore =
        searchParams.get(
          "clienteId",
        );

      if (!valore) {
        return null;
      }

      const clienteId =
        Number(valore);

      return Number.isInteger(
        clienteId,
      ) && clienteId > 0
        ? clienteId
        : null;
    }, [searchParams]);

const statoDaUrl =
  searchParams.get(
    "stato",
  ) as StatoPratica | null;

  const {
    elenco,
    caricamento,
    errore,
    totaleElementi,
  } = useAppSelector(
    (state) => state.pratiche,
  );

  const [
    ricerca,
    setRicerca,
  ] = useState("");

  const [
  stato,
  setStato,
] = useState<
  StatoPratica | ""
>(
  statoDaUrl &&
    STATI_PRATICA.includes(
      statoDaUrl,
    )
    ? statoDaUrl
    : "",
);

useEffect(() => {
  const nuovoStato =
    searchParams.get(
      "stato",
    ) as StatoPratica | null;

  setStato(
    nuovoStato &&
      STATI_PRATICA.includes(
        nuovoStato,
      )
      ? nuovoStato
      : "",
  );
}, [searchParams]);

  const [
    mostraNuovaPratica,
    setMostraNuovaPratica,
  ] = useState(false);

  const [
    praticheCliente,
    setPraticheCliente,
  ] = useState<Pratica[]>([]);

  const [
    nomeClienteFiltro,
    setNomeClienteFiltro,
  ] = useState("");

  const [
    caricamentoCliente,
    setCaricamentoCliente,
  ] = useState(false);

  const [
    erroreCliente,
    setErroreCliente,
  ] = useState<string | null>(null);

  const caricaPraticheCliente =
    useCallback(
      async (
        clienteId: number,
      ) => {
        try {
          setCaricamentoCliente(
            true,
          );
          setErroreCliente(null);

          const [
            rispostaPratiche,
            cliente,
          ] = await Promise.all([
            praticheService
              .trovaPerCliente(
                clienteId,
                {
                  page: 0,
                  size: 100,
                  sort:
                    "creatoIl,desc",
                },
              ),
            clientiService
              .trovaPerId(
                clienteId,
              ),
          ]);

          setPraticheCliente(
            rispostaPratiche.content,
          );
          setNomeClienteFiltro(
            `${cliente.nome} ${cliente.cognome}`,
          );
        } catch {
          setPraticheCliente([]);
          setNomeClienteFiltro("");
          setErroreCliente(
            "Non è stato possibile caricare le pratiche del cliente.",
          );
        } finally {
          setCaricamentoCliente(
            false,
          );
        }
      },
      [],
    );

  useEffect(() => {
    if (!clienteIdDaUrl) {
      setPraticheCliente([]);
      setNomeClienteFiltro("");
      setErroreCliente(null);

      return;
    }

    void caricaPraticheCliente(
      clienteIdDaUrl,
    );
  }, [
    caricaPraticheCliente,
    clienteIdDaUrl,
  ]);

  useEffect(() => {
    if (clienteIdDaUrl) {
      return;
    }

    const timeout = window.setTimeout(
      () => {
        void dispatch(
          caricaPratiche({
            q:
              ricerca.trim() ||
              undefined,
            stato:
              stato ||
              undefined,
            page: 0,
            size: 10,
            sort: "creatoIl,desc",
          }),
        );
      },
      300,
    );

    return () => {
      window.clearTimeout(
        timeout,
      );
    };
  }, [
    dispatch,
    ricerca,
    stato,
    clienteIdDaUrl,
  ]);

  const elencoVisualizzato =
    useMemo(() => {
      if (!clienteIdDaUrl) {
        return elenco;
      }

      const testoRicerca =
        ricerca
          .trim()
          .toLocaleLowerCase(
            "it-IT",
          );

      return praticheCliente.filter(
        (pratica) => {
          const corrispondeStato =
            !stato ||
            pratica.stato === stato;

          if (!corrispondeStato) {
            return false;
          }

          if (!testoRicerca) {
            return true;
          }

          const testoPratica = [
            pratica.numeroPratica,
            pratica.oggetto,
            pratica.servizio.nome,
            pratica.servizio
              .macroAreaNome,
            pratica.cliente.nome,
            pratica.cliente.cognome,
          ]
            .join(" ")
            .toLocaleLowerCase(
              "it-IT",
            );

          return testoPratica.includes(
            testoRicerca,
          );
        },
      );
    }, [
      clienteIdDaUrl,
      elenco,
      praticheCliente,
      ricerca,
      stato,
    ]);

  const caricamentoAttivo =
    clienteIdDaUrl
      ? caricamentoCliente
      : caricamento;

  const erroreAttivo =
    clienteIdDaUrl
      ? erroreCliente
      : errore;

  const totaleVisualizzato =
    clienteIdDaUrl
      ? elencoVisualizzato.length
      : totaleElementi;

  const rimuoviFiltroCliente = () => {
    const nuoviParametri =
      new URLSearchParams(
        searchParams,
      );

    nuoviParametri.delete(
      "clienteId",
    );

    setSearchParams(
      nuoviParametri,
    );
  };

  const formattaData = (
    data: string | null,
  ) => {
    if (!data) {
      return "—";
    }

    return new Intl.DateTimeFormat(
      "it-IT",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      },
    ).format(
      new Date(
        `${data}T00:00:00`,
      ),
    );
  };

  return (
    <section className="pratiche-page">
      <PrivatePageHeader
        eyebrow="Gestione pratiche"
        title={
          nomeClienteFiltro
            ? `Pratiche di ${nomeClienteFiltro}`
            : "Pratiche"
        }
        description={
          nomeClienteFiltro
            ? "Consulta e monitora tutte le pratiche collegate a questo cliente."
            : "Gestisci le pratiche del CAF, monitora lo stato delle lavorazioni e tieni sotto controllo clienti, responsabili e scadenze."
        }
        action={
          <Button
            type="button"
            className="pratiche-page__new-button"
            onClick={() =>
              setMostraNuovaPratica(
                true,
              )
            }
          >
            <FiPlus />

            <span>
              Nuova pratica
            </span>
          </Button>
        }
      />

      {clienteIdDaUrl && (
        <section className="pratiche-client-filter">
          <span className="pratiche-client-filter__icon">
            <FiUser />
          </span>

          <div className="pratiche-client-filter__content">
            <span>
              Pratiche filtrate per cliente
            </span>

            <strong>
              {nomeClienteFiltro ||
                "Caricamento cliente..."}
            </strong>
          </div>

          <Button
            type="button"
            variant="link"
            className="pratiche-client-filter__clear"
            onClick={
              rimuoviFiltroCliente
            }
          >
            <FiX />

            <span>
              Mostra tutte
            </span>
          </Button>
        </section>
      )}

      <section className="pratiche-panel">
        <header className="pratiche-panel__header">
          <div className="pratiche-toolbar">
            <div className="pratiche-search">
              <FiSearch />

              <input
                type="search"
                value={ricerca}
                onChange={(event) =>
                  setRicerca(
                    event.target.value,
                  )
                }
                placeholder="Cerca pratica o cliente..."
                aria-label="Cerca pratica"
              />
            </div>

            <Form.Select
              className="pratiche-filter"
              value={stato}
              onChange={(event) =>
                setStato(
                  event.target
                    .value as
                    | StatoPratica
                    | "",
                )
              }
              aria-label="Filtra per stato"
            >
              <option value="">
                Tutti gli stati
              </option>

              {STATI_PRATICA.map(
                (valore) => (
                  <option
                    key={valore}
                    value={valore}
                  >
                    {
                      ETICHETTE_STATO_PRATICA[
                        valore
                      ]
                    }
                  </option>
                ),
              )}
            </Form.Select>
          </div>

          <div className="pratiche-count">
            <FiBriefcase />

            <span>
              {totaleVisualizzato}
            </span>

            <small>
              {totaleVisualizzato === 1
                ? "pratica"
                : "pratiche"}
            </small>
          </div>
        </header>

        {erroreAttivo && (
          <Alert
            variant="danger"
            className="pratiche-panel__alert"
          >
            {erroreAttivo}
          </Alert>
        )}

        {caricamentoAttivo && elencoVisualizzato.length === 0 ? (
          <div className="pratiche-loading">
            <Spinner
              animation="border"
              size="sm"
            />

            <p>
              Caricamento pratiche...
            </p>
          </div>
        ) : (
          <div className="pratiche-table-wrapper">
            <Table
              responsive
              className="pratiche-table"
            >
              <thead>
                <tr>
                  <th>
                    Pratica
                  </th>

                  <th>
                    Cliente
                  </th>

                  <th>
                    Servizio
                  </th>

                  <th>
                    Responsabile
                  </th>

                  <th>
                    Priorità
                  </th>

                  <th>
                    Stato
                  </th>

                  <th>
                    Scadenza
                  </th>
                </tr>
              </thead>

              <tbody>
                {elencoVisualizzato.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="pratiche-table__empty"
                    >
                      Nessuna pratica
                      trovata.
                    </td>
                  </tr>
                ) : (
                  elencoVisualizzato.map(
                    (pratica) => (
                      <tr
                        key={
                          pratica.id
                        }
                        className="pratiche-table__row"
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          navigate(
                            `/pratiche/${pratica.id}`,
                          )
                        }
                        onKeyDown={(event) => {
                          if (
                            event.key === "Enter" ||
                            event.key === " "
                          ) {
                            event.preventDefault();

                            navigate(
                              `/pratiche/${pratica.id}`,
                            );
                          }
                        }}
                      >
                        <td>
                          <div className="pratiche-table__practice">
                            <span className="pratiche-table__practice-icon">
                              <FiBriefcase />
                            </span>

                            <div>
                              <strong>
                                {
                                  pratica.oggetto
                                }
                              </strong>

                              <span>
                                {
                                  pratica.numeroPratica
                                }
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="pratiche-table__person">
                            <FiUser />

                            <span>
                              {
                                pratica
                                  .cliente
                                  .nome
                              }{" "}
                              {
                                pratica
                                  .cliente
                                  .cognome
                              }
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="pratiche-table__service">
                            <strong>
                              {
                                pratica
                                  .servizio
                                  .nome
                              }
                            </strong>

                            <span>
                              {
                                pratica
                                  .servizio
                                  .macroAreaNome
                              }
                            </span>
                          </div>
                        </td>

                        <td>
                          {pratica.responsabile ? (
                            <div className="pratiche-table__responsible">
                              <span className="pratiche-table__avatar">
                                {pratica.responsabile.nome
                                  .charAt(
                                    0,
                                  )
                                  .toUpperCase()}

                                {pratica.responsabile.cognome
                                  .charAt(
                                    0,
                                  )
                                  .toUpperCase()}
                              </span>

                              <span>
                                {
                                  pratica
                                    .responsabile
                                    .nome
                                }{" "}
                                {
                                  pratica
                                    .responsabile
                                    .cognome
                                }
                              </span>
                            </div>
                          ) : (
                            <span className="pratiche-table__muted">
                              Non assegnata
                            </span>
                          )}
                        </td>

                        <td>
                          <span
                            className={`pratiche-priority pratiche-priority--${pratica.priorita.toLowerCase()}`}
                          >
                            {
                              ETICHETTE_PRIORITA_PRATICA[
                                pratica
                                  .priorita
                              ]
                            }
                          </span>
                        </td>

                        <td>
                          <span
                            className={`pratiche-status pratiche-status--${pratica.stato
                              .toLowerCase()
                              .replaceAll(
                                "_",
                                "-",
                              )}`}
                          >
                            {
                              ETICHETTE_STATO_PRATICA[
                                pratica
                                  .stato
                              ]
                            }
                          </span>
                        </td>

                        <td>
                          <div className="pratiche-table__deadline">
                            <FiCalendar />

                            <span>
                              {formattaData(
                                pratica.dataScadenza,
                              )}
                            </span>
                          </div>
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

      <NuovaPraticaModal
        show={mostraNuovaPratica}
        onHide={() =>
          setMostraNuovaPratica(
            false,
          )
        }
        onPraticaCreata={() => {
          if (clienteIdDaUrl) {
            void caricaPraticheCliente(
              clienteIdDaUrl,
            );

            return;
          }

          void dispatch(
            caricaPratiche({
              q:
                ricerca.trim() ||
                undefined,
              stato:
                stato ||
                undefined,
              page: 0,
              size: 10,
              sort: "creatoIl,desc",
            }),
          );
        }}
      />
    </section>
  );
};

export default PratichePage;
