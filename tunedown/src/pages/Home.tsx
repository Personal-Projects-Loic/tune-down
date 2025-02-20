import WalletGenerator from "../components/Wallet/WalletGenerator";
import WalletValidator from "../components/Wallet/WalletValidator";
import WalletTransaction from "../components/Wallet/WalletTransaction";
import DeconnectionButton from "../components/OAuth/DeconnectionButton";
import GetAccount from "../components/account/getAccount";
import "../App.css";
import WalletCreateNFT from "../components/Wallet/WalletCreateNFT";
import WalletGetNfts from "../components/Wallet/WalletGetNFTs";
import NFTOffers from "../components/Wallet/NFTOffers";
import NFTSellOfferRequest from "../components/Wallet/NFTSellOfferRequest";

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
        <WalletGetNfts />
      </div>
      <div>
        <NFTOffers />
      </div>
      <div>
        <NFTSellOfferRequest />
      </div>
      <div>
        <DeconnectionButton />
      </div>
      </div>
    </div>
  );
}

export default Home;
