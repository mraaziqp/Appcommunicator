import React, { useState, useEffect } from 'react';
import { 
  Zap, X, Play, RefreshCw, GitPullRequest, Mail, Terminal, CheckCircle2, 
  Clock, AlertCircle, ChevronDown, ChevronRight, ExternalLink, ArrowRight,
  ShieldCheck, Cpu, Filter, Send
} from 'lucide-react';
import { useRegistry } from '../context/RegistryContext';
import { AgentTask, ExecutionMode } from '../types';

export function ActionQueueDrawer() {
  const {
    isActionQueueOpen,
    setIsActionQueueOpen,
    agentTasks,
    fetchAgentTasks,
    triggerAgentTask,
    activeComponent,
  } = useRegistry();

  const [filterMode, setFilterMode] = useState<string>('all');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [isTriggerMenuOpen, setIsTriggerMenuOpen] = useState(false);

  useEffect(() => {
    if (isActionQueueOpen) {
      fetchAgentTasks();
      const interval = setInterval(fetchAgentTasks, 3000);
      return () => clearInterval(interval);
    }
  }, [isActionQueueOpen, fetchAgentTasks]);

  if (!isActionQueueOpen) return null;

  const filteredTasks = agentTasks.filter((task) => {
    if (filterMode === 'all') return true;
    return task.status === filterMode;
  });

  const getModeBadge = (mode: ExecutionMode) => {
    switch (mode) {
      case 'EXECUTE_CODE_PATCH':
        return (
          <span className="px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-[10px] font-mono text-blue-300 flex items-center gap-1 font-semibold">
            <GitPullRequest className="w-3 h-3" />
            <span>Code Patch</span>
          </span>
        );
      case 'EXECUTE_COMMS_DRAFT':
        return (
          <span className="px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-[10px] font-mono text-purple-300 flex items-center gap-1 font-semibold">
            <Mail className="w-3 h-3" />
            <span>Comms Draft</span>
          </span>
        );
      case 'EXECUTE_SANDBOX_RUN':
        return (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-300 flex items-center gap-1 font-semibold">
            <Terminal className="w-3 h-3" />
            <span>Sandbox Run</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: AgentTask['status']) => {
    switch (status) {
      case 'running':
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono text-amber-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Running</span>
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Completed</span>
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-[10px] font-mono text-rose-300 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>Failed</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-mono">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 h-svh w-screen z-50 flex justify-end bg-zinc-950/70 backdrop-blur-sm animate-in fade-in duration-150 transform-gpu">
      <div className="w-full max-w-xl bg-zinc-900 border-l border-zinc-800 h-full max-h-[100svh] shadow-2xl flex flex-col transform-gpu animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-zinc-100 font-mono">Autonomous Action Engine</h2>
                <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 text-[10px] font-mono">
                  {agentTasks.length} Tasks
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Agentic code patching, email drafts, and container test pipelines</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchAgentTasks()}
              title="Refresh Task Queue"
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsActionQueueOpen(false)}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Controls & Filter Bar */}
        <div className="p-3 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between gap-2">
          {/* Filter Pills */}
          <div className="flex items-center gap-1 text-xs font-mono">
            {['all', 'running', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterMode(f)}
                className={`px-2.5 py-1 rounded-lg capitalize transition ${
                  filterMode === f
                    ? 'bg-zinc-700 text-zinc-100 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Trigger Task Button */}
          <div className="relative">
            <button
              onClick={() => setIsTriggerMenuOpen((prev) => !prev)}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono flex items-center gap-1.5 font-semibold transition"
            >
              <Play className="w-3.5 h-3.5 fill-cyan-400" />
              <span>Dispatch Action</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {isTriggerMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl p-1.5 z-20 space-y-1 text-xs font-mono animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    setIsTriggerMenuOpen(false);
                    triggerAgentTask('EXECUTE_CODE_PATCH', activeComponent.metadata.slug, `Auto-Patch Rate Limiter: ${activeComponent.metadata.name}`);
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-zinc-800/80 text-zinc-200 flex items-center gap-2"
                >
                  <GitPullRequest className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <div className="font-semibold">Code Patch PR</div>
                    <div className="text-[10px] text-zinc-400">Creates PR branch with optimizations</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsTriggerMenuOpen(false);
                    triggerAgentTask('EXECUTE_COMMS_DRAFT', 'security-triage', `Draft Contextual Reply: Security Alert`);
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-zinc-800/80 text-zinc-200 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <div className="font-semibold">Comms Contextual Draft</div>
                    <div className="text-[10px] text-zinc-400">Synthesizes LLM reply for unread email</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsTriggerMenuOpen(false);
                    triggerAgentTask('EXECUTE_SANDBOX_RUN', activeComponent.metadata.slug, `Isolated Test Suite: ${activeComponent.metadata.name}`);
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-zinc-800/80 text-zinc-200 flex items-center gap-2"
                >
                  <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-semibold">Ephemeral Sandbox Test</div>
                    <div className="text-[10px] text-zinc-400">Runs full isolated Vitest test suite</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Task Cards List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {filteredTasks.length === 0 && (
            <div className="py-16 text-center space-y-2">
              <Clock className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-400 font-mono">No agent tasks in queue</p>
              <p className="text-[11px] text-zinc-500">Dispatch an action or approve an item in the Decision Matrix</p>
            </div>
          )}

          {filteredTasks.map((task) => {
            const isExpanded = expandedTaskId === task.id;
            return (
              <div 
                key={task.id}
                className="bg-zinc-950/70 border border-zinc-800 rounded-xl overflow-hidden shadow-sm transition hover:border-zinc-700"
              >
                {/* Task Header */}
                <div 
                  className="p-3 cursor-pointer flex items-start justify-between gap-2 select-none"
                  onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getModeBadge(task.mode)}
                      {getStatusBadge(task.status)}
                      <span className="text-[10px] font-mono text-zinc-500">
                        {new Date(task.startedAt).toLocaleTimeString()}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-zinc-100 font-mono truncate">
                      {task.title}
                    </h4>

                    {task.targetRef && (
                      <p className="text-[11px] font-mono text-zinc-400">
                        Target: <span className="text-cyan-400 font-semibold">{task.targetRef}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-zinc-300">{task.progress}%</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-zinc-400" />
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-zinc-800 h-1">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      task.status === 'completed' ? 'bg-emerald-500' :
                      task.status === 'failed' ? 'bg-rose-500' :
                      'bg-cyan-500 animate-pulse'
                    }`}
                    style={{ width: `${task.progress}%` }}
                  />
                </div>

                {/* Expanded Details & Logs */}
                {isExpanded && (
                  <div className="p-3 bg-zinc-900/60 border-t border-zinc-800/80 space-y-3 text-xs font-mono">
                    {/* Execution Logs */}
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase text-zinc-500 font-bold flex items-center gap-1">
                        <Terminal className="w-3 h-3 text-cyan-400" />
                        <span>Execution Steps ({task.logs.length})</span>
                      </div>
                      <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/70 space-y-1 max-h-36 overflow-y-auto font-mono text-[11px] scrollbar-thin">
                        {task.logs.map((log, lIdx) => (
                          <div key={lIdx} className="flex items-start gap-1.5 text-zinc-300">
                            <span className="text-zinc-600 select-none">›</span>
                            <span>{log}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Result Payload Preview */}
                    {task.resultPayload && (
                      <div className="space-y-1">
                        <div className="text-[10px] uppercase text-zinc-500 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Generated Artifact</span>
                        </div>
                        
                        {/* If Code Patch PR */}
                        {task.resultPayload.pullRequestUrl && (
                          <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-between">
                            <div>
                              <div className="text-blue-300 font-semibold">{task.resultPayload.branch}</div>
                              <div className="text-[10px] text-zinc-400">Created pull request ready for review</div>
                            </div>
                            <a
                              href={task.resultPayload.pullRequestUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded bg-blue-500 text-zinc-950 font-bold text-[10px] flex items-center gap-1 hover:bg-blue-400 transition"
                            >
                              <span>View PR</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}

                        {/* If Comms Draft */}
                        {task.resultPayload.draftBody && (
                          <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30 space-y-1.5">
                            <div className="flex items-center justify-between text-purple-300 font-semibold">
                              <span>Draft: {task.resultPayload.subject}</span>
                              <span className="text-[10px] text-zinc-400">To: {task.resultPayload.recipient}</span>
                            </div>
                            <p className="text-[11px] text-zinc-300 whitespace-pre-line bg-zinc-950/60 p-2 rounded border border-zinc-800">
                              {task.resultPayload.draftBody}
                            </p>
                            <div className="flex justify-end pt-1">
                              <button className="px-2.5 py-1 rounded bg-purple-500 hover:bg-purple-400 text-zinc-950 font-bold text-[10px] flex items-center gap-1">
                                <Send className="w-3 h-3" />
                                <span>Send Prepared Response</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* If Sandbox Run */}
                        {task.resultPayload.testsPassed !== undefined && (
                          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                            <div className="space-y-0.5">
                              <div className="text-emerald-300 font-semibold">Vitest Suite Passed (100%)</div>
                              <div className="text-[10px] text-zinc-400">
                                {task.resultPayload.testsPassed}/{task.resultPayload.totalTests} tests passed • {task.resultPayload.coverage}% coverage • {task.resultPayload.duration}
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                              PASS
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950 text-xs font-mono text-zinc-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Autonomous Execution v3.0</span>
          </div>
          <span>Satellite Orchestrator</span>
        </div>
      </div>
    </div>
  );
}
