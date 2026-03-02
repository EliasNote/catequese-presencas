import React, { useState, useMemo } from 'react';
import { useAppContext } from '../store/AppContext';
import { Button } from '../components/ui/Button';
import { 
  Check, 
  X, 
  AlertCircle, 
  Save, 
  ChevronLeft,
  Users,
  Calendar,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AttendanceStatus } from '../store/AppContext';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../lib/utils';

export function CatechistAttendance({ meetingId, setActiveTab }: { meetingId: string; setActiveTab: (tab: string) => void }) {
  const { students, meetings, attendances, saveAttendance, currentUser } = useAppContext();
  const [attendanceState, setAttendanceState] = useState<Record<string, AttendanceStatus>>({});
  const [justifications, setJustifications] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const meeting = meetings.find(m => m.id === meetingId);
  const myStudents = useMemo(() => students.filter(s => s.catechistId === currentUser?.id), [students, currentUser]);

  // Initialize state from existing attendances if any
  React.useEffect(() => {
    const existing = attendances.filter(a => a.meetingId === meetingId);
    const newState: Record<string, AttendanceStatus> = {};
    const newJustifications: Record<string, string> = {};
    
    existing.forEach(a => {
      newState[a.studentId] = a.status;
      if (a.justification) newJustifications[a.studentId] = a.justification;
    });
    
    setAttendanceState(newState);
    setJustifications(newJustifications);
  }, [meetingId, attendances]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceState(prev => ({ ...prev, [studentId]: status }));
  };

  const handleJustificationChange = (studentId: string, text: string) => {
    setJustifications(prev => ({ ...prev, [studentId]: text }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const attendanceData = myStudents.map(student => ({
        studentId: student.id,
        status: attendanceState[student.id] || 'ABSENT',
        justification: justifications[student.id] || ''
      }));
      
      await saveAttendance(meetingId, attendanceData);
      setActiveTab('meetings');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const presentCount = Object.values(attendanceState).filter(s => s === 'PRESENT').length;
  const absentCount = Object.values(attendanceState).filter(s => s === 'ABSENT').length;
  const justifiedCount = Object.values(attendanceState).filter(s => s === 'JUSTIFIED').length;
  const total = myStudents.length;
  const allSelected = Object.keys(attendanceState).length === total;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!meeting) return null;

  return (
    <div className="pb-32">
      {/* Header */}
      <header className="mb-8">
        <button 
          onClick={() => setActiveTab('meetings')}
          className="mb-4 flex items-center text-vatican-red hover:translate-x--1 transition-transform font-bold text-sm uppercase tracking-wider"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Voltar para Encontros
        </button>
        
        <div className="bg-vatican-paper rounded-3xl p-6 shadow-sm border border-vatican-cream relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-vatican-gold/5 rounded-full -mr-16 -mt-16" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-vatican-gold/20 text-vatican-red px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                Chamada do Dia
              </span>
              <span className="text-slate-400 text-xs font-medium flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {format(parseISO(meeting.date), "dd 'de' MMMM", { locale: ptBR })}
              </span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-vatican-red mb-1">{meeting.theme}</h1>
            <p className="text-slate-500 text-sm flex items-center">
              <Users className="w-4 h-4 mr-1.5 text-vatican-gold" />
              {total} Catequizandos na turma
            </p>
          </div>
        </div>
      </header>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-white rounded-2xl p-4 border border-vatican-cream shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Presentes</p>
          <p className="text-2xl font-serif font-bold text-green-600">{presentCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-vatican-cream shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Faltas</p>
          <p className="text-2xl font-serif font-bold text-vatican-red">{absentCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-vatican-cream shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Justif.</p>
          <p className="text-2xl font-serif font-bold text-vatican-gold">{justifiedCount}</p>
        </div>
      </div>

      {/* Student List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {myStudents.map((student, index) => {
            const status = attendanceState[student.id];
            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                layout
                className={cn(
                  "group relative bg-vatican-paper rounded-2xl p-5 shadow-sm border transition-all duration-300",
                  status === 'PRESENT' ? 'border-green-100 shadow-green-50/50' :
                  status === 'ABSENT' ? 'border-vatican-red/10 shadow-vatican-red/5' :
                  status === 'JUSTIFIED' ? 'border-vatican-gold/20 shadow-vatican-gold/5' :
                  'border-vatican-cream'
                )}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className={cn(
                    "flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-base font-bold transition-all duration-300 border-2",
                    status === 'PRESENT' ? 'bg-green-50 text-green-700 border-green-100' :
                    status === 'ABSENT' ? 'bg-vatican-red/5 text-vatican-red border-vatican-red/10' :
                    status === 'JUSTIFIED' ? 'bg-vatican-gold/5 text-vatican-red border-vatican-gold/10' :
                    'bg-vatican-cream text-slate-400 border-transparent'
                  )}>
                    {getInitials(student.name)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-serif font-bold text-slate-900 text-lg truncate">{student.name}</h3>
                    <div className="flex items-center mt-0.5">
                      <div className={cn(
                        "w-2 h-2 rounded-full mr-2",
                        status === 'PRESENT' ? 'bg-green-500' :
                        status === 'ABSENT' ? 'bg-vatican-red' :
                        status === 'JUSTIFIED' ? 'bg-vatican-gold' : 'bg-slate-300'
                      )} />
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {status === 'PRESENT' ? 'Confirmado' : 
                         status === 'ABSENT' ? 'Falta' : 
                         status === 'JUSTIFIED' ? 'Justificado' : 'Aguardando...'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Big Accessible Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleStatusChange(student.id, 'PRESENT')}
                    className={cn(
                      "relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300",
                      status === 'PRESENT' 
                        ? "bg-green-50 border-green-500 text-green-700 shadow-inner" 
                        : "bg-white border-vatican-cream text-slate-400 hover:border-green-200 hover:bg-green-50/30"
                    )}
                  >
                    <div className={cn("mb-1.5 rounded-full p-1.5", status === 'PRESENT' ? "bg-green-500 text-white" : "bg-vatican-cream")}>
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Presente</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange(student.id, 'ABSENT')}
                    className={cn(
                      "relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300",
                      status === 'ABSENT' 
                        ? "bg-vatican-red/5 border-vatican-red text-vatican-red shadow-inner" 
                        : "bg-white border-vatican-cream text-slate-400 hover:border-vatican-red/20 hover:bg-vatican-red/5"
                    )}
                  >
                    <div className={cn("mb-1.5 rounded-full p-1.5", status === 'ABSENT' ? "bg-vatican-red text-white" : "bg-vatican-cream")}>
                      <X className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Falta</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange(student.id, 'JUSTIFIED')}
                    className={cn(
                      "relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300",
                      status === 'JUSTIFIED' 
                        ? "bg-vatican-gold/10 border-vatican-gold text-vatican-red shadow-inner" 
                        : "bg-white border-vatican-cream text-slate-400 hover:border-vatican-gold/30 hover:bg-vatican-gold/5"
                    )}
                  >
                    <div className={cn("mb-1.5 rounded-full p-1.5", status === 'JUSTIFIED' ? "bg-vatican-gold text-vatican-red" : "bg-vatican-cream")}>
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Justif.</span>
                  </button>
                </div>

                {/* Justification Input */}
                <AnimatePresence>
                  {status === 'JUSTIFIED' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-vatican-cream">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Info className="w-3 h-3 text-vatican-gold" />
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Motivo da justificativa</label>
                        </div>
                        <input
                          type="text"
                          placeholder="Ex: Atestado médico, Viagem..."
                          className="w-full bg-vatican-cream/50 border border-vatican-cream rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-vatican-gold transition-all"
                          value={justifications[student.id] || ''}
                          onChange={(e) => handleJustificationChange(student.id, e.target.value)}
                          autoFocus
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Floating Footer Action */}
      <div className="fixed bottom-8 left-0 right-0 z-40 px-4 flex justify-center pointer-events-none">
        <div className="w-full max-w-md pointer-events-auto">
          <div className="bg-vatican-paper/90 backdrop-blur-xl p-3 rounded-3xl shadow-2xl border border-vatican-cream flex items-center gap-4">
            <div className="flex-1 px-4">
              <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-400 mb-0.5">Progresso</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-serif font-bold text-vatican-red">{presentCount + absentCount + justifiedCount}</span>
                <span className="text-sm font-medium text-slate-300">/ {total}</span>
              </div>
            </div>
            <Button
              size="lg"
              className={cn(
                "h-14 px-8 rounded-2xl font-bold transition-all duration-500",
                allSelected 
                  ? "bg-vatican-red text-white hover:bg-vatican-red/90 shadow-xl shadow-vatican-red/20" 
                  : "bg-vatican-cream text-slate-300 cursor-not-allowed"
              )}
              disabled={!allSelected || isSaving}
              onClick={handleSave}
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Salvando
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  Salvar Chamada
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
