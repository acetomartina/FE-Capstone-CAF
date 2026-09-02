import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiRefreshCw,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import PrivatePageHeader from "../../components/private/PrivatePageHeader";
import { praticheService } from "../../features/pratiche/api/praticheService";
import type {
  Pratica,
  StatoPratica,
} from "../../features/pratiche/types/praticheTypes";
import "./AreaClientePage.css";

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
  BOZZA: "In preparazione",
  DA_AVVIARE: "Da avviare",
  IN_LAVORAZIONE: "In lavorazione",
  IN_ATTESA_DOCUMENTI:
    "Servono documenti",
  IN_ATTESA_CLIENTE:
    "In attesa di una tua risposta",
  IN_ATTESA_ENTE:
    "In attesa dell’ente",
  COMPLETATA: "Completata",
  ANNULLATA: "Annullata",
};

const formattaData = (
  valore: string | null,
): string => {
  if (!valore) {
    return "Nessuna scadenza";
  }

  const data = new Date(
    `${valore}T00:00:00`,
  );

  if (Number.isNaN(data.getTime())) {
    return "Data non disponibile";
  }

  return data.toLocaleDateString(
    "it-IT",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  );
};

const AreaClientePage = () => {
  const utente = useAppSelector(
    (state) => state.auth.utente,
  );

  const [pratiche, setPratiche] =
    useState<Pratica[]>([]);

  const [caricamento, setCaricamento] =
    useState(true);

  const [errore, setErrore] =
    useState<string | null>(null);

  const caricaPratiche =
    useCallback(async () => {
      try {
        setCaricamento(true);
        setErrore(null);

        const risposta =
          await praticheService.trovaMie({
            page: 0,
            size: 100,
            sort: "aggiornatoIl,desc",
          });

        setPratiche(risposta.content);
      } catch {
        setErrore(
          "Non è stato possibile caricare le tue pratiche. Riprova tra poco.",
        );
      } finally {
        setCaricamento(false);
      }
    }, []);

  useEffect(() => {
    void caricaPratiche();
  }, [caricaPratiche]);

  const riepilogo = useMemo(() => {
    const attive = pratiche.filter(
      (pratica) =>
        STATI_APERTI.includes(
          pratica.stato,
        ),
    ).length;

    const documentiRichiesti =
      pratiche.filter(
        (pratica) =>
          pratica.stato ===
          "IN_ATTESA_DOCUMENTI",
      ).length;

    const completate = pratiche.filter(
      (pratica) =>
        pratica.stato === "COMPLETATA",
    ).length;

    return {
      attive,
      documentiRichiesti,
      completate,
    };
  }, [pratiche]);

  const praticheRecenti = useMemo(
    () => pratiche.slice(0, 4),
    [pratiche],
  );

  const prossimeScadenze = useMemo(() => {
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);

    return pratiche
      .filter(
        (pratica) =>
          pratica.dataScadenza &&
          STATI_APERTI.includes(
            pratica.stato,
          ),
      )
      .map((pratica) => ({
        pratica,
        data: new Date(
          `${pratica.dataScadenza}T00:00:00`,
        ),
      }))
      .filter(
        ({ data }) =>
          !Number.isNaN(data.getTime()) &&
          data >= oggi,
      )
      .sort(
        (prima, seconda) =>
          prima.data.getTime() -
          seconda.data.getTime(),
      )
      .slice(0, 3)
      .map(({ pratica }) => pratica);
  }, [pratiche]);

  return (
    <div className="area-cliente-page">
      <PrivatePageHeader
        eyebrow="Area Cliente"
        title={`Ciao${utente?.nome ? `, ${utente.nome}` : ""}`}
        description="Qui trovi lo stato delle tue pratiche, i documenti richiesti e le prossime scadenze."
        action={
          <button
            type="button"
            className="area-cliente-refresh"
            onClick={() =>
              void caricaPratiche()
            }
            disabled={caricamento}
          >
            <FiRefreshCw
              className={
                caricamento
                  ? "area-cliente-refresh__icon--loading"
                  : ""
              }
            />
            <span>Aggiorna</span>
          </button>
        }
      />

      {errore && (
        <div
          className="area-cliente-alert"
          role="alert"
        >
          <FiAlertCircle />

          <div>
            <strong>
              Qualcosa non ha funzionato
            </strong>
            <p>{errore}</p>
          </div>

          <button
            type="button"
            onClick={() =>
              void caricaPratiche()
            }
          >
            Riprova
          </button>
        </div>
      )}

      <section className="area-cliente-welcome">
        <div className="area-cliente-welcome__content">
          <span>Il tuo spazio personale</span>

          <h2>
            Tutto sotto controllo,
            senza perdere tempo.
          </h2>

          <p>
            Segui l’avanzamento delle
            richieste e controlla subito
            se il CAF ha bisogno di nuovi
            documenti.
          </p>
        </div>

        <div className="area-cliente-welcome__status">
          <span
            className={
              riepilogo.documentiRichiesti > 0
                ? "area-cliente-welcome__status-icon area-cliente-welcome__status-icon--attention"
                : "area-cliente-welcome__status-icon"
            }
          >
            {riepilogo.documentiRichiesti >
            0 ? (
              <FiFileText />
            ) : (
              <FiCheckCircle />
            )}
          </span>

          <div>
            <strong>
              {caricamento
                ? "Aggiornamento in corso"
                : riepilogo.documentiRichiesti >
                    0
                  ? `${riepilogo.documentiRichiesti} ${
                      riepilogo.documentiRichiesti ===
                      1
                        ? "pratica richiede"
                        : "pratiche richiedono"
                    } documenti`
                  : "Nessuna azione richiesta"}
            </strong>

            <small>
              {riepilogo.documentiRichiesti >
              0
                ? "Controlla le richieste del CAF."
                : "Al momento è tutto in ordine."}
            </small>
          </div>
        </div>
      </section>

      <section
        className="area-cliente-stats"
        aria-label="Riepilogo pratiche"
      >
        <article className="area-cliente-stat area-cliente-stat--blue">
          <span className="area-cliente-stat__icon">
            <FiFileText />
          </span>

          <div>
            <strong>
              {caricamento
                ? "—"
                : pratiche.length}
            </strong>
            <span>Pratiche totali</span>
          </div>
        </article>

        <article className="area-cliente-stat area-cliente-stat--petrol">
          <span className="area-cliente-stat__icon">
            <FiClock />
          </span>

          <div>
            <strong>
              {caricamento
                ? "—"
                : riepilogo.attive}
            </strong>
            <span>Pratiche attive</span>
          </div>
        </article>

        <article className="area-cliente-stat area-cliente-stat--fuchsia">
          <span className="area-cliente-stat__icon">
            <FiAlertCircle />
          </span>

          <div>
            <strong>
              {caricamento
                ? "—"
                : riepilogo.documentiRichiesti}
            </strong>
            <span>Documenti richiesti</span>
          </div>
        </article>

        <article className="area-cliente-stat area-cliente-stat--green">
          <span className="area-cliente-stat__icon">
            <FiCheckCircle />
          </span>

          <div>
            <strong>
              {caricamento
                ? "—"
                : riepilogo.completate}
            </strong>
            <span>Completate</span>
          </div>
        </article>
      </section>

      <div className="area-cliente-grid">
        <section className="area-cliente-panel">
          <div className="area-cliente-panel__header">
            <div>
              <span>Panoramica</span>
              <h2>Le tue pratiche</h2>
            </div>

            <span className="area-cliente-panel__count">
              {pratiche.length}
            </span>
          </div>

          {caricamento ? (
            <div className="area-cliente-state">
              Caricamento delle pratiche…
            </div>
          ) : praticheRecenti.length === 0 ? (
            <div className="area-cliente-empty">
              <FiFileText />
              <strong>
                Nessuna pratica presente
              </strong>
              <p>
                Quando il CAF aprirà una
                pratica per te, la troverai
                qui.
              </p>
            </div>
          ) : (
            <div className="area-cliente-pratiche">
              {praticheRecenti.map(
                (pratica) => (
                  <Link
                    key={pratica.id}
                    to={`/cliente/pratiche/${pratica.id}`}
                    className="area-cliente-pratica"
                  >
                    <span className="area-cliente-pratica__icon">
                      <FiFileText />
                    </span>

                    <div className="area-cliente-pratica__content">
                      <small>
                        {
                          pratica.numeroPratica
                        }
                      </small>

                      <strong>
                        {
                          pratica.servizio
                            .nome
                        }
                      </strong>

                      <span>
                        {pratica.oggetto}
                      </span>
                    </div>

                    <div className="area-cliente-pratica__meta">
                      <span
                        className={`area-cliente-status area-cliente-status--${pratica.stato.toLowerCase().replaceAll("_", "-")}`}
                      >
                        {
                          ETICHETTE_STATO[
                            pratica.stato
                          ]
                        }
                      </span>

                      <small>
                        {formattaData(
                          pratica.dataScadenza,
                        )}
                      </small>
                    </div>
                  </Link>
                ),
              )}
            </div>
          )}
        </section>

        <section className="area-cliente-panel">
          <div className="area-cliente-panel__header">
            <div>
              <span>Da ricordare</span>
              <h2>Prossime scadenze</h2>
            </div>

            <FiClock />
          </div>

          {caricamento ? (
            <div className="area-cliente-state">
              Caricamento delle scadenze…
            </div>
          ) : prossimeScadenze.length ===
            0 ? (
            <div className="area-cliente-empty">
              <FiCheckCircle />
              <strong>
                Nessuna scadenza vicina
              </strong>
              <p>
                Non ci sono attività in
                scadenza da segnalarti.
              </p>
            </div>
          ) : (
            <div className="area-cliente-scadenze">
              {prossimeScadenze.map(
                (pratica) => (
                  <article
                    key={pratica.id}
                    className="area-cliente-scadenza"
                  >
                    <span className="area-cliente-scadenza__date">
                      {formattaData(
                        pratica.dataScadenza,
                      )}
                    </span>

                    <strong>
                      {
                        pratica.servizio
                          .nome
                      }
                    </strong>

                    <small>
                      {
                        pratica.numeroPratica
                      }
                    </small>
                  </article>
                ),
              )}
            </div>
          )}

          <div className="area-cliente-help">
            <span>Hai bisogno di aiuto?</span>
            <p>
              Contatta il CAF se non
              riconosci una pratica o hai
              dubbi sui documenti richiesti.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AreaClientePage;