// app/layout.tsx
'use client';

import { ChakraProvider, Flex, Box, Container } from '@chakra-ui/react'
import Header from '../components/Header'
import Login from '../components/LoginForm'
import { useAuthStore } from '../stores/authStore'
import 'katex/dist/katex.min.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoggedIn } = useAuthStore()

  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          {isLoggedIn ? (
            <Flex direction="column" minHeight="100vh">
              <Header />
              <Box flex={1} bg="gray.50" py={8}>
                <Container maxW="container.xl">
                  {children}
                </Container>
              </Box>
            </Flex>
          ) : (
            <Login />
          )}
        </ChakraProvider>
      </body>
    </html>
  )
}