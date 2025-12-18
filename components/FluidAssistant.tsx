import React, { useState } from 'react';
import { Search, Globe, Sparkles, ArrowRight, Loader2, ExternalLink, Bot } from 'lucide-react';
import { generateTextWithSearch, SearchResult } from '../services/geminiService';

const FluidAssistant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await generateTextWithSearch(query);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "What is the current price of Ethereum?",
    "Latest news on Fluid Chain?",
    "How does sharding work in blockchain?",
    "Compare Solana and Fluid TPS"
  ];

  return (
    <section className="py-8 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-cyan-500/5 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Globe size={12} />
            Live Web Access
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-slate-900 dark:text-white">
            Fluid Intelligence
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Powered by Gemini with real-time Google Search grounding. Ask anything.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white dark:bg-slate-950 p-2 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 mb-6 transition-shadow focus-within:shadow-2xl focus-within:border-cyan-500/50">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="pl-4 text-slate-400">
              <Bot size={24} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about crypto, market trends, or Fluid tech..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-lg p-4 text-slate-900 dark:text-white placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <ArrowRight size={24} />}
            </button>
          </form>
        </div>

        {/* Suggestions */}
        {!result && !loading && (
          <div className="flex flex-wrap justify-center gap-3">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setQuery(s)}
                className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm hover:border-cyan-400 hover:text-cyan-500 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Result Area */}
        {result && (
          <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-lg animate-fade-in-up">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl shadow-lg shrink-0">
                <Sparkles className="text-white" size={24} />
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-slate-800 dark:text-slate-200 text-lg leading-relaxed whitespace-pre-line">
                  {result.text}
                </p>
              </div>
            </div>

            {/* Sources */}
            {result.sources.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Globe size={12} /> Sources
                </h4>
                <div className="grid gap-2 md:grid-cols-2">
                  {result.sources.map((source, idx) => (
                    <a
                      key={idx}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    >
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate pr-4">
                        {source.title}
                      </span>
                      <ExternalLink size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FluidAssistant;