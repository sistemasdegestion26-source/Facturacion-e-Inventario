import React, { useState } from 'react';
import { CreandoLogo } from './CreandoLogo';
import { 
  Trash2, 
  RotateCcw, 
  FileText, 
  Receipt, 
  Package, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  X,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { Product, Client, DocumentRecord } from '../types/erp';
import { INITIAL_PRODUCTS, INITIAL_CLIENTS, INITIAL_DOCUMENTS } from '../data/initialData';

interface DataManagementModalProps {
  products: Product[];
  clients: Client[];
  documents: DocumentRecord[];
  onClose: () => void;
  onCommitClean: (
    newProducts: Product[],
    newClients: Client[],
    newDocs: DocumentRecord[],
    msg: string
  ) => void;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({
  products,
  clients,
  documents,
  onClose,
  onCommitClean
}) => {
  const [confirmAction, setConfirmAction] = useState<string | null>(null);

  const facturasCount = documents.filter(d => d.type === 'FACTURACION').length;
  const presupuestosCount = documents.filter(d => d.type === 'PRESUPUESTO').length;

  const handleClearDocumentsOnly = () => {
    onCommitClean(
      products,
      clients,
      [],
      'Historial de presupuestos y facturas limpiado con éxito.'
    );
    onClose();
  };

  const handleClearProductsOnly = () => {
    onCommitClean(
      [],
      clients,
      documents,
      'Inventario de productos limpiado con éxito.'
    );
    onClose();
  };

  const handleClearClientsOnly = () => {
    onCommitClean(
      products,
      [],
      documents,
      'Directorio de clientes limpiado con éxito.'
    );
    onClose();
  };

  const handleResetToFactoryData = () => {
    onCommitClean(
      INITIAL_PRODUCTS,
      INITIAL_CLIENTS,
      INITIAL_DOCUMENTS,
      'Sistema restablecido a los datos iniciales de CREANDO.'
    );
    onClose();
  };

  const handleClearEverything = () => {
    onCommitClean(
      [],
      [],
      [],
      'Todos los datos han sido limpiados. El sistema está en blanco listo para cargar.'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up">
        
        {/* Header con colores internos del logo degradado y metalizado */}
        <div className="bg-metallic-logo-inner text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-cyan-800/40">
          <div className="flex items-center gap-2.5">
            <CreandoLogo size="xs" variant="icon" />
            <div>
              <h3 className="font-extrabold text-white text-sm sm:text-base tracking-tight flex items-center gap-1.5">
                <span>Limpieza y Gestión de Datos</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded-md uppercase">
                  Control
                </span>
              </h3>
              <p className="text-[11px] text-cyan-200">
                Opciones rápidas para limpiar, reiniciar o vaciar registros cargados
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-center">
            <div className="p-2">
              <span className="block text-[10px] font-bold text-slate-500 uppercase">Productos</span>
              <span className="text-base font-black text-slate-900 font-mono">{products.length}</span>
            </div>
            <div className="p-2 border-x border-slate-200">
              <span className="block text-[10px] font-bold text-slate-500 uppercase">Clientes</span>
              <span className="text-base font-black text-slate-900 font-mono">{clients.length}</span>
            </div>
            <div className="p-2">
              <span className="block text-[10px] font-bold text-slate-500 uppercase">Documentos</span>
              <span className="text-base font-black text-slate-900 font-mono">{documents.length}</span>
            </div>
          </div>

          {/* Action options */}
          <div className="space-y-3">
            
            {/* Opción 1: Limpiar solo Historial de Facturas y Presupuestos */}
            <div className="p-3.5 rounded-2xl border border-slate-200 hover:border-amber-400/80 bg-white transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-700 shrink-0 mt-0.5">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      Limpiar Historial de Facturas y Presupuestos
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Borra las {facturasCount} facturas y {presupuestosCount} presupuestos de prueba, conservando tus productos y clientes.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('¿Seguro que desea vaciar todo el historial de facturas y presupuestos?')) {
                      handleClearDocumentsOnly();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shrink-0 cursor-pointer transition-all shadow-xs"
                >
                  Limpiar Docs
                </button>
              </div>
            </div>

            {/* Opción 2: Restablecer a Datos Iniciales */}
            <div className="p-3.5 rounded-2xl border border-slate-200 hover:border-blue-400/80 bg-white transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-50 text-[#0052cc] shrink-0 mt-0.5">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      Restablecer Datos de Demostración
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Restaura los productos y formatos estándar originales de CREANDO Tinaquillo.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('¿Restablecer el sistema con los datos de muestra iniciales?')) {
                      handleResetToFactoryData();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 cursor-pointer transition-all shadow-xs"
                >
                  Restablecer
                </button>
              </div>
            </div>

            {/* Opción 3: Limpiar Todo el Sistema (Iniciar en blanco) */}
            <div className="p-3.5 rounded-2xl border border-rose-200/80 bg-rose-50/40">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-100 text-rose-700 shrink-0 mt-0.5">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-rose-900">
                      Vaciar Todo el Sistema (Empezar de cero)
                    </h4>
                    <p className="text-[11px] text-rose-700/80 mt-0.5">
                      Elimina todos los productos, clientes y documentos para empezar con una base de datos 100% limpia.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('ATENCIÓN: ¿Seguro que desea vaciar por completo todos los registros? Se recomienda hacer un respaldo en Drive antes.')) {
                      handleClearEverything();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shrink-0 cursor-pointer transition-all shadow-xs"
                >
                  Vaciar Todo
                </button>
              </div>
            </div>

          </div>

          <div className="pt-2 text-center">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs cursor-pointer"
            >
              Cerrar
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
