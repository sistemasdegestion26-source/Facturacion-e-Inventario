import React from 'react';

interface CreandoLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const CreandoLogo: React.FC<CreandoLogoProps> = ({ 
  className = '', 
  size = 'md', 
  showTagline = true 
}) => {
  const bulbSizes = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  const subTextSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs'
  };

  return (
    <div className={`flex flex-col items-center text-center select-none ${className}`}>
      {/* Lightbulb Artwork SVG matching factura.jfif */}
      <div className={`relative ${bulbSizes[size]} mb-1 flex items-center justify-center`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
          {/* Light Rays */}
          <line x1="50" y1="6" x2="50" y2="14" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="20" y1="18" x2="26" y2="24" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="80" y1="18" x2="74" y2="24" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="8" y1="46" x2="16" y2="46" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="92" y1="46" x2="84" y2="46" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />

          {/* Bulb Outer Contour */}
          <circle cx="50" cy="46" r="30" fill="none" stroke="#0052cc" strokeWidth="3" />
          
          {/* Soft Glow inner */}
          <circle cx="50" cy="46" r="28" fill="#f8fafc" />

          {/* Heart / Idea loop inside filament */}
          <path
            d="M 50 36 
               C 45 28, 36 32, 38 42
               C 40 48, 47 52, 50 56
               C 53 52, 60 48, 62 42
               C 64 32, 55 28, 50 36 Z"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Green / Teal swirl at base of bulb */}
          <path
            d="M 40 64 C 45 61, 55 61, 60 64 C 58 70, 42 70, 40 64 Z"
            fill="#0d9488"
          />

          {/* Bulb Base Threads */}
          <path
            d="M 42 71 L 58 71
               M 44 75 L 56 75
               M 46 79 L 54 79"
            stroke="#0052cc"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Text */}
      <div className={`font-black tracking-wider text-[#0052cc] uppercase leading-none font-sans ${textSizes[size]}`}>
        CREANDO
      </div>

      {showTagline && (
        <>
          <div className={`text-[#0052cc] font-medium tracking-tight mt-0.5 ${subTextSizes[size]}`}>
            HACEMOS REALIDAD TUS IDEAS
          </div>

          <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500 font-medium">
            <span className="w-3.5 h-3.5 rounded-sm bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white text-[8px] font-bold">
              📷
            </span>
            <span className="text-[#0052cc] font-semibold hover:underline">
              @creando_tinaquillo
            </span>
          </div>
        </>
      )}
    </div>
  );
};
