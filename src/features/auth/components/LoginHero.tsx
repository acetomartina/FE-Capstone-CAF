import {
  FiBell,
  FiCalendar,
  FiFolder,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

const LoginHero = () => {
  return (
    <section className="login-info">
      <div className="login-info__content">
        <div className="login-info__eyebrow">
          <span className="login-info__symbol">F</span>

          <div>
            <strong>FAPI</strong>
            <span>SEDE DI PIANOPOLI</span>
          </div>
        </div>

        <div className="login-info__heading">
          <h1>
            La tua area personale,
            <br />
            sempre <span>a portata di mano.</span>
          </h1>

          <p>
            Consulta i tuoi documenti, monitora lo stato delle pratiche e non
            perdere mai una scadenza.
          </p>
        </div>

        <div className="login-benefits">
          <article className="login-benefit">
            <FiFolder />

            <div>
              <h2>Consulta i documenti</h2>
              <p>Tutti i tuoi documenti sempre disponibili.</p>
            </div>
          </article>

          <article className="login-benefit">
            <FiMapPin />

            <div>
              <h2>Segui lo stato delle pratiche</h2>
              <p>Monitora l’avanzamento in tempo reale.</p>
            </div>
          </article>

          <article className="login-benefit">
            <FiBell />

            <div>
              <h2>Ricevi notifiche</h2>
              <p>Promemoria automatici per non dimenticare nulla.</p>
            </div>
          </article>

          <article className="login-benefit">
            <FiCalendar />

            <div>
              <h2>Prenota appuntamenti</h2>
              <p>Scegli giorno e orario in pochi click.</p>
            </div>
          </article>
        </div>

        <div className="login-info__contacts">
          <a href="tel:+393779609155">
            <FiPhone />
            377 960 9155
          </a>

          <span>Lun–Ven 9:00–13:00 • 15:30–18:30</span>
        </div>
      </div>
    </section>
  );
};

export default LoginHero;