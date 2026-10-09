import React from 'react';
import { Product, Client, DocumentRecord, ActiveTab } from '../types/erp';
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
  ShieldCheck
} from 'lucide-react';
import simonAvatar from '../assets/simon.jpg';

interface PanelViewProps {
  products: Product[];
  clients: Client[];
  documents: DocumentRecord[];
  onNavigate: (tab: ActiveTab) => void;
  onOpenNewDocument: (type: 'PRESUPUESTO' | 'FACTURACION') => void;
  onViewDocument: (doc: DocumentRecord) => void;
}

export const PanelView: React.FC<PanelViewProps> = ({
  products,
  clients,
  documents,
  onNavigate,
  onOpenNewDocument,
  onViewDocument
}) => {
  const presupuestos = documents.filter(d => d.type === 'PRESUPUESTO');
  const facturas = documents.filter(d => d.type === 'FACTURACION');

  const totalFacturado = facturas.reduce((acc, f) => acc + f.total, 0);
  const totalPresupuestado = presupuestos.reduce((acc, p) => acc + p.total, 0);

  return (
    <div className="space-y-6">
      
      {/* Welcome Hero Card con degradado comercial sutil entre Negro, Azul y Verde */}
      <div className="bg-gradient-commercial-dark text-white border border-cyan-800/40 rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        
        {/* Resplandores ambientales sutiles */}
        <div className="absolute -right-12 -top-12 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-12 -bottom-12 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4 relative z-10">
          {/* Avatar with floating animation and subtle glowing ring */}
          <div className="relative w-16 h-20 sm:w-20 sm:h-24 shrink-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/30 to-emerald-400/30 rounded-full blur-md -z-10 animate-pulse"></div>
            <img
              src={simonAvatar}
              alt="Hendrick Avatar"
              className="w-full h-full object-contain animate-float drop-shadow-md select-none"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-cyan-200 uppercase tracking-wider bg-gradient-to-r from-blue-900/60 to-emerald-950/60 px-2.5 py-0.5 rounded-full border border-cyan-400/30 shadow-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Sesión Activa
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2">
              <span>Hola Hendrick</span>
              <span className="inline-block animate-wave text-xl">✌️</span>
            </h2>
            <p className="text-xs sm:text-sm text-cyan-100/80 mt-0.5 font-medium">
              Panel Administrativo CREANDO • Tinaquillo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 relative z-10">
          <button
            onClick={() => onOpenNewDocument('PRESUPUESTO')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition-all border border-white/20 backdrop-blur-md cursor-pointer shadow-xs active:scale-98"
          >
            <Plus className="w-4 h-4 text-cyan-300" />
            Nuevo Presupuesto
          </button>
          <button
            onClick={() => onOpenNewDocument('FACTURACION')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500 hover:from-blue-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-blue-950/30 cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Nueva Factura
          </button>
        </div>
      </div>

      {/* KPI Cards con acentos de degradado sutiles para vista comercial */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Facturado */}
        <div 
          onClick={() => onNavigate('facturacion')}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          {/* Barra superior con degradado comercial sutil */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-900 via-blue-600 to-emerald-500"></div>

          <div className="flex items-center justify-between text-slate-400 mb-2 mt-1">
            <span className="text-xs font-semibold text-slate-600">Facturación Total</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] group-hover:bg-[#0052cc] group-hover:text-white transition-colors flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            ${totalFacturado.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span>{facturas.length} facturas emitidas</span>
          </div>
        </div>

        {/* Presupuestos */}
        <div 
          onClick={() => onNavigate('presupuesto')}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          {/* Barra superior con degradado verde-azul */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-700 via-teal-600 to-emerald-500"></div>

          <div className="flex items-center justify-between text-slate-400 mb-2 mt-1">
            <span className="text-xs font-semibold text-slate-600">Presupuestos</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            ${totalPresupuestado.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">
            {presupuestos.length} cotizaciones activas
          </div>
        </div>

        {/* Inventario */}
        <div 
          onClick={() => onNavigate('inventario')}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-cyan-400 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-900 via-cyan-600 to-blue-600"></div>

          <div className="flex items-center justify-between text-slate-400 mb-2 mt-1">
            <span className="text-xs font-semibold text-slate-600">Inventario</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {products.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">
            Productos registrados
          </div>
        </div>

        {/* Clientes */}
        <div 
          onClick={() => onNavigate('clientes')}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-900 via-blue-600 to-emerald-600"></div>

          <div className="flex items-center justify-between text-slate-400 mb-2 mt-1">
            <span className="text-xs font-semibold text-slate-600">Clientes</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {clients.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">
            Clientes en directorio
          </div>
        </div>

      </div>

      {/* Two columns: Recent Presupuestos & Recent Facturas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Últimos Presupuestos */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">
                Presupuestos Recientes
              </h3>
            </div>
            <button
              onClick={() => onNavigate('presupuesto')}
              className="text-xs text-[#0052cc] hover:text-emerald-700 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {presupuestos.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center font-medium">No hay presupuestos registrados.</p>
            ) : (
              presupuestos.slice(0, 4).map(doc => (
                <div
                  key={doc.id}
                  onClick={() => onViewDocument(doc)}
                  className="p-3 rounded-xl border border-slate-100 hover:border-emerald-300 hover:bg-slate-50/70 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0052cc] group-hover:text-emerald-700 transition-colors">
                        N° {doc.number}
                      </span>
                      <span className="text-[10px] text-slate-400">{doc.date}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-700 truncate mt-0.5">{doc.clientName}</p>
                    <p className="text-[11px] text-slate-400">{doc.items.length} ítems</p>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-slate-900 text-sm">
                      ${doc.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </div>
                    <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Últimas Facturas */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0052cc] flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">
                Facturas Recientes
              </h3>
            </div>
            <button
              onClick={() => onNavigate('facturacion')}
              className="text-xs text-[#0052cc] hover:text-emerald-700 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {facturas.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center font-medium">No hay facturas registradas.</p>
            ) : (
              facturas.slice(0, 4).map(doc => (
                <div
                  key={doc.id}
                  onClick={() => onViewDocument(doc)}
                  className="p-3 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-slate-50/70 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0052cc] group-hover:text-blue-700 transition-colors">
                        Factura N° {doc.number}
                      </span>
                      <span className="text-[10px] text-slate-400">{doc.date}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-700 truncate mt-0.5">{doc.clientName}</p>
                    <p className="text-[11px] text-slate-400">{doc.items.length} ítems</p>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-slate-900 text-sm">
                      ${doc.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </div>
                    <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
