import { useEffect, useRef, useState } from "react";
import {
  FiBell,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiFolder,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiSearch,
  FiSettings,
  FiUsers,
  FiX,
} from "react-icons/fi";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import type { Ruolo } from "../features/auth/authTypes";
import { tokenService } from "../services/tokenService";

import logo from "../assets/logo.svg";
import "./PrivateLayout.css";

const CHIAVE_SIDEBAR =
  "caf-fapi-sidebar-collassata";

const SOGLIA_SCROLL = 80;
const DIFFERENZA_MINIMA_SCROLL = 8;

const ETICHETTE_RUOLO: Record<Ruolo, string> = {
  SUPER_ADMIN: "Super amministratore",
  ADMIN: "Amministratore",
  USER: "Dipendente",
  CLIENTE: "Cliente",
};

const SEZIONI: Array<{
  path: string;
  titolo: string;
  sottotitolo: string;
}> = [
  {
    path: "/dashboard",
    titolo: "Dashboard",
    sottotitolo: "Area amministrativa",
  },
  {
    path: "/clienti",
    titolo: "Clienti",
    sottotitolo: "Gestione anagrafiche",
  },
  {
    path: "/pratiche",
    titolo: "Pratiche",
    sottotitolo: "Gestione attività",
  },
  {
    path: "/documenti",
    titolo: "Documenti",
    sottotitolo: "Archivio e verifiche",
  },
  {
    path: "/scadenze",
    titolo: "Scadenze",
    sottotitolo: "Agenda e promemoria",
  },
  {
    path: "/impostazioni",
    titolo: "Impostazioni",
    sottotitolo: "Configurazione",
  },
];

const PrivateLayout = () => {
  const utente = useAppSelector(
    (state) => state.auth.utente,
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarCollassata, setSidebarCollassata] =
    useState(() => {
      return (
        localStorage.getItem(CHIAVE_SIDEBAR) ===
        "true"
      );
    });

  const [menuMobileAperto, setMenuMobileAperto] =
    useState(false);

  const [headerVisibile, setHeaderVisibile] =
    useState(true);

  const ultimoScroll = useRef(0);

  useEffect(() => {
    localStorage.setItem(
      CHIAVE_SIDEBAR,
      String(sidebarCollassata),
    );
  }, [sidebarCollassata]);

  useEffect(() => {
    ultimoScroll.current = window.scrollY;

    const gestisciScroll = () => {
      const scrollAttuale = window.scrollY;

      if (scrollAttuale <= SOGLIA_SCROLL) {
        setHeaderVisibile(true);
        ultimoScroll.current = scrollAttuale;
        return;
      }

      const differenza =
        scrollAttuale - ultimoScroll.current;

      if (
        Math.abs(differenza) <
        DIFFERENZA_MINIMA_SCROLL
      ) {
        return;
      }

      setHeaderVisibile(differenza < 0);

      ultimoScroll.current = scrollAttuale;
    };

    window.addEventListener(
      "scroll",
      gestisciScroll,
      { passive: true },
    );

    return () => {
      window.removeEventListener(
        "scroll",
        gestisciScroll,
      );
    };
  }, []);

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

  const sezioneCorrente =
    SEZIONI.find((sezione) =>
      location.pathname.startsWith(
        sezione.path,
      ),
    ) ?? {
      titolo: "Area riservata",
      sottotitolo: "CAF FAPI",
    };

  const esci = () => {
    tokenService.rimuoviToken();
    dispatch(logout());
    navigate("/login");
  };

  const chiudiMenuMobile = () => {
    setMenuMobileAperto(false);
  };

  const iniziali = utente
    ? `${utente.nome.charAt(0)}${utente.cognome.charAt(
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

            {menuPrincipale.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                title={
                  sidebarCollassata
                    ? item.label
                    : undefined
                }
                onClick={chiudiMenuMobile}
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

                <span className="private-sidebar__link-label">
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="private-sidebar__bottom">
          <NavLink
            to="/impostazioni"
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
              Impostazioni
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
        <header
          className={[
            "private-header",
            !headerVisibile
              ? "private-header--hidden"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="private-header__left">
            <button
              type="button"
              className="private-header__mobile-menu"
              onClick={() =>
                setMenuMobileAperto(true)
              }
              aria-label="Apri menu"
            >
              <FiMenu />
            </button>

            <div className="private-header__page">
              <strong>
                {sezioneCorrente.titolo}
              </strong>

              <span>
                {sezioneCorrente.sottotitolo}
              </span>
            </div>
          </div>

          <div className="private-header__actions">
            <button
              type="button"
              className="private-header__action"
              aria-label="Cerca"
            >
              <FiSearch />
            </button>

            <button
              type="button"
              className="private-header__action private-header__notification"
              aria-label="Notifiche"
            >
              <FiBell />
              <span className="private-header__notification-dot" />
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
                    ? ETICHETTE_RUOLO[
                        utente.ruolo
                      ]
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