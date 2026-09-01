import { useEffect, useState } from "react";
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiFolder,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";
import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  useAppDispatch,
  useAppSelector,
} from "../app/hooks";

import { logout } from "../features/auth/authSlice";
import type { Ruolo } from "../features/auth/authTypes";
import { tokenService } from "../services/tokenService";

import logo from "../assets/logo.svg";

import "./PrivateLayout.css";

const CHIAVE_SIDEBAR =
  "caf-fapi-sidebar-collassata";

const ETICHETTE_RUOLO: Record<
  Ruolo,
  string
> = {
  SUPER_ADMIN: "Super amministratore",
  ADMIN: "Amministratore",
  USER: "Dipendente",
  CLIENTE: "Cliente",
};

const PrivateLayout = () => {
  const utente = useAppSelector(
    (state) => state.auth.utente,
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [
    sidebarCollassata,
    setSidebarCollassata,
  ] = useState(() => {
    return (
      localStorage.getItem(
        CHIAVE_SIDEBAR,
      ) === "true"
    );
  });

  const [
    menuMobileAperto,
    setMenuMobileAperto,
  ] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      CHIAVE_SIDEBAR,
      String(sidebarCollassata),
    );
  }, [sidebarCollassata]);

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
      label: "Agenda",
      path: "/agenda",
      icon: <FiCalendar />,
    },
  ];

  const esci = () => {
    tokenService.rimuoviToken();

    dispatch(logout());

    navigate("/login");
  };

  const chiudiMenuMobile = () => {
    setMenuMobileAperto(false);
  };

  const iniziali = utente
    ? `${utente.nome.charAt(
        0,
      )}${utente.cognome.charAt(
        0,
      )}`.toUpperCase()
    : "—";

  return (
    <div
      className={[
        "private-layout",
        sidebarCollassata
          ? "private-layout--sidebar-collapsed"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {menuMobileAperto && (
        <button
          type="button"
          className="private-sidebar-overlay"
          onClick={chiudiMenuMobile}
          aria-label="Chiudi menu"
        />
      )}

      <aside
        className={[
          "private-sidebar",
          menuMobileAperto
            ? "private-sidebar--mobile-open"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div>
          <div className="private-sidebar__brand-row">
            <NavLink
              to="/dashboard"
              className="private-sidebar__brand"
              onClick={chiudiMenuMobile}
            >
              <img
                src={logo}
                alt="CAF FAPI Pianopoli"
              />
            </NavLink>

            <button
              type="button"
              className="private-sidebar__mobile-close"
              onClick={chiudiMenuMobile}
              aria-label="Chiudi menu"
            >
              <FiX />
            </button>
          </div>

          <nav className="private-sidebar__navigation">
            <span className="private-sidebar__section-label">
              Menu principale
            </span>

            {menuPrincipale.map(
              (item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={
                    sidebarCollassata
                      ? item.label
                      : undefined
                  }
                  onClick={
                    chiudiMenuMobile
                  }
                  className={({
                    isActive,
                  }) =>
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

                  <span className="private-sidebar__link-label">
                    {item.label}
                  </span>
                </NavLink>
              ),
            )}
          </nav>
        </div>

        <div className="private-sidebar__bottom">
          {/* ACCOUNT */}

          <div className="private-sidebar__account">
            <span className="private-sidebar__account-avatar">
              {iniziali}
            </span>

            <div className="private-sidebar__account-info">
              <strong>
                {utente
                  ? `${utente.nome} ${utente.cognome}`
                  : "Utente"}
              </strong>

              <small>
                {utente
                  ? ETICHETTE_RUOLO[
                      utente.ruolo
                    ]
                  : ""}
              </small>
            </div>
          </div>

          <NavLink
            to="/profilo"
            title={
              sidebarCollassata
                ? "Profilo"
                : undefined
            }
            onClick={chiudiMenuMobile}
            className="private-sidebar__link"
          >
            <span className="private-sidebar__link-icon">
              <FiUser />
            </span>

            <span className="private-sidebar__link-label">
              Profilo
            </span>
          </NavLink>

          <NavLink
            to="/amministrazione"
            title={
              sidebarCollassata
                ? "Impostazioni"
                : undefined
            }
            onClick={chiudiMenuMobile}
            className="private-sidebar__link"
          >
            <span className="private-sidebar__link-icon">
              <FiSettings />
            </span>

            <span className="private-sidebar__link-label">
              Amministrazione
            </span>
          </NavLink>

          <button
            type="button"
            className="private-sidebar__logout"
            onClick={esci}
            title={
              sidebarCollassata
                ? "Esci"
                : undefined
            }
          >
            <FiLogOut />

            <span className="private-sidebar__link-label">
              Esci
            </span>
          </button>
        </div>

        <button
          type="button"
          className="private-sidebar__collapse"
          onClick={() =>
            setSidebarCollassata(
              (valore) => !valore,
            )
          }
          aria-label={
            sidebarCollassata
              ? "Espandi menu laterale"
              : "Riduci menu laterale"
          }
        >
          {sidebarCollassata ? (
            <FiChevronRight />
          ) : (
            <FiChevronLeft />
          )}
        </button>
      </aside>

      <div className="private-layout__content">
        <button
          type="button"
          className="private-mobile-menu"
          onClick={() =>
            setMenuMobileAperto(true)
          }
          aria-label="Apri menu"
        >
          <FiMenu />
        </button>

        <main className="private-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PrivateLayout;