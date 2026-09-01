import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Alert,
  Button,
  Form,
  Modal,
  Spinner,
} from "react-bootstrap";

import {
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiEdit3,
  FiFileText,
  FiMail,
  FiMapPin,
  FiPhone,
  FiPlus,
  FiRefreshCw,
  FiSave,
  FiUser,
} from "react-icons/fi";

import PrivatePageHeader from "../../components/private/PrivatePageHeader";

import {
  clientiService,
} from "../../features/clienti/api/clientiService";

import type {
  AggiornaClienteRequest,
  Cliente,
} from "../../features/clienti/types/clientiTypes";

import {
  praticheService,
} from "../../features/pratiche/api/praticheService";

import type {
  Pratica,
  StatoPratica,
} from "../../features/pratiche/types/praticheTypes";

import {
  appuntamentiService,
} from "../../features/appuntamenti/api/appuntamentiService";

import type {
  Appuntamento,
  ModalitaAppuntamento,
  StatoAppuntamento,
} from "../../features/appuntamenti/types/appuntamentiTypes";

import {
  tesseramentiService,
} from "../../features/tesseramenti/api/tesseramentiService";

import type {
  StatoTesseramento,
  Tesseramento,
} from "../../features/tesseramenti/types/tesseramentiTypes";

import "./DettaglioClientePage.css";

const dataOdierna = () =>
  new Date()
    .toISOString()
    .slice(0, 10);

const formattaData = (
  data: string | null,
) => {
  if (!data) {
    return "Non indicata";
  }

  const [
    anno,
    mese,
    giorno,
  ] = data.split("-");

  if (!anno || !mese || !giorno) {
    return data;
  }

  return `${giorno}/${mese}/${anno}`;
};

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

const valore = (
  dato: string | null | undefined,
) =>
  dato && dato.trim() !== ""
    ? dato
    : "Non indicato";

const normalizzaFacoltativo = (
  dato: string | null,
) => {
  const normalizzato =
    dato?.trim() ?? "";

  return normalizzato || null;
};

const etichettaStatoTessera = (
  stato: StatoTesseramento,
) => {
  const etichette: Record<
    StatoTesseramento,
    string
  > = {
    VALIDA: "Tessera valida",
    IN_SCADENZA: "In scadenza",
    SCADUTA: "Scaduta",
    ANNULLATA: "Annullata",
  };

  return etichette[stato];
};

const classeStatoTessera = (
  stato: StatoTesseramento,
) =>
  `dettaglio-cliente-tessera__status--${stato.toLowerCase()}`;

const etichetteStatoPratica: Record<
  StatoPratica,
  string
> = {
  BOZZA: "Bozza",
  DA_AVVIARE: "Da avviare",
  IN_LAVORAZIONE: "In lavorazione",
  IN_ATTESA_DOCUMENTI:
    "In attesa documenti",
  IN_ATTESA_CLIENTE:
    "In attesa cliente",
  IN_ATTESA_ENTE:
    "In attesa ente",
  COMPLETATA: "Completata",
  ANNULLATA: "Annullata",
};

const etichetteStatoAppuntamento: Record<
  StatoAppuntamento,
  string
> = {
  PROGRAMMATO: "Programmato",
  CONFERMATO: "Confermato",
  COMPLETATO: "Completato",
  ANNULLATO: "Annullato",
};

const etichetteModalitaAppuntamento: Record<
  ModalitaAppuntamento,
  string
> = {
  IN_SEDE: "In sede",
  TELEFONICO: "Telefonico",
  ONLINE: "Online",
};

const formattaDataOra = (
  data: string,
) => {
  const dataAppuntamento = new Date(data);

  if (
    Number.isNaN(
      dataAppuntamento.getTime(),
    )
  ) {
    return data;
  }

  return new Intl.DateTimeFormat(
    "it-IT",
    {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(dataAppuntamento);
};

const DettaglioClientePage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [
    cliente,
    setCliente,
  ] = useState<Cliente | null>(null);

  const [
    tesseraCorrente,
    setTesseraCorrente,
  ] = useState<Tesseramento | null>(
    null,
  );

  const [
    storicoTesseramenti,
    setStoricoTesseramenti,
  ] = useState<Tesseramento[]>([]);

  const [
    pratiche,
    setPratiche,
  ] = useState<Pratica[]>([]);

  const [
    appuntamenti,
    setAppuntamenti,
  ] = useState<Appuntamento[]>([]);

  const [
    caricamento,
    setCaricamento,
  ] = useState(true);

  const [
    errore,
    setErrore,
  ] = useState<string | null>(null);

  const [
    mostraModalTesseramento,
    setMostraModalTesseramento,
  ] = useState(false);

  const [
    dataTesseramento,
    setDataTesseramento,
  ] = useState(dataOdierna());

  const [
    noteTesseramento,
    setNoteTesseramento,
  ] = useState("");

  const [
    salvataggioTesseramento,
    setSalvataggioTesseramento,
  ] = useState(false);

  const [
    erroreTesseramento,
    setErroreTesseramento,
  ] = useState<string | null>(null);

  const [
    mostraModalModifica,
    setMostraModalModifica,
  ] = useState(false);

  const [
    formModifica,
    setFormModifica,
  ] = useState<AggiornaClienteRequest | null>(
    null,
  );

  const [
    salvataggioCliente,
    setSalvataggioCliente,
  ] = useState(false);

  const [
    erroreModifica,
    setErroreModifica,
  ] = useState<string | null>(null);

  const [
    reinvioAttivazione,
    setReinvioAttivazione,
  ] = useState(false);

  const [
    messaggioAttivazione,
    setMessaggioAttivazione,
  ] = useState<string | null>(null);

  const [
    erroreAttivazione,
    setErroreAttivazione,
  ] = useState<string | null>(null);

  const caricaTesseramenti = async (
    clienteId: number,
  ) => {
    const [
      tessera,
      storico,
    ] = await Promise.all([
      tesseramentiService.trovaCorrente(
        clienteId,
      ),
      tesseramentiService.trovaStorico(
        clienteId,
      ),
    ]);

    setTesseraCorrente(tessera);
    setStoricoTesseramenti(storico);
  };

  const caricaPratiche = async (
    clienteId: number,
  ) => {
    const risposta =
      await praticheService.trovaPerCliente(
        clienteId,
        {
          page: 0,
          size: 3,
          sort: "aggiornatoIl,desc",
        },
      );

    setPratiche(risposta.content);
  };

  const caricaAppuntamenti = async (
    clienteId: number,
  ) => {
    const risposta =
      await appuntamentiService.trovaTutti({
        clienteId,
      });

    const adesso = new Date().getTime();

    const prossimi = risposta
      .filter((appuntamento) => {
        const inizio = new Date(
          appuntamento.inizio,
        ).getTime();

        return (
          inizio >= adesso &&
          appuntamento.stato !==
            "COMPLETATO" &&
          appuntamento.stato !==
            "ANNULLATO"
        );
      })
      .sort(
        (primo, secondo) =>
          new Date(
            primo.inizio,
          ).getTime() -
          new Date(
            secondo.inizio,
          ).getTime(),
      )
      .slice(0, 3);

    setAppuntamenti(prossimi);
  };

  useEffect(() => {
    const clienteId = Number(id);

    if (
      !Number.isInteger(clienteId) ||
      clienteId <= 0
    ) {
      setErrore(
        "Identificativo cliente non valido.",
      );

      setCaricamento(false);

      return;
    }

    const caricaScheda = async () => {
      try {
        setCaricamento(true);
        setErrore(null);

        const datiCliente =
          await clientiService.trovaPerId(
            clienteId,
          );

        setCliente(datiCliente);

        await Promise.all([
          caricaTesseramenti(clienteId),
          caricaPratiche(clienteId),
          caricaAppuntamenti(clienteId),
        ]);
      } catch {
        setErrore(
          "Impossibile caricare la scheda del cliente.",
        );
      } finally {
        setCaricamento(false);
      }
    };

    void caricaScheda();
  }, [id]);

  const apriModalTesseramento = () => {
    setDataTesseramento(dataOdierna());
    setNoteTesseramento("");
    setErroreTesseramento(null);

    setMostraModalTesseramento(true);
  };

  const chiudiModalTesseramento = () => {
    if (salvataggioTesseramento) {
      return;
    }

    setMostraModalTesseramento(false);
    setErroreTesseramento(null);
  };

  const registraTesseramento = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!cliente) {
      return;
    }

    try {
      setSalvataggioTesseramento(true);
      setErroreTesseramento(null);

      await tesseramentiService.crea(
        cliente.id,
        {
          dataTesseramento,
          note:
            noteTesseramento.trim() || null,
        },
      );

      await caricaTesseramenti(cliente.id);

      setMostraModalTesseramento(false);
    } catch {
      setErroreTesseramento(
        "Impossibile registrare il tesseramento. Verifica che la quota annuale sia configurata in Amministrazione.",
      );
    } finally {
      setSalvataggioTesseramento(false);
    }
  };

  const apriModalModifica = () => {
    if (!cliente) {
      return;
    }

    setFormModifica({
      nome: cliente.nome,
      cognome: cliente.cognome,
      codiceFiscale:
        cliente.codiceFiscale,
      dataNascita:
        cliente.dataNascita,
      luogoNascita:
        cliente.luogoNascita,
      email: cliente.email,
      telefono: cliente.telefono,
      telefonoSecondario:
        cliente.telefonoSecondario,
      indirizzo: cliente.indirizzo,
      comune: cliente.comune,
      provincia: cliente.provincia,
      cap: cliente.cap,
      domicilioDiversoDallaResidenza:
        cliente.domicilioDiversoDallaResidenza,
      domicilioIndirizzo:
        cliente.domicilioIndirizzo,
      domicilioComune:
        cliente.domicilioComune,
      domicilioProvincia:
        cliente.domicilioProvincia,
      domicilioCap:
        cliente.domicilioCap,
    });

    setErroreModifica(null);
    setMostraModalModifica(true);
  };

  const chiudiModalModifica = () => {
    if (salvataggioCliente) {
      return;
    }

    setMostraModalModifica(false);
    setFormModifica(null);
    setErroreModifica(null);
  };

  const aggiornaCampo = <
    K extends keyof AggiornaClienteRequest,
  >(
    campo: K,
    dato: AggiornaClienteRequest[K],
  ) => {
    setFormModifica((corrente) =>
      corrente
        ? {
            ...corrente,
            [campo]: dato,
          }
        : corrente,
    );
  };

  const salvaModificheCliente = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!cliente || !formModifica) {
      return;
    }

    const dati: AggiornaClienteRequest = {
      ...formModifica,
      nome: formModifica.nome.trim(),
      cognome:
        formModifica.cognome.trim(),
      codiceFiscale:
        formModifica.codiceFiscale
          .trim()
          .toUpperCase(),
      luogoNascita:
        normalizzaFacoltativo(
          formModifica.luogoNascita,
        ),
      email:
        formModifica.email.trim(),
      telefono:
        normalizzaFacoltativo(
          formModifica.telefono,
        ),
      telefonoSecondario:
        normalizzaFacoltativo(
          formModifica.telefonoSecondario,
        ),
      indirizzo:
        normalizzaFacoltativo(
          formModifica.indirizzo,
        ),
      comune:
        normalizzaFacoltativo(
          formModifica.comune,
        ),
      provincia:
        normalizzaFacoltativo(
          formModifica.provincia,
        )?.toUpperCase() ?? null,
      cap:
        normalizzaFacoltativo(
          formModifica.cap,
        ),
      domicilioIndirizzo:
        formModifica
          .domicilioDiversoDallaResidenza
          ? normalizzaFacoltativo(
              formModifica.domicilioIndirizzo,
            )
          : null,
      domicilioComune:
        formModifica
          .domicilioDiversoDallaResidenza
          ? normalizzaFacoltativo(
              formModifica.domicilioComune,
            )
          : null,
      domicilioProvincia:
        formModifica
          .domicilioDiversoDallaResidenza
          ? normalizzaFacoltativo(
              formModifica.domicilioProvincia,
            )?.toUpperCase() ?? null
          : null,
      domicilioCap:
        formModifica
          .domicilioDiversoDallaResidenza
          ? normalizzaFacoltativo(
              formModifica.domicilioCap,
            )
          : null,
    };

    try {
      setSalvataggioCliente(true);
      setErroreModifica(null);

      const clienteAggiornato =
        await clientiService.aggiornaCliente(
          cliente.id,
          dati,
        );

      setCliente(clienteAggiornato);
      setMostraModalModifica(false);
      setFormModifica(null);
    } catch {
      setErroreModifica(
        "Non è stato possibile aggiornare i dati. Controlla i campi e riprova.",
      );
    } finally {
      setSalvataggioCliente(false);
    }
  };

  const reinviaEmailAttivazione = async () => {
    if (!cliente) {
      return;
    }

    try {
      setReinvioAttivazione(true);
      setMessaggioAttivazione(null);
      setErroreAttivazione(null);

      await clientiService.reinviaAttivazione(
        cliente.id,
      );

      setMessaggioAttivazione(
        "Email di attivazione inviata nuovamente.",
      );
    } catch {
      setErroreAttivazione(
        "Non è stato possibile inviare l'email di attivazione.",
      );
    } finally {
      setReinvioAttivazione(false);
    }
  };

  if (caricamento) {
    return (
      <section className="dettaglio-cliente-page">
        <div className="dettaglio-cliente-loading">
          <Spinner
            animation="border"
            size="sm"
          />

          <p>
            Caricamento scheda cliente...
          </p>
        </div>
      </section>
    );
  }

  if (errore || !cliente) {
    return (
      <section className="dettaglio-cliente-page">
        <Alert
          variant="danger"
          className="dettaglio-cliente-error"
        >
          {errore ??
            "Cliente non trovato."}
        </Alert>

        <Button
          type="button"
          variant="outline-secondary"
          onClick={() =>
            navigate("/clienti")
          }
        >
          <FiArrowLeft />

          <span>
            Torna ai clienti
          </span>
        </Button>
      </section>
    );
  }

  return (
    <section className="dettaglio-cliente-page">
      <PrivatePageHeader
        eyebrow="Gestione anagrafiche"
        title={`${cliente.nome} ${cliente.cognome}`}
        description={`Codice fiscale: ${cliente.codiceFiscale}`}
        action={
          <Button
            type="button"
            variant="outline-secondary"
            className="dettaglio-cliente-page__back"
            onClick={() =>
              navigate("/clienti")
            }
          >
            <FiArrowLeft />

            <span>
              Tutti i clienti
            </span>
          </Button>
        }
      />

      <section className="dettaglio-cliente-hero">
        <div className="dettaglio-cliente-hero__identity">
          <span className="dettaglio-cliente-hero__avatar">
            {cliente.nome
              .charAt(0)
              .toUpperCase()}

            {cliente.cognome
              .charAt(0)
              .toUpperCase()}
          </span>

          <div>
            <span className="dettaglio-cliente-hero__label">
              Stato account
            </span>

            <div className="dettaglio-cliente-hero__status">
              <FiCheckCircle />

              <strong>
                {cliente.attivo &&
                cliente.emailVerificata
                  ? "Account attivo"
                  : "In attesa di attivazione"}
              </strong>
            </div>

            <p>
              {cliente.attivo &&
              cliente.emailVerificata
                ? "Il cliente può accedere alla propria area riservata."
                : "Il cliente deve completare l'attivazione dal link ricevuto via email."}
            </p>

            {(!cliente.attivo ||
              !cliente.emailVerificata) && (
              <div className="dettaglio-cliente-hero__activation">
                <Button
                  type="button"
                  variant="outline-success"
                  size="sm"
                  disabled={
                    reinvioAttivazione
                  }
                  onClick={() =>
                    void reinviaEmailAttivazione()
                  }
                >
                  {reinvioAttivazione ? (
                    <Spinner
                      animation="border"
                      size="sm"
                    />
                  ) : (
                    <FiRefreshCw />
                  )}

                  <span>
                    {reinvioAttivazione
                      ? "Invio..."
                      : "Invia di nuovo l'email"}
                  </span>
                </Button>

                {messaggioAttivazione && (
                  <small className="dettaglio-cliente-hero__activation-success">
                    {messaggioAttivazione}
                  </small>
                )}

                {erroreAttivazione && (
                  <small className="dettaglio-cliente-hero__activation-error">
                    {erroreAttivazione}
                  </small>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="dettaglio-cliente-hero__contact">
          <a
            href={`mailto:${cliente.email}`}
          >
            <FiMail />

            {cliente.email}
          </a>

          {cliente.telefono && (
            <a
              href={`tel:${cliente.telefono}`}
            >
              <FiPhone />

              {cliente.telefono}
            </a>
          )}

          {cliente.telefonoSecondario && (
            <a
              href={`tel:${cliente.telefonoSecondario}`}
            >
              <FiPhone />

              {cliente.telefonoSecondario}
            </a>
          )}
        </div>
      </section>

      <div className="dettaglio-cliente-overview">
        <section className="dettaglio-cliente-card dettaglio-cliente-card--anagrafica">
          <header className="dettaglio-cliente-card__header">
            <span className="dettaglio-cliente-card__icon dettaglio-cliente-card__icon--green">
              <FiUser />
            </span>

            <div>
              <h2>
                Anagrafica
              </h2>

              <p>
                Dati personali, contatti e indirizzi.
              </p>
            </div>

            <Button
              type="button"
              variant="outline-primary"
              className="dettaglio-cliente-card__edit"
              onClick={apriModalModifica}
            >
              <FiEdit3 />

              <span>
                Modifica dati
              </span>
            </Button>
          </header>

          <div className="dettaglio-cliente-fields">
            <div>
              <span>
                Codice fiscale
              </span>

              <strong>
                {cliente.codiceFiscale}
              </strong>
            </div>

            <div>
              <span>
                Data di nascita
              </span>

              <strong>
                {formattaData(
                  cliente.dataNascita,
                )}
              </strong>
            </div>

            <div>
              <span>
                Luogo di nascita
              </span>

              <strong>
                {valore(
                  cliente.luogoNascita,
                )}
              </strong>
            </div>

            <div>
              <span>
                Telefono
              </span>

              <strong>
                {valore(cliente.telefono)}
              </strong>
            </div>

            <div className="dettaglio-cliente-fields__full">
              <span>
                Residenza
              </span>

              <strong>
                {[
                  cliente.indirizzo,
                  cliente.cap,
                  cliente.comune,
                  cliente.provincia,
                ]
                  .filter(Boolean)
                  .join(", ") ||
                  "Non indicato"}
              </strong>
            </div>

            <div className="dettaglio-cliente-fields__full">
              <span>
                Domicilio
              </span>

              <strong>
                {cliente.domicilioDiversoDallaResidenza
                  ? [
                      cliente.domicilioIndirizzo,
                      cliente.domicilioCap,
                      cliente.domicilioComune,
                      cliente.domicilioProvincia,
                    ]
                      .filter(Boolean)
                      .join(", ") ||
                    "Non indicato"
                  : "Uguale alla residenza"}
              </strong>
            </div>
          </div>
        </section>

        <section className="dettaglio-cliente-tessera-card">
          <header className="dettaglio-cliente-card__header">
            <span className="dettaglio-cliente-card__icon dettaglio-cliente-card__icon--purple">
              <FiCalendar />
            </span>

            <div>
              <span className="dettaglio-cliente-tessera-card__eyebrow">
                Tesseramento CAF
              </span>

              <h2>
                Tessera annuale
              </h2>
            </div>
          </header>

          {tesseraCorrente ? (
            <div className="dettaglio-cliente-tessera-card__active">
              <span
                className={[
                  "dettaglio-cliente-tessera__status",
                  classeStatoTessera(
                    tesseraCorrente.stato,
                  ),
                ].join(" ")}
              >
                {etichettaStatoTessera(
                  tesseraCorrente.stato,
                )}
              </span>

              <strong>
                Valida fino al{" "}
                {formattaData(
                  tesseraCorrente.dataScadenza,
                )}
              </strong>

              <p>
                Tesserata il{" "}
                {formattaData(
                  tesseraCorrente.dataTesseramento,
                )}
                {" · "}
                {formattaEuro(
                  tesseraCorrente.quota,
                )}
              </p>
            </div>
          ) : (
            <div className="dettaglio-cliente-tessera-card__empty">
              <div>
                <span>
                  Tessera da attivare
                </span>

                <p>
                  Registra il tesseramento e la
                  quota configurata verrà salvata
                  automaticamente nello storico.
                </p>
              </div>

              <Button
                type="button"
                className="dettaglio-cliente-tessera__create"
                onClick={apriModalTesseramento}
              >
                <FiPlus />

                <span>
                  Registra tesseramento
                </span>
              </Button>
            </div>
          )}
        </section>
      </div>

      <section className="dettaglio-cliente-pratiche">
        <header className="dettaglio-cliente-pratiche__header">
          <div>
            <span className="dettaglio-cliente-pratiche__eyebrow">
              Attività del cliente
            </span>

            <h2>
              Pratiche recenti
            </h2>
          </div>

          <Button
            type="button"
            variant="outline-primary"
            onClick={() =>
              navigate(
                `/pratiche?clienteId=${cliente.id}`,
              )
            }
          >
            <span>
              Tutte le pratiche
            </span>

            <FiArrowRight />
          </Button>
        </header>

        {pratiche.length === 0 ? (
          <div className="dettaglio-cliente-pratiche__empty">
            <FiFileText />

            <div>
              <strong>
                Nessuna pratica collegata
              </strong>

              <p>
                Quando verrà aperta una pratica
                per {cliente.nome}{" "}
                {cliente.cognome}, apparirà qui.
              </p>
            </div>
          </div>
        ) : (
          <div className="dettaglio-cliente-pratiche__list">
            {pratiche.map((pratica) => (
              <button
                key={pratica.id}
                type="button"
                className="dettaglio-cliente-pratica"
                onClick={() =>
                  navigate(
                    `/pratiche/${pratica.id}`,
                  )
                }
              >
                <span className="dettaglio-cliente-pratica__icon">
                  <FiFileText />
                </span>

                <span className="dettaglio-cliente-pratica__content">
                  <strong>
                    {pratica.oggetto}
                  </strong>

                  <small>
                    {pratica.numeroPratica}
                    {" · "}
                    {pratica.servizio.nome}
                  </small>
                </span>

                <span className="dettaglio-cliente-pratica__meta">
                  <small
                    className={`dettaglio-cliente-pratica__status dettaglio-cliente-pratica__status--${pratica.stato.toLowerCase()}`}
                  >
                    {
                      etichetteStatoPratica[
                        pratica.stato
                      ]
                    }
                  </small>

                  {pratica.dataScadenza && (
                    <span>
                      {formattaData(
                        pratica.dataScadenza,
                      )}
                    </span>
                  )}
                </span>

                <FiArrowRight className="dettaglio-cliente-pratica__arrow" />
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="dettaglio-cliente-appuntamenti">
        <header className="dettaglio-cliente-appuntamenti__header">
          <div>
            <span>
              Agenda del cliente
            </span>

            <h2>
              Prossimi appuntamenti
            </h2>
          </div>

          <Button
            type="button"
            variant="outline-primary"
            onClick={() =>
              navigate("/agenda")
            }
          >
            <span>
              Vai all’agenda
            </span>

            <FiArrowRight />
          </Button>
        </header>

        {appuntamenti.length === 0 ? (
          <div className="dettaglio-cliente-appuntamenti__empty">
            <FiCalendar />

            <div>
              <strong>
                Nessun appuntamento programmato
              </strong>

              <p>
                I prossimi appuntamenti di{" "}
                {cliente.nome}{" "}
                {cliente.cognome} appariranno qui.
              </p>
            </div>
          </div>
        ) : (
          <div className="dettaglio-cliente-appuntamenti__list">
            {appuntamenti.map(
              (appuntamento) => (
                <article
                  key={appuntamento.id}
                  className="dettaglio-cliente-appuntamento"
                >
                  <span className="dettaglio-cliente-appuntamento__icon">
                    <FiCalendar />
                  </span>

                  <div className="dettaglio-cliente-appuntamento__content">
                    <strong>
                      {appuntamento.titolo}
                    </strong>

                    <span>
                      <FiClock />

                      {formattaDataOra(
                        appuntamento.inizio,
                      )}
                    </span>

                    <small>
                      {
                        etichetteModalitaAppuntamento[
                          appuntamento.modalita
                        ]
                      }

                      {appuntamento.servizioNome
                        ? ` · ${appuntamento.servizioNome}`
                        : ""}

                      {appuntamento.numeroPratica
                        ? ` · ${appuntamento.numeroPratica}`
                        : ""}
                    </small>
                  </div>

                  <span
                    className={[
                      "dettaglio-cliente-appuntamento__status",
                      `dettaglio-cliente-appuntamento__status--${appuntamento.stato.toLowerCase()}`,
                    ].join(" ")}
                  >
                    {
                      etichetteStatoAppuntamento[
                        appuntamento.stato
                      ]
                    }
                  </span>
                </article>
              ),
            )}
          </div>
        )}
      </section>

      <section className="dettaglio-cliente-storico">
        <header className="dettaglio-cliente-storico__header">
          <div>
            <span>
              Tesseramenti
            </span>

            <h2>
              Storico rinnovi
            </h2>
          </div>

          {!tesseraCorrente && (
            <Button
              type="button"
              variant="outline-primary"
              onClick={apriModalTesseramento}
            >
              <FiPlus />

              <span>
                Registra tessera
              </span>
            </Button>
          )}
        </header>

        {storicoTesseramenti.length === 0 ? (
          <p className="dettaglio-cliente-storico__empty">
            Non sono ancora presenti
            tesseramenti per questo cliente.
          </p>
        ) : (
          <div className="dettaglio-cliente-storico__list">
            {storicoTesseramenti.map(
              (tesseramento) => (
                <article
                  key={tesseramento.id}
                  className="dettaglio-cliente-storico__item"
                >
                  <div>
                    <strong>
                      Tesseramento del{" "}
                      {formattaData(
                        tesseramento.dataTesseramento,
                      )}
                    </strong>

                    <span>
                      Valido fino al{" "}
                      {formattaData(
                        tesseramento.dataScadenza,
                      )}
                    </span>
                  </div>

                  <div className="dettaglio-cliente-storico__item-meta">
                    <span>
                      {formattaEuro(
                        tesseramento.quota,
                      )}
                    </span>

                    <small
                      className={classeStatoTessera(
                        tesseramento.stato,
                      )}
                    >
                      {etichettaStatoTessera(
                        tesseramento.stato,
                      )}
                    </small>
                  </div>
                </article>
              ),
            )}
          </div>
        )}
      </section>

      <Modal
        show={mostraModalTesseramento}
        onHide={chiudiModalTesseramento}
        centered
        backdrop={
          salvataggioTesseramento
            ? "static"
            : true
        }
        keyboard={!salvataggioTesseramento}
        dialogClassName="dettaglio-cliente-tesseramento-modal"
      >
        <Form onSubmit={registraTesseramento}>
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
            {erroreTesseramento && (
              <Alert variant="danger">
                {erroreTesseramento}
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
                value={dataTesseramento}
                max={dataOdierna()}
                disabled={
                  salvataggioTesseramento
                }
                onChange={(event) =>
                  setDataTesseramento(
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
                value={noteTesseramento}
                disabled={
                  salvataggioTesseramento
                }
                onChange={(event) =>
                  setNoteTesseramento(
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
              onClick={chiudiModalTesseramento}
              disabled={
                salvataggioTesseramento
              }
            >
              Annulla
            </Button>

            <Button
              type="submit"
              className="dettaglio-cliente-tessera__create dettaglio-cliente-modal__primary"
              disabled={
                salvataggioTesseramento
              }
            >
              {salvataggioTesseramento ? (
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

      <Modal
        show={mostraModalModifica}
        onHide={chiudiModalModifica}
        centered
        size="lg"
        backdrop={
          salvataggioCliente
            ? "static"
            : true
        }
        keyboard={!salvataggioCliente}
        dialogClassName="dettaglio-cliente-edit-modal"
      >
        {formModifica && (
          <Form
            onSubmit={salvaModificheCliente}
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
              {erroreModifica && (
                <Alert variant="danger">
                  {erroreModifica}
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
                      value={formModifica.nome}
                      disabled={salvataggioCliente}
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
                      value={formModifica.cognome}
                      disabled={salvataggioCliente}
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
                        formModifica.codiceFiscale
                      }
                      disabled={salvataggioCliente}
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
                        formModifica.dataNascita ??
                        ""
                      }
                      disabled={salvataggioCliente}
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
                        formModifica.luogoNascita ??
                        ""
                      }
                      disabled={salvataggioCliente}
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
                      value={formModifica.email}
                      disabled={salvataggioCliente}
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
                        formModifica.telefono ??
                        ""
                      }
                      disabled={salvataggioCliente}
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
                        formModifica
                          .telefonoSecondario ??
                        ""
                      }
                      disabled={salvataggioCliente}
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
                        formModifica.indirizzo ??
                        ""
                      }
                      disabled={salvataggioCliente}
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
                        formModifica.comune ??
                        ""
                      }
                      disabled={salvataggioCliente}
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
                        formModifica.provincia ??
                        ""
                      }
                      disabled={salvataggioCliente}
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
                      value={formModifica.cap ?? ""}
                      disabled={salvataggioCliente}
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
                    formModifica
                      .domicilioDiversoDallaResidenza
                  }
                  disabled={salvataggioCliente}
                  onChange={(event) =>
                    aggiornaCampo(
                      "domicilioDiversoDallaResidenza",
                      event.target.checked,
                    )
                  }
                />

                {formModifica
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
                          formModifica
                            .domicilioIndirizzo ??
                          ""
                        }
                        disabled={salvataggioCliente}
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
                          formModifica
                            .domicilioComune ??
                          ""
                        }
                        disabled={salvataggioCliente}
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
                          formModifica
                            .domicilioProvincia ??
                          ""
                        }
                        disabled={salvataggioCliente}
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
                          formModifica
                            .domicilioCap ??
                          ""
                        }
                        disabled={salvataggioCliente}
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
                disabled={salvataggioCliente}
                onClick={chiudiModalModifica}
              >
                Annulla
              </Button>

              <Button
                type="submit"
                className="dettaglio-cliente-save dettaglio-cliente-modal__primary"
                disabled={salvataggioCliente}
              >
                {salvataggioCliente ? (
                  <Spinner
                    animation="border"
                    size="sm"
                  />
                ) : (
                  <FiSave />
                )}

                <span>
                  {salvataggioCliente
                    ? "Salvataggio..."
                    : "Salva modifiche"}
                </span>
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal>
    </section>
  );
};

export default DettaglioClientePage;