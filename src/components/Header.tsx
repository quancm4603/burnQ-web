'use client';
import { useState } from 'react';
import { Box, Flex, Text, Button, Avatar, Icon, Container } from '@chakra-ui/react';
import Image from 'next/image';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaQuestion, FaFileAlt, FaClock, FaUsers } from 'react-icons/fa';
import LoadingSpinner from './LoadingSpinner'; // Nhập component loading

export default function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
    router.push('/login');
  };

  const navItems = [
    { href: '/questions', icon: FaQuestion, label: 'Câu hỏi' },
    { href: '/exams', icon: FaFileAlt, label: 'Đề thi' },
    { href: '/tests', icon: FaClock, label: 'Lịch thi' },
    { href: '/students', icon: FaUsers, label: 'Học sinh' },
  ];

  const handleNavigation = async (href: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Giả lập delay cho loading
    router.push(href);
    setLoading(false);
  };

  return (
    <>
      {loading && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="rgba(255, 255, 255, 0.8)"
          zIndex="1000"
        >
          <LoadingSpinner />
        </Box>
      )}
      <Box bg="white" py={2} borderBottom="1px" borderColor="gray.200">
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Box mr={6}>
              <Link href="/dashboard">
                <Image src="/logo/logo.png" alt="logo" width={48} height={48} />
              </Link>
            </Box>
            <Flex as="nav" justify="center" align="center" flex={1}>
              {navItems.map(({ href, icon, label }) => (
                <Button
                  key={label}
                  variant="link"
                  onClick={() => handleNavigation(href)}
                  mx={4}
                  _hover={{ transform: 'scale(1.1)' }}
                  transition="transform 0.2s"
                >
                  <Icon as={icon} mr={2} />
                  <Text>{label}</Text>
                </Button>
              ))}
            </Flex>
            <Flex align="center">
              <Avatar size="sm" name={user?.fullName} mr={2} />
              <Text mr={4}>{user?.fullName}</Text>
              <Button onClick={handleLogout} colorScheme="blue" size="sm">Đăng xuất</Button>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </>
  );
}
