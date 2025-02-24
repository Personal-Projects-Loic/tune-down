import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Wallet from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import NewHome from "./pages/(protected)/home";
import TestNftPage from "./pages/(protected)/nftPage";
import Profil from "./pages/(protected)/profil";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";

const protectedRoutes = [
  { path: "/", element: <Wallet /> },
  { path: "/profil", element: <Profil /> },
  { path: "/home", element: <NewHome /> },
  { path: "/nft/:id", element: <TestNftPage /> },
];

const publicRoutes = [
  { path: "/login", element: <Login /> },
  { path: "/sign-up", element: <Signup /> },
];

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {protectedRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={<PrivateRoute>{element}</PrivateRoute>}
            />
          ))}

          {publicRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
