"use client";

import { ChakraProvider, Flex, Box, Container, Spinner } from "@chakra-ui/react";
import Header from "../components/Header";
import Login from "../components/LoginForm";
import { useAuthStore } from "../stores/authStore";
import "katex/dist/katex.min.css";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isCheckingLogin, setIsCheckingLogin] = useState(true);
  const { isLoggedIn, checkLoginStatus } = useAuthStore();

  useEffect(() => {
    const initialize = async () => {
      await checkLoginStatus();
      setIsCheckingLogin(false);
      setIsMounted(true);
    };
    initialize();
  }, []);

  if (!isMounted || isCheckingLogin) {
    return (
      <html lang="en">
      <body>
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
      </body>
    </html>
    );
  }

  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          {isLoggedIn ? (
            <Flex direction="column" minHeight="100vh">
              <Header />
              <Box flex={1} bg="gray.50" py={8}>
                <Container maxW="container.xl">{children}</Container>
              </Box>
            </Flex>
          ) : (
            <Login />
          )}
        </ChakraProvider>
      </body>
    </html>
  );
}
