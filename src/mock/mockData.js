// src/mock/mockData.ts
export const mockUsers = [
  { id: 1, username: 'quan', password: 'a', name: 'Cao Minh Quân', role: 'Giáo viên' },
  { id: 2, username: 'teacher2', password: 'password2', name: 'Nguyễn Văn A', role: 'Giáo viên' },
];

export const mockQuestions = [
  { id: 1, subject: 'Toán 10', content: 'Dựa vào đồ thị của hàm số y = ax² + bx + c. Hãy xác định dấu của các hệ số a, b và c trong mỗi trường hợp dưới đây:', chapter: 'Chương 2' },
  // Thêm nhiều câu hỏi khác
];

export const mockExams = [
  { id: 1, subject: 'Toán 10', name: 'Thi giữa kì', date: '12/01/2023' },
  { id: 2, subject: 'Toán 11', name: 'Ôn tập cuối kì 1', date: '27/04/2023' },
  { id: 3, subject: 'Toán 10', name: 'Ôn tập cuối kì 1', date: '29/04/2023' },
  { id: 4, subject: 'Hóa học 10', name: 'Ôn tập cuối kì 2', date: '25/07/2023' },
];