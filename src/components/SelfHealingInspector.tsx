import React, { useState } from 'react';
import { 
  Wrench, AlertTriangle, Play, RefreshCw, CheckCircle2, 
  GitPullRequest, FileDiff, Sparkles, ChevronDown, ChevronUp,
  Terminal, ShieldAlert, Cpu, ArrowRight, Check
} from 'lucide-react';
import { useRegistry } from '../context/RegistryContext';

export const SelfHealingInspector: React.FC = () => {
  const {
    selfHealingSession,
    syntheticFaults,
    injectSyntheticFault,
    startSelfHealingLoop,
    resetSelfHealingState,
    activeComponent,
  } = useRegistry();

  const [selectedFaultId, setSelectedFaultId] = useState(syntheticFaults[0].id);
  const [showDiffModal, setShowDiffModal] = useState(false);

  const selectedFault = syntheticFaults.find((f) => f.id === selectedFaultId) || syntheticFaults[0];
  const isHealing = selfHealingSession.status === 'analyzing' || selfHealingSession.status === 'patch_generated' || selfHealingSession.status === 'testing';

  return (
    <div className="w-full bg-zinc-950/95 border-b border-zinc-800/80 px-3.5 py-2 z-10 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Fault Injector Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-300">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-zinc-200">Self-Healing Triage:</span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedFaultId}
              onChange={(e) => setSelectedFaultId(e.target.value)}
              disabled={isHealing}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-200 font-mono focus:outline-none focus:border-amber-500 max-w-[280px] truncate"
            >
              {syntheticFaults.map((fault) => (
                <option key={fault.id} value={fault.id}>
                  {fault.name} ({fault.targetFile})
                </option>
              ))}
            </select>

            <button
              onClick={() => injectSyntheticFault(selectedFaultId)}
              disabled={isHealing}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium transition cursor-pointer disabled:opacity-50"
              title="Inject synthetic runtime failure into virtual sandbox"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Inject Fault</span>
            </button>
          </div>
        </div>

        {/* Right: Self-Healing Trigger and Session Status */}
        <div className="flex items-center gap-2">
          {selfHealingSession.status === 'fault_injected' && (
            <button
              onClick={startSelfHealingLoop}
              disabled={isHealing}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500 text-zinc-950 text-xs font-mono font-bold hover:bg-emerald-400 transition shadow-[0_0_12px_rgba(16,185,129,0.3)] cursor-pointer animate-pulse"
              title="Launch autonomous diagnosis, unified patch diff, and verification PR"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Autonomous Fix &amp; Verify</span>
            </button>
          )}

          {isHealing && (
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1 text-xs font-mono text-cyan-300">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>
                {selfHealingSession.status === 'analyzing' && 'Analyzing AST stack trace...'}
                {selfHealingSession.status === 'patch_generated' && 'Generating Unified Diff Patch...'}
                {selfHealingSession.status === 'testing' && 'Executing Ephemeral Vitest Suite...'}
              </span>
            </div>
          )}

          {selfHealingSession.status === 'pr_created' && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-800/80 rounded-lg px-2.5 py-1 text-xs font-mono text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Healed (100% Green)</span>
              </div>

              {selfHealingSession.prUrl && (
                <a
                  href={selfHealingSession.prUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-mono transition"
                >
                  <GitPullRequest className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Inspect PR</span>
                </a>
              )}

              <button
                onClick={resetSelfHealingState}
                className="px-2 py-1 rounded text-xs text-zinc-400 hover:text-zinc-200 font-mono"
              >
                Reset
              </button>
            </div>
          )}

          {selfHealingSession.status === 'idle' && (
            <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
              Self-Healing Agent: STANDBY
            </span>
          )}
        </div>
      </div>

      {/* Mini Diagnostic Banner when fault is injected */}
      {selfHealingSession.status === 'fault_injected' && (
        <div className="mt-2 p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/50 flex items-start justify-between gap-2 text-xs font-mono animate-in fade-in duration-150">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-rose-200 font-bold">
                Fault Detected: {selectedFault.name}
              </div>
              <div className="text-[11px] text-rose-300/80 font-mono mt-0.5">
                {selectedFault.description}
              </div>
            </div>
          </div>
          <button
            onClick={startSelfHealingLoop}
            className="px-2.5 py-1 rounded bg-rose-500 hover:bg-rose-400 text-zinc-950 font-bold text-[11px] shrink-0 transition cursor-pointer"
          >
            Heal Now
          </button>
        </div>
      )}
    </div>
  );
};
