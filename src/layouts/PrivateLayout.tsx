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
import { NavLink, Outlet } from "react-router-dom";

import logo from "../assets/caf-fapi-logo-vettoriale.png";
import "./PrivateLayout.css";

const PrivateLayout = () => {
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
      icon: <FiFolder />,
    },
    {
      label: "Documenti",
      path: "/documenti",
      icon: <FiFileText />,
    },
    {
      label: "Scadenze",
      path: "/scadenze",
      icon: <FiCalendar />,
    },
  ];

  return (
    <div className="private-layout">
      <aside className="private-sidebar">
        <div className="private-sidebar__top">
          <NavLink
            to="/dashboard"
            className="private-sidebar__brand"
            aria-label="Vai alla dashboard"
          >
            <img src={logo} alt="CAF FAPI Pianopoli" />
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
                    isActive ? "private-sidebar__link--active" : ""
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
          >
            <FiLogOut />
            <span>Esci</span>
          </button>
        </div>
      </aside>

      <div className="private-layout__content">
        <header className="private-header">
          <div className="private-header__welcome">
            <strong>Buongiorno, Martina</strong>
            <span>Ecco cosa succede oggi nel tuo CAF.</span>
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
                MA
              </span>

              <span className="private-header__profile-info">
                <strong>Martina Aceto</strong>
                <small>Super Admin</small>
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