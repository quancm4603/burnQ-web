import { create } from 'zustand';

interface Exam {
    id: number;
    subject: string;
    name: string;
    date: string;
    questions: number[];
}

interface ExamStore {
    exams: Exam[];
    addExam: (exam: Exam) => void;
    initializeExams: (initialExams: Exam[]) => void;
}

export const useExamStore = create<ExamStore>((set) => ({
    exams: [],
    addExam: (exam) => set((state) => ({
        exams: [...state.exams, exam],
    })),
    initializeExams: (initialExams) => set({ exams: initialExams }),
}));