import React, { useState } from 'react';
import { useAppContext, Student } from '../store/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Search, Plus, Edit2, Trash2, Filter } from 'lucide-react';

export function AdminStudents() {
  const { students, users, attendances, addStudent, updateStudent, deleteStudent } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCatechist, setFilterCatechist] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const [formData, setFormData] = useState({ name: '', catechistId: '' });

  const catechists = users.filter(u => u.role === 'CATECHIST');

  const filteredStudents = students.filter(s => {
    const matchesSearch = (s.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCatechist === 'ALL' || s.catechistId === filterCatechist;
    return matchesSearch && matchesFilter;
  });

  const [error, setError] = useState('');

  const handleOpenModal = (student?: Student) => {
    setError('');
    if (student) {
      setEditingStudent(student);
      setFormData({ name: student.name, catechistId: student.catechistId });
    } else {
      setEditingStudent(null);
      setFormData({ name: '', catechistId: catechists.length > 0 ? catechists[0].id : '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, { ...formData });
      } else {
        await addStudent({ ...formData });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ocorreu um erro ao salvar o catequizando.');
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
        await deleteStudent(deleteId);
        setIsDeleteModalOpen(false);
      } catch (err: any) {
        alert(err.response?.data?.error || 'Ocorreu um erro ao excluir o catequizando.');
      }
    }
  };

  const getAttendancePercentage = (studentId: string) => {
    const studentRecords = attendances.filter(a => a.studentId === studentId);
    if (studentRecords.length === 0) return '-';
    const presentCount = studentRecords.filter(a => a.status === 'PRESENT').length;
    return `${Math.round((presentCount / studentRecords.length) * 100)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-2xl font-bold text-slate-900">Gestão de Catequizandos</h1>
        <Button onClick={() => handleOpenModal()} className="bg-[#FFF200] text-slate-900 hover:bg-[#E6D900]">
          <Plus className="mr-2 h-4 w-4" /> Novo Catequizando
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Buscar catequizando..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <select
                className="h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-[#FFF200] focus:outline-none focus:ring-1 focus:ring-[#FFF200]"
                value={filterCatechist}
                onChange={(e) => setFilterCatechist(e.target.value)}
              >
                <option value="ALL">Todos os Catequistas</option>
                {catechists.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-700">
                <tr>
                  <th className="px-6 py-3">Nome do Catequizando</th>
                  <th className="px-6 py-3">Vinculado a</th>
                  <th className="px-6 py-3">Frequência</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      Nenhum catequizando encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => {
                    const catechist = catechists.find(c => c.id === student.catechistId);
                    return (
                      <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">{student.name}</td>
                        <td className="px-6 py-4">{catechist?.name || '-'}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full bg-[#FFF200]/20 px-2.5 py-0.5 text-xs font-medium text-slate-900">
                            {getAttendancePercentage(student.id)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenModal(student)} className="text-slate-500 hover:text-yellow-600">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(student.id)} className="text-slate-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStudent ? "Editar Catequizando" : "Novo Catequizando"}>
        <form onSubmit={handleSave} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Nome Completo</label>
            <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Catequista Responsável</label>
            <select
              required
              className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF200]"
              value={formData.catechistId}
              onChange={e => setFormData({ ...formData, catechistId: e.target.value })}
            >
              <option value="" disabled>Selecione um catequista</option>
              {catechists.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" className="bg-[#FFF200] text-slate-900 hover:bg-[#E6D900]">Salvar</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Excluir Catequizando">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Tem certeza que deseja excluir este catequizando? Todos os registros de presença serão perdidos.
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
