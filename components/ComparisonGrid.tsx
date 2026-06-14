
import React, { useState, useMemo, useEffect } from 'react';
import { ModelResult, AIModelType, ModelCategory } from '../types';
import { 
  Copy, Check, MessageSquareCode, Lightbulb, Stars, Filter, Wand2, 
  Loader2, MessageCircle, Eye, EyeOff, ChevronDown, ChevronUp, 
  Hourglass, BrainCircuit, Sparkles, Download, FileText, FileJson, 
  ChevronRight, Maximize2, Minimize2 
} from 'lucide-react';
import { jsPDF } from 'jspdf';

const ModelIcons: Record<string, string> = {
  [AIModelType.ChatGPT]: '🟢',
  [AIModelType.Claude]: '🟠',
  [AIModelType.Gemini]: '🔵',
  [AIModelType.Copilot]: '💠',
  [AIModelType.Grok]: '⚫',
  [AIModelType.Perplexity]: '⚪',
  [AIModelType.NotebookLM]: '📔',
  [AIModelType.Gamma]: '📐',
  [AIModelType.Pitch]: '📊',
  [AIModelType.Jasper]: '🐆',
  [AIModelType.Wordtune]: '✍️',
  [AIModelType.QuillBot]: '🪶',
  [AIModelType.NotionAI]: '📓',
  [AIModelType.Pi]: '🥧',
  [AIModelType.Poe]: '📜',
  [AIModelType.DeepSeek]: '🐋',
  [AIModelType.Writesonic]: '⚡',
  [AIModelType.Anyword]: '🔡',
  [AIModelType.LanguageTool]: '🛡️',
  [AIModelType.Ginger]: '🫚',
  [AIModelType.ScholarPen]: '🎓',
  [AIModelType.Scifocus]: '🔬',
  [AIModelType.BufferAI]: '📱',
  [AIModelType.Lex]: '📖',
};

const LOADING_MESSAGES = [
  "Analyzing semantic intent...",
  "Simulating model weights...",
  "Generating optimized prompt...",
  "Formatting bullet points...",
  "Applying persona constraints...",
  "Calculating performance metrics..."
];

const PendingModelCard: React.FC<{ modelId: string }> = ({ modelId }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const baseTime = modelId.length % 5 + 6; 
    setTimeLeft(baseTime);
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);

    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);

    return () => {
      clearInterval(timer);
      clearInterval(messageTimer);
    };
  }, [modelId]);

  return (
    <div className="relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-6 animate-in fade-in duration-500 h-[450px] overflow-hidden animate-float">
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="animate-scan absolute w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
      </div>

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl grayscale opacity-40 shadow-inner">
            {ModelIcons[modelId] || '🤖'}
          </div>
          <div className="space-y-1.5">
            <div className="h-4 w-28 bg-slate-100 rounded animate-shimmer" />
            <div className="h-3 w-14 bg-slate-50 rounded animate-shimmer" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full text-[10px] font-bold border border-indigo-100 shadow-sm animate-pulse">
           <BrainCircuit className="w-3.5 h-3.5" />
           THINKING
        </div>
      </div>
      
      <div className="flex-grow space-y-6 flex flex-col justify-center items-center text-center px-4 relative">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-24 h-24 bg-indigo-400/10 rounded-full animate-radar" />
          <div className="absolute w-24 h-24 bg-indigo-400/5 rounded-full animate-radar [animation-delay:1s]" />
          
          <div className="w-20 h-20 border-[3px] border-slate-100 border-t-indigo-500 rounded-full animate-spin [animation-duration:1.5s] relative z-10 flex items-center justify-center bg-white shadow-xl">
             <div className="w-14 h-14 border-[1px] border-slate-50 border-b-indigo-300 rounded-full animate-spin [animation-duration:3s] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
             </div>
          </div>
        </div>

        <div className="space-y-2 animate-in slide-in-from-bottom-2 duration-700">
          <h4 className="font-bold text-slate-800 text-base">{modelId}</h4>
          <div className="min-h-[1.5rem] flex flex-col items-center">
             <p className="text-[11px] text-slate-500 font-medium transition-all duration-500 opacity-80 italic">
               {LOADING_MESSAGES[messageIndex]}
             </p>
             <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-bold tracking-tight">
               <Hourglass className="w-3 h-3" />
               EST. {timeLeft}S
             </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-50 relative z-10">
        <div className="space-y-2.5">
          <div className="h-2 w-full bg-slate-50 rounded animate-shimmer" />
          <div className="h-2 w-5/6 bg-slate-50 rounded animate-shimmer [animation-delay:0.2s]" />
          <div className="h-2 w-4/6 bg-slate-50 rounded animate-shimmer [animation-delay:0.4s]" />
        </div>
        <div className="flex gap-4 pt-2">
          <div className="h-1.5 flex-1 bg-slate-50 rounded animate-shimmer" />
          <div className="h-1.5 flex-1 bg-slate-50 rounded animate-shimmer [animation-delay:0.1s]" />
        </div>
      </div>
    </div>
  );
};

interface ComparisonGridProps {
  results: ModelResult[];
  pendingModels?: string[];
  onRefine: (modelId: string, rewrite: string) => Promise<void>;
}

const ComparisonGrid: React.FC<ComparisonGridProps> = ({ results, pendingModels = [], onRefine }) => {
  const [activeCategory, setActiveCategory] = useState<ModelCategory | 'All'>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [refiningId, setRefiningId] = useState<string | null>(null);
  const [collapsedCards, setCollapsedCards] = useState<Set<string>>(new Set());
  const [isExporting, setIsExporting] = useState(false);

  const categories: (ModelCategory | 'All')[] = ['All', 'Core', 'Writing', 'Research', 'Social', 'Utility'];

  const filteredResults = useMemo(() => {
    let filtered = activeCategory === 'All' 
      ? results 
      : results.filter(r => r.category === activeCategory);
    
    return [...filtered].sort((a, b) => {
      if (a.isMasterBlend && !b.isMasterBlend) return -1;
      if (!a.isMasterBlend && b.isMasterBlend) return 1;
      return 0;
    });
  }, [results, activeCategory]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleCollapse = (id: string) => {
    const next = new Set(collapsedCards);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCollapsedCards(next);
  };

  const handleCollapseAll = () => {
    if (collapsedCards.size === filteredResults.length) {
      setCollapsedCards(new Set());
    } else {
      setCollapsedCards(new Set(filteredResults.map(r => r.modelId)));
    }
  };

  const handleRefineClick = async (modelId: string, rewrite: string) => {
    setRefiningId(modelId);
    try {
      await onRefine(modelId, rewrite);
    } finally {
      setRefiningId(null);
    }
  };

  const exportToText = () => {
    let content = `PromptForge AI Comparison Report\nGenerated on: ${new Date().toLocaleString()}\n\n`;
    filteredResults.forEach((res, index) => {
      content += `--- ${index + 1}. ${res.modelId} (${res.category}) ---\n`;
      content += `OPTIMIZED PROMPT:\n${res.rewrittenText}\n\n`;
      content += `SIMULATED RESPONSE:\n${res.answerText}\n\n`;
      content += `STRATEGY:\n${res.refinementSuggestions.join('\n')}\n\n`;
      content += `METRICS: Clarity: ${res.metrics.clarity}, Creativity: ${res.metrics.creativity}, Conciseness: ${res.metrics.conciseness}, Professionalism: ${res.metrics.professionalism}\n\n`;
      content += `EXPLANATION:\n${res.explanation}\n\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PromptForge_Comparison_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(20);
    doc.text('PromptForge AI Report', margin, y);
    y += 10;
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, y);
    y += 15;

    filteredResults.forEach((res, index) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor(79, 70, 229); // Indigo-600
      doc.text(`${index + 1}. ${res.modelId} (${res.category})`, margin, y);
      y += 8;
      doc.setTextColor(0, 0, 0);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Optimized Prompt:', margin, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      const rewrittenLines = doc.splitTextToSize(res.rewrittenText, pageWidth - margin * 2);
      doc.text(rewrittenLines, margin, y);
      y += rewrittenLines.length * 5 + 5;

      doc.setFont('helvetica', 'bold');
      doc.text('Simulated Response:', margin, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      const answerLines = doc.splitTextToSize(res.answerText, pageWidth - margin * 2);
      doc.text(answerLines, margin, y);
      y += answerLines.length * 5 + 8;

      if (y > 250) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`PromptForge_Comparison_${Date.now()}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 px-2 border-t md:border-t-0 md:border-l border-slate-100 pt-2 md:pt-0">
          <button 
            onClick={handleCollapseAll}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
            title={collapsedCards.size === filteredResults.length ? "Expand all" : "Collapse all"}
          >
            {collapsedCards.size === filteredResults.length ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">
              {collapsedCards.size === filteredResults.length ? "Expand All" : "Collapse All"}
            </span>
          </button>

          <div className="h-4 w-[1px] bg-slate-200" />

          <button 
            onClick={exportToText}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
            title="Export to Text"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Text</span>
          </button>
          
          <button 
            onClick={exportToPDF}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all border border-indigo-100"
            title="Export to PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        {filteredResults.map((res) => {
          const isCollapsed = collapsedCards.has(res.modelId);
          
          return (
            <div 
              key={res.modelId} 
              className={`relative rounded-xl border shadow-sm transition-all overflow-hidden flex flex-col group animate-in zoom-in-95 duration-500 ${
                isCollapsed
                  ? 'border-slate-200 bg-slate-50 h-[64px]'
                  : res.isMasterBlend 
                    ? 'border-indigo-400 bg-indigo-50/10 ring-1 ring-indigo-500/10 shadow-indigo-100/20' 
                    : 'border-slate-200 bg-white hover:shadow-lg'
              }`}
            >
              <button 
                onClick={() => toggleCollapse(res.modelId)}
                className="absolute top-3 right-3 z-10 p-1.5 rounded-md hover:bg-white/50 transition-colors text-slate-400 hover:text-indigo-600"
                title={isCollapsed ? "Expand card" : "Collapse card"}
              >
                {isCollapsed ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>

              <div className={`p-4 flex items-center justify-between pr-10 cursor-pointer ${
                isCollapsed ? '' : (res.isMasterBlend ? 'border-b border-indigo-100 bg-indigo-100/30' : 'border-b border-slate-100 bg-slate-50/30')
              }`}
              onClick={() => toggleCollapse(res.modelId)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{ModelIcons[res.modelId] || '🤖'}</span>
                  <div className="flex flex-col">
                    <h3 className={`font-bold text-sm ${isCollapsed ? 'text-slate-500' : (res.isMasterBlend ? 'text-indigo-800' : 'text-slate-700')}`}>
                      {res.modelId}
                    </h3>
                    {!isCollapsed && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-medium text-slate-400 uppercase tracking-tighter">
                          {res.category}
                        </span>
                        {res.isMasterBlend && (
                          <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-tighter flex items-center gap-0.5">
                            <Stars className="w-2.5 h-2.5" />
                            Blend
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {!isCollapsed && (
                <div className="p-5 flex-grow space-y-6 animate-in slide-in-from-top-2 duration-200">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Wand2 className="w-3 h-3" />
                        Optimized Prompt
                      </div>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRefineClick(res.modelId, res.rewrittenText); }}
                          disabled={refiningId !== null}
                          className="p-1 hover:text-indigo-600 transition-colors"
                          title="Refine original"
                        >
                          {refiningId === res.modelId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); copyToClipboard(res.rewrittenText, res.modelId); }} className="p-1 hover:text-indigo-600">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className={`text-xs leading-relaxed border-l-2 pl-3 py-1 italic ${
                      res.isMasterBlend ? 'text-slate-800 border-indigo-300' : 'text-slate-700 border-indigo-100'
                    }`}>
                      {res.rewrittenText}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 relative group/answer">
                     <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <MessageCircle className="w-3 h-3" />
                        Simulated Response
                      </div>
                      <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                        {res.answerText}
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); copyToClipboard(res.answerText, res.modelId + '_answer'); }} 
                        className="absolute top-2 right-2 p-1 text-slate-300 hover:text-indigo-500 opacity-0 group-hover/answer:opacity-100 transition-opacity"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-slate-50">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider mb-2 text-slate-400">
                        <Lightbulb className="w-3 h-3 text-amber-500" />
                        Strategy
                      </div>
                      <ul className="space-y-1">
                        {res.refinementSuggestions.slice(0, 2).map((s, idx) => (
                          <li key={idx} className="text-[10px] text-slate-500 flex gap-2">
                            <span className="text-indigo-400 font-bold">•</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className={`px-2 py-2 border-t flex gap-4 text-[9px] font-bold ${
                    res.isMasterBlend ? 'border-indigo-100 text-indigo-400' : 'border-slate-100 text-slate-400'
                  }`}>
                    <div className="flex-1">
                      <div className="mb-1 flex justify-between">
                        <span>CLARITY</span>
                        <span>{(res.metrics.clarity * 10).toFixed(0)}</span>
                      </div>
                      <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400" style={{ width: `${res.metrics.clarity * 100}%` }} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex justify-between">
                        <span>STYLE</span>
                        <span>{(res.metrics.creativity * 10).toFixed(0)}</span>
                      </div>
                      <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-400" style={{ width: `${res.metrics.creativity * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {pendingModels.map((m) => (
          <PendingModelCard key={m} modelId={m} />
        ))}
      </div>
    </div>
  );
};

export default ComparisonGrid;
