import React, { useState } from 'react';
import { Client } from '../types/erp';
import { CreandoLogo } from './CreandoLogo';
import { 
  Users, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Phone, 
  MapPin, 
  FileText,
  X,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface ClientesViewProps {
  clients: Client[];
  onSaveClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
}

export const ClientesView: React.FC<ClientesViewProps> = ({
  clients,
  onSaveClient,
  onDeleteClient
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'with_phone' | 'with_doc'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [document, setDocument] = useState('');
  const [address, setAddress] = useState('');

  const clearForm = () => {
    setName('');
    setPhone('');
    setDocument('');
    setAddress('');
  };

  const openNewModal = () => {
    setEditingClient(null);
    clearForm();
    setIsModalOpen(true);
  };

  const openEditModal = (c: Client) => {
    setEditingClient(c);
    setName(c.name);
    setPhone(c.phone || '');
    setDocument(c.document || '');
    setAddress(c.address || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const toSave: Client = {
      id: editingClient ? editingClient.id : `cli-${Date.now()}`,
      name: name.trim().toUpperCase(),
      phone: phone.trim(),
      document: document.trim().toUpperCase(),
      address: address.trim()
    };

    onSaveClient(toSave);
    setIsModalOpen(false);
  };

  // Consultas y Filtros Simplificados
  let filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone && c.phone.includes(search)) ||
    (c.document && c.document.toLowerCase().includes(search.toLowerCase()))
  );

  if (filterType === 'with_phone') {
    filtered = filtered.filter(c => Boolean(c.phone && c.phone.trim().length > 0));
  } else if (filterType === 'with_doc') {
    filtered = filtered.filter(c => Boolean(c.document && c.document.trim().length > 0));
  }

  const hasActiveFilters = search.trim() !== '' || filterType !== 'all';

  return (
    <div className="space-y-6">
      
      {/* Header con Logo CREANDO y colores metalizados */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs backdrop-blur-xs">
        <div className="flex items-center gap-3">
          <CreandoLogo size="sm" variant="icon" />
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Directorio de Clientes CREANDO</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-[#0052cc] border border-cyan-200">
                {clients.length} contactos
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Agenda comercial simplificada para emisión rápida de presupuestos y facturas
            </p>
          </div>
        </div>

        <button
          onClick={openNewModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-metallic-logo-inner hover:opacity-95 text-white text-xs sm:text-sm font-extrabold transition-all shadow-md active:scale-98 cursor-pointer border border-cyan-400/30 sheen-metallic"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Nuevo Cliente</span>
        </button>
      </div>

      {/* Consultas y Filtros */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Consultar cliente por nombre, teléfono o RIF..."
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
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              filterType === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos ({clients.length})
          </button>
          <button
            onClick={() => setFilterType('with_phone')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              filterType === 'with_phone'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Con Teléfono
          </button>
          <button
            onClick={() => setFilterType('with_doc')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              filterType === 'with_doc'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Con RIF/Cédula
          </button>

          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearch('');
                setFilterType('all');
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

      {/* Responsive List: Mobile Cards for Phone, Table for Desktop/PC */}
      <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
        
        {/* Mobile View (Android & iPhone) */}
        <div className="md:hidden divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <CreandoLogo size="sm" variant="icon" className="opacity-40 mb-2" />
              <p className="text-slate-500 font-bold text-sm">
                No se encontraron clientes
              </p>
              <p className="text-slate-400 text-xs mt-1">
                {hasActiveFilters ? 'Pruebe limpiando la búsqueda.' : 'Presione "Nuevo Cliente" para registrar.'}
              </p>
            </div>
          ) : (
            filtered.map(c => (
              <div key={c.id} className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                    {c.name}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-mono">
                    {c.phone && (
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-700 font-bold">
                        📞 {c.phone}
                      </span>
                    )}
                    {c.document && (
                      <span className="bg-blue-50 text-[#0052cc] px-2 py-0.5 rounded-md font-bold">
                        ID: {c.document}
                      </span>
                    )}
                  </div>
                  {c.address && (
                    <p className="text-[11px] text-slate-400 truncate">
                      📍 {c.address}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEditModal(c)}
                    className="p-2 text-blue-700 hover:text-blue-800 bg-blue-50 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer"
                    title="Editar datos del cliente"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`¿Eliminar cliente "${c.name}"?`)) {
                        onDeleteClient(c.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 bg-slate-50 rounded-xl cursor-pointer"
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
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-extrabold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Nombre / Razón Social</th>
                <th className="py-3.5 px-4">Teléfono</th>
                <th className="py-3.5 px-4">Cédula / RIF</th>
                <th className="py-3.5 px-4">Dirección</th>
                <th className="py-3.5 px-5 text-center w-28">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                    <CreandoLogo size="sm" variant="icon" className="opacity-40 mb-2 inline-block" />
                    <p className="font-bold text-slate-600">No hay clientes que coincidan con la búsqueda.</p>
                  </td>
                </tr>
              ) : (
                filtered.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-slate-900">
                      {c.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {c.phone || '-'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs">
                      {c.document ? (
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#0052cc] font-bold">
                          {c.document}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-xs max-w-xs truncate">
                      {c.address || '-'}
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(c)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-[#0052cc] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                          title="Editar cliente"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Eliminar al cliente "${c.name}"?`)) {
                              onDeleteClient(c.id);
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

      {/* Modal Cargar / Editar Cliente con degradado metalizado */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
            
            {/* Header con colores internos del logo degradado y metalizado */}
            <div className="bg-metallic-logo-inner text-white px-6 py-4 flex items-center justify-between border-b border-cyan-800/40">
              <div className="flex items-center gap-2.5">
                <CreandoLogo size="xs" variant="icon" />
                <div>
                  <h3 className="font-extrabold text-white text-base">
                    {editingClient ? 'Editar Cliente Cargado' : 'Registrar Nuevo Cliente'}
                  </h3>
                  <p className="text-[11px] text-cyan-200">
                    Carga simplificada de datos comerciales para facturas
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
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Nombre o Razón Social *
                </label>
                <input
                  type="text"
                  placeholder="ej. TINAQUILLO MOTORS, C.A."
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-bold focus:bg-white focus:outline-none focus:border-blue-500 uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    placeholder="ej. 0414-1234567"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-mono focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Cédula / RIF
                  </label>
                  <input
                    type="text"
                    placeholder="ej. J-12345678-9"
                    value={document}
                    onChange={e => setDocument(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-mono uppercase focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  placeholder="ej. Av. Bolívar, Tinaquillo, Cojedes"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
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
                    {editingClient ? 'Actualizar Cliente' : 'Guardar Cliente'}
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
