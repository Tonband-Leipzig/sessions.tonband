import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="w-40 md:w-48 drop-shadow-[0_0_15px_rgba(59,170,184,0.3)] transition-all duration-500 hover:scale-105">
        <img 
          src="https://i.imgur.com/mg9OqWm.png" 
          alt="ton.band Logo" 
          className="w-full h-auto"
        />
      </div>
    </header>
  );
};

export default Header;