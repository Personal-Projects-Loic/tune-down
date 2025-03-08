import { AppShell } from "@mantine/core";
import { ReactNode } from "react";
import HeaderShell from "./header";
import useWalletStore from "../utils/store";
import { useEffect } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  const { fetchWallet } = useWalletStore();

  useEffect(() => {
    fetchWallet();
  }, []);
  return (
    <AppShell
      header={{ height: 60 }}
    >
      <HeaderShell />
      <AppShell.Main bg="gray.1">{children}</AppShell.Main>
    </AppShell>
  );
};

export default Layout;