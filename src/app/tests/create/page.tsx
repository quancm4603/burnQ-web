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
import { CreateTestRequest, TestApi, ExamApi, ExamResponse } from '../../../../api'; 
import { useAuthStore } from '@/stores/authStore';

export default function CreateTest() {
    const { exams } = useExamStore();
    const router = useRouter();
    const toast = useToast(); 
    const { token } = useAuthStore(); 
    const [newTest, setNewTest] = useState({ examId: '', code: '', startDateTime: '', endDateTime: '' });
    const [selectedExam, setSelectedExam] = useState<ExamResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true); 

    const testApi = new TestApi();
    const examApi = new ExamApi();

    // Fetch exams if not already loaded
    useEffect(() => {
        if (exams.length === 0) {
            const fetchExams = async () => {
                try {
                    setIsLoading(true); 
                    const response = await examApi.apiExamTeacherGet({
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    // Lưu danh sách đề thi vào store hoặc state nếu cần
                } catch (error) {
                    console.error("Error fetching exams:", error);
                } finally {
                    setIsLoading(false); 
                }
            };
            fetchExams();
        } else {
            setIsLoading(false);
        }
    }, [exams, token]);

    // Hàm để tạo mã ngẫu nhiên
    const generateRandomCode = () => {
        const currentDate = new Date();
        const datePart = currentDate.toISOString().slice(0, 10).replace(/-/g, '');
        const timePart = currentDate.toTimeString().slice(0, 5).replace(/:/g, '');
        const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `TEST-${datePart}-${timePart}-${randomPart}`;
    };

    // Hàm để xử lý việc tạo mã ngẫu nhiên
    const handleGenerateCode = () => {
        const randomCode = generateRandomCode();
        setNewTest((prev) => ({ ...prev, code: randomCode }));
    };

    const handleCreateTest = async () => {
        try {
            const testData: CreateTestRequest = {
                examId: parseInt(newTest.examId),
                code: newTest.code || generateRandomCode(), // Tạo mã nếu không có mã được chỉ định
                startDateTime: newTest.startDateTime,
                endDateTime: newTest.endDateTime,
            };
            const response = await testApi.apiTestCreatePost(testData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status !== 201) {
                throw new Error('Failed to create test');
            }

            toast({
                title: "Bài kiểm tra đã được tạo.",
                description: "Bạn đã tạo bài kiểm tra thành công!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            setNewTest({ examId: '', code: '', startDateTime: '', endDateTime: '' });
            router.push('/tests');
        } catch (error) {
            console.error(error);
            toast({
                title: "Có lỗi xảy ra.",
                description: "Không thể tạo bài kiểm tra. Vui lòng thử lại sau.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box p={5}>
            <Heading mb={4}>Tạo bài kiểm tra</Heading>
            {isLoading ? (
                <Spinner />
            ) : (
                <VStack spacing={4} align="stretch">
                    <Select 
                        placeholder="Chọn đề thi" 
                        value={newTest.examId} 
                        onChange={(e) => {
                            const selected = exams.find(exam => exam.id === parseInt(e.target.value));
                            setSelectedExam(selected || null);
                            setNewTest({ ...newTest, examId: e.target.value });
                        }} 
                    >
                        {exams.map(exam => (
                            <option key={exam.id} value={exam.id}>{exam.name}</option>
                        ))}
                    </Select>
                    <HStack>
                        <Input 
                            placeholder="Tên bài kiểm tra" 
                            value={newTest.code} 
                            onChange={(e) => setNewTest({ ...newTest, code: e.target.value })} 
                        />
                        <Button onClick={handleGenerateCode} colorScheme="blue">
                            Tự tạo code
                        </Button>
                    </HStack>
                    <Input 
                        placeholder="Thời gian bắt đầu" 
                        type="datetime-local" 
                        value={newTest.startDateTime} 
                        onChange={(e) => setNewTest({ ...newTest, startDateTime: e.target.value })} 
                    />
                    <Input 
                        placeholder="Thời gian kết thúc" 
                        type="datetime-local" 
                        value={newTest.endDateTime} 
                        onChange={(e) => setNewTest({ ...newTest, endDateTime: e.target.value })} 
                    />
                </VStack>
            )}

            <Button 
                mt={5} 
                colorScheme="teal" 
                onClick={handleCreateTest} 
                isDisabled={!newTest.examId || !newTest.code || !newTest.startDateTime || !newTest.endDateTime}
            >
                Tạo bài kiểm tra
            </Button>
        </Box>
    );
}
