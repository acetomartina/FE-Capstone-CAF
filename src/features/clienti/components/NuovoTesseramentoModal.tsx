import type { FormEvent } from "react";
import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";
import { FiCheckCircle, FiCreditCard } from "react-icons/fi";

const dataOdierna = () =>
  new Date().toISOString().slice(0, 10);

interface NuovoTesseramentoModalProps {
  mostraModal: boolean;
  suChiusura: () => void;

  dataScelta: string;
  suCambioData: (data: string) => void;

  noteScelte: string;
  suCambioNote: (note: string) => void;

  suRegistrazione: (evento: FormEvent<HTMLFormElement>) => void;

  inSalvataggio: boolean;
  messaggioErrore: string | null;
}

/**
 * Registrazione di un nuovo tesseramento annuale.
 *
 * La quota non si chiede qui: la decide la configurazione di sede, e
 * lasciarla digitare a mano aprirebbe la porta a tessere con importi
 * diversi fra loro senza che nessuno se ne accorga.
 */
const NuovoTesseramentoModal = ({
  mostraModal,
  suChiusura,
  dataScelta,
  suCambioData,
  noteScelte,
  suCambioNote,
  suRegistrazione,
  inSalvataggio,
  messaggioErrore,
}: NuovoTesseramentoModalProps) => {
  return (
      <Modal
        show={mostraModal}
        onHide={suChiusura}
        centered
        backdrop={
          inSalvataggio
            ? "static"
            : true
        }
        keyboard={!inSalvataggio}
        dialogClassName="dettaglio-cliente-tesseramento-modal"
      >
        <Form onSubmit={suRegistrazione}>
          <Modal.Header closeButton>
            <div>
              <span className="dettaglio-cliente-modal__eyebrow">
                Tessera annuale
              </span>

              <Modal.Title>
                Registra tesseramento
              </Modal.Title>
            </div>
          </Modal.Header>

          <Modal.Body>
            {messaggioErrore && (
              <Alert variant="danger">
                {messaggioErrore}
              </Alert>
            )}

            <div className="dettaglio-cliente-modal__intro">
              <FiCreditCard />

              <p>
                La quota annuale impostata in
                Amministrazione sarà acquisita
                automaticamente e conservata
                nello storico.
              </p>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>
                Data di tesseramento
              </Form.Label>

              <Form.Control
                required
                type="date"
                value={dataScelta}
                max={dataOdierna()}
                disabled={
                  inSalvataggio
                }
                onChange={(event) =>
                  suCambioData(
                    event.target.value,
                  )
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>
                Note interne
                <small>
                  Facoltative
                </small>
              </Form.Label>

              <Form.Control
                as="textarea"
                rows={3}
                maxLength={500}
                value={noteScelte}
                disabled={
                  inSalvataggio
                }
                onChange={(event) =>
                  suCambioNote(
                    event.target.value,
                  )
                }
                placeholder="Es. pagamento ricevuto in contanti."
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer className="dettaglio-cliente-modal__footer">
            <Button
              type="button"
              variant="outline-secondary"
              className="dettaglio-cliente-modal__secondary"
              onClick={suChiusura}
              disabled={
                inSalvataggio
              }
            >
              Annulla
            </Button>

            <Button
              type="submit"
              className="dettaglio-cliente-tessera__create dettaglio-cliente-modal__primary"
              disabled={
                inSalvataggio
              }
            >
              {inSalvataggio ? (
                <>
                  <Spinner
                    animation="border"
                    size="sm"
                  />

                  <span>
                    Registrazione...
                  </span>
                </>
              ) : (
                <>
                  <FiCheckCircle />

                  <span>
                    Registra tessera
                  </span>
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
  );
};

export default NuovoTesseramentoModal;
