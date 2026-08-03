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
      icona: <FiFolder />,
      titolo: "Consulta i documenti",
      descrizione: "Tutti i tuoi documenti sempre disponibili.",
    },
    {
      icona: <FiMapPin />,
      titolo: "Segui lo stato delle pratiche",
      descrizione: "Monitora l’avanzamento in tempo reale.",
    },
    {
      icona: <FiBell />,
      titolo: "Ricevi notifiche",
      descrizione: "Promemoria automatici per non dimenticare nulla.",
    },
    {
      icona: <FiCalendar />,
      titolo: "Prenota appuntamenti",
      descrizione: "Scegli giorno e orario in pochi click.",
    },
  ];

  return (
    <section className="login-info h-100">
      <div className="login-info__content mx-auto">
        {/* Il marchio sta gia' nella navbar, a pochi pixel da qui:
            ripeterlo rubava spazio senza aggiungere informazione. */}
        <div className="mb-4">
          <h1 className="login-info__title mb-3">
            La tua area personale,
            <br />
            sempre <span>a portata di mano.</span>
          </h1>

          <p className="login-info__description mb-0">
            Consulta i tuoi documenti, monitora lo stato delle pratiche
            e non perdere mai una scadenza.
          </p>
        </div>

        <Stack gap={3}>
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