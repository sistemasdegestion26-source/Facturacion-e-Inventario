import React, { useState } from 'react';
import { User, Lock, KeyRound, Check, X, Shield, Eye, EyeOff } from 'lucide-react';
import simonAvatar from '../assets/simon.jpg';
import { storageService } from '../services/storageService';
import { CreandoLogo } from './CreandoLogo';

interface UserProfileModalProps {
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  onClose,
  onSuccess
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const storedPass = storageService.getPassword();

    if (currentPassword !== storedPass) {
      setError('La contraseña actual es incorrecta.');
      return;
    }

    if (!newPassword.trim() || newPassword.length < 4) {
      setError('La nueva contraseña debe tener al menos 4 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('La nueva contraseña y su confirmación no coinciden.');
      return;
    }

    storageService.setPassword(newPassword);
    onSuccess('Contraseña de acceso actualizada con éxito.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
        
        {/* Header con colores internos del logo degradado y metalizado */}
        <div className="bg-metallic-logo-inner text-white px-6 py-4 flex items-center justify-between border-b border-cyan-800/40 sheen-metallic">
          <div className="flex items-center gap-2.5">
            <CreandoLogo size="xs" variant="icon" />
            <div>
              <h3 className="font-extrabold text-white text-base">
                Perfil de Usuario • Hendrick
              </h3>
              <p className="text-[11px] text-cyan-200">
                Administración y cambio de contraseña de acceso
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white rounded-lg p-1 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">

        {/* User Card info */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
          <img
            src={simonAvatar}
            alt="Hendrick Avatar"
            className="w-14 h-14 rounded-full object-cover border-2 border-[#0052cc] shadow-xs"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 text-base">
                Hendrick
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#0052cc]">
                Administrador
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Usuario del Sistema CREANDO
            </p>
          </div>
        </div>

        {/* Change Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs pt-1">
            <KeyRound className="w-3.5 h-3.5 text-[#0052cc]" />
            <span>Editar Contraseña de Acceso</span>
          </div>

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
              {error}
            </div>
          )}

          {/* Contraseña Actual */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1">
              Contraseña Actual *
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                placeholder="Ingrese contraseña actual"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 pr-9 text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Nueva Contraseña */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1">
              Nueva Contraseña *
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                placeholder="Mínimo 4 caracteres"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 pr-9 text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1">
              Confirmar Nueva Contraseña *
            </label>
            <input
              type="password"
              placeholder="Repita la nueva contraseña"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 font-mono"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors font-medium cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-metallic-logo-inner text-white font-extrabold transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-98 border border-cyan-400/40 sheen-metallic"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Actualizar Contraseña</span>
            </button>
          </div>
        </form>

        </div>
      </div>
    </div>
  );
};
