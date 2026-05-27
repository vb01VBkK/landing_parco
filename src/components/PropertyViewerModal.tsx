/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PROPERTY_UNITS } from '../data';
import { DynamicIcon } from './DynamicIcon';

interface PropertyViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUnit: (unitId: string) => void;
}

export const PropertyViewerModal: React.FC<PropertyViewerModalProps> = ({ 
  isOpen, 
  onClose,
  onSelectUnit
}) => {
  const [selectedUnitId, setSelectedUnitId] = useState(PROPERTY_UNITS[0].id);
  const currentUnit = PROPERTY_UNITS.find(u => u.id === selectedUnitId) || PROPERTY_UNITS[0];

  if (!isOpen) return null;

  return (
    <div 
      id="property-viewer-overlay" 
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div 
        id="property-viewer-modal" 
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-100"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <DynamicIcon name="Building" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Modelli di Appartamento
              </h3>
              <p className="text-xs text-slate-500">
                Parco degli Oleandri — Nola
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <DynamicIcon name="X" size={20} />
          </button>
        </div>

        {/* Content Tabs area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col lg:flex-row gap-8">
          {/* List of tabs (Left side on large, top on mobile) */}
          <div className="w-full lg:w-1/3 flex flex-row lg:flex-col gap-2.5 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 shrink-0">
            {PROPERTY_UNITS.map((unit) => {
              const active = unit.id === selectedUnitId;
              return (
                <button
                  key={unit.id}
                  onClick={() => setSelectedUnitId(unit.id)}
                  className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer flex flex-col space-y-1 shrink-0 min-w-[150px] ${
                    active 
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-sm ring-1 ring-blue-600/30' 
                      : 'border-slate-100 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="font-bold text-[15px]">{unit.name}</span>
                  <span className={`text-xs ${active ? 'text-blue-600 font-medium' : 'text-slate-400 font-normal'}`}>
                    {unit.size}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Unit details (Right side) */}
          <div className="flex-1 flex flex-col space-y-6">
            <div className="border-b border-slate-100 pb-5">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h4 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {currentUnit.name}
                </h4>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <DynamicIcon name="Award" size={12} className="text-emerald-600" />
                  <span>Classe Energetica {currentUnit.energyClass}</span>
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {currentUnit.description}
              </p>
            </div>

            {/* Quick specifications */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl flex flex-col">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">Dimensioni</span>
                <span className="text-sm font-bold text-slate-800">{currentUnit.size}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex flex-col">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-widest font-sans">Locali e Terrazzo</span>
                <span className="text-sm font-bold text-slate-800">{currentUnit.balconySize}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex flex-col col-span-2 sm:col-span-1">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">Servizi</span>
                <span className="text-sm font-bold text-slate-800">{currentUnit.bathrooms} {currentUnit.bathrooms > 1 ? 'Bagni di design' : 'Bagno di design'}</span>
              </div>
            </div>

            {/* Features layout list */}
            <div>
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">La planimetria comprende:</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentUnit.features.map((feat, i) => (
                  <div key={i} className="flex items-center space-x-2.5 text-slate-700 text-sm">
                    <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <DynamicIcon name="Check" size={12} />
                    </span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Render sample illustrative layout placeholder */}
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center py-8">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-2.5">
                <DynamicIcon name="Building" size={24} />
              </div>
              <span className="text-xs font-bold text-slate-700">Piantina Digitale Interattiva Certificata</span>
              <span className="text-[11px] text-slate-400 max-w-xs mt-1 leading-normal">
                Disegni esecutivi e capitolato completo delle finiture sono allegati alla documentazione ufficiale del parco.
              </span>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-500 font-sans text-center sm:text-left">
            * Tutti i prezzi e gli schemi dettagliati sono personalizzabili in base alle finiture desiderate.
          </span>
          <div className="flex space-x-3 w-full sm:w-auto">
            <button
              onClick={() => {
                onSelectUnit(currentUnit.id);
                onClose();
              }}
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition shadow-md hover:shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Seleziona nel Form</span>
              <DynamicIcon name="ArrowRight" size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
