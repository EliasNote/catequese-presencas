import api from '../lib/api';
import { AttendanceRecord } from '../store/AppContext';

export const presencasService = {
  getAll: async () => {
    const response = await api.get('/api/presencas');
    return response.data.map((c: any) => ({
      id: String(c.id),
      meetingId: String(c.encontro?.id || c.encontro_id),
      studentId: String(c.catequizando?.id || c.catequizando_id),
      status: c.status === 'presente' ? 'PRESENT' : c.status === 'justificada' ? 'JUSTIFIED' : 'ABSENT',
      justification: c.justificativa
    }));
  },
  getById: async (id: string) => {
    const response = await api.get(`/api/presencas/${id}`);
    const c = response.data;
    return {
      id: String(c.id),
      meetingId: String(c.encontro?.id || c.encontro_id),
      studentId: String(c.catequizando?.id || c.catequizando_id),
      status: c.status === 'presente' ? 'PRESENT' : c.status === 'justificada' ? 'JUSTIFIED' : 'ABSENT',
      justification: c.justificativa
    };
  },
  create: async (data: Partial<AttendanceRecord>) => {
    const payload = {
      encontro_id: data.meetingId ? parseInt(data.meetingId) : undefined,
      catequizando_id: data.studentId ? parseInt(data.studentId) : undefined,
      status: data.status === 'PRESENT' ? 'presente' : data.status === 'JUSTIFIED' ? 'justificada' : 'falta',
      justificativa: data.justification
    };
    const response = await api.post('/api/presencas', payload);
    const c = response.data;
    return {
      id: String(c.id),
      meetingId: String(c.encontro?.id || c.encontro_id),
      studentId: String(c.catequizando?.id || c.catequizando_id),
      status: c.status === 'presente' ? 'PRESENT' : c.status === 'justificada' ? 'JUSTIFIED' : 'ABSENT',
      justification: c.justificativa
    };
  },
  update: async (id: string, data: Partial<AttendanceRecord>) => {
    const payload = {
      status: data.status === 'PRESENT' ? 'presente' : data.status === 'JUSTIFIED' ? 'justificada' : 'falta',
      justificativa: data.justification
    };
    const response = await api.put(`/api/presencas/${id}`, payload);
    const c = response.data;
    return {
      id: String(c.id),
      meetingId: String(c.encontro?.id || c.encontro_id),
      studentId: String(c.catequizando?.id || c.catequizando_id),
      status: c.status === 'presente' ? 'PRESENT' : c.status === 'justificada' ? 'JUSTIFIED' : 'ABSENT',
      justification: c.justificativa
    };
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/presencas/${id}`);
    return response.data;
  }
};
