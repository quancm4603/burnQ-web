import { create } from 'zustand';
import { mockExams } from '../mock/mockData';

interface ExamState {
  exams: any[];
  addExam: (exam: any) => void;
  getExams: () => any[];
}

export const useExamStore = create<ExamState>((set, get) => ({
  exams: mockExams,
  addExam: (exam) => set((state) => ({ exams: [...state.exams, exam] })),
  getExams: () => get().exams,
}));