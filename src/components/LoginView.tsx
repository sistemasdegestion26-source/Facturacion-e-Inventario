import React, { useState, useEffect } from 'react';
import { CreandoLogo } from './CreandoLogo';
import { Lock, User, ArrowRight, AlertCircle, ShieldCheck, Sparkles } from 'lucide-react';
import simonAvatar from '../assets/simon.jpg';
import { storageService } from '../services/storageService';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isWelcoming, setIsWelcoming] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validación con usuario Hendrick y contraseña almacenada
    const validUser = 'Hendrick';
    const validPass = storageService.getPassword();

    if (username.trim() === validUser && password === validPass) {
      // Activar animación con la imagen saludando y el mensaje "Hola Hendrick"
      setIsWelcoming(true);
    } else {
      setError('Credenciales incorrectas. Verifique el usuario y clave de acceso.');
    }
  };

  // Desaparece exactamente a los 2 segundos como solicitó el usuario
  useEffect(() => {
    if (isWelcoming) {
      const timer = setTimeout(() => {
        onLoginSuccess();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isWelcoming, onLoginSuccess]);

  const handleFillDemo = () => {
    setUsername('Hendrick');
    setPassword(storageService.getPassword());
    setError(null);
  };

  // Pantalla de animación de bienvenida: aparece saludando y desaparece a los 2 segundos
  if (isWelcoming) {
    return (
      <div className="min-h-screen bg-gradient-commercial-dark relative overflow-hidden flex flex-col justify-center items-center px-4 py-8 animate-fade-in">
        {/* Luces ambientales sutiles en azul, verde y negro */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
        
        <div className="w-full max-w-sm bg-white/95 backdrop-blur-md border border-cyan-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 text-center space-y-4 animate-scale-up relative overflow-hidden">
          {/* Barra superior con los colores internos del logo degradado y metalizado */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-metallic-logo-inner"></div>

          {/* Logo CREANDO en la pantalla de bienvenida (Emblema exacto de la imagen adjunta) */}
          <div className="flex justify-center pt-1">
            <CreandoLogo variant="badge" size="sm" />
          </div>

          {/* Imagen animada saludando con halo degradado metalizado */}
          <div className="relative mx-auto w-36 h-48 sm:w-44 sm:h-56 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/30 via-emerald-400/30 to-blue-600/30 rounded-full blur-2xl scale-95 pointer-events-none -z-10"></div>
            <img
              src={simonAvatar}
              alt="Simon Chipmunk saludando"
              className="w-full h-full object-contain drop-shadow-md animate-float select-none"
            />
          </div>

          {/* Mensaje de saludo: Hola Hendrick */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-metallic-logo-inner border border-cyan-400/40 text-amber-300 text-[11px] font-black uppercase tracking-wider shadow-sm sheen-metallic">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span>Acceso Autorizado</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
              <span>Hola Hendrick</span>
              <span className="inline-block animate-wave text-2xl">✌️</span>
            </h1>

            <p className="text-xs text-slate-500 font-medium">
              Iniciando CREANDO...
            </p>
          </div>

          {/* Barra de progreso con degradado comercial azul, verde y negro */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-metallic-logo-inner h-full rounded-full transition-all duration-2000 w-full animate-pulse"></div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          CREANDO • Hacemos realidad tus ideas • Tinaquillo
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-commercial-dark relative overflow-hidden flex flex-col justify-center items-center px-4 py-8">
      {/* Resplandores ambientales sutiles entre azul y verde sobre fondo oscuro */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Marca de agua sutil del logo en el fondo */}
      <div className="absolute right-10 bottom-10 opacity-10 pointer-events-none hidden lg:block scale-125">
        <CreandoLogo variant="badge" size="xl" />
      </div>

      {/* Container with soft subtle borders & shadows */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl shadow-2xl p-7 sm:p-8 space-y-5 relative overflow-hidden">
        
        {/* Barra superior con los colores internos del logo degradado y metalizado */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-metallic-logo-inner"></div>

        {/* Brand Logo Prominente - Exacto a la imagen adjunta por el usuario */}
        <div className="flex justify-center pb-1 pt-1">
          <div className="p-1 rounded-full bg-slate-950 shadow-xl border border-slate-800/80 ring-4 ring-cyan-500/10 hover:ring-cyan-500/30 transition-all">
            <CreandoLogo variant="badge" size="lg" />
          </div>
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-bold"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono"
                required
              />
            </div>
          </div>

          {/* Botón con degradado metalizado comercial */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-metallic-logo-inner text-white font-extrabold text-sm rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 border border-cyan-400/30 sheen-metallic"
          >
            <span>Acceder al Sistema</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

        {/* Credentials Reminder Helper */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5 text-slate-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Acceso seguro único
          </span>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-[#0052cc] hover:text-emerald-700 hover:underline font-semibold transition-colors cursor-pointer"
          >
            Completar credenciales
          </button>
        </div>

      </div>

      <div className="mt-6 text-center text-xs text-slate-400 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        <span>CREANDO • Hacemos realidad tus ideas • Tinaquillo</span>
      </div>
    </div>
  );
};
