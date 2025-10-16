import React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({ text, disabled = false, speed = 5, className = '' }) => {
  const animationDuration = `${speed}s`;

  if (disabled) {
    return (
      <div className={className}>
        {text}
      </div>
    );
  }

  return (
    <div
      className={`bg-clip-text text-transparent inline-block animate-shine ${className}`}
      style={{
        backgroundImage: 'linear-gradient(120deg, #ffbcab 40%, rgba(255, 255, 255, 0.9) 50%, #ffbcab 60%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        animationDuration: animationDuration
      }}
    >
      {text}
    </div>
  );
};

export default ShinyText;
