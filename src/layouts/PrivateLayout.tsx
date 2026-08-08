import {
  FiBell,
  FiCalendar,
  FiFileText,
  FiFolder,
  FiGrid,
  FiLogOut,
  FiSettings,
  FiUsers,
} from "react-icons/fi";
import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import type { Ruolo } from "../features/auth/authTypes";
import { tokenService } from "../services/tokenService";

import logo from "../assets/logo.svg";
import "./PrivateLayout.css";

const ETICHETTE_RUOLO: Record<Ruolo, string> = {
  SUPER_ADMIN: "Super amministratore",
  ADMIN: "Amministratore",
  USER: "Dipendente",
  CLIENTE: "Cliente",
};

const PrivateLayout = () => {
  const utente = useAppSelector(
    (state) => state.auth.utente
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const menuPrincipale = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <FiGrid />,
    },
    {
      label: "Clienti",
      path: "/clienti",
      icon: <FiUsers />,
    },
    {
      label: "Pratiche",
      path: "/pratiche",
      icon: <FiFileText />,
    },
    {
      label: "Documenti",
      path: "/documenti",
      icon: <FiFolder />,
    },
    {
      label: "Scadenze",
      path: "/scadenze",
      icon: <FiCalendar />,
    },
  ];

  const esci = () => {
    tokenService.rimuoviToken();
    dispatch(logout());
    navigate("/login");
  };

  const iniziali = utente
    ? `${utente.nome.charAt(0)}${utente.cognome.charAt(0)}`.toUpperCase()
    : "—";

  return (
    <div className="private-layout">
      <aside className="private-sidebar">
        <div>
          <NavLink
            to="/dashboard"
            className="private-sidebar__brand"
          >
            <img
              src={logo}
              alt="CAF FAPI Pianopoli"
            />
          </NavLink>

          <nav className="private-sidebar__navigation">
            <span className="private-sidebar__section-label">
              Menu principale
            </span>

            {menuPrincipale.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `private-sidebar__link ${
                    isActive
                      ? "private-sidebar__link--active"
                      : ""
                  }`
                }
              >
                <span className="private-sidebar__link-icon">
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="private-sidebar__bottom">
          <NavLink
            to="/impostazioni"
            className="private-sidebar__link"
          >
            <span className="private-sidebar__link-icon">
              <FiSettings />
            </span>

            <span>Impostazioni</span>
          </NavLink>

          <button
            type="button"
            className="private-sidebar__logout"
            onClick={esci}
          >
            <FiLogOut />
            <span>Esci</span>
          </button>
        </div>
      </aside>

      <div className="private-layout__content">
        <header className="private-header">
          <div className="private-header__welcome">
            <strong>
              Buongiorno
              {utente ? `, ${utente.nome}` : ""}
            </strong>

            <span>
              Ecco cosa succede oggi nel tuo CAF.
            </span>
          </div>

          <div className="private-header__actions">
            <button
              type="button"
              className="private-header__notification"
              aria-label="Notifiche"
            >
              <FiBell />
              <span />
            </button>

            <div className="private-header__divider" />

            <button
              type="button"
              className="private-header__profile"
            >
              <span className="private-header__avatar">
                {iniziali}
              </span>

              <span className="private-header__profile-info">
                <strong>
                  {utente
                    ? `${utente.nome} ${utente.cognome}`
                    : "Utente"}
                </strong>

                <small>
                  {utente
                    ? ETICHETTE_RUOLO[utente.ruolo]
                    : ""}
                </small>
              </span>
            </button>
          </div>
        </header>

        <main className="private-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PrivateLayout;