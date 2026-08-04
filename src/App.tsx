import { Route, Routes } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import RecuperoPasswordPage from "./pages/RecuperoPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";

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
      </Route>

      {/* Ingresso unico: reindirizza e basta, quindi resta fuori dal
          layout privato per non far comparire la sidebar per un istante. */}
      <Route element={<RottaProtetta />}>
        <Route path="/area-riservata" element={<AreaRiservataPage />} />
      </Route>

      {/* Un'area per ruolo, dentro il layout con la sidebar: chi sbaglia
          porta viene portato alla sua. */}
      <Route element={<RottaProtetta ruoliAmmessi={RUOLI_CLIENTE} />}>
        <Route element={<PrivateLayout />}>
          <Route path="/cliente" element={<AreaClientePage />} />
        </Route>
      </Route>

      <Route element={<RottaProtetta ruoliAmmessi={RUOLI_DIPENDENTE} />}>
        <Route element={<PrivateLayout />}>
          <Route path="/dipendente" element={<AreaDipendentePage />} />
        </Route>
      </Route>

      <Route element={<RottaProtetta ruoliAmmessi={RUOLI_AMMINISTRAZIONE} />}>
        <Route element={<PrivateLayout />}>
          <Route
            path="/amministrazione"
            element={<AreaAmministrazionePage />}
          />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
