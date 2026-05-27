/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HEADER_FEATURES } from '../data';
import { DynamicIcon } from './DynamicIcon';

export const HeaderBar: React.FC = () => {
  return (
    <div 
      id="top-feature-bar" 
      className="bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 px-4 shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center md:justify-between items-center gap-y-4 gap-x-6 text-slate-700">
        {HEADER_FEATURES.map((feat, index) => (
          <div 
            key={index} 
            id={`header-feat-${index}`}
            className="flex items-center space-x-2.5 px-3 py-1 transition-all hover:text-blue-600 group"
          >
            <div className="p-1 px-2 rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
              <DynamicIcon name={feat.iconName} className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium tracking-tight text-slate-700 group-hover:text-slate-900 transition-colors">
              {feat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
