// page/exams/page.tsx
'use client';

import { useState } from 'react';
import { Box, Heading, Input, Button, VStack, HStack, Text, useDisclosure } from '@chakra-ui/react';
import { useExamStore } from '../../stores/examStore';
import { useRouter } from 'next/navigation';

export default function Exams() {
  const { exams } = useExamStore();
  const [search, setSearch] = useState('');
  const router = useRouter();

  const filteredExams = exams.filter(e => 
    e.subject.toLowerCase().includes(search.toLowerCase()) ||
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Heading mb={4}>Đề thi</Heading>
      <HStack mb={4}>
        <Input placeholder="Tìm kiếm đề thi" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button colorScheme="blue" onClick={() => router.push('/exams/create')}>+ Tạo đề thi</Button>
      </HStack>
      <VStack align="stretch" spacing={4}>
        {filteredExams.map(e => (
          <Box key={e.id} p={4} borderWidth={1} borderRadius="md">
            <Text fontWeight="bold">{e.subject}</Text>
            <Text>{e.name}</Text>
            <Text fontSize="sm" color="gray.500">{e.date}</Text>
            <Text fontSize="sm">Câu hỏi: {e.questions.join(', ')}</Text> {/* Hiển thị ID câu hỏi */}
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
