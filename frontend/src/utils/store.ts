import { create } from 'zustand';
import { Wallet } from '../types/wallet';
import { getWallet } from '../api/wallet/getWallet';

interface WalletStore {
  wallet: Wallet | null;
  setWallet: (wallet: Wallet | null) => void;
  fetchWallet: () => Promise<void>;
}

const useWalletStore = create<WalletStore>((set) => ({
  wallet: null,
  setWallet: (wallet) => set({ wallet }),
  fetchWallet: async () => {
    const wallet = await getWallet();
    set({ wallet });
  },
}));

export default useWalletStore;
