import { Outlet } from "react-router-dom";

import PublicNavbar from "../components/public-navbar/PublicNavbar";

const PublicLayout = () => {
  return (
    <>
      <PublicNavbar />

      <main className="public-layout">
        <Outlet />
      </main>
    </>
  );
};

export default PublicLayout;