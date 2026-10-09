import React, { useState } from 'react';
import { Client } from '../types/erp';
import { Users, Plus, Search, Edit2, Trash2, Phone, MapPin, FileText } from 'lucide-react';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [document, setDocument] = useState('');
  const [address, setAddress] = useState('');

  const openNewModal = () => {
    setEditingClient(null);
    setName('');
    setPhone('');
    setDocument('');
    setAddress('');
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
      name: name.trim(),
      phone: phone.trim(),
      document: document.trim().toUpperCase(),
      address: address.trim()
    };

    onSaveClient(toSave);
    setIsModalOpen(false);
  };

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone && c.phone.includes(search)) ||
    (c.document && c.document.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#0052cc]" />
            Clientes
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Directorio de contactos para emisión de presupuestos y facturación
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0052cc] hover:bg-[#0047b3] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Nuevo Cliente
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar cliente por nombre o teléfono..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 shadow-xs"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Nombre / Empresa</th>
                <th className="py-3 px-4">Teléfono</th>
                <th className="py-3 px-4">Identificación Fiscal</th>
                <th className="py-3 px-4">Dirección</th>
                <th className="py-3 px-4 text-center w-28">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                    No se encontraron clientes. Presione "Nuevo Cliente" para agregar uno.
                  </td>
                </tr>
              ) : (
                filtered.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {c.name}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-xs">
                      {c.phone || '-'}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-xs">
                      {c.document || '-'}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs truncate max-w-xs">
                      {c.address || '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Eliminar al cliente "${c.name}"?`)) {
                              onDeleteClient(c.id);
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

      {/* Modal Cargar / Editar Cliente */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-[#0052cc]" />
                {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nombre Completo / Razón Social *
                </label>
                <input
                  type="text"
                  placeholder="ej. Distribuidora Central"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    placeholder="0412-1234567"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Cédula / RIF
                  </label>
                  <input
                    type="text"
                    placeholder="J-12345678-0"
                    value={document}
                    onChange={e => setDocument(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  placeholder="Sector o ciudad..."
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0052cc] hover:bg-[#0047b3] text-white font-bold transition-all shadow-xs"
                >
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
