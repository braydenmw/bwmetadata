
import React from 'react';
import { Check, ChevronRight, Lock } from 'lucide-react';
import { PricingPlan } from '../types';

interface PricingProps {
  onOpenSystem: () => void;
}

const plans: PricingPlan[] = [
  {
    id: 'pilot',
    name: '7-Day Pilot',
    price: '$35',
    duration: 'One-Time Pass',
    description: 'Perfect for executing a single high-stakes mission or trial run.',
    features: [
      '6 Specialized AI Analysis Modules',
      'Unlimited Report Generation',
      'Full Math Core (IVAS™, SCF™, SPI™)',
      'Partner Discovery & Matchmaking',
      'Document Suite (LoI, MoU, Proposal)',
      'Live World Bank & Exchange Data'
    ]
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    price: '$245',
    duration: 'For 3 Months',
    description: 'Designed for strategic planning cycles and market analysis.',
    features: [
      '6 Specialized AI Analysis Modules',
      'Unlimited Report Generation',
      'Full Math Core (IVAS™, SCF™, SPI™)',
      'Partner Discovery & Matchmaking',
      'Document Suite (LoI, MoU, Proposal)',
      'Live World Bank & Exchange Data'
    ]
  },
  {
    id: 'semiannual',
    name: 'Semi-Annual',
    price: '$496',
    duration: 'For 6 Months',
    description: 'Sustained intelligence for regional expansion execution.',
    features: [
      '6 Specialized AI Analysis Modules',
      'Unlimited Report Generation',
      'Full Math Core (IVAS™, SCF™, SPI™)',
      'Partner Discovery & Matchmaking',
      'Document Suite (LoI, MoU, Proposal)',
      'Live World Bank & Exchange Data'
    ],
    recommended: true
  },
  {
    id: 'annual',
    name: 'Annual',
    price: '$785',
    duration: 'For 12 Months',
    description: 'Maximum value. Continuous global monitoring & strategy.',
    features: [
      '6 Specialized AI Analysis Modules',
      'Unlimited Report Generation',
      'Full Math Core (IVAS™, SCF™, SPI™)',
      'Partner Discovery & Matchmaking',
      'Document Suite (LoI, MoU, Proposal)',
      'Live World Bank & Exchange Data'
    ]
  }
];

export const Pricing: React.FC<PricingProps> = ({ onOpenSystem }) => {
  return (
    <section id="pricing" className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-bw-gold font-bold uppercase tracking-widest text-sm mb-2">Access Grid</h2>
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-bw-navy">System Access Plans</h3>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We believe powerful intelligence shouldn't be locked behind prohibitive costs. Select the tier that matches your operational tempo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`flex flex-col p-5 rounded-sm border ${plan.recommended ? 'border-bw-gold bg-white shadow-xl scale-105 z-10' : 'border-gray-200 bg-bw-light'} transition-all duration-300 hover:shadow-lg`}
            >
              {plan.recommended && (
                <div className="self-center bg-bw-gold text-bw-navy text-xs font-bold uppercase py-1 px-3 rounded-full mb-4">
                  Recommended
                </div>
              )}
              <h4 className="text-lg font-bold text-bw-navy">{plan.name}</h4>
              <div className="mt-4 mb-2">
                <span className="text-4xl font-serif font-bold text-bw-navy">{plan.price}</span>
              </div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-6">{plan.duration}</p>
              
              <p className="text-sm text-gray-600 mb-5">{plan.description}</p>
              
              <div className="flex-grow space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start">
                    <Check className="h-4 w-4 text-bw-gold mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              {/* Individual buttons removed as requested */}
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500 mb-6 italic">Secure connection required. Please verify identity upon entry.</p>
            <button
                onClick={onOpenSystem}
                className="group relative inline-flex items-center justify-center px-12 py-5 overflow-hidden font-bold text-white transition-all duration-300 bg-bw-navy rounded-sm hover:bg-bw-gold hover:text-bw-navy shadow-2xl focus:outline-none transform hover:-translate-y-1"
            >
                <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                <span className="relative text-xl uppercase tracking-wider flex items-center gap-3">
                    <Lock className="w-5 h-5" /> Initialize System Access <ChevronRight className="h-6 w-6" />
                </span>
            </button>
        </div>

      </div>
    </section>
  );
};
