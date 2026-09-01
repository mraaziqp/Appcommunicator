import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Copy, Check, FileCode, Download, ExternalLink, 
  Layers, Database, Sparkles, Code2, Cpu, Terminal, 
  BookOpen, CheckCheck, Share2
} from 'lucide-react';
import { useRegistry } from '../context/RegistryContext';
import { CodeTabKey } from '../types';
import { generateDynamicUsageCode } from '../data/componentsData';

type PackageManager = 'npx' | 'pnpm dlx' | 'bunx' | 'yarn dlx';

export const CodeInspector: React.FC = () => {
  const { 
    activeComponent, 
    activeCodeTab, 
    setActiveCodeTab, 
    componentProps,
    copyCode, 
    copiedNotice,
    currentTheme
  } = useRegistry();

  const [copiedTab, setCopiedTab] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);
  const [pkgManager, setPkgManager] = useState<PackageManager>('npx');

  const codeFiles = activeComponent.code;

  // Derive current code - if Usage.tsx, dynamically generate based on componentProps & currentTheme!
  const currentCode = activeCodeTab === 'Usage.tsx'
    ? generateDynamicUsageCode(activeComponent, componentProps, currentTheme.name)
    : (codeFiles[activeCodeTab] || '// No source code available for this tab');

  const getCliCommand = (pm: PackageManager, slug: string) => {
    return `${pm} second-brain-cli add ${slug}`;
  };

  const cliCommand = getCliCommand(pkgManager, activeComponent.metadata.slug);

  const handleCopyCli = async () => {
    try {
      await navigator.clipboard.writeText(cliCommand);
      setCopiedCli(true);
      setTimeout(() => setCopiedCli(false), 2000);
    } catch (e) {
      // clipboard fallback
    }
  };

  const handleCopyCurrent = async () => {
    await copyCode('current-file');
    setCopiedTab(true);
    setTimeout(() => setCopiedTab(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentCode], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeComponent.metadata.name.replace(/\s+/g, '')}_${activeCodeTab}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Determine Monaco language
  const getLanguage = (tab: CodeTabKey) => {
    if (tab === 'styles.css') return 'css';
    return 'typescript';
  };

  const tabs: { key: CodeTabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'Usage.tsx', label: 'Usage.tsx', icon: <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> },
    { key: 'Component.tsx', label: 'Component.tsx', icon: <FileCode className="w-3.5 h-3.5 text-cyan-400" /> },
    { key: 'hooks.ts', label: 'hooks.ts', icon: <Cpu className="w-3.5 h-3.5 text-purple-400" /> },
    { key: 'types.ts', label: 'types.ts', icon: <Code2 className="w-3.5 h-3.5 text-emerald-400" /> },
    ...(codeFiles['schema.ts']
      ? [{ key: 'schema.ts' as CodeTabKey, label: 'schema.ts (Drizzle)', icon: <Database className="w-3.5 h-3.5 text-amber-400" /> }]
      : []),
  ];

  const lineCount = currentCode.split('\n').length;
  const byteSize = new Blob([currentCode]).size;

  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-hidden select-none border-l border-zinc-800/80">
      {/* 1. Quick CLI Exporter Bar */}
      <div className="border-b border-zinc-800/80 bg-zinc-950/90 px-3.5 py-2 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-[11px] font-mono text-zinc-400">
            {(['npx', 'pnpm dlx', 'bunx', 'yarn dlx'] as PackageManager[]).map((pm) => (
              <button
                key={pm}
                onClick={() => setPkgManager(pm)}
                className={`px-2 py-0.5 rounded transition cursor-pointer ${
                  pkgManager === pm 
                    ? 'bg-zinc-800 text-cyan-300 font-semibold shadow-sm' 
                    : 'hover:text-zinc-200'
                }`}
              >
                {pm.split(' ')[0]}
              </button>
            ))}
          </div>

          <div className="flex-1 flex items-center justify-between bg-black/60 border border-zinc-800/90 rounded-lg px-3 py-1 font-mono text-xs text-zinc-200 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="text-zinc-400 select-all whitespace-nowrap">{cliCommand}</span>
            </div>

            <button
              onClick={handleCopyCli}
              className="ml-2 px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-[11px] flex items-center gap-1 transition cursor-pointer hover:border-zinc-700 shrink-0"
              title="Copy CLI install command"
            >
              {copiedCli ? (
                <>
                  <CheckCheck className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-zinc-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <span className="text-[10px] font-mono text-zinc-500 uppercase">
            REGISTRY SLUG: {activeComponent.metadata.slug}
          </span>
        </div>
      </div>

      {/* 2. Code Inspector Tabs Bar */}
      <div className="h-10 border-b border-zinc-800/80 bg-zinc-900/50 px-3 flex items-center justify-between gap-2">
        {/* Active Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((t) => {
            const isActive = activeCodeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActiveCodeTab(t.key)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition cursor-pointer ${
                  isActive
                    ? 'bg-zinc-800 text-cyan-300 border border-zinc-700 font-medium shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
                {t.key === 'Usage.tsx' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Code Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopyCurrent}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 transition hover:border-zinc-700 cursor-pointer"
            title="Copy current file contents"
          >
            {copiedTab ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedTab ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
            title="Download source file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 relative bg-zinc-950">
        <Editor
          height="100%"
          language={getLanguage(activeCodeTab)}
          theme="vs-dark"
          value={currentCode}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 12.5,
            fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
            lineNumbers: 'on',
            lineNumbersMinChars: 3,
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            wordWrap: 'on',
            tabSize: 2,
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: 'all',
          }}
          loading={
            <div className="flex items-center justify-center h-full text-xs font-mono text-zinc-500 gap-2">
              <Layers className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Loading Monaco Code Inspector...</span>
            </div>
          }
        />
      </div>

      {/* Code Inspector Footer Stats */}
      <div className="h-8 border-t border-zinc-800/80 bg-zinc-950/90 px-3.5 flex items-center justify-between text-[11px] font-mono text-zinc-400">
        <div className="flex items-center gap-3">
          <span className="text-zinc-300">{activeCodeTab}</span>
          <span className="text-zinc-600">|</span>
          <span>{lineCount} lines</span>
          <span className="text-zinc-600">|</span>
          <span>{(byteSize / 1024).toFixed(1)} KB</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-500 font-mono uppercase">TypeScript 5.8 • Standalone</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        </div>
      </div>
    </div>
  );
};
