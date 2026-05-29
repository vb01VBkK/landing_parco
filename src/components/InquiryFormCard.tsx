/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { InquiryForm } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface InquiryFormCardProps {
  onWhatsAppClick: () => void;
  onSuccess: (data: InquiryForm) => void;
  prefilledPropertyType?: string;
  onOpenPrivacy: () => void;
}

const generateSafeId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let result = '';
  for (let i = 0; i < 20; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const InquiryFormCard: React.FC<InquiryFormCardProps> = ({ 
  onWhatsAppClick, 
  onSuccess,
  prefilledPropertyType = '',
  onOpenPrivacy
}) => {
  const [form, setForm] = useState<InquiryForm>({
    name: '',
    phone: '',
    email: '',
    propertyType: prefilledPropertyType || 'trilocale',
    message: '',
    bookVisit: false,
    requestBrochure: false,
    privacyAccepted: false
  });

  const [errors, setErrors] = useState<Partial<Record<keyof InquiryForm, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!prefilledPropertyType) return;

    setForm(prev => ({ ...prev, propertyType: prefilledPropertyType }));
  }, [prefilledPropertyType]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof InquiryForm, string>> = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Nome e Cognome sono richiesti';
    } else if (form.name.trim().split(' ').length < 2) {
      newErrors.name = 'Inserisci sia il nome che il cognome';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Il numero di telefono è richiesto';
    } else if (!/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(form.phone.trim())) {
      newErrors.phone = 'Numero di telefono non valido';
    }

    if (!form.email.trim()) {
      newErrors.email = 'La mail è richiesta';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = 'Indirizzo e-mail non valido';
    }

    if (!form.privacyAccepted) {
      newErrors.privacyAccepted = 'È necessario acconsentire al trattamento dei dati personali';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const leadId = generateSafeId();
    const leadPath = `leads/${leadId}`;
    
    try {
      // Save directly to Firestore
      const documentPayload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        propertyType: form.propertyType,
        message: form.message.trim(),
        bookVisit: form.bookVisit,
        requestBrochure: form.requestBrochure,
        createdAt: serverTimestamp(),
        status: 'new'
      };

      await setDoc(doc(db, 'leads', leadId), documentPayload);

      // Save to localStorage as a fallback client cache
      try {
        const storedLeads = JSON.parse(localStorage.getItem('parco_leads') || '[]');
        storedLeads.push({ ...form, id: leadId, createdAt: new Date().toISOString(), status: 'new' });
        localStorage.setItem('parco_leads', JSON.stringify(storedLeads));
      } catch (err) {
        console.warn('Error saving localized copy:', err);
      }

      setSubmitting(false);
      setIsSubmitted(true);
      onSuccess(form);
    } catch (err) {
      setSubmitting(false);
      handleFirestoreError(err, OperationType.CREATE, leadPath);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm(prev => ({ ...prev, [name]: checked }));
      if (name === 'privacyAccepted' && checked) {
        setErrors(prev => ({ ...prev, privacyAccepted: undefined }));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
      if (errors[name as keyof InquiryForm]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    }
  };

  return (
    <div 
      id="inquiry-form-container" 
      className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8 max-w-md w-full relative overflow-hidden"
    >
      {isSubmitted ? (
        <div id="form-success-state" className="flex flex-col items-center text-center py-8">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6 border border-emerald-100">
            <DynamicIcon name="Check" size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
            Richiesta Inviata!
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed max-w-xs mb-6">
            Grazie <strong className="text-slate-800">{form.name}</strong>, la tua richiesta per un <strong className="text-slate-800">{form.propertyType}</strong> è stata inoltrata con successo. Ti ricontatteremo via <strong className="text-slate-800">Email ({form.email})</strong> o <strong className="text-slate-800">Telefono ({form.phone})</strong> entro 24 ore senza alcun impegno.
          </p>

          <button
            onClick={() => setIsSubmitted(false)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 text-sm shadow-md cursor-pointer"
          >
            Invia un'altra richiesta
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} id="inquiry-main-form" className="flex flex-col space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              Richiedi informazioni
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Compila il form e ti ricontatteremo<br />senza impegno entro 24 ore.
            </p>
          </div>

          {/* Nome e Cognome */}
          <div className="relative">
            <span className="absolute left-3 top-3.5 text-slate-400">
              <DynamicIcon name="User" size={18} />
            </span>
            <input
              type="text"
              name="name"
              placeholder="Nome e Cognome *"
              value={form.name}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 placeholder-slate-400 text-sm border ${
                errors.name ? 'border-red-500 bg-red-50/10 focus:ring-red-200' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
              } rounded-xl focus:outline-none focus:ring-4 transition duration-200`}
            />
            {errors.name && (
              <span className="text-[11px] text-red-500 mt-1 block pl-2">{errors.name}</span>
            )}
          </div>

          {/* Telefono / Email row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Telefono */}
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-slate-400">
                <DynamicIcon name="Phone" size={18} />
              </span>
              <input
                type="tel"
                name="phone"
                placeholder="Telefono *"
                value={form.phone}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 placeholder-slate-400 text-sm border ${
                  errors.phone ? 'border-red-500 bg-red-50/10 focus:ring-red-200' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                } rounded-xl focus:outline-none focus:ring-4 transition duration-200`}
              />
              {errors.phone && (
                <span className="text-[11px] text-red-500 mt-1 block pl-2">{errors.phone}</span>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-slate-400">
                <DynamicIcon name="Mail" size={18} />
              </span>
              <input
                type="email"
                name="email"
                placeholder="Email *"
                value={form.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-3 placeholder-slate-400 text-sm border ${
                  errors.email ? 'border-red-500 bg-red-50/10 focus:ring-red-200' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                } rounded-xl focus:outline-none focus:ring-4 transition duration-200`}
              />
              {errors.email && (
                <span className="text-[11px] text-red-500 mt-1 block pl-2">{errors.email}</span>
              )}
            </div>
          </div>

          {/* Tipologia immobile */}
          <div className="relative">
            <span className="absolute left-3 top-3.5 text-slate-400">
              <DynamicIcon name="Building" size={18} />
            </span>
            <select
              name="propertyType"
              value={form.propertyType}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 text-slate-700 text-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-100 rounded-xl focus:outline-none focus:ring-4 transition duration-200 appearance-none bg-white"
            >
              <option value="bilocale">Bilocale Smart</option>
              <option value="trilocale">Trilocale Comfort</option>
              <option value="quadrilocale">Quadrilocale Prestigio</option>
              <option value="attico">Super Attico Oleandri</option>
              <option value="non_specificato">Non ho ancora preferenze</option>
            </select>
            <span className="absolute right-3 top-4 text-slate-400 pointer-events-none">
              <DynamicIcon name="ChevronRight" size={16} className="rotate-90" />
            </span>
          </div>

          {/* Messaggio */}
          <div className="relative">
            <span className="absolute left-3 top-3.5 text-slate-400">
              <DynamicIcon name="MessageSquare" size={18} />
            </span>
            <textarea
              name="message"
              placeholder="Messaggio"
              rows={3}
              value={form.message}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 focus:border-blue-500 focus:ring-blue-100 rounded-xl focus:outline-none focus:ring-4 transition duration-200 placeholder-slate-400 resize-none"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex flex-col space-y-2.5 pt-1.5 text-slate-600 text-[13px]">
            <label className="flex items-start space-x-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                name="bookVisit"
                checked={form.bookVisit}
                onChange={handleInputChange}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 w-4 h-4"
              />
              <span>Prenota una visita</span>
            </label>

            <label className="flex items-start space-x-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                name="requestBrochure"
                checked={form.requestBrochure}
                onChange={handleInputChange}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 w-4 h-4"
              />
              <span>Desidero ricevere la brochure PDF</span>
            </label>

            <div>
              <label className="flex items-start space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="privacyAccepted"
                  checked={form.privacyAccepted}
                  onChange={handleInputChange}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 w-4 h-4"
                />
                <span>
                  Acconsento al{' '}
                  <button 
                    type="button" 
                    onClick={onOpenPrivacy}
                    className="text-blue-600 underline font-medium hover:text-blue-700"
                  >
                    trattamento dei dati personali *
                  </button>
                </span>
              </label>
              {errors.privacyAccepted && (
                <span className="text-[11px] text-red-500 mt-1 block pl-6">{errors.privacyAccepted}</span>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full ${
              submitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            } text-white font-semibold py-3.5 px-4 rounded-xl transition duration-200 text-sm shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 mt-2 flex items-center justify-center space-x-2 cursor-pointer`}
          >
            {submitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Invio in corso...</span>
              </>
            ) : (
              <>
                <DynamicIcon name="Mail" size={17} />
                <span>Richiedi informazioni</span>
              </>
            )}
          </button>

          {/* WhatsApp element embedded */}
          <button
            type="button"
            onClick={onWhatsAppClick}
            className="mt-4 w-full bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl p-3 flex items-center justify-between text-left transition duration-200 active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                {/* SVG for WhatsApp icon */}
                <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 fill-current">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.37 5.378.002 12.003 0c3.21.001 6.228 1.248 8.498 3.518s3.518 5.29 3.518 8.498c-.003 6.628-5.378 11.996-12.003 12h-.005c-1.997 0-3.953-.5-5.69-1.448L0 24zm6.59-2.286c1.6.95 3.393 1.448 5.405 1.449h.004c5.514 0 10.003-4.48 10.006-9.997.001-2.672-1.041-5.186-2.936-7.081s-4.41-2.935-7.085-2.936C6.471 2.149 2.0 6.63 1.997 12.145c0 2.012.518 3.98 1.5 5.73l-.99 3.61 3.704-.971h.436z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800">Preferisci WhatsApp?</span>
                <span className="text-[11px] text-slate-500">Scrivici direttamente e rispondiamo subito</span>
              </div>
            </div>
            <DynamicIcon name="ChevronRight" size={18} className="text-slate-400" />
          </button>
        </form>
      )}
    </div>
  );
};
