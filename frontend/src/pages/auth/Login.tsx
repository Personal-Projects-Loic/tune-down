import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/tunedown.png";
import { TextInput, PasswordInput, Button, Paper, Title, Text, Anchor, Center, Stack } from '@mantine/core';

const Login: React.FC = () => {
  const [emailOrUsername, setEmailOrUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const requestBody = JSON.stringify({
        email_or_username: emailOrUsername,
        password: password,
      });
      console.log("Request Body:", requestBody);

      const response = await fetch("http://localhost:8000/auth/signin", {
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
        setError(errorData.detail[0].message);
        console.error("Login failed:", errorData.detail[0].message);
        throw new Error(errorData.detail[0].message || "Login failed");
      }

      const data = await response.json();
      console.log("Login successful:", data);

      if (!data.access_token) {
        throw new Error("No access token received");
      }

      sessionStorage.setItem("access_token", data.access_token);

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
    <Center style={{ height: '100vh' }}>
      <Paper shadow="md" p="xl" radius="md" withBorder style={{ width: 400 }}>
        <Center>
          <img src={logo} alt="tunedown" style={{ width: 300, marginBottom: 20 }} />
        </Center>
        <Title order={2} >Login</Title>
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
            {error && <Text color="red" size="sm">{error}</Text>}
            <Button 
              type="submit"
              disabled={!emailOrUsername || !password}
              color="blue"
            >Se connecter</Button>
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
