import {
  useEffect,
  useState,
} from "react";

import {
  Alert,
  Button,
  Form,
  Modal,
  Spinner,
} from "react-bootstrap";

import {
  FiCalendar,
  FiCheck,
  FiFileText,
  FiMapPin,
  FiUser,
} from "react-icons/fi";

import {
  useAppSelector,
} from "../../../app/hooks";

import {
  clientiService,
} from "../../clienti/api/clientiService";

import type {
  Cliente,
} from "../../clienti/types/clientiTypes";

import {
  praticheService,
} from "../../pratiche/api/praticheService";

import type {
  Pratica,
} from "../../pratiche/types/praticheTypes";

import {
  appuntamentiService,
} from "../api/appuntamentiService";

import type {
  ModalitaAppuntamento,
  TipologiaAppuntamento,
} from "../types/appuntamentiTypes";

import "./NuovoAppuntamentoModal.css";

type NuovoAppuntamentoModalProps = {
  show: boolean;
  onHide: () => void;
  onCreato: () => void;
};

const dataLocaleOggi = (): string => {
  const oggi = new Date();

  const anno = oggi.getFullYear();

  const mese = String(
    oggi.getMonth() + 1,
  ).padStart(2, "0");

  const giorno = String(
    oggi.getDate(),
  ).padStart(2, "0");

  return `${anno}-${mese}-${giorno}`;
};

const NuovoAppuntamentoModal = ({
  show,
  onHide,
  onCreato,
}: NuovoAppuntamentoModalProps) => {
  const utente = useAppSelector(
    (state) => state.auth.utente,
  );

  const [
    clienti,
    setClienti,
  ] = useState<Cliente[]>([]);

  const [
    pratiche,
    setPratiche,
  ] = useState<Pratica[]>([]);

  const [
    clienteId,
    setClienteId,
  ] = useState("");

  const [
    praticaId,
    setPraticaId,
  ] = useState("");

  const [
    titolo,
    setTitolo,
  ] = useState("");

  const [
    descrizione,
    setDescrizione,
  ] = useState("");

  const [
    tipologia,
    setTipologia,
  ] = useState<TipologiaAppuntamento>(
    "APPUNTAMENTO_CAF",
  );

  const [
    modalita,
    setModalita,
  ] = useState<ModalitaAppuntamento>(
    "IN_SEDE",
  );

  const [
    data,
    setData,
  ] = useState(
    dataLocaleOggi(),
  );

  const [
    oraInizio,
    setOraInizio,
  ] = useState("09:00");

  const [
    oraFine,
    setOraFine,
  ] = useState("09:30");

  const [
    luogo,
    setLuogo,
  ] = useState("");

  const [
    linkOnline,
    setLinkOnline,
  ] = useState("");

  const [
    note,
    setNote,
  ] = useState("");

  const [
    caricamentoDati,
    setCaricamentoDati,
  ] = useState(false);

  const [
    salvataggio,
    setSalvataggio,
  ] = useState(false);

  const [
    errore,
    setErrore,
  ] = useState<string | null>(null);

  useEffect(() => {
    if (!show) {
      return;
    }

    const caricaClienti =
      async () => {
        try {
          setCaricamentoDati(true);
          setErrore(null);

          const risposta =
            await clientiService
              .trovaTutti({
                page: 0,
                size: 100,
                sort:
                  "cognome,asc",
              });

          setClienti(
            risposta.content,
          );
        } catch {
          setClienti([]);

          setErrore(
            "Non è stato possibile caricare i clienti.",
          );
        } finally {
          setCaricamentoDati(false);
        }
      };

    setClienteId("");
    setPraticaId("");
    setPratiche([]);
    setTitolo("");
    setDescrizione("");
    setTipologia(
      "APPUNTAMENTO_CAF",
    );
    setModalita("IN_SEDE");
    setData(dataLocaleOggi());
    setOraInizio("09:00");
    setOraFine("09:30");
    setLuogo("");
    setLinkOnline("");
    setNote("");
    setErrore(null);

    void caricaClienti();
  }, [show]);

  const selezionaCliente =
    async (
      valore: string,
    ) => {
      setClienteId(valore);
      setPraticaId("");
      setPratiche([]);

      if (!valore) {
        return;
      }

      try {
        setCaricamentoDati(true);
        setErrore(null);

        const risposta =
          await praticheService
            .trovaPerCliente(
              Number(valore),
              {
                page: 0,
                size: 100,
                sort:
                  "creatoIl,desc",
              },
            );

        setPratiche(
          risposta.content,
        );
      } catch {
        setPratiche([]);

        setErrore(
          "Non è stato possibile caricare le pratiche del cliente.",
        );
      } finally {
        setCaricamentoDati(false);
      }
    };

  const salva = async () => {
    if (!clienteId) {
      setErrore(
        "Seleziona il cliente.",
      );

      return;
    }

    if (!titolo.trim()) {
      setErrore(
        "Inserisci il titolo dell’appuntamento.",
      );

      return;
    }

    const inizio =
      `${data}T${oraInizio}:00`;

    const fine =
      `${data}T${oraFine}:00`;

    if (
      new Date(fine) <=
      new Date(inizio)
    ) {
      setErrore(
        "L’orario di fine deve essere successivo all’orario di inizio.",
      );

      return;
    }

    try {
      setSalvataggio(true);
      setErrore(null);

      await appuntamentiService
        .crea({
          clienteId:
            Number(clienteId),

          praticaId:
            praticaId
              ? Number(praticaId)
              : null,

          responsabileId:
            utente?.id ?? null,

          titolo:
            titolo.trim(),

          descrizione:
            descrizione.trim() ||
            null,

          tipologia,
          modalita,

          inizio,
          fine,

          luogo:
            modalita === "IN_SEDE"
              ? luogo.trim() ||
                null
              : null,

          linkOnline:
            modalita === "ONLINE"
              ? linkOnline.trim() ||
                null
              : null,

          note:
            note.trim() ||
            null,
        });

      onCreato();
      onHide();
    } catch {
      setErrore(
        "Non è stato possibile registrare l’appuntamento.",
      );
    } finally {
      setSalvataggio(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={
        salvataggio
          ? undefined
          : onHide
      }
      centered
      size="lg"
      className="appointment-modal"
    >
      <Modal.Header closeButton>
        <div>
          <span className="appointment-modal__eyebrow">
            Agenda CAF
          </span>

          <Modal.Title>
            Nuovo appuntamento
          </Modal.Title>
        </div>
      </Modal.Header>

      <Modal.Body>
        {errore && (
          <Alert
            variant="danger"
            className="appointment-modal__alert"
          >
            {errore}
          </Alert>
        )}

        <section className="appointment-modal__section">
          <header className="appointment-modal__section-header">
            <span>
              <FiUser />
            </span>

            <div>
              <strong>
                Cliente e pratica
              </strong>

              <small>
                Collega l’appuntamento
                all’anagrafica corretta.
              </small>
            </div>
          </header>

          <div className="appointment-modal__grid">
            <Form.Group>
              <Form.Label>
                Cliente
              </Form.Label>

              <Form.Select
                value={clienteId}
                disabled={
                  caricamentoDati
                }
                onChange={(event) =>
                  void selezionaCliente(
                    event.target.value,
                  )
                }
              >
                <option value="">
                  Seleziona cliente
                </option>

                {clienti.map(
                  (cliente) => (
                    <option
                      key={cliente.id}
                      value={cliente.id}
                    >
                      {cliente.cognome}{" "}
                      {cliente.nome} ·{" "}
                      {
                        cliente.codiceFiscale
                      }
                    </option>
                  ),
                )}
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>
                Pratica collegata
                <small>
                  Facoltativa
                </small>
              </Form.Label>

              <Form.Select
                value={praticaId}
                disabled={
                  !clienteId ||
                  caricamentoDati
                }
                onChange={(event) =>
                  setPraticaId(
                    event.target.value,
                  )
                }
              >
                <option value="">
                  Nessuna pratica
                </option>

                {pratiche.map(
                  (pratica) => (
                    <option
                      key={pratica.id}
                      value={pratica.id}
                    >
                      {
                        pratica
                          .numeroPratica
                      }{" "}
                      · {pratica.oggetto}
                    </option>
                  ),
                )}
              </Form.Select>
            </Form.Group>
          </div>
        </section>

        <section className="appointment-modal__section">
          <header className="appointment-modal__section-header">
            <span>
              <FiFileText />
            </span>

            <div>
              <strong>
                Dettagli
              </strong>

              <small>
                Indica motivo e tipologia.
              </small>
            </div>
          </header>

          <Form.Group className="mb-3">
            <Form.Label>
              Titolo
            </Form.Label>

            <Form.Control
              value={titolo}
              maxLength={120}
              onChange={(event) =>
                setTitolo(
                  event.target.value,
                )
              }
              placeholder="Es. Consegna documenti 730"
            />
          </Form.Group>

          <div className="appointment-modal__grid">
            <Form.Group>
              <Form.Label>
                Tipologia
              </Form.Label>

              <Form.Select
                value={tipologia}
                onChange={(event) =>
                  setTipologia(
                    event.target
                      .value as TipologiaAppuntamento,
                  )
                }
              >
                <option value="APPUNTAMENTO_CAF">
                  Appuntamento CAF
                </option>

                <option value="CONSEGNA_DOCUMENTI">
                  Consegna documenti
                </option>

                <option value="CONSULENZA">
                  Consulenza
                </option>

                <option value="TELEFONATA">
                  Telefonata
                </option>

                <option value="ALTRO">
                  Altro
                </option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>
                Modalità
              </Form.Label>

              <Form.Select
                value={modalita}
                onChange={(event) =>
                  setModalita(
                    event.target
                      .value as ModalitaAppuntamento,
                  )
                }
              >
                <option value="IN_SEDE">
                  In sede
                </option>

                <option value="TELEFONICO">
                  Telefonico
                </option>

                <option value="ONLINE">
                  Online
                </option>
              </Form.Select>
            </Form.Group>
          </div>

          <Form.Group className="mt-3">
            <Form.Label>
              Descrizione
              <small>
                Facoltativa
              </small>
            </Form.Label>

            <Form.Control
              as="textarea"
              rows={2}
              value={descrizione}
              maxLength={1000}
              onChange={(event) =>
                setDescrizione(
                  event.target.value,
                )
              }
              placeholder="Aggiungi una breve descrizione..."
            />
          </Form.Group>
        </section>

        <section className="appointment-modal__section">
          <header className="appointment-modal__section-header">
            <span>
              <FiCalendar />
            </span>

            <div>
              <strong>
                Data e orario
              </strong>

              <small>
                Definisci la durata.
              </small>
            </div>
          </header>

          <div className="appointment-modal__date-grid">
            <Form.Group>
              <Form.Label>
                Data
              </Form.Label>

              <Form.Control
                type="date"
                value={data}
                onChange={(event) =>
                  setData(
                    event.target.value,
                  )
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>
                Inizio
              </Form.Label>

              <Form.Control
                type="time"
                value={oraInizio}
                onChange={(event) =>
                  setOraInizio(
                    event.target.value,
                  )
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>
                Fine
              </Form.Label>

              <Form.Control
                type="time"
                value={oraFine}
                onChange={(event) =>
                  setOraFine(
                    event.target.value,
                  )
                }
              />
            </Form.Group>
          </div>

          {modalita === "IN_SEDE" && (
            <Form.Group className="mt-3">
              <Form.Label>
                <FiMapPin />
                Luogo
              </Form.Label>

              <Form.Control
                value={luogo}
                maxLength={200}
                onChange={(event) =>
                  setLuogo(
                    event.target.value,
                  )
                }
                placeholder="Es. Sede CAF Pianopoli"
              />
            </Form.Group>
          )}

          {modalita === "ONLINE" && (
            <Form.Group className="mt-3">
              <Form.Label>
                Link collegamento
              </Form.Label>

              <Form.Control
                type="url"
                value={linkOnline}
                maxLength={500}
                onChange={(event) =>
                  setLinkOnline(
                    event.target.value,
                  )
                }
                placeholder="https://..."
              />
            </Form.Group>
          )}

          <Form.Group className="mt-3">
            <Form.Label>
              Note interne
              <small>
                Facoltative
              </small>
            </Form.Label>

            <Form.Control
              as="textarea"
              rows={2}
              value={note}
              maxLength={1000}
              onChange={(event) =>
                setNote(
                  event.target.value,
                )
              }
              placeholder="Informazioni utili per l’operatore..."
            />
          </Form.Group>
        </section>
      </Modal.Body>

      <Modal.Footer>
        <Button
          type="button"
          variant="outline-secondary"
          className="appointment-modal__cancel"
          disabled={salvataggio}
          onClick={onHide}
        >
          Annulla
        </Button>

        <Button
          type="button"
          className="appointment-modal__save"
          disabled={
            salvataggio ||
            caricamentoDati
          }
          onClick={() =>
            void salva()
          }
        >
          {salvataggio ? (
            <>
              <Spinner
                animation="border"
                size="sm"
              />
              Salvataggio...
            </>
          ) : (
            <>
              <FiCheck />
              Registra appuntamento
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NuovoAppuntamentoModal;