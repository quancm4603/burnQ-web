'use client';

import { useState, useEffect } from 'react';
import { Box, Heading, Input, Button, VStack, HStack, Text, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { TestResponse } from '../../../api'; // Đảm bảo rằng đường dẫn này đúng
import { TestApi } from '../../../api'; // Đảm bảo rằng đường dẫn này đúng
import { useAuthStore } from '@/stores/authStore';
import { useTestStore } from '@/stores/testStore';

export default function Tests() {
  const { tests, initializeTests } = useTestStore(); // Lấy tests và hàm khởi tạo từ store
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true); // Thêm state loading
  const router = useRouter();
  const testApi = new TestApi();
  const { token } = useAuthStore(); 

  // Nếu bạn cần lấy dữ liệu từ API, có thể sử dụng useEffect
  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true); // Bắt đầu loading
      try {
        // Lấy danh sách bài kiểm tra từ API
        const response = await testApi.apiTestTeacherGet('', 1, 10, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data: TestResponse[] = await response.data.tests ?? [];
        initializeTests(data); // Khởi tạo bài kiểm tra từ dữ liệu nhận được
      } catch (error) {
        console.error("Error fetching tests:", error);
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchTests();
  }, [initializeTests, token]); // Gọi lại khi khởi tạo hàm thay đổi hoặc token thay đổi

  const filteredTests = tests.filter(t => 
    t.code?.toLowerCase().includes(search.toLowerCase()) ||
    t.teacherName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Heading mb={4}>Bài kiểm tra</Heading>
      <HStack mb={4}>
        <Input 
          placeholder="Tìm kiếm bài kiểm tra" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
        <Button 
          colorScheme="blue" 
          onClick={() => router.push('/tests/create')} // Đường dẫn tới trang tạo bài kiểm tra
        >
          + Tạo bài kiểm tra
        </Button>
      </HStack>
      {loading ? ( // Hiển thị Spinner nếu đang loading
        <Spinner size="xl" />
      ) : (
        <HStack spacing={4} wrap="wrap"> {/* Sử dụng HStack và thêm wrap */}
          {filteredTests.map(t => (
            <Box key={t.id} p={4} borderWidth={1} borderRadius="md" flex="1" minWidth="200px"> {/* Cài đặt flex và minWidth */}
              <Text fontWeight="bold">Mã bài kiểm tra: {t.code}</Text>
              <Text>Giáo viên: {t.teacherName}</Text>
              <Text fontSize="sm" color="gray.500">
                Thời gian: 
                {t.startDateTime ? new Date(t.startDateTime).toLocaleString() : 'N/A'}
                {' - '}
                {t.endDateTime ? new Date(t.endDateTime).toLocaleString() : 'N/A'}
              </Text>
            </Box>
          ))}
        </HStack>
      )}
    </Box>
  );
}
