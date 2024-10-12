'use client';

import { useState } from 'react';
import { Box, Heading, Input, Button, VStack, HStack, Text, useDisclosure } from '@chakra-ui/react';
import { useQuestionStore } from '../../stores/questionStore';

export default function Questions() {
  const { questions, addQuestion } = useQuestionStore();
  const [search, setSearch] = useState('');
  const [newQuestion, setNewQuestion] = useState({ subject: '', content: '', chapter: '' });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const filteredQuestions = questions.filter(q => 
    q.subject.toLowerCase().includes(search.toLowerCase()) ||
    q.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddQuestion = () => {
    addQuestion({ ...newQuestion, id: questions.length + 1 });
    setNewQuestion({ subject: '', content: '', chapter: '' });
    onClose();
  };

  return (
    <Box>
      <Heading mb={4}>Câu hỏi</Heading>
      <HStack mb={4}>
        <Input placeholder="Tìm kiếm câu hỏi" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button colorScheme="blue" onClick={onOpen}>+ Thêm câu hỏi</Button>
      </HStack>
      <VStack align="stretch" spacing={4}>
        {filteredQuestions.map(q => (
          <Box key={q.id} p={4} borderWidth={1} borderRadius="md">
            <Text fontWeight="bold">{q.subject}</Text>
            <Text>{q.content}</Text>
            <Text fontSize="sm" color="gray.500">{q.chapter}</Text>
          </Box>
        ))}
      </VStack>
      {isOpen && (
        <Box mt={4} p={4} borderWidth={1} borderRadius="md">
          <Heading size="md" mb={4}>Tạo câu hỏi</Heading>
          <VStack spacing={4}>
            <Input placeholder="Môn học" value={newQuestion.subject} onChange={(e) => setNewQuestion({...newQuestion, subject: e.target.value})} />
            <Input placeholder="Nội dung câu hỏi" value={newQuestion.content} onChange={(e) => setNewQuestion({...newQuestion, content: e.target.value})} />
            <Input placeholder="Chương" value={newQuestion.chapter} onChange={(e) => setNewQuestion({...newQuestion, chapter: e.target.value})} />
            <Button colorScheme="blue" onClick={handleAddQuestion}>Thêm</Button>
          </VStack>
        </Box>
      )}
    </Box>
  );
}