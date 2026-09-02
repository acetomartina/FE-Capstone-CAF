import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  Alert,
  Button,
  Form,
  Modal,
  Spinner,
} from "react-bootstrap";

import {
  FiBriefcase,
  FiCalendar,
  FiFileText,
  FiLayers,
  FiUser,
} from "react-icons/fi";

import { clientiService } from "../../clienti/api/clientiService";
import type { Cliente } from "../../clienti/types/clientiTypes";

import { praticheService } from "../api/praticheService";
import type {
  CreaPraticaRequest,
  PrioritaPratica,
} from "../types/praticheTypes";

import { serviziService } from "../../servizi/api/serviziService";
import type {
  MacroArea,
  Servizio,
} from "../../servizi/types/serviziTypes";

import "./NuovaPraticaModal.css";

type NuovaPraticaModalProps = {
  show: boolean;
  onHide: () => void;
  onPraticaCreata: () => void;
};

type FormPratica = {
  clienteId: string;
  macroAreaId: string;
  servizioId: string;
  oggetto: string;
  descrizione: string;
  priorita: PrioritaPratica;
  dataScadenza: string;
  note: string;
};

const STATO_INIZIALE: FormPratica = {
  clienteId: "",
  macroAreaId: "",
  servizioId: "",
  oggetto: "",
  descrizione: "",
  priorita: "NORMALE",
  dataScadenza: "",
  note: "",
};

const PRIORITA: Array<{
  value: PrioritaPratica;
  label: string;
}> = [
  {
    value: "BASSA",
    label: "Bassa",
  },
  {
    value: "NORMALE",
    label: "Normale",
  },
  {
    value: "ALTA",
    label: "Alta",
  },
  {
    value: "URGENTE",
    label: "Urgente",
  },
];

export default function NuovaPraticaModal({
  show,
  onHide,
  onPraticaCreata,
}: NuovaPraticaModalProps) {
  const [
    form,
    setForm,
  ] = useState<FormPratica>(
    STATO_INIZIALE,
  );

  const [
    clienti,
    setClienti,
  ] = useState<Cliente[]>([]);

  const [
    macroAree,
    setMacroAree,
  ] = useState<MacroArea[]>([]);

  const [
    servizi,
    setServizi,
  ] = useState<Servizio[]>([]);

  const [
    caricamentoDati,
    setCaricamentoDati,
  ] = useState(false);

  const [
    caricamentoServizi,
    setCaricamentoServizi,
  ] = useState(false);

  const [
    salvataggio,
    setSalvataggio,
  ] = useState(false);

  const [
    errore,
    setErrore,
  ] = useState<string | null>(
    null,
  );

  const servizioSelezionato =
    useMemo(
      () =>
        servizi.find(
          (servizio) =>
            String(
              servizio.id,
            ) ===
            form.servizioId,
        ) ?? null,
      [
        form.servizioId,
        servizi,
      ],
    );

  useEffect(() => {
    if (!show) {
      return;
    }

    let attivo = true;

    const caricaDati = async () => {
      try {
        setCaricamentoDati(true);
        setErrore(null);

        const [
          rispostaClienti,
          rispostaMacroAree,
        ] = await Promise.all([
          clientiService.trovaTutti({
            attivo: true,
            page: 0,
            size: 200,
            sort: "cognome,asc",
          }),
          serviziService.trovaMacroAree(),
        ]);

        if (!attivo) {
          return;
        }

        setClienti(
          rispostaClienti.content,
        );

        setMacroAree(
          rispostaMacroAree,
        );
      } catch {
        if (attivo) {
          setErrore(
            "Impossibile caricare clienti e servizi. Riprova.",
          );
        }
      } finally {
        if (attivo) {
          setCaricamentoDati(
            false,
          );
        }
      }
    };

    void caricaDati();

    return () => {
      attivo = false;
    };
  }, [show]);

  useEffect(() => {
    if (
      !show ||
      !form.macroAreaId
    ) {
      setServizi([]);
      return;
    }

    let attivo = true;

    const caricaServizi = async () => {
      try {
        setCaricamentoServizi(
          true,
        );
        setErrore(null);

        const risposta =
          await serviziService
            .trovaServiziPerMacroArea(
              Number(
                form.macroAreaId,
              ),
            );

        if (!attivo) {
          return;
        }

        setServizi(risposta);
      } catch {
        if (attivo) {
          setServizi([]);
          setErrore(
            "Impossibile caricare i servizi della macroarea selezionata.",
          );
        }
      } finally {
        if (attivo) {
          setCaricamentoServizi(
            false,
          );
        }
      }
    };

    void caricaServizi();

    return () => {
      attivo = false;
    };
  }, [
    form.macroAreaId,
    show,
  ]);

  const chiudi = () => {
    if (salvataggio) {
      return;
    }

    setForm(STATO_INIZIALE);
    setServizi([]);
    setErrore(null);

    onHide();
  };

  const aggiornaCampo = <
    K extends keyof FormPratica,
  >(
    campo: K,
    valore: FormPratica[K],
  ) => {
    setForm((precedente) => ({
      ...precedente,
      [campo]: valore,
    }));
  };

  const cambiaMacroArea = (
    valore: string,
  ) => {
    setForm(
      (precedente) => ({
        ...precedente,
        macroAreaId: valore,
        servizioId: "",
      }),
    );
  };

  const inviaForm = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      !form.clienteId ||
      !form.servizioId ||
      !form.oggetto.trim()
    ) {
      setErrore(
        "Seleziona cliente e servizio e inserisci l’oggetto della pratica.",
      );
      return;
    }

    const request: CreaPraticaRequest = {
      clienteId: Number(
        form.clienteId,
      ),
      servizioId: Number(
        form.servizioId,
      ),
      oggetto:
        form.oggetto.trim(),
      descrizione:
        form.descrizione.trim() ||
        null,
      priorita:
        form.priorita,
      dataScadenza:
        form.dataScadenza ||
        null,
      note:
        form.note.trim() ||
        null,
    };

    try {
      setSalvataggio(true);
      setErrore(null);

      await praticheService
        .creaPratica(request);

      setForm(
        STATO_INIZIALE,
      );
      setServizi([]);

      onPraticaCreata();
      onHide();
    } catch {
      setErrore(
        "Impossibile creare la pratica. Controlla i dati inseriti e riprova.",
      );
    } finally {
      setSalvataggio(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={chiudi}
      size="lg"
      centered
      backdrop={
        salvataggio
          ? "static"
          : true
      }
      keyboard={!salvataggio}
      dialogClassName="nuova-pratica-modal"
    >
      <Form
        onSubmit={inviaForm}
        className="nuova-pratica-form"
      >
        <Modal.Header
          closeButton={!salvataggio}
          className="nuova-pratica-modal__header"
        >
          <div>
            <span className="nuova-pratica-modal__eyebrow">
              Gestione pratica
            </span>

            <Modal.Title>
              Nuova pratica
            </Modal.Title>

            <p>
              Seleziona cliente e servizio.
              Il responsabile sarà assegnato
              automaticamente all’account
              con cui stai creando la pratica.
            </p>
          </div>
        </Modal.Header>

        <Modal.Body className="nuova-pratica-modal__body">
          {errore && (
            <Alert
              variant="danger"
              className="nuova-pratica-modal__alert"
            >
              {errore}
            </Alert>
          )}

          {caricamentoDati ? (
            <div className="nuova-pratica-modal__loading">
              <Spinner
                animation="border"
                size="sm"
              />

              <span>
                Caricamento dati...
              </span>
            </div>
          ) : (
            <>
              <section className="nuova-pratica-section">
                <header className="nuova-pratica-section__header">
                  <span className="nuova-pratica-section__icon nuova-pratica-section__icon--green">
                    <FiUser />
                  </span>

                  <div>
                    <h3>
                      Cliente
                    </h3>

                    <p>
                      Seleziona il cliente a cui
                      intestare la pratica.
                    </p>
                  </div>
                </header>

                <Form.Group>
                  <Form.Label>
                    Cliente
                    <span className="nuova-pratica-required">
                      *
                    </span>
                  </Form.Label>

                  <Form.Select
                    required
                    value={
                      form.clienteId
                    }
                    disabled={
                      salvataggio
                    }
                    onChange={(
                      event,
                    ) =>
                      aggiornaCampo(
                        "clienteId",
                        event.target
                          .value,
                      )
                    }
                  >
                    <option value="">
                      Seleziona un cliente
                    </option>

                    {clienti.map(
                      (cliente) => (
                        <option
                          key={
                            cliente.id
                          }
                          value={
                            cliente.id
                          }
                        >
                          {
                            cliente.cognome
                          }{" "}
                          {
                            cliente.nome
                          }{" "}
                          ·{" "}
                          {
                            cliente.codiceFiscale
                          }
                        </option>
                      ),
                    )}
                  </Form.Select>

                  {clienti.length ===
                    0 && (
                    <Form.Text muted>
                      Non risultano clienti
                      attivi disponibili.
                    </Form.Text>
                  )}
                </Form.Group>
              </section>

              <section className="nuova-pratica-section">
                <header className="nuova-pratica-section__header">
                  <span className="nuova-pratica-section__icon nuova-pratica-section__icon--blue">
                    <FiLayers />
                  </span>

                  <div>
                    <h3>
                      Servizio
                    </h3>

                    <p>
                      Scegli prima la macroarea e
                      poi il servizio richiesto.
                    </p>
                  </div>
                </header>

                <div className="row g-3">
                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label>
                        Macroarea
                        <span className="nuova-pratica-required">
                          *
                        </span>
                      </Form.Label>

                      <Form.Select
                        required
                        value={
                          form.macroAreaId
                        }
                        disabled={
                          salvataggio
                        }
                        onChange={(
                          event,
                        ) =>
                          cambiaMacroArea(
                            event.target
                              .value,
                          )
                        }
                      >
                        <option value="">
                          Seleziona macroarea
                        </option>

                        {macroAree.map(
                          (
                            macroArea,
                          ) => (
                            <option
                              key={
                                macroArea.id
                              }
                              value={
                                macroArea.id
                              }
                            >
                              {
                                macroArea.nome
                              }
                            </option>
                          ),
                        )}
                      </Form.Select>
                    </Form.Group>
                  </div>

                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label>
                        Servizio
                        <span className="nuova-pratica-required">
                          *
                        </span>
                      </Form.Label>

                      <Form.Select
                        required
                        value={
                          form.servizioId
                        }
                        disabled={
                          salvataggio ||
                          !form.macroAreaId ||
                          caricamentoServizi
                        }
                        onChange={(
                          event,
                        ) =>
                          aggiornaCampo(
                            "servizioId",
                            event.target
                              .value,
                          )
                        }
                      >
                        <option value="">
                          {caricamentoServizi
                            ? "Caricamento..."
                            : "Seleziona servizio"}
                        </option>

                        {servizi.map(
                          (
                            servizio,
                          ) => (
                            <option
                              key={
                                servizio.id
                              }
                              value={
                                servizio.id
                              }
                            >
                              {
                                servizio.nome
                              }
                            </option>
                          ),
                        )}
                      </Form.Select>
                    </Form.Group>
                  </div>
                </div>

                {servizioSelezionato
                  ?.descrizioneBreve && (
                  <div className="nuova-pratica-service-note">
                    <FiBriefcase />

                    <span>
                      {
                        servizioSelezionato
                          .descrizioneBreve
                      }
                    </span>
                  </div>
                )}
              </section>

              <section className="nuova-pratica-section">
                <header className="nuova-pratica-section__header">
                  <span className="nuova-pratica-section__icon nuova-pratica-section__icon--purple">
                    <FiFileText />
                  </span>

                  <div>
                    <h3>
                      Dettagli pratica
                    </h3>

                    <p>
                      Inserisci le informazioni
                      operative principali.
                    </p>
                  </div>
                </header>

                <div className="row g-3">
                  <div className="col-12">
                    <Form.Group>
                      <Form.Label>
                        Oggetto
                        <span className="nuova-pratica-required">
                          *
                        </span>
                      </Form.Label>

                      <Form.Control
                        required
                        maxLength={200}
                        value={
                          form.oggetto
                        }
                        disabled={
                          salvataggio
                        }
                        placeholder="Es. Dichiarazione 730/2026"
                        onChange={(
                          event,
                        ) =>
                          aggiornaCampo(
                            "oggetto",
                            event.target
                              .value,
                          )
                        }
                      />
                    </Form.Group>
                  </div>

                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label>
                        Priorità
                      </Form.Label>

                      <Form.Select
                        value={
                          form.priorita
                        }
                        disabled={
                          salvataggio
                        }
                        onChange={(
                          event,
                        ) =>
                          aggiornaCampo(
                            "priorita",
                            event.target
                              .value as PrioritaPratica,
                          )
                        }
                      >
                        {PRIORITA.map(
                          (
                            priorita,
                          ) => (
                            <option
                              key={
                                priorita.value
                              }
                              value={
                                priorita.value
                              }
                            >
                              {
                                priorita.label
                              }
                            </option>
                          ),
                        )}
                      </Form.Select>
                    </Form.Group>
                  </div>

                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label>
                        Scadenza
                      </Form.Label>

                      <div className="nuova-pratica-date">
                        <FiCalendar />

                        <Form.Control
                          type="date"
                          value={
                            form.dataScadenza
                          }
                          disabled={
                            salvataggio
                          }
                          onChange={(
                            event,
                          ) =>
                            aggiornaCampo(
                              "dataScadenza",
                              event.target
                                .value,
                            )
                          }
                        />
                      </div>
                    </Form.Group>
                  </div>

                  <div className="col-12">
                    <Form.Group>
                      <Form.Label>
                        Descrizione
                      </Form.Label>

                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={
                          form.descrizione
                        }
                        disabled={
                          salvataggio
                        }
                        placeholder="Descrizione sintetica della pratica..."
                        onChange={(
                          event,
                        ) =>
                          aggiornaCampo(
                            "descrizione",
                            event.target
                              .value,
                          )
                        }
                      />
                    </Form.Group>
                  </div>

                  <div className="col-12">
                    <Form.Group>
                      <Form.Label>
                        Note interne
                      </Form.Label>

                      <Form.Control
                        as="textarea"
                        rows={3}
                        maxLength={2000}
                        value={
                          form.note
                        }
                        disabled={
                          salvataggio
                        }
                        placeholder="Annotazioni utili per gli operatori..."
                        onChange={(
                          event,
                        ) =>
                          aggiornaCampo(
                            "note",
                            event.target
                              .value,
                          )
                        }
                      />
                    </Form.Group>
                  </div>
                </div>
              </section>

              <div className="nuova-pratica-assignment">
                <FiUser />

                <div>
                  <strong>
                    Responsabile automatico
                  </strong>

                  <span>
                    La pratica verrà assegnata
                    all’utente attualmente
                    autenticato.
                  </span>
                </div>
              </div>

              <p className="nuova-pratica-modal__required-note">
                <span>*</span> Campi obbligatori
              </p>
            </>
          )}
        </Modal.Body>

        <Modal.Footer className="nuova-pratica-modal__footer">
          <Button
            type="button"
            variant="outline-secondary"
            className="nuova-pratica-modal__cancel"
            onClick={chiudi}
            disabled={
              salvataggio
            }
          >
            Annulla
          </Button>

          <Button
            type="submit"
            className="nuova-pratica-modal__submit"
            disabled={
              salvataggio ||
              caricamentoDati ||
              clienti.length === 0
            }
          >
            {salvataggio ? (
              <>
                <Spinner
                  animation="border"
                  size="sm"
                />

                <span>
                  Creazione...
                </span>
              </>
            ) : (
              "Crea pratica"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}