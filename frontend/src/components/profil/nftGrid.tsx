import {
  Title,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { NftCard } from "../../components/nfts/nftCard";
import { Nft } from "../../types/nft";
import { Wallet } from "../../types/wallet";

const NftGrid: React.FC<{ wallet: Wallet | null, nftList: Nft[]}> = ({ wallet, nftList }) => {
  return (
    <>
    {wallet ? (
      <>
        <Title order={3}>Mes Nft</Title>
        <SimpleGrid cols={6} spacing="xl">
          {nftList.map((nft, index) => (
            <NftCard key={index} nft={nft} wallet={wallet}/>
          ))}
        </SimpleGrid>
      </>
    ) : (
      <Text></Text>
    )}
    </>
  );
};

export default NftGrid;