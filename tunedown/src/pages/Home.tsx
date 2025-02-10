import WalletGenerator from "../components/Wallet/WalletGenerator";
import WalletValidator from "../components/Wallet/WalletValidator";
import DeconnectionButton from "../components/OAuth/DeconnectionButton";
import "../App.css";

function Home() {
  return (
    <div className="App">
      <div>
        <WalletValidator />
      </div>
      <div>
        <WalletGenerator />
      </div>
      <div>
        <DeconnectionButton />
      </div>
    </div>
  );
}

export default Home;
