import api from '../lib/api';

export const authService = {
  login: async (login: string, senha: string) => {
    const response = await api.post('/api/auth/login', { login, senha });
    return response.data;
  },
};
