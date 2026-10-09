import React from 'react';
import { ActiveTab } from '../types/erp';
import { CreandoLogo } from './CreandoLogo';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Receipt, 
  Users, 
  LogOut,
  CloudUpload,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import simonAvatar from '../assets/simon.jpg';

interface HeaderNavProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onLogout: () => void;
  onOpenProfile: () => void;
  onOpenDriveBackup: () => void;
  isSynced?: boolean;
  isSyncing?: boolean;
  onManualSync?: () => void;
  lastSyncTime?: string;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentTab,
  onSelectTab,
  onLogout,
  onOpenProfile,
  onOpenDriveBackup,
  isSynced = true,
  isSyncing = false,
  onManualSync,
  lastSyncTime = 'En vivo'
}) => {
  const tabs = [
    { id: 'panel' as ActiveTab, label: 'Panel', icon: LayoutDashboard },
    { id: 'inventario' as ActiveTab, label: 'Inventario', icon: Package },
    { id: 'presupuesto' as ActiveTab, label: 'Presupuesto', icon: FileText },
    { id: 'facturacion' as ActiveTab, label: 'Facturación', icon: Receipt },
    { id: 'clientes' as ActiveTab, label: 'Clientes', icon: Users },
  ];

  return (
    <>
      {/* Header con degradado comercial sutil entre Negro, Azul y Verde */}
      <header className="bg-gradient-commercial-header text-white sticky top-0 z-30 shadow-md border-b border-cyan-900/35 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
            
            {/* Logo Brand */}
            <div className="flex items-center gap-2 sm:gap-3">
              <CreandoLogo size="sm" showTagline={false} lightText={true} />
              <div className="hidden sm:block border-l border-slate-700/80 pl-3">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block leading-none">
                  Sistema Administrativo
                </span>
                <span className="text-xs font-bold text-cyan-300 mt-0.5 block tracking-wide">
                  CREANDO
                </span>
              </div>
            </div>

            {/* Desktop Navigation Tabs (Hidden on mobile phones, shown on md+) */}
            <nav className="hidden md:flex items-center gap-1 sm:gap-1.5 py-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => onSelectTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 text-white shadow-md shadow-blue-950/40 border border-cyan-300/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Quick Actions: Sync status, Drive Backup, User & Logout */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              
              {/* Real-time Cloud Sync Indicator & Manual Trigger (PC & Mobile) */}
              <button
                onClick={onManualSync}
                className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold transition-all cursor-pointer shadow-xs"
                title={`Sincronización en tiempo real activa (PC y Móvil). Último: ${lastSyncTime}. Haga clic para sincronizar ahora.`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                <RefreshCw className={`w-3 h-3 text-emerald-300 shrink-0 ${isSyncing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline font-mono text-[10px]">
                  {isSyncing ? 'Sincronizando...' : 'En vivo'}
                </span>
              </button>

              {/* Respaldo para Google Drive Button */}
              <button
                onClick={onOpenDriveBackup}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-900/60 to-emerald-950/60 hover:from-blue-800/80 hover:to-emerald-900/80 text-cyan-200 text-xs font-bold border border-cyan-500/30 transition-all cursor-pointer shadow-xs"
                title="Respaldar datos para Google Drive"
              >
                <CloudUpload className="w-3.5 h-3.5 text-cyan-300" />
                <span className="hidden sm:inline">Drive</span>
              </button>

              {/* User Profile Badge (Click to edit password) */}
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-xl bg-slate-900/80 hover:bg-blue-950/80 border border-cyan-700/40 text-slate-200 text-xs font-semibold shadow-xs transition-all cursor-pointer group"
                title="Mi perfil • Editar contraseña de acceso"
              >
                <img
                  src={simonAvatar}
                  alt="Hendrick"
                  className="w-6 h-6 rounded-full object-cover border border-cyan-400/50 ring-1 ring-emerald-500/30 group-hover:scale-105 transition-transform"
                />
                <span className="hidden sm:inline text-slate-200 font-medium">Hendrick</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-rose-900/40"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Optimizado con degradado comercial y soporte para notch) */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-commercial-header border-t border-slate-800 text-slate-300 px-2 pt-1.5 shadow-2xl flex items-center justify-around backdrop-blur-md"
        style={{ paddingBottom: 'max(0.6rem, env(safe-area-inset-bottom, 0px))' }}
      >
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[56px] active:scale-95 ${
                isActive
                  ? 'text-cyan-300 font-extrabold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div className={`p-1 rounded-lg transition-all ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-600/40 to-emerald-600/40 text-cyan-300 border border-cyan-400/40 shadow-xs' 
                  : ''
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] tracking-tight leading-none mt-0.5">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
