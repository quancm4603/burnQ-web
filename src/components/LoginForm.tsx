'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  Flex,
} from '@chakra-ui/react';
import { useAuthStore } from '../stores/authStore';
import Image from 'next/image';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      toast({
        title: 'Đăng nhập thành công',
        status: 'success',
        duration: 2000,
      });
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Đăng nhập thất bại',
        description: 'Vui lòng kiểm tra thông tin đăng nhập của bạn',
        status: 'error',
        duration: 2000,
      });
    }
  };

  return (
    <Box
      maxWidth="400px"
      margin="auto"
      mt={8}
      opacity={1}
      transform="translateY(0)"
      transition="opacity 0.5s ease, transform 0.5s ease"
    >
      <Flex justify="center" mb={4}>
        <Image src="/logo/logo.png" alt="Logo" width={100} height={100} />
      </Flex>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <Heading textAlign="center">Đăng nhập vào BurnQ</Heading>
          <FormControl isRequired>
            <FormLabel>Tên đăng nhập</FormLabel>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Mật khẩu</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
            />
          </FormControl>
          <Button type="submit" colorScheme="blue" width="full">
            Đăng nhập
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
