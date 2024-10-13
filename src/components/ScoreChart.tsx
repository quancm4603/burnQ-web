// components/ScoreChart.tsx
'use client';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { mockScores } from '../mock/mockData'; // Đảm bảo import đúng file mock data
import { Box, Input } from '@chakra-ui/react';
import { useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

export default function ScoreChart() {
  const [chartTitle, setChartTitle] = useState('Điểm số của học sinh'); // Tên mặc định cho biểu đồ
  const studentNames = ['Cao Minh Quân', 'Nguyễn Văn A']; // Giả định tên học sinh
  const subjects = ['Toán', 'Vật lý', 'Hóa học'];

  // Tạo dữ liệu cho biểu đồ
  const data = {
    labels: subjects,
    datasets: studentNames.map((name, index) => ({
        data: mockScores.filter(score => score.studentId === index + 1).map(score => score.score),
        backgroundColor: index === 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(153, 102, 255, 0.6)',
        label: name,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <Box>
      <h2 style={{ textAlign: 'center' }}>{chartTitle}</h2>
      <Bar data={data} options={options} />
    </Box>
  );
}
