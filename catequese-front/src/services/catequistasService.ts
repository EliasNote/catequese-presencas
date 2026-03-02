import api from '../lib/api';
import { User } from '../store/AppContext';

export const catequistasService = {
  getAll: async () => {
    const response = await api.get('/api/catequistas');
    return response.data.map((c: any) => ({
      id: String(c.id),
      name: c.nome,
      login: c.login || c.nome,
      role: 'CATECHIST',
      communityId: c.comunidade?.id ? String(c.comunidade.id) : c.comunidade_id ? String(c.comunidade_id) : undefined
    }));
  },
  getById: async (id: string) => {
    const response = await api.get(`/api/catequistas/${id}`);
    const c = response.data;
    return {
      id: String(c.id),
      name: c.nome,
      login: c.login || c.nome,
      role: 'CATECHIST',
      communityId: c.comunidade?.id ? String(c.comunidade.id) : c.comunidade_id ? String(c.comunidade_id) : undefined
    };
  },
  create: async (data: Partial<User>) => {
    const payload = {
      nome: data.name,
      login: data.login,
      senha: data.senha,
      comunidade_id: data.communityId ? parseInt(data.communityId) : null
    };
    const response = await api.post('/api/catequistas', payload);
    const c = response.data;
    return {
      id: String(c.id),
      name: c.nome || data.name,
      login: c.login || data.login || c.nome || data.name,
      role: 'CATECHIST',
      communityId: c.comunidade?.id ? String(c.comunidade.id) : c.comunidade_id ? String(c.comunidade_id) : (data.communityId || undefined)
    };
  },
  update: async (id: string, data: Partial<User>) => {
    const payload = {
      nome: data.name,
      login: data.login,
      senha: data.senha,
      comunidade_id: data.communityId ? parseInt(data.communityId) : null
    };
    await api.put(`/api/catequistas/${id}`, payload);
    
    // Backend returns 200 OK with empty body. We return the data we sent to update the local state.
    return {
      id: id,
      name: data.name || '',
      login: data.login || data.name || '',
      role: 'CATECHIST',
      communityId: data.communityId || undefined
    };
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/catequistas/${id}`);
    return response.data;
  }
};
