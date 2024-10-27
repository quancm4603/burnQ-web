'use client';

import { useState, useEffect } from 'react';
import {
    Box, Heading, Input, Button, VStack, HStack, Text, 
    Checkbox, Stack, Flex, InputGroup, InputLeftElement, Divider, Tag, TagCloseButton,
    Select, useToast, Spinner
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useExamStore } from '../../../stores/examStore';
import { useRouter } from 'next/navigation';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { CreateExamRequest, ExamApi, QuestionApi, QuestionResponse, SubjectApi, SubjectResponse } from '../../../../api'; 
import { useAuthStore } from '@/stores/authStore';

export default function CreateExam() {
    const { addExam } = useExamStore();
    const router = useRouter();
    const toast = useToast(); 
    const { token } = useAuthStore(); 
    const [newExam, setNewExam] = useState({ subject: '', name: '', date: new Date().toISOString(), questions: [] });
    const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [questions, setQuestions] = useState<QuestionResponse[]>([]); 
    const [isLoading, setIsLoading] = useState(true); 
    const [filters, setFilters] = useState<{ subjects: string[], difficulties: string[] }>({ subjects: [], difficulties: [] });
    const [subjects, setSubjects] = useState<SubjectResponse[]>([]); // Chỉnh sửa state cho subjects

    const questionApi = new QuestionApi();
    const examApi = new ExamApi();
    const subjectApi = new SubjectApi();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setIsLoading(true); 
                const response = await questionApi.apiQuestionTeacherGet("", 1, 100, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setQuestions(response.data.questions ?? []);
            } catch (error) {
                console.error("Error fetching questions:", error);
            } finally {
                setIsLoading(false); 
            }
        };

        const fetchSubjects = async () => {
            try {
                const response = await subjectApi.apiSubjectCurrentGet({
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSubjects(response.data); // Lưu trực tiếp danh sách SubjectResponse
            } catch (error) {
                console.error("Error fetching subjects:", error);
            }
        };

        fetchQuestions();
        fetchSubjects(); // Lấy danh sách môn học từ API
    }, [token]); 

    const uniqueDifficulties = Array.from(new Set(questions.map(q => q.difficultyLevel)));

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

    const handleCreateExam = async () => {
        try {
            const examData: CreateExamRequest = {
                subjectId: parseInt(newExam.subject),
                name: newExam.name,
                date: newExam.date,
                questionIds: selectedQuestions,
            };
            const response = await examApi.apiExamCreatePost(examData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status !== 201) {
                throw new Error('Failed to create exam');
            }

            const data = await response.data;
            addExam(data); 
            setNewExam({ subject: '', name: '', date: new Date().toISOString().slice(0, 16), questions: [] });
            setSelectedQuestions([]);
            router.push('/exams');

            toast({
                title: "Đề thi đã được tạo.",
                description: "Bạn đã tạo đề thi thành công!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Có lỗi xảy ra.",
                description: "Không thể tạo đề thi. Vui lòng thử lại sau.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const filteredQuestions = questions.filter(question => 
        question.content?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!filters.subjects.length || filters.subjects.includes(question.subject ?? '')) &&
        (!filters.difficulties.length || filters.difficulties.includes(question.difficultyLevel ?? '')) &&
        question.id !== undefined && !selectedQuestions.includes(question.id)
    );

    const handleFilterChange = (filterType: 'subjects' | 'difficulties', value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: prev[filterType].includes(value)
                ? prev[filterType].filter(item => item !== value)
                : [...prev[filterType], value]
        }));
    };

    const removeFilter = (key: 'subjects' | 'difficulties', value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: prev[key].filter(item => item !== value)
        }));
    };

    return (
        <Box p={5}>
            <Heading mb={4}>Tạo đề thi</Heading>
            <VStack spacing={4} align="stretch">
                <Select 
                    placeholder="Chọn môn học" 
                    value={newExam.subject} 
                    onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })} 
                >
                    {subjects.map(subject => (
                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                </Select>
                <Input 
                    placeholder="Tên đề thi" 
                    value={newExam.name} 
                    onChange={(e) => setNewExam({ ...newExam, name: e.target.value })} 
                />
                {/* <Input 
                    placeholder="Ngày thi" 
                    type="date" 
                    value={newExam.date} 
                    onChange={(e) => setNewExam({ ...newExam, date: e.target.value })} 
                /> */}
            </VStack>

            <Flex mt={5} alignItems="center" flexWrap="wrap" gap={2}>
                <InputGroup size="md" maxWidth="300px">
                    <InputLeftElement pointerEvents="none">
                        <SearchIcon color="gray.300" />
                    </InputLeftElement>
                    <Input 
                        placeholder="Tìm kiếm câu hỏi" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                </InputGroup>
                <Select placeholder="Môn học" onChange={(e) => handleFilterChange('subjects', e.target.value)} maxWidth="150px">
                    {subjects.map(subject => (
                        <option key={subject.id} value={subject.name ?? ''}>{subject.name}</option>
                    ))}
                </Select>
                <Select placeholder="Độ khó" onChange={(e) => handleFilterChange('difficulties', e.target.value)} maxWidth="150px">
                    {uniqueDifficulties.map(difficulty => (
                        <option key={difficulty} value={difficulty ?? ''}>{difficulty}</option>
                    ))}
                </Select>
                <HStack spacing={2} flexWrap="wrap">
                    {filters.subjects.map(subject => (
                        <Tag key={`subject-${subject}`} size="md" borderRadius="full" variant="solid" colorScheme="blue">
                            {subject}
                            <TagCloseButton onClick={() => removeFilter('subjects', subject)} />
                        </Tag>
                    ))}
                    {filters.difficulties.map(difficulty => (
                        <Tag key={`difficulty-${difficulty}`} size="md" borderRadius="full" variant="solid" colorScheme="blue">
                            {difficulty}
                            <TagCloseButton onClick={() => removeFilter('difficulties', difficulty)} />
                        </Tag>
                    ))}
                </HStack>
            </Flex>

            <Flex mt={5} align="flex-start">
                <Box flex="1" mr={5}>
                    <Heading size="md" mb={2}>Câu hỏi tìm kiếm</Heading>
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <Stack spacing={2} maxHeight="400px" overflowY="auto" borderWidth={1} borderRadius="md" p={3}>
                            {filteredQuestions.map(question => (
                                <Box 
                                    key={question.id} 
                                    borderWidth="1px" 
                                    borderRadius="lg" 
                                    p={4} 
                                    mb={2} 
                                    onClick={() => question.id !== undefined && handleAddQuestion(question.id)} 
                                    cursor="pointer"
                                    _hover={{ bg: 'gray.100' }}
                                >
                                    <Text fontSize="md">{renderMathContent(question.content ?? '')}</Text>
                                </Box>
                            ))}
                        </Stack>
                    )}
                </Box>
                <Box flex="1">
                    <Heading size="md" mb={2}>Câu hỏi đã chọn</Heading>
                    <Stack spacing={2} maxHeight="400px" overflowY="auto" borderWidth={1} borderRadius="md" p={3}>
                        {selectedQuestions.map(id => {
                            const selectedQuestion = questions.find(q => q.id === id);
                            return (
                                selectedQuestion && (
                                    <Box 
                                        key={id} 
                                        borderWidth="1px" 
                                        borderRadius="lg" 
                                        p={4} 
                                        mb={2} 
                                        onClick={() => handleRemoveQuestion(id)} 
                                        cursor="pointer"
                                        _hover={{ bg: 'red.100' }}
                                    >
                                        <Text fontSize="md">{renderMathContent(selectedQuestion.content ?? '')}</Text>
                                    </Box>
                                )
                            );
                        })}
                    </Stack>
                </Box>
            </Flex>

            <Button 
                mt={5} 
                colorScheme="teal" 
                onClick={handleCreateExam} 
                isDisabled={!newExam.subject || !newExam.name || selectedQuestions.length === 0}
            >
                Tạo đề thi
            </Button>
        </Box>
    );
}
