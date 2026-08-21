import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FiArrowLeft,
  FiCheck,
  FiClock,
  FiDollarSign,
  FiEdit3,
  FiEye,
  FiEyeOff,
  FiFileText,
  FiGlobe,
  FiPlus,
  FiRefreshCw,
  FiRotateCcw,
  FiSave,
  FiSettings,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { servizioService } from "../../services/servizioService";
import { documentoServizioService } from "../../services/documentoServizioService";

import type {
  ServizioResponse,
  UpdateServizioRequest,
} from "../../types/servizio";

import type {
  CreateDocumentoServizioRequest,
  DocumentoServizioResponse,
  TipoObbligatorietaDocumento,
  UpdateDocumentoServizioRequest,
} from "../../types/documentoServizio";

import "./DettaglioServizioPage.css";

/* =========================================================
   TIPI FORM SERVIZIO
   ========================================================= */

type FormServizio = {
  nome: string;
  descrizioneBreve: string;
  descrizione: string;
  destinatari: string;
  requisiti: string;
  comeFunziona: string;

  prezzo: string;
  prezzoTesto: string;
  notaPrezzo: string;

  durataMinuti: string;

  prenotabile: boolean;
  richiedibileOnline: boolean;
  inEvidenza: boolean;
  generaPratica: boolean;
  richiedeDocumenti: boolean;
  attivo: boolean;

  ordineVisualizzazione: string;
  validoFinoAl: string;
};

/* =========================================================
   TIPI FORM DOCUMENTO
   ========================================================= */

type FormDocumento = {
  etichetta: string;
  suggerimento: string;

  tipoObbligatorieta:
    TipoObbligatorietaDocumento;

  visibileAlCliente: boolean;

  ordineVisualizzazione: number;
};

const TIPI_OBBLIGATORIETA: {
  value: TipoObbligatorietaDocumento;
  label: string;
}[] = [
  {
    value: "OBBLIGATORIO",
    label: "Obbligatorio",
  },
  {
    value: "CONDIZIONALE",
    label: "Condizionale",
  },
  {
    value: "FACOLTATIVO",
    label: "Facoltativo",
  },
];

/* =========================================================
   HELPERS
   ========================================================= */

const creaFormDaServizio = (
  servizio: ServizioResponse,
): FormServizio => ({
  nome: servizio.nome ?? "",

  descrizioneBreve:
    servizio.descrizioneBreve ?? "",

  descrizione:
    servizio.descrizione ?? "",

  destinatari:
    servizio.destinatari ?? "",

  requisiti:
    servizio.requisiti ?? "",

  comeFunziona:
    servizio.comeFunziona ?? "",

  prezzo:
    servizio.prezzo !== null
      ? String(servizio.prezzo)
      : "",

  prezzoTesto:
    servizio.prezzoTesto ?? "",

  notaPrezzo:
    servizio.notaPrezzo ?? "",

  durataMinuti:
    servizio.durataMinuti !== null
      ? String(servizio.durataMinuti)
      : "",

  prenotabile:
    servizio.prenotabile,

  richiedibileOnline:
    servizio.richiedibileOnline,

  inEvidenza:
    servizio.inEvidenza,

  generaPratica:
    servizio.generaPratica,

  richiedeDocumenti:
    servizio.richiedeDocumenti,

  attivo:
    servizio.attivo,

  ordineVisualizzazione:
    String(
      servizio.ordineVisualizzazione,
    ),

  validoFinoAl:
    servizio.validoFinoAl ?? "",
});

const creaFormDocumento = (
  documento:
    DocumentoServizioResponse,
): FormDocumento => ({
  etichetta:
    documento.etichetta,

  suggerimento:
    documento.suggerimento ?? "",

  tipoObbligatorieta:
    documento.tipoObbligatorieta,

  visibileAlCliente:
    documento.visibileAlCliente,

  ordineVisualizzazione:
    documento.ordineVisualizzazione,
});

/* =========================================================
   COMPONENTE
   ========================================================= */

const DettaglioServizioPage = () => {
  const { id } = useParams<{
    id: string;
  }>();

  const navigate = useNavigate();

  const servizioId = Number(id);

  /* =======================================================
     DATI
     ======================================================= */

  const [
    servizio,
    setServizio,
  ] = useState<ServizioResponse | null>(
    null,
  );

  const [
    documenti,
    setDocumenti,
  ] = useState<
    DocumentoServizioResponse[]
  >([]);

  /* =======================================================
     FORM SERVIZIO
     ======================================================= */

  const [
    form,
    setForm,
  ] = useState<FormServizio | null>(
    null,
  );

  const [
    modalitaModifica,
    setModalitaModifica,
  ] = useState(false);

  /* =======================================================
     CRUD DOCUMENTI
     ======================================================= */

  const [
    documentoInModificaId,
    setDocumentoInModificaId,
  ] = useState<number | null>(
    null,
  );

  const [
    formDocumento,
    setFormDocumento,
  ] = useState<FormDocumento | null>(
    null,
  );

  const [
    nuovoDocumentoAperto,
    setNuovoDocumentoAperto,
  ] = useState(false);

  const [
    nuovoDocumento,
    setNuovoDocumento,
  ] = useState<FormDocumento>({
    etichetta: "",
    suggerimento: "",

    tipoObbligatorieta:
      "OBBLIGATORIO",

    visibileAlCliente: true,

    ordineVisualizzazione: 1,
  });

  /* =======================================================
     STATI UI
     ======================================================= */

  const [
    caricamento,
    setCaricamento,
  ] = useState(true);

  const [
    salvataggio,
    setSalvataggio,
  ] = useState(false);

  const [
    operazioneDocumentoId,
    setOperazioneDocumentoId,
  ] = useState<number | null>(
    null,
  );

  const [
    creazioneDocumento,
    setCreazioneDocumento,
  ] = useState(false);

  const [
    errore,
    setErrore,
  ] = useState<string | null>(
    null,
  );

  const [
    messaggioSuccesso,
    setMessaggioSuccesso,
  ] = useState<string | null>(
    null,
  );

  /* =======================================================
     DERIVATI
     ======================================================= */

  const documentiOrdinati = useMemo(
    () =>
      [...documenti].sort(
        (a, b) =>
          a.ordineVisualizzazione -
          b.ordineVisualizzazione,
      ),
    [documenti],
  );

  const documentiAttivi = useMemo(
    () =>
      documenti.filter(
        (documento) =>
          documento.attivo,
      ).length,
    [documenti],
  );

  const prossimoOrdineDocumento =
    useMemo(() => {
      if (documenti.length === 0) {
        return 1;
      }

      return (
        Math.max(
          ...documenti.map(
            (documento) =>
              documento.ordineVisualizzazione,
          ),
        ) + 1
      );
    }, [documenti]);

  /* =======================================================
     CARICAMENTO
     ======================================================= */

  const caricaDettaglio =
    async () => {
      if (
        !Number.isInteger(
          servizioId,
        ) ||
        servizioId <= 0
      ) {
        setErrore(
          "Identificativo servizio non valido.",
        );

        setCaricamento(false);

        return;
      }

      try {
        setCaricamento(true);
        setErrore(null);

        const [
          dettaglioServizio,
          documentiServizio,
        ] = await Promise.all([
          servizioService
            .trovaServizioPerId(
              servizioId,
            ),

          documentoServizioService
            .trovaDocumentiPerServizio(
              servizioId,
            ),
        ]);

        setServizio(
          dettaglioServizio,
        );

        setForm(
          creaFormDaServizio(
            dettaglioServizio,
          ),
        );

        setDocumenti(
          documentiServizio,
        );
      } catch {
        setErrore(
          "Non è stato possibile caricare il dettaglio del servizio.",
        );
      } finally {
        setCaricamento(false);
      }
    };

  useEffect(() => {
    void caricaDettaglio();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servizioId]);

  /* =======================================================
     HELPERS SERVIZIO
     ======================================================= */

  const formattaPrezzo =
    () => {
      if (!servizio) {
        return "—";
      }

      if (
        servizio.prezzoTesto
      ) {
        return servizio.prezzoTesto;
      }

      if (
        servizio.prezzo === null
      ) {
        return "—";
      }

      return new Intl.NumberFormat(
        "it-IT",
        {
          style: "currency",
          currency: "EUR",
        },
      ).format(servizio.prezzo);
    };

  const aggiornaCampo = <
    K extends keyof FormServizio,
  >(
    campo: K,
    valore: FormServizio[K],
  ) => {
    setForm((corrente) =>
      corrente
        ? {
            ...corrente,
            [campo]: valore,
          }
        : corrente,
    );
  };

  const annullaModifica =
    () => {
      if (!servizio) {
        return;
      }

      setForm(
        creaFormDaServizio(
          servizio,
        ),
      );

      setModalitaModifica(false);
      setErrore(null);
      setMessaggioSuccesso(null);
    };

  /* =======================================================
     SALVATAGGIO SERVIZIO
     ======================================================= */

  const salvaModifiche =
    async () => {
      if (!form) {
        return;
      }

      if (
        form.nome.trim() === ""
      ) {
        setErrore(
          "Il nome del servizio è obbligatorio.",
        );

        return;
      }

      try {
        setSalvataggio(true);
        setErrore(null);
        setMessaggioSuccesso(null);

        const request:
          UpdateServizioRequest = {
          nome:
            form.nome.trim(),

          descrizioneBreve:
            form.descrizioneBreve.trim(),

          descrizione:
            form.descrizione.trim(),

          destinatari:
            form.destinatari.trim(),

          requisiti:
            form.requisiti.trim(),

          comeFunziona:
            form.comeFunziona.trim(),

          prezzo:
            form.prezzo.trim() === ""
              ? undefined
              : Number(
                  form.prezzo,
                ),

          prezzoTesto:
            form.prezzoTesto.trim(),

          notaPrezzo:
            form.notaPrezzo.trim(),

          durataMinuti:
            form.durataMinuti.trim() ===
            ""
              ? undefined
              : Number(
                  form.durataMinuti,
                ),

          prenotabile:
            form.prenotabile,

          richiedibileOnline:
            form.richiedibileOnline,

          inEvidenza:
            form.inEvidenza,

          generaPratica:
            form.generaPratica,

          richiedeDocumenti:
            form.richiedeDocumenti,

          ordineVisualizzazione:
            Number(
              form.ordineVisualizzazione,
            ),

          attivo:
            form.attivo,

          validoFinoAl:
            form.validoFinoAl.trim() ===
            ""
              ? undefined
              : form.validoFinoAl,
        };

        const aggiornato =
          await servizioService
            .aggiornaServizio(
              servizioId,
              request,
            );

        setServizio(
          aggiornato,
        );

        setForm(
          creaFormDaServizio(
            aggiornato,
          ),
        );

        setModalitaModifica(false);

        setMessaggioSuccesso(
          "Servizio aggiornato correttamente.",
        );
      } catch {
        setErrore(
          "Non è stato possibile salvare le modifiche.",
        );
      } finally {
        setSalvataggio(false);
      }
    };

  /* =======================================================
     DOCUMENTO — AVVIA MODIFICA
     ======================================================= */

  const avviaModificaDocumento = (
    documento:
      DocumentoServizioResponse,
  ) => {
    setDocumentoInModificaId(
      documento.id,
    );

    setFormDocumento(
      creaFormDocumento(
        documento,
      ),
    );

    setNuovoDocumentoAperto(false);

    setErrore(null);
    setMessaggioSuccesso(null);
  };

  const annullaModificaDocumento =
    () => {
      setDocumentoInModificaId(null);
      setFormDocumento(null);
    };

  /* =======================================================
     DOCUMENTO — SALVA MODIFICA
     ======================================================= */

  const salvaDocumento =
    async (
      documentoId: number,
    ) => {
      if (!formDocumento) {
        return;
      }

      if (
        formDocumento.etichetta.trim() ===
        ""
      ) {
        setErrore(
          "Il nome del documento è obbligatorio.",
        );

        return;
      }

      try {
        setOperazioneDocumentoId(
          documentoId,
        );

        setErrore(null);
        setMessaggioSuccesso(null);

        const request:
          UpdateDocumentoServizioRequest =
          {
            etichetta:
              formDocumento.etichetta.trim(),

            suggerimento:
              formDocumento.suggerimento.trim(),

            tipoObbligatorieta:
              formDocumento.tipoObbligatorieta,

            visibileAlCliente:
              formDocumento.visibileAlCliente,

            ordineVisualizzazione:
              formDocumento.ordineVisualizzazione,
          };

        const aggiornato =
          await documentoServizioService
            .aggiornaDocumento(
              documentoId,
              request,
            );

        setDocumenti(
          (correnti) =>
            correnti.map(
              (documento) =>
                documento.id ===
                aggiornato.id
                  ? aggiornato
                  : documento,
            ),
        );

        setDocumentoInModificaId(
          null,
        );

        setFormDocumento(null);

        setMessaggioSuccesso(
          "Documento aggiornato correttamente.",
        );
      } catch {
        setErrore(
          "Non è stato possibile aggiornare il documento.",
        );
      } finally {
        setOperazioneDocumentoId(
          null,
        );
      }
    };

  /* =======================================================
     DOCUMENTO — NUOVO
     ======================================================= */

  const apriNuovoDocumento =
    () => {
      setNuovoDocumento({
        etichetta: "",
        suggerimento: "",

        tipoObbligatorieta:
          "OBBLIGATORIO",

        visibileAlCliente: true,

        ordineVisualizzazione:
          prossimoOrdineDocumento,
      });

      setDocumentoInModificaId(
        null,
      );

      setFormDocumento(null);

      setNuovoDocumentoAperto(
        true,
      );

      setErrore(null);
      setMessaggioSuccesso(null);
    };

  const creaDocumento =
    async () => {
      if (
        nuovoDocumento.etichetta.trim() ===
        ""
      ) {
        setErrore(
          "Il nome del documento è obbligatorio.",
        );

        return;
      }

      try {
        setCreazioneDocumento(
          true,
        );

        setErrore(null);
        setMessaggioSuccesso(null);

        const request:
          CreateDocumentoServizioRequest =
          {
            etichetta:
              nuovoDocumento.etichetta.trim(),

            suggerimento:
              nuovoDocumento.suggerimento.trim(),

            tipoObbligatorieta:
              nuovoDocumento.tipoObbligatorieta,

            visibileAlCliente:
              nuovoDocumento.visibileAlCliente,

            ordineVisualizzazione:
              nuovoDocumento.ordineVisualizzazione,
          };

        const creato =
          await documentoServizioService
            .creaDocumento(
              servizioId,
              request,
            );

        setDocumenti(
          (correnti) => [
            ...correnti,
            creato,
          ],
        );

        setNuovoDocumentoAperto(
          false,
        );

        setMessaggioSuccesso(
          "Documento aggiunto correttamente.",
        );
      } catch {
        setErrore(
          "Non è stato possibile aggiungere il documento.",
        );
      } finally {
        setCreazioneDocumento(
          false,
        );
      }
    };

  /* =======================================================
     DOCUMENTO — DISATTIVA / RIATTIVA
     ======================================================= */

  const cambiaAttivazioneDocumento =
    async (
      documento:
        DocumentoServizioResponse,
    ) => {
      try {
        setOperazioneDocumentoId(
          documento.id,
        );

        setErrore(null);
        setMessaggioSuccesso(null);

        if (documento.attivo) {
          await documentoServizioService
            .disattivaDocumento(
              documento.id,
            );

          setDocumenti(
            (correnti) =>
              correnti.map(
                (corrente) =>
                  corrente.id ===
                  documento.id
                    ? {
                        ...corrente,
                        attivo: false,
                      }
                    : corrente,
              ),
          );

          setMessaggioSuccesso(
            "Documento disattivato.",
          );

          return;
        }

        const aggiornato =
          await documentoServizioService
            .aggiornaDocumento(
              documento.id,
              {
                attivo: true,
              },
            );

        setDocumenti(
          (correnti) =>
            correnti.map(
              (corrente) =>
                corrente.id ===
                aggiornato.id
                  ? aggiornato
                  : corrente,
            ),
        );

        setMessaggioSuccesso(
          "Documento riattivato.",
        );
      } catch {
        setErrore(
          "Non è stato possibile modificare lo stato del documento.",
        );
      } finally {
        setOperazioneDocumentoId(
          null,
        );
      }
    };

  /* =======================================================
     LOADING / ERROR
     ======================================================= */

  if (caricamento) {
    return (
      <section className="dettaglio-servizio-page">
        <div className="dettaglio-servizio-state">
          Caricamento servizio...
        </div>
      </section>
    );
  }

  if (!servizio || !form) {
    return (
      <section className="dettaglio-servizio-page">
        <button
          type="button"
          className="dettaglio-servizio-back"
          onClick={() =>
            navigate(
              "/amministrazione/servizi",
            )
          }
        >
          <FiArrowLeft />

          Configurazione servizi
        </button>

        <div className="dettaglio-servizio-error">
          {errore ??
            "Servizio non trovato."}
        </div>
      </section>
    );
  }

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <section className="dettaglio-servizio-page">
      {/* TOPBAR */}

      <div className="dettaglio-servizio-topbar">
        <button
          type="button"
          className="dettaglio-servizio-back"
          onClick={() =>
            navigate(
              "/amministrazione/servizi",
            )
          }
        >
          <FiArrowLeft />

          Configurazione servizi
        </button>

        <div className="dettaglio-servizio-topbar__actions">
          <button
            type="button"
            className="dettaglio-servizio-refresh"
            onClick={() =>
              void caricaDettaglio()
            }
            disabled={
              salvataggio
            }
          >
            <FiRefreshCw />

            Aggiorna
          </button>

          {!modalitaModifica ? (
            <button
              type="button"
              className="dettaglio-servizio-edit-button"
              onClick={() => {
                setModalitaModifica(
                  true,
                );

                setMessaggioSuccesso(
                  null,
                );
              }}
            >
              <FiEdit3 />

              Modifica servizio
            </button>
          ) : (
            <>
              <button
                type="button"
                className="dettaglio-servizio-cancel-button"
                onClick={
                  annullaModifica
                }
                disabled={
                  salvataggio
                }
              >
                <FiX />

                Annulla
              </button>

              <button
                type="button"
                className="dettaglio-servizio-save-button"
                onClick={() =>
                  void salvaModifiche()
                }
                disabled={
                  salvataggio
                }
              >
                <FiSave />

                {salvataggio
                  ? "Salvataggio..."
                  : "Salva modifiche"}
              </button>
            </>
          )}
        </div>
      </div>

      {errore && (
        <div className="dettaglio-servizio-error">
          {errore}
        </div>
      )}

      {messaggioSuccesso && (
        <div className="dettaglio-servizio-success">
          {messaggioSuccesso}
        </div>
      )}

      {/* HERO */}

      <header className="dettaglio-servizio-hero">
        <span className="dettaglio-servizio-eyebrow">
          {servizio.macroAreaNome}
        </span>

        {modalitaModifica ? (
          <input
            type="text"
            className="dettaglio-servizio-title-input"
            value={form.nome}
            onChange={(evento) =>
              aggiornaCampo(
                "nome",
                evento.target.value,
              )
            }
          />
        ) : (
          <h1>
            {servizio.nome}
          </h1>
        )}

        {modalitaModifica ? (
          <textarea
            className="dettaglio-servizio-description-input"
            rows={2}
            value={
              form.descrizioneBreve
            }
            onChange={(evento) =>
              aggiornaCampo(
                "descrizioneBreve",
                evento.target.value,
              )
            }
            placeholder="Descrizione breve del servizio"
          />
        ) : (
          <p>
            {servizio.descrizioneBreve ??
              "Nessuna descrizione breve disponibile."}
          </p>
        )}

        <div className="dettaglio-servizio-badges">
          {form.attivo && (
            <span className="dettaglio-servizio-badge dettaglio-servizio-badge--active">
              Attivo
            </span>
          )}

          {!form.attivo && (
            <span className="dettaglio-servizio-badge dettaglio-servizio-badge--inactive">
              Disattivato
            </span>
          )}

          {form.prenotabile && (
            <span className="dettaglio-servizio-badge dettaglio-servizio-badge--blue">
              Prenotabile
            </span>
          )}

          {form.richiedibileOnline && (
            <span className="dettaglio-servizio-badge dettaglio-servizio-badge--purple">
              Online
            </span>
          )}

          {form.inEvidenza && (
            <span className="dettaglio-servizio-badge dettaglio-servizio-badge--featured">
              In evidenza
            </span>
          )}
        </div>
      </header>

      {/* INFO */}

      <section className="dettaglio-servizio-info-grid">
        <article className="dettaglio-servizio-info-card">
          <span className="dettaglio-servizio-info-icon dettaglio-servizio-info-icon--green">
            <FiDollarSign />
          </span>

          <div>
            <small>
              Prezzo
            </small>

            {modalitaModifica ? (
              <>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="dettaglio-servizio-inline-input"
                  value={form.prezzo}
                  onChange={(evento) =>
                    aggiornaCampo(
                      "prezzo",
                      evento.target.value,
                    )
                  }
                  placeholder="0,00"
                />

                <input
                  type="text"
                  className="dettaglio-servizio-inline-secondary-input"
                  value={
                    form.notaPrezzo
                  }
                  onChange={(evento) =>
                    aggiornaCampo(
                      "notaPrezzo",
                      evento.target.value,
                    )
                  }
                  placeholder="Nota sul prezzo"
                />
              </>
            ) : (
              <>
                <strong>
                  {formattaPrezzo()}
                </strong>

                <span>
                  {servizio.notaPrezzo ??
                    "Nessuna nota"}
                </span>
              </>
            )}
          </div>
        </article>

        <article className="dettaglio-servizio-info-card">
          <span className="dettaglio-servizio-info-icon dettaglio-servizio-info-icon--blue">
            <FiClock />
          </span>

          <div>
            <small>
              Durata
            </small>

            {modalitaModifica ? (
              <input
                type="number"
                min="0"
                className="dettaglio-servizio-inline-input"
                value={
                  form.durataMinuti
                }
                onChange={(evento) =>
                  aggiornaCampo(
                    "durataMinuti",
                    evento.target.value,
                  )
                }
                placeholder="Minuti"
              />
            ) : (
              <strong>
                {servizio.durataMinuti
                  ? `${servizio.durataMinuti} min`
                  : "—"}
              </strong>
            )}

            <span>
              Durata indicativa
            </span>
          </div>
        </article>

        <article className="dettaglio-servizio-info-card">
          <span className="dettaglio-servizio-info-icon dettaglio-servizio-info-icon--purple">
            <FiFileText />
          </span>

          <div>
            <small>
              Documenti
            </small>

            <strong>
              {documentiAttivi}
            </strong>

            <span>
              {documenti.length} configurati
            </span>
          </div>
        </article>

        <article className="dettaglio-servizio-info-card">
          <span className="dettaglio-servizio-info-icon dettaglio-servizio-info-icon--orange">
            <FiGlobe />
          </span>

          <div>
            <small>
              Richiesta online
            </small>

            <strong>
              {form.richiedibileOnline
                ? "Disponibile"
                : "Non disponibile"}
            </strong>

            <span>
              Canale digitale
            </span>
          </div>
        </article>
      </section>

      {/* LAYOUT */}

      <div className="dettaglio-servizio-layout">
        <main className="dettaglio-servizio-main">
          {/* INFORMAZIONI */}

          <section className="dettaglio-servizio-panel">
            <header className="dettaglio-servizio-panel__header">
              <div>
                <span className="dettaglio-servizio-panel__icon">
                  <FiSettings />
                </span>

                <div>
                  <h2>
                    Informazioni servizio
                  </h2>

                  <p>
                    Contenuti utilizzabili anche
                    nelle pagine pubbliche.
                  </p>
                </div>
              </div>
            </header>

            <div className="dettaglio-servizio-details">
              <div>
                <small>
                  Descrizione
                </small>

                {modalitaModifica ? (
                  <textarea
                    rows={5}
                    className="dettaglio-servizio-textarea"
                    value={
                      form.descrizione
                    }
                    onChange={(evento) =>
                      aggiornaCampo(
                        "descrizione",
                        evento.target.value,
                      )
                    }
                    placeholder="Inserisci la descrizione completa del servizio..."
                  />
                ) : (
                  <p>
                    {servizio.descrizione ??
                      "Nessuna descrizione inserita."}
                  </p>
                )}
              </div>

              <div>
                <small>
                  Destinatari
                </small>

                {modalitaModifica ? (
                  <textarea
                    rows={5}
                    className="dettaglio-servizio-textarea"
                    value={
                      form.destinatari
                    }
                    onChange={(evento) =>
                      aggiornaCampo(
                        "destinatari",
                        evento.target.value,
                      )
                    }
                    placeholder="A chi è rivolto il servizio?"
                  />
                ) : (
                  <p>
                    {servizio.destinatari ??
                      "Non specificati."}
                  </p>
                )}
              </div>

              <div>
                <small>
                  Requisiti
                </small>

                {modalitaModifica ? (
                  <textarea
                    rows={5}
                    className="dettaglio-servizio-textarea"
                    value={
                      form.requisiti
                    }
                    onChange={(evento) =>
                      aggiornaCampo(
                        "requisiti",
                        evento.target.value,
                      )
                    }
                    placeholder="Inserisci i requisiti..."
                  />
                ) : (
                  <p>
                    {servizio.requisiti ??
                      "Nessun requisito specificato."}
                  </p>
                )}
              </div>

              <div>
                <small>
                  Come funziona
                </small>

                {modalitaModifica ? (
                  <textarea
                    rows={5}
                    className="dettaglio-servizio-textarea"
                    value={
                      form.comeFunziona
                    }
                    onChange={(evento) =>
                      aggiornaCampo(
                        "comeFunziona",
                        evento.target.value,
                      )
                    }
                    placeholder="Spiega come funziona il servizio..."
                  />
                ) : (
                  <p>
                    {servizio.comeFunziona ??
                      "Nessuna indicazione inserita."}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* DOCUMENTI */}

          <section className="dettaglio-servizio-panel">
            <header className="dettaglio-servizio-panel__header dettaglio-servizio-panel__header--documenti">
              <div>
                <span className="dettaglio-servizio-panel__icon dettaglio-servizio-panel__icon--documents">
                  <FiFileText />
                </span>

                <div>
                  <h2>
                    Documenti richiesti
                  </h2>

                  <p>
                    Checklist utilizzata per
                    generare i documenti delle
                    pratiche.
                  </p>
                </div>
              </div>

              <div className="dettaglio-servizio-documenti-header-actions">
                <span className="dettaglio-servizio-panel__count">
                  {documentiAttivi}/
                  {documenti.length}
                </span>

                <button
                  type="button"
                  className="dettaglio-servizio-add-document"
                  onClick={
                    apriNuovoDocumento
                  }
                >
                  <FiPlus />

                  Aggiungi documento
                </button>
              </div>
            </header>

            {/* NUOVO DOCUMENTO */}

            {nuovoDocumentoAperto && (
              <div className="dettaglio-servizio-documento-editor dettaglio-servizio-documento-editor--new">
                <div className="dettaglio-servizio-documento-editor__heading">
                  <div>
                    <span>
                      Nuovo documento
                    </span>

                    <strong>
                      Aggiungi un elemento alla checklist
                    </strong>
                  </div>

                  <button
                    type="button"
                    className="dettaglio-servizio-icon-button"
                    onClick={() =>
                      setNuovoDocumentoAperto(
                        false,
                      )
                    }
                    aria-label="Chiudi"
                  >
                    <FiX />
                  </button>
                </div>

                <div className="dettaglio-servizio-documento-editor__grid">
                  <label className="dettaglio-servizio-documento-field dettaglio-servizio-documento-field--full">
                    <span>
                      Documento
                    </span>

                    <input
                      type="text"
                      value={
                        nuovoDocumento.etichetta
                      }
                      onChange={(evento) =>
                        setNuovoDocumento(
                          (corrente) => ({
                            ...corrente,
                            etichetta:
                              evento.target.value,
                          }),
                        )
                      }
                      placeholder="Es. Documento di identità"
                    />
                  </label>

                  <label className="dettaglio-servizio-documento-field dettaglio-servizio-documento-field--full">
                    <span>
                      Suggerimento
                    </span>

                    <textarea
                      rows={3}
                      value={
                        nuovoDocumento.suggerimento
                      }
                      onChange={(evento) =>
                        setNuovoDocumento(
                          (corrente) => ({
                            ...corrente,
                            suggerimento:
                              evento.target.value,
                          }),
                        )
                      }
                      placeholder="Indicazioni da mostrare all'utente..."
                    />
                  </label>
                </div>

                <div className="dettaglio-servizio-documento-editor__bottom">
                  <div>
                    <span className="dettaglio-servizio-documento-field-label">
                      Obbligatorietà
                    </span>

                    <div className="dettaglio-servizio-obbligatorieta">
                      {TIPI_OBBLIGATORIETA.map(
                        (tipo) => (
                          <button
                            key={
                              tipo.value
                            }
                            type="button"
                            className={[
                              "dettaglio-servizio-obbligatorieta__button",
                              nuovoDocumento.tipoObbligatorieta ===
                              tipo.value
                                ? "dettaglio-servizio-obbligatorieta__button--active"
                                : "",
                            ]
                              .filter(
                                Boolean,
                              )
                              .join(" ")}
                            onClick={() =>
                              setNuovoDocumento(
                                (
                                  corrente,
                                ) => ({
                                  ...corrente,
                                  tipoObbligatorieta:
                                    tipo.value,
                                }),
                              )
                            }
                          >
                            {
                              tipo.label
                            }
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  <label className="dettaglio-servizio-visibility-toggle">
                    <span>
                      <FiEye />

                      Visibile al cliente
                    </span>

                    <input
                      type="checkbox"
                      checked={
                        nuovoDocumento.visibileAlCliente
                      }
                      onChange={(evento) =>
                        setNuovoDocumento(
                          (corrente) => ({
                            ...corrente,
                            visibileAlCliente:
                              evento.target.checked,
                          }),
                        )
                      }
                    />
                  </label>
                </div>

                <div className="dettaglio-servizio-documento-editor__actions">
                  <button
                    type="button"
                    className="dettaglio-servizio-document-cancel"
                    onClick={() =>
                      setNuovoDocumentoAperto(
                        false,
                      )
                    }
                  >
                    Annulla
                  </button>

                  <button
                    type="button"
                    className="dettaglio-servizio-document-save"
                    onClick={() =>
                      void creaDocumento()
                    }
                    disabled={
                      creazioneDocumento
                    }
                  >
                    <FiSave />

                    {creazioneDocumento
                      ? "Salvataggio..."
                      : "Aggiungi documento"}
                  </button>
                </div>
              </div>
            )}

            {/* LISTA */}

            <div className="dettaglio-servizio-documenti">
              {documentiOrdinati.length ===
              0 ? (
                <div className="dettaglio-servizio-empty">
                  Nessun documento configurato.
                </div>
              ) : (
                documentiOrdinati.map(
                  (documento) => {
                    const inModifica =
                      documentoInModificaId ===
                      documento.id;

                    if (
                      inModifica &&
                      formDocumento
                    ) {
                      return (
                        <article
                          key={
                            documento.id
                          }
                          className="dettaglio-servizio-documento-editor"
                        >
                          <div className="dettaglio-servizio-documento-editor__heading">
                            <div>
                              <span>
                                Modifica documento
                              </span>

                              <strong>
                                {
                                  documento.etichetta
                                }
                              </strong>
                            </div>

                            <button
                              type="button"
                              className="dettaglio-servizio-icon-button"
                              onClick={
                                annullaModificaDocumento
                              }
                              aria-label="Chiudi modifica"
                            >
                              <FiX />
                            </button>
                          </div>

                          <div className="dettaglio-servizio-documento-editor__grid">
                            <label className="dettaglio-servizio-documento-field dettaglio-servizio-documento-field--full">
                              <span>
                                Documento
                              </span>

                              <input
                                type="text"
                                value={
                                  formDocumento.etichetta
                                }
                                onChange={(
                                  evento,
                                ) =>
                                  setFormDocumento(
                                    (
                                      corrente,
                                    ) =>
                                      corrente
                                        ? {
                                            ...corrente,
                                            etichetta:
                                              evento
                                                .target
                                                .value,
                                          }
                                        : corrente,
                                  )
                                }
                              />
                            </label>

                            <label className="dettaglio-servizio-documento-field dettaglio-servizio-documento-field--full">
                              <span>
                                Suggerimento
                              </span>

                              <textarea
                                rows={3}
                                value={
                                  formDocumento.suggerimento
                                }
                                onChange={(
                                  evento,
                                ) =>
                                  setFormDocumento(
                                    (
                                      corrente,
                                    ) =>
                                      corrente
                                        ? {
                                            ...corrente,
                                            suggerimento:
                                              evento
                                                .target
                                                .value,
                                          }
                                        : corrente,
                                  )
                                }
                              />
                            </label>
                          </div>

                          <div className="dettaglio-servizio-documento-editor__bottom">
                            <div>
                              <span className="dettaglio-servizio-documento-field-label">
                                Obbligatorietà
                              </span>

                              <div className="dettaglio-servizio-obbligatorieta">
                                {TIPI_OBBLIGATORIETA.map(
                                  (
                                    tipo,
                                  ) => (
                                    <button
                                      key={
                                        tipo.value
                                      }
                                      type="button"
                                      className={[
                                        "dettaglio-servizio-obbligatorieta__button",
                                        formDocumento.tipoObbligatorieta ===
                                        tipo.value
                                          ? "dettaglio-servizio-obbligatorieta__button--active"
                                          : "",
                                      ]
                                        .filter(
                                          Boolean,
                                        )
                                        .join(
                                          " ",
                                        )}
                                      onClick={() =>
                                        setFormDocumento(
                                          (
                                            corrente,
                                          ) =>
                                            corrente
                                              ? {
                                                  ...corrente,
                                                  tipoObbligatorieta:
                                                    tipo.value,
                                                }
                                              : corrente,
                                        )
                                      }
                                    >
                                      {
                                        tipo.label
                                      }
                                    </button>
                                  ),
                                )}
                              </div>
                            </div>

                            <label className="dettaglio-servizio-visibility-toggle">
                              <span>
                                {formDocumento.visibileAlCliente ? (
                                  <FiEye />
                                ) : (
                                  <FiEyeOff />
                                )}

                                Visibile al cliente
                              </span>

                              <input
                                type="checkbox"
                                checked={
                                  formDocumento.visibileAlCliente
                                }
                                onChange={(
                                  evento,
                                ) =>
                                  setFormDocumento(
                                    (
                                      corrente,
                                    ) =>
                                      corrente
                                        ? {
                                            ...corrente,
                                            visibileAlCliente:
                                              evento
                                                .target
                                                .checked,
                                          }
                                        : corrente,
                                  )
                                }
                              />
                            </label>
                          </div>

                          <div className="dettaglio-servizio-documento-editor__actions">
                            <button
                              type="button"
                              className="dettaglio-servizio-document-cancel"
                              onClick={
                                annullaModificaDocumento
                              }
                            >
                              Annulla
                            </button>

                            <button
                              type="button"
                              className="dettaglio-servizio-document-save"
                              onClick={() =>
                                void salvaDocumento(
                                  documento.id,
                                )
                              }
                              disabled={
                                operazioneDocumentoId ===
                                documento.id
                              }
                            >
                              <FiSave />

                              {operazioneDocumentoId ===
                              documento.id
                                ? "Salvataggio..."
                                : "Salva documento"}
                            </button>
                          </div>
                        </article>
                      );
                    }

                    return (
                      <article
                        key={
                          documento.id
                        }
                        className={[
                          "dettaglio-servizio-documento",
                          !documento.attivo
                            ? "dettaglio-servizio-documento--inactive"
                            : "",
                        ]
                          .filter(
                            Boolean,
                          )
                          .join(" ")}
                      >
                        <span className="dettaglio-servizio-documento__order">
                          {
                            documento.ordineVisualizzazione
                          }
                        </span>

                        <span
                          className={[
                            "dettaglio-servizio-documento__status",
                            `dettaglio-servizio-documento__status--${documento.tipoObbligatorieta.toLowerCase()}`,
                          ].join(
                            " ",
                          )}
                        >
                          <FiCheck />
                        </span>

                        <div className="dettaglio-servizio-documento__main">
                          <strong>
                            {
                              documento.etichetta
                            }
                          </strong>

                          <p>
                            {documento.suggerimento ??
                              "Nessuna indicazione aggiuntiva."}
                          </p>

                          <div className="dettaglio-servizio-documento__meta">
                            <span
                              className={`dettaglio-servizio-documento__type dettaglio-servizio-documento__type--${documento.tipoObbligatorieta.toLowerCase()}`}
                            >
                              {
                                TIPI_OBBLIGATORIETA.find(
                                  (
                                    tipo,
                                  ) =>
                                    tipo.value ===
                                    documento.tipoObbligatorieta,
                                )
                                  ?.label
                              }
                            </span>

                            <span>
                              {documento.visibileAlCliente ? (
                                <>
                                  <FiEye />
                                  Visibile
                                </>
                              ) : (
                                <>
                                  <FiEyeOff />
                                  Nascosto
                                </>
                              )}
                            </span>

                            {!documento.attivo && (
                              <span className="dettaglio-servizio-documento__inactive-badge">
                                Disattivato
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="dettaglio-servizio-documento__actions">
                          <button
                            type="button"
                            className="dettaglio-servizio-document-action dettaglio-servizio-document-action--edit"
                            onClick={() =>
                              avviaModificaDocumento(
                                documento,
                              )
                            }
                          >
                            <FiEdit3 />

                            Modifica
                          </button>

                          <button
                            type="button"
                            className={[
                              "dettaglio-servizio-document-action",
                              documento.attivo
                                ? "dettaglio-servizio-document-action--disable"
                                : "dettaglio-servizio-document-action--enable",
                            ].join(
                              " ",
                            )}
                            onClick={() =>
                              void cambiaAttivazioneDocumento(
                                documento,
                              )
                            }
                            disabled={
                              operazioneDocumentoId ===
                              documento.id
                            }
                          >
                            {documento.attivo ? (
                              <>
                                <FiTrash2 />
                                Disattiva
                              </>
                            ) : (
                              <>
                                <FiRotateCcw />
                                Riattiva
                              </>
                            )}
                          </button>
                        </div>
                      </article>
                    );
                  },
                )
              )}
            </div>
          </section>
        </main>

        {/* SIDEBAR */}

        <aside className="dettaglio-servizio-sidebar">
          <section className="dettaglio-servizio-side-card">
            <header>
              <FiSettings />

              <h2>
                Configurazione
              </h2>
            </header>

            {modalitaModifica ? (
              <div className="dettaglio-servizio-switches">
                {[
                  {
                    key: "attivo",
                    label: "Attivo",
                    description:
                      "Servizio disponibile",
                  },
                  {
                    key: "prenotabile",
                    label: "Prenotabile",
                    description:
                      "Appuntamento in sede",
                  },
                  {
                    key: "richiedibileOnline",
                    label:
                      "Richiedibile online",
                    description:
                      "Richiesta digitale",
                  },
                  {
                    key: "inEvidenza",
                    label: "In evidenza",
                    description:
                      "Mostra in primo piano",
                  },
                  {
                    key: "generaPratica",
                    label:
                      "Genera pratica",
                    description:
                      "Crea una pratica",
                  },
                  {
                    key: "richiedeDocumenti",
                    label:
                      "Richiede documenti",
                    description:
                      "Usa checklist documentale",
                  },
                ].map(
                  (configurazione) => {
                    const key =
                      configurazione.key as
                        | "attivo"
                        | "prenotabile"
                        | "richiedibileOnline"
                        | "inEvidenza"
                        | "generaPratica"
                        | "richiedeDocumenti";

                    return (
                      <label
                        key={key}
                      >
                        <span>
                          <strong>
                            {
                              configurazione.label
                            }
                          </strong>

                          <small>
                            {
                              configurazione.description
                            }
                          </small>
                        </span>

                        <input
                          type="checkbox"
                          checked={
                            form[key]
                          }
                          onChange={(
                            evento,
                          ) =>
                            aggiornaCampo(
                              key,
                              evento
                                .target
                                .checked,
                            )
                          }
                        />
                      </label>
                    );
                  },
                )}
              </div>
            ) : (
              <dl>
                <div>
                  <dt>
                    Attivo
                  </dt>

                  <dd>
                    {servizio.attivo
                      ? "Sì"
                      : "No"}
                  </dd>
                </div>

                <div>
                  <dt>
                    Prenotabile
                  </dt>

                  <dd>
                    {servizio.prenotabile
                      ? "Sì"
                      : "No"}
                  </dd>
                </div>

                <div>
                  <dt>
                    Richiedibile online
                  </dt>

                  <dd>
                    {servizio.richiedibileOnline
                      ? "Sì"
                      : "No"}
                  </dd>
                </div>

                <div>
                  <dt>
                    In evidenza
                  </dt>

                  <dd>
                    {servizio.inEvidenza
                      ? "Sì"
                      : "No"}
                  </dd>
                </div>

                <div>
                  <dt>
                    Genera pratica
                  </dt>

                  <dd>
                    {servizio.generaPratica
                      ? "Sì"
                      : "No"}
                  </dd>
                </div>

                <div>
                  <dt>
                    Richiede documenti
                  </dt>

                  <dd>
                    {servizio.richiedeDocumenti
                      ? "Sì"
                      : "No"}
                  </dd>
                </div>
              </dl>
            )}
          </section>

          <section className="dettaglio-servizio-side-card">
            <header>
              <FiFileText />

              <h2>
                Identificativi
              </h2>
            </header>

            <dl>
              <div>
                <dt>
                  ID servizio
                </dt>

                <dd>
                  {servizio.id}
                </dd>
              </div>

              <div>
                <dt>
                  Slug
                </dt>

                <dd>
                  {servizio.slug}
                </dd>
              </div>

              <div>
                <dt>
                  Ordine
                </dt>

                <dd>
                  {
                    servizio.ordineVisualizzazione
                  }
                </dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </section>
  );
};

export default DettaglioServizioPage;