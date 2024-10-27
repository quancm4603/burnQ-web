import { create } from 'zustand';
import { TestResponse } from '../../api';

interface TestStore {
    tests: TestResponse[];
    addTest: (test: TestResponse) => void;
    initializeTests: (initialExams: TestResponse[]) => void;
}

export const useTestStore = create<TestStore>((set) => ({
    tests: [],
    addTest: (test) => set((state) => ({
        tests: [...state.tests, test],
    })),
    initializeTests: (initialTests) => set({ tests: initialTests }),
}));