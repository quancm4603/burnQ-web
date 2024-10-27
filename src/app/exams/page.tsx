'use client';

import { useState, useEffect } from 'react';
import { Box, Heading, Input, Button, VStack, HStack, Text, Spinner } from '@chakra-ui/react';
import { useExamStore } from '../../stores/examStore';
import { useRouter } from 'next/navigation';
import { ExamResponse } from '../../../api';
import { ExamApi } from '../../../api';
import { useAuthStore } from '@/stores/authStore';

export default function Exams() {
  const { exams, initializeExams } = useExamStore(); // Lấy đề thi và hàm khởi tạo từ store
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true); // Thêm state loading
  const router = useRouter();
  const examApi = new ExamApi();
  const { token } = useAuthStore(); 

  // Nếu bạn cần lấy dữ liệu đề thi từ API, có thể sử dụng useEffect
  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true); // Bắt đầu loading
      try {
        // Lấy danh sách đề thi từ API
        const response = await examApi.apiExamTeacherGet({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data: ExamResponse[] = await response.data;
        initializeExams(data); // Khởi tạo đề thi từ dữ liệu nhận được
      } catch (error) {
        console.error("Error fetching exams:", error);
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchExams();
  }, [initializeExams, token]); // Gọi lại khi khởi tạo hàm thay đổi hoặc token thay đổi

  const filteredExams = exams.filter(e => 
    e.subjectName?.toLowerCase().includes(search.toLowerCase()) ||
    e.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Heading mb={4}>Đề thi</Heading>
      <HStack mb={4}>
        <Input 
          placeholder="Tìm kiếm đề thi" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
        <Button 
          colorScheme="blue" 
          onClick={() => router.push('/exams/create')}
        >
          + Tạo đề thi
        </Button>
      </HStack>
      {loading ? ( // Hiển thị Spinner nếu đang loading
        <Spinner size="xl" />
      ) : (
        <HStack spacing={4} wrap="wrap"> {/* Sử dụng HStack và thêm wrap */}
          {filteredExams.map(e => (
            <Box key={e.id} p={4} borderWidth={1} borderRadius="md" flex="1" minWidth="200px"> {/* Cài đặt flex và minWidth */}
              <Text fontWeight="bold">{e.subjectName}</Text>
              <Text>{e.name}</Text>
              <Text fontSize="sm" color="gray.500">{e.date}</Text>
              {/* <Text fontSize="sm">Câu hỏi: {e.questions?.join(', ')}</Text> */}
            </Box>
          ))}
        </HStack>
      )}
    </Box>
  );
}
