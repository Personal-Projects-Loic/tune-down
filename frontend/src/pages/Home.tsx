import WalletValidator from "../components/Wallet/WalletValidator";
import WalletTransaction from "../components/Wallet/WalletTransaction";
import DeconnectionButton from "../components/auth/DeconnectionButton";
import GetAccount from "../components/account/getAccount";
import "../App.css";
import WalletCreateNFT from "../components/Wallet/WalletCreateNFT";
import WalletGetNfts from "../components/Wallet/WalletGetNFTs";
import NFTOffers from "../components/Wallet/NFTOffers";
import NFTSellOfferRequest from "../components/Wallet/NFTSellOfferRequest";

function Home() {
  return (
    <div className="row">
      <div>
        <WalletValidator />
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
      <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
        <DeconnectionButton />
      </div>
    </div>
  );
}

export default Home;
