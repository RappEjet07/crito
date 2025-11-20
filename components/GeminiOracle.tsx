import React, { useState } from 'react';
import { Asset, AIAnalysisType } from '../types';
import { getPortfolioAnalysis } from '../services/geminiService';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';

interface GeminiOracleProps {
  assets: Asset[];
}

export const GeminiOracle: React.FC<GeminiOracleProps> = ({ assets }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (type: AIAnalysisType) => {
    if (loading) return;
    setLoading(true);
    setAnalysis(null);
    
    const result = await getPortfolioAnalysis(assets, type);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="border border-white/10 p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-xl">AI Sentiment Analysis</h3>
        <Sparkles className="w-4 h-4 text-gray-400" />
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          { type: AIAnalysisType.ROAST, label: 'Roast' },
          { type: AIAnalysisType.HYPE, label: 'Hype' },
          { type: AIAnalysisType.PREDICTION, label: 'Predict' }
        ].map((btn) => (
          <button
            key={btn.type}
            onClick={() => handleAnalyze(btn.type)}
            className="text-xs uppercase tracking-widest py-3 border border-white/10 hover:bg-white hover:text-black transition-all"
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="min-h-[120px] text-sm leading-relaxed text-gray-300 font-mono">
        {loading ? (
          <div className="flex items-center gap-2 text-gray-500 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Analyzing blockchain data...</span>
          </div>
        ) : analysis ? (
          <div className="animate-fade-in border-l-2 border-white pl-4">
            {analysis}
          </div>
        ) : (
          <p className="text-gray-600 italic">Select a mode to generate insights based on your current holdings.</p>
        )}
      </div>
    </div>
  );
};