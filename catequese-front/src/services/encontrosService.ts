import api from '../lib/api';
import { Meeting } from '../store/AppContext';

export const encontrosService = {
  getAll: async () => {
    const response = await api.get('/api/encontros');
    return response.data.map((c: any) => ({
      id: String(c.id),
      catechistId: String(c.catequista?.id || c.catequista_id),
      date: c.data,
      theme: c.tema,
      observations: c.observacoes,
      // Derive status from presences if available, otherwise default to PENDING
      status: (c.presencas && c.presencas.length > 0) ? 'COMPLETED' : 'PENDING'
    }));
  },
  getById: async (id: string) => {
    const response = await api.get(`/api/encontros/${id}`);
    const c = response.data;
    return {
      id: String(c.id),
      catechistId: String(c.catequista?.id || c.catequista_id),
      date: c.data,
      theme: c.tema,
      observations: c.observacoes,
      status: (c.presencas && c.presencas.length > 0) ? 'COMPLETED' : 'PENDING'
    };
  },
  create: async (data: Partial<Meeting>) => {
    const payload = {
      catequista_id: data.catechistId ? parseInt(data.catechistId) : undefined,
      data: data.date,
      tema: data.theme,
      observacoes: data.observations
    };
    const response = await api.post('/api/encontros', payload);
    const c = response.data;
    return {
      id: String(c.id),
      catechistId: String(c.catequista?.id || c.catequista_id),
      date: c.data,
      theme: c.tema,
      observations: c.observacoes,
      status: 'PENDING'
    };
  },
  update: async (id: string, data: Partial<Meeting>) => {
    const payload = {
      catequista_id: data.catechistId ? parseInt(data.catechistId) : undefined,
      data: data.date,
      tema: data.theme,
      observacoes: data.observations
    };
    await api.put(`/api/encontros/${id}`, payload);
    
    // Backend returns 200 OK with empty body. We return the data we sent to update the local state.
    return {
      id: id,
      catechistId: data.catechistId || '',
      date: data.date || '',
      theme: data.theme || '',
      observations: data.observations || '',
      status: data.status || 'PENDING'
    };
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/encontros/${id}`);
    return response.data;
  }
};
