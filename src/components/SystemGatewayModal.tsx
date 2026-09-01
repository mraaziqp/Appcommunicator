import React, { useState } from 'react';
import { 
  Server, Shield, Key, Cpu, HardDrive, Activity, 
  RefreshCw, Check, Copy, Trash2, Plus, Terminal,
  CheckCircle2, AlertTriangle, Lock, Eye, EyeOff, X,
  Layers, Globe, Database, Sparkles, Box
} from 'lucide-react';
import { useRegistry } from '../context/RegistryContext';
import { GatewayToken, SystemSecretItem } from '../types';

export const SystemGatewayModal: React.FC = () => {
  const { 
    isGatewayModalOpen, 
    setIsGatewayModalOpen,
    gatewayTokens,
    generateGatewayToken,
    revokeGatewayToken,
    systemHealth,
    refreshSystemHealth
  } = useRegistry();

  const [activeTab, setActiveTab] = useState<'gateway' | 'containers' | 'secrets' | 'deploy'>('gateway');
  const [newTokenName, setNewTokenName] = useState('');
  const [newTokenScope, setNewTokenScope] = useState('registry:read,registry:write');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});

  if (!isGatewayModalOpen) return null;

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTokenName.trim()) return;
    generateGatewayToken(newTokenName, newTokenScope.split(',').map((s) => s.trim()));
    setNewTokenName('');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshSystemHealth();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const toggleSecret = (key: string) => {
    setRevealedSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 h-svh w-screen z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200 transform-gpu">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[min(90svh,800px)] h-[min(90svh,800px)] flex flex-col shadow-2xl overflow-hidden font-sans transform-gpu">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-zinc-100 font-mono tracking-tight">
                  System Operations, API Gateway &amp; Secrets Vault
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                  HEALTHY
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Decentralized bearer credentials, container orchestration, pgvector telemetry, and deployment gateway.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsGatewayModalOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2.5 bg-zinc-950 border-b border-zinc-800/80 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'gateway', label: '1. API Gateway Tokens', icon: Key },
              { id: 'containers', label: '2. Container Cluster & DB', icon: Activity },
              { id: 'secrets', label: '3. Secrets & Environment Vault', icon: Lock },
              { id: 'deploy', label: '4. Docker Compose & Monorepo', icon: Terminal },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-zinc-800 text-emerald-300 font-semibold border border-zinc-700'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-zinc-100 text-xs transition cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: API GATEWAY TOKENS */}
          {activeTab === 'gateway' && (
            <div className="space-y-5 font-mono text-xs">
              {/* Token Creation Form */}
              <form onSubmit={handleCreateToken} className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-3">
                <div className="font-semibold text-zinc-200 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Provision New Satellite App Bearer Token</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  <div className="sm:col-span-6">
                    <input
                      value={newTokenName}
                      onChange={(e) => setNewTokenName(e.target.value)}
                      placeholder="App Name (e.g., Satellite-Mobile-IOS)"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <select
                      value={newTokenScope}
                      onChange={(e) => setNewTokenScope(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-2 text-zinc-100"
                    >
                      <option value="registry:read,registry:write">Full (Read + Write + Sandbox)</option>
                      <option value="registry:read">Read Only (Registry Fetch)</option>
                      <option value="telemetry:stream">Telemetry Stream Only</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="w-full py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      <span>Create</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Active Tokens Roster */}
              <div className="space-y-2">
                <div className="text-zinc-400 text-xs font-semibold flex items-center justify-between">
                  <span>Active Gateway Bearer Tokens ({gatewayTokens.length}):</span>
                  <span className="text-[11px] text-zinc-500">Auto-authenticated by NGINX rate-limit zone</span>
                </div>

                <div className="space-y-2">
                  {gatewayTokens.map((token) => (
                    <div
                      key={token.id}
                      className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        token.status === 'active'
                          ? 'bg-zinc-900/40 border-zinc-800'
                          : 'bg-zinc-950/80 border-zinc-900 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-zinc-100">{token.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-emerald-400">
                            {token.status.toUpperCase()}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            Limit: {token.rateLimit}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-zinc-400">
                          <code className="text-zinc-300 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800/80">
                            {token.token.substring(0, 16)}••••••••••••••••
                          </code>
                          <span>Created {new Date(token.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => copyText(token.token, token.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center gap-1.5 transition cursor-pointer"
                        >
                          {copiedKey === token.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === token.id ? 'Copied' : 'Copy Bearer'}</span>
                        </button>
                        {token.status === 'active' && (
                          <button
                            onClick={() => revokeGatewayToken(token.id)}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/50 transition cursor-pointer"
                            title="Revoke Token"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTAINER CLUSTER & PGVECTOR TELEMETRY */}
          {activeTab === 'containers' && (
            <div className="space-y-4 font-mono text-xs">
              {/* Telemetry Metrics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                  <div className="text-zinc-400 text-[10px]">CLUSTER CPU USAGE</div>
                  <div className="text-lg font-bold text-zinc-100 mt-1">{systemHealth.cpuUsagePercent}%</div>
                  <div className="text-[10px] text-emerald-400">4 Cores Allocated</div>
                </div>

                <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                  <div className="text-zinc-400 text-[10px]">MEMORY (RAM)</div>
                  <div className="text-lg font-bold text-zinc-100 mt-1">{systemHealth.memoryUsageMb} MB</div>
                  <div className="text-[10px] text-zinc-400">of 4,096 MB Max</div>
                </div>

                <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                  <div className="text-zinc-400 text-[10px]">PGVECTOR LATENCY</div>
                  <div className="text-lg font-bold text-cyan-400 mt-1">{systemHealth.pgVectorLatencyMs} ms</div>
                  <div className="text-[10px] text-emerald-400">IVFFlat Index Ready</div>
                </div>

                <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                  <div className="text-zinc-400 text-[10px]">EPHEMERAL SANDBOXES</div>
                  <div className="text-lg font-bold text-amber-400 mt-1">{systemHealth.activeSandboxes} Active</div>
                  <div className="text-[10px] text-zinc-400">Vitest Runner Ready</div>
                </div>
              </div>

              {/* Docker Containers Table */}
              <div className="space-y-2">
                <div className="text-zinc-400 text-xs font-semibold">
                  Docker Compose Orchestrated Services:
                </div>
                <div className="space-y-2">
                  {systemHealth.containers.map((c) => (
                    <div
                      key={c.name}
                      className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                        <div>
                          <div className="font-bold text-zinc-100">{c.name}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">{c.image}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-zinc-400">
                        <span className="hidden sm:inline">Ports: {c.ports}</span>
                        <span className="text-emerald-400 font-semibold">{c.status.toUpperCase()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SECRETS & ENVIRONMENT VAULT */}
          {activeTab === 'secrets' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="text-zinc-400 text-xs font-semibold flex items-center justify-between">
                <span>Decentralized Environment Secrets:</span>
                <span className="text-[10px] text-emerald-400">Zero plain-text client exposure</span>
              </div>

              <div className="space-y-2">
                {systemHealth.secrets.map((sec) => {
                  const isRevealed = !!revealedSecrets[sec.key];
                  return (
                    <div
                      key={sec.key}
                      className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-800 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5 text-amber-400" />
                          <span className="font-bold text-zinc-100">{sec.key}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                            SET
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">
                          {sec.description}
                        </div>
                        <div className="mt-1 text-[11px] text-zinc-300">
                          <code>{isRevealed ? sec.preview : '••••••••••••••••••••••••••••'}</code>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => toggleSecret(sec.key)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition cursor-pointer"
                          title={isRevealed ? 'Hide Secret' : 'Reveal Secret'}
                        >
                          {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => copyText(sec.preview, sec.key)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition cursor-pointer"
                          title="Copy Masked Key"
                        >
                          {copiedKey === sec.key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: DOCKER COMPOSE & MONOREPO DEPLOY */}
          {activeTab === 'deploy' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-2">
                <div className="text-zinc-200 font-bold flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>Production Monorepo Launch Commands</span>
                </div>
                <p className="text-[11px] text-zinc-400 font-sans">
                  Execute these commands on your bare-metal server or Cloud Run container to spin up the entire cluster:
                </p>

                <div className="relative mt-2">
                  <pre className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-zinc-300 overflow-x-auto text-[11px]">
{`# 1. Build and package CLI distribution binary
npm run build:cli

# 2. Launch production multi-container mesh with pgvector
docker-compose -f deploy/docker-compose.yml up -d --build

# 3. Verify container health status
docker-compose -f deploy/docker-compose.yml ps`}
                  </pre>
                  <button
                    onClick={() => copyText(`npm run build:cli\ndocker-compose -f deploy/docker-compose.yml up -d --build`, 'deploy-cmd')}
                    className="absolute top-2.5 right-2.5 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'deploy-cmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              {/* Deployment Logs Stream */}
              <div className="space-y-2">
                <div className="text-zinc-400 text-xs font-semibold">
                  Recent Deployment &amp; Gateway Logs:
                </div>
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-[11px] text-zinc-400 space-y-1 max-h-[160px] overflow-y-auto">
                  {systemHealth.recentLogs.map((log, i) => (
                    <div key={i} className="leading-relaxed">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Gateway Uptime: {systemHealth.gatewayUptime}</span>
          </div>
          <button
            onClick={() => setIsGatewayModalOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition cursor-pointer"
          >
            Close Gateway Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
