import React from 'react';
import { ReportParameters, ReportData, GenerationPhase, CopilotInsight } from '../types';

interface MainCanvasProps {
  params: ReportParameters;
  setParams: React.Dispatch<React.SetStateAction<ReportParameters>>;
  onGenerate: () => void;
  onChangeViewMode: (mode: string) => void;
  reports: ReportParameters[];
  onOpenReport: (report: ReportParameters) => void;
  onDeleteReport: (id: string) => void;
  onNewAnalysis: () => void;
  reportData: ReportData;
  isGenerating: boolean;
  generationPhase: GenerationPhase;
  generationProgress: number;
  onCopilotMessage?: (msg: CopilotInsight) => void;
}

const MainCanvas: React.FC<MainCanvasProps> = ({
  params,
  setParams,
  onGenerate,
  onChangeViewMode,
  reports,
  onOpenReport,
  onDeleteReport,
  onNewAnalysis,
  reportData,
  isGenerating,
  generationPhase,
  generationProgress,
  onCopilotMessage
}) => {
  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <h1 className="text-2xl font-bold mb-4">BW Nexus AI Main Canvas</h1>
      <p className="mb-4">This is a simplified fallback component to ensure TypeScript builds successfully.</p>
      <div className="mb-4">
        <strong>Current report:</strong> {params.reportName || 'No report selected'}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button className="bg-blue-500 text-white p-2 rounded" onClick={onGenerate} disabled={isGenerating}>Generate</button>
        <button className="bg-gray-500 text-white p-2 rounded" onClick={() => onChangeViewMode('dashboard')}>Dashboard</button>
        <button className="bg-green-500 text-white p-2 rounded" onClick={onNewAnalysis}>New Analysis</button>
      </div>
      <div className="mt-6 text-sm text-stone-600">
        Generation Phase: {generationPhase} ({Math.round(generationProgress)}%)
      </div>
      {reports.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold">Saved Reports</h2>
          <ul className="list-disc ml-5">
            {reports.slice(0, 5).map(r => (
              <li key={r.id} className="py-1">
                {r.reportName}
                <button className="ml-2 text-blue-600" onClick={() => onOpenReport(r)}>Open</button>
                <button className="ml-2 text-red-600" onClick={() => onDeleteReport(r.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <pre className="mt-4 p-3 bg-white border rounded overflow-auto">{JSON.stringify(reportData || {}, null, 2)}</pre>
    </div>
  );
};

export default MainCanvas;
