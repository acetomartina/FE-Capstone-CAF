import { Route, Routes } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";

import HomePage from "./pages/public/HomePage";
import LoginPage from "./pages/public/LoginPage";
import NotFoundPage from "./pages/public/NotFoundPage";
import RecuperoPasswordPage from "./pages/public/RecuperoPasswordPage";
import ResetPasswordPage from "./pages/public/ResetPasswordPage";

import DashboardPage from "./pages/private/DashboardPage";
import ClientiPage from "./pages/private/ClientiPage";
import PratichePage from "./pages/private/PratichePage";
import DettaglioPraticaPage from "./pages/private/DettaglioPraticaPage";
import AreaAmministrazionePage from "./pages/private/AreaAmministrazionePage";
import AreaClientePage from "./pages/private/AreaClientePage";
import AreaDipendentePage from "./pages/private/AreaDipendentePage";
import AreaRiservataPage from "./pages/private/AreaRiservataPage";

import RottaProtetta from "./features/auth/components/RottaProtetta";
import { useRipristinoSessione } from "./features/auth/useRipristinoSessione";

import {
  RUOLI_AMMINISTRAZIONE,
  RUOLI_CLIENTE,
  RUOLI_DIPENDENTE,
} from "./features/auth/percorsiRuolo";

const App = () => {
  useRipristinoSessione();

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

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

      <Route element={<RottaProtetta />}>
        <Route
          path="/area-riservata"
          element={<AreaRiservataPage />}
        />
      </Route>

      <Route
        element={
          <RottaProtetta
            ruoliAmmessi={
              RUOLI_CLIENTE
            }
          />
        }
      >
        <Route element={<PrivateLayout />}>
          <Route
            path="/cliente"
            element={<AreaClientePage />}
          />
        </Route>
      </Route>

      <Route
        element={
          <RottaProtetta
            ruoliAmmessi={
              RUOLI_DIPENDENTE
            }
          />
        }
      >
        <Route element={<PrivateLayout />}>
          <Route
            path="/dipendente"
            element={<AreaDipendentePage />}
          />
        </Route>
      </Route>

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

          <Route
            path="/pratiche"
            element={<PratichePage />}
          />

          <Route
            path="/pratiche/:id"
            element={<DettaglioPraticaPage />}
          />
        </Route>
      </Route>

      <Route
        element={
          <RottaProtetta
            ruoliAmmessi={
              RUOLI_AMMINISTRAZIONE
            }
          />
        }
      >
        <Route element={<PrivateLayout />}>
          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/amministrazione"
            element={
              <AreaAmministrazionePage />
            }
          />
        </Route>
      </Route>

      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Routes>
  );
};

export default App;