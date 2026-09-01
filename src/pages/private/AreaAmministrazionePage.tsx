import {
  FiArrowRight,
  FiHome,
  FiMapPin,
  FiSettings,
  FiUsers,
  FiCreditCard,
} from "react-icons/fi";

import {
  useNavigate,
} from "react-router-dom";

import "./AreaAmministrazionePage.css";

type CardAmministrazione = {
  titolo: string;
  descrizione: string;
  path: string;
  icona: React.ReactNode;
  variante:
    | "green"
    | "blue"
    | "purple"
    | "orange";
  disponibile?: boolean;
};

const AreaAmministrazionePage = () => {
  const navigate = useNavigate();

  const cards: CardAmministrazione[] = [
    {
      titolo:
        "Servizi e macroaree",
      descrizione:
        "Configura catalogo, prezzi, visibilità, disponibilità e checklist documentali dei servizi.",
      path:
        "/amministrazione/servizi",
      icona: <FiSettings />,
      variante: "green",
      disponibile: true,
    },
    {
  titolo:
    "Tesseramento annuale",
  descrizione:
    "Imposta la quota annuale della tessera e monitora le regole di rinnovo applicate ai clienti.",
  path:
    "/amministrazione/tesseramento",
  icona: <FiCreditCard />,
  variante: "purple",
  disponibile: true,
},
    {
      titolo:
        "Contenuti Home",
      descrizione:
        "Gestisci volantini, contenuti promozionali e servizi in evidenza mostrati nella Home pubblica.",
      path:
        "/amministrazione/home",
      icona: <FiHome />,
      variante: "blue",
      disponibile: true,
    },
    {
      titolo:
        "Utenti e ruoli",
      descrizione:
        "Gestisci amministratori, dipendenti, profili e autorizzazioni di accesso al gestionale.",
      path:
        "/amministrazione/utenti",
      icona: <FiUsers />,
      variante: "purple",
      disponibile: false,
    },
    {
      titolo:
        "Configurazione sede",
      descrizione:
        "Aggiorna dati della sede, recapiti, informazioni pubbliche e parametri organizzativi.",
      path:
        "/amministrazione/sede",
      icona: <FiMapPin />,
      variante: "orange",
      disponibile: false,
    },
  ];

  return (
    <section className="amministrazione-page">
      <header className="amministrazione-page__header">
        <span className="amministrazione-page__eyebrow">
          Area riservata
        </span>

        <h1>
          Amministrazione
        </h1>

        <p>
          Gestisci configurazioni,
          contenuti pubblici e strumenti
          amministrativi del CAF.
        </p>
      </header>

      <div className="amministrazione-page__intro">
        <div>
          <strong>
            Centro di controllo
          </strong>

          <span>
            Accedi alle principali
            configurazioni del gestionale e
            del sito pubblico.
          </span>
        </div>
      </div>

      <div className="amministrazione-page__grid">
        {cards.map(
          (card) => (
            <button
              key={card.titolo}
              type="button"
              className={[
                "amministrazione-card",
                `amministrazione-card--${card.variante}`,
                !card.disponibile
                  ? "amministrazione-card--disabled"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => {
                if (
                  card.disponibile
                ) {
                  navigate(
                    card.path,
                  );
                }
              }}
              disabled={
                !card.disponibile
              }
            >
              <div className="amministrazione-card__top">
                <span className="amministrazione-card__icon">
                  {card.icona}
                </span>

                {!card.disponibile && (
                  <span className="amministrazione-card__soon">
                    Prossimamente
                  </span>
                )}
              </div>

              <div className="amministrazione-card__content">
                <h2>
                  {card.titolo}
                </h2>

                <p>
                  {
                    card.descrizione
                  }
                </p>
              </div>

              <div className="amministrazione-card__footer">
                <span>
                  {card.disponibile
                    ? "Apri sezione"
                    : "In preparazione"}
                </span>

                <span className="amministrazione-card__arrow">
                  <FiArrowRight />
                </span>
              </div>
            </button>
          ),
        )}
      </div>
    </section>
  );
};

export default AreaAmministrazionePage;