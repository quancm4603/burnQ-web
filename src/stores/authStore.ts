import { create } from 'zustand';
import { mockUsers } from '../mock/mockData';

interface AuthState {
  user: { id: number; username: string; name: string; role: string } | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  login: async (username, password) => {
    const user = mockUsers.find(u => u.username === username && u.password === password);
    if (user) {
      set({ user: { id: user.id, username: user.username, name: user.name, role: user.role }, isLoggedIn: true });
    } else {
      throw new Error('Invalid credentials');
    }
  },
  logout: () => set({ user: null, isLoggedIn: false }),
}));