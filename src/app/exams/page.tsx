'use client';

import { useState } from 'react';
import { Box, Heading, Input, Button, VStack, HStack, Text, useDisclosure } from '@chakra-ui/react';
import { useExamStore } from '../../stores/examStore';

export default function Exams() {
  const { exams, addExam } = useExamStore();
  const [search, setSearch] = useState('');
  const [newExam, setNewExam] = useState({ subject: '', name: '', date: '' });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const filteredExams = exams.filter(e => 
    e.subject.toLowerCase().includes(search.toLowerCase()) ||
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddExam = () => {
    addExam({ ...newExam, id: exams.length + 1 });
    setNewExam({ subject: '', name: '', date: '' });
    onClose();
  };

  return (
    <Box>
      <Heading mb={4}>Đề thi</Heading>
      <HStack mb={4}>
        <Input placeholder="Tìm kiếm đề thi" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button colorScheme="blue" onClick={onOpen}>+ Tạo đề thi</Button>
      </HStack>
      <VStack align="stretch" spacing={4}>
        {filteredExams.map(e => (
          <Box key={e.id} p={4} borderWidth={1} borderRadius="md">
            <Text fontWeight="bold">{e.subject}</Text>
            <Text>{e.name}</Text>
            <Text fontSize="sm" color="gray.500">{e.date}</Text>
          </Box>
        ))}
      </VStack>
      {isOpen && (
        <Box mt={4} p={4} borderWidth={1} borderRadius="md">
          <Heading size="md" mb={4}>Tạo đề thi</Heading>
          <VStack spacing={4}>
            <Input placeholder="Môn học" value={newExam.subject} onChange={(e) => setNewExam({...newExam, subject: e.target.value})} />
            <Input placeholder="Tên đề thi" value={newExam.name} onChange={(e) => setNewExam({...newExam, name: e.target.value})} />
            <Input placeholder="Ngày thi" type="date" value={newExam.date} onChange={(e) => setNewExam({...newExam, date: e.target.value})} />
            <Button colorScheme="blue" onClick={handleAddExam}>Thêm</Button>
          </VStack>
        </Box>
      )}
    </Box>
  );
}