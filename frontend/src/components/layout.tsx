import { AppShell } from "@mantine/core";
import { ReactNode } from "react";
import HeaderShell from "./header";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <AppShell 
      style={{ minHeight: "100vh" }} 
      header={{ height: 60 }}
    >
      <HeaderShell />
      <AppShell.Main bg="gray.1">{children}</AppShell.Main>
    </AppShell>
  );
};

export default Layout;