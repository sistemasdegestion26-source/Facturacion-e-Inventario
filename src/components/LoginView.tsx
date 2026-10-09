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
        
        <div className="w-full max-w-sm bg-white/95 backdrop-blur-md border border-cyan-500/30 rounded-3xl shadow-2xl p-8 text-center space-y-5 animate-scale-up relative overflow-hidden">
          {/* Barra superior con degradado comercial sutil */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-slate-950 via-[#0052cc] to-[#059669]"></div>

          {/* Imagen animada saludando */}
          <div className="relative mx-auto w-48 h-64 sm:w-56 sm:h-72 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/30 via-emerald-400/20 to-slate-900/10 rounded-full blur-2xl scale-95 pointer-events-none -z-10"></div>
            <img
              src={simonAvatar}
              alt="Simon Chipmunk saludando"
              className="w-full h-full object-contain drop-shadow-md animate-float select-none"
            />
          </div>

          {/* Mensaje de saludo: Hola Hendrick */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-slate-900 via-blue-900 to-emerald-900 border border-cyan-500/30 text-cyan-200 text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              <span>Acceso Autorizado</span>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
              <span>Hola Hendrick</span>
              <span className="inline-block animate-wave text-2xl">✌️</span>
            </h1>

            <p className="text-xs text-slate-500 font-medium">
              Iniciando CREANDO...
            </p>
          </div>

          {/* Barra de progreso con degradado comercial azul, verde y negro */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-950 via-[#0052cc] to-[#059669] h-full rounded-full transition-all duration-2000 w-full animate-pulse"></div>
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
      
      {/* Container with soft subtle borders & shadows */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl shadow-2xl p-8 space-y-6 relative overflow-hidden">
        
        {/* Barra superior con degradado sutil comercial: Negro -> Azul -> Verde */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-slate-950 via-[#0052cc] to-[#059669]"></div>

        {/* Brand Logo */}
        <div className="flex justify-center pb-2 pt-1">
          <CreandoLogo size="lg" />
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
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

          {/* Botón con degradado comercial sutil entre negro, azul y verde */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-commercial-btn text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>Acceder al Sistema</span>
            <ArrowRight className="w-4 h-4" />
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
