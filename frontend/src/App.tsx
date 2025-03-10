import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Wallet from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import NewHome from "./pages/(protected)/home";
import {NftPage} from "./pages/(protected)/nftPage";
import Profil from "./pages/(protected)/profil";
import CreateNft from "./pages/(protected)/createNft";
import OwnerNftPage from "./pages/(protected)/ownerNftPage";
import PrivateRoute from "./components/PrivateRoute";
//import "./App.css";
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import Layout from "./components/layout";

const protectedRoutes = [
  { path: "/", element: <Wallet /> },
  { path: "/profil", element: <Profil /> },
  { path: "/home", element: <NewHome /> },
  { path: "/nft/:id", element: <NftPage /> },
  { path: "/new-nft", element: <CreateNft /> },
  { path: "/my-nft/:id", element: <OwnerNftPage /> },
];

const publicRoutes = [
  { path: "/login", element: <Login /> },
  { path: "/sign-up", element: <Signup /> },
];

const App: React.FC = () => {
  return (
    <MantineProvider>
      <Notifications />
      <Router>
        <div>
          <Routes>
            {protectedRoutes.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={
                  <PrivateRoute>
                    <Layout>
                      {element}
                    </Layout>
                  </PrivateRoute>
                }
              />
            ))}
            {publicRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
            ))}
          </Routes>
        </div>
      </Router>
    </MantineProvider>
  );
};

export default App;
