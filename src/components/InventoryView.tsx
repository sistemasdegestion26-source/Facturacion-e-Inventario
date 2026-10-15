import React, { useState } from 'react';
import { Product } from '../types/erp';
import { CreandoLogo } from './CreandoLogo';
import { 
  Package, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Check, 
  AlertCircle,
  X,
  Sparkles,
  ArrowUpDown,
  Filter,
  RotateCcw,
  PlusCircle,
  MinusCircle
} from 'lucide-react';

interface InventoryViewProps {
  products: Product[];
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onQuickAdjustStock?: (productId: string, delta: number) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  onSaveProduct,
  onDeleteProduct,
  onQuickAdjustStock
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'low_stock' | 'high_price' | 'low_price'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states: SIMPLIFICADO A SOLO DESCRIPCIÓN Y PRECIO (+ STOCK SIMPLE)
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [stock, setStock] = useState<number | string>('100');

  // Plantillas rápidas para simplificar la carga de productos de CREANDO
  const QUICK_TEMPLATES = [
    { label: 'Carnets Sublimados', price: 5.0, stock: 100 },
    { label: 'Lanyards Estampados', price: 3.5, stock: 150 },
    { label: 'Stickers en Vinil', price: 1.5, stock: 200 },
    { label: 'Tazas Personalizadas', price: 6.0, stock: 50 },
    { label: 'Gorras Bordadas', price: 8.5, stock: 80 },
    { label: 'Pendones Publicitarios', price: 15.0, stock: 30 }
  ];

  const applyTemplate = (tmpl: { label: string; price: number; stock: number }) => {
    setDescription(tmpl.label.toUpperCase());
    setPrice(tmpl.price);
    setStock(tmpl.stock);
  };

  const clearForm = () => {
    setDescription('');
    setPrice('');
    setStock('100');
  };

  const openNewModal = () => {
    setEditingProduct(null);
    clearForm();
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setDescription(p.description);
    setPrice(p.price);
    setStock(p.stock);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || Number(price) <= 0) return;

    const toSave: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      description: description.trim().toUpperCase(),
      price: Number(price),
      stock: Number(stock) || 0
    };

    onSaveProduct(toSave);
    setIsModalOpen(false);
  };

  const handleAdjustStock = (p: Product, delta: number) => {
    if (onQuickAdjustStock) {
      onQuickAdjustStock(p.id, delta);
    } else {
      const nextStock = Math.max(0, p.stock + delta);
      onSaveProduct({ ...p, stock: nextStock });
    }
  };

  // Consultas y Filtros simplificados
  let filtered = products.filter(p => 
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  if (filterType === 'low_stock') {
    filtered = filtered.filter(p => p.stock < 50);
  } else if (filterType === 'high_price') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (filterType === 'low_price') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  }

  const hasActiveFilters = search.trim() !== '' || filterType !== 'all';

  return (
    <div className="space-y-6">
      
      {/* Header con Logo CREANDO integrado y colores metalizados */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs backdrop-blur-xs">
        <div className="flex items-center gap-3">
          <CreandoLogo size="sm" variant="icon" />
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Inventario CREANDO</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {products.length} productos
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Carga y control simplificado con edición directa de stock y precios
            </p>
          </div>
        </div>

        <button
          onClick={openNewModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-metallic-logo-inner hover:opacity-95 text-white text-xs sm:text-sm font-extrabold transition-all shadow-md active:scale-98 cursor-pointer border border-cyan-400/30 sheen-metallic"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Cargar Producto</span>
        </button>
      </div>

      {/* Consultas y Filtros Simplificados */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
        
        {/* Search Bar con botón de limpiar búsqueda */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Consultar producto por descripción..."
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

        {/* Filter Chips rápidos */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              filterType === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos ({products.length})
          </button>
          <button
            onClick={() => setFilterType('low_stock')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              filterType === 'low_stock'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Stock Bajo (&lt;50)
          </button>
          <button
            onClick={() => setFilterType('high_price')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              filterType === 'high_price'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Mayor Precio
          </button>

          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearch('');
                setFilterType('all');
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 font-bold transition-colors cursor-pointer text-xs"
              title="Limpiar todos los filtros"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </div>

      {/* Responsive List: Cards on Phone, Table on PC */}
      <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
        
        {/* Phone View (Android / iPhone) */}
        <div className="md:hidden divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <CreandoLogo size="sm" variant="icon" className="opacity-40 mb-2" />
              <p className="text-slate-500 font-bold text-sm">
                No se encontraron productos
              </p>
              <p className="text-slate-400 text-xs mt-1">
                {hasActiveFilters ? 'Pruebe limpiando los filtros de consulta.' : 'Presione "Cargar Producto" para comenzar.'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={() => { setSearch(''); setFilterType('all'); }}
                  className="mt-3 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  Limpiar Búsqueda
                </button>
              )}
            </div>
          ) : (
            filtered.map(p => (
              <div key={p.id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-slate-900 text-xs uppercase leading-snug">
                      {p.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                        ${p.price.toFixed(2)}
                      </span>
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md font-bold ${
                        p.stock < 50 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {p.stock} unid.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-2 text-blue-700 hover:text-blue-800 bg-blue-50 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer"
                      title="Editar datos cargados"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`¿Eliminar "${p.description}"?`)) {
                          onDeleteProduct(p.id);
                        }
                      }}
                      className="p-2 text-rose-500 hover:text-rose-700 bg-rose-50 rounded-xl cursor-pointer"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Ajustador Rápido de Stock en el Teléfono */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                  <span className="text-slate-400 font-medium">Ajuste rápido de inventario:</span>
                  <div className="flex items-center gap-1 font-mono font-bold">
                    <button
                      onClick={() => handleAdjustStock(p, -1)}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                      title="Restar 1"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => handleAdjustStock(p, 1)}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                      title="Sumar 1"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => handleAdjustStock(p, 10)}
                      className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg cursor-pointer"
                      title="Sumar 10"
                    >
                      +10
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
                <th className="py-3.5 px-5">Descripción del Producto</th>
                <th className="py-3.5 px-4 text-right">Precio Unitario</th>
                <th className="py-3.5 px-4 text-center">Stock Disponible</th>
                <th className="py-3.5 px-4 text-center">Ajuste Rápido</th>
                <th className="py-3.5 px-5 text-center w-32">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                    <CreandoLogo size="sm" variant="icon" className="opacity-40 mb-2 inline-block" />
                    <p className="font-bold text-slate-600">No hay productos que coincidan con la consulta.</p>
                    {hasActiveFilters && (
                      <button
                        onClick={() => { setSearch(''); setFilterType('all'); }}
                        className="mt-2 text-[#0052cc] hover:underline font-bold"
                      >
                        Limpiar filtros de búsqueda
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-slate-900">
                      {p.description}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-slate-900">
                      ${p.price.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`font-mono text-xs px-2.5 py-1 rounded-full font-bold ${
                        p.stock < 50 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {p.stock} unid.
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1 font-mono text-xs">
                        <button
                          onClick={() => handleAdjustStock(p, -10)}
                          className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                          title="Restar 10 unidades"
                        >
                          -10
                        </button>
                        <button
                          onClick={() => handleAdjustStock(p, -1)}
                          className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                          title="Restar 1 unidad"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => handleAdjustStock(p, 1)}
                          className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                          title="Sumar 1 unidad"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => handleAdjustStock(p, 10)}
                          className="px-1.5 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold cursor-pointer"
                          title="Sumar 10 unidades"
                        >
                          +10
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-[#0052cc] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                          title="Editar producto cargado"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Eliminar "${p.description}" del inventario?`)) {
                              onDeleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar producto"
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

      {/* Modal Cargar / Editar Producto con degradado metalizado y plantillas rápidas */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up">
            
            {/* Header con colores internos del logo degradado y metalizado */}
            <div className="bg-metallic-logo-inner text-white px-6 py-4 flex items-center justify-between border-b border-cyan-800/40">
              <div className="flex items-center gap-2.5">
                <CreandoLogo size="xs" variant="icon" />
                <div>
                  <h3 className="font-extrabold text-white text-base">
                    {editingProduct ? 'Editar Producto Cargado' : 'Cargar Producto a Inventario'}
                  </h3>
                  <p className="text-[11px] text-cyan-200">
                    Registro rápido simplificado con precios y descripción oficial
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

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
              
              {/* Plantillas Rápidas (Solo al crear nuevo para simplificar registros) */}
              {!editingProduct && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-700 text-xs flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Plantillas Rápidas CREANDO:
                    </span>
                    <button
                      type="button"
                      onClick={clearForm}
                      className="text-[11px] text-slate-400 hover:text-slate-600 underline cursor-pointer"
                    >
                      Limpiar datos
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_TEMPLATES.map((tmpl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => applyTemplate(tmpl)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-[#0052cc] text-slate-700 text-[11px] font-semibold transition-colors cursor-pointer border border-slate-200/80"
                      >
                        + {tmpl.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Descripción del Producto *
                </label>
                <input
                  type="text"
                  placeholder="ej. CARNETS SUBLIMADOS CON ACCESORIOS"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-bold focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Precio ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-mono font-black text-sm focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Cantidad (Stock)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="100"
                    value={stock}
                    onChange={e => setStock(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-mono font-bold focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={clearForm}
                  className="px-3 py-2 text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
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
                    {editingProduct ? 'Actualizar Producto' : 'Guardar en Inventario'}
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
