import Wallet from "./pages/Home";
import Login from "./components/OAuth/Login";
import Signup from "./components/OAuth/SignUp";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Wallet />
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
