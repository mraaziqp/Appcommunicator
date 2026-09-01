import React, { useState } from 'react';
import { 
  X, Radio, Server, Cpu, Database, RefreshCw, 
  Send, CheckCircle2, Copy, Check, Terminal, Zap, Shield, Layers,
  ArrowRight
} from 'lucide-react';
import { useRegistry } from '../context/RegistryContext';
import { DRIZZLE_SCHEMA_TS } from '../db/schema';

interface SecondBrainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecondBrainModal: React.FC<SecondBrainModalProps> = ({ isOpen, onClose }) => {
  const { 
    secondBrain, 
    triggerBrainSync, 
    recentWebhooks, 
    sendSimulatedWebhook,
    activeComponent,
    setIsEcosystemModalOpen
  } = useRegistry();


  const [activeTab, setActiveTab] = useState<'orchestrator' | 'webhooks' | 'drizzle-schema' | 'api-docs'>('orchestrator');
  const [testPayloadType, setTestPayloadType] = useState<'component.published' | 'sandbox.triggered' | 'telemetry.heartbeat'>('component.published');
  const [isSending, setIsSending] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  if (!isOpen) return null;

  const handleSendTestWebhook = async () => {
    setIsSending(true);
    await sendSimulatedWebhook(testPayloadType, {
      componentId: activeComponent.metadata.id,
      timestamp: new Date().toISOString(),
      triggeredBy: 'SecondBrainBridgeModal',
    });
    setTimeout(() => setIsSending(false), 500);
  };

  const sampleCurl = `curl -X POST http://localhost:3000/api/second-brain-webhook \\
  -H "Content-Type: application/json" \\
  -H "X-Second-Brain-Signature: sha256=sb_sig_88291" \\
  -d '{
    "eventType": "component.published",
    "source": "SecondBrainCore",
    "data": { "componentId": "${activeComponent.metadata.id}" }
  }'`;

  const copyCurl = () => {
    navigator.clipboard.writeText(sampleCurl);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="fixed inset-0 h-svh w-screen z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 transform-gpu select-none">
      <div className="w-full max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden flex flex-col max-h-[min(90svh,720px)] h-[min(90svh,720px)] text-zinc-100 font-sans transform-gpu">
        {/* Modal Header */}
        <div className="p-4 border-b border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-800/50 text-cyan-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-sm text-zinc-100">Second Brain Orchestrator Bridge</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                  CONNECTED
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-mono">Central Orchestration Satellite Hub</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Subtabs */}
        <div className="px-4 py-2 border-b border-zinc-800/80 bg-zinc-950 flex items-center gap-2 text-xs font-mono">
          {[
            { id: 'orchestrator', label: 'Telemetry & Bridge' },
            { id: 'webhooks', label: 'Webhook Stream' },
            { id: 'drizzle-schema', label: 'Drizzle ORM (Neon DB)' },
            { id: 'api-docs', label: 'API Scaffolding' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === tab.id
                  ? 'bg-zinc-800 text-cyan-300 font-semibold border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {activeTab === 'orchestrator' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/50">
                  <div className="text-[11px] font-mono text-zinc-500">ORCHESTRATOR URL</div>
                  <div className="text-xs font-mono text-cyan-400 mt-1 truncate">{secondBrain.orchestratorUrl}</div>
                </div>
                <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/50">
                  <div className="text-[11px] font-mono text-zinc-500">HEARTBEAT LATENCY</div>
                  <div className="text-xs font-mono text-emerald-400 mt-1">{secondBrain.pingMs} ms (Healthy)</div>
                </div>
                <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/50">
                  <div className="text-[11px] font-mono text-zinc-500">CORE VERSION</div>
                  <div className="text-xs font-mono text-zinc-300 mt-1">{secondBrain.brainVersion}</div>
                </div>
              </div>

              {/* Phase 2 Ecosystem Ingestion Hub Quick Access */}
              <div className="p-4 rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/40 to-indigo-950/40 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-cyan-300 font-mono">PHASE 2: JARVIS ECOSYSTEM INGESTION</span>
                    <span className="px-1.5 py-0.2 rounded bg-cyan-900/70 text-cyan-200 text-[10px] font-mono">ACTIVE</span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    Real-world M365 email triage, GitHub CI/CD webhooks, & Galaxy Watch 4 biometrics pipeline.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    setIsEcosystemModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold text-xs flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  <span>Open Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-3">
                <h4 className="text-xs font-semibold text-zinc-200 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Interactive Webhook Dispatcher</span>
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Trigger an incoming REST webhook event from the Second Brain central orchestrator to test the `/api/second-brain-webhook` and `/api/sandbox-init` ingest pipelines.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <select
                    value={testPayloadType}
                    onChange={(e) => setTestPayloadType(e.target.value as any)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-200 outline-none focus:border-cyan-500"
                  >
                    <option value="component.published">component.published</option>
                    <option value="sandbox.triggered">sandbox.triggered</option>
                    <option value="telemetry.heartbeat">telemetry.heartbeat</option>
                  </select>

                  <button
                    onClick={handleSendTestWebhook}
                    disabled={isSending}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold text-xs transition disabled:opacity-50"
                  >
                    <Send className={`w-3.5 h-3.5 ${isSending ? 'animate-bounce' : ''}`} />
                    <span>{isSending ? 'Dispatching...' : 'Dispatch Webhook'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'webhooks' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>RECENT DISPATCHED WEBHOOK EVENTS</span>
                <span>{recentWebhooks.length} recorded</span>
              </div>

              <div className="space-y-2">
                {recentWebhooks.map((evt) => (
                  <div key={evt.eventId} className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 font-mono text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-400 font-semibold">{evt.eventType}</span>
                      <span className="text-zinc-500 text-[10px]">{evt.timestamp}</span>
                    </div>
                    <div className="text-zinc-400 text-[11px]">Source: {evt.source}</div>
                    <pre className="p-2 rounded bg-black/60 text-zinc-300 text-[10px] overflow-x-auto">
                      {JSON.stringify(evt.data, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'drizzle-schema' && (
            <div className="space-y-2">
              <div className="text-xs text-zinc-400 flex items-center justify-between font-mono">
                <span>Drizzle ORM Schema (Neon PostgreSQL)</span>
                <span className="text-cyan-400">schema.ts</span>
              </div>
              <pre className="p-3.5 rounded-xl border border-zinc-800 bg-black/70 font-mono text-[11px] text-zinc-300 overflow-x-auto max-h-72">
                {DRIZZLE_SCHEMA_TS}
              </pre>
            </div>
          )}

          {activeTab === 'api-docs' && (
            <div className="space-y-4">
              <div className="text-xs text-zinc-400 font-mono">Core Backend Endpoints</div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px]">GET</span>
                    <span className="text-zinc-200">/api/components</span>
                  </div>
                  <p className="text-[11px] text-zinc-500">Returns list of all extracted components, code files, and dependency manifests.</p>
                </div>

                <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold text-[10px]">POST</span>
                    <span className="text-zinc-200">/api/sandbox-init</span>
                  </div>
                  <p className="text-[11px] text-zinc-500">Accepts container execution requests to spawn ephemeral node containers.</p>
                </div>

                <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-400 font-bold text-[10px]">POST</span>
                    <span className="text-zinc-200">/api/second-brain-webhook</span>
                  </div>
                  <p className="text-[11px] text-zinc-500">Receives and validates REST payloads from the central orchestrator.</p>
                </div>
              </div>

              {/* Sample Curl */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>SAMPLE WEBHOOK TRIGGER</span>
                  <button onClick={copyCurl} className="hover:text-cyan-300 flex items-center gap-1">
                    {copiedCurl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCurl ? 'Copied' : 'Copy cURL'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl border border-zinc-800 bg-black/80 font-mono text-[10px] text-zinc-300 overflow-x-auto">
                  {sampleCurl}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
