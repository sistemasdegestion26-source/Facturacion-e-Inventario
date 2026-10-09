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
  UserCheck
} from 'lucide-react';

interface HeaderNavProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onLogout: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentTab,
  onSelectTab,
  onLogout
}) => {
  const tabs = [
    { id: 'panel' as ActiveTab, label: 'Panel', icon: LayoutDashboard },
    { id: 'inventario' as ActiveTab, label: 'Inventario', icon: Package },
    { id: 'presupuesto' as ActiveTab, label: 'Presupuesto', icon: FileText },
    { id: 'facturacion' as ActiveTab, label: 'Facturación', icon: Receipt },
    { id: 'clientes' as ActiveTab, label: 'Clientes', icon: Users },
  ];

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <CreandoLogo size="sm" showTagline={false} />
            <div className="hidden sm:block border-l border-slate-200 pl-3">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Sistema Administrativo
              </span>
              <span className="text-xs font-bold text-[#0052cc]">
                CREANDO
              </span>
            </div>
          </div>

          {/* Clean Horizontal Tabs using ONLY the requested terms */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#0052cc] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User & Logout */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
              <UserCheck className="w-3.5 h-3.5 text-[#0052cc]" />
              <span>Hendrick</span>
            </div>

            <button
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
