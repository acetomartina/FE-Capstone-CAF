import {
  useEffect,
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
} from "react-icons/fi";

import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";

import PrivatePageHeader from "../../components/private/PrivatePageHeader";
import NuovaPraticaModal from "../../features/pratiche/components/NuovaPraticaModal";

import {
  caricaPratiche,
} from "../../features/pratiche";

import {
  ETICHETTE_PRIORITA_PRATICA,
  ETICHETTE_STATO_PRATICA,
} from "../../features/pratiche/constants/praticheConstants";

import type {
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

  const [searchParams] =
  useSearchParams();

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

  useEffect(() => {
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
  ]);

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
        title="Pratiche"
        description="Gestisci le pratiche del CAF, monitora lo stato delle lavorazioni e tieni sotto controllo clienti, responsabili e scadenze."
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
              {totaleElementi}
            </span>

            <small>
              {totaleElementi === 1
                ? "pratica"
                : "pratiche"}
            </small>
          </div>
        </header>

        {errore && (
          <Alert
            variant="danger"
            className="pratiche-panel__alert"
          >
            {errore}
          </Alert>
        )}

        {caricamento && elenco.length === 0 ? (
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
                {elenco.length ===
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
                  elenco.map(
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