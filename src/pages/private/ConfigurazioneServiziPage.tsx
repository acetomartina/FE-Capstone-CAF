import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiChevronDown,
  FiCheck,
} from "react-icons/fi";

import { servizioService } from "../../services/servizioService";

import type {
  MacroAreaResponse,
  ServizioResponse,
} from "../../types/servizio";

import "./ConfigurazioneServiziPage.css";

const ConfigurazioneServiziPage = () => {

    const navigate = useNavigate();
   
  const [macroAree, setMacroAree] = useState<
    MacroAreaResponse[]
  >([]);

  const [servizi, setServizi] = useState<
    ServizioResponse[]
  >([]);

  const [
    macroAreaSelezionataId,
    setMacroAreaSelezionataId,
  ] = useState<number | null>(null);

  const [
    menuMacroAreeAperto,
    setMenuMacroAreeAperto,
  ] = useState(false);

  const [caricamento, setCaricamento] =
    useState(true);

  const [errore, setErrore] = useState<
    string | null
  >(null);

  const dropdownRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const caricaDati = async () => {
      try {
        setCaricamento(true);
        setErrore(null);

        const [
          macroAreeResponse,
          serviziResponse,
        ] = await Promise.all([
          servizioService.trovaMacroAreeAttive(),
          servizioService.trovaServiziAttivi(),
        ]);

        setMacroAree(macroAreeResponse);
        setServizi(serviziResponse);

        if (macroAreeResponse.length > 0) {
          setMacroAreaSelezionataId(
            macroAreeResponse[0].id,
          );
        }
      } catch {
        setErrore(
          "Non è stato possibile caricare la configurazione dei servizi.",
        );
      } finally {
        setCaricamento(false);
      }
    };

    void caricaDati();
  }, []);

  useEffect(() => {
    const gestisciClickEsterno = (
      evento: MouseEvent,
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          evento.target as Node,
        )
      ) {
        setMenuMacroAreeAperto(false);
      }
    };

    document.addEventListener(
      "mousedown",
      gestisciClickEsterno,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        gestisciClickEsterno,
      );
    };
  }, []);

  const macroAreaSelezionata = useMemo(
    () =>
      macroAree.find(
        (macroArea) =>
          macroArea.id ===
          macroAreaSelezionataId,
      ) ?? null,
    [macroAree, macroAreaSelezionataId],
  );

  const serviziFiltrati = useMemo(
    () =>
      servizi.filter(
        (servizio) =>
          servizio.macroAreaId ===
          macroAreaSelezionataId,
      ),
    [servizi, macroAreaSelezionataId],
  );

  const numeroServiziInEvidenza = useMemo(
    () =>
      servizi.filter(
        (servizio) => servizio.inEvidenza,
      ).length,
    [servizi],
  );

  const contaServiziMacroArea = (
    macroAreaId: number,
  ) =>
    servizi.filter(
      (servizio) =>
        servizio.macroAreaId === macroAreaId,
    ).length;

  const formattaPrezzo = (
    servizio: ServizioResponse,
  ) => {
    if (servizio.prezzoTesto) {
      return servizio.prezzoTesto;
    }

    if (servizio.prezzo !== null) {
      return new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
      }).format(servizio.prezzo);
    }

    return "—";
  };

  const ottieniVarianteMacroArea = (
    macroArea: MacroAreaResponse | null,
  ) => {
    if (!macroArea) {
      return "green";
    }

    const variantiPerSlug: Record<
      string,
      string
    > = {
      "caf-e-fiscale": "green",
      "energia-e-gas": "orange",
      "telefonia-e-internet": "blue",
      finanziamenti: "fuchsia",
      "mobilita-e-logistica": "purple",
      "servizi-digitali": "petrol",
    };

    return (
      variantiPerSlug[macroArea.slug] ??
      "green"
    );
  };

  const selezionaMacroArea = (
    macroAreaId: number,
  ) => {
    setMacroAreaSelezionataId(
      macroAreaId,
    );

    setMenuMacroAreeAperto(false);
  };

  if (caricamento) {
    return (
      <section className="configurazione-servizi">
        <div className="configurazione-servizi__state">
          Caricamento servizi...
        </div>
      </section>
    );
  }

  if (errore) {
    return (
      <section className="configurazione-servizi">
        <div className="configurazione-servizi__state">
          {errore}
        </div>
      </section>
    );
  }

  const varianteSelezionata =
    ottieniVarianteMacroArea(
      macroAreaSelezionata,
    );

  return (
    <section
      className={[
        "configurazione-servizi",
        `configurazione-servizi--${varianteSelezionata}`,
      ].join(" ")}
    >
      <header className="configurazione-servizi__header">
        <span className="configurazione-servizi__eyebrow">
          Amministrazione
        </span>

        <h1 className="configurazione-servizi__title">
          Configurazione servizi
        </h1>

        <p className="configurazione-servizi__description">
          Gestisci il catalogo dei servizi,
          disponibilità, prezzi e documentazione
          richiesta.
        </p>
      </header>

      <div className="configurazione-servizi__summary">
        <div className="configurazione-servizi__summary-item">
          <strong>{macroAree.length}</strong>
          <span>macroaree</span>
        </div>

        <div className="configurazione-servizi__summary-item">
          <strong>{servizi.length}</strong>
          <span>servizi attivi</span>
        </div>

        <div className="configurazione-servizi__summary-item">
          <strong>
            {numeroServiziInEvidenza}
          </strong>
          <span>in evidenza</span>
        </div>
      </div>

      <div className="configurazione-servizi__layout">
        <div
          ref={dropdownRef}
          className="configurazione-servizi__mobile-dropdown"
        >
          <span className="configurazione-servizi__mobile-dropdown-label">
            Macroarea
          </span>

          <button
            type="button"
            className={[
              "configurazione-servizi__mobile-dropdown-trigger",
              menuMacroAreeAperto
                ? "configurazione-servizi__mobile-dropdown-trigger--open"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() =>
              setMenuMacroAreeAperto(
                (valore) => !valore,
              )
            }
            aria-expanded={
              menuMacroAreeAperto
            }
          >
            <span className="configurazione-servizi__mobile-dropdown-trigger-main">
              <span className="configurazione-servizi__mobile-dropdown-dot" />

              <span className="configurazione-servizi__mobile-dropdown-name">
                {macroAreaSelezionata?.nome ??
                  "Seleziona macroarea"}
              </span>
            </span>

            <span className="configurazione-servizi__mobile-dropdown-side">
              <span className="configurazione-servizi__mobile-dropdown-count">
                {macroAreaSelezionata
                  ? contaServiziMacroArea(
                      macroAreaSelezionata.id,
                    )
                  : 0}
              </span>

              <FiChevronDown />
            </span>
          </button>

          {menuMacroAreeAperto && (
            <div className="configurazione-servizi__mobile-dropdown-menu">
              {macroAree.map(
                (macroArea) => {
                  const variante =
                    ottieniVarianteMacroArea(
                      macroArea,
                    );

                  const selezionata =
                    macroArea.id ===
                    macroAreaSelezionataId;

                  return (
                    <button
                      key={macroArea.id}
                      type="button"
                      className={[
                        "configurazione-servizi__mobile-dropdown-option",
                        `configurazione-servizi__mobile-dropdown-option--${variante}`,
                        selezionata
                          ? "configurazione-servizi__mobile-dropdown-option--active"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() =>
                        selezionaMacroArea(
                          macroArea.id,
                        )
                      }
                    >
                      <span className="configurazione-servizi__mobile-dropdown-option-main">
                        <span className="configurazione-servizi__mobile-dropdown-option-dot" />

                        <span>
                          {macroArea.nome}
                        </span>
                      </span>

                      <span className="configurazione-servizi__mobile-dropdown-option-side">
                        <span>
                          {contaServiziMacroArea(
                            macroArea.id,
                          )}
                        </span>

                        {selezionata && (
                          <FiCheck />
                        )}
                      </span>
                    </button>
                  );
                },
              )}
            </div>
          )}
        </div>

        <aside className="configurazione-servizi__sidebar">
          <span className="configurazione-servizi__sidebar-title">
            Macroaree
          </span>

          <div className="configurazione-servizi__macroaree">
            {macroAree.map((macroArea) => {
              const selezionata =
                macroArea.id ===
                macroAreaSelezionataId;

              const variante =
                ottieniVarianteMacroArea(
                  macroArea,
                );

              return (
                <button
                  key={macroArea.id}
                  type="button"
                  className={[
                    "configurazione-servizi__macroarea",
                    `configurazione-servizi__macroarea--${variante}`,
                    selezionata
                      ? "configurazione-servizi__macroarea--active"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() =>
                    selezionaMacroArea(
                      macroArea.id,
                    )
                  }
                >
                  <span className="configurazione-servizi__macroarea-main">
                    <span
                      className="configurazione-servizi__macroarea-dot"
                      aria-hidden="true"
                    />

                    <span>
                      {macroArea.nome}
                    </span>
                  </span>

                  <span className="configurazione-servizi__macroarea-count">
                    {contaServiziMacroArea(
                      macroArea.id,
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="configurazione-servizi__content">
          <div className="configurazione-servizi__content-header">
            <div>
              <span className="configurazione-servizi__area-label">
                Macroarea selezionata
              </span>

              <h2 className="configurazione-servizi__content-title">
                {macroAreaSelezionata?.nome ??
                  "Servizi"}
              </h2>

              <p className="configurazione-servizi__content-count">
                {serviziFiltrati.length}{" "}
                {serviziFiltrati.length === 1
                  ? "servizio"
                  : "servizi"}
              </p>
            </div>
          </div>

          {serviziFiltrati.length === 0 ? (
            <div className="configurazione-servizi__empty">
              Nessun servizio configurato per
              questa macroarea.
            </div>
          ) : (
            <div className="configurazione-servizi__services">
              {serviziFiltrati.map(
                (servizio) => (
                  <article
                    key={servizio.id}
                    className="configurazione-servizi__service"
                  >
                    <span
                      className="configurazione-servizi__service-accent"
                      aria-hidden="true"
                    />

                    <div className="configurazione-servizi__service-main">
                      <div className="configurazione-servizi__service-top">
                        <h3 className="configurazione-servizi__service-name">
                          {servizio.nome}
                        </h3>

                        <div className="configurazione-servizi__badges">
                          <span
                            className={[
                              "configurazione-servizi__badge",
                              servizio.attivo
                                ? "configurazione-servizi__badge--active"
                                : "configurazione-servizi__badge--inactive",
                            ].join(" ")}
                          >
                            {servizio.attivo
                              ? "Attivo"
                              : "Disattivato"}
                          </span>

                          {servizio.inEvidenza && (
                            <span className="configurazione-servizi__badge configurazione-servizi__badge--featured">
                              In evidenza
                            </span>
                          )}

                          {servizio.richiedibileOnline && (
                            <span className="configurazione-servizi__badge configurazione-servizi__badge--online">
                              Online
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="configurazione-servizi__service-description">
                        {servizio.descrizioneBreve ??
                          "Nessuna descrizione disponibile."}
                      </p>
                    </div>

                    <div className="configurazione-servizi__service-side">
                      <span className="configurazione-servizi__price">
                        {formattaPrezzo(
                          servizio,
                        )}
                      </span>

                      <button
                        type="button"
                        className="configurazione-servizi__edit"
                        onClick={() => 
                            navigate(
                                      `/amministrazione/servizi/${servizio.id}`,
                            )
                        }
                        aria-label={`Modifica ${servizio.nome}`}
                        title={`Modifica ${servizio.nome}`}
                      >
                        <FiArrowRight />
                      </button>
                    </div>
                  </article>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ConfigurazioneServiziPage;