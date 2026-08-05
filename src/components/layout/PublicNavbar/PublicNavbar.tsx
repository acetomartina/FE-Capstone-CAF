import { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
  FiMail,
  FiMapPin,
  FiMenu,
  FiPhone,
  FiUser,
  FiX,
} from "react-icons/fi";

import logoCafFapi from "../../../assets/logo.svg";
import "./PublicNavbar.css";

const LINK_NAVIGAZIONE = [
  { etichetta: "Home", destinazione: "/" },
  { etichetta: "Servizi", destinazione: "/servizi" },
  { etichetta: "Chi siamo", destinazione: "/chi-siamo" },
  { etichetta: "Contatti", destinazione: "/contatti" },
];

type Lingua = "IT" | "EN";

const PublicNavbar = () => {
  const [menuAperto, setMenuAperto] = useState(false);
  const [lingua, setLingua] = useState<Lingua>("IT");

  const chiudiMenu = () => {
    setMenuAperto(false);
  };

  useEffect(() => {
    document.body.classList.toggle(
      "public-navbar-menu-open",
      menuAperto,
    );

    return () => {
      document.body.classList.remove(
        "public-navbar-menu-open",
      );
    };
  }, [menuAperto]);

  useEffect(() => {
    const gestisciEscape = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        chiudiMenu();
      }
    };

    window.addEventListener("keydown", gestisciEscape);

    return () => {
      window.removeEventListener(
        "keydown",
        gestisciEscape,
      );
    };
  }, []);

  return (
    <>
      <Navbar
        sticky="top"
        className="public-navbar bg-white py-0"
      >
        <Container
          fluid="xl"
          className="public-navbar__container"
        >
          <Navbar.Brand
            as={NavLink}
            to="/"
            className="public-navbar__brand d-flex align-items-center m-0 p-0"
          >
            <img
              src={logoCafFapi}
              alt="CAF FAPI Pianopoli"
              className="public-navbar__logo"
            />

            <div className="public-navbar__office d-none d-xl-flex flex-column border-start">
              <span>SEDE DI</span>
              <strong>Pianopoli</strong>
            </div>
          </Navbar.Brand>

          <Nav
            className="public-navbar__nav d-none d-lg-flex mx-auto"
            aria-label="Navigazione principale"
          >
            {LINK_NAVIGAZIONE.map((link) => (
              <NavLink
                key={link.destinazione}
                to={link.destinazione}
                className="nav-link"
              >
                {link.etichetta}
              </NavLink>
            ))}
          </Nav>

          <div className="public-navbar__desktop-actions d-none d-lg-flex align-items-center">
            <a
              href="tel:+393779609155"
              className="public-navbar__phone"
            >
              <span className="public-navbar__phone-icon">
                <FiPhone aria-hidden="true" />
              </span>

              <span>377 960 9155</span>
            </a>

            <span
              className="public-navbar__separator"
              aria-hidden="true"
            />

            <div
              className="public-navbar__languages"
              role="group"
              aria-label="Selezione lingua"
            >
              {(["IT", "EN"] as const).map(
                (opzione, indice) => (
                  <span
                    key={opzione}
                    className="public-navbar__language-item"
                  >
                    {indice > 0 && (
                      <span
                        className="public-navbar__language-separator"
                        aria-hidden="true"
                      >
                        /
                      </span>
                    )}

                    <button
                      type="button"
                      className={`public-navbar__language ${
                        lingua === opzione
                          ? "is-active"
                          : ""
                      }`}
                      onClick={() =>
                        setLingua(opzione)
                      }
                      aria-pressed={
                        lingua === opzione
                      }
                    >
                      {opzione}
                    </button>
                  </span>
                ),
              )}
            </div>

            <NavLink
              to="/login"
              className="public-navbar__reserved"
            >
              <FiUser aria-hidden="true" />
              <span>Area riservata</span>
            </NavLink>
          </div>

          <div className="public-navbar__mobile-actions d-flex d-lg-none align-items-center">
            <a
              href="tel:+393779609155"
              className="public-navbar__mobile-phone"
              aria-label="Chiama CAF FAPI Pianopoli"
            >
              <FiPhone aria-hidden="true" />
            </a>

            <button
              type="button"
              className="public-navbar__menu-button"
              onClick={() => setMenuAperto(true)}
              aria-label="Apri il menu"
              aria-expanded={menuAperto}
              aria-controls="public-mobile-menu"
            >
              <FiMenu aria-hidden="true" />
            </button>
          </div>
        </Container>
      </Navbar>

      <div
        id="public-mobile-menu"
        className={`public-mobile-menu ${
          menuAperto
            ? "public-mobile-menu--open"
            : ""
        }`}
        aria-hidden={!menuAperto}
      >
        <button
          type="button"
          className="public-mobile-menu__backdrop"
          onClick={chiudiMenu}
          aria-label="Chiudi il menu"
          tabIndex={menuAperto ? 0 : -1}
        />

        <aside
          className="public-mobile-menu__panel"
          aria-label="Menu principale"
        >
          <header className="public-mobile-menu__header">
            <NavLink
              to="/"
              onClick={chiudiMenu}
              className="public-mobile-menu__brand"
            >
              <img
                src={logoCafFapi}
                alt="CAF FAPI Pianopoli"
              />

              <div className="public-mobile-menu__office">
                <span>SEDE DI</span>
                <strong>Pianopoli</strong>
              </div>
            </NavLink>

            <button
              type="button"
              className="public-mobile-menu__close"
              onClick={chiudiMenu}
              aria-label="Chiudi il menu"
            >
              <FiX aria-hidden="true" />
            </button>
          </header>

          <div className="public-mobile-menu__content">
            <nav
              className="public-mobile-menu__nav"
              aria-label="Navigazione mobile"
            >
              {LINK_NAVIGAZIONE.map((link) => (
                <NavLink
  key={link.destinazione}
  to={link.destinazione}
  onClick={chiudiMenu}
  className={({ isActive }) =>
    `public-mobile-menu__link ${
      isActive ? "active" : ""
    }`
  }
>
  <span className="public-mobile-menu__link-text">
    {link.etichetta}
  </span>
</NavLink>
              ))}
            </nav>

            <div className="public-mobile-menu__contacts">
              <p className="public-mobile-menu__section-title">
                Hai bisogno di aiuto?
              </p>

              <a
                href="tel:+393779609155"
                className="public-mobile-menu__contact"
                tabIndex={menuAperto ? 0 : -1}
              >
                <span className="public-mobile-menu__contact-icon public-mobile-menu__contact-icon--green">
                  <FiPhone aria-hidden="true" />
                </span>

                <span>
                  <small>Telefono</small>
                  <strong>377 960 9155</strong>
                </span>
              </a>

              <a
                href="mailto:pianopolicaf@gmail.com"
                className="public-mobile-menu__contact"
                tabIndex={menuAperto ? 0 : -1}
              >
                <span className="public-mobile-menu__contact-icon public-mobile-menu__contact-icon--fuchsia">
                  <FiMail aria-hidden="true" />
                </span>

                <span>
                  <small>Email</small>
                  <strong>
                    pianopolicaf@gmail.com
                  </strong>
                </span>
              </a>

              <div className="public-mobile-menu__contact">
                <span className="public-mobile-menu__contact-icon public-mobile-menu__contact-icon--blue">
                  <FiMapPin aria-hidden="true" />
                </span>

                <span>
                  <small>Sede</small>
                  <strong>
                    Via Roma 69, Pianopoli
                  </strong>
                </span>
              </div>
            </div>

            <div className="public-mobile-menu__bottom">
              <NavLink
                to="/login"
                onClick={chiudiMenu}
                className="public-mobile-menu__reserved"
                tabIndex={menuAperto ? 0 : -1}
              >
                <FiUser aria-hidden="true" />
                <span>Area riservata</span>
              </NavLink>

              <div
                className="public-mobile-menu__languages"
                role="group"
                aria-label="Selezione lingua"
              >
                <span className="public-mobile-menu__languages-label">
                  Lingua
                </span>

                {(["IT", "EN"] as const).map(
                  (opzione, indice) => (
                    <span key={opzione}>
                      {indice > 0 && (
                        <span
                          className="public-mobile-menu__language-separator"
                          aria-hidden="true"
                        >
                          /
                        </span>
                      )}

                      <button
                        type="button"
                        className={`public-mobile-menu__language ${
                          lingua === opzione
                            ? "is-active"
                            : ""
                        }`}
                        onClick={() =>
                          setLingua(opzione)
                        }
                        aria-pressed={
                          lingua === opzione
                        }
                        tabIndex={
                          menuAperto ? 0 : -1
                        }
                      >
                        {opzione}
                      </button>
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default PublicNavbar;