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
  CheckCircle2
} from 'lucide-react';

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
      
      {/* Welcome Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#0052cc] uppercase tracking-wider">
            Bienvenido, Hendrick
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight mt-0.5">
            Panel de Control CREANDO
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gestión simplificada de inventario, presupuestos, facturación y clientes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenNewDocument('PRESUPUESTO')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 text-[#0052cc] hover:bg-blue-100 text-xs sm:text-sm font-semibold transition-all border border-blue-200"
          >
            <Plus className="w-4 h-4" />
            Nuevo Presupuesto
          </button>
          <button
            onClick={() => onOpenNewDocument('FACTURACION')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0052cc] hover:bg-[#0047b3] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Nueva Factura
          </button>
        </div>
      </div>

      {/* KPI Cards in soft tones */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Facturado */}
        <div 
          onClick={() => onNavigate('facturacion')}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Facturación Total</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0052cc] flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-800">
            ${totalFacturado.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {facturas.length} facturas emitidas
          </div>
        </div>

        {/* Presupuestos */}
        <div 
          onClick={() => onNavigate('presupuesto')}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Presupuestos</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-800">
            ${totalPresupuestado.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {presupuestos.length} cotizaciones activas
          </div>
        </div>

        {/* Inventario */}
        <div 
          onClick={() => onNavigate('inventario')}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Inventario</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-800">
            {products.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Productos registrados
          </div>
        </div>

        {/* Clientes */}
        <div 
          onClick={() => onNavigate('clientes')}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Clientes</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-800">
            {clients.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
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
              <FileText className="w-4 h-4 text-[#0052cc]" />
              <h3 className="font-bold text-slate-800 text-sm">
                Presupuestos Recientes
              </h3>
            </div>
            <button
              onClick={() => onNavigate('presupuesto')}
              className="text-xs text-[#0052cc] hover:underline font-semibold flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {presupuestos.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No hay presupuestos registrados.</p>
            ) : (
              presupuestos.slice(0, 4).map(doc => (
                <div
                  key={doc.id}
                  onClick={() => onViewDocument(doc)}
                  className="p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50/60 transition-all flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0052cc]">N° {doc.number}</span>
                      <span className="text-[10px] text-slate-400">{doc.date}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-700 truncate mt-0.5">{doc.clientName}</p>
                    <p className="text-[11px] text-slate-400">{doc.items.length} ítems</p>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-slate-800 text-sm">
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
              <Receipt className="w-4 h-4 text-[#0052cc]" />
              <h3 className="font-bold text-slate-800 text-sm">
                Facturas Recientes
              </h3>
            </div>
            <button
              onClick={() => onNavigate('facturacion')}
              className="text-xs text-[#0052cc] hover:underline font-semibold flex items-center gap-1"
            >
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {facturas.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No hay facturas registradas.</p>
            ) : (
              facturas.slice(0, 4).map(doc => (
                <div
                  key={doc.id}
                  onClick={() => onViewDocument(doc)}
                  className="p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50/60 transition-all flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0052cc]">Factura N° {doc.number}</span>
                      <span className="text-[10px] text-slate-400">{doc.date}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-700 truncate mt-0.5">{doc.clientName}</p>
                    <p className="text-[11px] text-slate-400">{doc.items.length} ítems</p>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-slate-800 text-sm">
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
