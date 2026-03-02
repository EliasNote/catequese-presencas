import React from 'react';
import { useAppContext } from '../store/AppContext';
import { Card, CardContent } from '../components/ui/Card';
import { Users } from 'lucide-react';

export function CatechistStudents() {
  const { currentUser, students, attendances } = useAppContext();

  if (!currentUser) return null;

  const myStudents = students.filter(s => s.catechistId === currentUser.id);

  const getStudentAbsences = (studentId: string) => {
    return attendances.filter(a => a.studentId === studentId && a.status === 'ABSENT').length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-2xl font-bold text-slate-900">Meus Catequizandos</h1>
        <div className="flex items-center space-x-2 rounded-lg bg-[#FFF200]/20 px-4 py-2 text-sm font-medium text-slate-900">
          <Users className="h-4 w-4" />
          <span>{myStudents.length} Alunos</span>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-700">
                <tr>
                  <th className="px-6 py-3">Nome do Catequizando</th>
                  <th className="px-6 py-3 text-center">Faltas Acumuladas</th>
                </tr>
              </thead>
              <tbody>
                {myStudents.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-8 text-center text-slate-500">
                      Nenhum catequizando vinculado a você.
                    </td>
                  </tr>
                ) : (
                  myStudents.map((student) => {
                    const absences = getStudentAbsences(student.id);
                    return (
                      <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">{student.name}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            absences > 3 ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {absences} faltas
                          </span>
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
    </div>
  );
}
