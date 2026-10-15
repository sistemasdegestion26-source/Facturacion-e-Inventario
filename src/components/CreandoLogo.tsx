import React from 'react';

export interface CreandoLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  lightText?: boolean;
  metallicText?: boolean;
  variant?: 'badge' | 'vertical' | 'horizontal' | 'icon';
}

export const CreandoLogo: React.FC<CreandoLogoProps> = ({ 
  className = '', 
  size = 'md', 
  showTagline = true,
  lightText = false,
  metallicText = false,
  variant = 'vertical'
}) => {
  // Sizing maps
  const badgeSizes = {
    xs: 'w-10 h-10',
    sm: 'w-14 h-14',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-44 h-44 sm:w-52 sm:h-52',
    xl: 'w-64 h-64 sm:w-72 sm:h-72'
  };

  const bulbSizes = {
    xs: 'w-7 h-7',
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28'
  };

  const textSizes = {
    xs: 'text-sm font-black tracking-wide',
    sm: 'text-base sm:text-lg font-black tracking-wider',
    md: 'text-xl sm:text-2xl font-black tracking-widest',
    lg: 'text-3xl sm:text-4xl font-black tracking-widest',
    xl: 'text-5xl font-black tracking-widest'
  };

  const subTextSizes = {
    xs: 'text-[8px]',
    sm: 'text-[9px] sm:text-[10px]',
    md: 'text-[11px] sm:text-xs',
    lg: 'text-xs sm:text-sm',
    xl: 'text-sm'
  };

  // Reusable SVG Gradients and filters
  const SvgDefs = () => (
    <defs>
      {/* Metallic Gold / Amber for inner filament heart loop */}
      <linearGradient id="innerFilamentGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#b45309" />
        <stop offset="30%" stopColor="#f59e0b" />
        <stop offset="55%" stopColor="#fef08a" />
        <stop offset="80%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#92400e" />
      </linearGradient>

      {/* 3D Metallic Emerald / Teal Ribbon Swirl */}
      <linearGradient id="emeraldRibbon3D" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#022c22" />
        <stop offset="25%" stopColor="#064e3b" />
        <stop offset="45%" stopColor="#059669" />
        <stop offset="65%" stopColor="#10b981" />
        <stop offset="82%" stopColor="#34d399" />
        <stop offset="92%" stopColor="#a7f3d0" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>

      {/* 3D Metallic Sapphire / Electric Blue Bulb Contour */}
      <linearGradient id="metallicBlue3D" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0b1736" />
        <stop offset="22%" stopColor="#1e3a8a" />
        <stop offset="48%" stopColor="#0052cc" />
        <stop offset="72%" stopColor="#38bdf8" />
        <stop offset="88%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#082046" />
      </linearGradient>

      {/* Glossy specular highlight reflection */}
      <linearGradient id="specularHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#0052cc" stopOpacity="0" />
      </linearGradient>

      {/* Metallic Chrome Screw Base Threads */}
      <linearGradient id="screwThreads" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0f172a" />
        <stop offset="30%" stopColor="#0284c7" />
        <stop offset="50%" stopColor="#7dd3fc" />
        <stop offset="70%" stopColor="#0052cc" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>

      {/* Warm Incandescent Glow inside the Bulb */}
      <radialGradient id="bulbInnerWarmth" cx="48%" cy="46%" r="52%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
        <stop offset="25%" stopColor="#fef08a" stopOpacity="0.92" />
        <stop offset="55%" stopColor="#f59e0b" stopOpacity="0.75" />
        <stop offset="85%" stopColor="#d97706" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </radialGradient>

      {/* Outer ambient glow for the emblem badge */}
      <radialGradient id="badgeAmbientGlow" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#0052cc" stopOpacity="0.25" />
        <stop offset="40%" stopColor="#059669" stopOpacity="0.15" />
        <stop offset="75%" stopColor="#f59e0b" stopOpacity="0.08" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </radialGradient>

      {/* Drop shadow filter */}
      <filter id="bulbGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
  );

  // If the user requests the full circular emblem badge (exact match of uploaded image "logo cre.jpg")
  if (variant === 'badge') {
    return (
      <div className={`relative ${badgeSizes[size]} shrink-0 select-none group ${className}`}>
        <svg 
          viewBox="0 0 500 500" 
          className="w-full h-full drop-shadow-2xl overflow-visible"
        >
          <SvgDefs />

          {/* Deep Black / Onyx Circular Background */}
          <circle cx="250" cy="250" r="248" fill="#030712" />
          
          {/* Ambient inner glow */}
          <circle cx="250" cy="230" r="230" fill="url(#badgeAmbientGlow)" />

          {/* Crisp White Outer Ring Border */}
          <circle 
            cx="250" 
            cy="250" 
            r="236" 
            fill="none" 
            stroke="#ffffff" 
            strokeWidth="7" 
            strokeLinecap="round"
          />

          {/* 6 Amber / Orange Radiating Light Rays */}
          <g stroke="url(#innerFilamentGold)" strokeWidth="3.6" strokeLinecap="round" opacity="0.95">
            {/* Top ray */}
            <line x1="250" y1="80" x2="250" y2="98" />
            {/* Top left ray */}
            <line x1="184" y1="102" x2="198" y2="116" />
            {/* Top right ray */}
            <line x1="316" y1="102" x2="302" y2="116" />
            {/* Mid left ray */}
            <line x1="158" y1="148" x2="174" y2="155" />
            {/* Mid right ray */}
            <line x1="342" y1="148" x2="326" y2="155" />
            {/* Far left ray */}
            <line x1="152" y1="198" x2="170" y2="198" />
            {/* Far right ray */}
            <line x1="348" y1="198" x2="330" y2="198" />
          </g>

          {/* Center Lightbulb Group (scaled and positioned) */}
          <g transform="translate(250, 192)">
            
            {/* Inner Bulb Incandescent Warm Glow */}
            <circle cx="0" cy="-22" r="54" fill="url(#bulbInnerWarmth)" />

            {/* Inner Heart / Loop Filament in Metallic Gold */}
            <path
              d="M 0 -38 
                 C -12 -54, -28 -44, -25 -26
                 C -22 -14, -8 -6, 0 2
                 C 8 -6, 22 -14, 25 -26
                 C 28 -44, 12 -54, 0 -38 Z"
              fill="none"
              stroke="url(#innerFilamentGold)"
              strokeWidth="4.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#bulbGlowFilter)"
            />
            {/* Center Filament Core Sparkle */}
            <circle cx="0" cy="-28" r="2.8" fill="#ffffff" />

            {/* 3D Metallic Sapphire / Electric Blue Bulb Contour (Left Side & Crown) */}
            <path
              d="M 0 -76 
                 C -40 -76, -72 -44, -72 -4
                 C -72 26, -52 48, -42 70
                 L -26 70
                 C -34 50, -52 30, -52 -4
                 C -52 -32, -28 -58, 0 -58 Z"
              fill="url(#metallicBlue3D)"
              stroke="#1e3a8a"
              strokeWidth="1.2"
            />

            {/* Specular highlight along outer blue arc */}
            <path
              d="M -16 -68 C -44 -60, -64 -34, -64 -4"
              fill="none"
              stroke="url(#specularHighlight)"
              strokeWidth="3.2"
              strokeLinecap="round"
            />

            {/* 3D Metallic Emerald / Jade Leaf Ribbon (Wrapping from bottom around right flank) */}
            <path
              d="M -22 68 
                 C -6 74, 18 68, 30 52
                 C 48 28, 62 -2, 62 -28
                 C 62 -52, 42 -72, 18 -76
                 C 32 -70, 48 -50, 48 -26
                 C 48 2, 36 28, 20 46
                 C 8 58, -12 62, -22 68 Z"
              fill="url(#emeraldRibbon3D)"
              stroke="#064e3b"
              strokeWidth="1.2"
            />

            {/* Secondary Emerald Swirl Volume highlight */}
            <path
              d="M -12 62 C 6 64, 22 54, 32 38 C 42 22, 50 2, 50 -18"
              fill="none"
              stroke="#86efac"
              strokeWidth="2.4"
              strokeLinecap="round"
              opacity="0.85"
            />

            {/* Base Threads of the Bulb in Metallic Electric Blue */}
            <g stroke="url(#screwThreads)" strokeWidth="4.2" strokeLinecap="round">
              <line x1="-22" y1="78" x2="22" y2="78" />
              <line x1="-19" y1="86" x2="19" y2="86" />
              <line x1="-15" y1="94" x2="15" y2="94" />
            </g>

            {/* Metallic Base Contact Point */}
            <path d="M -8 100 L 8 100" stroke="url(#innerFilamentGold)" strokeWidth="3.5" strokeLinecap="round" />
          </g>

          {/* Typography: "CREANDO" in Pristine White Bold Serif/Display Font */}
          <text
            x="250"
            y="350"
            textAnchor="middle"
            fill="#ffffff"
            style={{
              fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif",
              fontSize: '56px',
              fontWeight: 900,
              letterSpacing: '0.12em',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))'
            }}
          >
            CREANDO
          </text>

          {/* Typography: "HACEMOS REALIDAD TUS IDEAS" in Clean Sans-Serif */}
          <text
            x="250"
            y="382"
            textAnchor="middle"
            fill="#ffffff"
            style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '13.5px',
              fontWeight: 700,
              letterSpacing: '0.22em',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))'
            }}
          >
            HACEMOS REALIDAD TUS IDEAS
          </text>
        </svg>
      </div>
    );
  }

  // The central Bulb Symbol (used in vertical, horizontal and icon variants)
  const BulbSvg = (
    <div className={`relative ${bulbSizes[size]} shrink-0 drop-shadow-sm flex items-center justify-center`}>
      <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-sm select-none">
        <SvgDefs />

        {/* Light Rays with gold amber sheen */}
        <g stroke="url(#innerFilamentGold)" strokeWidth="2.6" strokeLinecap="round">
          <line x1="50" y1="5" x2="50" y2="12" />
          <line x1="20" y1="17" x2="26" y2="23" />
          <line x1="80" y1="17" x2="74" y2="23" />
          <line x1="8" y1="46" x2="16" y2="46" />
          <line x1="92" y1="46" x2="84" y2="46" />
        </g>

        {/* Glass Bulb Inner Glow Fill */}
        <circle cx="50" cy="46" r="27" fill="url(#bulbInnerWarmth)" />

        {/* Outer Metallic Sapphire Contour */}
        <circle cx="50" cy="46" r="29" fill="none" stroke="url(#metallicBlue3D)" strokeWidth="3" />

        {/* Inner Heart / Idea Loop Filament in Metallic Gold */}
        <path
          d="M 50 35 
             C 44 26, 35 31, 37 42
             C 39 49, 47 53, 50 57
             C 53 53, 61 49, 63 42
             C 65 31, 56 26, 50 35 Z"
          fill="none"
          stroke="url(#innerFilamentGold)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Center Sparkle Inside Heart */}
        <circle cx="50" cy="43" r="1.8" fill="#fef08a" />

        {/* Metallic Emerald Ribbon Swirl wrapping around base */}
        <path
          d="M 38 62 C 45 58, 55 58, 62 62 C 60 70, 40 70, 38 62 Z"
          fill="url(#emeraldRibbon3D)"
          stroke="#064e3b"
          strokeWidth="0.8"
        />

        {/* Bulb Base Threads with metallic electric luster */}
        <path
          d="M 42 71 L 58 71
             M 44 75 L 56 75
             M 46 79 L 54 79"
          stroke="url(#screwThreads)"
          strokeWidth="2.6"
          strokeLinecap="round"
        />

        {/* Base Contact Point */}
        <path d="M 48 82 L 52 82" stroke="url(#innerFilamentGold)" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </div>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {BulbSvg}
      </div>
    );
  }

  // Text Color logic
  let textColorClass = 'text-[#0052cc]';
  if (metallicText) {
    textColorClass = 'text-metallic-logo';
  } else if (lightText) {
    textColorClass = 'text-white';
  }

  const Content = (
    <>
      <div className={`uppercase leading-none font-sans font-black ${textSizes[size]} ${textColorClass}`}>
        CREANDO
      </div>

      {showTagline && (
        <div className="flex flex-col items-center">
          <div className={`font-bold tracking-tight mt-0.5 ${subTextSizes[size]} ${
            lightText ? 'text-cyan-200' : 'text-[#0052cc]'
          }`}>
            HACEMOS REALIDAD TUS IDEAS
          </div>

          <div className={`flex items-center gap-1 mt-0.5 text-[10px] font-medium ${
            lightText ? 'text-slate-300' : 'text-slate-500'
          }`}>
            <span className="w-3.5 h-3.5 rounded-sm bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white text-[8px] font-bold shrink-0">
              📷
            </span>
            <span className={`font-semibold hover:underline ${lightText ? 'text-cyan-300' : 'text-[#0052cc]'}`}>
              @creando_tinaquillo
            </span>
          </div>
        </div>
      )}
    </>
  );

  if (variant === 'horizontal') {
    return (
      <div className={`inline-flex items-center gap-2.5 sm:gap-3.5 select-none text-left ${className}`}>
        {BulbSvg}
        <div className="flex flex-col">
          {Content}
        </div>
      </div>
    );
  }

  // Vertical (default)
  return (
    <div className={`flex flex-col items-center text-center select-none ${className}`}>
      {BulbSvg}
      {Content}
    </div>
  );
};
