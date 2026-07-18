import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

interface AiConciergeProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiConcierge: React.FC<AiConciergeProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Welcome to the Atelier. How may I assist in elevating your space today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await sendMessageToGemini(userMsg.text, messages);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[450px] bg-stone-900 border-l border-stone-800 shadow-2xl flex flex-col transform transition-transform duration-500">
      {/* Header */}
      <div className="p-6 flex justify-between items-center border-b border-stone-800 bg-stone-950">
        <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-yellow-600/70" />
            <h2 className="font-serif text-lg tracking-wider text-stone-200">AI CONCIERGE</h2>
        </div>
        <button onClick={onClose} className="text-stone-500 hover:text-white transition-colors">
          <X size={24} strokeWidth={1} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0c0a09]">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] p-4 text-sm leading-relaxed tracking-wide ${
                msg.role === 'user' 
                  ? 'bg-stone-800 text-stone-100 border border-stone-700' 
                  : 'bg-transparent text-stone-300 border-l border-yellow-900/50 pl-4'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="text-stone-500 text-xs tracking-widest animate-pulse pl-4">
               CONTEMPLATING...
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-stone-800 bg-stone-950">
        <div className="flex items-center gap-2 border-b border-stone-700 focus-within:border-stone-400 transition-colors pb-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            onMouseDown={(e) => e.stopPropagation()}
            onSelect={(e) => (e.target as HTMLElement).focus()}
            placeholder="Ask about lighting, materials, or mood..."
            className="flex-1 bg-transparent border-none outline-none text-stone-200 placeholder-stone-600 font-light"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="text-stone-400 hover:text-white disabled:opacity-50 transition-colors"
          >
            <Send size={20} strokeWidth={1} />
          </button>
        </div>
      </div>
    </div>
  );
};