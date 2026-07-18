import React, { useEffect, useState } from 'react';
import { useSiteData } from '../context/SiteContext';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, ArrowRight } from 'lucide-react';

export const Contacts: React.FC = () => {
  const { contacts } = useSiteData();
  const [header, setHeader] = useState<string>('VIA DELLA SPIGA 34, 20121 MILANO');
  const [cards, setCards] = useState<any[]>([]);

  useEffect(() => {
    const headerItem = contacts.find(c => c.type === 'header');
    if (headerItem) setHeader(headerItem.title);

    const cardItems = contacts.filter(c => c.type === 'card');
    setCards(cardItems);
  }, [contacts]);

  return (
    <div className="pt-32 min-h-screen bg-[#121212] text-white px-8 md:px-20 pb-20">
      <div className="max-w-[1920px] mx-auto">
        
        {/* Main Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-24 border-b border-white/10 pb-12"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-condensed uppercase tracking-tight leading-[0.9] text-white/90 max-w-5xl">
            {header}
          </h1>
        </motion.div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-20">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-stone-500 mb-8 border-t border-stone-800 pt-4 group-hover:text-white transition-colors group-hover:border-white duration-500">
                {card.title}
              </h3>
              
              <div className="space-y-6 text-lg font-light text-stone-300">
                {card.address && (
                  <div className="flex gap-4 items-start group-hover:text-white transition-colors duration-300">
                    <MapPin size={20} className="mt-1 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                    <p className="whitespace-pre-line leading-relaxed">{card.address}</p>
                  </div>
                )}
                
                {card.email && (
                  <div className="flex gap-4 items-center group-hover:text-white transition-colors duration-300">
                    <Mail size={20} className="shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                    <a href={`mailto:${card.email}`} className="hover:underline underline-offset-4 decoration-stone-500 hover:decoration-white transition-all">
                      {card.email}
                    </a>
                  </div>
                )}

                {card.phone && (
                  <div className="flex gap-4 items-center group-hover:text-white transition-colors duration-300">
                    <Phone size={20} className="shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                    <a href={`tel:${card.phone}`} className="hover:underline underline-offset-4 decoration-stone-500 hover:decoration-white transition-all">
                      {card.phone}
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Map Placeholder or Additional Info if needed */}
        <div className="mt-32 pt-12 border-t border-white/10 flex justify-between items-end opacity-50 hover:opacity-100 transition-opacity duration-500">
            <div className="text-xs font-bold tracking-[0.2em] uppercase text-stone-500">
                Arbem Atelier &copy; {new Date().getFullYear()}
            </div>
            <div className="text-xs font-bold tracking-[0.2em] uppercase text-stone-500 flex items-center gap-2">
                Get Directions <ArrowRight size={14} />
            </div>
        </div>

      </div>
    </div>
  );
};
