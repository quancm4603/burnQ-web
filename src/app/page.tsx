import Link from 'next/link';
import { Box, Button, VStack, Heading } from '@chakra-ui/react';

export default function Home() {
  return (
    <Box maxWidth="400px" margin="auto" mt={8}>
      <VStack spacing={4}>
        <Heading>Welcome to BurnQ</Heading>
        <Link href="/login" passHref>
          <Button as="a" colorScheme="blue">Go to Login</Button>
        </Link>
      </VStack>
    </Box>
  );
}