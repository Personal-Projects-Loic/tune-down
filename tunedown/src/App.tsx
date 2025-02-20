import React from "react";
import Wallet from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AddWallet from "./pages/auth/addWallet";
import CreateWallet from "./pages/auth/createWallet";
import Caca from "./pages/(protected)/home";
import TestNftPage from "./pages/(protected)/nftPage";
import Profil from "./pages/(protected)/profil";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Wallet />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/add-wallet" element={<AddWallet />} />
          <Route path="/create-wallet" element={<CreateWallet />} />
          <Route path="/caca" element={<Caca />} />
          <Route path="/nft/:id" element={<TestNftPage />} />
          <Route path="/profil" element={<Profil />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;
