import { create } from 'zustand';
import { mockExams } from '../mock/mockData';

interface Question {
  id: number;
  content: string;
  answers: string[];
  correctAnswer: number;
}

interface Exam {
  id: number;
  subject: string;
  name: string;
  date: string;
  questions: number[];
}

interface ExamState {
  exams: Exam[];
  addExam: (exam: Exam) => void;
}

export const useExamStore = create<ExamState>((set) => ({
  exams: mockExams,
  addExam: (exam) => set((state) => ({ exams: [...state.exams, exam] })),
}));
