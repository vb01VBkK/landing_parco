/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CORE_BENEFITS } from '../data';
import { DynamicIcon } from './DynamicIcon';

export const BenefitsBox: React.FC = () => {
  return (
    <div 
      id="core-benefits-box" 
      className="bg-[#11223f] border border-slate-800/80 rounded-2xl p-6 lg:p-8 text-white shadow-xl max-w-2xl"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {CORE_BENEFITS.map((benefit, index) => (
          <div 
            key={index} 
            id={`benefit-item-${index}`}
            className="flex flex-col space-y-2.5"
          >
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                <DynamicIcon name={benefit.iconName} className="w-5 h-5" />
              </span>
              <h4 className="font-semibold text-[15px] tracking-tight text-white">
                {benefit.title}
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
