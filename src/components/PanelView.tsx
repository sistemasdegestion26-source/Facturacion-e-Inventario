import React from 'react';
import { Product, Client, DocumentRecord, ActiveTab } from '../types/erp';
import { CreandoLogo } from './CreandoLogo';
import { 
  FileText, 
  Receipt, 
  Package, 
  Users, 
  Plus, 
  ArrowRight,
  Clock,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  RotateCcw,
  SlidersHorizontal,
  FolderOpen
} from 'lucide-react';
import simonAvatar from '../assets/simon.jpg';

interface PanelViewProps {
  products: Product[];
  clients: Client[];
  documents: DocumentRecord[];
  onNavigate: (tab: ActiveTab) => void;
  onOpenNewDocument: (type: 'PRESUPUESTO' | 'FACTURACION') => void;
  onViewDocument: (doc: DocumentRecord) => void;
  onOpenDataManagement?: () => void;
}

export const PanelView: React.FC<PanelViewProps> = ({
  products,
  clients,
  documents,
  onNavigate,
  onOpenNewDocument,
  onViewDocument,
  onOpenDataManagement
}) => {
  const presupuestos = documents.filter(d => d.type === 'PRESUPUESTO');
  const facturas = documents.filter(d => d.type === 'FACTURACION');

  const totalFacturado = facturas.reduce((acc, f) => acc + f.total, 0);
  const totalPresupuestado = presupuestos.reduce((acc, p) => acc + p.total, 0);

  return (
    <div className="space-y-6">
      
      {/* Welcome Hero Card con colores internos del logo degradado y metalizado */}
      <div className="bg-metallic-logo-inner text-white border border-cyan-800/40 rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 sheen-metallic">
        
        {/* Resplandores ambientales con los colores internos del logo: Ámbar, Esmeralda y Zafiro */}
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute center w-48 h-48 bg-blue-600/25 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center gap-4 sm:gap-6 relative z-10">
          
          {/* Logo CREANDO Prominente con variante badge oficial */}
          <div className="p-1 rounded-full bg-slate-950/90 backdrop-blur-md border border-cyan-500/30 shadow-lg shrink-0">
            <CreandoLogo variant="badge" size="sm" />
          </div>

          {/* Avatar de Hendrick con marco metalizado */}
          <div className="relative w-16 h-20 sm:w-20 sm:h-24 shrink-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/40 via-emerald-400/40 to-blue-500/40 rounded-full blur-md -z-10 animate-pulse"></div>
            <img
              src={simonAvatar}
              alt="Hendrick Avatar"
              className="w-full h-full object-contain animate-float drop-shadow-md select-none"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold text-slate-950 uppercase tracking-wider bg-metallic-gold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span>
                CREANDO • Activo
              </span>
              <span className="text-[10px] font-mono text-cyan-200 hidden sm:inline">
                Tinaquillo, Cojedes
              </span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
              <span>Hola Hendrick</span>
              <span className="inline-block animate-wave text-xl">✌️</span>
            </h2>
            <p className="text-xs sm:text-sm text-cyan-100/90 mt-0.5 font-medium">
              Sistema Administrativo Simplificado • Formato Oficial y Edición Rápida
            </p>
          </div>
        </div>

        {/* Action Buttons con degradado metalizado */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <button
            onClick={() => onOpenNewDocument('PRESUPUESTO')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold transition-all border border-white/20 backdrop-blur-md cursor-pointer shadow-xs active:scale-98"
          >
            <Plus className="w-4 h-4 text-cyan-300 stroke-[2.5]" />
            <span>Presupuesto</span>
          </button>
          <button
            onClick={() => onOpenNewDocument('FACTURACION')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-metallic-gold hover:opacity-95 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md active:scale-98 cursor-pointer border border-amber-300/40"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Factura</span>
          </button>
        </div>
      </div>

      {/* KPI Cards con acentos de degradado metalizado */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Facturación Total */}
        <div 
          onClick={() => onNavigate('facturacion')}
          className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          {/* Acento superior con los colores internos del logo */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-metallic-logo-inner"></div>

          <div className="flex items-center justify-between text-slate-400 mb-2 mt-1">
            <span className="text-xs font-bold text-slate-600">Facturación Cobrada</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] group-hover:bg-[#0052cc] group-hover:text-white transition-colors flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-mono">
            ${totalFacturado.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span>{facturas.length} facturas registradas</span>
          </div>
        </div>

        {/* Presupuestos */}
        <div 
          onClick={() => onNavigate('presupuesto')}
          className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-metallic-gold"></div>

          <div className="flex items-center justify-between text-slate-400 mb-2 mt-1">
            <span className="text-xs font-bold text-slate-600">Presupuestos</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-mono">
            ${totalPresupuestado.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">
            <span>{presupuestos.length} cotizaciones generadas</span>
          </div>
        </div>

        {/* Productos en Inventario */}
        <div 
          onClick={() => onNavigate('inventario')}
          className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-metallic-emerald"></div>

          <div className="flex items-center justify-between text-slate-400 mb-2 mt-1">
            <span className="text-xs font-bold text-slate-600">Inventario</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-mono">
            {products.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">
            <span>Productos registrados</span>
          </div>
        </div>

        {/* Directorio de Clientes */}
        <div 
          onClick={() => onNavigate('clientes')}
          className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xs hover:border-cyan-400 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500"></div>

          <div className="flex items-center justify-between text-slate-400 mb-2 mt-1">
            <span className="text-xs font-bold text-slate-600">Clientes</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-[#0052cc] group-hover:bg-[#0052cc] group-hover:text-white transition-colors flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-mono">
            {clients.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">
            <span>Contactos en agenda</span>
          </div>
        </div>

      </div>

      {/* Grid: Documentos Recientes & Accesos Rápidos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Documentos Recientes con Logo de marca */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CreandoLogo size="xs" variant="icon" />
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                Documentos Oficiales Recientes
              </h3>
            </div>
            <button
              onClick={() => onNavigate('facturacion')}
              className="text-xs font-bold text-[#0052cc] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {documents.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No hay documentos cargados en el sistema.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {documents.slice(0, 5).map(doc => (
                <div key={doc.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      doc.type === 'FACTURACION' 
                        ? 'bg-blue-50 text-[#0052cc]' 
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {doc.type === 'FACTURACION' ? <Receipt className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-extrabold text-slate-900 text-xs truncate">
                        {doc.clientName}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {doc.type} #{doc.number} • {doc.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono font-black text-xs text-slate-900">
                      ${doc.total.toFixed(2)}
                    </span>
                    <button
                      onClick={() => onViewDocument(doc)}
                      className="px-2.5 py-1 text-xs font-bold text-[#0052cc] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    >
                      Ver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Acciones de Simplificación y Gestión de Datos */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="font-extrabold text-slate-900 text-sm">
              Gestión y Simplificación
            </h3>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Herramientas para simplificar consultas, modificar datos cargados o limpiar el historial de pruebas.
          </p>

          <div className="space-y-2 pt-1">
            <button
              onClick={() => onNavigate('inventario')}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all cursor-pointer border border-slate-200/60"
            >
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#0052cc]" />
                <span>Editar Inventario y Precios</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate('presupuesto')}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all cursor-pointer border border-slate-200/60"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>Consultar y Editar Presupuestos</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {onOpenDataManagement && (
              <button
                onClick={onOpenDataManagement}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-amber-50 hover:bg-amber-100/80 text-amber-900 text-xs font-extrabold transition-all cursor-pointer border border-amber-200/80 mt-2"
              >
                <span className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-700" />
                  <span>Limpiar Datos / Reiniciar</span>
                </span>
                <span className="text-[10px] bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded">
                  Control
                </span>
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
