import React from 'react';
import { useSiteData } from '../context/SiteContext';

// Using a cursive font from Google Fonts or a generic fallback for the signature
const Signature: React.FC<{ name: string }> = ({ name }) => (
  <div className="font-[cursive] text-2xl md:text-3xl text-stone-800 opacity-80 rotate-[-5deg] mt-2 mb-6" style={{ fontFamily: 'Brush Script MT, cursive' }}>
    {name}
  </div>
);

interface DesignerProps {
  name: string;
  role: string;
  bio: string;
  collections: string[];
  quote: string;
  image: string;
  align: 'left' | 'right';
  grayscaleEnabled?: boolean;
}

const DesignerCard: React.FC<DesignerProps> = ({ name, role, bio, collections, quote, image, align, grayscaleEnabled = true }) => {
  return (
    <div className={`flex flex-col ${align === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-24 mb-32 items-start`}>
      {/* Image Side */}
      <div className="w-full md:w-1/3 flex-shrink-0">
        <div className={`aspect-[3/4] bg-stone-200 overflow-hidden ${grayscaleEnabled ? 'grayscale hover:grayscale-0' : ''} transition-all duration-700`}>
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Content Side */}
      <div className="w-full md:w-2/3 flex flex-col pt-4">
        <h3 className="text-2xl font-bold text-black mb-1">{name}</h3>
        <span className="text-stone-500 text-sm uppercase tracking-wider mb-6">{role}</span>
        
        <p className="text-stone-800 font-light leading-relaxed mb-8 max-w-xl">
          {bio}
        </p>

        <div className="mb-8">
          <span className="text-xs font-bold text-black uppercase tracking-widest block mb-2">Designer's Collections:</span>
          <ul className="text-stone-600 text-sm font-light space-y-1">
            {collections.map((col, idx) => (
              <li key={idx}>- {col}</li>
            ))}
          </ul>
        </div>

        <Signature name={name} />

        <blockquote className="border-l-2 border-stone-800 pl-4 italic text-stone-700 font-serif text-sm md:text-base leading-relaxed max-w-lg">
          "{quote}"
        </blockquote>
      </div>
    </div>
  );
};

export const Designers: React.FC = () => {
  const { designers: dbDesigners, siteSettings } = useSiteData();
  
  const grayscaleEnabled = siteSettings?.find(s => s.key === 'designers_grayscale')?.value === 'true';

  const defaultDesigners = [
    {
      name: "Alper AKKOZ",
      role: "architect",
      bio: "Born in Istanbul, Alper has been working for years with glass and refined metals. In the LuminArt Collection, he blends minimal forms with light in a way that feels both subtle and powerful.",
      collections: ["LuminArt Collection", "Pietra Collection", "Essenza Collection"],
      quote: "In the LuminArt series, I treated light as a material. I wanted this collection to be simple yet bold.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2500&auto=format&fit=crop",
      align: 'left' as const
    },
    {
      name: "Zeynep Kaya",
      role: "Material Alchemist",
      bio: "Zeynep, born in Ankara, is a graduate of ODTU Materials Engineering. She studies how pigments pass through translucent matter. With her Arbemix Vita series, she introduced thin amber veins that change tone with sunlight, blurring the line between stone and light.",
      collections: ["Harmonia Collection", "LuminArt Collection", "Essenza Collection"],
      quote: "Color isn't just on the surface; it lives inside the material—waiting for light to unlock it.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2500&auto=format&fit=crop",
      align: 'left' as const
    },
    {
      name: "E.G. TOPALOĞLU",
      role: "Industrial Designer",
      bio: "Born in Istanbul, Topaloğlu graduated from Marmara University, Faculty of Architecture at the top of her class. In her first Metropol Aura series, she reimagines Arbemide® crystal panels as floating architectural volumes, designing mirrors that feel like illuminated facades.",
      collections: ["Forge Collection", "LuminAura Collection", "LuminArt Collection"],
      quote: "Istanbul taught me that every silhouette hides a story. I carve those stories into glass and light, so spaces can breathe like the city itself.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2500&auto=format&fit=crop",
      align: 'right' as const
    },
    {
      name: "Burhan CEBECİ",
      role: "Lighting Sculptor",
      bio: "Burhan, who completed his MA at the Technical University of Vienna, combines classical Italian light play with contemporary minimalism. LuminÉcho chandeliers use Arbemide® crystal panels to emit a warm, gallery-like glow.",
      collections: ["Pietra Collection", "Essenza Collection", "Harmonia Collections"],
      quote: "I treat illumination as a moving fresco—each beam paints the room anew.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2500&auto=format&fit=crop",
      align: 'right' as const
    }
  ];

  const displayDesigners = dbDesigners && dbDesigners.length > 0 
    ? dbDesigners.map((d, idx) => ({
        name: d.name,
        role: d.role,
        bio: d.bio,
        collections: d.collections ? d.collections.split(',').map(c => c.trim()) : [],
        quote: d.quote,
        image: d.image_url,
        align: idx % 2 === 0 ? 'left' as const : 'right' as const
      }))
    : defaultDesigners;

  return (
    <section className="bg-[#f4f4f4] min-h-screen w-full pt-40 px-6 md:px-20 pb-20 text-[#171719]">
      <div className="max-w-[1400px] mx-auto animate-in fade-in duration-700">
        
        {/* Header Section */}
        <div className="mb-32">
          <h1 className="text-6xl md:text-8xl font-condensed text-black mb-6 tracking-tight leading-[0.9]">
            The Minds <br/> Behind the Design
          </h1>
          <p className="text-xl text-stone-600 font-light">
            Every line, every detail carries their signature.
          </p>
        </div>

        {/* Designers List */}
        <div className="flex flex-col">
          {displayDesigners.map((designer, idx) => (
            <DesignerCard key={idx} {...designer} grayscaleEnabled={grayscaleEnabled} />
          ))}
        </div>

        {/* Footer Quote */}
        <div className="mt-20 pt-12 border-t border-stone-300 text-center">
             <p className="italic text-stone-600 font-serif text-lg">
                "Arbem is a unity of artisans and designers. In every piece, you feel their spirit."
             </p>
        </div>

      </div>
    </section>
  );
};