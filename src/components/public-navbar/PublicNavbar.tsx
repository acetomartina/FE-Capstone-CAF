import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiPhone, FiUser, FiX } from "react-icons/fi";

import logoCafFapi from "../../assets/logo.svg";
import "./PublicNavbar.css";

const PublicNavbar = () => {
  const [menuAperto, setMenuAperto] = useState(false);

  const chiudiMenu = () => {
    setMenuAperto(false);
  };

  useEffect(() => {
    if (!menuAperto) return;

    const gestisciTasto = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        setMenuAperto(false);
      }
    };

    document.addEventListener("keydown", gestisciTasto);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", gestisciTasto);
      document.body.style.overflow = "";
    };
  }, [menuAperto]);

  return (
    <header className="public-navbar">
      <div className="public-navbar__container">
        <NavLink
          to="/"
          className="public-navbar__brand"
          onClick={chiudiMenu}
          aria-label="CAF FAPI Pianopoli - Home"
        >
          <img
            src={logoCafFapi}
            alt=""
            className="public-navbar__logo"
            aria-hidden="true"
          />

          <div className="public-navbar__office">
            <span>SEDE DI</span>
            <strong>Pianopoli</strong>
          </div>
        </NavLink>

        <button
          type="button"
          className="public-navbar__menu-button"
          onClick={() => setMenuAperto((aperto) => !aperto)}
          aria-label={menuAperto ? "Chiudi menu" : "Apri menu"}
          aria-expanded={menuAperto}
          aria-controls="public-navbar-content"
        >
          {menuAperto ? <FiX /> : <FiMenu />}
        </button>

        <div
          id="public-navbar-content"
          className={`public-navbar__content ${
            menuAperto ? "public-navbar__content--open" : ""
          }`}
        >
          <nav
            className="public-navbar__links"
            aria-label="Navigazione principale"
          >
            <NavLink to="/" onClick={chiudiMenu}>
              Home
            </NavLink>

            <NavLink to="/servizi" onClick={chiudiMenu}>
              Servizi
            </NavLink>

            <NavLink to="/chi-siamo" onClick={chiudiMenu}>
              Chi siamo
            </NavLink>

            <NavLink to="/contatti" onClick={chiudiMenu}>
              Contatti
            </NavLink>
          </nav>

          <div className="public-navbar__actions">
            <a
              href="tel:+393779609155"
              className="public-navbar__phone"
              onClick={chiudiMenu}
              aria-label="Chiama il CAF FAPI Pianopoli"
            >
              <FiPhone />
              <span>377 960 9155</span>
            </a>

            <div
              className="public-navbar__languages"
              aria-label="Selezione lingua"
            >
              <button
                type="button"
                className="is-active"
                onClick={chiudiMenu}
              >
                IT
              </button>

              <button type="button" onClick={chiudiMenu}>
                EN
              </button>
            </div>

            <NavLink
              to="/login"
              className="public-navbar__reserved"
              onClick={chiudiMenu}
            >
              <FiUser />
              <span>Area riservata</span>
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;