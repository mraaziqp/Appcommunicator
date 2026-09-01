import React, { useState } from 'react';
import { 
  Play, Square, RotateCcw, Sliders, Terminal as TerminalIcon, 
  Maximize2, Minimize2, ExternalLink, Cpu, HardDrive, 
  Wifi, Sparkles, Check, ChevronDown, ChevronUp, Layers, Activity,
  SlidersHorizontal, CheckCircle2, RotateCw, PlayCircle, Palette, Wrench,
  Image as ImageIcon
} from 'lucide-react';
import { useRegistry } from '../context/RegistryContext';
import { ThemeTokenizerBar } from './ThemeTokenizerBar';
import { SelfHealingInspector } from './SelfHealingInspector';
import { VisionToCodeTab } from './VisionToCodeTab';

export const LiveSandbox: React.FC = () => {
  const { 
    activeComponent, 
    componentProps, 
    updateComponentProp, 
    resetComponentProps,
    sandboxSession,
    isStartingSandbox,
    restartSandbox,
    stopSandbox,
    executeTerminalCommand,
    clearTerminalLogs,
    sandboxMode,
    setSandboxMode,
    currentTheme,
    isVisionTabActive,
    setIsVisionTabActive
  } = useRegistry();

  const [showPropsPanel, setShowPropsPanel] = useState(true);
  const [showThemeBar, setShowThemeBar] = useState(true);
  const [showSelfHealing, setShowSelfHealing] = useState(true);
  const [terminalExpanded, setTerminalExpanded] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [streamFilter, setStreamFilter] = useState<'all' | 'stdout' | 'system'>('all');

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    executeTerminalCommand(terminalInput);
    setTerminalInput('');
  };

  const filteredLogs = sandboxSession.logs.filter((l) => {
    if (streamFilter === 'all') return true;
    return l.stream === streamFilter;
  });

  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-hidden relative select-none">
      {/* Top Sandbox Header */}
      <div className="h-11 border-b border-zinc-800/80 bg-zinc-950/80 px-3.5 flex items-center justify-between gap-2 z-10 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            <span className="font-semibold text-zinc-100">{activeComponent.metadata.name}</span>
          </div>

          <span className="text-[10px] font-mono font-semibold tracking-wider text-zinc-400 uppercase bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 hidden sm:inline-block">
            {activeComponent.metadata.category}
          </span>

          <div className="hidden md:flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-[11px] font-mono text-zinc-400">
            <button
              onClick={() => setSandboxMode('interactive')}
              className={`px-2.5 py-0.5 rounded-md transition cursor-pointer ${
                sandboxMode === 'interactive'
                  ? 'bg-zinc-800 text-cyan-300 font-semibold shadow-sm'
                  : 'hover:text-zinc-200'
              }`}
            >
              Interactive Preview
            </button>
            <button
              onClick={() => setSandboxMode('iframe-remote')}
              className={`px-2.5 py-0.5 rounded-md transition cursor-pointer ${
                sandboxMode === 'iframe-remote'
                  ? 'bg-zinc-800 text-cyan-300 font-semibold shadow-sm'
                  : 'hover:text-zinc-200'
              }`}
            >
              Container Iframe
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Phase 5: Vision-to-Code Dropzone Toggle */}
          <button
            onClick={() => setIsVisionTabActive(!isVisionTabActive)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono border transition cursor-pointer ${
              isVisionTabActive
                ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-emerald-300'
            }`}
            title="Open Multi-Modal Vision Screenshot to Component Generator"
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Vision Gen</span>
          </button>

          {/* Theme Tokenizer Toggle */}
          <button
            onClick={() => setShowThemeBar(!showThemeBar)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono border transition cursor-pointer ${
              showThemeBar
                ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
            title="Toggle Dynamic Theme Tokenizer"
          >
            <Palette className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Theme</span>
          </button>

          {/* Self-Healing Diagnostic Toggle */}
          <button
            onClick={() => setShowSelfHealing(!showSelfHealing)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono border transition cursor-pointer ${
              showSelfHealing
                ? 'bg-zinc-800 border-zinc-700 text-amber-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
            title="Toggle Autonomous Self-Healing & Triage"
          >
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Triage</span>
          </button>

          {/* Prop Controls Trigger */}
          {activeComponent.propControls.length > 0 && (
            <button
              onClick={() => setShowPropsPanel(!showPropsPanel)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono border transition cursor-pointer ${
                showPropsPanel 
                  ? 'bg-cyan-950/80 border-cyan-700/60 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
              title="Toggle Dynamic Prop Mutator Drawer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Controls ({activeComponent.propControls.length})</span>
            </button>
          )}

          {/* Sandbox Lifecycle Controls */}
          <button
            onClick={restartSandbox}
            disabled={isStartingSandbox}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 transition hover:border-zinc-700 disabled:opacity-50 cursor-pointer"
            title="Restart Isolated Sandbox Container"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isStartingSandbox ? 'animate-spin text-cyan-400' : ''}`} />
            <span className="hidden sm:inline">Reboot</span>
          </button>
        </div>
      </div>

      {/* Dynamic Theme Tokenizer Bar (Phase 4) */}
      {showThemeBar && !isVisionTabActive && <ThemeTokenizerBar />}

      {/* Autonomous Self-Healing & Triage Inspector Bar (Phase 4) */}
      {showSelfHealing && !isVisionTabActive && <SelfHealingInspector />}

      {/* Phase 5: Vision-to-Component Synthesizer View */}
      {isVisionTabActive ? (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-start items-center relative workbench-dot-matrix">
          <div className="w-full max-w-5xl">
            <VisionToCodeTab onClose={() => setIsVisionTabActive(false)} />
          </div>
        </div>
      ) : (
        /* Main Sandbox Interactive Area */
        <div className={`flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col justify-between items-center relative workbench-dot-matrix @container transform-gpu ${currentTheme.fontFamily}`}>
        {/* Dynamic Prop Mutation Drawer (when toggled) */}

        {showPropsPanel && activeComponent.propControls.length > 0 && (
          <div className="w-full max-w-2xl mb-4 p-3.5 rounded-xl border border-zinc-800/90 bg-zinc-950/90 backdrop-blur-xl shadow-2xl z-10 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 mb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold text-zinc-200">INTERACTIVE PROP MUTATOR</span>
                <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
                  (Changes reflect live in preview &amp; source code)
                </span>
              </div>
              <button
                onClick={resetComponentProps}
                className="text-[10px] font-mono text-zinc-400 hover:text-cyan-300 transition flex items-center gap-1 cursor-pointer"
              >
                <RotateCw className="w-3 h-3" />
                <span>Reset Defaults</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {activeComponent.propControls.map((ctrl) => {
                const val = componentProps[ctrl.name] !== undefined ? componentProps[ctrl.name] : ctrl.defaultValue;
                return (
                  <div key={ctrl.name} className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/70 flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono text-zinc-400 flex justify-between items-center">
                      <span className="text-zinc-300 font-medium">{ctrl.label}</span>
                      {ctrl.type === 'number' && (
                        <span className="text-cyan-400 font-mono text-[10px] bg-cyan-950/60 border border-cyan-800/50 px-1.5 py-0.2 rounded">
                          {val}
                        </span>
                      )}
                    </label>

                    {ctrl.type === 'boolean' && (
                      <button
                        onClick={() => updateComponentProp(ctrl.name, !val)}
                        className={`py-1.5 px-3 rounded-lg border text-xs font-mono flex items-center justify-between transition cursor-pointer ${
                          val 
                            ? 'bg-cyan-950/60 border-cyan-800/60 text-cyan-300 font-semibold shadow-[0_0_10px_rgba(6,182,212,0.15)]' 
                            : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-400'
                        }`}
                      >
                        <span className="text-[11px]">{ctrl.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${val ? 'bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.9)]' : 'bg-zinc-700'}`} />
                          <span className="text-[10px]">{val ? 'TRUE' : 'FALSE'}</span>
                        </div>
                      </button>
                    )}

                    {ctrl.type === 'select' && (
                      <div className="flex items-center gap-1 flex-wrap">
                        {ctrl.options?.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => updateComponentProp(ctrl.name, opt)}
                            className={`px-2 py-1 rounded-md text-[10px] font-mono border transition cursor-pointer ${
                              val === opt
                                ? 'bg-cyan-950/80 border-cyan-700/80 text-cyan-300 font-semibold'
                                : 'bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {ctrl.type === 'number' && (
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="range"
                          min={ctrl.min || 0}
                          max={ctrl.max || 100}
                          step={ctrl.step || 1}
                          value={val}
                          onChange={(e) => updateComponentProp(ctrl.name, parseFloat(e.target.value))}
                          className="w-full accent-cyan-400 bg-zinc-800 cursor-pointer h-1.5 rounded-lg"
                        />
                      </div>
                    )}

                    {ctrl.type === 'string' && (
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => updateComponentProp(ctrl.name, e.target.value)}
                        className="bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-zinc-200 outline-none focus:border-cyan-500 font-mono"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Viewport Render Frame with @container Query Wrapper */}
        <div className="@container w-full flex-1 flex items-center justify-center relative z-0 min-h-[280px]">
          {sandboxMode === 'interactive' ? (
            <div className="w-full flex items-center justify-center p-2">
              {activeComponent.renderComponent(componentProps)}
            </div>
          ) : (
            /* Remote Container (Iframe) Placeholder Representation */
            <div className="w-full max-w-xl h-80 rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 flex flex-col justify-between shadow-2xl relative overflow-hidden backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
                <div className="flex items-center gap-2 font-mono text-xs text-zinc-300">
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>Remote Docker Sandbox (Port 3000)</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-semibold">
                  CONTAINERIZED
                </span>
              </div>

              <div className="my-auto text-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 mx-auto flex items-center justify-center text-cyan-400 shadow-inner">
                  <Layers className="w-6 h-6 animate-spin" />
                </div>
                <div className="text-sm font-semibold text-zinc-200">
                  Live Container Bridge Active
                </div>
                <p className="text-xs text-zinc-500 font-mono max-w-md mx-auto">
                  Isolated ephemeral container session <span className="text-cyan-400">{sandboxSession.sessionId}</span> streaming telemetry via WebSocket socket.io bridge.
                </p>
              </div>

              <div className="border-t border-zinc-800/80 pt-2.5 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>cgroup: node-isolated-sandbox</span>
                <span className="text-emerald-400">0.0.0.0:3000/preview</span>
              </div>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Integrated Terminal (xterm.js integration) */}
      <div 
        className={`border-t border-zinc-800/90 bg-zinc-950 flex flex-col transition-all duration-200 z-10 ${
          terminalExpanded ? 'h-72' : 'h-36'
        }`}
      >
        {/* Terminal Header */}
        <div className="h-8 border-b border-zinc-800/60 bg-zinc-900/60 px-3 flex items-center justify-between text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-zinc-300 font-medium">xterm.js Telemetry Terminal</span>
            <span className="text-[10px] text-zinc-600">|</span>
            <span className="text-[10px] text-emerald-400 font-semibold">LIVE (ws:3000)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => executeTerminalCommand('npm test')}
              className="text-[10px] text-zinc-400 hover:text-cyan-300 transition cursor-pointer"
              title="Run Component Test Suite"
            >
              npm test
            </button>
            <button
              onClick={clearTerminalLogs}
              className="text-[10px] hover:text-zinc-200 transition cursor-pointer"
              title="Clear Terminal Buffer"
            >
              Clear
            </button>
            <button
              onClick={() => setTerminalExpanded(!terminalExpanded)}
              className="p-1 hover:text-zinc-200 transition cursor-pointer"
              title={terminalExpanded ? 'Minimize Terminal' : 'Expand Terminal'}
            >
              {terminalExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Terminal Logs Window */}
        <div className="flex-1 overflow-y-auto p-2.5 font-mono text-[11px] space-y-1 bg-black/80 text-zinc-300 select-text">
          {filteredLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 leading-relaxed">
              <span className="text-zinc-600 text-[10px] shrink-0">{log.timestamp}</span>
              <span
                className={`whitespace-pre-wrap ${
                  log.stream === 'system'
                    ? 'text-cyan-400'
                    : log.stream === 'stderr'
                    ? 'text-rose-400'
                    : 'text-zinc-200'
                }`}
              >
                {log.message}
              </span>
            </div>
          ))}
        </div>

        {/* Terminal Interactive Input */}
        <form onSubmit={handleTerminalSubmit} className="h-8 border-t border-zinc-800/80 bg-zinc-950 px-2.5 flex items-center gap-2 font-mono text-xs">
          <span className="text-cyan-400 font-bold">$</span>
          <input
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            placeholder="Type 'help', 'npm test', 'docker ps', 'status'..."
            className="flex-1 bg-transparent border-none outline-none text-zinc-200 text-xs placeholder:text-zinc-600 font-mono"
          />
        </form>
      </div>
    </div>
  );
};
