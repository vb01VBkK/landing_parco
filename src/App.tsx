/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HeaderBar } from './components/HeaderBar';
import { BenefitsBox } from './components/BenefitsBox';
import { PositionGrid } from './components/PositionGrid';
import { InquiryFormCard } from './components/InquiryFormCard';
import { PropertyViewerModal } from './components/PropertyViewerModal';
import { WhatsAppChat } from './components/WhatsAppChat';
import { PrivacyModal } from './components/PrivacyModal';
import { DynamicIcon } from './components/DynamicIcon';
import { BrokerConsole } from './components/BrokerConsole';
import { InquiryForm } from './types';

export default function App() {
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [formPrefill, setFormPrefill] = useState('trilocale');
  
  // Real-time local state monitoring for submission reviews
  const [leadsList, setLeadsList] = useState<any[]>([]);
  const [isAdminDrawerOpen, setIsAdminDrawerOpen] = useState(false);

  // Load entered leads on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('parco_leads');
      if (stored) {
        setLeadsList(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading leads:', e);
    }
  }, []);

  // Update leads list when a new form submission is declared successful
  const handleFormSuccess = (newData: InquiryForm) => {
    try {
      const stored = localStorage.getItem('parco_leads');
      const list = stored ? JSON.parse(stored) : [];
      setLeadsList(list);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrefillSelect = (unitId: string) => {
    setFormPrefill(unitId);
  };

  const handleClearLeads = () => {
    try {
      localStorage.removeItem('parco_leads');
      setLeadsList([]);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div id="landing-page-root" className="min-h-screen bg-slate-50 flex flex-col font-sans select-none antialiased">
      {/* 1. Header Features bar */}
      <HeaderBar />

      {/* 2. Hero and Main Form Section */}
      <main id="main-hero-area" className="flex-1 relative z-10">
        
        {/* Background building image with responsive blend filters */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img 
            src="https://lh3.googleusercontent.com/d/1dN-nr79eQF4EdeaGHWrduShQq3Eq66rU" 
            alt="Parco degli Oleandri Complesso residenziale" 
            className="w-full h-full object-cover object-bottom md:object-right-bottom lg:object-right opacity-95 scale-100 transition-all duration-1000"
            referrerPolicy="no-referrer"
          />
          {/* Gradients blending background colors perfectly to fit white text */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#f8fafc]/95 via-[#f8fafc]/75 to-[#f8fafc]/95 lg:bg-gradient-to-r lg:from-[#f8fafc] lg:via-[#f8fafc]/85 lg:to-transparent lg:from-40%" />
        </div>

        {/* Floating gradient orb for aesthetic touch */}
        <div className="absolute right-12 top-24 w-72 h-72 rounded-full blur-gradient pointer-events-none z-[1]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content column: Banner copy & Core Benefits */}
            <div className="lg:col-span-7 flex flex-col space-y-6 sm:space-y-8 text-left">
              <div className="space-y-4">
                <h1 
                  id="main-title" 
                  className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]"
                >
                  Parco degli Oleandri <br className="hidden sm:inline" />
                  <span className="text-slate-900">a Nola</span>
                </h1>
                
                <h2 
                  id="main-subtitle" 
                  className="font-sans text-xl sm:text-2xl font-bold text-blue-600 leading-snug tracking-tight"
                >
                  Vivere nel verde con <br className="sm:hidden" /> la tecnologia di domani
                </h2>
                
                <p 
                  id="main-paragraph" 
                  className="text-sm sm:text-base text-slate-650 leading-relaxed font-normal max-w-xl"
                >
                  Appartamenti di nuova costruzione in classe energetica <strong>A</strong>, con domotica, pannelli solari, aree verdi e comfort moderni.
                </p>
              </div>

              {/* Action row */}
              <div className="flex flex-wrap gap-4 items-center pt-2">
                <button
                  onClick={() => setIsPropertyModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 text-sm shadow-lg shadow-blue-600/20 flex items-center space-x-2.5 active:scale-98 cursor-pointer"
                >
                  <span>Scopri la tua nuova casa</span>
                  <DynamicIcon name="ArrowRight" size={16} />
                </button>

                <button
                  onClick={() => setIsWhatsAppOpen(true)}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl transition duration-200 text-sm shadow-sm flex items-center space-x-2.5 active:scale-98 cursor-pointer"
                >
                  {/* Speech bubble style icon */}
                  <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current text-blue-600">
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                  </svg>
                  <span>Parla con un consulente</span>
                </button>
              </div>

              {/* Four Benefits horizontal row on large screens */}
              <div className="pt-4 lg:pt-8">
                <BenefitsBox />
              </div>
            </div>

            {/* Right Form Card column */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <InquiryFormCard 
                onWhatsAppClick={() => setIsWhatsAppOpen(true)}
                onSuccess={handleFormSuccess}
                prefilledPropertyType={formPrefill}
                onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
              />
            </div>
            
          </div>
        </div>
      </main>

      {/* 3. Bottom position attributes bar */}
      <footer id="bottom-bar-wrapper" className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 pt-6">
        <PositionGrid />
      </footer>

      {/* 4. Real Estate Property details selector Modal */}
      <PropertyViewerModal 
        isOpen={isPropertyModalOpen} 
        onClose={() => setIsPropertyModalOpen(false)}
        onSelectUnit={handlePrefillSelect}
      />

      {/* 5. Simulated real-time WhatsApp Drawer Chat */}
      <WhatsAppChat 
        isOpen={isWhatsAppOpen} 
        onClose={() => setIsWhatsAppOpen(false)}
        onFormPrefill={handlePrefillSelect}
      />

      {/* 6. Privacy Compliance GDPR modal */}
      <PrivacyModal 
        isOpen={isPrivacyModalOpen} 
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* 7. Leads monitor CRM dashboard (Admin sandbox helper for checking submission results) */}
      <div className="fixed bottom-4 left-4 z-40">
        <button
          onClick={() => setIsAdminDrawerOpen(!isAdminDrawerOpen)}
          className="bg-slate-900 text-white rounded-full p-2.5 px-4 text-xs font-semibold shadow-md flex items-center space-x-1.5 hover:bg-slate-800 transition active:scale-95 cursor-pointer border border-slate-700"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Monitor Contatti ({leadsList.length})</span>
        </button>
      </div>

      <BrokerConsole 
        isOpen={isAdminDrawerOpen}
        onClose={() => setIsAdminDrawerOpen(false)}
        localLeads={leadsList}
      />

    </div>
  );
}
