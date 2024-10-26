'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { useAuthStore } from '../../stores/authStore';
import ScoreChart from '@/components/ScoreChart';

export default function Dashboard() {
  const { isLoggedIn, user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  return (
    <Box maxWidth="800px" margin="auto" mt={8}>
      <Heading mb={4}>Dashboard</Heading>
      <Text mb={4}>Welcome, {user?.fullName}!</Text>
      <ScoreChart />
    </Box>
  );
}