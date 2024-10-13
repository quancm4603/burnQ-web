import {create} from 'zustand';

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
  questions: Question[];
  addQuestion: (question: Question) => void;
}

export const useQuestionStore = create<QuestionStore>((set) => ({
  questions: [],
  addQuestion: (question) => set((state) => ({
    questions: [...state.questions, question],
  })),
}));