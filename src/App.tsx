import { Route, Routes } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import RecuperoPasswordPage from "./pages/RecuperoPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import AreaAmministrazionePage from "./pages/area-riservata/AreaAmministrazionePage";
import AreaClientePage from "./pages/area-riservata/AreaClientePage";
import AreaDipendentePage from "./pages/area-riservata/AreaDipendentePage";

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

        {/* Ancora senza guardia: la protezione per ruolo arriva subito
            dopo, insieme al login collegato. */}
        <Route path="/cliente" element={<AreaClientePage />} />
        <Route path="/dipendente" element={<AreaDipendentePage />} />
        <Route
          path="/amministrazione"
          element={<AreaAmministrazionePage />}
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;