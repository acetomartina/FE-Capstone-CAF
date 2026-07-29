import { Route, Routes } from "react-router-dom";

const AppRouter = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<h1>CAF FAPI Pianopoli</h1>}
      />
    </Routes>
  );
};

export default AppRouter;