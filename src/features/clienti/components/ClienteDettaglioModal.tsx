import { useEffect, useState, type FormEvent } from "react";
import {
  Alert,
  Button,
  Form,
  Modal,
  Spinner,
} from "react-bootstrap";

import { clientiService } from "../api/clientiService";
import type {
  AggiornaClienteRequest,
  Cliente,
} from "../types/clientiTypes";

interface ClienteDettaglioModalProps {
  clienteId: number | null;
  show: boolean;
  onHide: () => void;
  onClienteAggiornato: () => void;
}

const ClienteDettaglioModal = ({
  clienteId,
  show,
  onHide,
  onClienteAggiornato,
}: ClienteDettaglioModalProps) => {
  const [cliente, setCliente] =
    useState<Cliente | null>(null);

  const [form, setForm] =
    useState<AggiornaClienteRequest | null>(null);

  const [modificaAttiva, setModificaAttiva] =
    useState(false);

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

        const dati =
          await clientiService.trovaPerId(clienteId);

        setCliente(dati);

        setForm({
          nome: dati.nome,
          cognome: dati.cognome,
          dataNascita: dati.dataNascita,
          luogoNascita: dati.luogoNascita,
          email: dati.email,
          telefono: dati.telefono,
          indirizzo: dati.indirizzo,
          comune: dati.comune,
          provincia: dati.provincia,
          cap: dati.cap,
        });
      } catch {
        setErrore(
          "Impossibile caricare i dati del cliente."
        );
      } finally {
        setCaricamento(false);
      }
    };

    void caricaCliente();
  }, [show, clienteId]);

  const aggiornaCampo = (
    campo: keyof AggiornaClienteRequest,
    valore: string
  ) => {
    setForm((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        [campo]:
          valore === "" ? null : valore,
      };
    });
  };

  const salvaModifiche = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      clienteId === null ||
      form === null
    ) {
      return;
    }

    try {
      setSalvataggio(true);
      setErrore(null);

      const aggiornato =
        await clientiService.aggiornaCliente(
          clienteId,
          form
        );

      setCliente(aggiornato);
      setModificaAttiva(false);

      onClienteAggiornato();
    } catch {
      setErrore(
        "Impossibile aggiornare il cliente. Controlla i dati inseriti."
      );
    } finally {
      setSalvataggio(false);
    }
  };

  const chiudi = () => {
    setCliente(null);
    setForm(null);
    setErrore(null);
    setModificaAttiva(false);

    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={chiudi}
      size="lg"
      centered
    >
      <Form onSubmit={salvaModifiche}>
        <Modal.Header closeButton>
          <Modal.Title>
            Scheda cliente
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {errore && (
            <Alert variant="danger">
              {errore}
            </Alert>
          )}

          {caricamento ? (
            <div className="py-5 text-center">
              <Spinner animation="border" />

              <p className="text-secondary mt-3 mb-0">
                Caricamento cliente...
              </p>
            </div>
          ) : cliente && form ? (
            <>
              <div className="mb-4">
                <h5 className="mb-1">
                  {cliente.nome}{" "}
                  {cliente.cognome}
                </h5>

                <span className="text-secondary">
                  {cliente.codiceFiscale}
                </span>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>
                      Nome
                    </Form.Label>

                    <Form.Control
                      required
                      disabled={!modificaAttiva}
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
                    <Form.Label>
                      Cognome
                    </Form.Label>

                    <Form.Control
                      required
                      disabled={!modificaAttiva}
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
                      Data di nascita
                    </Form.Label>

                    <Form.Control
                      type="date"
                      disabled={!modificaAttiva}
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
                      disabled={!modificaAttiva}
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
                    <Form.Label>
                      Email
                    </Form.Label>

                    <Form.Control
                      type="email"
                      required
                      disabled={!modificaAttiva}
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
                    <Form.Label>
                      Telefono
                    </Form.Label>

                    <Form.Control
                      disabled={!modificaAttiva}
                      value={
                        form.telefono ?? ""
                      }
                      onChange={(e) =>
                        aggiornaCampo(
                          "telefono",
                          e.target.value
                        )
                      }
                    />
                  </Form.Group>
                </div>

                <div className="col-md-12">
                  <Form.Group>
                    <Form.Label>
                      Indirizzo
                    </Form.Label>

                    <Form.Control
                      disabled={!modificaAttiva}
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
                    <Form.Label>
                      Comune
                    </Form.Label>

                    <Form.Control
                      disabled={!modificaAttiva}
                      value={
                        form.comune ?? ""
                      }
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
                      disabled={!modificaAttiva}
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
                    <Form.Label>
                      CAP
                    </Form.Label>

                    <Form.Control
                      maxLength={5}
                      disabled={!modificaAttiva}
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
              </div>
            </>
          ) : null}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={chiudi}
          >
            Chiudi
          </Button>

          {cliente && !modificaAttiva && (
            <Button
              variant="primary"
              type="button"
              onClick={() =>
                setModificaAttiva(true)
              }
            >
              Modifica
            </Button>
          )}

          {cliente && modificaAttiva && (
            <>
              <Button
                variant="outline-secondary"
                type="button"
                onClick={() => {
                  setForm({
                    nome: cliente.nome,
                    cognome: cliente.cognome,
                    dataNascita:
                      cliente.dataNascita,
                    luogoNascita:
                      cliente.luogoNascita,
                    email: cliente.email,
                    telefono:
                      cliente.telefono,
                    indirizzo:
                      cliente.indirizzo,
                    comune: cliente.comune,
                    provincia:
                      cliente.provincia,
                    cap: cliente.cap,
                  });

                  setModificaAttiva(false);
                }}
              >
                Annulla modifica
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