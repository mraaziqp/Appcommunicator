import React, { useState, useEffect } from 'react';
import { 
  Box, X, Terminal, Copy, Check, ExternalLink, Code2, Layers, 
  FileCode2, Download, Sparkles, ArrowRight, Play, RefreshCw, Cpu
} from 'lucide-react';
import { useRegistry } from '../context/RegistryContext';
import { ComponentCliManifest } from '../types';
import { STANDALONE_CLI_SCRIPT_SOURCE } from '../data/cliScriptData';

export function CliExportModal() {
  const {
    isCliExportModalOpen,
    setIsCliExportModalOpen,
    cliTargetSlug,
    setCliTargetSlug,
    components,
    fetchCliManifest,
    copiedNotice,
  } = useRegistry();

  const [manifest, setManifest] = useState<ComponentCliManifest | null>(null);
  const [activeTab, setActiveTab] = useState<'quickstart' | 'script' | 'manifest' | 'files'>('quickstart');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simulated terminal playback state
  const [isTerminalRunning, setIsTerminalRunning] = useState(false);
  const [terminalStep, setTerminalStep] = useState(0);

  useEffect(() => {
    if (isCliExportModalOpen && cliTargetSlug) {
      loadManifest(cliTargetSlug);
    }
  }, [isCliExportModalOpen, cliTargetSlug]);

  const loadManifest = async (slug: string) => {
    setIsLoading(true);
    const data = await fetchCliManifest(slug);
    setManifest(data);
    setIsLoading(false);
    startTerminalSim();
  };

  const startTerminalSim = () => {
    setIsTerminalRunning(true);
    setTerminalStep(0);
    const timer1 = setTimeout(() => setTerminalStep(1), 300);
    const timer2 = setTimeout(() => setTerminalStep(2), 700);
    const timer3 = setTimeout(() => setTerminalStep(3), 1100);
    const timer4 = setTimeout(() => {
      setTerminalStep(4);
      setIsTerminalRunning(false);
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  };

  const copyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  if (!isCliExportModalOpen) return null;

  const currentSlug = manifest?.name || cliTargetSlug;
  const npxCommand = `npx @second-brain/cli add ${currentSlug}`;
  const customPathCommand = `npx @second-brain/cli add ${currentSlug} --path ./components/ui`;
  const curlCommand = `curl -s ${window.location.origin}/api/registry/v1/components/${currentSlug} | jq .`;

  return (
    <div className="fixed inset-0 h-svh w-screen z-50 flex items-center justify-center p-2 sm:p-6 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-150 transform-gpu">
      <div className="w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[min(90svh,760px)] h-[min(90svh,760px)] divide-y divide-zinc-800 animate-in zoom-in-95 duration-150 transform-gpu">
        
        {/* Modal Header */}
        <div className="p-4 bg-zinc-950/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-zinc-100 font-mono">CLI Distribution Engine</h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-bold">
                  v3.0 Standalone
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Scaffold self-contained, typed components directly into external codebases
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Component Selector Dropdown */}
            <select
              value={cliTargetSlug}
              onChange={(e) => {
                setCliTargetSlug(e.target.value);
                loadManifest(e.target.value);
              }}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-zinc-200 font-mono focus:outline-none focus:border-cyan-500"
            >
              {components.map((c) => (
                <option key={c.metadata.slug} value={c.metadata.slug}>
                  {c.metadata.name} ({c.metadata.slug})
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsCliExportModalOpen(false)}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 py-2 bg-zinc-950/60 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'quickstart', label: 'CLI Quickstart & Terminal', icon: Terminal },
              { id: 'script', label: 'Standalone bin/cli.ts Script', icon: FileCode2 },
              { id: 'manifest', label: 'JSON Manifest Payload', icon: Code2 },
              { id: 'files', label: 'Extracted File Bundle', icon: Layers },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-zinc-800 text-cyan-300 font-semibold border border-zinc-700'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-zinc-500 shrink-0">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>npx @second-brain/cli</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 max-h-[550px] scrollbar-thin">
          
          {/* TAB 1: QUICKSTART */}
          {activeTab === 'quickstart' && (
            <div className="space-y-4">
              
              {/* Primary Command Card */}
              <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400 font-semibold">1. Standard NPX Scaffolder</span>
                  <button
                    onClick={() => copyText(npxCommand, 'npx')}
                    className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] flex items-center gap-1 transition"
                  >
                    {copiedKey === 'npx' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'npx' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800/80 font-mono text-xs text-cyan-300 flex items-center justify-between select-all">
                  <code>{npxCommand}</code>
                </div>
              </div>

              {/* Custom Path Command */}
              <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400 font-semibold">2. Target Custom Destination Directory</span>
                  <button
                    onClick={() => copyText(customPathCommand, 'path')}
                    className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] flex items-center gap-1 transition"
                  >
                    {copiedKey === 'path' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'path' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800/80 font-mono text-xs text-zinc-300 flex items-center justify-between select-all">
                  <code>{customPathCommand}</code>
                </div>
              </div>

              {/* Interactive Terminal Visualizer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Live CLI Scaffolding Simulation</span>
                  </div>
                  <button
                    onClick={startTerminalSim}
                    disabled={isTerminalRunning}
                    className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] flex items-center gap-1 transition disabled:opacity-50"
                  >
                    <Play className="w-3 h-3 text-emerald-400" />
                    <span>Re-run Simulation</span>
                  </button>
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 font-mono text-xs space-y-2">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span className="text-emerald-400">$</span>
                    <span className="text-zinc-100">{npxCommand}</span>
                  </div>

                  {terminalStep >= 1 && (
                    <div className="flex items-center gap-2 text-zinc-300 animate-in fade-in">
                      <span className="text-cyan-400">✔</span>
                      <span>Fetching registry manifest from Second Brain API...</span>
                    </div>
                  )}

                  {terminalStep >= 2 && (
                    <div className="space-y-1 text-zinc-300 animate-in fade-in">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400">✔</span>
                        <span>Resolving dependencies:</span>
                      </div>
                      <div className="pl-6 text-[11px] text-zinc-400">
                        {manifest?.dependencies.map((d) => (
                          <div key={d} className="text-zinc-400">+ {d}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {terminalStep >= 3 && (
                    <div className="space-y-1 text-zinc-300 animate-in fade-in">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400">✔</span>
                        <span>Writing extracted component files:</span>
                      </div>
                      <div className="pl-6 text-[11px] text-emerald-400">
                        {manifest?.files.map((f) => (
                          <div key={f.name}>created: {f.targetPath}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {terminalStep >= 4 && (
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs mt-3 flex items-center justify-between animate-in fade-in">
                      <span>🎉 Component {manifest?.name} scaffolded successfully!</span>
                      <span className="text-[10px] text-emerald-400 font-bold">READY TO IMPORT</span>
                    </div>
                  )}
                </div>
              </div>

              {/* cURL API Alternative */}
              <div className="p-3 bg-zinc-950/70 rounded-xl border border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-zinc-400 truncate">
                  <span className="text-zinc-500 font-bold">API:</span>
                  <code className="text-zinc-300 truncate">{curlCommand}</code>
                </div>
                <button
                  onClick={() => copyText(curlCommand, 'curl')}
                  className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] shrink-0 ml-2"
                >
                  {copiedKey === 'curl' ? 'Copied' : 'Copy cURL'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: STANDALONE CLI SCRIPT */}
          {activeTab === 'script' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <FileCode2 className="w-4 h-4 text-cyan-400" />
                  <span>Physical CLI Distribution Binary (src/cli/index.ts)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const blob = new Blob([STANDALONE_CLI_SCRIPT_SOURCE], { type: 'text/typescript' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'cli.ts';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download cli.ts</span>
                  </button>
                  <button
                    onClick={() => copyText(STANDALONE_CLI_SCRIPT_SOURCE, 'cli-ts-source')}
                    className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'cli-ts-source' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'cli-ts-source' ? 'Copied Script' : 'Copy Script'}</span>
                  </button>
                </div>
              </div>
              <div className="p-3 bg-zinc-900/80 rounded-lg border border-zinc-800 text-[11px] font-mono text-zinc-400">
                Place this file in your project&apos;s <code className="text-zinc-200">bin/cli.ts</code> and execute with <code className="text-cyan-300">npx tsx bin/cli.ts add {currentSlug}</code> for local execution.
              </div>
              <pre className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 text-xs text-zinc-300 font-mono overflow-x-auto max-h-[380px] scrollbar-thin">
                {STANDALONE_CLI_SCRIPT_SOURCE}
              </pre>
            </div>
          )}

          {/* TAB 3: RAW MANIFEST JSON */}
          {activeTab === 'manifest' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>GET /api/registry/v1/components/{currentSlug}</span>
                <button
                  onClick={() => copyText(JSON.stringify(manifest, null, 2), 'manifest-json')}
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs flex items-center gap-1"
                >
                  {copiedKey === 'manifest-json' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'manifest-json' ? 'Copied JSON' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 text-xs text-cyan-300 font-mono overflow-x-auto max-h-[420px] scrollbar-thin">
                {JSON.stringify(manifest, null, 2)}
              </pre>
            </div>
          )}

          {/* TAB 3: EXTRACTED FILE BUNDLE */}
          {activeTab === 'files' && (
            <div className="space-y-3">
              <div className="text-xs font-mono text-zinc-400">
                Self-contained bundle items packaged for {manifest?.name}:
              </div>
              <div className="space-y-2">
                {manifest?.files.map((file) => (
                  <div 
                    key={file.name}
                    className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <FileCode2 className="w-4 h-4 text-cyan-400" />
                        <span className="text-zinc-200 font-semibold">{file.name}</span>
                        <span className="text-[10px] text-zinc-500">→ {file.targetPath}</span>
                      </div>
                      <button
                        onClick={() => copyText(file.content, `file-${file.name}`)}
                        className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] flex items-center gap-1"
                      >
                        {copiedKey === `file-${file.name}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === `file-${file.name}` ? 'Copied' : 'Copy File'}</span>
                      </button>
                    </div>
                    <pre className="p-2.5 bg-zinc-900 rounded-lg text-[11px] text-zinc-300 font-mono overflow-x-auto max-h-32 scrollbar-thin">
                      {file.content.slice(0, 300)}...
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-zinc-950 text-xs font-mono text-zinc-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Direct Distribution Protocol</span>
          </div>
          <span>Format: JSON Manifest v1.0</span>
        </div>
      </div>
    </div>
  );
}
