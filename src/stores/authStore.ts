import { create } from 'zustand';
import { AuthApi, LoginRequest, UserApi } from '../../api';
import axios from 'axios';

interface AuthState {
  user: { fullName: string; phoneNumber: string; email: string; avatarUrl: string } | null;
  token: string | null;
  isLoggedIn: boolean;
  checkLoginStatus: () => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  token: null,
  checkLoginStatus: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userApi = new UserApi();
        const userResponse = await userApi.apiUserInfoGet({
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const user = userResponse.data;
        set({
          user: {
            fullName: user.fullName ?? '',
            phoneNumber: user.phoneNumber ?? '',
            email: user.email ?? '',
            avatarUrl: user.avatarUrl ?? '',
          },
          token: token,
          isLoggedIn: true,
        });
        localStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          // Token expired or invalid
          set({ user: null, token: null, isLoggedIn: false });
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        } else {
          console.error('An unexpected error occurred:', error);
        }
      }
    }
  },
  login: async (username, password) => {
    const loginRequest: LoginRequest = { username, password }; 
    try {
      const authApi = new AuthApi();
      const response = await authApi.apiAuthLoginPost(loginRequest);
      const userData = response.data;
      const token = userData.token;
      if (!token) {
        throw new Error('Invalid credentials');
      }
      set({ token: token });
      const userApi = new UserApi();
      const userResponse = await userApi.apiUserInfoGet({
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const user = userResponse.data;
      set({ user: { fullName: user.fullName ?? '', phoneNumber: user.phoneNumber ?? '', email: user.email ?? '', avatarUrl: user.avatarUrl ?? '' }, isLoggedIn: true });
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Invalid credentials');
      } else {
        throw new Error('An unexpected error occurred');
      }
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, isLoggedIn: false, token: null });
  },
}));