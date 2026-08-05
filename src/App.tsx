import { Route, Routes } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ClientiPage from "./pages/ClientiPage";
import NotFoundPage from "./pages/NotFoundPage";
import RecuperoPasswordPage from "./pages/RecuperoPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import RottaProtetta from "./features/auth/components/RottaProtetta";
import { useRipristinoSessione } from "./features/auth/useRipristinoSessione";
import {
  RUOLI_AMMINISTRAZIONE,
  RUOLI_CLIENTE,
  RUOLI_DIPENDENTE,
} from "./features/auth/percorsiRuolo";

import AreaAmministrazionePage from "./pages/area-riservata/AreaAmministrazionePage";
import AreaClientePage from "./pages/area-riservata/AreaClientePage";
import AreaDipendentePage from "./pages/area-riservata/AreaDipendentePage";
import AreaRiservataPage from "./pages/area-riservata/AreaRiservataPage";

const App = () => {
  useRipristinoSessione();

  return (
    <Routes>
      {/* --------------------- */}
      {/* Area pubblica */}
      {/* --------------------- */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/recupera-password"
          element={<RecuperoPasswordPage />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPasswordPage />}
        />

        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />
      </Route>

      {/* Redirect automatico dopo il login */}
      <Route element={<RottaProtetta />}>
        <Route
          path="/area-riservata"
          element={<AreaRiservataPage />}
        />
      </Route>

      {/* --------------------- */}
      {/* Cliente */}
      {/* --------------------- */}
      <Route element={<RottaProtetta ruoliAmmessi={RUOLI_CLIENTE} />}>
        <Route element={<PrivateLayout />}>
          <Route
            path="/cliente"
            element={<AreaClientePage />}
          />
        </Route>
      </Route>

      {/* --------------------- */}
      {/* Dipendente */}
      {/* --------------------- */}
      <Route element={<RottaProtetta ruoliAmmessi={RUOLI_DIPENDENTE} />}>
        <Route element={<PrivateLayout />}>
          <Route
            path="/dipendente"
            element={<AreaDipendentePage />}
          />
        </Route>
      </Route>

      {/* --------------------- */}
      {/* Amministrazione */}
      {/* --------------------- */}
      <Route
        element={
          <RottaProtetta
            ruoliAmmessi={[
              ...RUOLI_AMMINISTRAZIONE,
              ...RUOLI_DIPENDENTE,
            ]}
          />
        }
      >
        <Route element={<PrivateLayout />}>
          <Route
            path="/clienti"
            element={<ClientiPage />}
          />
        </Route>
      </Route>

      <Route element={<RottaProtetta ruoliAmmessi={RUOLI_AMMINISTRAZIONE} />}>
        <Route element={<PrivateLayout />}>
          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/amministrazione"
            element={<AreaAmministrazionePage />}
          />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;