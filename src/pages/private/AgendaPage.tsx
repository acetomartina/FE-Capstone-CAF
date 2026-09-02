import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Button } from "react-bootstrap";

import { FiCalendar, FiClock, FiPlus } from "react-icons/fi";

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

import type {
  Pratica,
} from "../../features/pratiche/types/praticheTypes";

import {
  distanzaInGiorni,
  distanzaTraDate,
  praticaAperta,
  type FiltroAppuntamenti,
  type FiltroPeriodo,
  type VistaAgenda,
} from "../../features/agenda/agendaHelpers";

import VistaAppuntamenti from "../../features/agenda/components/VistaAppuntamenti";
import VistaScadenze from "../../features/agenda/components/VistaScadenze";

import "./AgendaPage.css";


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
        <VistaScadenze
          scadenzeVisualizzate={scadenzeVisualizzate}
          riepilogoScadenze={riepilogoScadenze}
          filtroPeriodo={filtroPeriodo}
          setFiltroPeriodo={setFiltroPeriodo}
          ricerca={ricerca}
          setRicerca={setRicerca}
          caricamentoScadenze={caricamentoScadenze}
          erroreScadenze={erroreScadenze}
          navigate={navigate}
        />
      ) : (
        <VistaAppuntamenti
          appuntamentiVisualizzati={appuntamentiVisualizzati}
          riepilogoAppuntamenti={riepilogoAppuntamenti}
          filtroAppuntamenti={filtroAppuntamenti}
          setFiltroAppuntamenti={setFiltroAppuntamenti}
          ricerca={ricerca}
          setRicerca={setRicerca}
          statoAppuntamento={statoAppuntamento}
          setStatoAppuntamento={setStatoAppuntamento}
          appuntamentoInAggiornamento={appuntamentoInAggiornamento}
          aggiornaStatoAppuntamento={aggiornaStatoAppuntamento}
          caricamentoAppuntamenti={caricamentoAppuntamenti}
          erroreAppuntamenti={erroreAppuntamenti}
          navigate={navigate}
        />
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
