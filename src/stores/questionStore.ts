import { create } from 'zustand';
import { QuestionResponse } from '../../api';

interface Question {
  id: number;
  subject: string;
  content: string;
  chapter: string;
  difficulty: string;
  answers: string[];
  correctAnswer: number;
}

interface QuestionStore {
  questions: QuestionResponse[];
  addQuestion: (question: QuestionResponse) => void;
  initializeQuestions: (initialQuestions: QuestionResponse[]) => void;
}

export const useQuestionStore = create<QuestionStore>((set) => ({
  questions: [],
  addQuestion: (question) => set((state) => ({
    questions: [...state.questions, question],
  })),
  initializeQuestions: (initialQuestions) => set({ questions: initialQuestions }),
}));