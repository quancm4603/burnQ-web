import Link from 'next/link';
import { Box, Button, VStack, Heading } from '@chakra-ui/react';

export default function Home() {
  return (
    <Box maxWidth="400px" margin="auto" mt={8}>
      <VStack spacing={4}>
        <Heading>Welcome to BurnQ</Heading>
      </VStack>
    </Box>
  );
}