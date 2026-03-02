import React from 'react';
import { useAppContext } from '../store/AppContext';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Users, Percent, Calendar, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../lib/utils';

export function CatechistDashboard({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const { currentUser, students, meetings, attendances } = useAppContext();

  if (!currentUser) return null;

  const myStudents = students.filter(s => s.catechistId === currentUser.id);
  const myMeetings = meetings.filter(m => m.catechistId === currentUser.id);
  
  const completedMeetings = myMeetings.filter(m => m.status === 'COMPLETED');
  const pendingMeetings = myMeetings.filter(m => m.status === 'PENDING').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const nextMeeting = pendingMeetings.length > 0 ? pendingMeetings[0] : null;

  // Calculate class attendance %
  let totalRecords = 0;
  let presentRecords = 0;
  completedMeetings.forEach(m => {
    const records = attendances.filter(a => a.meetingId === m.id);
    totalRecords += records.length;
    presentRecords += records.filter(a => a.status === 'PRESENT').length;
  });
  const classAttendance = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vatican-red tracking-tight">Painel do Catequista</h1>
          <p className="text-slate-500 text-sm font-medium">Bem-vindo de volta, {currentUser.name.split(' ')[0]}</p>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Data de Hoje</p>
          <p className="text-sm font-bold text-vatican-red capitalize">
            {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="border-none shadow-sm bg-vatican-paper hover:shadow-md transition-all duration-300 rounded-3xl overflow-hidden group">
          <CardContent className="flex items-center p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-vatican-gold/10 text-vatican-gold group-hover:bg-vatican-gold group-hover:text-vatican-red transition-colors duration-300">
              <Users className="h-8 w-8" />
            </div>
            <div className="ml-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-1">Catequizandos</p>
              <h3 className="text-3xl font-serif font-bold text-slate-900">{myStudents.length}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-vatican-paper hover:shadow-md transition-all duration-300 rounded-3xl overflow-hidden group">
          <CardContent className="flex items-center p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
              <Percent className="h-8 w-8" />
            </div>
            <div className="ml-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-1">Frequência</p>
              <h3 className="text-3xl font-serif font-bold text-slate-900">{classAttendance}%</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-vatican-paper hover:shadow-md transition-all duration-300 rounded-3xl overflow-hidden group">
          <CardContent className="flex items-center p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-vatican-red/5 text-vatican-red group-hover:bg-vatican-red group-hover:text-white transition-colors duration-300">
              <Calendar className="h-8 w-8" />
            </div>
            <div className="ml-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-1">Encontros</p>
              <h3 className="text-3xl font-serif font-bold text-slate-900">{completedMeetings.length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Meeting Section */}
      <div>
        <h2 className="text-xl font-serif font-bold text-vatican-red mb-6 flex items-center">
          <Clock className="mr-2.5 h-6 w-6 text-vatican-gold" />
          Próximo Encontro
        </h2>
        
        {nextMeeting ? (
          <div className="relative overflow-hidden rounded-[2.5rem] bg-vatican-paper shadow-xl border border-vatican-cream group">
            <div className="absolute top-0 left-0 w-3 h-full bg-vatican-gold"></div>
            <div className="p-8 sm:p-12 sm:flex sm:items-center sm:justify-between relative z-10">
              <div className="mb-8 sm:mb-0">
                <div className="mb-4 flex items-center space-x-4">
                  <span className="inline-flex items-center rounded-full bg-vatican-gold/20 px-4 py-1.5 text-[10px] font-bold text-vatican-red uppercase tracking-[0.2em]">
                    Agendado
                  </span>
                  <span className="text-sm font-bold text-slate-400 capitalize flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-vatican-gold" />
                    {format(parseISO(nextMeeting.date), "EEEE, d 'de' MMMM", { locale: ptBR })}
                  </span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mb-3">{nextMeeting.theme}</h3>
                {nextMeeting.observations && (
                  <p className="text-slate-500 text-lg max-w-2xl font-medium leading-relaxed">{nextMeeting.observations}</p>
                )}
              </div>
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-vatican-red text-white hover:bg-vatican-red/90 shadow-2xl shadow-vatican-red/20 h-16 px-10 rounded-2xl font-bold text-lg transition-all duration-300 group-hover:scale-105"
                onClick={() => setActiveTab('meetings')}
              >
                Gerenciar <ArrowRight className="ml-2.5 h-6 w-6" />
              </Button>
            </div>
          </div>
        ) : (
          <Card className="border-dashed border-2 border-vatican-cream bg-vatican-paper/50 shadow-none rounded-[2.5rem]">
            <CardContent className="flex flex-col items-center justify-center p-16 text-center">
              <div className="bg-vatican-paper p-6 rounded-3xl shadow-sm mb-6 border border-vatican-cream">
                <BookOpen className="h-10 w-10 text-vatican-gold" />
              </div>
              <h3 className="mb-3 text-2xl font-serif font-bold text-slate-900">Nenhum encontro agendado</h3>
              <p className="mb-8 text-slate-500 max-w-sm mx-auto font-medium">Você não tem próximos encontros criados. Comece planejando suas próximas aulas para manter o cronograma em dia.</p>
              <Button 
                onClick={() => setActiveTab('meetings')} 
                variant="outline" 
                className="border-vatican-gold text-vatican-red hover:bg-vatican-gold hover:text-vatican-red h-12 px-8 rounded-xl font-bold"
              >
                Agendar Encontro
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
