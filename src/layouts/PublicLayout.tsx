import { Outlet } from "react-router-dom";

import PublicFooter from "../components/layout/PublicFooter/PublicFooter";
import PublicNavbar from "../components/layout/PublicNavbar/PublicNavbar";

import "./PublicLayout.css";

const PublicLayout = () => {
  return (
    <div className="public-layout">
      <PublicNavbar />

      <main className="public-layout__content">
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  );
};

export default PublicLayout;