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
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn, checkLoginStatus } = useAuthStore();

  useEffect(() => {
    const initialize = async () => {
      await checkLoginStatus();
      setIsLoading(false);
    };
    initialize();
  }, [checkLoginStatus]);

  if (isLoading) {
    return (
      <html lang="en">
        <body>
            <Box textAlign="center" mt={8}>
              <Spinner size="lg" />
            </Box>
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
