import React, { useState } from 'react';
import { Product } from '../types/erp';
import { Package, Plus, Search, Edit2, Trash2, Check, AlertCircle } from 'lucide-react';

interface InventoryViewProps {
  products: Product[];
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  onSaveProduct,
  onDeleteProduct
}) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states: SIMPLIFICADO A SOLO DESCRIPCIÓN Y PRECIO (+ STOCK SIMPLE)
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [stock, setStock] = useState<number | string>('100');

  const openNewModal = () => {
    setEditingProduct(null);
    setDescription('');
    setPrice('');
    setStock('100');
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

  const filtered = products.filter(p => 
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#0052cc]" />
            Inventario
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Carga y control simplificado de productos (descripción y precio)
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-commercial-btn text-white text-xs sm:text-sm font-bold transition-all shadow-md active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Cargar Producto
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por descripción..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 shadow-xs"
        />
      </div>

      {/* Responsive List: Cards on Phone, Table on PC */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        
        {/* Phone View (Android / iPhone) */}
        <div className="md:hidden divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No hay productos registrados. Presione "Cargar Producto".
            </div>
          ) : (
            filtered.map(p => (
              <div key={p.id} className="p-3.5 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-800 text-xs uppercase leading-snug">
                    {p.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                      ${p.price.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono bg-blue-50 text-[#0052cc] px-2 py-0.5 rounded-md font-medium">
                      {p.stock} unid.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEditModal(p)}
                    className="p-2 text-slate-500 hover:text-blue-600 bg-slate-50 rounded-xl"
                    title="Editar"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`¿Eliminar "${p.description}"?`)) {
                        onDeleteProduct(p.id);
                      }
                    }}
                    className="p-2 text-slate-500 hover:text-rose-600 bg-slate-50 rounded-xl"
                    title="Eliminar"
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
                <th className="py-3 px-4">Descripción</th>
                <th className="py-3 px-4 text-right">Precio Unitario</th>
                <th className="py-3 px-4 text-center">Stock</th>
                <th className="py-3 px-4 text-center w-28">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 text-xs">
                    No hay productos en inventario. Presione "Cargar Producto" para registrar el primero.
                  </td>
                </tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {p.description}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      ${p.price.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
                        {p.stock} unid.
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Editar producto"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
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

      {/* Modal Cargar / Editar Producto con degradado comercial */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
            <div className="bg-gradient-commercial-header text-white px-6 py-4 flex items-center justify-between border-b border-cyan-900/40">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Package className="w-4 h-4 text-cyan-300" />
                {editingProduct ? 'Editar Producto' : 'Cargar Producto'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-300 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Descripción *
                </label>
                <input
                  type="text"
                  placeholder="ej. CARNETS SUBLIMADOS CON ACCESORIOS"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Precio ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-mono font-bold focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Cantidad (Stock)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="100"
                    value={stock}
                    onChange={e => setStock(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-mono focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-commercial-btn text-white font-bold transition-all shadow-md cursor-pointer active:scale-98"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
