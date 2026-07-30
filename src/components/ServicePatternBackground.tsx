import React from 'react';

interface ServicePatternBackgroundProps {
  theme?: 'light' | 'dark';
  className?: string;
  variant?: 'left' | 'right' | 'both';
}

export const ServicePatternBackground: React.FC<ServicePatternBackgroundProps> = ({
  theme = 'light',
  className = '',
  variant = 'both'
}) => {
  const isDark = theme === 'dark';

  // Opacity & colors tuned to match the reference image:
  // Solid silver-lavender in dark mode, elegant slate-indigo in light mode
  const squareFill = isDark 
    ? 'rgba(195, 203, 235, 0.22)' 
    : 'rgba(83, 98, 220, 0.09)';
  
  const squareFillSolid = isDark 
    ? 'rgba(215, 222, 250, 0.28)' 
    : 'rgba(83, 98, 220, 0.12)';

  const squareFillDim = isDark 
    ? 'rgba(175, 185, 220, 0.16)' 
    : 'rgba(83, 98, 220, 0.06)';

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full object-cover opacity-95 transition-opacity duration-300"
        viewBox="0 0 1400 800"
        preserveAspectRatio="xMinYMin slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left/Main Cluster - Exact Faithful Reproduction of the Reference Image */}
        {(variant === 'left' || variant === 'both') && (
          <g transform="translate(-40, 260) rotate(-38) scale(1.15)">
            {/* --- SOLID 4x5 CHECKERBOARD MATRIX BLOCK --- */}
            {/* Column 0 */}
            <rect x="0" y="80" width="72" height="72" rx="3" fill={squareFillSolid} />
            <rect x="0" y="240" width="72" height="72" rx="3" fill={squareFillSolid} />
            <rect x="0" y="400" width="72" height="72" rx="3" fill={squareFillSolid} />

            {/* Column 1 */}
            <rect x="80" y="0" width="72" height="72" rx="3" fill={squareFillSolid} />
            <rect x="80" y="160" width="72" height="72" rx="3" fill={squareFillSolid} />
            <rect x="80" y="320" width="72" height="72" rx="3" fill={squareFillSolid} />
            <rect x="80" y="480" width="72" height="72" rx="3" fill={squareFillSolid} />

            {/* Column 2 */}
            <rect x="160" y="80" width="72" height="72" rx="3" fill={squareFillSolid} />
            <rect x="160" y="240" width="72" height="72" rx="3" fill={squareFillSolid} />
            <rect x="160" y="400" width="72" height="72" rx="3" fill={squareFillSolid} />

            {/* Column 3 */}
            <rect x="240" y="0" width="72" height="72" rx="3" fill={squareFillSolid} />
            <rect x="240" y="160" width="72" height="72" rx="3" fill={squareFillSolid} />
            <rect x="240" y="320" width="72" height="72" rx="3" fill={squareFillSolid} />

            {/* --- GAP COLUMN AT X = 320 --- */}

            {/* --- PARALLEL STRIP 1 (AT X = 400) --- */}
            <rect x="400" y="-80" width="76" height="76" rx="3" fill={squareFillSolid} />
            <rect x="420" y="110" width="44" height="44" rx="2" fill={squareFill} />
            <rect x="390" y="230" width="72" height="72" rx="3" fill={squareFillSolid} />
            <rect x="400" y="380" width="60" height="60" rx="3" fill={squareFill} />

            {/* --- GAP COLUMN AT X = 480 --- */}

            {/* --- PARALLEL STRIP 2 (AT X = 540) --- */}
            <rect x="550" y="-40" width="46" height="46" rx="2" fill={squareFill} />
            <rect x="520" y="80" width="64" height="64" rx="3" fill={squareFillSolid} />
            <rect x="560" y="210" width="48" height="48" rx="2" fill={squareFillDim} />

            {/* --- GAP COLUMN AT X = 620 --- */}

            {/* --- PARALLEL STRIP 3 (AT X = 660) --- */}
            <rect x="670" y="60" width="40" height="40" rx="2" fill={squareFillDim} />
            <rect x="680" y="180" width="34" height="34" rx="2" fill={squareFillDim} />
          </g>
        )}

        {/* Right Balance Cluster (Subtle mirrored corner for full screens) */}
        {(variant === 'right' || variant === 'both') && (
          <g transform="translate(1000, -60) rotate(-38) scale(0.9)" opacity="0.6">
            <rect x="0" y="80" width="64" height="64" rx="3" fill={squareFillSolid} />
            <rect x="70" y="0" width="64" height="64" rx="3" fill={squareFillSolid} />
            <rect x="70" y="150" width="64" height="64" rx="3" fill={squareFillSolid} />
            <rect x="140" y="80" width="64" height="64" rx="3" fill={squareFillSolid} />
            <rect x="230" y="20" width="52" height="52" rx="2" fill={squareFill} />
            <rect x="230" y="140" width="44" height="44" rx="2" fill={squareFillDim} />
          </g>
        )}
      </svg>
    </div>
  );
};

