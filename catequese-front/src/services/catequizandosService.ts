import api from '../lib/api';
import { Student } from '../store/AppContext';

export const catequizandosService = {
  getAll: async () => {
    const response = await api.get('/api/catequizandos');
    return response.data.map((c: any) => ({
      id: String(c.id),
      name: c.nome,
      catechistId: c.catequista?.id ? String(c.catequista.id) : c.catequista_id ? String(c.catequista_id) : ''
    }));
  },
  getById: async (id: string) => {
    const response = await api.get(`/api/catequizandos/${id}`);
    const c = response.data;
    return {
      id: String(c.id),
      name: c.nome,
      catechistId: c.catequista?.id ? String(c.catequista.id) : c.catequista_id ? String(c.catequista_id) : ''
    };
  },
  create: async (data: Partial<Student>) => {
    const payload = {
      nome: data.name,
      catequista_id: data.catechistId ? parseInt(data.catechistId) : null
    };
    const response = await api.post('/api/catequizandos', payload);
    const c = response.data;
    
    const responseCatechistId = c.catequista?.id ? String(c.catequista.id) : (c.catequista_id !== undefined && c.catequista_id !== null) ? String(c.catequista_id) : undefined;

    return {
      id: String(c.id),
      name: c.nome || data.name,
      catechistId: responseCatechistId !== undefined ? responseCatechistId : (data.catechistId || '')
    };
  },
  update: async (id: string, data: Partial<Student>) => {
    const payload = {
      nome: data.name,
      catequista_id: data.catechistId ? parseInt(data.catechistId, 10) : null
    };
    
    await api.put(`/api/catequizandos/${id}`, payload);
    
    // Backend returns 200 OK with empty body. We return the data we sent to update the local state.
    return {
      id: id,
      name: data.name || '',
      catechistId: data.catechistId || ''
    };
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/catequizandos/${id}`);
    return response.data;
  }
};
