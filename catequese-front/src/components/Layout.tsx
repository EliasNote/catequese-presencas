import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { Button } from './ui/Button';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ClipboardCheck, 
  LogOut, 
  Menu, 
  X, 
  Church,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const { currentUser, logout } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!currentUser) return <>{children}</>;

  const handleLogout = () => {
    logout();
  };

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const NavItem = ({ tab, icon: Icon, label }: { tab: string; icon: any; label: string }) => {
    const isActive = activeTab === tab;
    return (
      <button
        onClick={() => handleNavClick(tab)}
        className={cn(
          "group relative flex w-full items-center rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-300",
          isActive
            ? "bg-vatican-gold text-slate-900 shadow-md shadow-vatican-gold/20"
            : "text-slate-500 hover:bg-vatican-cream hover:text-vatican-red"
        )}
      >
        <Icon className={cn("mr-3 h-5 w-5 transition-colors", isActive ? "text-slate-900" : "text-vatican-gold group-hover:text-vatican-red")} />
        <span className={cn("flex-1 text-left", isActive ? "font-bold" : "font-medium")}>{label}</span>
        {isActive && <ChevronRight className="h-4 w-4 text-slate-900 opacity-50" />}
      </button>
    );
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-vatican-paper">
      <div className="flex h-24 flex-col items-center justify-center px-6 border-b border-vatican-cream">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-vatican-gold shadow-lg shadow-vatican-gold/30 mb-2">
          <Church className="h-7 w-7 text-vatican-red" />
        </div>
        <h1 className="text-xl font-serif font-bold text-vatican-red tracking-tight leading-none">Catedral</h1>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Sistema de Catequese</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-2">
        {currentUser?.role === 'ADMIN' ? (
          <>
            <div className="px-4 pb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mt-2">Administração</div>
            <NavItem tab="dashboard" icon={LayoutDashboard} label="Visão Geral" />
            <NavItem tab="catechists" icon={Users} label="Catequistas" />
            <NavItem tab="students" icon={BookOpen} label="Catequizandos" />
            <NavItem tab="communities" icon={Church} label="Comunidades" />
            <NavItem tab="reports" icon={ClipboardCheck} label="Relatórios" />
          </>
        ) : (
          <>
            <div className="px-4 pb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mt-2">Catequese</div>
            <NavItem tab="dashboard" icon={LayoutDashboard} label="Início" />
            <NavItem tab="meetings" icon={Calendar} label="Encontros" />
            <NavItem tab="students" icon={Users} label="Meus Alunos" />
          </>
        )}
      </div>

      <div className="border-t border-vatican-cream p-4">
        <div className="mb-4 flex items-center px-4 rounded-2xl bg-vatican-cream/50 p-4 border border-vatican-cream">
          <div className="h-10 w-10 rounded-full bg-vatican-gold flex items-center justify-center text-vatican-red font-bold border-2 border-white shadow-sm">
            {currentUser?.name.charAt(0)}
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="truncate text-sm font-bold text-slate-900">{currentUser?.name}</p>
            <p className="truncate text-[10px] font-bold uppercase tracking-wider text-vatican-red/60">{currentUser?.role === 'ADMIN' ? 'Administrador' : 'Catequista'}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-slate-400 hover:bg-vatican-red/5 hover:text-vatican-red transition-all duration-300" 
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair do Sistema
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-vatican-cream font-sans">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between bg-vatican-paper px-4 shadow-sm border-b border-vatican-cream md:hidden">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-vatican-gold">
            <Church className="h-5 w-5 text-vatican-red" />
          </div>
          <span className="text-lg font-serif font-bold text-vatican-red tracking-tight">Catedral</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded-full p-2 text-slate-400 hover:bg-vatican-cream hover:text-vatican-red transition-colors"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-vatican-paper shadow-2xl md:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden w-72 flex-col bg-vatican-paper border-r border-vatican-cream md:flex shadow-sm z-20">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-vatican-cream">
        <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
          <div className="mx-auto max-w-7xl p-4 md:p-10 h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
