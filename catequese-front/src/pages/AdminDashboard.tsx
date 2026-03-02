import React from 'react';
import { useAppContext } from '../store/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Users, BookOpen, Percent, Calendar, TrendingUp, Activity, Church } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../lib/utils';

export function AdminDashboard() {
  const { users, students, meetings, attendances } = useAppContext();

  const catechists = users.filter(u => u.role === 'CATECHIST');
  const totalCatechists = catechists.length;
  const totalStudents = students.length;

  // Calculate overall attendance %
  const totalRecords = attendances.length;
  const presentRecords = attendances.filter(a => a.status === 'PRESENT').length;
  const overallAttendance = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;

  // Calculate dynamic chart data based on completed meetings
  const completedMeetings = meetings.filter(m => m.status === 'COMPLETED');
  const monthStats: Record<string, { total: number; present: number }> = {};
  
  completedMeetings.forEach(m => {
    const month = format(parseISO(m.date), 'MMM', { locale: ptBR });
    if (!monthStats[month]) {
      monthStats[month] = { total: 0, present: 0 };
    }
    const meetingAttendances = attendances.filter(a => a.meetingId === m.id);
    monthStats[month].total += meetingAttendances.length;
    monthStats[month].present += meetingAttendances.filter(a => a.status === 'PRESENT').length;
  });

  const chartData = Object.entries(monthStats).map(([name, stats]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    freq: stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0
  }));

  // If no data, provide a default empty structure to avoid chart crash
  if (chartData.length === 0) {
    chartData.push({ name: format(new Date(), 'MMM', { locale: ptBR }), freq: 0 });
  }

  const upcomingMeetings = meetings
    .filter(m => m.status === 'PENDING')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vatican-red tracking-tight">Visão Geral</h1>
          <p className="text-slate-500 text-sm font-medium">Acompanhe os indicadores da catequese paroquial</p>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Data de Hoje</p>
          <p className="text-sm font-bold text-vatican-red capitalize">
            {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm bg-vatican-paper hover:shadow-md transition-all duration-300 rounded-3xl overflow-hidden group">
          <CardContent className="flex items-center p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-vatican-gold/10 text-vatican-gold group-hover:bg-vatican-gold group-hover:text-vatican-red transition-colors duration-300">
              <Users className="h-8 w-8" />
            </div>
            <div className="ml-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-1">Catequistas</p>
              <h3 className="text-3xl font-serif font-bold text-slate-900">{totalCatechists}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-vatican-paper hover:shadow-md transition-all duration-300 rounded-3xl overflow-hidden group">
          <CardContent className="flex items-center p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <BookOpen className="h-8 w-8" />
            </div>
            <div className="ml-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-1">Catequizandos</p>
              <h3 className="text-3xl font-serif font-bold text-slate-900">{totalStudents}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-vatican-paper hover:shadow-md transition-all duration-300 rounded-3xl overflow-hidden group">
          <CardContent className="flex items-center p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
              <Activity className="h-8 w-8" />
            </div>
            <div className="ml-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-1">Frequência Geral</p>
              <h3 className="text-3xl font-serif font-bold text-slate-900">{overallAttendance}%</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-vatican-paper hover:shadow-md transition-all duration-300 rounded-3xl overflow-hidden group">
          <CardContent className="flex items-center p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
              <TrendingUp className="h-8 w-8" />
            </div>
            <div className="ml-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-1">Média Mensal</p>
              <h3 className="text-3xl font-serif font-bold text-slate-900">89%</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card className="col-span-2 border-none shadow-sm bg-vatican-paper rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 pb-0">
            <CardTitle className="text-xl font-serif font-bold text-vatican-red">Evolução da Frequência</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorFreq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFCC00" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FFCC00" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                    domain={[0, 100]} 
                  />
                  <Tooltip
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                      backgroundColor: '#FFFFFF',
                      color: '#1e293b',
                      padding: '12px 16px'
                    }}
                    itemStyle={{ color: '#8B0000', fontWeight: 'bold' }}
                    labelStyle={{ color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold', fontSize: '10px', textTransform: 'uppercase' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="freq" 
                    stroke="#FFCC00" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorFreq)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-vatican-paper rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 pb-0">
            <CardTitle className="text-xl font-serif font-bold text-vatican-red">Próximos Encontros</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-5">
              {upcomingMeetings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Calendar className="h-12 w-12 text-slate-200 mb-4" />
                  <p className="text-sm font-medium text-slate-400">Nenhum encontro agendado para os próximos dias.</p>
                </div>
              ) : (
                upcomingMeetings.map(meeting => {
                  const catechist = catechists.find(c => c.id === meeting.catechistId);
                  return (
                    <div key={meeting.id} className="group flex items-center space-x-5 rounded-2xl border border-vatican-cream p-4 hover:bg-vatican-cream/50 transition-all duration-300">
                      <div className="flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-vatican-gold/10 text-vatican-red group-hover:bg-vatican-gold group-hover:text-vatican-red transition-all duration-300">
                        <span className="text-base font-bold leading-none">{format(parseISO(meeting.date), 'dd')}</span>
                        <span className="text-[10px] uppercase font-bold mt-1">{format(parseISO(meeting.date), 'MMM', { locale: ptBR })}</span>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate text-base font-serif font-bold text-slate-900">{meeting.theme}</p>
                        <p className="truncate text-xs font-bold text-slate-400 flex items-center mt-1">
                          <Church className="mr-1.5 h-3 w-3 text-vatican-gold" />
                          {catechist?.name}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
