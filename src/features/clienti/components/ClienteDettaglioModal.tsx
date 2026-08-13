import {
  useEffect,
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
  FiEdit3,
  FiLock,
  FiMail,
  FiMapPin,
  FiUser,
} from "react-icons/fi";

import { clientiService } from "../api/clientiService";
import type {
  AggiornaClienteRequest,
  Cliente,
} from "../types/clientiTypes";

import "./ClienteDettaglioModal.css";

interface ClienteDettaglioModalProps {
  clienteId: number | null;
  show: boolean;
  onHide: () => void;
  onClienteAggiornato: () => void;
}

type CampoCliente =
  keyof AggiornaClienteRequest;

const creaFormDaCliente = (
  cliente: Cliente,
): AggiornaClienteRequest => ({
  nome: cliente.nome,
  cognome: cliente.cognome,
  dataNascita: cliente.dataNascita,
  luogoNascita: cliente.luogoNascita,
  email: cliente.email,
  telefono: cliente.telefono,
  indirizzo: cliente.indirizzo,
  comune: cliente.comune,
  provincia: cliente.provincia,
  cap: cliente.cap,
});

const ClienteDettaglioModal = ({
  clienteId,
  show,
  onHide,
  onClienteAggiornato,
}: ClienteDettaglioModalProps) => {
  const [cliente, setCliente] =
    useState<Cliente | null>(null);

  const [form, setForm] =
    useState<AggiornaClienteRequest | null>(
      null,
    );

  const [
    modificaAttiva,
    setModificaAttiva,
  ] = useState(false);

  const [caricamento, setCaricamento] =
    useState(false);

  const [salvataggio, setSalvataggio] =
    useState(false);

  const [errore, setErrore] =
    useState<string | null>(null);

  useEffect(() => {
    if (!show || clienteId === null) {
      return;
    }

    const caricaCliente = async () => {
      try {
        setCaricamento(true);
        setErrore(null);
        setModificaAttiva(false);

        const dati =
          await clientiService.trovaPerId(
            clienteId,
          );

        setCliente(dati);
        setForm(creaFormDaCliente(dati));
      } catch {
        setErrore(
          "Impossibile caricare i dati del cliente.",
        );
      } finally {
        setCaricamento(false);
      }
    };

    void caricaCliente();
  }, [show, clienteId]);

  const aggiornaCampo = (
    campo: CampoCliente,
    valore: string,
  ) => {
    setForm((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        [campo]:
          valore.trim() === ""
            ? null
            : valore,
      };
    });
  };

  const aggiornaCampoObbligatorio = (
    campo: "nome" | "cognome" | "email",
    valore: string,
  ) => {
    setForm((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        [campo]: valore,
      };
    });
  };

  const annullaModifica = () => {
    if (!cliente) {
      return;
    }

    setForm(creaFormDaCliente(cliente));
    setErrore(null);
    setModificaAttiva(false);
  };

  const salvaModifiche = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      clienteId === null ||
      form === null
    ) {
      return;
    }

    if (
      form.provincia &&
      !/^[A-Z]{2}$/.test(form.provincia)
    ) {
      setErrore(
        "La provincia deve contenere esattamente 2 lettere.",
      );
      return;
    }

    if (
      form.cap &&
      !/^\d{5}$/.test(form.cap)
    ) {
      setErrore(
        "Il CAP deve contenere esattamente 5 cifre.",
      );
      return;
    }

    try {
      setSalvataggio(true);
      setErrore(null);

      const aggiornato =
        await clientiService.aggiornaCliente(
          clienteId,
          {
            ...form,

            nome: form.nome.trim(),
            cognome: form.cognome.trim(),

            email: form.email
              .trim()
              .toLowerCase(),

            provincia:
              form.provincia
                ?.trim()
                .toUpperCase() ?? null,

            cap:
              form.cap?.trim() || null,
          },
        );

      setCliente(aggiornato);

      setForm(
        creaFormDaCliente(aggiornato),
      );

      setModificaAttiva(false);

      onClienteAggiornato();
    } catch {
      setErrore(
        "Impossibile aggiornare il cliente. Controlla i dati inseriti e riprova.",
      );
    } finally {
      setSalvataggio(false);
    }
  };

  const chiudi = () => {
    if (salvataggio) {
      return;
    }

    setCliente(null);
    setForm(null);
    setErrore(null);
    setModificaAttiva(false);

    onHide();
  };

  const valore = (
    dato: string | null | undefined,
  ) =>
    dato && dato.trim() !== ""
      ? dato
      : "Non indicato";

  return (
    <Modal
      show={show}
      onHide={chiudi}
      size="lg"
      centered
      backdrop={
        salvataggio ? "static" : true
      }
      keyboard={!salvataggio}
      dialogClassName="cliente-dettaglio-modal"
    >
      <Form
        onSubmit={salvaModifiche}
        className="cliente-dettaglio-form"
      >
        <Modal.Header
          closeButton={!salvataggio}
          className="cliente-dettaglio-modal__header"
        >
          <div>
            <span className="cliente-dettaglio-modal__eyebrow">
              Anagrafica cliente
            </span>

            <Modal.Title>
              {cliente
                ? `${cliente.nome} ${cliente.cognome}`
                : "Scheda cliente"}
            </Modal.Title>

            {cliente && (
              <div className="cliente-dettaglio-modal__meta">
                <span>
                  {cliente.codiceFiscale}
                </span>

                <span
                  className={`cliente-dettaglio-status ${
                    cliente.attivo
                      ? "cliente-dettaglio-status--active"
                      : "cliente-dettaglio-status--inactive"
                  }`}
                >
                  {cliente.attivo
                    ? "Attivo"
                    : "Non attivo"}
                </span>
              </div>
            )}
          </div>
        </Modal.Header>

        <Modal.Body className="cliente-dettaglio-modal__body">
          {errore && (
            <Alert
              variant="danger"
              className="cliente-dettaglio-modal__alert"
            >
              {errore}
            </Alert>
          )}

          {caricamento ? (
            <div className="cliente-dettaglio-loading">
              <Spinner
                animation="border"
                size="sm"
              />

              <p>
                Caricamento cliente...
              </p>
            </div>
          ) : cliente && form ? (
            <>
              {/* DATI ANAGRAFICI */}

              <section className="cliente-dettaglio-section">
                <header className="cliente-dettaglio-section__header">
                  <span className="cliente-dettaglio-section__icon cliente-dettaglio-section__icon--green">
                    <FiUser />
                  </span>

                  <div>
                    <h3>
                      Dati anagrafici
                    </h3>

                    <p>
                      Informazioni principali
                      del cliente.
                    </p>
                  </div>
                </header>

                {modificaAttiva ? (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <Form.Group>
                        <Form.Label>
                          Nome
                        </Form.Label>

                        <Form.Control
                          required
                          maxLength={80}
                          value={form.nome}
                          disabled={salvataggio}
                          onChange={(event) =>
                            aggiornaCampoObbligatorio(
                              "nome",
                              event.target.value,
                            )
                          }
                        />
                      </Form.Group>
                    </div>

                    <div className="col-md-6">
                      <Form.Group>
                        <Form.Label>
                          Cognome
                        </Form.Label>

                        <Form.Control
                          required
                          maxLength={80}
                          value={
                            form.cognome
                          }
                          disabled={salvataggio}
                          onChange={(event) =>
                            aggiornaCampoObbligatorio(
                              "cognome",
                              event.target.value,
                            )
                          }
                        />
                      </Form.Group>
                    </div>

                    <div className="col-md-6">
                      <Form.Group>
                        <Form.Label>
                          Codice fiscale
                        </Form.Label>

                        <Form.Control
                          value={
                            cliente.codiceFiscale
                          }
                          disabled
                          readOnly
                        />

                        <Form.Text>
                          Il codice fiscale non
                          può essere modificato.
                        </Form.Text>
                      </Form.Group>
                    </div>

                    <div className="col-md-6">
                      <Form.Group>
                        <Form.Label>
                          Data di nascita
                        </Form.Label>

                        <Form.Control
                          type="date"
                          value={
                            form.dataNascita ??
                            ""
                          }
                          disabled={salvataggio}
                          onChange={(event) =>
                            aggiornaCampo(
                              "dataNascita",
                              event.target.value,
                            )
                          }
                        />
                      </Form.Group>
                    </div>

                    <div className="col-12">
                      <Form.Group>
                        <Form.Label>
                          Luogo di nascita
                        </Form.Label>

                        <Form.Control
                          maxLength={100}
                          value={
                            form.luogoNascita ??
                            ""
                          }
                          disabled={salvataggio}
                          onChange={(event) =>
                            aggiornaCampo(
                              "luogoNascita",
                              event.target.value,
                            )
                          }
                        />
                      </Form.Group>
                    </div>
                  </div>
                ) : (
                  <div className="cliente-dettaglio-grid">
                    <div className="cliente-dettaglio-field">
                      <span>Nome</span>
                      <strong>
                        {cliente.nome}
                      </strong>
                    </div>

                    <div className="cliente-dettaglio-field">
                      <span>Cognome</span>
                      <strong>
                        {cliente.cognome}
                      </strong>
                    </div>

                    <div className="cliente-dettaglio-field">
                      <span>
                        Codice fiscale
                      </span>
                      <strong>
                        {
                          cliente.codiceFiscale
                        }
                      </strong>
                    </div>

                    <div className="cliente-dettaglio-field">
                      <span>
                        Data di nascita
                      </span>
                      <strong>
                        {valore(
                          cliente.dataNascita,
                        )}
                      </strong>
                    </div>

                    <div className="cliente-dettaglio-field cliente-dettaglio-field--full">
                      <span>
                        Luogo di nascita
                      </span>
                      <strong>
                        {valore(
                          cliente.luogoNascita,
                        )}
                      </strong>
                    </div>
                  </div>
                )}
              </section>

              {/* CONTATTI */}

              <section className="cliente-dettaglio-section">
                <header className="cliente-dettaglio-section__header">
                  <span className="cliente-dettaglio-section__icon cliente-dettaglio-section__icon--blue">
                    <FiMail />
                  </span>

                  <div>
                    <h3>Contatti</h3>

                    <p>
                      Email e recapiti del
                      cliente.
                    </p>
                  </div>
                </header>

                {modificaAttiva ? (
                  <div className="row g-3">
                    <div className="col-md-7">
                      <Form.Group>
                        <Form.Label>
                          Email
                        </Form.Label>

                        <Form.Control
                          type="email"
                          required
                          maxLength={150}
                          value={form.email}
                          disabled={salvataggio}
                          onChange={(event) =>
                            aggiornaCampoObbligatorio(
                              "email",
                              event.target.value,
                            )
                          }
                        />
                      </Form.Group>
                    </div>

                    <div className="col-md-5">
                      <Form.Group>
                        <Form.Label>
                          Telefono
                        </Form.Label>

                        <Form.Control
                          type="tel"
                          maxLength={20}
                          value={
                            form.telefono ??
                            ""
                          }
                          disabled={salvataggio}
                          onChange={(event) =>
                            aggiornaCampo(
                              "telefono",
                              event.target.value,
                            )
                          }
                        />
                      </Form.Group>
                    </div>
                  </div>
                ) : (
                  <div className="cliente-dettaglio-grid">
                    <div className="cliente-dettaglio-field">
                      <span>Email</span>

                      <strong>
                        {cliente.email}
                      </strong>
                    </div>

                    <div className="cliente-dettaglio-field">
                      <span>Telefono</span>

                      <strong>
                        {valore(
                          cliente.telefono,
                        )}
                      </strong>
                    </div>
                  </div>
                )}
              </section>

              {/* RESIDENZA */}

              <section className="cliente-dettaglio-section">
                <header className="cliente-dettaglio-section__header">
                  <span className="cliente-dettaglio-section__icon cliente-dettaglio-section__icon--orange">
                    <FiMapPin />
                  </span>

                  <div>
                    <h3>Residenza</h3>

                    <p>
                      Dati dell&apos;indirizzo del
                      cliente.
                    </p>
                  </div>
                </header>

                {modificaAttiva ? (
                  <div className="row g-3">
                    <div className="col-12">
                      <Form.Group>
                        <Form.Label>
                          Indirizzo
                        </Form.Label>

                        <Form.Control
                          maxLength={150}
                          value={
                            form.indirizzo ??
                            ""
                          }
                          disabled={salvataggio}
                          onChange={(event) =>
                            aggiornaCampo(
                              "indirizzo",
                              event.target.value,
                            )
                          }
                        />
                      </Form.Group>
                    </div>

                    <div className="col-md-6">
                      <Form.Group>
                        <Form.Label>
                          Comune
                        </Form.Label>

                        <Form.Control
                          maxLength={100}
                          value={
                            form.comune ?? ""
                          }
                          disabled={salvataggio}
                          onChange={(event) =>
                            aggiornaCampo(
                              "comune",
                              event.target.value,
                            )
                          }
                        />
                      </Form.Group>
                    </div>

                    <div className="col-md-2">
                      <Form.Group>
                        <Form.Label>
                          Provincia
                        </Form.Label>

                        <Form.Control
                          maxLength={2}
                          value={
                            form.provincia ??
                            ""
                          }
                          disabled={salvataggio}
                          onChange={(event) =>
                            aggiornaCampo(
                              "provincia",
                              event.target.value
                                .replace(
                                  /[^a-zA-Z]/g,
                                  "",
                                )
                                .toUpperCase(),
                            )
                          }
                        />
                      </Form.Group>
                    </div>

                    <div className="col-md-4">
                      <Form.Group>
                        <Form.Label>
                          CAP
                        </Form.Label>

                        <Form.Control
                          inputMode="numeric"
                          maxLength={5}
                          value={
                            form.cap ?? ""
                          }
                          disabled={salvataggio}
                          onChange={(event) =>
                            aggiornaCampo(
                              "cap",
                              event.target.value.replace(
                                /\D/g,
                                "",
                              ),
                            )
                          }
                        />
                      </Form.Group>
                    </div>
                  </div>
                ) : (
                  <div className="cliente-dettaglio-grid">
                    <div className="cliente-dettaglio-field cliente-dettaglio-field--full">
                      <span>
                        Indirizzo
                      </span>

                      <strong>
                        {valore(
                          cliente.indirizzo,
                        )}
                      </strong>
                    </div>

                    <div className="cliente-dettaglio-field">
                      <span>Comune</span>

                      <strong>
                        {valore(
                          cliente.comune,
                        )}
                      </strong>
                    </div>

                    <div className="cliente-dettaglio-field">
                      <span>
                        Provincia / CAP
                      </span>

                      <strong>
                        {[
                          cliente.provincia,
                          cliente.cap,
                        ]
                          .filter(Boolean)
                          .join(" ") ||
                          "Non indicato"}
                      </strong>
                    </div>
                  </div>
                )}
              </section>

              {/* AREA CLIENTE */}

              <section className="cliente-dettaglio-section cliente-dettaglio-section--accesso">
                <div className="cliente-dettaglio-accesso">
                  <span className="cliente-dettaglio-section__icon cliente-dettaglio-section__icon--purple">
                    <FiLock />
                  </span>

                  <div className="cliente-dettaglio-accesso__content">
                    <h3>
                      Accesso Area Cliente
                    </h3>

                    <p>
                      L&apos;account è
                      attualmente{" "}
                      <strong>
                        {cliente.attivo
                          ? "attivo"
                          : "in attesa di attivazione"}
                      </strong>
                      .

                      {!cliente.attivo &&
                        " Il cliente deve completare l'attivazione tramite il link ricevuto via email."}
                    </p>
                  </div>
                </div>
              </section>
            </>
          ) : null}
        </Modal.Body>

        <Modal.Footer className="cliente-dettaglio-modal__footer">
          {!modificaAttiva && (
            <>
              <Button
                type="button"
                variant="outline-secondary"
                className="cliente-dettaglio-modal__close"
                onClick={chiudi}
              >
                Chiudi
              </Button>

              {cliente && (
                <Button
                  type="button"
                  className="cliente-dettaglio-modal__edit"
                  onClick={() =>
                    setModificaAttiva(true)
                  }
                >
                  <FiEdit3 />

                  <span>
                    Modifica
                  </span>
                </Button>
              )}
            </>
          )}

          {modificaAttiva && (
            <>
              <Button
                type="button"
                variant="outline-secondary"
                className="cliente-dettaglio-modal__cancel"
                onClick={annullaModifica}
                disabled={salvataggio}
              >
                Annulla modifica
              </Button>

              <Button
                type="submit"
                className="cliente-dettaglio-modal__save"
                disabled={salvataggio}
              >
                {salvataggio ? (
                  <>
                    <Spinner
                      animation="border"
                      size="sm"
                    />

                    <span>
                      Salvataggio...
                    </span>
                  </>
                ) : (
                  "Salva modifiche"
                )}
              </Button>
            </>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ClienteDettaglioModal;