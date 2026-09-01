import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Command, Sparkles, Terminal, FileCode2, Mail, CheckCircle2, 
  ArrowRight, ArrowUpRight, Cpu, Zap, Activity, Clock, Layers, X,
  ExternalLink, CornerDownLeft, GitPullRequest, ShieldCheck, Box
} from 'lucide-react';
import { useRegistry } from '../context/RegistryContext';
import { SemanticSearchResult } from '../types';

export function CommandPaletteModal() {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    components,
    setActiveComponentId,
    setIsEcosystemModalOpen,
    setIsActionQueueOpen,
    openCliExportForComponent,
    triggerAgentTask,
    performSemanticSearch,
    activeComponent,
  } = useRegistry();

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [results, setResults] = useState<SemanticSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Quick Action items always available or when query matches actions
  const quickActions = [
    {
      id: 'qa_cli_export',
      title: `Export ${activeComponent.metadata.name} via CLI (npx)`,
      description: 'Scaffold self-contained component bundle into any external codebase',
      category: 'CLI Distribution',
      icon: Box,
      action: () => {
        setIsCommandPaletteOpen(false);
        openCliExportForComponent(activeComponent.metadata.slug);
      },
    },
    {
      id: 'qa_run_tests',
      title: 'Run Isolated Container Test Suite',
      description: 'Execute Vitest and typechecking in ephemeral sandbox runner',
      category: 'Agent Action',
      icon: Terminal,
      action: () => {
        setIsCommandPaletteOpen(false);
        triggerAgentTask('EXECUTE_SANDBOX_RUN', activeComponent.metadata.slug, `Ephemeral Test Run: ${activeComponent.metadata.name}`);
        setIsActionQueueOpen(true);
      },
    },
    {
      id: 'qa_auto_patch',
      title: 'Generate Automated PR & Patch Branch',
      description: 'Inject rate-limiting and performance optimizations into repository',
      category: 'Agent Action',
      icon: GitPullRequest,
      action: () => {
        setIsCommandPaletteOpen(false);
        triggerAgentTask('EXECUTE_CODE_PATCH', activeComponent.metadata.slug, `Automated Patch PR: ${activeComponent.metadata.name}`);
        setIsActionQueueOpen(true);
      },
    },
    {
      id: 'qa_open_ecosystem',
      title: 'Open Jarvis Ecosystem & Proactive Decision Hub',
      description: 'View M365 email triage, GitHub pipelines, and Galaxy Watch 4 telemetry',
      category: 'Navigation',
      icon: Activity,
      action: () => {
        setIsCommandPaletteOpen(false);
        setIsEcosystemModalOpen(true);
      },
    },
    {
      id: 'qa_open_action_queue',
      title: 'Open Autonomous Action Execution Queue',
      description: 'Monitor background agent tasks, PRs, and contextual email drafts',
      category: 'Agent Action',
      icon: Zap,
      action: () => {
        setIsCommandPaletteOpen(false);
        setIsActionQueueOpen(true);
      },
    },
  ];

  // Focus input when opened
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      loadInitialResults();
    }
  }, [isCommandPaletteOpen]);

  const loadInitialResults = async () => {
    setIsLoading(true);
    const initial = await performSemanticSearch('', 'all');
    setResults(initial);
    setIsLoading(false);
  };

  // Perform search on query change
  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      setIsLoading(true);
      const res = await performSemanticSearch(query, filterType);
      if (active) {
        setResults(res);
        setSelectedIndex(0);
        setIsLoading(false);
      }
    }, 120);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, filterType]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const totalItems = results.length + (query ? 0 : quickActions.length);
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, totalItems));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const totalItems = results.length + (query ? 0 : quickActions.length);
      setSelectedIndex((prev) => (prev - 1 + totalItems) % Math.max(1, totalItems));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelectCurrent();
    } else if (e.key === 'Escape') {
      setIsCommandPaletteOpen(false);
    }
  };

  const handleSelectCurrent = () => {
    if (results.length > 0 && selectedIndex < results.length) {
      handleSelectResult(results[selectedIndex]);
    } else if (!query && selectedIndex >= results.length) {
      const qaIndex = selectedIndex - results.length;
      if (quickActions[qaIndex]) {
        quickActions[qaIndex].action();
      }
    }
  };

  const handleSelectResult = (item: SemanticSearchResult) => {
    setIsCommandPaletteOpen(false);
    if (item.documentType === 'component' && item.componentSlug) {
      const match = components.find((c) => c.metadata.slug === item.componentSlug);
      if (match) setActiveComponentId(match.metadata.id);
    } else if (item.documentType === 'communication') {
      setIsEcosystemModalOpen(true);
    } else if (item.documentType === 'biometric') {
      setIsEcosystemModalOpen(true);
    } else if (item.documentType === 'task') {
      setIsEcosystemModalOpen(true);
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 h-svh w-screen z-50 flex items-start justify-center pt-12 sm:pt-28 px-3 sm:px-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-150 transform-gpu">
      <div 
        className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[min(85svh,640px)] divide-y divide-zinc-800 animate-in zoom-in-95 duration-150 transform-gpu"
        onKeyDown={handleKeyDown}
      >
        {/* Search Header Input */}
        <div className="p-3.5 flex items-center gap-3 bg-zinc-900/90">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components, email threads, sprint tasks, or neural memory..."
            className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none font-mono"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-1 shrink-0 px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-400 border border-zinc-700">
            <span>ESC</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-3.5 py-2 bg-zinc-950/60 flex items-center justify-between gap-2 overflow-x-auto text-xs font-mono">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'all', label: 'All Neural Streams' },
              { id: 'component', label: 'Components' },
              { id: 'communication', label: 'Emails & Comms' },
              { id: 'task', label: 'Sprint & PRs' },
              { id: 'biometric', label: 'Biometrics' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-2.5 py-1 rounded-lg transition shrink-0 ${
                  filterType === f.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-zinc-500 shrink-0">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>pgvector 1536-dim</span>
          </div>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto flex-1 p-2 space-y-1 max-h-[420px] scrollbar-thin">
          {isLoading && (
            <div className="py-8 text-center space-y-2">
              <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-zinc-400 font-mono">Querying Neon pgvector memory index...</p>
            </div>
          )}

          {!isLoading && results.length === 0 && (
            <div className="py-12 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-400 font-mono">No neural memory matches found for "{query}"</p>
              <p className="text-[11px] text-zinc-500">Try searching for keywords like "camera", "passkey", "ssl", "stress", or "telemetry"</p>
            </div>
          )}

          {!isLoading && results.map((result, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <div
                key={result.id}
                onClick={() => handleSelectResult(result)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`p-3 rounded-xl cursor-pointer transition flex items-start justify-between gap-3 ${
                  isSelected 
                    ? 'bg-cyan-950/50 border border-cyan-500/40' 
                    : 'bg-zinc-900/40 hover:bg-zinc-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                    result.documentType === 'component' ? 'bg-cyan-500/10 text-cyan-400' :
                    result.documentType === 'communication' ? 'bg-amber-500/10 text-amber-400' :
                    result.documentType === 'biometric' ? 'bg-rose-500/10 text-rose-400' :
                    'bg-indigo-500/10 text-indigo-400'
                  }`}>
                    {result.documentType === 'component' && <FileCode2 className="w-4 h-4" />}
                    {result.documentType === 'communication' && <Mail className="w-4 h-4" />}
                    {result.documentType === 'biometric' && <Activity className="w-4 h-4" />}
                    {result.documentType === 'task' && <GitPullRequest className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-zinc-100 font-mono">{result.title}</span>
                      <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 text-[10px] font-mono uppercase">
                        {result.documentType}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {result.snippet}
                    </p>
                    {result.tags && result.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-1">
                        {result.tags.slice(0, 4).map((tag, tIdx) => (
                          <span key={tIdx} className="text-[10px] text-zinc-500 font-mono">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-bold">
                    {Math.round(result.similarityScore * 100)}% match
                  </div>
                  {isSelected && (
                    <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-0.5">
                      <span>Jump</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Quick Actions (when query is short or empty) */}
          {!query && (
            <div className="pt-2 space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>Autonomous Agent Quick Actions</span>
              </div>
              {quickActions.map((qa, qIdx) => {
                const globalIndex = results.length + qIdx;
                const isSelected = globalIndex === selectedIndex;
                const IconComponent = qa.icon;
                return (
                  <div
                    key={qa.id}
                    onClick={qa.action}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                    className={`p-2.5 rounded-xl cursor-pointer transition flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-zinc-800 border border-zinc-700'
                        : 'bg-zinc-900/30 hover:bg-zinc-800/40 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300">
                        <IconComponent className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-zinc-200">{qa.title}</div>
                        <div className="text-[11px] text-zinc-400">{qa.description}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 px-2 py-0.5 rounded bg-zinc-800">
                      {qa.category}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="p-2.5 bg-zinc-950/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 flex items-center">
                <CornerDownLeft className="w-2.5 h-2.5" />
              </kbd>
              <span>to select</span>
            </span>
          </div>
          <span>Satellite Semantic Search v3.0</span>
        </div>
      </div>
    </div>
  );
}
