import React from 'react';

interface LettersCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LettersCatalogModal: React.FC<LettersCatalogModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl bg-white rounded-sm shadow-2xl border border-stone-200">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900">Letters & Documents - Full Library</h3>
          <button onClick={onClose} className="text-stone-600 hover:text-stone-900 text-xs">Close</button>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto text-sm text-stone-700 space-y-4">
          <p className="text-stone-600">Browse a representative selection of letters and document templates. These bind to your live model to generate productiona'ready drafts in seconds.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-sm border border-stone-200 p-4 bg-stone-50">
              <p className="font-semibold text-stone-900 mb-2">Letters</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Introductory Outreach Letters (Formal / Friendly / Executive)</li>
                <li>Partner Introduction Letters (Government / Corporate / Investor)</li>
                <li>Engagement Followa'ups (Reminder / Scheduling / Clarification)</li>
                <li>Support Letters (Policy / Banking / Consortium)</li>
                <li>Investor Interest Letters (Soft / Firm)</li>
              </ul>
            </div>
            <div className="rounded-sm border border-stone-200 p-4 bg-stone-50">
              <p className="font-semibold text-stone-900 mb-2">Foundation Documents</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Letter of Intent (LOI)</li>
                <li>Memorandum of Understanding (MOU)</li>
                <li>Nona'Disclosure Agreement (NDA)</li>
                <li>Term Sheet</li>
              </ul>
            </div>
            <div className="rounded-sm border border-stone-200 p-4 bg-stone-50">
              <p className="font-semibold text-stone-900 mb-2">Strategic</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Business Case</li>
                <li>Feasibility Study</li>
                <li>White Paper</li>
                <li>Market Entry Strategy</li>
              </ul>
            </div>
            <div className="rounded-sm border border-stone-200 p-4 bg-stone-50">
              <p className="font-semibold text-stone-900 mb-2">Financial & Investment</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Financial Model</li>
                <li>Private Placement Memorandum (PPM)</li>
                <li>Valuation Report</li>
                <li>Monte Carlo Simulation Pack</li>
              </ul>
            </div>
            <div className="rounded-sm border border-stone-200 p-4 bg-stone-50">
              <p className="font-semibold text-stone-900 mb-2">Risk & Due Diligence</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Due Diligence Report</li>
                <li>AML/KYC Checklist</li>
                <li>Sanctions Screening Report</li>
              </ul>
            </div>
            <div className="rounded-sm border border-stone-200 p-4 bg-stone-50">
              <p className="font-semibold text-stone-900 mb-2">Government & Policy</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Policy Brief</li>
                <li>Cabinet Memo</li>
                <li>PPP Framework Outline</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-stone-600">For a sectora'specific catalog and letter templates, open the Category Index or contact BW Consultant support.</p>
        </div>
      </div>
    </div>
  );
};

export default LettersCatalogModal;

