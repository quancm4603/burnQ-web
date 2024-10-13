'use client';

import { useState } from 'react';
import {
    Box, Heading, Input, Button, VStack, HStack, Text, 
    Checkbox, Stack, Flex, InputGroup, InputLeftElement, Divider, Tag, TagCloseButton
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useExamStore } from '../../../stores/examStore';
import { useRouter } from 'next/navigation';
import { mockQuestions } from '../../../mock/mockData';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function CreateExam() {
    const { addExam } = useExamStore();
    const router = useRouter();
    const [newExam, setNewExam] = useState({ subject: '', name: '', date: '', questions: [] });
    const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Hàm render nội dung toán học
    const renderMathContent = (content: string) => {
        return content.split(/($$[\s\S]+?$$|\$[\s\S]+?\$)/).map((part, index) => {
            if (part.startsWith('$$') && part.endsWith('$$')) {
                return <BlockMath key={index} math={part.slice(2, -2)} />;
            } else if (part.startsWith('$') && part.endsWith('$')) {
                return <InlineMath key={index} math={part.slice(1, -1)} />;
            } else {
                return <span key={index}>{part}</span>;
            }
        });
    };

    const handleAddQuestion = (id: number) => {
        if (!selectedQuestions.includes(id)) {
            setSelectedQuestions([...selectedQuestions, id]);
        }
    };

    const handleRemoveQuestion = (id: number) => {
        setSelectedQuestions(selectedQuestions.filter(questionId => questionId !== id));
    };

    const handleCreateExam = () => {
        addExam({ ...newExam, id: Date.now(), questions: selectedQuestions });
        setNewExam({ subject: '', name: '', date: '', questions: [] });
        setSelectedQuestions([]);
        router.push('/exams');
    };

    const filteredQuestions = mockQuestions.filter(question => 
        question.content.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedQuestions.includes(question.id) // Ẩn câu hỏi đã chọn
    );

    return (
        <Box p={5}>
            <Heading mb={4}>Tạo đề thi</Heading>
            <VStack spacing={4} align="stretch">
                <Input 
                    placeholder="Môn học" 
                    value={newExam.subject} 
                    onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })} 
                />
                <Input 
                    placeholder="Tên đề thi" 
                    value={newExam.name} 
                    onChange={(e) => setNewExam({ ...newExam, name: e.target.value })} 
                />
                <Input 
                    placeholder="Ngày thi" 
                    type="date" 
                    value={newExam.date} 
                    onChange={(e) => setNewExam({ ...newExam, date: e.target.value })} 
                />
            </VStack>

            <Flex mt={5} align="flex-start">
                {/* Cột tìm kiếm */}
                <Box flex="1" mr={5}>
                    <InputGroup size="md">
                        <InputLeftElement pointerEvents="none">
                            <SearchIcon color="gray.300" />
                        </InputLeftElement>
                        <Input 
                            placeholder="Tìm kiếm câu hỏi" 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </InputGroup>
                    <Stack spacing={2} mt={4} maxHeight="400px" overflowY="auto" borderWidth={1} borderRadius="md" p={3}>
                        {filteredQuestions.map(question => (
                            <Checkbox 
                                key={question.id} 
                                onChange={() => handleAddQuestion(question.id)}
                            >
                                <Text>{renderMathContent(question.content)}</Text>
                            </Checkbox>
                        ))}
                    </Stack>
                </Box>

                <Divider orientation="vertical" />

                {/* Cột hiển thị câu hỏi đã chọn */}
                <Box flex="1" ml={5}>
                    <Heading size="md" mb={2}>Câu hỏi đã chọn</Heading>
                    <Stack spacing={2} maxHeight="400px" overflowY="auto" borderWidth={1} borderRadius="md" p={3}>
                        {selectedQuestions.map(id => {
                            const question = mockQuestions.find(q => q.id === id);
                            return question ? (
                                <Box key={question.id} borderWidth={1} borderRadius="md" p={2}>
                                    <HStack justify="space-between">
                                        <Text fontWeight="bold">{question.subject}</Text>
                                        <Button 
                                            variant="link" 
                                            color="red.500" 
                                            onClick={() => handleRemoveQuestion(question.id)}
                                        >
                                            &times; {/* Dấu x */}
                                        </Button>
                                    </HStack>
                                    <Text>{renderMathContent(question.content)}</Text>
                                </Box>
                            ) : null;
                        })}
                    </Stack>
                </Box>
            </Flex>

            <Button colorScheme="blue" onClick={handleCreateExam} mt={4}>Tạo Đề Thi</Button>
        </Box>
    );
}