import React from 'react';
import { Github, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-neutral-900 md:bg-neutral-900/50 md:backdrop-blur-sm py-6 border-t border-primary/20 mt-auto">
      <div className="w-full px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-neutral-400 text-sm flex items-center">
            <span>Made with</span>
            <Heart size={16} className="text-[#F471B5] mx-1" />
            <span>for ton.band sessions</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-4 text-sm order-2 sm:order-1">
              <a
                href="#"
                className="text-neutral-400 hover:text-[#3BAAB8] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={20} />
              </a>
              <span className="text-neutral-400 text-sm">2026</span>
            </div>
            <div className="flex items-center gap-4 text-sm order-1 sm:order-2">
              <a
                href="/datenschutz"
                className="text-neutral-400 hover:text-[#3BAAB8] transition-colors"
              >
                Datenschutz
              </a>
              <a
                href="/impressum"
                className="text-neutral-400 hover:text-[#3BAAB8] transition-colors"
              >
                Impressum
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;