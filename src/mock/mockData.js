export const mockUsers = [
  { id: 1, username: 'quan', password: 'a', name: 'Cao Minh Quân', role: 'Giáo viên' },
  { id: 2, username: 'teacher2', password: 'password2', name: 'Nguyễn Văn A', role: 'Giáo viên' },
];

export const mockQuestions = [
  {
    id: 1,
    subject: 'Toán',
    content: 'Giải phương trình bậc 2: $ax^2 + bx + c = 0$',
    chapter: 'Chương 3',
    difficulty: 'Trung bình',
    answers: ['x = $\\frac{-b + √(b²-4ac)}{2a}$', 'x = $\\frac{-b - √(b²-4ac)}{2a}$', 'x = $\\frac{-b}{2a}$', 'x = $\\frac{b}{2a}$'],
    correctAnswer: 0
  },
  {
    id: 2,
    subject: 'Vật lý',
    content: 'Công thức động năng là: $E_k = \\frac{1}{2}mv^2$. Giải thích ý nghĩa của từng thành phần.',
    chapter: 'Chương 2',
    difficulty: 'Dễ',
    answers: ['$E_k$: động năng, $m$: khối lượng, $v$: vận tốc', '$E_k$: động năng, $m$: khối lượng, $v$: vận tốc bình phương', '$E_k$: động năng, $m$: khối lượng, $v$: vận tốc trung bình', '$E_k$: động năng, $m$: khối lượng, $v$: vận tốc cực đại'],
    correctAnswer: 1
  },
  {
    id: 3,
    subject: 'Hóa học',
    content: 'Cân bằng phương trình hóa học sau: $CH_4 + O_2 \\rightarrow CO_2 + H_2O$',
    chapter: 'Chương 5',
    difficulty: 'Trung bình',
    answers: ['$CH₄ + 2O₂ → CO₂ + 2H₂O$', '$CH₄ + O₂ → CO₂ + H₂O$', '$CH₄ + 3O₂ → CO₂ + 4H₂O$', '$CH₄ + 2O₂ → CO₂ + H₂O$'],
    correctAnswer: 0
  },
  {
    id: 4,
    subject: 'Toán',
    content: 'Tính tích phân sau: $\\int_0^\\pi \\sin x dx$',
    chapter: 'Chương 6',
    difficulty: 'Trung bình',
    answers: ['$2$', '$0$', '$1$', '$2$'],
    correctAnswer: 2
  },
  {
    id: 5,
    subject: 'Vật lý',
    content: 'Phương trình sóng điện từ trong không gian là: $\\vec{E} = E_0 \\sin(kx - \\omega t)\\hat{j}$. Giải thích ý nghĩa của các thành phần.',
    chapter: 'Chương 7',
    difficulty: 'Khó',
    answers: ['$E_0$: biên độ sóng, $k$: số sóng, $ω$: tần số góc', '$E_0$: biên độ sóng, $k$: số sóng, $ω$: tần số', '$E_0$: biên độ sóng, $k$: số sóng, $ω$: chu kỳ', '$E_0$: biên độ sóng, $k$: số sóng, $ω$: vận tốc góc'],
    correctAnswer: 0
  },
  {
    id: 6,
    subject: 'Hóa học',
    content: 'Viết cấu trúc Lewis cho phân tử $H_2SO_4$.',
    chapter: 'Chương 3',
    difficulty: 'Trung bình',
    answers: ['$H-O-S(=O)₂-O-H$', '$H-O-S(=O)₂-O-H$', '$H-O-S(=O)₂-O-H$', '$H-O-S(=O)₂-O-H$'],
    correctAnswer: 0
  },
  {
    id: 7,
    subject: 'Toán',
    content: 'Tính đạo hàm của hàm số: $f(x) = e^x \\sin x$',
    chapter: 'Chương 5',
    difficulty: 'Khó',
    answers: ['$e^x (sin x + cos x)$', '$e^x (sin x - cos x)$', '$e^x (sin x + cos x)$', '$e^x (sin x - cos x)$'],
    correctAnswer: 0
  },
  {
    id: 8,
    subject: 'Toán',
    content: 'Giải bất phương trình: $2x - 3 < 5$',
    chapter: 'Chương 1',
    difficulty: 'Dễ',
    answers: ['$x < 4$', '$x > 4$', '$x < 3$', '$x > 3$'],
    correctAnswer: 0
  },
  {
    id: 9,
    subject: 'Hóa học',
    content: 'Nêu các loại liên kết hóa học và ví dụ cho mỗi loại.',
    chapter: 'Chương 2',
    difficulty: 'Trung bình',
    answers: ['Liên kết ion, ví dụ: NaCl; Liên kết cộng hóa trị, ví dụ: H₂O', 'Liên kết ion, ví dụ: H₂O; Liên kết cộng hóa trị, ví dụ: CO₂', 'Liên kết kim loại, ví dụ: Fe; Liên kết ion, ví dụ: NaCl', 'Liên kết ion, ví dụ: MgO; Liên kết cộng hóa trị, ví dụ: CH₄'],
    correctAnswer: 0
  },
  {
    id: 10,
    subject: 'Vật lý',
    content: 'Mô tả nguyên lý bảo toàn năng lượng.',
    chapter: 'Chương 1',
    difficulty: 'Khó',
    answers: ['Năng lượng không thể tự sinh ra hoặc bị tiêu hủy, chỉ có thể chuyển đổi từ dạng này sang dạng khác.', 'Năng lượng có thể sinh ra từ không khí.', 'Năng lượng có thể bị tiêu hủy trong các phản ứng hóa học.', 'Năng lượng được tạo ra từ phản ứng hạt nhân.'],
    correctAnswer: 0
  },
];

export const mockExams = [
  { id: 1, subject: 'Toán 10', name: 'Thi giữa kì', date: '12/01/2023', questions: [1, 4, 8] },
  { id: 2, subject: 'Toán 11', name: 'Ôn tập cuối kì 1', date: '27/04/2023', questions: [2, 5, 7] },
  { id: 3, subject: 'Toán 10', name: 'Ôn tập cuối kì 1', date: '29/04/2023', questions: [3, 9] },
  { id: 4, subject: 'Hóa học 10', name: 'Ôn tập cuối kì 2', date: '25/07/2023', questions: [6, 10] },
  { id: 5, subject: 'Vật lý 11', name: 'Ôn tập giữa kì 2', date: '15/11/2023', questions: [2, 5, 9] },
  { id: 6, subject: 'Hóa học 11', name: 'Ôn tập cuối kì 1', date: '30/12/2023', questions: [3, 6, 10] },
];

export const mockScores = [
  { studentId: 1, subject: 'Toán', score: 85 },
  { studentId: 1, subject: 'Vật lý', score: 78 },
  { studentId: 1, subject: 'Hóa học', score: 92 },
  { studentId: 2, subject: 'Toán', score: 88 },
  { studentId: 2, subject: 'Vật lý', score: 90 },
  { studentId: 2, subject: 'Hóa học', score: 80 },
];