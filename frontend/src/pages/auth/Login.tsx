import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/tunedown.png";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Anchor,
  Center,
  Stack,
} from "@mantine/core";

const Login: React.FC = () => {
  const [emailOrUsername, setEmailOrUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    const isAuthenticated = Cookies.get("is_authenticated");

    if (accessToken || isAuthenticated) {
      const handleLogout = async () => {
        console.log("Logging out...");
        try {
          const response = await fetch(
            `${import.meta.env.VITE_TUNEDOWN_API_URL}/auth/signout`,
            {
              method: "POST",
              credentials: "include",
              mode: "cors",
            },
          );

          if (!response.ok) {
            throw new Error("Logout failed");
          }

          console.log("Logout successful");
          navigate("/login");
        } catch (err) {
          console.error("Logout error:", err);
        }
      };

      handleLogout();
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const requestBody = JSON.stringify({
        email_or_username: emailOrUsername,
        password: password,
      });
      console.log("Request Body:", requestBody);

      const response = await fetch("https://api.tunedown.fr/api/auth/signin", {
        method: "POST",
        credentials: "include",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });

      console.log(response);

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.detail || "Login failed");
        console.error("Login failed:", errorData.detail);
        throw new Error(errorData.detail || "Login failed");
      }

      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <Center style={{ height: "100vh" }}>
      <Paper shadow="md" p="xl" radius="md" withBorder style={{ width: 400 }}>
        <Center>
          <img
            src={logo}
            alt="tunedown"
            style={{ width: 300, marginBottom: 20 }}
          />
        </Center>
        <Title order={2}>Login</Title>
        <form onSubmit={handleLogin}>
          <Stack mt="md">
            <TextInput
              label="Email ou Pseudo"
              placeholder="ton email ou pseudo"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
            />
            <PasswordInput
              label="Mot de passe"
              placeholder="ton mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && (
              <Text color="red" size="sm">
                {error}
              </Text>
            )}
            <Button
              type="submit"
              disabled={!emailOrUsername || !password}
              color="blue"
            >
              Se connecter
            </Button>
          </Stack>
        </form>
        <Text mt="md" size="sm">
          Pas de compte? <Anchor href="/sign-up">S'inscrire</Anchor>
        </Text>
      </Paper>
    </Center>
  );
};

export default Login;
