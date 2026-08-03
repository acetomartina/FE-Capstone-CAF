import { Route, Routes } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import RecuperoPasswordPage from "./pages/RecuperoPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import RottaProtetta from "./features/auth/components/RottaProtetta";
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
  return (
    <Routes>
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
        {/* Link troncato dal client di posta: meglio il messaggio
            "richiedine uno nuovo" che un 404 senza indicazioni. */}
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Ingresso unico: basta essere autenticati, al resto pensa lo
            smistamento per ruolo. */}
        <Route element={<RottaProtetta />}>
          <Route
            path="/area-riservata"
            element={<AreaRiservataPage />}
          />
        </Route>

        {/* Un'area per ruolo: chi sbaglia porta viene portato alla sua. */}
        <Route element={<RottaProtetta ruoliAmmessi={RUOLI_CLIENTE} />}>
          <Route path="/cliente" element={<AreaClientePage />} />
        </Route>

        <Route element={<RottaProtetta ruoliAmmessi={RUOLI_DIPENDENTE} />}>
          <Route path="/dipendente" element={<AreaDipendentePage />} />
        </Route>

        <Route
          element={<RottaProtetta ruoliAmmessi={RUOLI_AMMINISTRAZIONE} />}
        >
          <Route
            path="/amministrazione"
            element={<AreaAmministrazionePage />}
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;