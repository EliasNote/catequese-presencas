import React, { useState } from 'react';
import { useAppContext, Meeting } from '../store/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { DatePicker } from '../components/ui/DatePicker';
import { Card, CardContent } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Plus, Calendar, Clock, Edit2, Trash2, ArrowRight, BookOpen } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function CatechistMeetings({ setActiveTab, setSelectedMeeting }: { setActiveTab: (tab: string) => void, setSelectedMeeting: (id: string) => void }) {
  const { currentUser, meetings, addMeeting, updateMeeting, deleteMeeting } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newMeetingId, setNewMeetingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({ date: '', theme: '', observations: '' });

  const [deleteConfirm, setDeleteConfirm] = useState('');

  if (!currentUser) return null;

  const myMeetings = meetings.filter(m => m.catechistId === currentUser.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleOpenModal = (meeting?: Meeting) => {
    if (meeting) {
      setEditingMeeting(meeting);
      setFormData({ date: format(parseISO(meeting.date), 'dd/MM/yyyy'), theme: meeting.theme, observations: meeting.observations || '' });
    } else {
      setEditingMeeting(null);
      setFormData({ date: '', theme: '', observations: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const parts = formData.date.split('/');
    if (parts.length !== 3 || parts[2].length !== 4) {
      alert('Por favor, insira uma data válida no formato DD/MM/AAAA');
      return;
    }
    const [day, month, year] = parts;
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    
    if (m < 1 || m > 12 || d < 1 || d > new Date(y, m, 0).getDate() || y < 1900 || y > 2100) {
      alert('Data inválida. Verifique o dia, mês e ano.');
      return;
    }

    const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00Z`;

    try {
      if (editingMeeting) {
        await updateMeeting(editingMeeting.id, { ...formData, date: isoDate });
        setIsModalOpen(false);
      } else {
        const id = await addMeeting({ ...formData, date: isoDate, catechistId: currentUser.id });
        setIsModalOpen(false);
        setNewMeetingId(id);
        setIsSuccessModalOpen(true);
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ocorreu um erro ao salvar o encontro.');
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setDeleteConfirm('');
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteConfirm === 'CONFIRMAR' && deleteId) {
      try {
        await deleteMeeting(deleteId);
        setIsDeleteModalOpen(false);
      } catch (error: any) {
        alert(error.response?.data?.error || 'Ocorreu um erro ao excluir o encontro.');
      }
    }
  };

  const handleRegisterAttendance = (id: string) => {
    setSelectedMeeting(id);
    setActiveTab('attendance');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-2xl font-bold text-slate-900">Meus Encontros</h1>
        <Button onClick={() => handleOpenModal()} className="bg-[#FFF200] text-slate-900 hover:bg-[#E6D900]">
          <Plus className="mr-2 h-4 w-4" /> Criar Encontro
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {myMeetings.length === 0 ? (
          <div className="col-span-full p-8 text-center text-slate-500">
            Nenhum encontro criado.
          </div>
        ) : (
          myMeetings.map((meeting) => (
            <Card key={meeting.id} className="flex flex-col overflow-hidden transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-4 py-3">
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <Calendar className="h-4 w-4" />
                  <span>{format(parseISO(meeting.date), "dd/MM/yyyy", { locale: ptBR })}</span>
                </div>
                <Badge variant={meeting.status === 'COMPLETED' ? 'success' : 'warning'}>
                  {meeting.status === 'COMPLETED' ? 'Realizado' : 'Pendente'}
                </Badge>
              </div>
              <CardContent className="flex flex-1 flex-col p-4">
                <h3 className="mb-2 text-lg font-bold text-slate-900 line-clamp-2">{meeting.theme}</h3>
                {meeting.observations && (
                  <p className="mb-4 text-sm text-slate-500 line-clamp-2 flex-1">{meeting.observations}</p>
                )}
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(meeting)} className="h-8 w-8 text-slate-500 hover:text-yellow-600">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(meeting.id)} className="h-8 w-8 text-slate-500 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    variant={meeting.status === 'COMPLETED' ? 'outline' : 'default'}
                    size="sm" 
                    className={meeting.status === 'COMPLETED' ? '' : 'bg-[#FFF200] text-slate-900 hover:bg-[#E6D900]'}
                    onClick={() => handleRegisterAttendance(meeting.id)}
                  >
                    {meeting.status === 'COMPLETED' ? 'Ver Chamada' : 'Fazer Chamada'} <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMeeting ? "Editar Encontro" : "Criar Encontro"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Data</label>
            <DatePicker 
              value={formData.date} 
              onChange={date => setFormData({ ...formData, date })} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Tema do Encontro</label>
            <input 
              type="text"
              required 
              className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF200]"
              value={formData.theme} 
              onChange={e => setFormData({ ...formData, theme: e.target.value })} 
              placeholder="Ex: A Criação" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Observações / Material (Opcional)</label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF200]"
              value={formData.observations}
              onChange={e => setFormData({ ...formData, observations: e.target.value })}
              placeholder="Ex: Levar bíblia e caderno"
            />
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" className="bg-[#FFF200] text-slate-900 hover:bg-[#E6D900]">Salvar</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)} title="Encontro Criado!">
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <BookOpen className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-sm text-slate-600">
            O encontro foi criado com sucesso. Deseja registrar a presença dos catequizandos agora?
          </p>
          <div className="mt-6 flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0 sm:justify-center">
            <Button type="button" variant="outline" onClick={() => setIsSuccessModalOpen(false)}>Pular por enquanto</Button>
            <Button type="button" className="bg-[#FFF200] text-slate-900 hover:bg-[#E6D900]" onClick={() => {
              setIsSuccessModalOpen(false);
              if (newMeetingId) handleRegisterAttendance(newMeetingId);
            }}>
              Fazer Chamada Agora
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Excluir Encontro">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Tem certeza que deseja excluir este encontro? Todos os registros de presença vinculados a ele serão perdidos.
            Para confirmar, digite <strong>CONFIRMAR</strong> abaixo.
          </p>
          <Input value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder="CONFIRMAR" />
          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
            <Button type="button" variant="danger" disabled={deleteConfirm !== 'CONFIRMAR'} onClick={confirmDelete}>Excluir</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
