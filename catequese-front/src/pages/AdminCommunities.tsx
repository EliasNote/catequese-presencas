import React, { useState } from 'react';
import { useAppContext, Community } from '../store/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';

export function AdminCommunities() {
  const { communities, users, addCommunity, updateCommunity, deleteCommunity } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCommunity, setEditingCommunity] = useState<Community | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const [formData, setFormData] = useState({ name: '' });

  const filteredCommunities = communities.filter(c => (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()));

  const [error, setError] = useState('');

  const handleOpenModal = (community?: Community) => {
    setError('');
    if (community) {
      setEditingCommunity(community);
      setFormData({ name: community.name });
    } else {
      setEditingCommunity(null);
      setFormData({ name: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editingCommunity) {
        await updateCommunity(editingCommunity.id, { ...formData });
      } else {
        await addCommunity({ ...formData });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ocorreu um erro ao salvar a comunidade.');
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
        await deleteCommunity(deleteId);
        setIsDeleteModalOpen(false);
      } catch (err: any) {
        alert(err.response?.data?.error || 'Ocorreu um erro ao excluir a comunidade.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-2xl font-bold text-slate-900">Gestão de Comunidades</h1>
        <Button onClick={() => handleOpenModal()} className="bg-[#FFF200] text-slate-900 hover:bg-[#E6D900]">
          <Plus className="mr-2 h-4 w-4" /> Nova Comunidade
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="border-b border-slate-200 p-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Buscar comunidade..."
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
                  <th className="px-6 py-3">Nome da Comunidade</th>
                  <th className="px-6 py-3">Catequistas Vinculados</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredCommunities.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                      Nenhuma comunidade encontrada.
                    </td>
                  </tr>
                ) : (
                  filteredCommunities.map((community) => {
                    const linkedCatechists = users.filter(u => u.communityId === community.id).length;
                    return (
                      <tr key={community.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">{community.name}</td>
                        <td className="px-6 py-4">{linkedCatechists}</td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenModal(community)} className="text-slate-500 hover:text-yellow-600">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(community.id)} className="text-slate-500 hover:text-red-600">
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCommunity ? "Editar Comunidade" : "Nova Comunidade"}>
        <form onSubmit={handleSave} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Nome da Comunidade</label>
            <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Matriz São José" />
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" className="bg-[#FFF200] text-slate-900 hover:bg-[#E6D900]">Salvar</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Excluir Comunidade">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Tem certeza que deseja excluir esta comunidade? Os catequistas vinculados a ela ficarão sem comunidade atribuída.
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
