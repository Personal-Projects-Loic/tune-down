import React from "react";
import headerLogo from "../assets/tuneDownLogo.png";
import "../assets/fonts/Poppins-Roboto/Poppins/Poppins-Regular.ttf";
import "./fonts.css";
import { useNavigate } from "react-router-dom";
import { AppShellHeader, Group, ActionIcon, Box, Divider, Image, Avatar, Menu } from "@mantine/core";
import { IconBell, IconLogout, IconUser } from "@tabler/icons-react";

const HeaderShell: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem("access_token");
      console.log("User logged out");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AppShellHeader bg={'#F5F5F5'}>
      <Group h="100%" px="md" justify="space-between" align="center">
        <Box>
          <Image src={headerLogo} alt="Logo" height={40} onClick={() => navigate("/home")} />
        </Box>
        <Group>

          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="transparent" c="dark">
                <IconBell />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => {}}>Aucune Notification</Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Divider orientation="vertical" />
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Avatar color="initials" variant="initial">P</Avatar>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => navigate("/profil")} leftSection={<IconUser size={14} />}>Profil</Menu.Item>
              <Menu.Item onClick={() => handleLogout()} leftSection={<IconLogout size={14} />}>Se deconnecter</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </AppShellHeader>
  )
};

export default HeaderShell;