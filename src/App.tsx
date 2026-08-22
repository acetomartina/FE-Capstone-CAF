import {
  Route,
  Routes,
} from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";

import HomePage from "./pages/public/HomePage";
import ServiziPage from "./pages/public/ServiziPage";
import LoginPage from "./pages/public/LoginPage";
import NotFoundPage from "./pages/public/NotFoundPage";
import RecuperoPasswordPage from "./pages/public/RecuperoPasswordPage";
import ResetPasswordPage from "./pages/public/ResetPasswordPage";

import DashboardPage from "./pages/private/DashboardPage";
import ClientiPage from "./pages/private/ClientiPage";
import PratichePage from "./pages/private/PratichePage";
import DettaglioPraticaPage from "./pages/private/DettaglioPraticaPage";
import AreaAmministrazionePage from "./pages/private/AreaAmministrazionePage";
import DettaglioServizioPage from "./pages/private/DettaglioServizioPage";
import AreaClientePage from "./pages/private/AreaClientePage";
import AreaDipendentePage from "./pages/private/AreaDipendentePage";
import AreaRiservataPage from "./pages/private/AreaRiservataPage";
import ConfigurazioneServiziPage from "./pages/private/ConfigurazioneServiziPage";
import DettaglioServizioPublicPage from "./pages/public/DettaglioServizioPublicPage";

import RottaProtetta from "./features/auth/components/RottaProtetta";

import {
  useRipristinoSessione,
} from "./features/auth/useRipristinoSessione";

import {
  RUOLI_AMMINISTRAZIONE,
  RUOLI_CLIENTE,
  RUOLI_DIPENDENTE,
} from "./features/auth/percorsiRuolo";

const App = () => {
  useRipristinoSessione();

  return (
    <Routes>
      {/* =====================================================
          AREA PUBBLICA
          ===================================================== */}

      <Route element={<PublicLayout />}>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/servizi"
          element={<ServiziPage />}
        />

        <Route
  path="/servizi/:slug"
  element={<DettaglioServizioPublicPage />}
/>

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/recupera-password"
          element={
            <RecuperoPasswordPage />
          }
        />

        <Route
          path="/reset-password/:token"
          element={
            <ResetPasswordPage />
          }
        />

        <Route
          path="/reset-password"
          element={
            <ResetPasswordPage />
          }
        />
      </Route>

      {/* =====================================================
          AREA RISERVATA GENERICA
          ===================================================== */}

      <Route
        element={
          <RottaProtetta />
        }
      >
        <Route
          path="/area-riservata"
          element={
            <AreaRiservataPage />
          }
        />
      </Route>

      {/* =====================================================
          AREA CLIENTE
          ===================================================== */}

      <Route
        element={
          <RottaProtetta
            ruoliAmmessi={
              RUOLI_CLIENTE
            }
          />
        }
      >
        <Route
          element={
            <PrivateLayout />
          }
        >
          <Route
            path="/cliente"
            element={
              <AreaClientePage />
            }
          />
        </Route>
      </Route>

      {/* =====================================================
          AREA DIPENDENTE
          ===================================================== */}

      <Route
        element={
          <RottaProtetta
            ruoliAmmessi={
              RUOLI_DIPENDENTE
            }
          />
        }
      >
        <Route
          element={
            <PrivateLayout />
          }
        >
          <Route
            path="/dipendente"
            element={
              <AreaDipendentePage />
            }
          />
        </Route>
      </Route>

      {/* =====================================================
          AREA OPERATIVA
          ADMIN + DIPENDENTI
          ===================================================== */}

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
        <Route
          element={
            <PrivateLayout />
          }
        >
          <Route
            path="/clienti"
            element={
              <ClientiPage />
            }
          />

          <Route
            path="/pratiche"
            element={
              <PratichePage />
            }
          />

          <Route
            path="/pratiche/:id"
            element={
              <DettaglioPraticaPage />
            }
          />
        </Route>
      </Route>

      {/* =====================================================
          AMMINISTRAZIONE
          ===================================================== */}

      <Route
        element={
          <RottaProtetta
            ruoliAmmessi={
              RUOLI_AMMINISTRAZIONE
            }
          />
        }
      >
        <Route
          element={
            <PrivateLayout />
          }
        >
          <Route
            path="/dashboard"
            element={
              <DashboardPage />
            }
          />

          <Route
            path="/amministrazione"
            element={
              <AreaAmministrazionePage />
            }
          />

          <Route
            path="/amministrazione/servizi"
            element={
              <ConfigurazioneServiziPage />
            }
          />

          <Route
            path="/amministrazione/servizi/:id"
            element={
              <DettaglioServizioPage />
            }
          />
        </Route>
      </Route>

      {/* =====================================================
          404
          ===================================================== */}

      <Route
        path="*"
        element={
          <NotFoundPage />
        }
      />
    </Routes>
  );
};

export default App;