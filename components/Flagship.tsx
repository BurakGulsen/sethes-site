import React from 'react';

interface FlagshipProps {
  title?: string;
  description?: string;
  imageUrl?: string;
}

export const Flagship: React.FC<FlagshipProps> = ({ title, description, imageUrl }) => {
  const activeTitle = title || "THE ARBEM STORY";
  const activeDescription = description || "Arbem consolidates its presence with a flagship store in the heart of Istanbul. Nestled in the vibrant Ataşehir district, the space celebrates Arbem's distinctive aesthetic where unique materials and craftsmanship blend with contemporary design.\n\nThe showroom is conceived as an immersive design atelier, offering architects and designers a gateway into the world of Arbem. The collections on display include iconic pieces presented within an interior concept defined by striking balance.";
  const activeImageUrl = imageUrl || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop";

  return (
    <section className="bg-[#f4f4f4] w-full py-32 px-10 md:px-20 text-[#171719]">
      <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-32 items-start">
        
        {/* Left: Image */}
        <div className="w-full lg:w-[45%]">
          <div className="aspect-[4/5] w-full overflow-hidden bg-stone-100">
            <img 
              src={activeImageUrl}
              alt="Arbem Istanbul Flagship" 
              className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-[1.5s]"
            />
          </div>
        </div>

        {/* Right: Content */}
        <div className="w-full lg:w-[55%] flex flex-col pt-4">
          
          <div className="mb-14">
            <span className="text-stone-400 font-bold text-[10px] tracking-[0.3em] uppercase block mb-6">
              FLAGSHIP STORE
            </span>
            <h2 className="text-6xl md:text-8xl font-condensed uppercase tracking-tight text-[#171719] mb-10 leading-[0.9]">
              {activeTitle.split(' ').map((word, i) => (
                <React.Fragment key={i}>
                  {word} {i === 0 && <br/>}
                </React.Fragment>
              ))}
            </h2>
          </div>

          <div className="columns-1 md:columns-2 gap-16 mb-20 space-y-8">
            {activeDescription.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-stone-600 text-sm leading-8 font-light text-justify break-inside-avoid-column mb-8">
                {paragraph}
              </p>
            ))}
          </div>

          <div>
            <a 
              href="https://www.google.com/maps"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 text-[11px] font-condensed font-bold tracking-[0.25em] uppercase text-[#171719] hover:text-stone-500 transition-colors"
            >
              <span className="text-xl leading-none transition-transform duration-500 group-hover:rotate-90">+</span>
              <span>FIND ON MAP</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};