import { FiPhone, FiUser } from "react-icons/fi";

const LoginContactCard = () => {
  return (
    <aside className="login-contact-box">
      <span className="login-contact-box__icon">
        <FiUser />
      </span>

      <div className="login-contact-box__text">
        <strong>Non hai ancora un account?</strong>

        <p>
          Contatta il CAF FAPI Pianopoli oppure richiedi l’abilitazione durante
          l’apertura della pratica.
        </p>
      </div>

      <a
        href="tel:+393779609155"
        className="login-contact-box__button"
      >
        <FiPhone />
        Contattaci
      </a>
    </aside>
  );
};

export default LoginContactCard;