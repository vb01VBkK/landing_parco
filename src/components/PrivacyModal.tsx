/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DynamicIcon } from './DynamicIcon';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      id="privacy-modal-overlay" 
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div 
        id="privacy-modal-window" 
        className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[80vh] overflow-hidden flex flex-col border border-slate-100"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <DynamicIcon name="ShieldCheck" size={18} />
            </span>
            <span className="font-bold text-slate-900 text-base">Informativa Privacy</span>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <DynamicIcon name="X" size={16} />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 text-slate-600 text-xs leading-relaxed space-y-4">
          <p>
            Gentile Utente, desideriamo informarLa che il Regolamento Europeo 2016/679 (GDPR) e il D.Lgs. 196/2003 prevedono la tutela delle persone fisiche rispetto al trattamento dei dati personali.
          </p>
          <p className="font-semibold text-slate-800">
            1. Titolare del Trattamento
          </p>
          <p>
            Il titolare del trattamento dei dati raccolti tramite questa landing page promozionale è la Società di Gestione Immobiliare Parco degli Oleandri S.r.l., con sede legale a Nola (NA), Italia.
          </p>
          <p className="font-semibold text-slate-800">
            2. Finalità del Trattamento
          </p>
          <p>
            I dati personali da Lei inseriti (nome, cognome, numero di telefono, indirizzo e-mail, preferenza edilizia) sono raccolti ed utilizzati esclusivamente al fine di provvedere alle Sue esplicite richieste di informazioni, all'invio della brochure informativa PDF del complesso immobiliare e all'organizzazione di visite conoscitive guidate in cantiere.
          </p>
          <p className="font-semibold text-slate-800">
            3. Modalità del Trattamento
          </p>
          <p>
            Il trattamento dei dati sarà improntato ai principi di correttezza, liceità e trasparenza, tutelando la Sua riservatezza e i Suoi diritti. I dati verranno archiviati in modalità protetta digitale con accesso riservato agli addetti incaricati. Non saranno venduti, noleggiati o diffusi a terzi per scopi puramente commerciali esterni alle richieste del complesso residenziale.
          </p>
          <p className="font-semibold text-slate-800">
            4. Conservazione dei Dati
          </p>
          <p>
            I dati personali saranno trattati per il tempo strettamente necessario per dare seguito alle finalità promozionali ed informative relative all'acquisto immobiliare dei lotti nel Parco degli Oleandri. Potrà in ogni momento richiedere la cancellazione totale dei Suoi archivi cliccando sul link presente nelle mail o inviando un reclamo a privacy@parcooleandrinola.it.
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg text-xs transition duration-150 cursor-pointer"
          >
            Ho capito ed Accetto
          </button>
        </div>
      </div>
    </div>
  );
};
