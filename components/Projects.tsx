import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface ProjectsProps {
  videoUrl?: string;
  title?: string;
  subtitle?: string;
}

export const Projects: React.FC<ProjectsProps> = ({ videoUrl, title, subtitle }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const { t } = useLanguage();

  const activeVideoUrl = videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-bathroom-sink-faucet-running-water-4330-large.mp4";
  const activeTitle = title || t('projects.defaultTitle');
  const activeSubtitle = subtitle || t('projects.defaultSubtitle');

  useEffect(() => {
    // Ensure video plays on mount
    if (videoRef.current) {
        videoRef.current.playbackRate = 1.0; 
        videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
    }
  }, [activeVideoUrl]); // Re-run if video URL changes

  return (
    <section className="bg-[#f4f4f4] w-full py-32 px-4 md:px-8 text-[#171719]">
       <div className="max-w-[1920px] mx-auto">
          {/* Video Container */}
          <div className="w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden mb-12 bg-stone-200 relative group">
             
             {/* 
                1. Static Background Layer (Fallback Image)
             */}
             <div 
               className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-[2s] group-hover:scale-105"
               style={{ 
                 backgroundImage: "url('https://images.unsplash.com/photo-1620626012881-5f6297709491?q=80&w=2574&auto=format&fit=crop')" 
               }}
             />

             {/* 
                2. Video Layer
             */}
             <video 
               ref={videoRef}
               key={activeVideoUrl} // Force re-render on url change
               autoPlay 
               muted 
               loop 
               playsInline
               className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
               onCanPlay={() => setIsVideoLoaded(true)}
               onError={(e) => {
                 console.warn("Video source failed. Fallback image remains visible.");
               }}
             >
               <source src={activeVideoUrl} type="video/mp4" />
             </video>
             
             {/* Gradient Overlay */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-20 pointer-events-none"></div>
          </div>
          
          {/* Label */}
          <div className="flex justify-between items-end px-2">
            <div>
                <h3 className="text-3xl font-condensed uppercase text-black mb-2">{activeTitle}</h3>
                <p className="text-stone-600 text-sm font-light max-w-md">
                    {activeSubtitle}
                </p>
            </div>
            <button className="group flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase text-black hover:text-stone-500 transition-colors">
                <span className="text-lg leading-none transition-transform duration-300 group-hover:rotate-90">+</span>
                <span>{t('projects.discover')}</span>
            </button>
          </div>
       </div>
    </section>
  );
};