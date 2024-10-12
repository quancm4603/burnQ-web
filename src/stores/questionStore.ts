import { create } from 'zustand';
import { mockQuestions } from '../mock/mockData';

interface QuestionState {
  questions: any[];
  addQuestion: (question: any) => void;
  getQuestions: () => any[];
}

export const useQuestionStore = create<QuestionState>((set, get) => ({
  questions: mockQuestions,
  addQuestion: (question) => set((state) => ({ questions: [...state.questions, question] })),
  getQuestions: () => get().questions,
}));
