import React from 'react';
import { GridBackground, DotBackground } from './ui/grid-dot-background';
import ShaderBackground from './ui/ShaderBackground';

interface BackgroundWrapperProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'dots' | 'grid' | 'subtle' | 'shader';
}

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({ 
  children, 
  className = '',
  variant = 'dots'
}) => {
  if (variant === 'shader') {
    return (
      <ShaderBackground
        className={`min-h-screen w-full ${className}`}
        backdropBlurAmount="sm"
        color="#0ea5e9" // Blue color for civic theme
      >
        <div className="page-transition w-full">
          {children}
        </div>
      </ShaderBackground>
    );
  }

  if (variant === 'dots') {
    return (
      <DotBackground
        className={`min-h-screen ${className}`}
        dotSize={1}
        dotColor="#e5e7eb"
        darkDotColor="#374151"
        spacing={25}
        showFade={true}
        fadeIntensity={35}
      >
        <div className="page-transition">
          {children}
        </div>
      </DotBackground>
    );
  }

  if (variant === 'grid') {
    return (
      <GridBackground
        className={`min-h-screen ${className}`}
        gridSize={20}
        gridColor="#e5e7eb"
        darkGridColor="#374151"
        showFade={true}
        fadeIntensity={30}
      >
        <div className="page-transition">
          {children}
        </div>
      </GridBackground>
    );
  }

  // Subtle variant - minimal background
  return (
    <div className={`min-h-screen relative bg-gradient-to-br from-gray-50/50 to-white ${className}`}>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="w-full h-full opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#64748b 0.5px, transparent 0.5px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>
      <div className="relative z-10 page-transition">
        {children}
      </div>
    </div>
  );
};

export default BackgroundWrapper;
