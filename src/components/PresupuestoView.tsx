import React, { useState } from 'react';
import type { DocumentRecord, Product, Client, DocumentItem } from '../types/erp.ts';
import { CreandoLogo } from './CreandoLogo';
import { 
  FileText, 
  Plus, 
  Search, 
  Eye, 
  Trash2, 
  CheckCircle2, 
  ArrowRight,
  Edit2,
  X,
  RotateCcw,
  Sparkles,
  Calendar,
  User,
  Phone
} from 'lucide-react';

interface PresupuestoViewProps {
  documents: DocumentRecord[];
  products: Product[];
  clients: Client[];
  onSaveDocument: (doc: DocumentRecord) => void;
  onDeleteDocument: (docId: string) => void;
  onConvertToInvoice: (doc: DocumentRecord) => void;
  onViewDocument: (doc: DocumentRecord) => void;
  initialOpenCreate?: boolean;
}

export const PresupuestoView: React.FC<PresupuestoViewProps> = ({
  documents,
  products,
  clients,
  onSaveDocument,
  onDeleteDocument,
  onConvertToInvoice,
  onViewDocument,
  initialOpenCreate = false
}) => {
  const presupuestos = documents.filter(d => d.type === 'PRESUPUESTO');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'PENDIENTE' | 'FACTURADO'>('all');
  
  // Modal states: Creation & Editing
  const [isModalOpen, setIsModalOpen] = useState(initialOpenCreate);
  const [editingDoc, setEditingDoc] = useState<DocumentRecord | null>(null);

  // Form states
  const [clientName, setClientName] = useState(clients[0]?.name || '');
  const [clientPhone, setClientPhone] = useState(clients[0]?.phone || '');
  const [date, setDate] = useState(() => {
    const today = new Date();
    const d = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const y = today.getFullYear();
    return `${d}/${m}/${y}`;
  });

  const [items, setItems] = useState<Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>>([
    {
      description: products[0]?.description || 'CARNETS SUBLIMADOS CON ACCESORIOS',
      quantity: 100,
      unitPrice: products[0]?.price || 5.0
    }
  ]);

  const openNewModal = () => {
    setEditingDoc(null);
    setClientName(clients[0]?.name || '');
    setClientPhone(clients[0]?.phone || '');
    const today = new Date();
    const d = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const y = today.getFullYear();
    setDate(`${d}/${m}/${y}`);
    setItems([
      {
        description: products[0]?.description || 'CARNETS SUBLIMADOS CON ACCESORIOS',
        quantity: 100,
        unitPrice: products[0]?.price || 5.0
      }
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (doc: DocumentRecord) => {
    setEditingDoc(doc);
    setClientName(doc.clientName);
    setClientPhone(doc.clientPhone || '');
    setDate(doc.date);
    setItems(doc.items.map(it => ({
      description: it.description,
      quantity: it.quantity,
      unitPrice: it.unitPrice
    })));
    setIsModalOpen(true);
  };

  const clearForm = () => {
    setClientName('');
    setClientPhone('');
    setItems([
      {
        description: '',
        quantity: 1,
        unitPrice: 0
      }
    ]);
  };

  const handleSelectClient = (cName: string) => {
    setClientName(cName);
    const c = clients.find(cl => cl.name === cName);
    if (c?.phone) setClientPhone(c.phone);
  };

  const handleAddItem = () => {
    const firstProd = products[0];
    setItems([
      ...items,
      {
        description: firstProd?.description || '',
        quantity: 1,
        unitPrice: firstProd?.price || 0
      }
    ]);
  };

  const handleQuickAddProduct = (prod: Product) => {
    setItems([
      ...items,
      {
        description: prod.description,
        quantity: 1,
        unitPrice: prod.price
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemFieldChange = (
    index: number,
    field: 'description' | 'quantity' | 'unitPrice',
    val: any
  ) => {
    const updated = [...items];
    if (field === 'description') {
      updated[index].description = val;
      const matched = products.find(p => p.description.toLowerCase() === String(val).toLowerCase());
      if (matched) {
        updated[index].unitPrice = matched.price;
      }
    } else if (field === 'quantity') {
      updated[index].quantity = Number(val) || 1;
    } else if (field === 'unitPrice') {
      updated[index].unitPrice = Number(val) || 0;
    }
    setItems(updated);
  };

  const calculateTotal = () => {
    return items.reduce((acc, it) => acc + (it.quantity * it.unitPrice), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || items.length === 0) return;

    const total = calculateTotal();
    const number = editingDoc 
      ? editingDoc.number 
      : String(presupuestos.length + 1).padStart(3, '0');

    const newDocItems: DocumentItem[] = items.map((it, idx) => ({
      id: `it-${Date.now()}-${idx}`,
      quantity: it.quantity,
      description: it.description.toUpperCase(),
      unitPrice: it.unitPrice,
      total: it.quantity * it.unitPrice
    }));

    const docToSave: DocumentRecord = {
      id: editingDoc ? editingDoc.id : `doc-${Date.now()}`,
      type: 'PRESUPUESTO',
      number,
      date,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      items: newDocItems,
      subtotal: total,
      total,
      status: editingDoc ? editingDoc.status : 'PENDIENTE',
      createdAt: editingDoc ? editingDoc.createdAt : new Date().toISOString()
    };

    onSaveDocument(docToSave);
    setIsModalOpen(false);
  };

  // Consultas y Filtros Simplificados
  let filtered = presupuestos.filter(d =>
    d.clientName.toLowerCase().includes(search.toLowerCase()) ||
    d.number.includes(search) ||
    (d.clientPhone && d.clientPhone.includes(search))
  );

  if (filterStatus !== 'all') {
    filtered = filtered.filter(d => d.status === filterStatus);
  }

  const hasActiveFilters = search.trim() !== '' || filterStatus !== 'all';

  return (
    <div className="space-y-6">
      
      {/* Header con Logo CREANDO y colores metalizados */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs backdrop-blur-xs">
        <div className="flex items-center gap-3">
          <CreandoLogo size="sm" variant="icon" />
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Presupuestos CREANDO</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0052cc] border border-blue-200">
                {presupuestos.length} cotizaciones
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cotizaciones oficiales simplificadas • Edición de datos y conversión directa a factura
            </p>
          </div>
        </div>

        <button
          onClick={openNewModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-metallic-logo-inner hover:opacity-95 text-white text-xs sm:text-sm font-extrabold transition-all shadow-md active:scale-98 cursor-pointer border border-cyan-400/30 sheen-metallic"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Crear Presupuesto</span>
        </button>
      </div>

      {/* Consultas y Filtros */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Consultar presupuesto por cliente o N°..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-9 py-2 text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 shadow-xs"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded-md text-xs cursor-pointer"
              title="Limpiar consulta"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos ({presupuestos.length})
          </button>
          <button
            onClick={() => setFilterStatus('PENDIENTE')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              filterStatus === 'PENDIENTE'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setFilterStatus('FACTURADO')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              filterStatus === 'FACTURADO'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Facturados
          </button>

          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearch('');
                setFilterStatus('all');
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 font-bold transition-colors cursor-pointer text-xs"
              title="Limpiar filtros"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </div>

      {/* Responsive List: Mobile Cards + Desktop Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
        
        {/* Mobile View (Android & iPhone) */}
        <div className="md:hidden divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <CreandoLogo size="sm" variant="icon" className="opacity-40 mb-2" />
              <p className="text-slate-500 font-bold text-sm">
                No hay presupuestos registrados
              </p>
              <p className="text-slate-400 text-xs mt-1">
                {hasActiveFilters ? 'Pruebe limpiando la búsqueda.' : 'Presione "Crear Presupuesto" para emitir el primero.'}
              </p>
            </div>
          ) : (
            filtered.map(doc => (
              <div key={doc.id} className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[#0052cc] text-xs">
                      Cotización #{doc.number}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {doc.date}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    doc.status === 'FACTURADO'
                      ? 'bg-blue-50 text-[#0052cc] border-blue-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {doc.status}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800 text-xs">{doc.clientName}</p>
                    <p className="text-[11px] text-slate-400">{doc.items.length} ítems incluidos</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-sm text-slate-900">
                      ${doc.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <div className="flex items-center gap-1.5">
                    {/* Botón Editar Datos Cargados */}
                    <button
                      onClick={() => openEditModal(doc)}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                      title="Editar presupuesto"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Editar</span>
                    </button>

                    <button
                      onClick={() => onViewDocument(doc)}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-[#0052cc] cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Formato</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {doc.status !== 'FACTURADO' && (
                      <button
                        onClick={() => onConvertToInvoice(doc)}
                        className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-pointer"
                      >
                        Facturar
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (window.confirm(`¿Eliminar presupuesto #${doc.number}?`)) {
                          onDeleteDocument(doc.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View (PC / Tablet) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-extrabold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-5">N° Cotización</th>
                <th className="py-3.5 px-4">Fecha</th>
                <th className="py-3.5 px-4">Cliente</th>
                <th className="py-3.5 px-4 text-center">Ítems</th>
                <th className="py-3.5 px-4 text-right">Total a Pagar</th>
                <th className="py-3.5 px-4 text-center">Estado</th>
                <th className="py-3.5 px-5 text-center w-40">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    <CreandoLogo size="sm" variant="icon" className="opacity-40 mb-2 inline-block" />
                    <p className="font-bold text-slate-600">No hay presupuestos que coincidan con la búsqueda.</p>
                  </td>
                </tr>
              ) : (
                filtered.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5 font-black text-[#0052cc]">
                      #{doc.number}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-xs font-mono">
                      {doc.date}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {doc.clientName}
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-500 text-xs font-mono">
                      {doc.items.length}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-black text-slate-900">
                      ${doc.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        doc.status === 'FACTURADO'
                          ? 'bg-blue-50 text-[#0052cc] border-blue-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* Botón Editar Datos Cargados */}
                        <button
                          onClick={() => openEditModal(doc)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Editar datos cargados"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onViewDocument(doc)}
                          className="p-1.5 text-slate-500 hover:text-[#0052cc] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Ver Formato Oficial / Imprimir"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {doc.status !== 'FACTURADO' && (
                          <button
                            onClick={() => onConvertToInvoice(doc)}
                            className="px-2 py-0.5 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                            title="Convertir a Factura"
                          >
                            Facturar
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (window.confirm(`¿Eliminar presupuesto #${doc.number}?`)) {
                              onDeleteDocument(doc.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Crear / Editar Presupuesto con degradado metalizado */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-scale-up">
            
            {/* Header con colores internos del logo degradado y metalizado */}
            <div className="bg-metallic-logo-inner text-white px-6 py-4 flex items-center justify-between border-b border-cyan-800/40 shrink-0">
              <div className="flex items-center gap-2.5">
                <CreandoLogo size="xs" variant="icon" />
                <div>
                  <h3 className="font-extrabold text-white text-base">
                    {editingDoc ? `Editar Presupuesto #${editingDoc.number}` : 'Nuevo Presupuesto CREANDO'}
                  </h3>
                  <p className="text-[11px] text-cyan-200">
                    Carga simplificada de ítems y cálculo automático de totales
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-300 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              
              {/* Cliente y Fecha */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800">
                      Cliente *
                    </label>
                    {clients.length > 0 && (
                      <select
                        onChange={e => handleSelectClient(e.target.value)}
                        value={clientName}
                        className="text-[11px] bg-slate-100 border border-slate-200 rounded-md px-1.5 py-0.5 text-slate-700 cursor-pointer"
                      >
                        <option value="">Seleccionar del directorio...</option>
                        {clients.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Nombre o Razón Social"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold focus:bg-white focus:outline-none focus:border-blue-500 uppercase"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">
                    Fecha (dd/mm/aaaa)
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:bg-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800">
                  Teléfono / Contacto
                </label>
                <input
                  type="text"
                  placeholder="ej. 0414-1234567"
                  value={clientPhone}
                  onChange={e => setClientPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Quick Pick Products Chips */}
              {products.length > 0 && (
                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80">
                  <span className="text-[11px] font-bold text-slate-600 block mb-1">
                    + Añadir rápido desde inventario:
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                    {products.slice(0, 6).map(prod => (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => handleQuickAddProduct(prod)}
                        className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-medium hover:bg-blue-50 hover:text-[#0052cc] transition-colors cursor-pointer"
                      >
                        + {prod.description} (${prod.price})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Ítems del Presupuesto */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                    Ítems a Cotizar ({items.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs font-bold text-[#0052cc] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Fila</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((it, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <div className="w-20">
                        <input
                          type="number"
                          min="1"
                          placeholder="Cant."
                          value={it.quantity}
                          onChange={e => handleItemFieldChange(idx, 'quantity', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-center font-mono font-bold text-slate-800"
                          title="Cantidad"
                          required
                        />
                      </div>

                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Descripción del ítem..."
                          value={it.description}
                          onChange={e => handleItemFieldChange(idx, 'description', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-semibold uppercase text-xs"
                          required
                        />
                      </div>

                      <div className="w-24">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Precio"
                          value={it.unitPrice}
                          onChange={e => handleItemFieldChange(idx, 'unitPrice', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-right font-mono font-bold text-slate-800"
                          title="Precio Unitario"
                          required
                        />
                      </div>

                      <div className="w-20 text-right font-mono font-black text-slate-900 text-xs px-1">
                        ${(it.quantity * it.unitPrice).toFixed(2)}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        disabled={items.length === 1}
                        className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total footer con degradado metalizado sutil */}
              <div className="flex justify-between items-center p-3.5 rounded-2xl bg-gradient-to-r from-slate-900/5 via-blue-900/5 to-amber-900/5 border border-cyan-700/20">
                <span className="font-extrabold text-slate-700">Total a Cotizar:</span>
                <span className="font-mono font-black text-xl text-slate-950">
                  ${calculateTotal().toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={clearForm}
                  className="text-slate-400 hover:text-slate-600 text-xs underline cursor-pointer"
                >
                  Limpiar campos
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors font-medium cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-metallic-logo-inner text-white font-extrabold transition-all shadow-md cursor-pointer active:scale-98 border border-cyan-400/40 sheen-metallic"
                  >
                    {editingDoc ? 'Actualizar Presupuesto' : 'Guardar Presupuesto'}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
