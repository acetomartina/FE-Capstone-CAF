import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Alert,
  Form,
  Spinner,
  Table,
} from "react-bootstrap";

import {
  FiAlertCircle,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiExternalLink,
  FiFileText,
  FiInbox,
  FiSearch,
  FiUser,
} from "react-icons/fi";

import {
  useNavigate,
} from "react-router-dom";

import PrivatePageHeader
  from "../../components/private/PrivatePageHeader";

import {
  documentiPraticaService,
} from "../../features/documenti/api/documentiPraticaService";

import type {
  DocumentoAdmin,
  PaginaDocumentiAdmin,
  RiepilogoDocumentiAdmin,
  StatoDocumentoPratica,
  TipoObbligatorietaDocumento,
} from "../../features/documenti/types/documentiTypes";

import "./DocumentiPage.css";

const STATI_DOCUMENTO:
StatoDocumentoPratica[] = [
  "MANCANTE",
  "RICEVUTO",
  "DA_VERIFICARE",
  "VALIDATO",
  "RIFIUTATO",
  "NON_APPLICABILE",
];

const TIPI_OBBLIGATORIETA:
TipoObbligatorietaDocumento[] = [
  "OBBLIGATORIO",
  "CONDIZIONALE",
  "FACOLTATIVO",
];

const ETICHETTE_STATO:
Record<StatoDocumentoPratica, string> = {
  MANCANTE: "Mancante",
  RICEVUTO: "Ricevuto",
  DA_VERIFICARE: "Da verificare",
  VALIDATO: "Validato",
  RIFIUTATO: "Rifiutato",
  NON_APPLICABILE: "Non applicabile",
};

const ETICHETTE_TIPO:
Record<
  TipoObbligatorietaDocumento,
  string
> = {
  OBBLIGATORIO: "Obbligatorio",
  CONDIZIONALE: "Condizionale",
  FACOLTATIVO: "Facoltativo",
};

const PAGINA_VUOTA:
PaginaDocumentiAdmin = {
  content: [],
  totalElements: 0,
  totalPages: 0,
  size: 20,
  number: 0,
  first: true,
  last: true,
  empty: true,
};

const RIEPILOGO_VUOTO:
RiepilogoDocumentiAdmin = {
  totale: 0,
  mancanti: 0,
  ricevuti: 0,
  daVerificare: 0,
  validati: 0,
  rifiutati: 0,
  nonApplicabili: 0,
};

const formattaData = (
  valore: string | null,
): string => {
  if (!valore) {
    return "—";
  }

  const data = valore.includes("T")
    ? new Date(valore)
    : new Date(`${valore}T00:00:00`);

  return new Intl.DateTimeFormat(
    "it-IT",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(data);
};

const classeStato = (
  stato: StatoDocumentoPratica,
): string =>
  stato
    .toLowerCase()
    .replaceAll("_", "-");

const DocumentiPage = () => {
  const navigate = useNavigate();

  const [
    pagina,
    setPagina,
  ] = useState<PaginaDocumentiAdmin>(
    PAGINA_VUOTA,
  );

  const [
    riepilogo,
    setRiepilogo,
  ] = useState<RiepilogoDocumentiAdmin>(
    RIEPILOGO_VUOTO,
  );

  const [
    ricerca,
    setRicerca,
  ] = useState("");

  const [
    ricercaApplicata,
    setRicercaApplicata,
  ] = useState("");

  const [
    stato,
    setStato,
  ] = useState<
    StatoDocumentoPratica | ""
  >("");

  const [
    tipoObbligatorieta,
    setTipoObbligatorieta,
  ] = useState<
    TipoObbligatorietaDocumento | ""
  >("");

  const [
    numeroPagina,
    setNumeroPagina,
  ] = useState(0);

  const [
    caricamento,
    setCaricamento,
  ] = useState(true);

  const [
    errore,
    setErrore,
  ] = useState<string | null>(null);

  const [
    documentoInAggiornamento,
    setDocumentoInAggiornamento,
  ] = useState<number | null>(null);

  useEffect(() => {
    const timeout =
      window.setTimeout(() => {
        setNumeroPagina(0);
        setRicercaApplicata(
          ricerca.trim(),
        );
      }, 300);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [ricerca]);

  const caricaRiepilogo =
    useCallback(async () => {
      try {
        const risposta =
          await documentiPraticaService
            .riepilogoAdmin();

        setRiepilogo(risposta);
      } catch {
        setRiepilogo(
          RIEPILOGO_VUOTO,
        );
      }
    }, []);

  const caricaDocumenti =
    useCallback(async () => {
      try {
        setCaricamento(true);
        setErrore(null);

        const risposta =
          await documentiPraticaService
            .trovaTutti({
              termine:
                ricercaApplicata ||
                undefined,
              stato:
                stato ||
                undefined,
              tipoObbligatorieta:
                tipoObbligatorieta ||
                undefined,
              page: numeroPagina,
              size: 20,
              sort:
                "aggiornatoIl,desc",
            });

        setPagina(risposta);
      } catch {
        setPagina(
          PAGINA_VUOTA,
        );

        setErrore(
          "Non è stato possibile caricare i documenti.",
        );
      } finally {
        setCaricamento(false);
      }
    }, [
      numeroPagina,
      ricercaApplicata,
      stato,
      tipoObbligatorieta,
    ]);

  useEffect(() => {
    void caricaRiepilogo();
  }, [caricaRiepilogo]);

  useEffect(() => {
    void caricaDocumenti();
  }, [caricaDocumenti]);

  const selezionaStatoRiepilogo = (
    nuovoStato:
    StatoDocumentoPratica,
  ) => {
    setNumeroPagina(0);

    setStato((statoCorrente) =>
      statoCorrente === nuovoStato
        ? ""
        : nuovoStato,
    );
  };

  const aggiornaStato = async (
    documento: DocumentoAdmin,
    nuovoStato:
    StatoDocumentoPratica,
  ) => {
    if (
      nuovoStato === documento.stato
    ) {
      return;
    }

    try {
      setDocumentoInAggiornamento(
        documento.id,
      );

      setErrore(null);

      const aggiornato =
        await documentiPraticaService
          .cambiaStato(
            documento.id,
            nuovoStato,
          );

      setPagina((paginaCorrente) => ({
        ...paginaCorrente,
        content:
          paginaCorrente.content.map(
            (elemento) =>
              elemento.id ===
              documento.id
                ? {
                    ...elemento,
                    stato:
                      aggiornato.stato,
                    aggiornatoIl:
                      aggiornato
                        .aggiornatoIl,
                  }
                : elemento,
          ),
      }));

      await caricaRiepilogo();
    } catch {
      setErrore(
        "Non è stato possibile aggiornare lo stato del documento.",
      );
    } finally {
      setDocumentoInAggiornamento(
        null,
      );
    }
  };

  const apriPratica = (
    praticaId: number,
  ) => {
    navigate(
      `/pratiche/${praticaId}`,
    );
  };

  return (
    <section className="documenti-page">
      <PrivatePageHeader
        eyebrow="Gestione documentale"
        title="Documenti"
        description="Controlla i documenti richiesti per tutte le pratiche, individua quelli mancanti e gestisci rapidamente le verifiche."
      />

      <section
        className="documenti-summary"
        aria-label="Riepilogo documenti"
      >
        <button
          type="button"
          className={`documenti-summary__card documenti-summary__card--missing ${
            stato === "MANCANTE"
              ? "is-active"
              : ""
          }`}
          onClick={() =>
            selezionaStatoRiepilogo(
              "MANCANTE",
            )
          }
        >
          <span className="documenti-summary__icon">
            <FiInbox />
          </span>

          <span className="documenti-summary__content">
            <small>Mancanti</small>
            <strong>
              {riepilogo.mancanti}
            </strong>
          </span>
        </button>

        <button
          type="button"
          className={`documenti-summary__card documenti-summary__card--review ${
            stato === "DA_VERIFICARE"
              ? "is-active"
              : ""
          }`}
          onClick={() =>
            selezionaStatoRiepilogo(
              "DA_VERIFICARE",
            )
          }
        >
          <span className="documenti-summary__icon">
            <FiClock />
          </span>

          <span className="documenti-summary__content">
            <small>Da verificare</small>
            <strong>
              {riepilogo.daVerificare}
            </strong>
          </span>
        </button>

        <button
          type="button"
          className={`documenti-summary__card documenti-summary__card--rejected ${
            stato === "RIFIUTATO"
              ? "is-active"
              : ""
          }`}
          onClick={() =>
            selezionaStatoRiepilogo(
              "RIFIUTATO",
            )
          }
        >
          <span className="documenti-summary__icon">
            <FiAlertCircle />
          </span>

          <span className="documenti-summary__content">
            <small>Rifiutati</small>
            <strong>
              {riepilogo.rifiutati}
            </strong>
          </span>
        </button>

        <button
          type="button"
          className={`documenti-summary__card documenti-summary__card--valid ${
            stato === "VALIDATO"
              ? "is-active"
              : ""
          }`}
          onClick={() =>
            selezionaStatoRiepilogo(
              "VALIDATO",
            )
          }
        >
          <span className="documenti-summary__icon">
            <FiCheckCircle />
          </span>

          <span className="documenti-summary__content">
            <small>Validati</small>
            <strong>
              {riepilogo.validati}
            </strong>
          </span>
        </button>
      </section>

      <section className="documenti-panel">
        <header className="documenti-panel__header">
          <div className="documenti-toolbar">
            <div className="documenti-search">
              <FiSearch />

              <input
                type="search"
                value={ricerca}
                onChange={(event) =>
                  setRicerca(
                    event.target.value,
                  )
                }
                placeholder="Cerca documento, cliente o pratica..."
                aria-label="Cerca documento"
              />
            </div>

            <Form.Select
              className="documenti-filter"
              value={stato}
              onChange={(event) => {
                setNumeroPagina(0);

                setStato(
                  event.target.value as
                    | StatoDocumentoPratica
                    | "",
                );
              }}
              aria-label="Filtra per stato"
            >
              <option value="">
                Tutti gli stati
              </option>

              {STATI_DOCUMENTO.map(
                (valore) => (
                  <option
                    key={valore}
                    value={valore}
                  >
                    {
                      ETICHETTE_STATO[
                        valore
                      ]
                    }
                  </option>
                ),
              )}
            </Form.Select>

            <Form.Select
              className="documenti-filter"
              value={
                tipoObbligatorieta
              }
              onChange={(event) => {
                setNumeroPagina(0);

                setTipoObbligatorieta(
                  event.target.value as
                    | TipoObbligatorietaDocumento
                    | "",
                );
              }}
              aria-label="Filtra per obbligatorietà"
            >
              <option value="">
                Tutte le tipologie
              </option>

              {TIPI_OBBLIGATORIETA.map(
                (valore) => (
                  <option
                    key={valore}
                    value={valore}
                  >
                    {
                      ETICHETTE_TIPO[
                        valore
                      ]
                    }
                  </option>
                ),
              )}
            </Form.Select>
          </div>

          <div className="documenti-count">
            <FiFileText />
            <span>
              {pagina.totalElements}
            </span>
            <small>
              {pagina.totalElements === 1
                ? "documento"
                : "documenti"}
            </small>
          </div>
        </header>

        {errore && (
          <Alert
            variant="danger"
            className="documenti-panel__alert"
          >
            {errore}
          </Alert>
        )}

        {caricamento &&
        pagina.content.length === 0 ? (
          <div className="documenti-loading">
            <Spinner
              animation="border"
              size="sm"
            />

            <p>
              Caricamento documenti...
            </p>
          </div>
        ) : (
          <div className="documenti-table-wrapper">
            <Table className="documenti-table">
              <thead>
                <tr>
                  <th>Documento</th>
                  <th>Cliente</th>
                  <th>Pratica</th>
                  <th>Tipologia</th>
                  <th>Stato</th>
                  <th>Aggiornato</th>
                  <th aria-label="Azioni" />
                </tr>
              </thead>

              <tbody>
                {pagina.content.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="documenti-table__empty"
                    >
                      Nessun documento
                      corrisponde ai filtri
                      selezionati.
                    </td>
                  </tr>
                ) : (
                  pagina.content.map(
                    (documento) => (
                      <tr
                        key={documento.id}
                        className="documenti-table__row"
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          apriPratica(
                            documento
                              .praticaId,
                          )
                        }
                        onKeyDown={(
                          event,
                        ) => {
                          if (
                            event.key ===
                              "Enter" ||
                            event.key === " "
                          ) {
                            event.preventDefault();

                            apriPratica(
                              documento
                                .praticaId,
                            );
                          }
                        }}
                      >
                        <td>
                          <div className="documenti-table__document">
                            <span className="documenti-table__icon">
                              <FiFileText />
                            </span>

                            <div>
                              <strong>
                                {
                                  documento
                                    .etichetta
                                }
                              </strong>

                              <span>
                                {
                                  documento
                                    .servizioNome
                                }
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="documenti-table__client">
                            <FiUser />

                            <div>
                              <strong>
                                {
                                  documento
                                    .clienteNome
                                }{" "}
                                {
                                  documento
                                    .clienteCognome
                                }
                              </strong>

                              <span>
                                {
                                  documento
                                    .clienteCodiceFiscale
                                }
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="documenti-table__practice">
                            <strong>
                              {
                                documento
                                  .oggettoPratica
                              }
                            </strong>

                            <span>
                              {
                                documento
                                  .numeroPratica
                              }
                            </span>
                          </div>
                        </td>

                        <td>
                          <span
                            className={`documenti-type documenti-type--${documento.tipoObbligatorieta.toLowerCase()}`}
                          >
                            {
                              ETICHETTE_TIPO[
                                documento
                                  .tipoObbligatorieta
                              ]
                            }
                          </span>
                        </td>

                        <td
                          onClick={(event) =>
                            event.stopPropagation()
                          }
                        >
                          <div className="documenti-status-control">
                            <Form.Select
                              value={
                                documento.stato
                              }
                              disabled={
                                documentoInAggiornamento ===
                                documento.id
                              }
                              onChange={(
                                event,
                              ) =>
                                void aggiornaStato(
                                  documento,
                                  event.target
                                    .value as StatoDocumentoPratica,
                                )
                              }
                              className={`documenti-status-select documenti-status-select--${classeStato(
                                documento.stato,
                              )}`}
                              aria-label={`Stato di ${documento.etichetta}`}
                            >
                              {STATI_DOCUMENTO.map(
                                (
                                  valore,
                                ) => (
                                  <option
                                    key={
                                      valore
                                    }
                                    value={
                                      valore
                                    }
                                  >
                                    {
                                      ETICHETTE_STATO[
                                        valore
                                      ]
                                    }
                                  </option>
                                ),
                              )}
                            </Form.Select>

                            {documentoInAggiornamento ===
                              documento.id && (
                              <Spinner
                                animation="border"
                                size="sm"
                              />
                            )}
                          </div>
                        </td>

                        <td>
                          <span className="documenti-table__date">
                            {formattaData(
                              documento
                                .aggiornatoIl,
                            )}
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="documenti-table__open"
                            onClick={(
                              event,
                            ) => {
                              event.stopPropagation();

                              apriPratica(
                                documento
                                  .praticaId,
                              );
                            }}
                            aria-label={`Apri pratica ${documento.numeroPratica}`}
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

        {pagina.totalPages > 1 && (
          <footer className="documenti-panel__footer">
            <p>
              Pagina {pagina.number + 1} di{" "}
              {pagina.totalPages}
            </p>

            <div className="documenti-pagination">
              <button
                type="button"
                disabled={pagina.first}
                onClick={() =>
                  setNumeroPagina(
                    Math.max(
                      0,
                      numeroPagina - 1,
                    ),
                  )
                }
                aria-label="Pagina precedente"
              >
                <FiChevronLeft />
              </button>

              <span>
                {pagina.number + 1}
              </span>

              <button
                type="button"
                disabled={pagina.last}
                onClick={() =>
                  setNumeroPagina(
                    numeroPagina + 1,
                  )
                }
                aria-label="Pagina successiva"
              >
                <FiChevronRight />
              </button>
            </div>
          </footer>
        )}
      </section>
    </section>
  );
};

export default DocumentiPage;