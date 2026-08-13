import { useState, type FormEvent } from "react";
import {
  Alert,
  Button,
  Form,
  Modal,
  Spinner,
} from "react-bootstrap";
import {
  FiLock,
  FiMail,
  FiMapPin,
  FiUser,
} from "react-icons/fi";

import { clientiService } from "../api/clientiService";
import type { CreaClienteRequest } from "../types/clientiTypes";

import "./NuovoClienteModal.css";

interface NuovoClienteModalProps {
  show: boolean;
  onHide: () => void;
  onClienteCreato: () => void;
}

const statoIniziale: CreaClienteRequest = {
  nome: "",
  cognome: "",
  codiceFiscale: "",
  dataNascita: null,
  luogoNascita: null,
  email: "",
  telefono: null,
  indirizzo: null,
  comune: null,
  provincia: null,
  cap: null,
};

type CampoObbligatorio =
  | "nome"
  | "cognome"
  | "codiceFiscale"
  | "email";

type CampoOpzionale =
  | "dataNascita"
  | "luogoNascita"
  | "telefono"
  | "indirizzo"
  | "comune"
  | "provincia"
  | "cap";

const NuovoClienteModal = ({
  show,
  onHide,
  onClienteCreato,
}: NuovoClienteModalProps) => {
  const [form, setForm] =
    useState<CreaClienteRequest>(statoIniziale);

  const [salvataggio, setSalvataggio] =
    useState(false);

  const [errore, setErrore] =
    useState<string | null>(null);

  const aggiornaCampoObbligatorio = (
    campo: CampoObbligatorio,
    valore: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [campo]: valore,
    }));
  };

  const aggiornaCampoOpzionale = (
    campo: CampoOpzionale,
    valore: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [campo]:
        valore.trim() === ""
          ? null
          : valore,
    }));
  };

  const chiudiModal = () => {
    if (salvataggio) {
      return;
    }

    setForm(statoIniziale);
    setErrore(null);

    onHide();
  };

  const inviaForm = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      form.codiceFiscale.trim().length !== 16
    ) {
      setErrore(
        "Il codice fiscale deve contenere 16 caratteri.",
      );
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

      await clientiService.creaCliente({
        ...form,

        nome: form.nome.trim(),
        cognome: form.cognome.trim(),

        codiceFiscale:
          form.codiceFiscale
            .trim()
            .toUpperCase(),

        email: form.email
          .trim()
          .toLowerCase(),

        provincia:
          form.provincia?.toUpperCase() ??
          null,
      });

      setForm(statoIniziale);

      onClienteCreato();
      onHide();
    } catch {
      setErrore(
        "Impossibile creare il cliente. Controlla i dati inseriti e riprova.",
      );
    } finally {
      setSalvataggio(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={chiudiModal}
      size="lg"
      centered
      backdrop={
        salvataggio ? "static" : true
      }
      keyboard={!salvataggio}
      dialogClassName="nuovo-cliente-modal"
    >
      <Form
        onSubmit={inviaForm}
        className="nuovo-cliente-form"
      >
        <Modal.Header
          closeButton={!salvataggio}
          className="nuovo-cliente-modal__header"
        >
          <div>
            <span className="nuovo-cliente-modal__eyebrow">
              Anagrafica cliente
            </span>

            <Modal.Title>
              Nuovo cliente
            </Modal.Title>

            <p>
              Inserisci i dati del cliente.
              Al termine verrà inviato
              automaticamente l&apos;invito per
              attivare l&apos;Area Cliente.
            </p>
          </div>
        </Modal.Header>

        <Modal.Body className="nuovo-cliente-modal__body">
          {errore && (
            <Alert
              variant="danger"
              className="nuovo-cliente-modal__alert"
            >
              {errore}
            </Alert>
          )}

          {/* DATI ANAGRAFICI */}

          <section className="nuovo-cliente-section">
            <header className="nuovo-cliente-section__header">
              <span className="nuovo-cliente-section__icon nuovo-cliente-section__icon--green">
                <FiUser />
              </span>

              <div>
                <h3>Dati anagrafici</h3>

                <p>
                  Informazioni principali del cliente.
                </p>
              </div>
            </header>

            <div className="row g-3">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>
                    Nome
                    <span className="nuovo-cliente-required">
                      *
                    </span>
                  </Form.Label>

                  <Form.Control
                    required
                    maxLength={80}
                    placeholder="Es. Mario"
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
                    <span className="nuovo-cliente-required">
                      *
                    </span>
                  </Form.Label>

                  <Form.Control
                    required
                    maxLength={80}
                    placeholder="Es. Rossi"
                    value={form.cognome}
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
                    <span className="nuovo-cliente-required">
                      *
                    </span>
                  </Form.Label>

                  <Form.Control
                    required
                    minLength={16}
                    maxLength={16}
                    placeholder="RSSMRA80A01F205X"
                    value={form.codiceFiscale}
                    disabled={salvataggio}
                    onChange={(event) =>
                      aggiornaCampoObbligatorio(
                        "codiceFiscale",
                        event.target.value
                          .replace(
                            /[^a-zA-Z0-9]/g,
                            "",
                          )
                          .toUpperCase(),
                      )
                    }
                  />
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
                      form.dataNascita ?? ""
                    }
                    disabled={salvataggio}
                    onChange={(event) =>
                      aggiornaCampoOpzionale(
                        "dataNascita",
                        event.target.value,
                      )
                    }
                  />
                </Form.Group>
              </div>

              <div className="col-md-12">
                <Form.Group>
                  <Form.Label>
                    Luogo di nascita
                  </Form.Label>

                  <Form.Control
                    maxLength={100}
                    placeholder="Es. Lamezia Terme"
                    value={
                      form.luogoNascita ?? ""
                    }
                    disabled={salvataggio}
                    onChange={(event) =>
                      aggiornaCampoOpzionale(
                        "luogoNascita",
                        event.target.value,
                      )
                    }
                  />
                </Form.Group>
              </div>
            </div>
          </section>

          {/* CONTATTI */}

          <section className="nuovo-cliente-section">
            <header className="nuovo-cliente-section__header">
              <span className="nuovo-cliente-section__icon nuovo-cliente-section__icon--blue">
                <FiMail />
              </span>

              <div>
                <h3>Contatti</h3>

                <p>
                  Email e recapiti del cliente.
                </p>
              </div>
            </header>

            <div className="row g-3">
              <div className="col-md-7">
                <Form.Group>
                  <Form.Label>
                    Email
                    <span className="nuovo-cliente-required">
                      *
                    </span>
                  </Form.Label>

                  <Form.Control
                    type="email"
                    required
                    maxLength={150}
                    placeholder="mario.rossi@email.it"
                    value={form.email}
                    disabled={salvataggio}
                    autoComplete="email"
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
                    placeholder="+39 333 1234567"
                    value={
                      form.telefono ?? ""
                    }
                    disabled={salvataggio}
                    autoComplete="tel"
                    onChange={(event) =>
                      aggiornaCampoOpzionale(
                        "telefono",
                        event.target.value,
                      )
                    }
                  />
                </Form.Group>
              </div>
            </div>
          </section>

          {/* RESIDENZA */}

          <section className="nuovo-cliente-section">
            <header className="nuovo-cliente-section__header">
              <span className="nuovo-cliente-section__icon nuovo-cliente-section__icon--orange">
                <FiMapPin />
              </span>

              <div>
                <h3>Residenza</h3>

                <p>
                  Dati dell&apos;indirizzo del cliente.
                </p>
              </div>
            </header>

            <div className="row g-3">
              <div className="col-12">
                <Form.Group>
                  <Form.Label>
                    Indirizzo
                  </Form.Label>

                  <Form.Control
                    maxLength={150}
                    placeholder="Via Roma 10"
                    value={
                      form.indirizzo ?? ""
                    }
                    disabled={salvataggio}
                    autoComplete="street-address"
                    onChange={(event) =>
                      aggiornaCampoOpzionale(
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
                    placeholder="Lamezia Terme"
                    value={
                      form.comune ?? ""
                    }
                    disabled={salvataggio}
                    onChange={(event) =>
                      aggiornaCampoOpzionale(
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
                    placeholder="CZ"
                    value={
                      form.provincia ?? ""
                    }
                    disabled={salvataggio}
                    onChange={(event) =>
                      aggiornaCampoOpzionale(
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
                    placeholder="88046"
                    value={form.cap ?? ""}
                    disabled={salvataggio}
                    onChange={(event) =>
                      aggiornaCampoOpzionale(
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
          </section>

          {/* ACCESSO AREA CLIENTE */}

          <section className="nuovo-cliente-section nuovo-cliente-section--accesso">
            <div className="nuovo-cliente-accesso">
              <span className="nuovo-cliente-section__icon nuovo-cliente-section__icon--purple">
                <FiLock />
              </span>

              <div className="nuovo-cliente-accesso__content">
                <h3>
                  Accesso Area Cliente
                </h3>

                <p>
                  Il cliente configurerà
                  autonomamente le proprie
                  credenziali. Al termine della
                  creazione verrà inviato un link di
                  attivazione a{" "}
                  <strong>
                    {form.email.trim() ||
                      "indirizzo email del cliente"}
                  </strong>
                  , dal quale potrà scegliere la
                  password e attivare la propria
                  Area Cliente.
                </p>
              </div>
            </div>
          </section>

          <p className="nuovo-cliente-modal__required-note">
            <span>*</span> Campi obbligatori
          </p>
        </Modal.Body>

        <Modal.Footer className="nuovo-cliente-modal__footer">
          <Button
            type="button"
            variant="outline-secondary"
            className="nuovo-cliente-modal__cancel"
            onClick={chiudiModal}
            disabled={salvataggio}
          >
            Annulla
          </Button>

          <Button
            type="submit"
            className="nuovo-cliente-modal__submit"
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
              "Crea cliente"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default NuovoClienteModal;