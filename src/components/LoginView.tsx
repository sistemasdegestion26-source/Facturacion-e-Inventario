import React, { useState } from 'react';
import { CreandoLogo } from './CreandoLogo';
import { Lock, User, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Credenciales requeridas
    const validUser = 'Hendrick';
    const validPass = 'Ceo2026';

    if (username.trim() === validUser && password === validPass) {
      onLoginSuccess();
    } else {
      setError('Credenciales incorrectas. Verifique el usuario y clave de acceso.');
    }
  };

  const handleFillDemo = () => {
    setUsername('Hendrick');
    setPassword('Ceo2026');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-8">
      {/* Container with soft subtle borders & shadows */}
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl shadow-sm p-8 space-y-6">
        
        {/* Brand Logo */}
        <div className="flex justify-center pb-2">
          <CreandoLogo size="lg" />
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-slate-800">
            Iniciar Sesión
          </h2>
          <p className="text-xs text-slate-500">
            Ingrese sus credenciales autorizadas para acceder al sistema
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Usuario de Acceso
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Clave de Acceso
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-[#0052cc] hover:bg-[#0047b3] text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <span>Acceder</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Credentials Reminder Helper */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Acceso único
          </span>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-[#0052cc] hover:underline font-medium"
          >
            Completar credenciales
          </button>
        </div>

      </div>

      <div className="mt-6 text-center text-xs text-slate-400">
        CREANDO • Hacemos realidad tus ideas • Tinaquillo
      </div>
    </div>
  );
};
