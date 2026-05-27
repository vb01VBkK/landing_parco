/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { DynamicIcon } from './DynamicIcon';

interface Message {
  id: string;
  text: string;
  sender: 'agent' | 'user';
  timestamp: string;
}

interface WhatsAppChatProps {
  isOpen: boolean;
  onClose: () => void;
  onFormPrefill: (unitId: string) => void;
}

export const WhatsAppChat: React.FC<WhatsAppChatProps> = ({ isOpen, onClose, onFormPrefill }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      text: "Salve! Sono Manu, consulente ufficiale di Parco degli Oleandri a Nola. Come posso esserti utile oggi?",
      sender: 'agent',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to lowest message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSendText = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      text: text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate Agent Reply
    setTimeout(() => {
      let replyText = "Grazie per il messaggio. Un nostro consulente dedicato prenderà in carico la tua richiesta il prima possibile. Per velocizzare i tempi, puoi completare il form informativo principale inserendo i tuoi recapiti.";
      
      const normalized = text.toLowerCase();
      if (normalized.includes('prezzo') || normalized.includes('costo') || normalized.includes('costa')) {
        replyText = "I prezzi variano in base alle dimensioni ed alle finiture del capitolato (pavimentazioni, domotica avanzata, etc.). Ti suggerisco di selezionare l'immobile di tuo interesse nel nostro form principale ed inviare la richiesta, potremo fornirti una simulazione personalizzata completa!";
      } else if (normalized.includes('visita') || normalized.includes('appuntamento')) {
        replyText = "Certamente! Le visite in cantiere ed al nostro showroom materiali sono disponibili su appuntamento dal lunedì al sabato. Seleziona il box 'Prenota una visita' nel form sulla pagina ed inserisci il tuo telefono, Manu ti contatterà subito per concordare giorno ed ora!";
      } else if (normalized.includes('brochure') || normalized.includes('pdf')) {
        replyText = "La brochure PDF ufficiale con tutti i dettagli e capitolato materiali è pronta! Spunta la casella 'Desidero ricevere la brochure PDF' nel modulo informativo principale, inserisci la tua email e te la invieremo istantaneamente!";
      } else if (normalized.includes('dove') || normalized.includes('indirizzo') || normalized.includes('posizione')) {
        replyText = "Il complesso residenziale sorgere a Nola in un quartiere tranquillo, immerso nel verde ma a pochissimi minuti dagli svincoli dell'autostrada e della circumvesuviana, comodissimo per raggiungere Napoli ed i servizi commerciali principali.";
      }

      const agentMsg: Message = {
        id: `agent-${Date.now()}`,
        text: replyText,
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (actionText: string, searchKeyword: string) => {
    handleSendText(actionText);
  };

  return (
    <div 
      id="whatsapp-chat-drawer" 
      className="fixed bottom-4 right-4 z-50 max-w-sm w-[92vw] h-[480px] bg-[#ece5dd] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-emerald-600/20"
    >
      {/* Header */}
      <div className="bg-[#075e54] text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white/60 flex items-center justify-center text-slate-800 font-bold overflow-hidden">
              {/* Initials fallback but elegant */}
              <span className="text-sm font-bold text-teal-800">M</span>
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border border-white rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight">Manu - Parco degli Oleandri</span>
            <span className="text-[10px] text-teal-100">Solitamente risponde istantaneamente</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
        >
          <DynamicIcon name="X" size={20} />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-3">
        {messages.map((msg) => {
          const isAgent = msg.sender === 'agent';
          return (
            <div 
              key={msg.id}
              className={`flex flex-col max-w-[82%] ${isAgent ? 'self-start' : 'self-end'}`}
            >
              <div 
                className={`p-3 rounded-2xl shadow-sm text-sm ${
                  isAgent 
                    ? 'bg-white text-slate-800 rounded-tl-none' 
                    : 'bg-[#dcf8c6] text-slate-850 rounded-tr-none'
                }`}
              >
                <p className="leading-relaxed font-sans">{msg.text}</p>
                <span className="text-[9px] text-slate-400 text-r block text-right mt-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex flex-col max-w-[82%] self-start">
            <div className="p-3 bg-white text-slate-800 rounded-2xl rounded-tl-none shadow-sm text-sm">
              <div className="flex space-x-1 items-center h-4 px-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick Suggestions scrollable */}
      <div className="px-3 py-2 bg-[#f0f0f0]/90 border-t border-slate-200 flex items-center space-x-2 overflow-x-auto whitespace-nowrap shrink-0">
        <button
          onClick={() => handleQuickAction("Desidero prenotare una visita guidata in cantiere", "visita")}
          className="bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-semibold py-1.5 px-3 rounded-full border border-slate-300 shadow-sm transition active:scale-[0.98] cursor-pointer"
        >
          📅 Prenota visita
        </button>
        <button
          onClick={() => handleQuickAction("Vorrei ricevere la brochure PDF ufficiale", "brochure")}
          className="bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-semibold py-1.5 px-3 rounded-full border border-slate-300 shadow-sm transition active:scale-[0.98] cursor-pointer"
        >
          📄 Ricevi brochure
        </button>
        <button
          onClick={() => handleQuickAction("Quali sono i prezzi degli appartamenti?", "prezzo")}
          className="bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-semibold py-1.5 px-3 rounded-full border border-slate-300 shadow-sm transition active:scale-[0.98] cursor-pointer"
        >
          💰 Listino Prezzi
        </button>
        <button
          onClick={() => handleQuickAction("Dove si trovano esattamente gli appartamenti?", "dove")}
          className="bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-semibold py-1.5 px-3 rounded-full border border-slate-300 shadow-sm transition active:scale-[0.98] cursor-pointer"
        >
          📍 Posizione
        </button>
      </div>

      {/* Input Form footer */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSendText(input);
        }}
        className="bg-[#f0f0f0] p-2.5 flex items-center space-x-2 border-t border-slate-100"
      >
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scrivi un messaggio..."
          className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 font-sans"
        />
        <button
          type="submit"
          className="w-10 h-10 rounded-full bg-[#075e54] text-white flex items-center justify-center shrink-0 hover:bg-[#128c7e] transition-colors active:scale-95 cursor-pointer"
        >
          <DynamicIcon name="Send" size={16} />
        </button>
      </form>
    </div>
  );
};
