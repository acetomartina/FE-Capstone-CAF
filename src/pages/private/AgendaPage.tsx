import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Button,
  Form,
  Spinner,
  Table,
} from "react-bootstrap";

import {
  FiAlertCircle,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiExternalLink,
  FiMapPin,
  FiPhone,
  FiPlus,
  FiSearch,
  FiUser,
  FiVideo,
} from "react-icons/fi";

import {
  useNavigate,
} from "react-router-dom";

import PrivatePageHeader
  from "../../components/private/PrivatePageHeader";

import NuovoAppuntamentoModal
  from "../../features/appuntamenti/components/NuovoAppuntamentoModal";

import {
  appuntamentiService,
} from "../../features/appuntamenti/api/appuntamentiService";

import type {
  Appuntamento,
  StatoAppuntamento,
} from "../../features/appuntamenti/types/appuntamentiTypes";

import {
  praticheService,
} from "../../features/pratiche/api/praticheService";

import {
  ETICHETTE_PRIORITA_PRATICA,
  ETICHETTE_STATO_PRATICA,
} from "../../features/pratiche/constants/praticheConstants";

import type {
  Pratica,
} from "../../features/pratiche/types/praticheTypes";

import "./AgendaPage.css";

type VistaAgenda =
  | "SCADENZE"
  | "APPUNTAMENTI";

type FiltroPeriodo =
  | "TUTTE"
  | "SCADUTE"
  | "OGGI"
  | "SETTE_GIORNI"
  | "TRENTA_GIORNI";

type FiltroAppuntamenti =
  | "TUTTI"
  | "OGGI"
  | "SETTE_GIORNI"
  | "CONFERMATI"
  | "COMPLETATI";

const MILLISECONDI_GIORNO =
  1000 * 60 * 60 * 24;

const ETICHETTE_STATO_APPUNTAMENTO:
Record<StatoAppuntamento, string> = {
  PROGRAMMATO: "Programmato",
  CONFERMATO: "Confermato",
  COMPLETATO: "Completato",
  ANNULLATO: "Annullato",
};

const STATI_APPUNTAMENTO:
StatoAppuntamento[] = [
  "PROGRAMMATO",
  "CONFERMATO",
  "COMPLETATO",
  "ANNULLATO",
];

const normalizzaData = (
  data: Date,
): Date =>
  new Date(
    data.getFullYear(),
    data.getMonth(),
    data.getDate(),
  );

const creaDataLocale = (
  valore: string,
): Date => {
  const [
    anno,
    mese,
    giorno,
  ] = valore.split("-").map(Number);

  return new Date(
    anno,
    mese - 1,
    giorno,
  );
};

const distanzaTraDate = (
  data: Date,
): number => {
  const oggi =
    normalizzaData(new Date());

  const destinazione =
    normalizzaData(data);

  return Math.round(
    (
      destinazione.getTime() -
      oggi.getTime()
    ) / MILLISECONDI_GIORNO,
  );
};

const distanzaInGiorni = (
  dataScadenza: string,
): number =>
  distanzaTraDate(
    creaDataLocale(dataScadenza),
  );

const formattaDataScadenza = (
  valore: string,
): string =>
  new Intl.DateTimeFormat(
    "it-IT",
    {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(
    creaDataLocale(valore),
  );

const formattaDataAppuntamento = (
  valore: string,
): string =>
  new Intl.DateTimeFormat(
    "it-IT",
    {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(
    new Date(valore),
  );

const formattaOra = (
  valore: string,
): string =>
  new Intl.DateTimeFormat(
    "it-IT",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(
    new Date(valore),
  );

const descrizioneScadenza = (
  dataScadenza: string,
): string => {
  const distanza =
    distanzaInGiorni(dataScadenza);

  if (distanza < 0) {
    const giorni = Math.abs(distanza);

    return giorni === 1
      ? "Scaduta ieri"
      : `Scaduta da ${giorni} giorni`;
  }

  if (distanza === 0) {
    return "Scade oggi";
  }

  if (distanza === 1) {
    return "Scade domani";
  }

  return `Tra ${distanza} giorni`;
};

const classeScadenza = (
  dataScadenza: string,
): string => {
  const distanza =
    distanzaInGiorni(dataScadenza);

  if (distanza < 0) {
    return "overdue";
  }

  if (distanza === 0) {
    return "today";
  }

  if (distanza <= 7) {
    return "soon";
  }

  return "future";
};

const praticaAperta = (
  pratica: Pratica,
): boolean =>
  pratica.stato !== "COMPLETATA" &&
  pratica.stato !== "ANNULLATA";

const AgendaPage = () => {
  const navigate = useNavigate();

  const [
    vista,
    setVista,
  ] = useState<VistaAgenda>(
    "SCADENZE",
  );

  const [
    pratiche,
    setPratiche,
  ] = useState<Pratica[]>([]);

  const [
    appuntamenti,
    setAppuntamenti,
  ] = useState<Appuntamento[]>([]);

  const [
    ricerca,
    setRicerca,
  ] = useState("");

  const [
    filtroPeriodo,
    setFiltroPeriodo,
  ] = useState<FiltroPeriodo>(
    "TUTTE",
  );

  const [
    filtroAppuntamenti,
    setFiltroAppuntamenti,
  ] = useState<FiltroAppuntamenti>(
    "TUTTI",
  );

  const [
    statoAppuntamento,
    setStatoAppuntamento,
  ] = useState<
    StatoAppuntamento | ""
  >("");

  const [
    mostraNuovoAppuntamento,
    setMostraNuovoAppuntamento,
  ] = useState(false);

  const [
    appuntamentoInAggiornamento,
    setAppuntamentoInAggiornamento,
  ] = useState<number | null>(null);

  const [
    caricamentoScadenze,
    setCaricamentoScadenze,
  ] = useState(true);

  const [
    caricamentoAppuntamenti,
    setCaricamentoAppuntamenti,
  ] = useState(true);

  const [
    erroreScadenze,
    setErroreScadenze,
  ] = useState<string | null>(null);

  const [
    erroreAppuntamenti,
    setErroreAppuntamenti,
  ] = useState<string | null>(null);

  useEffect(() => {
    const caricaScadenze =
      async () => {
        try {
          setCaricamentoScadenze(
            true,
          );

          setErroreScadenze(null);

          const risposta =
            await praticheService
              .trovaTutte({
                page: 0,
                size: 500,
                sort:
                  "dataScadenza,asc",
              });

          setPratiche(
            risposta.content,
          );
        } catch {
          setPratiche([]);

          setErroreScadenze(
            "Non è stato possibile caricare le scadenze.",
          );
        } finally {
          setCaricamentoScadenze(
            false,
          );
        }
      };

    void caricaScadenze();
  }, []);

  const caricaAppuntamenti =
    useCallback(async () => {
      try {
        setCaricamentoAppuntamenti(
          true,
        );

        setErroreAppuntamenti(null);

        const risposta =
          await appuntamentiService
            .trovaTutti();

        setAppuntamenti(risposta);
      } catch {
        setAppuntamenti([]);

        setErroreAppuntamenti(
          "Non è stato possibile caricare gli appuntamenti.",
        );
      } finally {
        setCaricamentoAppuntamenti(
          false,
        );
      }
    }, []);

  useEffect(() => {
    void caricaAppuntamenti();
  }, [caricaAppuntamenti]);

  const praticheConScadenza =
    useMemo(
      () =>
        pratiche.filter(
          (pratica) =>
            pratica.dataScadenza !==
              null &&
            praticaAperta(pratica),
        ),
      [pratiche],
    );

  const riepilogoScadenze =
    useMemo(() => {
      let scadute = 0;
      let oggi = 0;
      let setteGiorni = 0;
      let trentaGiorni = 0;

      praticheConScadenza.forEach(
        (pratica) => {
          const distanza =
            distanzaInGiorni(
              pratica.dataScadenza!,
            );

          if (distanza < 0) {
            scadute += 1;
          }

          if (distanza === 0) {
            oggi += 1;
          }

          if (
            distanza >= 1 &&
            distanza <= 7
          ) {
            setteGiorni += 1;
          }

          if (
            distanza >= 1 &&
            distanza <= 30
          ) {
            trentaGiorni += 1;
          }
        },
      );

      return {
        scadute,
        oggi,
        setteGiorni,
        trentaGiorni,
      };
    }, [praticheConScadenza]);

  const riepilogoAppuntamenti =
    useMemo(() => {
      let oggi = 0;
      let setteGiorni = 0;
      let confermati = 0;
      let completati = 0;

      appuntamenti.forEach(
        (appuntamento) => {
          const distanza =
            distanzaTraDate(
              new Date(
                appuntamento.inizio,
              ),
            );

          if (
            distanza === 0 &&
            appuntamento.stato !==
              "ANNULLATO"
          ) {
            oggi += 1;
          }

          if (
            distanza >= 0 &&
            distanza <= 7 &&
            appuntamento.stato !==
              "ANNULLATO"
          ) {
            setteGiorni += 1;
          }

          if (
            appuntamento.stato ===
            "CONFERMATO"
          ) {
            confermati += 1;
          }

          if (
            appuntamento.stato ===
            "COMPLETATO"
          ) {
            completati += 1;
          }
        },
      );

      return {
        oggi,
        setteGiorni,
        confermati,
        completati,
      };
    }, [appuntamenti]);

  const scadenzeVisualizzate =
    useMemo(() => {
      const termine =
        ricerca
          .trim()
          .toLocaleLowerCase(
            "it-IT",
          );

      return praticheConScadenza
        .filter((pratica) => {
          const distanza =
            distanzaInGiorni(
              pratica.dataScadenza!,
            );

          const corrispondePeriodo =
            filtroPeriodo === "TUTTE" ||
            (
              filtroPeriodo ===
                "SCADUTE" &&
              distanza < 0
            ) ||
            (
              filtroPeriodo ===
                "OGGI" &&
              distanza === 0
            ) ||
            (
              filtroPeriodo ===
                "SETTE_GIORNI" &&
              distanza >= 1 &&
              distanza <= 7
            ) ||
            (
              filtroPeriodo ===
                "TRENTA_GIORNI" &&
              distanza >= 1 &&
              distanza <= 30
            );

          if (!corrispondePeriodo) {
            return false;
          }

          if (!termine) {
            return true;
          }

          const contenuto = [
            pratica.numeroPratica,
            pratica.oggetto,
            pratica.cliente.nome,
            pratica.cliente.cognome,
            pratica.servizio.nome,
            pratica.responsabile?.nome,
            pratica.responsabile
              ?.cognome,
          ]
            .filter(Boolean)
            .join(" ")
            .toLocaleLowerCase(
              "it-IT",
            );

          return contenuto.includes(
            termine,
          );
        })
        .sort((prima, seconda) =>
          prima.dataScadenza!
            .localeCompare(
              seconda.dataScadenza!,
            ),
        );
    }, [
      filtroPeriodo,
      praticheConScadenza,
      ricerca,
    ]);

  const appuntamentiVisualizzati =
    useMemo(() => {
      const termine =
        ricerca
          .trim()
          .toLocaleLowerCase(
            "it-IT",
          );

      return appuntamenti
        .filter((appuntamento) => {
          const distanza =
            distanzaTraDate(
              new Date(
                appuntamento.inizio,
              ),
            );

          const corrispondeFiltro =
            filtroAppuntamenti ===
              "TUTTI" ||
            (
              filtroAppuntamenti ===
                "OGGI" &&
              distanza === 0
            ) ||
            (
              filtroAppuntamenti ===
                "SETTE_GIORNI" &&
              distanza >= 0 &&
              distanza <= 7
            ) ||
            (
              filtroAppuntamenti ===
                "CONFERMATI" &&
              appuntamento.stato ===
                "CONFERMATO"
            ) ||
            (
              filtroAppuntamenti ===
                "COMPLETATI" &&
              appuntamento.stato ===
                "COMPLETATO"
            );

          if (!corrispondeFiltro) {
            return false;
          }

          if (
            statoAppuntamento &&
            appuntamento.stato !==
              statoAppuntamento
          ) {
            return false;
          }

          if (!termine) {
            return true;
          }

          const contenuto = [
            appuntamento.titolo,
            appuntamento
              .clienteNome,
            appuntamento
              .clienteCognome,
            appuntamento
              .numeroPratica,
            appuntamento
              .oggettoPratica,
            appuntamento
              .servizioNome,
          ]
            .filter(Boolean)
            .join(" ")
            .toLocaleLowerCase(
              "it-IT",
            );

          return contenuto.includes(
            termine,
          );
        })
        .sort((prima, seconda) =>
          prima.inizio.localeCompare(
            seconda.inizio,
          ),
        );
    }, [
      appuntamenti,
      filtroAppuntamenti,
      ricerca,
      statoAppuntamento,
    ]);

  const aggiornaStatoAppuntamento =
    async (
      appuntamento: Appuntamento,
      nuovoStato:
        StatoAppuntamento,
    ) => {
      if (
        nuovoStato ===
        appuntamento.stato
      ) {
        return;
      }

      if (
        nuovoStato ===
        "ANNULLATO"
      ) {
        return;
      }

      try {
        setAppuntamentoInAggiornamento(
          appuntamento.id,
        );

        setErroreAppuntamenti(null);

        const aggiornato =
          await appuntamentiService
            .cambiaStato(
              appuntamento.id,
              {
                stato:
                  nuovoStato,
              },
            );

        setAppuntamenti(
          (elencoCorrente) =>
            elencoCorrente.map(
              (elemento) =>
                elemento.id ===
                aggiornato.id
                  ? aggiornato
                  : elemento,
            ),
        );
      } catch {
        setErroreAppuntamenti(
          "Non è stato possibile aggiornare lo stato dell’appuntamento.",
        );
      } finally {
        setAppuntamentoInAggiornamento(
          null,
        );
      }
    };

  const cambiaVista = (
    nuovaVista: VistaAgenda,
  ) => {
    setVista(nuovaVista);
    setRicerca("");
  };

  return (
    <section className="agenda-page">
      <PrivatePageHeader
        eyebrow="Organizzazione operativa"
        title="Agenda"
        description={
          vista === "SCADENZE"
            ? "Controlla le scadenze delle pratiche e organizza le attività del CAF."
            : "Gestisci gli appuntamenti con clienti, pratiche e operatori."
        }
        action={
          vista ===
          "APPUNTAMENTI" ? (
            <Button
              type="button"
              className="agenda-new-button"
              onClick={() =>
                setMostraNuovoAppuntamento(
                  true,
                )
              }
            >
              <FiPlus />
              Nuovo appuntamento
            </Button>
          ) : undefined
        }
      />

      <div className="agenda-tabs">
        <button
          type="button"
          className={`agenda-tabs__button ${
            vista === "SCADENZE"
              ? "agenda-tabs__button--active"
              : ""
          }`}
          onClick={() =>
            cambiaVista("SCADENZE")
          }
        >
          <FiCalendar />
          Scadenze
        </button>

        <button
          type="button"
          className={`agenda-tabs__button ${
            vista === "APPUNTAMENTI"
              ? "agenda-tabs__button--active"
              : ""
          }`}
          onClick={() =>
            cambiaVista(
              "APPUNTAMENTI",
            )
          }
        >
          <FiClock />
          Appuntamenti
        </button>
      </div>

      {vista === "SCADENZE" ? (
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
      ) : (
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
      )}

      <NuovoAppuntamentoModal
        show={
          mostraNuovoAppuntamento
        }
        onHide={() =>
          setMostraNuovoAppuntamento(
            false,
          )
        }
        onCreato={() =>
          void caricaAppuntamenti()
        }
      />
    </section>
  );
};

export default AgendaPage;