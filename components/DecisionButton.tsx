import React from 'react';

interface Props {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'ghost';
}

const DecisionButton: React.FC<Props> = ({ onClick, children, variant = 'primary' }) => {
  const baseClasses = "group relative px-8 py-4 font-sans text-sm uppercase tracking-[0.2em] transition-all duration-500 overflow-hidden";
  
  const variantClasses = variant === 'primary' 
    ? "text-neutral-300 border border-neutral-800 hover:border-neutral-500 hover:text-white bg-black/50 backdrop-blur-sm"
    : "text-neutral-500 hover:text-neutral-300 border-b border-transparent hover:border-neutral-700";

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
      <span className="relative z-10">{children}</span>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-800/20 transition-colors duration-500" />
      )}
    </button>
  );
};

export default DecisionButton;