import React, { useState } from 'react';
import { useAppContext, User } from '../store/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';

export function AdminCatechists() {
  const { users, students, communities, addUser, updateUser, deleteUser } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const [formData, setFormData] = useState({ name: '', login: '', senha: '', communityId: '' });

  const catechists = users.filter(u => u.role === 'CATECHIST');
  const filteredCatechists = catechists.filter(c => (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()));

  const [error, setError] = useState('');

  const handleOpenModal = (user?: User) => {
    setError('');
    if (user) {
      setEditingUser(user);
      setFormData({ name: user.name, login: user.login || '', senha: user.senha || '', communityId: user.communityId || '' });
    } else {
      setEditingUser(null);
      setFormData({ name: '', login: '', senha: '', communityId: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const dataToSave = { ...formData, communityId: formData.communityId || undefined };
    try {
      if (editingUser) {
        await updateUser(editingUser.id, dataToSave);
      } else {
        await addUser({ ...dataToSave, role: 'CATECHIST' });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ocorreu um erro ao salvar o catequista.');
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setDeleteConfirm('');
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteConfirm === 'CONFIRMAR' && deleteId) {
      deleteUser(deleteId);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-2xl font-bold text-slate-900">Gestão de Catequistas</h1>
        <Button onClick={() => handleOpenModal()} className="bg-[#FFF200] text-slate-900 hover:bg-[#E6D900]">
          <Plus className="mr-2 h-4 w-4" /> Novo Catequista
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="border-b border-slate-200 p-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Buscar catequista..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-700">
                <tr>
                  <th className="px-6 py-3">Nome</th>
                  <th className="px-6 py-3">Comunidade</th>
                  <th className="px-6 py-3">Total de Alunos</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredCatechists.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      Nenhum catequista encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredCatechists.map((catechist) => {
                    const totalStudents = students.filter(s => s.catechistId === catechist.id).length;
                    const community = communities.find(c => c.id === catechist.communityId);
                    return (
                      <tr key={catechist.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">{catechist.name}</td>
                        <td className="px-6 py-4">{community?.name || '-'}</td>
                        <td className="px-6 py-4">{totalStudents}</td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenModal(catechist)} className="text-slate-500 hover:text-yellow-600">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(catechist.id)} className="text-slate-500 hover:text-red-600">
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? "Editar Catequista" : "Novo Catequista"}>
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
            <label className="text-sm font-medium text-slate-700">Usuário de Acesso (Login)</label>
            <Input required value={formData.login} onChange={e => setFormData({ ...formData, login: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Senha</label>
            <Input type="password" required={!editingUser} value={formData.senha} onChange={e => setFormData({ ...formData, senha: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Comunidade (Opcional)</label>
            <select
              className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF200]"
              value={formData.communityId}
              onChange={e => setFormData({ ...formData, communityId: e.target.value })}
            >
              <option value="">Nenhuma comunidade vinculada</option>
              {communities.map(c => (
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

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Excluir Catequista">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Tem certeza que deseja excluir este catequista? Todos os encontros e alunos vinculados ficarão sem responsável.
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
