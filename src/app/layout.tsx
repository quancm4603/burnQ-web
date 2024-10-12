'use client';

import { ChakraProvider } from '@chakra-ui/react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Login from '../components/LoginForm' // Import the Login component
import { useAuthStore } from '../stores/authStore'

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
            <>
              <Header />
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ flexGrow: 1, padding: '20px' }}>{children}</main>
              </div>
            </>
          ) : (
            <Login /> // Render the Login component if not logged in
          )}
        </ChakraProvider>
      </body>
    </html>
  )
}