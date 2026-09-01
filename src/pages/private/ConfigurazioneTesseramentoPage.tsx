import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  Alert,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";

import {
  FiArrowLeft,
  FiCheckCircle,
  FiCreditCard,
  FiInfo,
  FiSave,
} from "react-icons/fi";

import {
  useNavigate,
} from "react-router-dom";

import PrivatePageHeader from "../../components/private/PrivatePageHeader";

import {
  configurazioneTesseramentoService,
} from "../../features/tesseramenti/api/configurazioneTesseramentoService";

import type {
  ConfigurazioneTesseramento,
} from "../../features/tesseramenti/types/configurazioneTesseramentoTypes";

import "./ConfigurazioneTesseramentoPage.css";

const formattaEuro = (
  valore: number,
) =>
  new Intl.NumberFormat(
    "it-IT",
    {
      style: "currency",
      currency: "EUR",
    },
  ).format(valore);

const formattaData = (
  valore: string | null,
) => {
  if (!valore) {
    return null;
  }

  return new Intl.DateTimeFormat(
    "it-IT",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(new Date(valore));
};

const ConfigurazioneTesseramentoPage = () => {
  const navigate = useNavigate();

  const [
    configurazione,
    setConfigurazione,
  ] = useState<ConfigurazioneTesseramento | null>(
    null,
  );

  const [
    quotaAnnuale,
    setQuotaAnnuale,
  ] = useState("");

  const [
    caricamento,
    setCaricamento,
  ] = useState(true);

  const [
    salvataggio,
    setSalvataggio,
  ] = useState(false);

  const [
    errore,
    setErrore,
  ] = useState<string | null>(null);

  const [
    messaggioSuccesso,
    setMessaggioSuccesso,
  ] = useState<string | null>(null);

  useEffect(() => {
    const caricaConfigurazione = async () => {
      try {
        setCaricamento(true);
        setErrore(null);

        const dati =
          await configurazioneTesseramentoService
            .trova();

        setConfigurazione(dati);

        setQuotaAnnuale(
          dati.quotaAnnuale === null
            ? ""
            : dati.quotaAnnuale.toFixed(2),
        );
      } catch {
        setErrore(
          "Impossibile caricare la configurazione del tesseramento.",
        );
      } finally {
        setCaricamento(false);
      }
    };

    void caricaConfigurazione();
  }, []);

  const salvaConfigurazione = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const quotaNormalizzata =
      Number(
        quotaAnnuale.replace(",", "."),
      );

    if (
      !Number.isFinite(
        quotaNormalizzata,
      ) ||
      quotaNormalizzata < 0
    ) {
      setErrore(
        "Inserisci una quota annuale valida.",
      );

      return;
    }

    try {
      setSalvataggio(true);
      setErrore(null);
      setMessaggioSuccesso(null);

      const aggiornata =
        await configurazioneTesseramentoService
          .aggiorna({
            quotaAnnuale:
              quotaNormalizzata,
          });

      setConfigurazione(aggiornata);

      setQuotaAnnuale(
        aggiornata.quotaAnnuale?.toFixed(2) ??
          "",
      );

      setMessaggioSuccesso(
        "Quota annuale aggiornata correttamente.",
      );
    } catch {
      setErrore(
        "Impossibile salvare la quota annuale. Riprova.",
      );
    } finally {
      setSalvataggio(false);
    }
  };

  return (
    <section className="config-tesseramento-page">
      <PrivatePageHeader
        eyebrow="Amministrazione"
        title="Tesseramento annuale"
        description="Imposta la quota applicata automaticamente a ogni nuovo tesseramento."
        action={
          <Button
            type="button"
            variant="outline-secondary"
            className="config-tesseramento-page__back"
            onClick={() =>
              navigate("/amministrazione")
            }
          >
            <FiArrowLeft />

            <span>
              Amministrazione
            </span>
          </Button>
        }
      />

      {caricamento ? (
        <div className="config-tesseramento-loading">
          <Spinner
            animation="border"
            size="sm"
          />

          <p>
            Caricamento configurazione...
          </p>
        </div>
      ) : (
        <div className="config-tesseramento-layout">
          <Form
            className="config-tesseramento-card"
            onSubmit={
              salvaConfigurazione
            }
          >
            <header className="config-tesseramento-card__header">
              <span className="config-tesseramento-card__icon">
                <FiCreditCard />
              </span>

              <div>
                <h2>
                  Quota annuale
                </h2>

                <p>
                  Il valore viene applicato
                  automaticamente alle nuove
                  tessere.
                </p>
              </div>
            </header>

            {errore && (
              <Alert
                variant="danger"
                className="config-tesseramento-card__alert"
              >
                {errore}
              </Alert>
            )}

            {messaggioSuccesso && (
              <Alert
                variant="success"
                className="config-tesseramento-card__alert"
              >
                <FiCheckCircle />

                <span>
                  {messaggioSuccesso}
                </span>
              </Alert>
            )}

            <Form.Group>
              <Form.Label>
                Importo della tessera
              </Form.Label>

              <div className="config-tesseramento-input">
                <span>
                  €
                </span>

                <Form.Control
                  required
                  type="text"
                  inputMode="decimal"
                  value={quotaAnnuale}
                  disabled={salvataggio}
                  placeholder="0,00"
                  onChange={(event) => {
                    setQuotaAnnuale(
                      event.target.value.replace(
                        /[^0-9,.]/g,
                        "",
                      ),
                    );

                    setMessaggioSuccesso(null);
                  }}
                />
              </div>

              <Form.Text>
                Puoi modificare la quota in
                qualsiasi momento: le tessere
                già registrate manterranno il
                loro importo storico.
              </Form.Text>
            </Form.Group>

            <Button
              type="submit"
              className="config-tesseramento-card__save"
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
                <>
                  <FiSave />

                  <span>
                    Salva quota annuale
                  </span>
                </>
              )}
            </Button>

            {configurazione?.aggiornatoIl && (
              <p className="config-tesseramento-card__updated">
                Ultimo aggiornamento:{" "}
                {formattaData(
                  configurazione.aggiornatoIl,
                )}
              </p>
            )}
          </Form>

          <aside className="config-tesseramento-summary">
            <span className="config-tesseramento-summary__eyebrow">
              Configurazione attuale
            </span>

            {configurazione &&
            configurazione?.quotaAnnuale !==
            null ? (
              <>
                <strong>
                  {formattaEuro(
                    configurazione.quotaAnnuale,
                  )}
                </strong>

                <p>
                  applicati a ogni nuovo
                  tesseramento.
                </p>
              </>
            ) : (
              <>
                <strong>
                  Non configurata
                </strong>

                <p>
                  Imposta la quota prima di
                  registrare una nuova tessera.
                </p>
              </>
            )}

            <div className="config-tesseramento-summary__info">
              <FiInfo />

              <span>
                Ogni tessera è valida per 12
                mesi dalla data di
                tesseramento.
              </span>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
};

export default ConfigurazioneTesseramentoPage;