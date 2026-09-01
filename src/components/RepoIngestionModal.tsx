import React, { useState } from 'react';
import { 
  FolderGit2, Sparkles, Code2, ArrowRight, CheckCircle2, 
  Layers, Package, Check, Copy, AlertCircle, FileCode,
  Terminal, Globe, RefreshCw, X, Box, ExternalLink, Sliders
} from 'lucide-react';
import { useRegistry } from '../context/RegistryContext';
import { INGESTION_SAMPLE_PRESETS, parseAstFromRawCode } from '../data/ingestionAndVisionPresets';
import { ComponentCategory, IngestionResult } from '../types';

export const RepoIngestionModal: React.FC = () => {
  const { 
    isIngestionModalOpen, 
    setIsIngestionModalOpen, 
    ingestComponent 
  } = useRegistry();

  const [sourceMode, setSourceMode] = useState<'presets' | 'github' | 'raw'>('presets');
  const [selectedPresetId, setSelectedPresetId] = useState(INGESTION_SAMPLE_PRESETS[0].id);
  const [rawCode, setRawCode] = useState(INGESTION_SAMPLE_PRESETS[0].rawCode);
  const [repoUrl, setRepoUrl] = useState('github.com/space-ops/telemetry/components/OrbitalRadarSweep.tsx');
  const [customName, setCustomName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory>('Media & AI UI');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedResult, setParsedResult] = useState<IngestionResult | null>(() => {
    return parseAstFromRawCode(INGESTION_SAMPLE_PRESETS[0].rawCode);
  });
  const [activeAstTab, setActiveAstTab] = useState<'ast' | 'files' | 'props'>('ast');

  if (!isIngestionModalOpen) return null;

  const handleSelectPreset = (preset: typeof INGESTION_SAMPLE_PRESETS[0]) => {
    setSelectedPresetId(preset.id);
    setRawCode(preset.rawCode);
    setRepoUrl(preset.sourceUrl);
    setCustomName(preset.name);
    setSelectedCategory(preset.category as ComponentCategory);
    const parsed = parseAstFromRawCode(preset.rawCode, { name: preset.name, category: preset.category });
    setParsedResult(parsed);
  };

  const handleTriggerAstParse = () => {
    setIsParsing(true);
    setTimeout(() => {
      const parsed = parseAstFromRawCode(rawCode, {
        name: customName || undefined,
        category: selectedCategory,
      });
      setParsedResult(parsed);
      setIsParsing(false);
    }, 400);
  };

  const handleCommitIngestion = () => {
    if (!parsedResult) return;
    ingestComponent(parsedResult);
    setIsIngestionModalOpen(false);
  };

  return (
    <div className="fixed inset-0 h-svh w-screen z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200 transform-gpu">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[min(90svh,800px)] h-[min(90svh,800px)] flex flex-col shadow-2xl overflow-hidden font-sans transform-gpu">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-zinc-100 font-mono tracking-tight">
                  AST Reverse Ingestion &amp; Repo Scraper
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                  v5.0 ENGINE
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Scan local directories or repositories, isolate subtrees, detect hooks, and compile zero-clobber manifests.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsIngestionModalOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="px-6 py-2.5 bg-zinc-950 border-b border-zinc-800/80 flex items-center gap-2 text-xs font-mono">
          {[
            { id: 'presets', label: '1. Curated Presets', icon: Sparkles },
            { id: 'github', label: '2. GitHub / File Path', icon: Globe },
            { id: 'raw', label: '3. Direct AST Source Code', icon: Code2 },
          ].map((tab) => {
            const isActive = sourceMode === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSourceMode(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                  isActive
                    ? 'bg-zinc-800 text-cyan-300 font-semibold border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body (Split Left / Right) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Input Configuration (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {sourceMode === 'presets' && (
              <div className="space-y-2">
                <label className="text-xs font-mono font-semibold text-zinc-300">
                  Select Preset Repo Module:
                </label>
                <div className="space-y-2">
                  {INGESTION_SAMPLE_PRESETS.map((p) => {
                    const isSelected = selectedPresetId === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleSelectPreset(p)}
                        className={`w-full text-left p-3 rounded-xl border transition cursor-pointer ${
                          isSelected
                            ? 'bg-zinc-900 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                            : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-zinc-100 font-mono">
                            {p.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                            {p.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                          {p.description}
                        </p>
                        <div className="text-[10px] font-mono text-zinc-500 mt-2 truncate">
                          {p.sourceUrl}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {sourceMode === 'github' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-mono font-semibold text-zinc-300">
                    Repository Path / URL:
                  </label>
                  <input
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="github.com/org/repo/blob/main/components/StreamRadar.tsx"
                    className="w-full mt-1.5 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-mono font-semibold text-zinc-300">
                      Component Name:
                    </label>
                    <input
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g., StreamRadar"
                      className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-100"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono font-semibold text-zinc-300">
                      Category:
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value as any)}
                      className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100"
                    >
                      <option value="Media & AI UI">Media &amp; AI UI</option>
                      <option value="Data Display">Data Display</option>
                      <option value="Auth & Security">Auth &amp; Security</option>
                      <option value="Layout & Bento">Layout &amp; Bento</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleTriggerAstParse}
                  disabled={isParsing}
                  className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-cyan-300 font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-zinc-700 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isParsing ? 'animate-spin' : ''}`} />
                  <span>Fetch &amp; Parse AST Subtree</span>
                </button>
              </div>
            )}

            {sourceMode === 'raw' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-semibold text-zinc-300">
                    Raw TypeScript / React AST:
                  </label>
                  <button
                    onClick={handleTriggerAstParse}
                    className="text-[11px] font-mono text-cyan-400 hover:underline"
                  >
                    Re-Analyze AST
                  </button>
                </div>
                <textarea
                  value={rawCode}
                  onChange={(e) => setRawCode(e.target.value)}
                  rows={10}
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 scrollbar-thin"
                />
              </div>
            )}

            {/* Ingestion Pipeline Metrics */}
            {parsedResult && (
              <div className="p-3.5 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Lines of Code:</span>
                  <span className="text-zinc-200 font-bold">{parsedResult.astAnalysis.linesOfCode}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>AST Complexity:</span>
                  <span className="text-emerald-400 font-bold">{parsedResult.astAnalysis.complexityScore}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Extracted Files:</span>
                  <span className="text-cyan-300">{parsedResult.extractedFiles.length} files</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Detected NPM Packages:</span>
                  <span className="text-amber-300">{Object.keys(parsedResult.dependencies).length} packages</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: AST Extraction Inspector (7 cols) */}
          <div className="lg:col-span-7 bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              {/* Tabs */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3 text-xs font-mono">
                <div className="flex items-center gap-2">
                  {[
                    { id: 'ast', label: 'AST Manifest', icon: Terminal },
                    { id: 'files', label: 'Sub-files (4)', icon: Layers },
                    { id: 'props', label: 'Prop Bindings', icon: Sliders },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveAstTab(t.id as any)}
                      className={`px-2.5 py-1 rounded-md text-[11px] transition ${
                        activeAstTab === t.id
                          ? 'bg-zinc-800 text-cyan-300 font-semibold border border-zinc-700'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                {parsedResult && (
                  <span className="text-[10px] text-zinc-500">
                    Slug: <code className="text-zinc-300">{parsedResult.slug}</code>
                  </span>
                )}
              </div>

              {/* AST View */}
              {activeAstTab === 'ast' && parsedResult && (
                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <div className="text-zinc-400 text-[11px] mb-1">Detected Components:</div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {parsedResult.astAnalysis.componentsFound.map((c) => (
                        <span key={c} className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[11px]">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-zinc-400 text-[11px] mb-1">Detected React Hooks:</div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {parsedResult.astAnalysis.hooksFound.length > 0 ? (
                        parsedResult.astAnalysis.hooksFound.map((h) => (
                          <span key={h} className="px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[11px]">
                            {h}
                          </span>
                        ))
                      ) : (
                        <span className="text-zinc-500 text-[11px]">useState, useEffect</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-zinc-400 text-[11px] mb-1">Package Dependencies:</div>
                    <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 text-[11px] text-amber-300">
                      {JSON.stringify(parsedResult.dependencies, null, 2)}
                    </div>
                  </div>
                </div>
              )}

              {/* Files View */}
              {activeAstTab === 'files' && parsedResult && (
                <div className="space-y-2 font-mono text-xs">
                  {parsedResult.extractedFiles.map((file) => (
                    <div key={file.path} className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-cyan-400" />
                        <span className="text-zinc-200">{file.path}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase">
                        {file.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Props View */}
              {activeAstTab === 'props' && parsedResult && (
                <div className="space-y-2 font-mono text-xs max-h-[220px] overflow-y-auto">
                  {parsedResult.propControls.map((prop) => (
                    <div key={prop.id} className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-between">
                      <div>
                        <div className="text-zinc-200 font-semibold">{prop.label} ({prop.id})</div>
                        <div className="text-[10px] text-zinc-500">Type: {prop.type}</div>
                      </div>
                      <span className="text-[11px] text-cyan-400">
                        Default: {String(prop.defaultValue)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Commit Button */}
            <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
              <div className="text-[11px] font-mono text-zinc-400">
                Ready to mount into registry &amp; live sandbox
              </div>
              <button
                onClick={handleCommitIngestion}
                disabled={!parsedResult}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs font-mono transition shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Ingest to Registry Roster</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
