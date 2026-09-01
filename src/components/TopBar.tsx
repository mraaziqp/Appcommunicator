import React, { useState } from 'react';
import { 
  Radio, Copy, Check, RefreshCw, Layers, ShieldCheck, 
  Terminal, Sparkles, Server, Zap, ExternalLink, Activity,
  Watch, Mail, Command, Box, GitPullRequest, Search, Menu
} from 'lucide-react';
import { useRegistry } from '../context/RegistryContext';

interface TopBarProps {
  onOpenBrainModal: () => void;
  onToggleMobileSidebar?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenBrainModal, onToggleMobileSidebar }) => {
  const { 
    activeComponent, 
    secondBrain, 
    triggerBrainSync, 
    copyCode, 
    copiedNotice,
    ecosystemEvents,
    biometrics,
    setIsEcosystemModalOpen,
    setIsCommandPaletteOpen,
    setIsActionQueueOpen,
    openCliExportForComponent,
    agentTasks,
    setIsGatewayModalOpen
  } = useRegistry();
  
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    await triggerBrainSync();
    setTimeout(() => setIsSyncing(false), 600);
  };

  const runningTasksCount = agentTasks.filter(t => t.status === 'running').length;

  return (
    <header className="h-14 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between select-none z-30 sticky top-0 transform-gpu">
      {/* Left: App Title & Satellite Badge */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Menu Hamburger */}
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
            title="Open Components Catalog"
          >
            <Menu className="w-4 h-4 text-cyan-400" />
          </button>
        )}

        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.35)] text-zinc-950 font-black text-xs shrink-0">
            <Layers className="w-4 h-4 text-zinc-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-bold text-xs sm:text-sm text-zinc-100 tracking-tight whitespace-nowrap">Component Registry</span>
              <span className="text-[9px] sm:text-[10px] font-mono font-semibold tracking-wider text-cyan-400 uppercase bg-cyan-950/50 px-1.5 sm:px-2 py-0.5 rounded border border-cyan-800/60 shadow-sm hidden xs:inline-block">
                SATELLITE
              </span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center text-xs text-zinc-500 gap-2 font-mono ml-3 border-l border-zinc-800/80 pl-3">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Active:</span>
          <span className="text-zinc-200 font-semibold">{activeComponent.metadata.name}</span>
          <span className="text-[10px] font-mono font-semibold tracking-wider text-zinc-400 uppercase bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
            v{activeComponent.metadata.version} • STANDALONE
          </span>
        </div>

        {/* Global Command Palette Trigger Bar */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-400 hover:text-zinc-200 font-mono transition ml-2"
          title="Open Global Neural Search & Command Palette (Cmd + K)"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-zinc-400 text-[11px]">Search memory or run actions...</span>
          <kbd className="px-1.5 py-0.2 rounded bg-zinc-950 text-[10px] font-mono text-zinc-400 border border-zinc-700">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Second Brain Connection & Global Actions */}
      <div className="flex items-center gap-2">
        {/* CLI Scaffolder Trigger */}
        <button
          onClick={() => openCliExportForComponent(activeComponent.metadata.slug)}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-mono transition"
          title="Export Component via npx @second-brain/cli"
        >
          <Box className="w-3.5 h-3.5 text-cyan-400" />
          <span>CLI Export</span>
        </button>

        {/* Phase 5: System Operations & Production Gateway Modal */}
        <button
          onClick={() => setIsGatewayModalOpen(true)}
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono transition cursor-pointer"
          title="Open System Operations, Docker Gateway & Secrets Vault"
        >
          <Server className="w-3.5 h-3.5 text-emerald-400" />
          <span>Gateway &amp; Ops</span>
        </button>

        {/* Autonomous Action Queue Button */}
        <button
          onClick={() => setIsActionQueueOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-mono transition relative"
          title="Open Autonomous Action Queue & Background Pipelines"
        >
          <Zap className={`w-3.5 h-3.5 ${runningTasksCount > 0 ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-cyan-400'}`} />
          <span className="hidden sm:inline">Actions</span>
          {agentTasks.length > 0 && (
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
              runningTasksCount > 0 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                : 'bg-zinc-800 text-zinc-400'
            }`}>
              {agentTasks.length}
            </span>
          )}
        </button>

        {/* Phase 2: Jarvis Ecosystem Proactive Ingestion Badge */}
        <button
          onClick={() => setIsEcosystemModalOpen(true)}
          className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono transition group shadow-[0_0_12px_rgba(6,182,212,0.15)] cursor-pointer"
          title="Open Jarvis Ecosystem Ingestion & Proactive Decision Hub (M365, GitHub, Watch4)"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <div className="flex items-center gap-1.5 font-semibold">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">JARVIS ECOSYSTEM</span>
            <span className="md:hidden">JARVIS</span>
          </div>
          {biometrics && (
            <span className="hidden xl:inline-block text-[10px] text-rose-300 pl-1 border-l border-cyan-800/60 font-mono">
              ❤️ {biometrics.heartRateBpm} BPM
            </span>
          )}
        </button>

        {/* Pulsing Second Brain Linked Status Badge */}
        <button
          onClick={onOpenBrainModal}
          className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono transition group shadow-[0_0_12px_rgba(16,185,129,0.12)] cursor-pointer"
          title="Inspect Second Brain Orchestration Bridge & Telemetry"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold tracking-wide">
            SECOND BRAIN
          </span>
          <span className="text-[10px] text-emerald-400/80 font-normal pl-1 border-l border-emerald-500/30">
            {secondBrain.pingMs}ms
          </span>
        </button>

        {/* Sync Button */}
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="p-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition disabled:opacity-50 cursor-pointer"
          title="Force Sync with Second Brain Orchestrator"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
        </button>

        {/* Global Copy All Code Action */}
        <button
          onClick={() => copyCode('all-bundle')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold text-xs transition shadow-[0_0_15px_rgba(6,182,212,0.25)] active:scale-95 cursor-pointer"
          title="Copy full component bundle (TSX, hooks, types, and schema)"
        >
          {copiedNotice ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedNotice ? 'Copied Bundle!' : 'Copy Bundle'}</span>
        </button>
      </div>
    </header>
  );
};


