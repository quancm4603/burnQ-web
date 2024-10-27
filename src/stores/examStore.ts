import { create } from 'zustand';
import { ExamResponse } from '../../api';

interface ExamStore {
    exams: ExamResponse[];
    addExam: (exam: ExamResponse) => void;
    initializeExams: (initialExams: ExamResponse[]) => void;
}

export const useExamStore = create<ExamStore>((set) => ({
    exams: [],
    addExam: (exam) => set((state) => ({
        exams: [...state.exams, exam],
    })),
    initializeExams: (initialExams) => set({ exams: initialExams }),
}));