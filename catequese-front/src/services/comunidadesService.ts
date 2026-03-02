import api from '../lib/api';
import { Community } from '../store/AppContext';

export const comunidadesService = {
  getAll: async () => {
    const response = await api.get('/api/comunidades');
    return response.data.map((c: any) => ({
      id: String(c.id),
      name: c.nome
    }));
  },
  getById: async (id: string) => {
    const response = await api.get(`/api/comunidades/${id}`);
    const c = response.data;
    return {
      id: String(c.id),
      name: c.nome
    };
  },
  create: async (data: Partial<Community>) => {
    const payload = { nome: data.name };
    const response = await api.post('/api/comunidades', payload);
    const c = response.data;
    return {
      id: String(c.id),
      name: c.nome || data.name
    };
  },
  update: async (id: string, data: Partial<Community>) => {
    const payload = { nome: data.name };
    await api.put(`/api/comunidades/${id}`, payload);
    
    // Backend returns 200 OK with empty body. We return the data we sent to update the local state.
    return {
      id: id,
      name: data.name || ''
    };
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/comunidades/${id}`);
    return response.data;
  }
};
