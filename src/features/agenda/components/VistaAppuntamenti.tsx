import type { NavigateFunction } from "react-router-dom";
import { Alert, Form, Spinner, Table } from "react-bootstrap";
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiExternalLink,
  FiMapPin,
  FiPhone,
  FiSearch,
  FiUser,
  FiVideo,
} from "react-icons/fi";

import type {
  Appuntamento,
  StatoAppuntamento,
} from "../../appuntamenti/types/appuntamentiTypes";

import {
  ETICHETTE_STATO_APPUNTAMENTO,
  formattaDataAppuntamento,
  formattaOra,
  STATI_APPUNTAMENTO,
  type FiltroAppuntamenti,
} from "../agendaHelpers";

interface VistaAppuntamentiProps {
  appuntamentiVisualizzati: Appuntamento[];

  riepilogoAppuntamenti: {
    oggi: number;
    setteGiorni: number;
    confermati: number;
    completati: number;
  };

  filtroAppuntamenti: FiltroAppuntamenti;
  setFiltroAppuntamenti: (filtro: FiltroAppuntamenti) => void;

  ricerca: string;
  setRicerca: (valore: string) => void;

  statoAppuntamento: StatoAppuntamento | "";
  setStatoAppuntamento: (stato: StatoAppuntamento | "") => void;

  /* Id dell'appuntamento con un cambio di stato in volo: disabilita la
     sola tendina di quella riga, non l'intera tabella. */
  appuntamentoInAggiornamento: number | null;
  aggiornaStatoAppuntamento: (
    appuntamento: Appuntamento,
    stato: StatoAppuntamento,
  ) => void;

  caricamentoAppuntamenti: boolean;
  erroreAppuntamenti: string | null;

  navigate: NavigateFunction;
}

/**
 * Appuntamenti della sede: riepilogo per periodo e tabella con cambio
 * di stato in linea.
 */
const VistaAppuntamenti = ({
  appuntamentiVisualizzati,
  riepilogoAppuntamenti,
  filtroAppuntamenti,
  setFiltroAppuntamenti,
  ricerca,
  setRicerca,
  statoAppuntamento,
  setStatoAppuntamento,
  appuntamentoInAggiornamento,
  aggiornaStatoAppuntamento,
  caricamentoAppuntamenti,
  erroreAppuntamenti,
  navigate,
}: VistaAppuntamentiProps) => {
  return (
    <>
          <section className="agenda-summary">
            {[
              {
                filtro:
                  "OGGI" as const,
                etichetta: "Oggi",
                valore:
                  riepilogoAppuntamenti.oggi,
                icona: <FiCalendar />,
                classe: "today",
              },
              {
                filtro:
                  "SETTE_GIORNI" as const,
                etichetta:
                  "Prossimi 7 giorni",
                valore:
                  riepilogoAppuntamenti.setteGiorni,
                icona: <FiClock />,
                classe: "week",
              },
              {
                filtro:
                  "CONFERMATI" as const,
                etichetta:
                  "Confermati",
                valore:
                  riepilogoAppuntamenti.confermati,
                icona:
                  <FiCheckCircle />,
                classe: "month",
              },
              {
                filtro:
                  "COMPLETATI" as const,
                etichetta:
                  "Completati",
                valore:
                  riepilogoAppuntamenti.completati,
                icona:
                  <FiCheckCircle />,
                classe: "completed",
              },
            ].map((elemento) => (
              <button
                key={elemento.filtro}
                type="button"
                className={`agenda-summary__card agenda-summary__card--${elemento.classe} ${
                  filtroAppuntamenti ===
                  elemento.filtro
                    ? "is-active"
                    : ""
                }`}
                onClick={() =>
                  setFiltroAppuntamenti(
                    filtroAppuntamenti ===
                      elemento.filtro
                      ? "TUTTI"
                      : elemento.filtro,
                  )
                }
              >
                <span className="agenda-summary__icon">
                  {elemento.icona}
                </span>

                <span>
                  <small>
                    {elemento.etichetta}
                  </small>

                  <strong>
                    {elemento.valore}
                  </strong>
                </span>
              </button>
            ))}
          </section>

          <section className="agenda-panel">
            <header className="agenda-panel__header">
              <div className="agenda-appointments-toolbar">
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
                    placeholder="Cerca appuntamento o cliente..."
                  />
                </div>

                <Form.Select
                  className="agenda-filter"
                  value={
                    statoAppuntamento
                  }
                  onChange={(event) =>
                    setStatoAppuntamento(
                      event.target
                        .value as
                        | StatoAppuntamento
                        | "",
                    )
                  }
                >
                  <option value="">
                    Tutti gli stati
                  </option>

                  {STATI_APPUNTAMENTO.map(
                    (stato) => (
                      <option
                        key={stato}
                        value={stato}
                      >
                        {
                          ETICHETTE_STATO_APPUNTAMENTO[
                            stato
                          ]
                        }
                      </option>
                    ),
                  )}
                </Form.Select>
              </div>

              <div className="agenda-count">
                <FiClock />

                <strong>
                  {
                    appuntamentiVisualizzati
                      .length
                  }
                </strong>

                <span>
                  {appuntamentiVisualizzati
                    .length === 1
                    ? "appuntamento"
                    : "appuntamenti"}
                </span>
              </div>
            </header>

            {erroreAppuntamenti && (
              <Alert
                variant="danger"
                className="agenda-panel__alert"
              >
                {erroreAppuntamenti}
              </Alert>
            )}

            {caricamentoAppuntamenti ? (
              <div className="agenda-loading">
                <Spinner
                  animation="border"
                  size="sm"
                />

                <p>
                  Caricamento appuntamenti...
                </p>
              </div>
            ) : (
              <div className="agenda-table-wrapper">
                <Table className="agenda-table agenda-appointments-table">
                  <thead>
                    <tr>
                      <th>Data e ora</th>
                      <th>Appuntamento</th>
                      <th>Cliente</th>
                      <th>Pratica</th>
                      <th>Modalità</th>
                      <th>Stato</th>
                    </tr>
                  </thead>

                  <tbody>
                    {appuntamentiVisualizzati.length ===
                    0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="agenda-table__empty"
                        >
                          Nessun appuntamento
                          trovato.
                        </td>
                      </tr>
                    ) : (
                      appuntamentiVisualizzati.map(
                        (appuntamento) => (
                          <tr
                            key={
                              appuntamento.id
                            }
                          >
                            <td>
                              <div className="agenda-appointment-time">
                                <span>
                                  <FiCalendar />
                                </span>

                                <div>
                                  <strong>
                                    {formattaDataAppuntamento(
                                      appuntamento.inizio,
                                    )}
                                  </strong>

                                  <small>
                                    {formattaOra(
                                      appuntamento.inizio,
                                    )}
                                    {" – "}
                                    {formattaOra(
                                      appuntamento.fine,
                                    )}
                                  </small>
                                </div>
                              </div>
                            </td>

                            <td>
                              <div className="agenda-appointment-title">
                                <strong>
                                  {
                                    appuntamento.titolo
                                  }
                                </strong>

                                <span>
                                  {
                                    appuntamento.servizioNome ??
                                    "Attività CAF"
                                  }
                                </span>
                              </div>
                            </td>

                            <td>
                              <div className="agenda-table__person">
                                <FiUser />

                                <span>
                                  {
                                    appuntamento.clienteNome
                                  }{" "}
                                  {
                                    appuntamento.clienteCognome
                                  }
                                </span>
                              </div>
                            </td>

                            <td>
                              {appuntamento.praticaId ? (
                                <button
                                  type="button"
                                  className="agenda-practice-link"
                                  onClick={() =>
                                    navigate(
                                      `/pratiche/${appuntamento.praticaId}`,
                                    )
                                  }
                                >
                                  {
                                    appuntamento.numeroPratica
                                  }
                                  <FiExternalLink />
                                </button>
                              ) : (
                                <span className="agenda-table__muted">
                                  Nessuna pratica
                                </span>
                              )}
                            </td>

                            <td>
                              <span className={`agenda-mode agenda-mode--${appuntamento.modalita.toLowerCase().replaceAll("_", "-")}`}>
                                {appuntamento.modalita ===
                                  "IN_SEDE" && (
                                  <FiMapPin />
                                )}

                                {appuntamento.modalita ===
                                  "TELEFONICO" && (
                                  <FiPhone />
                                )}

                                {appuntamento.modalita ===
                                  "ONLINE" && (
                                  <FiVideo />
                                )}

                                {appuntamento.modalita ===
                                  "IN_SEDE"
                                  ? appuntamento.luogo ??
                                    "In sede"
                                  : appuntamento.modalita ===
                                      "TELEFONICO"
                                    ? "Telefonico"
                                    : "Online"}
                              </span>
                            </td>

                            <td>
                              <div className="agenda-appointment-status">
                                <Form.Select
                                  value={
                                    appuntamento.stato
                                  }
                                  disabled={
                                    appuntamentoInAggiornamento ===
                                      appuntamento.id ||
                                    appuntamento.stato ===
                                      "ANNULLATO"
                                  }
                                  className={`agenda-appointment-status__select agenda-appointment-status__select--${appuntamento.stato.toLowerCase()}`}
                                  onChange={(event) =>
                                    void aggiornaStatoAppuntamento(
                                      appuntamento,
                                      event.target
                                        .value as StatoAppuntamento,
                                    )
                                  }
                                >
                                  <option value="PROGRAMMATO">
                                    Programmato
                                  </option>

                                  <option value="CONFERMATO">
                                    Confermato
                                  </option>

                                  <option value="COMPLETATO">
                                    Completato
                                  </option>

                                  {appuntamento.stato ===
                                    "ANNULLATO" && (
                                    <option value="ANNULLATO">
                                      Annullato
                                    </option>
                                  )}
                                </Form.Select>

                                {appuntamentoInAggiornamento ===
                                  appuntamento.id && (
                                  <Spinner
                                    animation="border"
                                    size="sm"
                                  />
                                )}
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
        
    </>
  );
};

export default VistaAppuntamenti;
