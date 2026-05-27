/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { POSITION_FEATURES } from '../data';
import { DynamicIcon } from './DynamicIcon';

export const PositionGrid: React.FC = () => {
  return (
    <div 
      id="position-attributes-bar" 
      className="w-full bg-white border border-slate-100 rounded-xl py-4 px-6 md:px-8 shadow-sm"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 division-x divide-slate-100 divide-y sm:divide-y-0">
        {POSITION_FEATURES.map((item, index) => (
          <div 
            key={index} 
            id={`position-item-${index}`}
            className="flex items-center space-x-3.5 pt-4 sm:pt-0 sm:px-3 text-slate-800"
          >
            <div className="flex-shrink-0 p-2.5 rounded-full bg-blue-50 text-blue-600">
              <DynamicIcon name={item.iconName} className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-slate-900 leading-tight">
                {item.title}
              </span>
              <span className="text-xs font-normal text-slate-500 leading-normal">
                {item.subtitle}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
