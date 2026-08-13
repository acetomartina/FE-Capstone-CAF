import { Card, Stack } from "react-bootstrap";
import {
  FiBell,
  FiCalendar,
  FiFolder,
  FiMapPin,
} from "react-icons/fi";

const LoginHero = () => {
  const vantaggi = [
    {
      icona: <FiFolder aria-hidden="true" />,
      titolo: "Consulta i documenti",
      descrizione:
        "Tutti i tuoi documenti sempre disponibili.",
    },
    {
      icona: <FiMapPin aria-hidden="true" />,
      titolo: "Segui lo stato delle pratiche",
      descrizione:
        "Monitora l’avanzamento in tempo reale.",
    },
    {
      icona: <FiBell aria-hidden="true" />,
      titolo: "Ricevi notifiche",
      descrizione:
        "Promemoria automatici per non dimenticare nulla.",
    },
    {
      icona: <FiCalendar aria-hidden="true" />,
      titolo: "Prenota appuntamenti",
      descrizione:
        "Scegli giorno e orario in pochi click.",
    },
  ];

  return (
    <section className="login-info">
      <div className="login-info__content mx-auto">
        <div className="login-info__heading">
          <span className="login-info__eyebrow">
            Portale personale
          </span>

          <h1 className="login-info__title">
            La tua area personale,
            <br />
            sempre <span>a portata di mano.</span>
          </h1>

          <p className="login-info__description">
            Consulta i tuoi documenti, monitora lo stato
            delle pratiche e non perdere mai una scadenza.
          </p>
        </div>

        <Stack gap={3} className="login-info__benefits">
          {vantaggi.map((vantaggio) => (
            <Card
              key={vantaggio.titolo}
              className="login-benefit border shadow-none"
            >
              <Card.Body className="d-flex align-items-center gap-3 p-3">
                <span className="login-benefit__icon d-flex align-items-center justify-content-center flex-shrink-0">
                  {vantaggio.icona}
                </span>

                <div>
                  <Card.Title
                    as="h2"
                    className="login-benefit__title mb-1"
                  >
                    {vantaggio.titolo}
                  </Card.Title>

                  <Card.Text className="login-benefit__description mb-0">
                    {vantaggio.descrizione}
                  </Card.Text>
                </div>
              </Card.Body>
            </Card>
          ))}
        </Stack>
      </div>
    </section>
  );
};

export default LoginHero;