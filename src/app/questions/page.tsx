'use client';

import { useState, useEffect } from 'react';
import {
    Box, Heading, Input, Button, VStack, HStack, Text, 
    Select, Flex, Tag, TagCloseButton,
    InputGroup, InputLeftElement, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { useQuestionStore } from '@/stores/questionStore'; // Import store
import { mockQuestions } from '@/mock/mockData';

export default function Questions() {
    const { questions, initializeQuestions } = useQuestionStore(); // Lấy câu hỏi từ store
    const [search, setSearch] = useState('');
    const router = useRouter();
    
    // Các bộ lọc
    const [filters, setFilters] = useState<{ subjects: string[], difficulties: string[] }>({ subjects: [], difficulties: [] });
    const [activeFilters, setActiveFilters] = useState<{ key: string; value: string }[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [questionsPerPage, setQuestionsPerPage] = useState(5);
    
    // Extract unique values for filters
    const uniqueSubjects = Array.from(new Set(questions.map(q => q.subject)));
    const uniqueDifficulties = Array.from(new Set(questions.map(q => q.difficulty)));

    const normalizeString = (str: string) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    };

    const filteredQuestions = questions.filter(q => 
        (search === '' || 
            normalizeString(q.subject).includes(normalizeString(search)) || 
            normalizeString(q.content).includes(normalizeString(search))
        ) &&
        (filters.subjects.length === 0 || filters.subjects.includes(q.subject)) &&
        (filters.difficulties.length === 0 || filters.difficulties.includes(q.difficulty))
    );

    const handleFilterChange = (filterType: 'subjects' | 'difficulties', value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: prev[filterType].includes(value)
                ? prev[filterType].filter(item => item !== value)
                : [...prev[filterType], value]
        }));
        
        if (!activeFilters.some(filter => filter.key === filterType && filter.value === value)) {
            setActiveFilters([...activeFilters, { key: filterType, value }]);
        }
    };

    const removeFilter = (key: 'subjects' | 'difficulties', value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: prev[key].filter((item: string) => item !== value)
        }));
        setActiveFilters(activeFilters.filter(filter => !(filter.key === key && filter.value === value)));
    };

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

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
    const currentQuestions = filteredQuestions.slice((currentPage - 1) * questionsPerPage, currentPage * questionsPerPage);

    return (
        <Flex direction="column" minHeight="100vh">
            <Box flex="1">
                <Heading mb={4}>Câu hỏi</Heading>
                <Flex mb={4} alignItems="center" flexWrap="wrap" gap={2}>
                    <InputGroup size="md" maxWidth="300px">
                        <InputLeftElement pointerEvents="none">
                            <SearchIcon color="gray.300" />
                        </InputLeftElement>
                        <Input 
                            placeholder="Tìm kiếm câu hỏi" 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </InputGroup>
                    <Select placeholder="Môn học" size="md" maxWidth="150px" onChange={(e) => handleFilterChange('subjects', e.target.value)}>
                        {uniqueSubjects.map(subject => (
                            <option key={subject} value={subject}>{subject}</option>
                        ))}
                    </Select>
                    <Select placeholder="Độ khó" size="md" maxWidth="150px" onChange={(e) => handleFilterChange('difficulties', e.target.value)}>
                        {uniqueDifficulties.map(difficulty => (
                            <option key={difficulty} value={difficulty}>{difficulty}</option>
                        ))}
                    </Select>
                    <HStack spacing={2} flexWrap="wrap">
                        {activeFilters.map(({ key, value }) => (
                            <Tag key={`${key}-${value}`} size="md" borderRadius="full" variant="solid" colorScheme="blue">
                                {value}
                                <TagCloseButton onClick={() => removeFilter(key as 'subjects' | 'difficulties', value)} />
                            </Tag>
                        ))}
                    </HStack>
                    <Button colorScheme="blue" onClick={() => router.push('/questions/create')} ml="auto">+ Thêm câu hỏi</Button>
                </Flex>

                <VStack align="stretch" spacing={4}>
                    {currentQuestions.map(q => (
                        <Accordion key={q.id} allowToggle>
                            <AccordionItem 
                                border="1px solid"
                                borderColor="gray.200"
                                borderRadius="md"
                                boxShadow="md"
                                bg="linear-gradient(to bottom, white, #f8f9fa)"
                            >
                                <h2>
                                    <AccordionButton _expanded={{ bg: 'blue.50' }}>
                                        <Box flex="1" textAlign="left">
                                            <Text fontWeight="bold">{q.subject}</Text>
                                            <Text>{renderMathContent(q.content)}</Text>
                                            <HStack mt={2} spacing={2}>
                                                <Tag size="sm">{q.chapter}</Tag>
                                                <Tag size="sm" colorScheme={
                                                    q.difficulty === 'Dễ' ? 'green' :
                                                    q.difficulty === 'Trung bình' ? 'yellow' : 'red'
                                                }>{q.difficulty}</Tag>
                                            </HStack>
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    <VStack align="start" spacing={1}>
                                        {q.answers.map((answer, index) => (
                                            <Text key={index} color={index === q.correctAnswer ? 'green.500' : 'inherit'}>
                                                {index === q.correctAnswer ? '✓ ' : ''}
                                                {renderMathContent(answer)}
                                            </Text>
                                        ))}
                                    </VStack>
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>
                    ))}
                </VStack>
            </Box>

            <Flex mt={4} justifyContent="space-between" alignItems="center">
                <Button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    isDisabled={currentPage === 1}
                >
                    Previous
                </Button>
                <Text>Page {currentPage} of {totalPages}</Text>
                <Button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    isDisabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </Flex>
        </Flex>
    );
}