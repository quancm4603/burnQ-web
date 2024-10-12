'use client';
import { Box, Flex, Text, Button, Avatar } from '@chakra-ui/react';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <Box bg="white" py={4} px={6} borderBottom="1px" borderColor="gray.200">
      <Flex justify="space-between" align="center">
        <Text fontSize="xl" fontWeight="bold">BurnQ</Text>
        <Flex align="center">
          <Avatar size="sm" name={user?.name} mr={2} />
          <Text mr={4}>{user?.name}</Text>
          <Button onClick={handleLogout} colorScheme="blue" size="sm">Đăng xuất</Button>
        </Flex>
      </Flex>
    </Box>
  );
}