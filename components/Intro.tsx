import React, { useEffect, useState } from 'react';

interface IntroProps {
  onComplete: () => void;
}

export const Intro: React.FC<IntroProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Yazının belirmesi için kısa bir gecikme
    const appearTimeout = setTimeout(() => setIsVisible(true), 500);
    
    // Intronun bitişi ve ana siteye geçiş
    const finishTimeout = setTimeout(() => {
      setIsExiting(true);
      // Fade out animasyonu tamamlanınca callback'i çağır
      setTimeout(onComplete, 1000);
    }, 3000);

    return () => {
      clearTimeout(appearTimeout);
      clearTimeout(finishTimeout);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-opacity duration-1000 ease-in-out ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      <div className={`flex flex-col items-center transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        
        {/* Marka İsmi - Henge Tarzı Geniş Harf Aralığı */}
        <h1 className="text-white text-2xl md:text-3xl font-sans font-bold tracking-[0.8em] uppercase mb-4 pl-[0.8em]">
          ARBEM
        </h1>
        
        {/* Alt Çizgi */}
        <div className={`h-[1px] bg-white transition-all duration-[1.5s] ease-in-out ${isVisible ? 'w-16' : 'w-0'}`}></div>
      </div>
    </div>
  );
};
