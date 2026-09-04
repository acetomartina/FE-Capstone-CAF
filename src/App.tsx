import {
  Route,
  Routes,
} from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";

import HomePage from "./pages/public/HomePage";
import ServiziPage from "./pages/public/ServiziPage";
import ChiSiamoPage from "./pages/public/ChiSiamoPage";
import ContattiPage from "./pages/public/ContattiPage";
import LoginPage from "./pages/public/LoginPage";
import NotFoundPage from "./pages/public/NotFoundPage";
import RecuperoPasswordPage from "./pages/public/RecuperoPasswordPage";
import ResetPasswordPage from "./pages/public/ResetPasswordPage";
/* Area cliente sospesa: consegna limitata a sito pubblico e area amministrativa.
import AttivaAccountPage from "./pages/public/AttivaAccountPage";
*/
import DettaglioServizioPublicPage from "./pages/public/DettaglioServizioPublicPage";
import PrivacyPolicyPage from "./pages/public/PrivacyPolicyPage";
import CookiePolicyPage from "./pages/public/CookiePolicyPage";

import DashboardPage from "./pages/private/DashboardPage";
import ClientiPage from "./pages/private/ClientiPage";
import DettaglioClientePage from "./pages/private/DettaglioClientePage";
import PratichePage from "./pages/private/PratichePage";
import DettaglioPraticaPage from "./pages/private/DettaglioPraticaPage";
/* Area cliente sospesa.
import DettaglioPraticaClientePage from "./pages/private/DettaglioPraticaClientePage";
*/
import DocumentiPage from "./pages/private/DocumentiPage";
import AgendaPage from "./pages/private/AgendaPage";
import AreaAmministrazionePage from "./pages/private/AreaAmministrazionePage";
import ConfigurazioneServiziPage from "./pages/private/ConfigurazioneServiziPage";
import DettaglioServizioPage from "./pages/private/DettaglioServizioPage";
import ConfigurazioneTesseramentoPage from "./pages/private/ConfigurazioneTesseramentoPage";
/* Area cliente sospesa.
import AreaClientePage from "./pages/private/AreaClientePage";
*/
import AreaDipendentePage from "./pages/private/AreaDipendentePage";
import AreaRiservataPage from "./pages/private/AreaRiservataPage";

import RottaProtetta from "./features/auth/components/RottaProtetta";

import {
  useRipristinoSessione,
} from "./features/auth/useRipristinoSessione";

import {
  RUOLI_AMMINISTRAZIONE,
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
          path="/servizi"
          element={<ServiziPage />}
        />

        <Route
          path="/servizi/:slug"
          element={
            <DettaglioServizioPublicPage />
          }
        />

        <Route
          path="/chi-siamo"
          element={<ChiSiamoPage />}
        />

        <Route
          path="/contatti"
          element={<ContattiPage />}
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

{/* ATTIVAZIONE ACCOUNT CLIENTE SOSPESA.
        <Route
          path="/attiva-account/:token"
          element={
            <AttivaAccountPage />
          }
        />

        <Route
          path="/attiva-account"
          element={
            <AttivaAccountPage />
          }
        />
      */}

        <Route
          path="/privacy"
          element={<PrivacyPolicyPage />}
        />

        <Route
          path="/cookie"
          element={<CookiePolicyPage />}
        />
      </Route>

      <Route element={<RottaProtetta />}>
        <Route
          path="/area-riservata"
          element={<AreaRiservataPage />}
        />
      </Route>

{/* AREA CLIENTE SOSPESA — consegna limitata a sito pubblico e area amministrativa.
          Per riattivarla: togliere questo commento e quelli in percorsiRuolo.ts e PrivateLayout.tsx.
      <Route
        element={
          <RottaProtetta
            ruoliAmmessi={RUOLI_CLIENTE}
          />
        }
      >
        <Route element={<PrivateLayout />}>
          <Route
            path="/cliente"
            element={<AreaClientePage />}
          />

          <Route
            path="/cliente/pratiche/:id"
            element={
              <DettaglioPraticaClientePage />
            }
          />
        </Route>
      </Route>
      */}

      <Route
        element={
          <RottaProtetta
            ruoliAmmessi={RUOLI_DIPENDENTE}
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
            path="/clienti/:id"
            element={
              <DettaglioClientePage />
            }
          />

          <Route
            path="/pratiche"
            element={<PratichePage />}
          />

          <Route
            path="/pratiche/:id"
            element={
              <DettaglioPraticaPage />
            }
          />

          <Route
            path="/documenti"
            element={<DocumentiPage />}
          />

          <Route
            path="/agenda"
            element={<AgendaPage />}
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

          <Route
            path="/amministrazione/tesseramento"
            element={
              <ConfigurazioneTesseramentoPage />
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