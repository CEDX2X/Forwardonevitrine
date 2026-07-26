import React, { useState } from 'react';

interface ForwardOneLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  onAdminTrigger?: () => void;
  className?: string;
}

export const ForwardOneLogo: React.FC<ForwardOneLogoProps> = ({
  variant = 'light',
  size = 'md',
  showTagline = true,
  onAdminTrigger,
  className = ''
}) => {
  const [clickCount, setClickCount] = useState(0);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAdminTrigger) {
      onAdminTrigger();
    }
  };

  const handleSingleClick = () => {
    setClickCount((prev) => prev + 1);
    if (clickCount >= 1) {
      if (onAdminTrigger) onAdminTrigger();
      setClickCount(0);
    } else {
      setTimeout(() => setClickCount(0), 400);
    }
  };

  const sizeClasses = {
    sm: { height: 'h-8', text: 'text-base sm:text-lg', tagline: 'text-[9px]', icon: 'w-7 h-7' },
    md: { height: 'h-10 sm:h-12', text: 'text-xl sm:text-2xl', tagline: 'text-[10px] sm:text-[11px]', icon: 'w-9 h-9 sm:w-11 sm:h-11' },
    lg: { height: 'h-14 sm:h-16', text: 'text-3xl sm:text-4xl', tagline: 'text-xs sm:text-sm', icon: 'w-12 h-12 sm:w-16 sm:h-16' }
  }[size];

  const textColor = variant === 'dark' ? 'text-[#102A6B]' : 'text-white';
  const taglineColor = variant === 'dark' ? 'text-[#102A6B]' : 'text-[#00C2C2]';

  return (
    <div
      onClick={handleSingleClick}
      onDoubleClick={handleDoubleClick}
      className={`relative inline-flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group ${className}`}
    >
      {/* Brand Vector Icon matching official Forward One mark */}
      <svg
        viewBox="0 0 100 100"
        className={`${sizeClasses.icon} shrink-0 transition-transform group-hover:scale-105 duration-200`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top Slanted Parallelogram */}
        <path
          d="M 18 10 L 76 10 L 88 33 L 30 33 Z"
          fill={variant === 'dark' ? '#3B529A' : '#5269C2'}
        />
        
        {/* Bottom Green Logo Mark */}
        <path
          d="M 36 41 L 64 41 L 77 63 L 52 63 L 42 86 L 28 63 Z"
          fill="#12B857"
        />
      </svg>

      {/* Brand Text */}
      <div className="flex flex-col justify-center">
        <div className={`font-black tracking-tight leading-none ${sizeClasses.text} ${textColor}`}>
          Forward<span className={variant === 'dark' ? 'text-[#102A6B]' : 'text-[#00C2C2]'}>One</span>
        </div>
        {showTagline && (
          <div className={`font-semibold tracking-wide mt-1 leading-none ${sizeClasses.tagline} ${taglineColor}`}>
            Progress Without Limits.
          </div>
        )}
      </div>
    </div>
  );
};

