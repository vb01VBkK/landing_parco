/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import buildingImage from '../assets/images/parco_oleandri_building_1779884923879.png';
import { PROPERTY_UNITS } from '../data';
import { DynamicIcon } from './DynamicIcon';

interface InteractiveBuildingProps {
  onSelectUnit: (unitId: string) => void;
}

const FLOOR_HOTSPOTS = [
  {
    id: 'attico',
    label: 'Attico',
    hint: 'Terrazzo panoramico',
    top: '6%',
    left: '42%',
    width: '28%',
    height: '23%',
  },
  {
    id: 'quadrilocale',
    label: 'Piano secondo',
    hint: 'Quadrilocali prestigio',
    top: '30%',
    left: '21%',
    width: '60%',
    height: '17%',
  },
  {
    id: 'trilocale',
    label: 'Piano primo',
    hint: 'Trilocali comfort',
    top: '47%',
    left: '20%',
    width: '61%',
    height: '18%',
  },
  {
    id: 'bilocale',
    label: 'Piano terra',
    hint: 'Bilocali smart',
    top: '65%',
    left: '19%',
    width: '62%',
    height: '16%',
  },
];

export const InteractiveBuilding: React.FC<InteractiveBuildingProps> = ({ onSelectUnit }) => {
  const [activeUnitId, setActiveUnitId] = useState(FLOOR_HOTSPOTS[2].id);
  const activeUnit = PROPERTY_UNITS.find((unit) => unit.id === activeUnitId) || PROPERTY_UNITS[0];
  const activeHotspot = FLOOR_HOTSPOTS.find((floor) => floor.id === activeUnitId) || FLOOR_HOTSPOTS[0];

  const activateFromTouch = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (!touch) return;

    const touchedElement = document.elementFromPoint(touch.clientX, touch.clientY);
    const floorElement = touchedElement?.closest<HTMLElement>('[data-unit-id]');
    const unitId = floorElement?.dataset.unitId;

    if (unitId) {
      setActiveUnitId(unitId);
    }
  };

  return (
    <section id="edificio-virtuale" className="bg-white border-y border-slate-100 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
              <DynamicIcon name="HandPointer" size={14} />
              Edificio virtuale
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mt-3">
              Sfiora i piani per attivare gli appartamenti
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-2xl leading-relaxed">
              Passa con il mouse o con il dito sull'edificio: ogni livello si illumina e mostra la tipologia di appartamento disponibile.
            </p>
          </div>
          <button
            onClick={() => onSelectUnit(activeUnit.id)}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl text-sm transition shadow-lg shadow-blue-600/20 active:scale-95 cursor-pointer"
          >
            <span>Richiedi info su {activeUnit.name}</span>
            <DynamicIcon name="ArrowRight" size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          <div
            className="lg:col-span-8 relative rounded-3xl overflow-hidden bg-slate-100 shadow-2xl shadow-slate-900/10 border border-slate-200 touch-none"
            onTouchStart={activateFromTouch}
            onTouchMove={activateFromTouch}
          >
            <img
              src={buildingImage}
              alt="Edificio Parco degli Oleandri con piani interattivi"
              className="w-full h-full min-h-[330px] sm:min-h-[460px] object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-white/5 pointer-events-none" />

            {FLOOR_HOTSPOTS.map((floor) => {
              const active = floor.id === activeUnitId;

              return (
                <button
                  key={floor.id}
                  type="button"
                  data-unit-id={floor.id}
                  onPointerEnter={() => setActiveUnitId(floor.id)}
                  onPointerMove={() => setActiveUnitId(floor.id)}
                  onFocus={() => setActiveUnitId(floor.id)}
                  onClick={() => setActiveUnitId(floor.id)}
                  className={`absolute rounded-xl transition-all duration-200 cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-white/80 ${
                    active
                      ? 'bg-cyan-400/55 ring-2 ring-cyan-100 shadow-[0_0_35px_rgba(34,211,238,0.45)] backdrop-blur-[1px]'
                      : 'bg-blue-600/0 hover:bg-cyan-400/35'
                  }`}
                  style={{ top: floor.top, left: floor.left, width: floor.width, height: floor.height }}
                  aria-label={`Attiva ${floor.label}: ${floor.hint}`}
                >
                  {active && (
                    <span className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 rounded-xl bg-white/92 px-3 py-2 text-left shadow-lg border border-white/80 min-w-[138px]">
                      <span className="block text-xs sm:text-sm font-extrabold text-slate-950 leading-none">{floor.label}</span>
                      <span className="block text-[11px] sm:text-xs font-bold text-blue-600 mt-1">{floor.hint}</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <aside className="lg:col-span-4 bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <span className="text-xs uppercase tracking-[0.22em] text-cyan-300 font-bold">Piano attivo</span>
                <span className="rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs font-bold">{activeHotspot.label}</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                {activeUnit.name}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mt-3">
                {activeUnit.description}
              </p>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="rounded-2xl bg-white/8 border border-white/10 p-4">
                  <span className="block text-[11px] text-slate-400 uppercase tracking-widest font-bold">Superficie</span>
                  <span className="block text-sm font-extrabold mt-1">{activeUnit.size}</span>
                </div>
                <div className="rounded-2xl bg-white/8 border border-white/10 p-4">
                  <span className="block text-[11px] text-slate-400 uppercase tracking-widest font-bold">Esterni</span>
                  <span className="block text-sm font-extrabold mt-1">{activeUnit.balconySize}</span>
                </div>
              </div>

              <div className="mt-6 space-y-2.5">
                {activeUnit.features.slice(0, 4).map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5 text-sm text-slate-200">
                    <span className="w-5 h-5 rounded-full bg-cyan-400/15 text-cyan-300 flex items-center justify-center shrink-0">
                      <DynamicIcon name="Check" size={12} />
                    </span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onSelectUnit(activeUnit.id)}
              className="mt-7 w-full bg-white hover:bg-cyan-50 text-slate-900 font-bold px-5 py-3 rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Attiva questa tipologia nel form</span>
              <DynamicIcon name="ArrowRight" size={15} />
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
};
