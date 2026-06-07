import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface CardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  thumbnailUrl?: string | null;
  thumbnailFullUrl?: string | null;
  isInternal?: boolean;
  borderColor: 'cyan' | 'magenta';
}

const Card: React.FC<CardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  link, 
  thumbnailUrl,
  thumbnailFullUrl,
  isInternal = false,
  borderColor
}) => {
  const colors = {
    cyan: {
      border: 'border-[#3BAAB8]',
      shadow: 'hover:shadow-[0_0_20px_rgba(59,170,184,0.2)]',
      icon: 'text-[#3BAAB8]',
      iconShadow: 'drop-shadow-[0_0_6px_rgba(59,170,184,0.5)]',
      hoverTitle: 'group-hover:text-[#3BAAB8]'
    },
    magenta: {
      border: 'border-[#F471B5]',
      shadow: 'hover:shadow-[0_0_20px_rgba(244,113,181,0.2)]',
      icon: 'text-[#F471B5]',
      iconShadow: 'drop-shadow-[0_0_6px_rgba(244,113,181,0.5)]',
      hoverTitle: 'group-hover:text-[#F471B5]'
    }
  };

  const colorScheme = colors[borderColor];

  const [thumbnailFailed, setThumbnailFailed] = React.useState(false);
  const showThumbnail = !!thumbnailUrl && !thumbnailFailed;
  const [previewOpen, setPreviewOpen] = React.useState(false);

  const previewImageUrl = thumbnailFullUrl || thumbnailUrl;

  React.useEffect(() => {
    if (!previewOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [previewOpen]);

  return (
    <>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={`group flex items-center bg-white/3 backdrop-blur-[10px] rounded-2xl border 
                   overflow-hidden transition-all duration-300 hover:scale-[1.015] px-6 py-5
                   ${colorScheme.border} ${colorScheme.shadow}`}
      >
        {showThumbnail ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setPreviewOpen(true);
            }}
            className="mr-5 h-16 aspect-video overflow-hidden rounded-xl bg-white/5 border border-white/10
                       hover:border-white/20 transition-colors"
            aria-label="Open thumbnail preview"
          >
            <img
              src={thumbnailUrl || ''}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
              onError={() => setThumbnailFailed(true)}
            />
          </button>
        ) : (
          <div
            className={`mr-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10
                        ${colorScheme.icon} ${colorScheme.iconShadow}
                        transition-all duration-300 group-hover:scale-105 group-hover:border-white/20`}
          >
            <Icon size={26} strokeWidth={1.6} />
          </div>
        )}

        <div className="flex-1">
          <h3 className={`text-[17px] md:text-lg font-semibold text-white tracking-tight ${colorScheme.hoverTitle} transition-colors flex items-center gap-2`}>
            {title}
          </h3>
          <p className="text-[#909296] text-sm leading-relaxed opacity-80 group-hover:text-white/70 transition-colors mt-1">
            {description}
          </p>
        </div>
      </a>

      {previewOpen && showThumbnail && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-3xl aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={previewImageUrl || ''} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      )}
    </>
  );
};

export default Card;