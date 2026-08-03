import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FiMail, FiMapPin, FiPhone, FiUser } from "react-icons/fi";

import logoCafFapi from "../../assets/logo.svg";
import "./PublicNavbar.css";

const PublicNavbar = () => {
  return (
    <Navbar
      expand="lg"
      sticky="top"
      className="public-navbar bg-white border-bottom py-0"
    >
      <Container fluid="xl" className="public-navbar__container">
        <Navbar.Brand
          as={NavLink}
          to="/"
          className="d-flex align-items-center gap-3 m-0 py-0"
        >
          <img
            src={logoCafFapi}
            alt="CAF FAPI"
            className="public-navbar__logo"
          />

          <div className="public-navbar__office d-none d-xl-flex flex-column border-start ps-3">
            <span>SEDE DI</span>
            <strong>Pianopoli</strong>
          </div>
        </Navbar.Brand>

        {/* Sotto lg queste due azioni restano fuori dal menu: chiamare la
            sede e accedere sono le cose che si cercano davvero da telefono,
            e dietro l'hamburger costerebbero due tap. */}
        <div className="public-navbar__actions d-flex d-lg-none align-items-center">
          <a
            href="tel:+393779609155"
            className="public-navbar__phone public-navbar__phone--compatto d-flex align-items-center justify-content-center gap-2 text-decoration-none"
            aria-label="Chiama la sede: 377 960 9155"
          >
            <FiPhone />
          </a>

          <NavLink
            to="/login"
            className="public-navbar__reserved public-navbar__reserved--compatto d-flex align-items-center justify-content-center gap-2"
            aria-label="Area riservata"
          >
            <FiUser />
            <span className="d-none d-sm-inline">Area riservata</span>
          </NavLink>

          <Navbar.Toggle
            aria-controls="public-navbar-menu"
            className="shadow-none"
          />
        </div>

        <Navbar.Offcanvas
          id="public-navbar-menu"
          placement="end"
          aria-labelledby="public-navbar-title"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="public-navbar-title">
              CAF FAPI Pianopoli
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center">
            <Nav className="mx-lg-auto gap-lg-4">
              <NavLink to="/" className="nav-link">
                Home
              </NavLink>

              <NavLink to="/servizi" className="nav-link">
                Servizi
              </NavLink>

              <NavLink to="/chi-siamo" className="nav-link">
                Chi siamo
              </NavLink>

              <NavLink to="/contatti" className="nav-link">
                Contatti
              </NavLink>
            </Nav>

            {/* Il menu a scomparsa esiste solo sotto lg: tanto vale usarlo
                per i recapiti della sede, invece di lasciarlo mezzo vuoto. */}
            <div className="public-navbar__contatti d-lg-none">
              <span className="public-navbar__contatti-titolo">
                Contatti
              </span>

              <a href="tel:+393779609155">
                <FiPhone />
                377 960 9155
              </a>

              <a href="mailto:info@caf-fapi-pianopoli.it">
                <FiMail />
                info@caf-fapi-pianopoli.it
              </a>

              <span className="public-navbar__contatti-luogo">
                <FiMapPin />
                Pianopoli
              </span>
            </div>

            <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-3 mt-4 mt-lg-0">
              {/* Sotto lg vivono fuori dal menu: qui servono solo da lg
                  in su, dove l'offcanvas e' una barra orizzontale. */}
              <a
                href="tel:+393779609155"
                className="public-navbar__phone d-none d-lg-flex align-items-center justify-content-center gap-2 text-decoration-none"
              >
                <FiPhone />
                <span>377 960 9155</span>
              </a>

              <div
                className="btn-group public-navbar__languages"
                role="group"
                aria-label="Selezione lingua"
              >
                <button
                  type="button"
                  className="btn public-navbar__language is-active"
                >
                  IT
                </button>

                <button
                  type="button"
                  className="btn public-navbar__language"
                >
                  EN
                </button>
              </div>

              <NavLink
                to="/login"
                className="public-navbar__reserved d-none d-lg-flex align-items-center justify-content-center gap-2"
              >
                <FiUser />
                <span>Area riservata</span>
              </NavLink>
            </div>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default PublicNavbar;