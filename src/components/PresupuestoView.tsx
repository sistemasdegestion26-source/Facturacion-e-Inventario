import React, { useState } from 'react';
import { DocumentRecord, Product, Client, DocumentItem } from '../types/erp';
import { FileText, Plus, Search, Eye, Trash2, CheckCircle2, ArrowRight } from 'lucide-react';

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
  const [isCreateOpen, setIsCreateOpen] = useState(initialOpenCreate);

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
      quantity: 1000,
      unitPrice: products[0]?.price || 5.0
    }
  ]);

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
    const nextSeq = presupuestos.length + 1;
    const number = String(nextSeq).padStart(3, '0');

    const newDocItems: DocumentItem[] = items.map((it, idx) => ({
      id: `it-${Date.now()}-${idx}`,
      quantity: it.quantity,
      description: it.description.toUpperCase(),
      unitPrice: it.unitPrice,
      total: it.quantity * it.unitPrice
    }));

    const newDoc: DocumentRecord = {
      id: `doc-${Date.now()}`,
      type: 'PRESUPUESTO',
      number,
      date,
      clientName,
      clientPhone,
      items: newDocItems,
      subtotal: total,
      total,
      status: 'PENDIENTE',
      createdAt: new Date().toISOString()
    };

    onSaveDocument(newDoc);
    setIsCreateOpen(false);
  };

  const filtered = presupuestos.filter(d =>
    d.clientName.toLowerCase().includes(search.toLowerCase()) ||
    d.number.includes(search)
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#0052cc]" />
            Presupuesto
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cotizaciones oficiales con el formato CREANDO y conversión directa a factura
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-commercial-btn text-white text-xs sm:text-sm font-bold transition-all shadow-md active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Crear Presupuesto
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por cliente o N°..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 shadow-xs"
        />
      </div>

      {/* Responsive List: Mobile Cards + Desktop Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        
        {/* Mobile View (Android & iPhone) */}
        <div className="md:hidden divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No hay presupuestos registrados.
            </div>
          ) : (
            filtered.map(doc => (
              <div key={doc.id} className="p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0052cc] text-xs">
                      #{doc.number}
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

                <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-slate-50">
                  <button
                    onClick={() => onViewDocument(doc)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-[#0052cc]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver Formato</span>
                  </button>

                  {doc.status !== 'FACTURADO' && (
                    <button
                      onClick={() => onConvertToInvoice(doc)}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200"
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
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View (PC / Tablet) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">N° Cotización</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4 text-center">Ítems</th>
                <th className="py-3 px-4 text-right">Total a Pagar</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-center w-32">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No hay presupuestos registrados.
                  </td>
                </tr>
              ) : (
                filtered.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#0052cc]">
                      #{doc.number}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs font-mono">
                      {doc.date}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {doc.clientName}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-500 text-xs">
                      {doc.items.length}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      ${doc.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        doc.status === 'FACTURADO'
                          ? 'bg-blue-50 text-[#0052cc] border-blue-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onViewDocument(doc)}
                          className="p-1.5 text-slate-400 hover:text-[#0052cc] hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver Formato Oficial / Imprimir"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {doc.status !== 'FACTURADO' && (
                          <button
                            onClick={() => onConvertToInvoice(doc)}
                            className="px-2 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
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
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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

      {/* Modal: Crear Presupuesto con degradado comercial */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col animate-scale-up">
            <div className="bg-gradient-commercial-header text-white px-6 py-4 flex items-center justify-between border-b border-cyan-900/40">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-300" />
                Nuevo Presupuesto
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-300 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Cliente *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      list="clients-list"
                      placeholder="Nombre del cliente..."
                      value={clientName}
                      onChange={e => handleSelectClient(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
                      required
                    />
                    <datalist id="clients-list">
                      {clients.map(c => (
                        <option key={c.id} value={c.name} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Fecha (DD/MM/AAAA)
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Ítems del Presupuesto</span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs text-[#0052cc] hover:underline font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar Ítem
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-x-auto">
                  <table className="w-full min-w-[480px] sm:min-w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold">
                      <tr>
                        <th className="py-2 px-3">Descripción</th>
                        <th className="py-2 px-2 w-24 text-center">Cantidad</th>
                        <th className="py-2 px-2 w-28 text-center">Precio ($)</th>
                        <th className="py-2 px-3 w-28 text-right">Total ($)</th>
                        <th className="py-2 px-2 w-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {items.map((row, idx) => (
                        <tr key={idx} className="bg-white">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              list="products-list"
                              value={row.description}
                              onChange={e => handleItemFieldChange(idx, 'description', e.target.value)}
                              placeholder="Seleccione o escriba descripción..."
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none uppercase"
                              required
                            />
                            <datalist id="products-list">
                              {products.map(p => (
                                <option key={p.id} value={p.description}>
                                  ${p.price.toFixed(2)}
                                </option>
                              ))}
                            </datalist>
                          </td>

                          <td className="py-2 px-2">
                            <input
                              type="number"
                              min="1"
                              value={row.quantity}
                              onChange={e => handleItemFieldChange(idx, 'quantity', e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 font-mono text-center focus:bg-white focus:outline-none"
                              required
                            />
                          </td>

                          <td className="py-2 px-2">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={row.unitPrice}
                              onChange={e => handleItemFieldChange(idx, 'unitPrice', e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 font-mono text-center focus:bg-white focus:outline-none"
                              required
                            />
                          </td>

                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-800">
                            ${(row.quantity * row.unitPrice).toFixed(2)}
                          </td>

                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              disabled={items.length <= 1}
                              className="text-slate-400 hover:text-rose-600 disabled:opacity-30"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total footer con degradado comercial sutil */}
              <div className="flex justify-between items-center p-3.5 rounded-2xl bg-gradient-to-r from-slate-900/5 via-blue-900/5 to-emerald-900/5 border border-cyan-700/20">
                <span className="font-bold text-slate-700">Total a pagar:</span>
                <span className="font-black text-xl text-slate-950 font-mono">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-commercial-btn text-white font-bold transition-all shadow-md cursor-pointer active:scale-98"
                >
                  Guardar Presupuesto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
