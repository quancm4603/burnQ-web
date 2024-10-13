// components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { Box, VStack, Text, Icon } from '@chakra-ui/react';
import { FaQuestion, FaFileAlt, FaClock, FaUsers } from 'react-icons/fa';

export default function Sidebar() {
  return (
    <Box bg="gray.100" w="200px" h="100vh" p={4}>
      <VStack spacing={4} align="stretch">
        <Link href="/questions">
          <Box display="flex" alignItems="center">
            <Icon as={FaQuestion} mr={2} />
            <Text>Câu hỏi</Text>
          </Box>
        </Link>
        <Link href="/exams">
          <Box display="flex" alignItems="center">
            <Icon as={FaFileAlt} mr={2} />
            <Text>Đề thi</Text>
          </Box>
        </Link>
        <Link href="/schedule">
          <Box display="flex" alignItems="center">
            <Icon as={FaClock} mr={2} />
            <Text>Lịch thi</Text>
          </Box>
        </Link>
        <Link href="/students">
          <Box display="flex" alignItems="center">
            <Icon as={FaUsers} mr={2} />
            <Text>Học sinh</Text>
          </Box>
        </Link>
      </VStack>
    </Box>
  );
}