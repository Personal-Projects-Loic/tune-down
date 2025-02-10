import WalletGenerator from "./components/WalletGenerator";
import WalletValidator from "./components/WalletValidator";
import "./App.css";

function App() {
  return (
    <div className="App">
      <div>
        <WalletValidator />
      </div>
      <div>
        <WalletGenerator />
      </div>
    </div>
  );
}

export default App;
