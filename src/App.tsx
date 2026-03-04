import React, { useState } from 'react';
import { AnalysisResult } from './types';
import { analyzeReviews } from './services/gemini';
import { SentimentChart } from './components/SentimentChart';
import { WordCloud } from './components/WordCloud';
import { ChatBot } from './components/ChatBot';
import { 
  BarChart3, 
  MessageSquare, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink, 
  Search, 
  Loader2, 
  ArrowRight,
  Sparkles,
  Globe,
  FileText
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [companyName, setCompanyName] = useState('');
  const [reviews, setReviews] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!companyName.trim() || !reviews.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeReviews(reviews, companyName);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-zinc-900 font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <BarChart3 className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">MetaReview</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Sentiment Dashboard v1.0</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {!result ? (
          <div className="max-w-2xl mx-auto mt-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="text-emerald-600" size={24} />
                <h2 className="text-2xl font-bold">New Analysis</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Company Name</label>
                  <input 
                    type="text" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Paste Customer Reviews</label>
                  <textarea 
                    rows={8}
                    value={reviews}
                    onChange={(e) => setReviews(e.target.value)}
                    placeholder="Paste your raw review text here..."
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-4 rounded-xl text-sm">
                    <AlertCircle size={18} />
                    {error}
                  </div>
                )}

                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !companyName || !reviews}
                  className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex flex-col items-center justify-center gap-1"
                >
                  <div className="flex items-center gap-2">
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Analyzing with Gemini...
                      </>
                    ) : (
                      <>
                        Generate Report
                        <ArrowRight size={20} />
                      </>
                    )}
                  </div>
                  {!isAnalyzing && (
                    <div className="flex items-center gap-1 text-[10px] text-emerald-400 uppercase tracking-widest opacity-80">
                      <Sparkles size={10} />
                      Thinking Level: High Force
                    </div>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-8 pb-24">
            {/* Dashboard Header */}
            <div className="flex justify-between items-end">
              <div>
                <div className="flex items-center gap-2 text-emerald-600 mb-2">
                  <CheckCircle2 size={18} />
                  <span className="text-sm font-bold uppercase tracking-wider">Analysis Complete</span>
                </div>
                <h2 className="text-4xl font-bold tracking-tight">{companyName} Report</h2>
              </div>
              <button 
                onClick={() => setResult(null)}
                className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                Start New Analysis
              </button>
            </div>

            {/* Top Row: Summary & Actionable Items */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-zinc-200">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="text-emerald-600" size={24} />
                  <h3 className="text-xl font-bold">Executive Summary</h3>
                </div>
                <div className="prose prose-zinc max-w-none prose-p:leading-relaxed text-zinc-600">
                  <ReactMarkdown>{result.summary}</ReactMarkdown>
                </div>
              </div>

              <div className="bg-zinc-900 text-white p-8 rounded-3xl shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="text-emerald-400" size={24} />
                  <h3 className="text-xl font-bold">Action Plan</h3>
                </div>
                <ul className="space-y-4">
                  {result.actionableItems.map((item, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className="bg-white/10 text-emerald-400 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        {i + 1}
                      </div>
                      <span className="text-zinc-300 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Middle Row: Charts & Word Cloud */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SentimentChart data={result.sentimentTrend} />
              <WordCloud words={result.wordCloud} />
            </div>

            {/* Bottom Row: MetaReview (The "Force" feature) */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Globe size={120} />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-zinc-100 p-2 rounded-lg">
                    <Search className="text-zinc-600" size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">MetaReview: Promises vs. Reality</h3>
                    <p className="text-sm text-zinc-500">Cross-referenced with recent news and corporate statements</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Corporate Promises</h4>
                    <ul className="space-y-3">
                      {result.metaReview.promises.map((promise, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm font-medium text-zinc-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {promise}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">The Delivery Gap</h4>
                    <p className="text-sm leading-relaxed text-zinc-600 bg-zinc-50 p-6 rounded-2xl border border-zinc-100 italic">
                      "{result.metaReview.deliveryGap}"
                    </p>
                  </div>
                </div>

                {result.metaReview.newsSources && result.metaReview.newsSources.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-zinc-100">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Sources Grounding</h4>
                    <div className="flex flex-wrap gap-3">
                      {result.metaReview.newsSources.map((source, i) => (
                        <a 
                          key={i}
                          href={source.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 transition-colors"
                        >
                          <Globe size={12} />
                          {source.title}
                          <ExternalLink size={10} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Chat Button */}
      <button 
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 bg-zinc-900 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-40 group"
      >
        <MessageSquare size={24} />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-zinc-900 text-white px-3 py-1 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Ask Sentiment Assistant
        </span>
      </button>

      <ChatBot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        context={result} 
      />
    </div>
  );
}
