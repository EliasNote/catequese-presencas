import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Download, Filter } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function AdminReports() {
  const { users, students, meetings, attendances, communities } = useAppContext();
  const catechists = users.filter(u => u.role === 'CATECHIST');
  
  const [selectedCommunity, setSelectedCommunity] = useState<string>('');
  
  const filteredCatechists = selectedCommunity 
    ? catechists.filter(c => c.communityId === selectedCommunity)
    : catechists;

  const [selectedCatechist, setSelectedCatechist] = useState<string>(filteredCatechists.length > 0 ? filteredCatechists[0].id : '');
  const [reportType, setReportType] = useState<'MONTH' | 'MEETING'>('MONTH');
  const [selectedMonth, setSelectedMonth] = useState<string>('03'); // Default March for mock data
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>('');

  const handleExportPDF = () => {
    alert('Funcionalidade de exportar para PDF será implementada em breve!');
  };

  const filteredStudents = students.filter(s => s.catechistId === selectedCatechist);
  const catechistMeetings = meetings.filter(m => m.catechistId === selectedCatechist && m.status === 'COMPLETED').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const filteredMeetings = catechistMeetings.filter(m => {
    const meetingMonth = format(parseISO(m.date), 'MM');
    return meetingMonth === selectedMonth;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const specificMeeting = catechistMeetings.find(m => m.id === selectedMeetingId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-2xl font-bold text-slate-900">Relatórios de Frequência</h1>
        <Button onClick={handleExportPDF} className="bg-[#FFF200] text-slate-900 hover:bg-[#E6D900]">
          <Download className="mr-2 h-4 w-4" /> Exportar PDF
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end flex-wrap">
            <div className="space-y-1.5 flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-slate-700">Comunidade</label>
              <select
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF200]"
                value={selectedCommunity}
                onChange={e => {
                  setSelectedCommunity(e.target.value);
                  const newFiltered = e.target.value ? catechists.filter(c => c.communityId === e.target.value) : catechists;
                  if (newFiltered.length > 0) {
                    setSelectedCatechist(newFiltered[0].id);
                  } else {
                    setSelectedCatechist('');
                  }
                }}
              >
                <option value="">Todas as Comunidades</option>
                {communities.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-slate-700">Catequista</label>
              <select
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF200]"
                value={selectedCatechist}
                onChange={e => setSelectedCatechist(e.target.value)}
              >
                {filteredCatechists.length === 0 ? (
                  <option value="" disabled>Nenhum catequista</option>
                ) : (
                  filteredCatechists.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))
                )}
              </select>
            </div>
            <div className="space-y-1.5 flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-slate-700">Tipo de Relatório</label>
              <select
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF200]"
                value={reportType}
                onChange={e => setReportType(e.target.value as 'MONTH' | 'MEETING')}
              >
                <option value="MONTH">Visão Mensal</option>
                <option value="MEETING">Por Encontro</option>
              </select>
            </div>
            {reportType === 'MONTH' ? (
              <div className="space-y-1.5 flex-1">
                <label className="text-sm font-medium text-slate-700">Mês</label>
                <select
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF200]"
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(e.target.value)}
                >
                  <option value="01">Janeiro</option>
                  <option value="02">Fevereiro</option>
                  <option value="03">Março</option>
                  <option value="04">Abril</option>
                  <option value="05">Maio</option>
                  <option value="06">Junho</option>
                </select>
              </div>
            ) : (
              <div className="space-y-1.5 flex-1">
                <label className="text-sm font-medium text-slate-700">Encontro</label>
                <select
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF200]"
                  value={selectedMeetingId}
                  onChange={e => setSelectedMeetingId(e.target.value)}
                >
                  <option value="" disabled>Selecione um encontro</option>
                  {catechistMeetings.map(m => (
                    <option key={m.id} value={m.id}>
                      {format(parseISO(m.date), 'dd/MM/yyyy')} - {m.theme}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <Button variant="outline" className="h-10">
              <Filter className="mr-2 h-4 w-4" /> Filtrar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {reportType === 'MONTH' ? (
            filteredMeetings.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                Nenhum encontro realizado neste período para esta turma.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-700">
                    <tr>
                      <th className="px-6 py-3 border-r border-slate-200">Catequizando</th>
                      {filteredMeetings.map(m => (
                        <th key={m.id} className="px-4 py-3 text-center border-r border-slate-200 min-w-[100px]">
                          <div className="font-bold">{format(parseISO(m.date), 'dd/MM')}</div>
                          <div className="text-[10px] font-normal truncate max-w-[100px]" title={m.theme}>{m.theme}</div>
                        </th>
                      ))}
                      <th className="px-6 py-3 text-center">% Freq.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(student => {
                      let presentCount = 0;
                      return (
                        <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-6 py-4 font-medium text-slate-900 border-r border-slate-200">{student.name}</td>
                          {filteredMeetings.map(m => {
                            const record = attendances.find(a => a.meetingId === m.id && a.studentId === student.id);
                            if (record?.status === 'PRESENT') presentCount++;
                            
                            let statusColor = 'text-slate-300';
                            let statusText = '-';
                            if (record?.status === 'PRESENT') { statusColor = 'text-green-600'; statusText = 'P'; }
                            if (record?.status === 'ABSENT') { statusColor = 'text-red-600'; statusText = 'F'; }
                            if (record?.status === 'JUSTIFIED') { statusColor = 'text-yellow-500'; statusText = 'J'; }

                            return (
                              <td key={m.id} className={`px-4 py-4 text-center font-bold border-r border-slate-200 ${statusColor}`}>
                                {statusText}
                              </td>
                            );
                          })}
                          <td className="px-6 py-4 text-center font-bold text-yellow-600">
                            {Math.round((presentCount / filteredMeetings.length) * 100)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="p-4 flex gap-4 text-xs text-slate-500 bg-slate-50 border-t border-slate-200">
                  <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span> P - Presente</span>
                  <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span> F - Falta</span>
                  <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#FFF200] mr-1"></span> J - Justificada</span>
                </div>
              </div>
            )
          ) : (
            !specificMeeting ? (
              <div className="p-8 text-center text-slate-500">
                Selecione um encontro para visualizar a chamada.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-700">
                    <tr>
                      <th className="px-6 py-3">Catequizando</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Justificativa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(student => {
                      const record = attendances.find(a => a.meetingId === specificMeeting.id && a.studentId === student.id);
                      
                      let statusBadge = <span className="text-slate-400">-</span>;
                      if (record?.status === 'PRESENT') {
                        statusBadge = <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Presente</span>;
                      } else if (record?.status === 'ABSENT') {
                        statusBadge = <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">Falta</span>;
                      } else if (record?.status === 'JUSTIFIED') {
                        statusBadge = <span className="inline-flex items-center rounded-full bg-[#FFF200]/20 px-2.5 py-0.5 text-xs font-medium text-slate-900">Justificada</span>;
                      }

                      return (
                        <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-6 py-4 font-medium text-slate-900">{student.name}</td>
                          <td className="px-6 py-4">{statusBadge}</td>
                          <td className="px-6 py-4 text-slate-500 italic">
                            {record?.status === 'JUSTIFIED' ? (record.justification || 'Nenhuma justificativa informada.') : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
