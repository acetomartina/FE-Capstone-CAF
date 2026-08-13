import {
  useState,
  type ReactNode,
} from "react";
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

import "./DashboardPage.css";

type VarianteCard =
  | "green"
  | "orange"
  | "blue"
  | "fuchsia"
  | "purple"
  | "petrol";

type DashboardStat = {
  titolo: string;
  valore: number;
  descrizione: string;
  variante: VarianteCard;
  icona: ReactNode;
};

type PraticaRecente = {
  numero: string;
  servizio: string;
  cliente: string;
  stato: string;
  variante: VarianteCard;
};

type Scadenza = {
  giorno: string;
  mese: string;
  titolo: string;
  dettaglio: string;
};

const statistiche: DashboardStat[] = [
  {
    titolo: "Pratiche aperte",
    valore: 24,
    descrizione: "Pratiche attualmente attive",
    variante: "green",
    icona: <FiFileText />,
  },
  {
    titolo: "In lavorazione",
    valore: 12,
    descrizione: "Pratiche attualmente in gestione",
    variante: "blue",
    icona: <FiClock />,
  },
  {
    titolo: "Documenti mancanti",
    valore: 8,
    descrizione: "Documenti ancora da ricevere",
    variante: "fuchsia",
    icona: <FiAlertCircle />,
  },
  {
    titolo: "Scadenze vicine",
    valore: 5,
    descrizione: "Scadenze nei prossimi 7 giorni",
    variante: "orange",
    icona: <FiCalendar />,
  },
  {
    titolo: "Clienti attivi",
    valore: 38,
    descrizione: "Clienti con pratiche attive",
    variante: "purple",
    icona: <FiUsers />,
  },
];

const ultimePratiche: PraticaRecente[] = [
  {
    numero: "CAF-2026-000021",
    servizio: "Modello 730",
    cliente: "Mario Rossi",
    stato: "In lavorazione",
    variante: "blue",
  },
  {
    numero: "CAF-2026-000020",
    servizio: "ISEE",
    cliente: "Anna Bianchi",
    stato: "Documenti mancanti",
    variante: "fuchsia",
  },
  {
    numero: "CAF-2026-000019",
    servizio: "IMU",
    cliente: "Giuseppe Verdi",
    stato: "Da avviare",
    variante: "orange",
  },
];

const scadenze: Scadenza[] = [
  {
    giorno: "18",
    mese: "AGO",
    titolo: "Modello 730",
    dettaglio: "Mario Rossi",
  },
  {
    giorno: "20",
    mese: "AGO",
    titolo: "ISEE",
    dettaglio: "Anna Bianchi",
  },
  {
    giorno: "22",
    mese: "AGO",
    titolo: "IMU",
    dettaglio: "Giuseppe Verdi",
  },
];

const DashboardPage = () => {
  const [ricerca, setRicerca] =
    useState("");

  return (
    <section className="dashboard-page">
      <PrivatePageHeader
        eyebrow="Area amministrativa"
        title="Dashboard"
        description="Tieni sotto controllo pratiche, documenti, clienti e scadenze del CAF."
      />

      {/* RICERCA GLOBALE */}

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
            />

            {ricerca && (
              <button
                type="button"
                className="dashboard-global-search__clear"
                onClick={() =>
                  setRicerca("")
                }
                aria-label="Cancella ricerca"
              >
                <FiX />
              </button>
            )}
          </div>

          {ricerca.trim().length > 0 && (
            <div className="dashboard-global-search__hint">
              La ricerca globale verrà
              collegata al backend per
              mostrare risultati da clienti,
              pratiche e documenti.
            </div>
          )}
        </div>
      </section>

      {/* RIEPILOGO STATISTICHE */}

      <section
        className="dashboard-stats"
        aria-label="Riepilogo attività"
      >
        {statistiche.map(
          (statistica) => (
            <article
              key={statistica.titolo}
              className={`dashboard-stat-card dashboard-stat-card--${statistica.variante}`}
            >
              <div className="dashboard-stat-card__decoration" />

              <span className="dashboard-stat-card__icon">
                {statistica.icona}
              </span>

              <div className="dashboard-stat-card__body">
                <strong className="dashboard-stat-card__value">
                  {statistica.valore}
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
            </article>
          ),
        )}
      </section>

      {/* ATTIVITÀ OPERATIVE */}

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
            >
              Vedi tutte
              <FiArrowRight />
            </button>
          </header>

          <div className="dashboard-practices">
            {ultimePratiche.map(
              (pratica) => (
                <div
                  key={
                    pratica.numero
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
                  >
                    <FiArrowRight />
                  </button>
                </div>
              ),
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
            >
              Calendario
              <FiArrowRight />
            </button>
          </header>

          <div className="dashboard-deadlines">
            {scadenze.map(
              (scadenza) => (
                <div
                  key={`${scadenza.giorno}-${scadenza.titolo}`}
                  className="dashboard-deadline"
                >
                  <div className="dashboard-deadline__date">
                    <strong>
                      {scadenza.giorno}
                    </strong> 

                    <span>
                      {scadenza.mese}
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
                </div>
              ),
            )}
          </div>
        </article>
      </section>
    </section>
  );
};

export default DashboardPage;