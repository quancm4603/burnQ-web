import { create } from 'zustand';
import { QuestionResponse } from '../../api';
interface QuestionStore {
  questions: QuestionResponse[];
  loadedPage: number;
  addQuestion: (question: QuestionResponse) => void;
  addQuestions: (questions: QuestionResponse[]) => void;
  setLoadedPage: (page: number) => void;
  initializeQuestions: (initialQuestions: QuestionResponse[]) => void;
}

export const useQuestionStore = create<QuestionStore>((set) => ({
  questions: [],
  loadedPage: 0,
  addQuestion: (question) => {
    // check if the question already exists in the store
    set((state) => {
      const existingQuestion = state.questions.find((q) => q.id === question.id);
      if (!existingQuestion) {
        return { questions: [...state.questions, question] };
      }
      return state;
    });
  },
  addQuestions: (questions) => set((state) => {
    const newQuestions = questions.filter((question) => {
      const existingQuestion = state.questions.find((q) => q.id === question.id);
      return !existingQuestion;
    });
    return { questions: [...state.questions, ...newQuestions] };
  }),
  setLoadedPage: (page) => set({ loadedPage: page }),
  initializeQuestions: (initialQuestions) => set({ questions: initialQuestions }),
}));