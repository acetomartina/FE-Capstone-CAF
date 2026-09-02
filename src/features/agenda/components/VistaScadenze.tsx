import type { NavigateFunction } from "react-router-dom";
import { Alert, Spinner, Table } from "react-bootstrap";
import {
  FiAlertCircle,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiExternalLink,
  FiSearch,
  FiUser,
} from "react-icons/fi";

import {
  ETICHETTE_PRIORITA_PRATICA,
  ETICHETTE_STATO_PRATICA,
} from "../../pratiche/constants/praticheConstants";

import type { Pratica } from "../../pratiche/types/praticheTypes";

import {
  classeScadenza,
  descrizioneScadenza,
  formattaDataScadenza,
  type FiltroPeriodo,
} from "../agendaHelpers";

interface VistaScadenzeProps {
  scadenzeVisualizzate: Pratica[];

  /* Conteggi per le quattro schede in cima, che fanno anche da filtro. */
  riepilogoScadenze: {
    scadute: number;
    oggi: number;
    setteGiorni: number;
    trentaGiorni: number;
  };

  filtroPeriodo: FiltroPeriodo;
  setFiltroPeriodo: (filtro: FiltroPeriodo) => void;

  ricerca: string;
  setRicerca: (valore: string) => void;

  caricamentoScadenze: boolean;
  erroreScadenze: string | null;

  navigate: NavigateFunction;
}

/**
 * Scadenze delle pratiche: riepilogo per urgenza e tabella filtrabile.
 *
 * È una delle due metà dell'agenda. Le due viste condividono la casella
 * di ricerca ma nient'altro, per questo vivono in file separati.
 */
const VistaScadenze = ({
  scadenzeVisualizzate,
  riepilogoScadenze,
  filtroPeriodo,
  setFiltroPeriodo,
  ricerca,
  setRicerca,
  caricamentoScadenze,
  erroreScadenze,
  navigate,
}: VistaScadenzeProps) => {
  return (
    <>
          <section className="agenda-summary">
            <button
              type="button"
              className={`agenda-summary__card agenda-summary__card--overdue ${
                filtroPeriodo ===
                "SCADUTE"
                  ? "is-active"
                  : ""
              }`}
              onClick={() =>
                setFiltroPeriodo(
                  filtroPeriodo ===
                    "SCADUTE"
                    ? "TUTTE"
                    : "SCADUTE",
                )
              }
            >
              <span className="agenda-summary__icon">
                <FiAlertCircle />
              </span>

              <span>
                <small>Scadute</small>
                <strong>
                  {
                    riepilogoScadenze
                      .scadute
                  }
                </strong>
              </span>
            </button>

            <button
              type="button"
              className={`agenda-summary__card agenda-summary__card--today ${
                filtroPeriodo === "OGGI"
                  ? "is-active"
                  : ""
              }`}
              onClick={() =>
                setFiltroPeriodo(
                  filtroPeriodo ===
                    "OGGI"
                    ? "TUTTE"
                    : "OGGI",
                )
              }
            >
              <span className="agenda-summary__icon">
                <FiCalendar />
              </span>

              <span>
                <small>Oggi</small>
                <strong>
                  {
                    riepilogoScadenze
                      .oggi
                  }
                </strong>
              </span>
            </button>

            <button
              type="button"
              className={`agenda-summary__card agenda-summary__card--week ${
                filtroPeriodo ===
                "SETTE_GIORNI"
                  ? "is-active"
                  : ""
              }`}
              onClick={() =>
                setFiltroPeriodo(
                  filtroPeriodo ===
                    "SETTE_GIORNI"
                    ? "TUTTE"
                    : "SETTE_GIORNI",
                )
              }
            >
              <span className="agenda-summary__icon">
                <FiClock />
              </span>

              <span>
                <small>
                  Prossimi 7 giorni
                </small>

                <strong>
                  {
                    riepilogoScadenze
                      .setteGiorni
                  }
                </strong>
              </span>
            </button>

            <button
              type="button"
              className={`agenda-summary__card agenda-summary__card--month ${
                filtroPeriodo ===
                "TRENTA_GIORNI"
                  ? "is-active"
                  : ""
              }`}
              onClick={() =>
                setFiltroPeriodo(
                  filtroPeriodo ===
                    "TRENTA_GIORNI"
                    ? "TUTTE"
                    : "TRENTA_GIORNI",
                )
              }
            >
              <span className="agenda-summary__icon">
                <FiCheckCircle />
              </span>

              <span>
                <small>
                  Prossimi 30 giorni
                </small>

                <strong>
                  {
                    riepilogoScadenze
                      .trentaGiorni
                  }
                </strong>
              </span>
            </button>
          </section>

          <section className="agenda-panel">
            <header className="agenda-panel__header">
              <div className="agenda-search">
                <FiSearch />

                <input
                  type="search"
                  value={ricerca}
                  onChange={(event) =>
                    setRicerca(
                      event.target.value,
                    )
                  }
                  placeholder="Cerca cliente, pratica o servizio..."
                />
              </div>

              <div className="agenda-count">
                <FiCalendar />

                <strong>
                  {
                    scadenzeVisualizzate
                      .length
                  }
                </strong>

                <span>
                  {scadenzeVisualizzate
                    .length === 1
                    ? "scadenza"
                    : "scadenze"}
                </span>
              </div>
            </header>

            {erroreScadenze && (
              <Alert
                variant="danger"
                className="agenda-panel__alert"
              >
                {erroreScadenze}
              </Alert>
            )}

            {caricamentoScadenze ? (
              <div className="agenda-loading">
                <Spinner
                  animation="border"
                  size="sm"
                />

                <p>
                  Caricamento scadenze...
                </p>
              </div>
            ) : (
              <div className="agenda-table-wrapper">
                <Table className="agenda-table">
                  <thead>
                    <tr>
                      <th>Scadenza</th>
                      <th>Pratica</th>
                      <th>Cliente</th>
                      <th>Responsabile</th>
                      <th>Priorità</th>
                      <th>Stato</th>
                      <th />
                    </tr>
                  </thead>

                  <tbody>
                    {scadenzeVisualizzate.length ===
                    0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="agenda-table__empty"
                        >
                          Nessuna scadenza
                          trovata.
                        </td>
                      </tr>
                    ) : (
                      scadenzeVisualizzate.map(
                        (pratica) => (
                          <tr
                            key={
                              pratica.id
                            }
                            className="agenda-table__row"
                            onClick={() =>
                              navigate(
                                `/pratiche/${pratica.id}`,
                              )
                            }
                          >
                            <td>
                              <div
                                className={`agenda-deadline agenda-deadline--${classeScadenza(
                                  pratica.dataScadenza!,
                                )}`}
                              >
                                <span className="agenda-deadline__icon">
                                  <FiCalendar />
                                </span>

                                <div>
                                  <strong>
                                    {formattaDataScadenza(
                                      pratica.dataScadenza!,
                                    )}
                                  </strong>

                                  <span>
                                    {descrizioneScadenza(
                                      pratica.dataScadenza!,
                                    )}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td>
                              <div className="agenda-table__practice">
                                <span className="agenda-table__practice-icon">
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
                                    }{" "}
                                    ·{" "}
                                    {
                                      pratica.servizio.nome
                                    }
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td>
                              <div className="agenda-table__person">
                                <FiUser />

                                <span>
                                  {
                                    pratica.cliente.nome
                                  }{" "}
                                  {
                                    pratica.cliente.cognome
                                  }
                                </span>
                              </div>
                            </td>

                            <td>
                              {pratica.responsabile ? (
                                <div className="agenda-table__responsible">
                                  <span className="agenda-table__avatar">
                                    {pratica.responsabile.nome
                                      .charAt(0)
                                      .toUpperCase()}
                                    {pratica.responsabile.cognome
                                      .charAt(0)
                                      .toUpperCase()}
                                  </span>

                                  <span>
                                    {
                                      pratica.responsabile.nome
                                    }{" "}
                                    {
                                      pratica.responsabile.cognome
                                    }
                                  </span>
                                </div>
                              ) : (
                                <span className="agenda-table__muted">
                                  Non assegnata
                                </span>
                              )}
                            </td>

                            <td>
                              <span
                                className={`agenda-priority agenda-priority--${pratica.priorita.toLowerCase()}`}
                              >
                                {
                                  ETICHETTE_PRIORITA_PRATICA[
                                    pratica.priorita
                                  ]
                                }
                              </span>
                            </td>

                            <td>
                              <span
                                className={`agenda-status agenda-status--${pratica.stato
                                  .toLowerCase()
                                  .replaceAll(
                                    "_",
                                    "-",
                                  )}`}
                              >
                                {
                                  ETICHETTE_STATO_PRATICA[
                                    pratica.stato
                                  ]
                                }
                              </span>
                            </td>

                            <td>
                              <button
                                type="button"
                                className="agenda-table__open"
                                onClick={(event) => {
                                  event.stopPropagation();

                                  navigate(
                                    `/pratiche/${pratica.id}`,
                                  );
                                }}
                              >
                                <FiExternalLink />
                              </button>
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
        
    </>
  );
};

export default VistaScadenze;
