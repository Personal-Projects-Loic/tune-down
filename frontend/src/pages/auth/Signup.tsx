import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/tunedown.png";
import { TextInput, PasswordInput, Button, Title, Text, Anchor, Center, Stack, Card, Image } from '@mantine/core';

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const requestBody = JSON.stringify({ email, username, password });

      const response = await fetch(`${import.meta.env.VITE_TUNEDOWN_API_URL}/auth/signup`, {
        method: "POST",
        credentials: "include",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.detail[0].message);
        console.error("Signup failed:", errorData.detail[0].message);
        throw new Error(errorData.detail[0].message || "Signup failed");
      }

      const data = await response.json();
      console.log("Signup successful:", data);

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
      <Card shadow="xs" padding="xl" style={{ width: 400 }}>
        <Image src={logo} alt="Logo" height={40} style={{ marginBottom: 20 }} />
        <Title order={1}>Créer un compte</Title>
        <form onSubmit={handleSignup}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="ton email"
              required
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <TextInput
              label="Pseudo"
              placeholder="ton Pseudo"
              required
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
            />
            <PasswordInput
              label="Mot de passe"
              placeholder="Ton mot de passe"
              required
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            {error && <Text color="red">{error}</Text>}
            <Button type="submit" color="blue" disabled={!email || !username || !password}>
              S'inscrire
            </Button>
            <Text size="sm" mt="md">
              Déjà un compte? <Anchor href="/login">Se connecter</Anchor>
            </Text>
          </Stack>
        </form>
      </Card>
    </Center>
  );
};

export default Signup;
