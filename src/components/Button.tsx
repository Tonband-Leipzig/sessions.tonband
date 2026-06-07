import React from 'react';

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  isInternal?: boolean;
}

const Button: React.FC<ButtonProps> = ({ href, children, isInternal = false }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-block bg-gradient-to-r from-[#4ECBD9] to-[#F471B5] 
        text-white uppercase tracking-wide text-sm font-medium
        rounded-xl px-5 py-2.5 shadow-md 
        hover:shadow-[0_0_15px_rgba(78,203,217,0.4)] hover:scale-105 
        transition-all duration-300 ease-in-out
        ${isInternal ? 'relative pl-8' : ''}
      `}
    >
      {isInternal && (
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
          🔒
        </span>
      )}
      {children}
    </a>
  );
};

export default Button;