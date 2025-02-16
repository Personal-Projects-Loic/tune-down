import WalletGenerator from "../components/Wallet/WalletGenerator";
import WalletValidator from "../components/Wallet/WalletValidator";
import WalletTransaction from "../components/Wallet/WalletTransaction";
import DeconnectionButton from "../components/OAuth/DeconnectionButton";
import GetAccount from "../components/account/getAccount";
import "../App.css";
import WalletCreateNFT from "../components/Wallet/WalletCreateNFT";

function Home() {
  return (
    <div className="row">
      <div className="column">
      <div>
        <WalletValidator />
      </div>
      <div>
        <WalletGenerator />
      </div>
      <div>
        <GetAccount />
      </div>
      <div>
        <WalletTransaction />
      </div>
      <div>
        <DeconnectionButton />
      </div>
      </div>
      <div className="column">
      <div>
        <WalletValidator />
      </div>
      <div>
        <WalletGenerator />
      </div>
      <div>
        <GetAccount />
      </div>
      <div>
        <WalletTransaction />
      </div>
      <div>
        <WalletCreateNFT />
      </div>
      <div>
        <DeconnectionButton />
      </div>
      </div>
    </div>
  );
}

export default Home;
