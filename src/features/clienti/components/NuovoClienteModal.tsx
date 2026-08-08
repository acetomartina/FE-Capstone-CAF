import { useState, type FormEvent } from "react";
import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";

import { clientiService } from "../api/clientiService";
import type { CreaClienteRequest } from "../types/clientiTypes";

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
  password: "",
};

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

  const aggiornaCampo = (
    campo: keyof CreaClienteRequest,
    valore: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [campo]: valore === "" ? null : valore,
    }));
  };

  const chiudiModal = () => {
    setForm(statoIniziale);
    setErrore(null);
    onHide();
  };

  const inviaForm = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSalvataggio(true);
      setErrore(null);

      await clientiService.creaCliente(form);

      setForm(statoIniziale);

      onClienteCreato();
      onHide();
    } catch {
      setErrore(
        "Impossibile creare il cliente. Controlla i dati inseriti."
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
    >
      <Form onSubmit={inviaForm}>
        <Modal.Header closeButton>
          <Modal.Title>
            Nuovo cliente
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {errore && (
            <Alert variant="danger">
              {errore}
            </Alert>
          )}

          <div className="row g-3">
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  required
                  value={form.nome}
                  onChange={(e) =>
                    aggiornaCampo(
                      "nome",
                      e.target.value
                    )
                  }
                />
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Cognome</Form.Label>
                <Form.Control
                  required
                  value={form.cognome}
                  onChange={(e) =>
                    aggiornaCampo(
                      "cognome",
                      e.target.value
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
                  required
                  maxLength={16}
                  value={form.codiceFiscale}
                  onChange={(e) =>
                    aggiornaCampo(
                      "codiceFiscale",
                      e.target.value.toUpperCase()
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
                  onChange={(e) =>
                    aggiornaCampo(
                      "dataNascita",
                      e.target.value
                    )
                  }
                />
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group>
                <Form.Label>
                  Luogo di nascita
                </Form.Label>
                <Form.Control
                  value={
                    form.luogoNascita ?? ""
                  }
                  onChange={(e) =>
                    aggiornaCampo(
                      "luogoNascita",
                      e.target.value
                    )
                  }
                />
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    aggiornaCampo(
                      "email",
                      e.target.value
                    )
                  }
                />
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Telefono</Form.Label>
                <Form.Control
                  value={form.telefono ?? ""}
                  onChange={(e) =>
                    aggiornaCampo(
                      "telefono",
                      e.target.value
                    )
                  }
                />
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group>
                <Form.Label>
                  Indirizzo
                </Form.Label>
                <Form.Control
                  value={
                    form.indirizzo ?? ""
                  }
                  onChange={(e) =>
                    aggiornaCampo(
                      "indirizzo",
                      e.target.value
                    )
                  }
                />
              </Form.Group>
            </div>

            <div className="col-md-5">
              <Form.Group>
                <Form.Label>Comune</Form.Label>
                <Form.Control
                  value={form.comune ?? ""}
                  onChange={(e) =>
                    aggiornaCampo(
                      "comune",
                      e.target.value
                    )
                  }
                />
              </Form.Group>
            </div>

            <div className="col-md-3">
              <Form.Group>
                <Form.Label>
                  Provincia
                </Form.Label>
                <Form.Control
                  maxLength={2}
                  value={
                    form.provincia ?? ""
                  }
                  onChange={(e) =>
                    aggiornaCampo(
                      "provincia",
                      e.target.value.toUpperCase()
                    )
                  }
                />
              </Form.Group>
            </div>

            <div className="col-md-4">
              <Form.Group>
                <Form.Label>CAP</Form.Label>
                <Form.Control
                  maxLength={5}
                  value={form.cap ?? ""}
                  onChange={(e) =>
                    aggiornaCampo(
                      "cap",
                      e.target.value
                    )
                  }
                />
              </Form.Group>
            </div>

            <div className="col-12">
              <Form.Group>
                <Form.Label>
                  Password iniziale
                </Form.Label>
                <Form.Control
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    aggiornaCampo(
                      "password",
                      e.target.value
                    )
                  }
                />

                <Form.Text muted>
                  Almeno 8 caratteri, con
                  maiuscola, minuscola, numero
                  e carattere speciale.
                </Form.Text>
              </Form.Group>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={chiudiModal}
            disabled={salvataggio}
          >
            Annulla
          </Button>

          <Button
            type="submit"
            variant="success"
            disabled={salvataggio}
          >
            {salvataggio ? (
              <>
                <Spinner
                  size="sm"
                  className="me-2"
                />
                Salvataggio...
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