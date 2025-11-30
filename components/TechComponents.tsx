import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, Loader2 } from 'lucide-react';

// --- Ink Components ---

export const RedSeal = ({ text, className = "" }: { text: string, className?: string }) => (
  <div className={`inline-flex items-center justify-center w-8 h-8 bg-seal text-white font-serif text-xs border-2 border-seal-light rounded-sm opacity-90 shadow-sm ${className}`} style={{borderRadius: '4px 8px 4px 6px'}}>
    <span className="writing-vertical leading-none pt-1 select-none">{text.substring(0, 2)}</span>
  </div>
);

export const PaperCard = ({ 
  children, 
  className = "", 
  title,
  subTitle,
  variant = "simple" // simple, bordered, scroll
}: { 
  children: React.ReactNode, 
  className?: string, 
  title?: string,
  subTitle?: string,
  variant?: "simple" | "bordered" | "scroll"
}) => {
  
  return (
    <div className={`relative bg-white shadow-lg transition-all duration-500 hover:shadow-xl custom-ink-shadow ${className}`}>
      {/* Texture Overlay */}
      <div className="absolute inset-0 bg-rice-paper opacity-50 pointer-events-none mix-blend-multiply"></div>
      
      {/* Variant: Bordered (Like a painting mount) */}
      {variant === 'bordered' && (
         <div className="absolute inset-2 border border-ink-base/20 pointer-events-none"></div>
      )}

      {/* Header */}
      {title && (
        <div className="relative pt-6 px-6 pb-2 flex items-start justify-between border-b border-ink-light/10">
           <div>
             <h3 className="font-calligraphy text-2xl text-ink-black tracking-widest">{title}</h3>
             {subTitle && <p className="text-xs text-ink-light font-serif mt-1 tracking-wider uppercase">{subTitle}</p>}
           </div>
           <RedSeal text="阅" className="opacity-80" />
        </div>
      )}

      <div className="relative p-6 z-10">
        {children}
      </div>
    </div>
  );
};

export const CalligraphyText = ({ text, delay = 0 }: { text: string, delay?: number }) => {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`transition-opacity duration-1000 ${show ? 'opacity-100' : 'opacity-0'}`}>
       {text.split('\n').map((line, i) => (
         <p key={i} className="mb-2 font-serif text-ink-dark leading-relaxed tracking-wide">
           {line}
         </p>
       ))}
    </div>
  );
};

export const InkButton = ({ onClick, children, active = false }: { onClick: () => void, children: React.ReactNode, active?: boolean }) => (
  <button 
    onClick={onClick}
    className={`
      relative overflow-hidden group px-6 py-2 font-serif tracking-widest transition-all duration-500
      ${active ? 'text-white' : 'text-ink-base hover:text-ink-black'}
    `}
  >
    {/* Background Ink Blot */}
    <div className={`absolute inset-0 bg-ink-black transition-transform duration-700 ease-out origin-left
       ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-10'}
    `} style={{borderRadius: '2px 255px 5px 25px / 255px 5px 225px 5px'}}></div>
    
    <span className="relative z-10 flex items-center gap-2">
      {children}
    </span>
  </button>
);

export const StatBox = ({ label, value, unit }: { label: string, value: string | number, unit?: string }) => (
  <div className="flex flex-col items-center p-4 border-r border-ink-light/20 last:border-0">
    <span className="text-xs text-ink-light font-serif mb-2 tracking-widest">{label}</span>
    <div className="flex items-baseline gap-1">
      <span className="text-3xl font-calligraphy text-ink-black">{value}</span>
      {unit && <span className="text-xs text-ink-light font-serif">{unit}</span>}
    </div>
  </div>
);

export const InkVisualizer = ({ imageUrl, label, loading }: { imageUrl?: string, label?: string, loading?: boolean }) => (
  <div className="relative w-full h-full min-h-[300px] bg-paper-dark overflow-hidden flex flex-col items-center justify-center border border-ink-light/20 p-2 shadow-inner">
    
    {/* Inner Frame */}
    <div className="absolute inset-3 border border-ink-light/30 pointer-events-none"></div>

    {loading ? (
      <div className="flex flex-col items-center gap-4 z-10">
         <Loader2 className="w-8 h-8 text-ink-light animate-spin" />
         <span className="font-serif text-ink-light tracking-widest animate-pulse">云雾缭绕 寻觅中...</span>
      </div>
    ) : imageUrl ? (
      <>
        <div className="relative w-full h-full overflow-hidden filter sepia-[0.3] contrast-[0.9]">
            <img src={imageUrl} alt="Visual" className="w-full h-full object-cover opacity-90 transition-transform duration-[3s] hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-paper to-transparent opacity-30"></div>
        </div>
        <div className="absolute bottom-6 right-6 z-20 bg-white/80 backdrop-blur-sm px-3 py-1 border border-ink-light/20">
           <span className="font-serif text-xs text-ink-dark tracking-widest">{label || '影像记录'}</span>
        </div>
      </>
    ) : (
      <div className="text-center z-10 opacity-50">
         <ImageIcon className="w-12 h-12 text-ink-light mx-auto mb-2" />
         <span className="font-serif text-ink-light text-sm">暂无影像</span>
      </div>
    )}
  </div>
);