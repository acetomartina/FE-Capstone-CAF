import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

import {
  FiAlertCircle,
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiFileText,
  FiSearch,
  FiUsers,
  FiX,
} from "react-icons/fi";

import PrivatePageHeader from "../../components/private/PrivatePageHeader";
import ClienteDettaglioModal from "../../features/clienti/components/ClienteDettaglioModal";
import { clientiService } from "../../features/clienti/api/clientiService";
import { praticheService } from "../../features/pratiche/api/praticheService";
import type {
  Pratica,
  StatoPratica,
} from "../../features/pratiche/types/praticheTypes";
import { ricercaService } from "../../features/ricerca/api/ricercaService";
import type {
  RicercaGlobaleResponse,
  RisultatoClienteRicerca,
} from "../../features/ricerca/types/ricercaTypes";

import "./DashboardPage.css";

type VarianteCard =
  | "green"
  | "orange"
  | "blue"
  | "fuchsia"
  | "purple";

type DashboardStat = {
  titolo: string;
  valore: number;
  descrizione: string;
  variante: VarianteCard;
  icona: ReactNode;
  destinazione: string;
};

type PraticaRecente = {
  id: number;
  numero: string;
  servizio: string;
  cliente: string;
  stato: string;
  variante: VarianteCard;
};

type Scadenza = {
  id: number;
  giorno: string;
  mese: string;
  titolo: string;
  dettaglio: string;
};

const STATI_APERTI: StatoPratica[] = [
  "BOZZA",
  "DA_AVVIARE",
  "IN_LAVORAZIONE",
  "IN_ATTESA_DOCUMENTI",
  "IN_ATTESA_CLIENTE",
  "IN_ATTESA_ENTE",
];

const ETICHETTE_STATO: Record<
  StatoPratica,
  string
> = {
  BOZZA: "Bozza",
  DA_AVVIARE: "Da avviare",
  IN_LAVORAZIONE: "In lavorazione",
  IN_ATTESA_DOCUMENTI:
    "Documenti mancanti",
  IN_ATTESA_CLIENTE:
    "In attesa cliente",
  IN_ATTESA_ENTE:
    "In attesa ente",
  COMPLETATA: "Completata",
  ANNULLATA: "Annullata",
};

const VARIANTE_STATO: Record<
  StatoPratica,
  VarianteCard
> = {
  BOZZA: "purple",
  DA_AVVIARE: "orange",
  IN_LAVORAZIONE: "blue",
  IN_ATTESA_DOCUMENTI: "fuchsia",
  IN_ATTESA_CLIENTE: "orange",
  IN_ATTESA_ENTE: "orange",
  COMPLETATA: "green",
  ANNULLATA: "purple",
};

const INIZIO_GIORNO = (
  data: Date,
): Date =>
  new Date(
    data.getFullYear(),
    data.getMonth(),
    data.getDate(),
  );

const aggiungiGiorni = (
  data: Date,
  giorni: number,
): Date => {
  const risultato =
    new Date(data);

  risultato.setDate(
    risultato.getDate() + giorni,
  );

  return risultato;
};

const formattaPraticaRecente = (
  pratica: Pratica,
): PraticaRecente => ({
  id: pratica.id,
  numero: pratica.numeroPratica,
  servizio: pratica.servizio.nome,
  cliente: `${pratica.cliente.nome} ${pratica.cliente.cognome}`,
  stato: ETICHETTE_STATO[pratica.stato],
  variante: VARIANTE_STATO[pratica.stato],
});

const formattaScadenza = (
  pratica: Pratica,
): Scadenza | null => {
  if (!pratica.dataScadenza) {
    return null;
  }

  const data =
    new Date(
      `${pratica.dataScadenza}T00:00:00`,
    );

  return {
    id: pratica.id,
    giorno: String(
      data.getDate(),
    ).padStart(2, "0"),
    mese: data
      .toLocaleDateString(
        "it-IT",
        {
          month: "short",
        },
      )
      .replace(".", "")
      .toUpperCase(),
    titolo: pratica.servizio.nome,
    dettaglio: `${pratica.cliente.nome} ${pratica.cliente.cognome}`,
  };
};

const rispostaVuota: RicercaGlobaleResponse = {
  clienti: [],
  pratiche: [],
  documenti: [],
};

const DashboardPage = () => {
  const [ricerca, setRicerca] =
    useState("");

  const [risultati, setRisultati] =
    useState<RicercaGlobaleResponse>(
      rispostaVuota,
    );

  const [
    ricercaInCorso,
    setRicercaInCorso,
  ] = useState(false);

  const [
    erroreRicerca,
    setErroreRicerca,
  ] = useState<string | null>(null);

  const [
    clienteSelezionatoId,
    setClienteSelezionatoId,
  ] = useState<number | null>(null);

  const [
    praticheAperte,
    setPraticheAperte,
  ] = useState(0);

  const [
    praticheInLavorazione,
    setPraticheInLavorazione,
  ] = useState(0);

  const [
    praticheInAttesaDocumenti,
    setPraticheInAttesaDocumenti,
  ] = useState(0);

  const [
    clientiAttivi,
    setClientiAttivi,
  ] = useState(0);

  const [
    ultimePratiche,
    setUltimePratiche,
  ] = useState<PraticaRecente[]>([]);

  const [
    scadenze,
    setScadenze,
  ] = useState<Scadenza[]>([]);

  const [
    scadenzeVicine,
    setScadenzeVicine,
  ] = useState(0);

  const [
    caricamentoDashboard,
    setCaricamentoDashboard,
  ] = useState(true);

  const [
    erroreDashboard,
    setErroreDashboard,
  ] = useState<string | null>(null);

  const navigate = useNavigate();

  const queryNormalizzata =
    ricerca.trim();

  useEffect(() => {
    let richiestaAttiva = true;

    const caricaDashboard = async () => {
      try {
        setCaricamentoDashboard(true);
        setErroreDashboard(null);

        const [
          tuttePratiche,
          completate,
          annullate,
          inLavorazione,
          inAttesaDocumenti,
          clienti,
          praticheRecenti,
          pratichePerScadenza,
        ] = await Promise.all([
          praticheService.trovaTutte({
            page: 0,
            size: 1,
          }),
          praticheService.trovaTutte({
            stato: "COMPLETATA",
            page: 0,
            size: 1,
          }),
          praticheService.trovaTutte({
            stato: "ANNULLATA",
            page: 0,
            size: 1,
          }),
          praticheService.trovaTutte({
            stato: "IN_LAVORAZIONE",
            page: 0,
            size: 1,
          }),
          praticheService.trovaTutte({
            stato:
              "IN_ATTESA_DOCUMENTI",
            page: 0,
            size: 1,
          }),
          clientiService.trovaTutti({
            attivo: true,
            page: 0,
            size: 1,
          }),
          praticheService.trovaTutte({
            page: 0,
            size: 3,
            sort: "creatoIl,desc",
          }),
          praticheService.trovaTutte({
            page: 0,
            size: 200,
            sort: "dataScadenza,asc",
          }),
        ]);

        if (!richiestaAttiva) {
          return;
        }

        setPraticheAperte(
          Math.max(
            0,
            tuttePratiche.totalElements -
              completate.totalElements -
              annullate.totalElements,
          ),
        );

        setPraticheInLavorazione(
          inLavorazione.totalElements,
        );

        setPraticheInAttesaDocumenti(
          inAttesaDocumenti.totalElements,
        );

        setClientiAttivi(
          clienti.totalElements,
        );

        setUltimePratiche(
          praticheRecenti.content.map(
            formattaPraticaRecente,
          ),
        );

        const oggi =
          INIZIO_GIORNO(new Date());

        const limiteSetteGiorni =
          aggiungiGiorni(
            oggi,
            7,
          );

        const praticheAperteConScadenza =
          pratichePerScadenza.content
            .filter((pratica) =>
              STATI_APERTI.includes(
                pratica.stato,
              ),
            )
            .filter(
              (pratica) =>
                pratica.dataScadenza,
            )
            .map((pratica) => ({
              pratica,
              data: new Date(
                `${pratica.dataScadenza}T00:00:00`,
              ),
            }))
            .filter(
              ({ data }) =>
                data >= oggi,
            )
            .sort(
              (primo, secondo) =>
                primo.data.getTime() -
                secondo.data.getTime(),
            );

        setScadenzeVicine(
          praticheAperteConScadenza.filter(
            ({ data }) =>
              data <=
              limiteSetteGiorni,
          ).length,
        );

        setScadenze(
          praticheAperteConScadenza
            .slice(0, 3)
            .map(({ pratica }) =>
              formattaScadenza(
                pratica,
              ),
            )
            .filter(
              (
                scadenza,
              ): scadenza is Scadenza =>
                scadenza !== null,
            ),
        );
      } catch (errore) {
        console.error(
          "Errore caricamento dashboard:",
          errore,
        );

        if (richiestaAttiva) {
          setErroreDashboard(
            "Non è stato possibile aggiornare il riepilogo della dashboard.",
          );
        }
      } finally {
        if (richiestaAttiva) {
          setCaricamentoDashboard(
            false,
          );
        }
      }
    };

    void caricaDashboard();

    return () => {
      richiestaAttiva = false;
    };
  }, []);

  useEffect(() => {
    if (queryNormalizzata.length < 2) {
      setRisultati(rispostaVuota);
      setErroreRicerca(null);
      setRicercaInCorso(false);

      return;
    }

    let richiestaAttiva = true;

    const timeout = window.setTimeout(
      async () => {
        try {
          setRicercaInCorso(true);
          setErroreRicerca(null);

          const risposta =
            await ricercaService.cerca(
              queryNormalizzata,
            );

          if (!richiestaAttiva) {
            return;
          }

          setRisultati(risposta);
        } catch {
          if (!richiestaAttiva) {
            return;
          }

          setRisultati(rispostaVuota);

          setErroreRicerca(
            "Impossibile completare la ricerca. Riprova.",
          );
        } finally {
          if (richiestaAttiva) {
            setRicercaInCorso(false);
          }
        }
      },
      180,
    );

    return () => {
      richiestaAttiva = false;

      window.clearTimeout(timeout);
    };
  }, [queryNormalizzata]);

  const pulisciRicerca = () => {
    setRicerca("");
    setRisultati(rispostaVuota);
    setErroreRicerca(null);
  };

  const apriCliente = (
    cliente: RisultatoClienteRicerca,
  ) => {
    setClienteSelezionatoId(
      cliente.id,
    );
  };

  const mostraRisultati =
    queryNormalizzata.length >= 2;

  const nessunRisultato =
    mostraRisultati &&
    !ricercaInCorso &&
    !erroreRicerca &&
    risultati.clienti.length === 0 &&
    risultati.pratiche.length === 0 &&
    risultati.documenti.length === 0;

  const statistiche: DashboardStat[] = [
    {
      titolo: "Pratiche aperte",
      valore: praticheAperte,
      descrizione:
        "Pratiche non ancora chiuse o annullate",
      variante: "green",
      icona: <FiFileText />,
      destinazione: "/pratiche",
    },
    {
      titolo: "In lavorazione",
      valore:
        praticheInLavorazione,
      descrizione:
        "Pratiche attualmente in gestione",
      variante: "blue",
      icona: <FiClock />,
      destinazione:
        "/pratiche?stato=IN_LAVORAZIONE",
    },
    {
      titolo: "Documenti mancanti",
      valore:
        praticheInAttesaDocumenti,
      descrizione:
        "Pratiche in attesa di documentazione",
      variante: "fuchsia",
      icona: <FiAlertCircle />,
      destinazione:
        "/pratiche?stato=IN_ATTESA_DOCUMENTI",
    },
    {
      titolo: "Scadenze vicine",
      valore:
        scadenzeVicine,
      descrizione:
        "Scadenze nei prossimi 7 giorni",
      variante: "orange",
      icona: <FiCalendar />,
      destinazione: "/pratiche",
    },
    {
      titolo: "Clienti attivi",
      valore:
        clientiAttivi,
      descrizione:
        "Clienti con account attivato",
      variante: "purple",
      icona: <FiUsers />,
      destinazione: "/clienti?attivo=true",
    },
  ];

  return (
    <section className="dashboard-page">
      <PrivatePageHeader
        eyebrow="Area amministrativa"
        title="Dashboard"
        description="Tieni sotto controllo pratiche, documenti, clienti e scadenze del CAF."
      />

      {erroreDashboard && (
        <div
          className="dashboard-search-results__state dashboard-search-results__state--error"
          role="alert"
        >
          {erroreDashboard}
        </div>
      )}

      <section
        className="dashboard-global-search"
        aria-label="Ricerca globale"
      >
        <div className="dashboard-global-search__content">
          <div className="dashboard-global-search__heading">
            <span>
              Ricerca globale
            </span>

            <h2>
              Cosa stai cercando?
            </h2>

            <p>
              Cerca rapidamente clienti,
              codici fiscali, pratiche e
              documenti.
            </p>
          </div>

          <div className="dashboard-global-search__field">
            <FiSearch />

            <input
              type="search"
              value={ricerca}
              onChange={(event) =>
                setRicerca(
                  event.target.value,
                )
              }
              placeholder="Cerca cliente, codice fiscale, pratica o documento..."
              aria-label="Ricerca globale nel gestionale"
              autoComplete="off"
            />

            {ricerca && (
              <button
                type="button"
                className="dashboard-global-search__clear"
                onClick={pulisciRicerca}
                aria-label="Cancella ricerca"
              >
                <FiX />
              </button>
            )}
          </div>

          {mostraRisultati && (
            <div className="dashboard-search-results">
              {ricercaInCorso && (
                <div className="dashboard-search-results__state">
                  Ricerca in corso...
                </div>
              )}

              {erroreRicerca && (
                <div className="dashboard-search-results__state dashboard-search-results__state--error">
                  {erroreRicerca}
                </div>
              )}

              {!ricercaInCorso &&
                !erroreRicerca &&
                risultati.clienti.length >
                  0 && (
                  <section className="dashboard-search-group">
                    <header className="dashboard-search-group__header">
                      <div>
                        <span>
                          Clienti
                        </span>

                        <strong>
                          {
                            risultati
                              .clienti
                              .length
                          }
                        </strong>
                      </div>
                    </header>

                    <div className="dashboard-search-group__list">
                      {risultati.clienti.map(
                        (cliente) => (
                          <button
                            key={
                              cliente.id
                            }
                            type="button"
                            className="dashboard-search-client"
                            onClick={() =>
                              apriCliente(
                                cliente,
                              )
                            }
                          >
                            <span className="dashboard-search-client__avatar">
                              {cliente.nome
                                .charAt(0)
                                .toUpperCase()}

                              {cliente.cognome
                                .charAt(0)
                                .toUpperCase()}
                            </span>

                            <span className="dashboard-search-client__content">
                              <strong>
                                {
                                  cliente.nome
                                }{" "}
                                {
                                  cliente.cognome
                                }
                              </strong>

                              <small>
                                {
                                  cliente.codiceFiscale
                                }{" "}
                                ·{" "}
                                {
                                  cliente.email
                                }
                              </small>
                            </span>

                            <span
                              className={`dashboard-search-client__status ${
                                cliente.attivo
                                  ? "dashboard-search-client__status--active"
                                  : "dashboard-search-client__status--inactive"
                              }`}
                            >
                              {cliente.attivo
                                ? "Attivo"
                                : "Non attivo"}
                            </span>

                            <FiArrowRight className="dashboard-search-client__arrow" />
                          </button>
                        ),
                      )}
                    </div>
                  </section>
                )}

              {nessunRisultato && (
                <div className="dashboard-search-results__state">
                  Nessun risultato trovato
                  per “
                  {queryNormalizzata}”.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section
        className="dashboard-stats"
        aria-label="Riepilogo attività"
      >
        {statistiche.map(
          (statistica) => (
            <button
              key={statistica.titolo}
              type="button"
              className={`dashboard-stat-card dashboard-stat-card--interactive dashboard-stat-card--${statistica.variante}`}
              onClick={() =>
                navigate(
                  statistica.destinazione,
                )
              }
              aria-label={`${statistica.titolo}: ${statistica.valore}. Apri sezione`}
            >
              <div className="dashboard-stat-card__decoration" />

              <span className="dashboard-stat-card__icon">
                {statistica.icona}
              </span>

              <div className="dashboard-stat-card__body">
                <strong className="dashboard-stat-card__value">
                  {caricamentoDashboard
                    ? "…"
                    : statistica.valore}
                </strong>

                <h2>
                  {statistica.titolo}
                </h2>

                <p>
                  {
                    statistica.descrizione
                  }
                </p>
              </div>

              <span
                className="dashboard-stat-card__arrow"
                aria-hidden="true"
              >
                <FiArrowRight />
              </span>
            </button>
          ),
        )}
      </section>

      <section
        className="dashboard-activity"
        aria-label="Attività recenti"
      >
        <article className="dashboard-panel">
          <header className="dashboard-panel__header">
            <div>
              <span className="dashboard-panel__eyebrow">
                Attività recenti
              </span>

              <h2>
                Ultime pratiche
              </h2>
            </div>

            <button
              type="button"
              className="dashboard-panel__action"
              onClick={() =>
                navigate("/pratiche")
              }
            >
              Vedi tutte
              <FiArrowRight />
            </button>
          </header>

          <div className="dashboard-practices">
            {caricamentoDashboard ? (
              <div className="dashboard-search-results__state">
                Caricamento pratiche...
              </div>
            ) : ultimePratiche.length === 0 ? (
              <div className="dashboard-search-results__state">
                Nessuna pratica disponibile.
              </div>
            ) : (
              ultimePratiche.map(
                (pratica) => (
                  <div
                    key={
                      pratica.id
                    }
                    className="dashboard-practice"
                  >
                    <span className="dashboard-practice__icon">
                      <FiFileText />
                    </span>

                    <div className="dashboard-practice__main">
                      <strong>
                        {
                          pratica.servizio
                        }
                      </strong>

                      <span>
                        {pratica.numero} ·{" "}
                        {pratica.cliente}
                      </span>
                    </div>

                    <span
                      className={`dashboard-practice__status dashboard-practice__status--${pratica.variante}`}
                    >
                      {pratica.stato}
                    </span>

                    <button
                      type="button"
                      className="dashboard-practice__open"
                      aria-label={`Apri ${pratica.numero}`}
                      onClick={() =>
                        navigate(
                          "/pratiche",
                        )
                      }
                    >
                      <FiArrowRight />
                    </button>
                  </div>
                ),
              )
            )}
          </div>
        </article>

        <article className="dashboard-panel">
          <header className="dashboard-panel__header">
            <div>
              <span className="dashboard-panel__eyebrow">
                Agenda
              </span>

              <h2>
                Scadenze imminenti
              </h2>
            </div>

            <button
              type="button"
              className="dashboard-panel__action"
              onClick={() =>
                navigate("/pratiche")
              }
            >
              Vedi pratiche
              <FiArrowRight />
            </button>
          </header>

          <div className="dashboard-deadlines">
            {caricamentoDashboard ? (
              <div className="dashboard-search-results__state">
                Caricamento scadenze...
              </div>
            ) : scadenze.length === 0 ? (
              <div className="dashboard-search-results__state">
                Nessuna scadenza imminente.
              </div>
            ) : (
              scadenze.map(
                (scadenza) => (
                  <button
                    key={
                      scadenza.id
                    }
                    type="button"
                    className="dashboard-deadline"
                    onClick={() =>
                      navigate(
                        "/pratiche",
                      )
                    }
                  >
                    <div className="dashboard-deadline__date">
                      <strong>
                        {
                          scadenza.giorno
                        }
                      </strong>

                      <span>
                        {
                          scadenza.mese
                        }
                      </span>
                    </div>

                    <div className="dashboard-deadline__content">
                      <strong>
                        {
                          scadenza.titolo
                        }
                      </strong>

                      <span>
                        {
                          scadenza.dettaglio
                        }
                      </span>
                    </div>

                    <span
                      className="dashboard-deadline__arrow"
                      aria-hidden="true"
                    >
                      <FiArrowRight />
                    </span>
                  </button>
                ),
              )
            )}
          </div>
        </article>
      </section>

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
        onClienteAggiornato={() => {
          if (
            queryNormalizzata.length >=
            2
          ) {
            void ricercaService
              .cerca(
                queryNormalizzata,
              )
              .then(
                setRisultati,
              );
          }
        }}
      />
    </section>
  );
};

export default DashboardPage;