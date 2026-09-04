import type { FormEvent } from "react";
import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";
import { FiMapPin, FiPhone, FiSave, FiUser } from "react-icons/fi";

import type { AggiornaClienteRequest } from "../types/clientiTypes";

const dataOdierna = () =>
  new Date().toISOString().slice(0, 10);

interface ModificaClienteModalProps {
  mostraModal: boolean;
  suChiusura: () => void;

  valoriForm: AggiornaClienteRequest | null;

  aggiornaCampo: <K extends keyof AggiornaClienteRequest>(
    campo: K,
    dato: AggiornaClienteRequest[K],
  ) => void;

  suSalvataggio: (evento: FormEvent<HTMLFormElement>) => void;

  inSalvataggio: boolean;
  messaggioErrore: string | null;
}

const ModificaClienteModal = ({
  mostraModal,
  suChiusura,
  valoriForm,
  aggiornaCampo,
  suSalvataggio,
  inSalvataggio,
  messaggioErrore,
}: ModificaClienteModalProps) => {
  return (
      <Modal
        show={mostraModal}
        onHide={suChiusura}
        centered
        size="lg"
        backdrop={
          inSalvataggio
            ? "static"
            : true
        }
        keyboard={!inSalvataggio}
        dialogClassName="dettaglio-cliente-edit-modal"
      >
        {valoriForm && (
          <Form
            onSubmit={suSalvataggio}
          >
            <Modal.Header closeButton>
              <div>
                <span className="dettaglio-cliente-modal__eyebrow dettaglio-cliente-modal__eyebrow--green">
                  Scheda cliente
                </span>

                <Modal.Title>
                  Modifica dati
                </Modal.Title>
              </div>
            </Modal.Header>

            <Modal.Body>
              {messaggioErrore && (
                <Alert variant="danger">
                  {messaggioErrore}
                </Alert>
              )}

              <section className="dettaglio-cliente-form-section">
                <header>
                  <FiUser />

                  <div>
                    <h3>
                      Dati personali
                    </h3>

                    <p>
                      Anagrafica e identificazione fiscale.
                    </p>
                  </div>
                </header>

                <div className="dettaglio-cliente-form-grid">
                  <Form.Group>
                    <Form.Label>
                      Nome
                    </Form.Label>

                    <Form.Control
                      required
                      maxLength={80}
                      value={valoriForm.nome}
                      disabled={inSalvataggio}
                      onChange={(event) =>
                        aggiornaCampo(
                          "nome",
                          event.target.value,
                        )
                      }
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>
                      Cognome
                    </Form.Label>

                    <Form.Control
                      required
                      maxLength={80}
                      value={valoriForm.cognome}
                      disabled={inSalvataggio}
                      onChange={(event) =>
                        aggiornaCampo(
                          "cognome",
                          event.target.value,
                        )
                      }
                    />
                  </Form.Group>

                  <Form.Group className="dettaglio-cliente-form-grid__full">
                    <Form.Label>
                      Codice fiscale
                    </Form.Label>

                    <Form.Control
                      required
                      minLength={16}
                      maxLength={16}
                      pattern="[A-Za-z0-9]{16}"
                      className="text-uppercase"
                      value={
                        valoriForm.codiceFiscale
                      }
                      disabled={inSalvataggio}
                      onChange={(event) =>
                        aggiornaCampo(
                          "codiceFiscale",
                          event.target.value
                            .toUpperCase(),
                        )
                      }
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>
                      Data di nascita
                    </Form.Label>

                    <Form.Control
                      type="date"
                      max={dataOdierna()}
                      value={
                        valoriForm.dataNascita ??
                        ""
                      }
                      disabled={inSalvataggio}
                      onChange={(event) =>
                        aggiornaCampo(
                          "dataNascita",
                          event.target.value ||
                            null,
                        )
                      }
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>
                      Luogo di nascita
                    </Form.Label>

                    <Form.Control
                      maxLength={100}
                      value={
                        valoriForm.luogoNascita ??
                        ""
                      }
                      disabled={inSalvataggio}
                      onChange={(event) =>
                        aggiornaCampo(
                          "luogoNascita",
                          event.target.value,
                        )
                      }
                    />
                  </Form.Group>
                </div>
              </section>

              <section className="dettaglio-cliente-form-section">
                <header>
                  <FiPhone />

                  <div>
                    <h3>
                      Contatti
                    </h3>

                    <p>
                      Recapiti utilizzati per comunicazioni e accesso.
                    </p>
                  </div>
                </header>

                <div className="dettaglio-cliente-form-grid">
                  <Form.Group className="dettaglio-cliente-form-grid__full">
                    <Form.Label>
                      Email
                    </Form.Label>

                    <Form.Control
                      required
                      type="email"
                      maxLength={150}
                      value={valoriForm.email}
                      disabled={inSalvataggio}
                      onChange={(event) =>
                        aggiornaCampo(
                          "email",
                          event.target.value,
                        )
                      }
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>
                      Telefono principale
                    </Form.Label>

                    <Form.Control
                      type="tel"
                      maxLength={20}
                      value={
                        valoriForm.telefono ??
                        ""
                      }
                      disabled={inSalvataggio}
                      onChange={(event) =>
                        aggiornaCampo(
                          "telefono",
                          event.target.value,
                        )
                      }
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>
                      Telefono secondario
                      <small>
                        Facoltativo
                      </small>
                    </Form.Label>

                    <Form.Control
                      type="tel"
                      maxLength={20}
                      value={
                        valoriForm
                          .telefonoSecondario ??
                        ""
                      }
                      disabled={inSalvataggio}
                      onChange={(event) =>
                        aggiornaCampo(
                          "telefonoSecondario",
                          event.target.value,
                        )
                      }
                    />
                  </Form.Group>
                </div>
              </section>

              <section className="dettaglio-cliente-form-section">
                <header>
                  <FiMapPin />

                  <div>
                    <h3>
                      Residenza
                    </h3>

                    <p>
                      Indirizzo anagrafico principale.
                    </p>
                  </div>
                </header>

                <div className="dettaglio-cliente-form-grid dettaglio-cliente-form-grid--address">
                  <Form.Group className="dettaglio-cliente-form-grid__address">
                    <Form.Label>
                      Indirizzo
                    </Form.Label>

                    <Form.Control
                      maxLength={150}
                      value={
                        valoriForm.indirizzo ??
                        ""
                      }
                      disabled={inSalvataggio}
                      onChange={(event) =>
                        aggiornaCampo(
                          "indirizzo",
                          event.target.value,
                        )
                      }
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>
                      Comune
                    </Form.Label>

                    <Form.Control
                      maxLength={100}
                      value={
                        valoriForm.comune ??
                        ""
                      }
                      disabled={inSalvataggio}
                      onChange={(event) =>
                        aggiornaCampo(
                          "comune",
                          event.target.value,
                        )
                      }
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>
                      Provincia
                    </Form.Label>

                    <Form.Control
                      maxLength={2}
                      pattern="[A-Za-z]{2}"
                      className="text-uppercase"
                      value={
                        valoriForm.provincia ??
                        ""
                      }
                      disabled={inSalvataggio}
                      onChange={(event) =>
                        aggiornaCampo(
                          "provincia",
                          event.target.value
                            .toUpperCase(),
                        )
                      }
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>
                      CAP
                    </Form.Label>

                    <Form.Control
                      inputMode="numeric"
                      maxLength={5}
                      pattern="[0-9]{5}"
                      value={valoriForm.cap ?? ""}
                      disabled={inSalvataggio}
                      onChange={(event) =>
                        aggiornaCampo(
                          "cap",
                          event.target.value,
                        )
                      }
                    />
                  </Form.Group>
                </div>
              </section>

              <section className="dettaglio-cliente-form-section dettaglio-cliente-form-section--domicilio">
                <header>
                  <FiMapPin />

                  <div>
                    <h3>
                      Domicilio
                    </h3>

                    <p>
                      Compilalo soltanto se diverso dalla residenza.
                    </p>
                  </div>
                </header>

                <Form.Check
                  type="switch"
                  id="domicilio-diverso"
                  className="dettaglio-cliente-domicilio-switch"
                  label="Il domicilio è diverso dalla residenza"
                  checked={
                    valoriForm
                      .domicilioDiversoDallaResidenza
                  }
                  disabled={inSalvataggio}
                  onChange={(event) =>
                    aggiornaCampo(
                      "domicilioDiversoDallaResidenza",
                      event.target.checked,
                    )
                  }
                />

                {valoriForm
                  .domicilioDiversoDallaResidenza && (
                  <div className="dettaglio-cliente-form-grid dettaglio-cliente-form-grid--address dettaglio-cliente-form-grid--domicilio">
                    <Form.Group className="dettaglio-cliente-form-grid__address">
                      <Form.Label>
                        Indirizzo di domicilio
                      </Form.Label>

                      <Form.Control
                        required
                        maxLength={150}
                        value={
                          valoriForm
                            .domicilioIndirizzo ??
                          ""
                        }
                        disabled={inSalvataggio}
                        onChange={(event) =>
                          aggiornaCampo(
                            "domicilioIndirizzo",
                            event.target.value,
                          )
                        }
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>
                        Comune
                      </Form.Label>

                      <Form.Control
                        required
                        maxLength={100}
                        value={
                          valoriForm
                            .domicilioComune ??
                          ""
                        }
                        disabled={inSalvataggio}
                        onChange={(event) =>
                          aggiornaCampo(
                            "domicilioComune",
                            event.target.value,
                          )
                        }
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>
                        Provincia
                      </Form.Label>

                      <Form.Control
                        required
                        maxLength={2}
                        pattern="[A-Za-z]{2}"
                        className="text-uppercase"
                        value={
                          valoriForm
                            .domicilioProvincia ??
                          ""
                        }
                        disabled={inSalvataggio}
                        onChange={(event) =>
                          aggiornaCampo(
                            "domicilioProvincia",
                            event.target.value
                              .toUpperCase(),
                          )
                        }
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>
                        CAP
                      </Form.Label>

                      <Form.Control
                        required
                        inputMode="numeric"
                        maxLength={5}
                        pattern="[0-9]{5}"
                        value={
                          valoriForm
                            .domicilioCap ??
                          ""
                        }
                        disabled={inSalvataggio}
                        onChange={(event) =>
                          aggiornaCampo(
                            "domicilioCap",
                            event.target.value,
                          )
                        }
                      />
                    </Form.Group>
                  </div>
                )}
              </section>
            </Modal.Body>

            <Modal.Footer className="dettaglio-cliente-modal__footer">
              <Button
                type="button"
                variant="outline-secondary"
                className="dettaglio-cliente-modal__secondary"
                disabled={inSalvataggio}
                onClick={suChiusura}
              >
                Annulla
              </Button>

              <Button
                type="submit"
                className="dettaglio-cliente-save dettaglio-cliente-modal__primary"
                disabled={inSalvataggio}
              >
                {inSalvataggio ? (
                  <Spinner
                    animation="border"
                    size="sm"
                  />
                ) : (
                  <FiSave />
                )}

                <span>
                  {inSalvataggio
                    ? "Salvataggio..."
                    : "Salva modifiche"}
                </span>
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal>
  );
};

export default ModificaClienteModal;
