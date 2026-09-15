import React from 'react';
import { motion } from 'motion/react';

interface EthiopianFlagProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const EthiopianFlag: React.FC<EthiopianFlagProps> = ({
  className = '',
  size = 'md',
  showLabel = false,
}) => {
  // Dimensions for "no big no small" - balanced size:
  // sm: 38x20 px
  // md: 48x26 px (standard golden balance)
  // lg: 60x32 px
  const dimensions = {
    sm: { w: 38, h: 20 },
    md: { w: 50, h: 27 },
    lg: { w: 64, h: 35 },
  }[size];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`inline-flex items-center gap-2.5 ${className}`}
    >
      {/* Glowing Container */}
      <div className="relative group cursor-pointer select-none">
        {/* Animated Tricolor Ambient Glow Layers */}
        <div
          className="absolute -inset-1 rounded-lg opacity-75 blur-md transition-all duration-500 group-hover:opacity-100 group-hover:blur-lg animate-pulse pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(0, 154, 68, 0.6) 0%, rgba(254, 209, 0, 0.8) 50%, rgba(224, 28, 38, 0.6) 100%)',
          }}
        />
        
        {/* Soft Secondary Glow Aura */}
        <div
          className="absolute -inset-2 rounded-xl opacity-40 blur-xl pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(254, 209, 0, 0.7) 0%, rgba(0, 154, 68, 0.3) 50%, rgba(224, 28, 38, 0.3) 100%)',
          }}
        />

        {/* Flag SVG Card */}
        <div
          className="relative rounded-md overflow-hidden border border-white/25 shadow-[0_0_15px_rgba(254,209,0,0.5),0_0_25px_rgba(0,154,68,0.3)] transition-transform duration-300 group-hover:scale-105"
          style={{
            width: `${dimensions.w}px`,
            height: `${dimensions.h}px`,
          }}
        >
          <svg
            viewBox="0 0 120 60"
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            className="block w-full h-full"
          >
            {/* Top Green Stripe */}
            <rect x="0" y="0" width="120" height="20" fill="#009A44" />

            {/* Middle Yellow Stripe */}
            <rect x="0" y="20" width="120" height="20" fill="#FED100" />

            {/* Bottom Red Stripe */}
            <rect x="0" y="40" width="120" height="20" fill="#E01C26" />

            {/* Central Light Blue Disc (Emblem of Ethiopia) */}
            <circle cx="60" cy="30" r="15" fill="#0F47AF" />

            {/* Radiant Rays of the Emblem */}
            <g stroke="#FED100" strokeWidth="1.3" strokeLinecap="round">
              {/* 5 Rays radiating outward between star vertices */}
              <line x1="60" y1="30" x2="60" y2="44" />
              <line x1="60" y1="30" x2="73.3" y2="34.3" />
              <line x1="60" y1="30" x2="68.2" y2="18.7" />
              <line x1="60" y1="30" x2="51.8" y2="18.7" />
              <line x1="60" y1="30" x2="46.7" y2="34.3" />
            </g>

            {/* 5-Pointed Yellow Star (Emblem of Ethiopia) */}
            <polygon
              points="
                60.00,19.20 
                62.64,26.36 
                70.46,26.60 
                64.28,31.39 
                66.47,38.90 
                60.00,34.50 
                53.53,38.90 
                55.72,31.39 
                49.54,26.60 
                57.36,26.36
              "
              fill="#FED100"
            />
          </svg>
        </div>
      </div>

      {showLabel && (
        <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-300">
          Ethiopia 🇪🇹
        </span>
      )}
    </motion.div>
  );
};
