import React, { useState } from 'react';
import { 
  X, Activity, Mail, GitPullRequest, GitCommit, Heart, 
  Zap, ShieldAlert, CheckCircle2, Clock, Terminal, Copy, 
  Check, Send, RefreshCw, Layers, Sparkles, Filter, 
  Watch, Cpu, AlertTriangle, ArrowUpRight, Play, Database,
  TrendingUp, Moon, Compass, ChevronRight, UserCheck
} from 'lucide-react';
import { useRegistry } from '../context/RegistryContext';
import { EcosystemStreamType, EcosystemUrgency } from '../types';

export const JarvisEcosystemHub: React.FC = () => {
  const { 
    isEcosystemModalOpen, 
    setIsEcosystemModalOpen,
    ecosystemEvents,
    communications,
    githubCommits,
    githubPullRequests,
    lifestackTasks,
    biometrics,
    biometricsHistory,
    triggerCommunicationsWebhook,
    triggerGitHubWebhook,
    triggerLifeStackWebhook,
    triggerBiometricsIngest,
    handleDecisionAction,
    fetchEcosystemEvents,
    setIsActionQueueOpen,
  } = useRegistry();

  const [activeTab, setActiveTab] = useState<'decision-loop' | 'communications' | 'github-lifestack' | 'biometrics' | 'api-docs'>('decision-loop');
  const [streamFilter, setStreamFilter] = useState<EcosystemStreamType | 'all'>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<EcosystemUrgency | 'all'>('all');

  // Simulated Email Form State
  const [emailSubject, setEmailSubject] = useState('CRITICAL: Database connection pool exhaustion alert on cluster-02');
  const [emailSender, setEmailSender] = useState('devops-alerts@satellite.internal');
  const [emailSenderName, setEmailSenderName] = useState('Elena Rostova (Infra)');
  const [emailBody, setEmailBody] = useState('URGENT: Connection pool reached 98% capacity on replica node. Immediate action required to scale PgBouncer max connections.\n- Verify active query locks\n- Increase pool capacity to 500');
  const [emailProvider, setEmailProvider] = useState<'m365_graph' | 'imap'>('m365_graph');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Simulated Biometrics Slider State
  const [simHeartRate, setSimHeartRate] = useState(78);
  const [simStressIndex, setSimStressIndex] = useState(42);
  const [simSleepScore, setSimSleepScore] = useState(88);
  const [isInjectingBio, setIsInjectingBio] = useState(false);

  // Copy Curl State
  const [copiedCurl, setCopiedCurl] = useState<string | null>(null);

  if (!isEcosystemModalOpen) return null;

  const filteredEvents = ecosystemEvents.filter((evt) => {
    if (streamFilter !== 'all' && evt.streamType !== streamFilter) return false;
    if (urgencyFilter !== 'all' && evt.urgency !== urgencyFilter) return false;
    return true;
  });

  const handleSendEmailWebhook = async () => {
    setIsSendingEmail(true);
    await triggerCommunicationsWebhook({
      provider: emailProvider,
      senderName: emailSenderName,
      senderEmail: emailSender,
      subject: emailSubject,
      body: emailBody,
    });
    setIsSendingEmail(false);
  };

  const handleInjectBiometrics = async () => {
    setIsInjectingBio(true);
    await triggerBiometricsIngest({
      heartRateBpm: simHeartRate,
      stressIndex: simStressIndex,
      sleepScore: simSleepScore,
      deepSleepMin: Math.round(simSleepScore * 1.2),
      remSleepMin: Math.round(simSleepScore * 1.3),
      lightSleepMin: 220,
      awakeMin: 25,
      spo2Percent: 99,
      hrvMs: Math.max(25, 90 - simStressIndex),
      stepCount: 8940,
    });
    setIsInjectingBio(false);
  };

  const handleSimulateCiFailure = async () => {
    await triggerGitHubWebhook({
      eventType: 'pull_request',
      repo: 'second-brain/satellite-portal',
      branch: 'feature/quantum-passkey-fido2',
      author: 'dev-alex',
      message: 'fix: align WebAuthn challenge with FIDO2 spec',
      ciStatus: 'failure',
      prNumber: 53,
      prTitle: 'PR #53: Hardware WebAuthn Authenticator integration',
    });
  };

  const handleSimulateCiPass = async () => {
    await triggerGitHubWebhook({
      eventType: 'push',
      repo: 'second-brain/satellite-portal',
      branch: 'main',
      author: 'Alex Mercer',
      message: 'chore: deploy v2.5.0 containerized runtime bundle',
      ciStatus: 'success',
    });
  };

  const handleCopyCurl = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCurl(id);
    setTimeout(() => setCopiedCurl(null), 2000);
  };

  const curlBiometrics = `curl -X POST http://localhost:3000/api/jarvis/biometrics \\
  -H "Content-Type: application/json" \\
  -d '{
    "heartRateBpm": 74,
    "stressIndex": 38,
    "sleepScore": 88,
    "spo2Percent": 99,
    "hrvMs": 58,
    "deviceModel": "Samsung Galaxy Watch 4 Classic (SM-R890)"
  }'`;

  const curlComms = `curl -X POST http://localhost:3000/api/jarvis/webhooks/communications \\
  -H "Content-Type: application/json" \\
  -d '{
    "provider": "m365_graph",
    "senderName": "Elena Rostova",
    "senderEmail": "elena.rostova@satellite.internal",
    "subject": "URGENT: Production SSL renewal required",
    "body": "Certbot acme challenge failed for api-auth.satellite.io. Expires in 4 hours."
  }'`;

  const curlGithub = `curl -X POST http://localhost:3000/api/jarvis/webhooks/github \\
  -H "Content-Type: application/json" \\
  -d '{
    "eventType": "pull_request",
    "repo": "second-brain/satellite-portal",
    "branch": "main",
    "ciStatus": "success",
    "prNumber": 52
  }'`;

  return (
    <div className="fixed inset-0 h-svh w-screen z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 select-none transform-gpu">
      <div className="w-full max-w-5xl rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-cyan-950/20 overflow-hidden flex flex-col max-h-[min(92svh,860px)] h-[min(92svh,860px)] text-zinc-100 font-sans transform-gpu">
        
        {/* Hub Header */}
        <div className="p-4 border-b border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 border border-cyan-500/40 text-zinc-950 font-bold shadow-[0_0_16px_rgba(6,182,212,0.35)]">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-bold text-sm text-zinc-100 tracking-tight">Jarvis Ecosystem Ingestion & Proactive Decision Hub</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800/80 font-semibold shadow-sm">
                  PHASE 2 • LIVE INGESTION
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                Real-world communications, GitHub CI/CD, and Galaxy Watch 4 biometrics pipeline
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchEcosystemEvents}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
              title="Refresh Ecosystem Events"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsEcosystemModalOpen(false)}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stream Status Telemetry Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-4 py-2.5 border-b border-zinc-800/80 bg-zinc-950 font-mono text-xs">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
            <Mail className="w-4 h-4 text-cyan-400" />
            <div className="truncate">
              <div className="text-[10px] text-zinc-500 uppercase">M365 / IMAP</div>
              <div className="text-zinc-200 font-semibold">{communications.length} Ingested</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
            <GitPullRequest className="w-4 h-4 text-purple-400" />
            <div className="truncate">
              <div className="text-[10px] text-zinc-500 uppercase">GitHub / LifeStack</div>
              <div className="text-zinc-200 font-semibold">{githubCommits.length} commits • {lifestackTasks.length} tasks</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
            <Watch className="w-4 h-4 text-rose-400" />
            <div className="truncate">
              <div className="text-[10px] text-zinc-500 uppercase">Galaxy Watch 4</div>
              <div className="text-zinc-200 font-semibold">{biometrics?.heartRateBpm || 72} BPM • Stress {biometrics?.stressIndex || 32}/100</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
            <Activity className="w-4 h-4 text-emerald-400" />
            <div className="truncate">
              <div className="text-[10px] text-zinc-500 uppercase">Decision Loop</div>
              <div className="text-emerald-400 font-semibold">Active & Autonomous</div>
            </div>
          </div>
        </div>

        {/* Hub Navigation Sub-Tabs */}
        <div className="px-4 py-2 border-b border-zinc-800/80 bg-zinc-900/40 flex items-center justify-between overflow-x-auto no-scrollbar gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'decision-loop', label: 'Proactive Decision Matrix', icon: <Zap className="w-3.5 h-3.5 text-cyan-400" /> },
              { id: 'communications', label: 'Communications Stream (M365 / IMAP)', icon: <Mail className="w-3.5 h-3.5 text-blue-400" /> },
              { id: 'github-lifestack', label: 'GitHub & LifeStack Pipeline', icon: <GitPullRequest className="w-3.5 h-3.5 text-purple-400" /> },
              { id: 'biometrics', label: 'Galaxy Watch 4 Biometrics', icon: <Heart className="w-3.5 h-3.5 text-rose-400" /> },
              { id: 'api-docs', label: 'Ecosystem API & Drizzle DB', icon: <Database className="w-3.5 h-3.5 text-amber-400" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-zinc-800 text-cyan-300 font-semibold border border-zinc-700 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Proactive Decision Matrix & Event Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {activeTab === 'decision-loop' && (
            <div className="space-y-4">
              {/* Filter Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <Filter className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-zinc-400">Stream Filter:</span>
                  <select
                    value={streamFilter}
                    onChange={(e) => setStreamFilter(e.target.value as any)}
                    className="bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1 text-xs font-mono text-zinc-200 outline-none focus:border-cyan-500"
                  >
                    <option value="all">All Streams ({ecosystemEvents.length})</option>
                    <option value="communications">Communications</option>
                    <option value="github_lifestack">GitHub & LifeStack</option>
                    <option value="biometrics">Galaxy Watch 4</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-zinc-400">Urgency:</span>
                  <select
                    value={urgencyFilter}
                    onChange={(e) => setUrgencyFilter(e.target.value as any)}
                    className="bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1 text-xs font-mono text-zinc-200 outline-none focus:border-cyan-500"
                  >
                    <option value="all">All Urgencies</option>
                    <option value="critical">Critical</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
              </div>

              {/* Event Timeline Cards */}
              <div className="space-y-3">
                {filteredEvents.length === 0 ? (
                  <div className="p-8 text-center border border-zinc-800 rounded-xl font-mono text-xs text-zinc-500">
                    No ecosystem events match the selected filters. Trigger an incoming webhook to test!
                  </div>
                ) : (
                  filteredEvents.map((evt) => {
                    const isUrgent = evt.urgency === 'critical' || evt.urgency === 'urgent' || evt.urgency === 'high';
                    const isExecuted = evt.decisionLoopAction.actionStatus === 'executed';

                    return (
                      <div
                        key={evt.id}
                        className={`p-4 rounded-xl border transition space-y-3 ${
                          isUrgent
                            ? 'border-amber-500/40 bg-amber-950/10'
                            : 'border-zinc-800 bg-zinc-900/40'
                        }`}
                      >
                        {/* Card Header */}
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {evt.streamType === 'communications' && <Mail className="w-4 h-4 text-cyan-400 shrink-0" />}
                            {evt.streamType === 'github_lifestack' && <GitPullRequest className="w-4 h-4 text-purple-400 shrink-0" />}
                            {evt.streamType === 'biometrics' && <Heart className="w-4 h-4 text-rose-400 shrink-0" />}
                            
                            <h3 className="text-xs font-semibold text-zinc-200">{evt.title}</h3>
                          </div>

                          <div className="flex items-center gap-1.5 font-mono text-[10px]">
                            <span className={`px-2 py-0.5 rounded border uppercase font-semibold ${
                              evt.urgency === 'critical' ? 'bg-red-950 text-red-400 border-red-800' :
                              evt.urgency === 'urgent' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                              evt.urgency === 'high' ? 'bg-orange-950 text-orange-400 border-orange-800' :
                              'bg-zinc-800 text-zinc-300 border-zinc-700'
                            }`}>
                              {evt.urgency}
                            </span>
                            <span className="text-zinc-500">{new Date(evt.receivedAt).toLocaleTimeString()}</span>
                          </div>
                        </div>

                        {/* Summary */}
                        <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                          {evt.summary}
                        </p>

                        {/* Proactive Decision Loop Box */}
                        <div className="p-3 rounded-lg bg-black/50 border border-zinc-800 font-mono text-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Jarvis Proactive Decision</span>
                            </div>
                            <span className="text-[10px] text-zinc-400">
                              Confidence: {(evt.decisionLoopAction.confidence * 100).toFixed(0)}%
                            </span>
                          </div>

                          <div className="text-zinc-200 text-[11px] leading-normal font-sans">
                            <span className="font-semibold text-cyan-300">Action: </span>
                            {evt.decisionLoopAction.actionRecommended}
                          </div>

                          <div className="text-[10px] text-zinc-500 italic">
                            Rationale: {evt.decisionLoopAction.rationale}
                          </div>

                          {/* Decision Action Buttons */}
                          <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80">
                            <span className={`text-[10px] font-semibold uppercase ${
                              isExecuted ? 'text-emerald-400' : 'text-amber-400'
                            }`}>
                              Status: {evt.decisionLoopAction.actionStatus.replace('_', ' ')}
                            </span>

                            <div className="flex items-center gap-1.5">
                              {!isExecuted ? (
                                <>
                                  <button
                                    onClick={() => handleDecisionAction(evt.id, 'execute')}
                                    className="px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold text-[11px] transition cursor-pointer"
                                  >
                                    Execute Action
                                  </button>
                                  <button
                                    onClick={() => handleDecisionAction(evt.id, 'dismiss')}
                                    className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] transition cursor-pointer"
                                  >
                                    Dismiss
                                  </button>
                                </>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Action Executed</span>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setIsEcosystemModalOpen(false);
                                      setIsActionQueueOpen(true);
                                    }}
                                    className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-cyan-300 text-[10px] flex items-center gap-1 transition"
                                  >
                                    <Zap className="w-3 h-3 text-cyan-400" />
                                    <span>Inspect in Queue</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Communications Stream */}
          {activeTab === 'communications' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left: Email Stream List */}
                <div className="lg:col-span-2 space-y-3">
                  <div className="text-xs font-mono text-zinc-400 flex items-center justify-between">
                    <span>INGESTED MESSAGE THREADS (IMAP / M365 GRAPH)</span>
                    <span>{communications.length} total</span>
                  </div>

                  <div className="space-y-3">
                    {communications.map((c) => (
                      <div key={c.id} className={`p-3.5 rounded-xl border space-y-2.5 ${
                        c.isUrgent ? 'border-amber-500/40 bg-amber-950/15' : 'border-zinc-800 bg-zinc-900/40'
                      }`}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-zinc-100">{c.senderName}</span>
                              <span className="text-[10px] font-mono text-zinc-500">({c.senderEmail})</span>
                            </div>
                            <div className="text-xs font-bold text-cyan-300 mt-0.5">{c.subject}</div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-400 uppercase">
                              {c.provider}
                            </span>
                            {c.isUrgent && (
                              <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 text-[10px] font-mono font-bold">
                                URGENT
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-zinc-300 font-sans whitespace-pre-line leading-relaxed bg-black/40 p-2.5 rounded-lg border border-zinc-800/80">
                          {c.body}
                        </p>

                        {/* Extracted Action Items */}
                        {c.extractedActionItems && c.extractedActionItems.length > 0 && (
                          <div className="space-y-1">
                            <div className="text-[10px] font-mono text-zinc-400 uppercase">Extracted Action Items:</div>
                            <div className="space-y-1">
                              {c.extractedActionItems.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 text-xs text-amber-200 font-sans">
                                  <ChevronRight className="w-3 h-3 text-amber-400 shrink-0" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="p-2 rounded bg-cyan-950/30 border border-cyan-900/50 text-[11px] text-cyan-200 font-sans">
                          <span className="font-semibold text-cyan-400 font-mono text-[10px]">AI THREAD SUMMARY: </span>
                          {c.aiSummary}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Interactive Webhook Simulator */}
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-3 h-fit">
                  <h4 className="text-xs font-semibold text-zinc-100 flex items-center gap-2 font-mono">
                    <Send className="w-4 h-4 text-cyan-400" />
                    <span>Communications Ingestion Simulator</span>
                  </h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                    Post a raw payload to <code className="text-cyan-400 font-mono">/api/jarvis/webhooks/communications</code> to trigger AI parsing and urgency rating.
                  </p>

                  <div className="space-y-2.5 font-mono text-xs">
                    <div>
                      <label className="text-[10px] text-zinc-500">PROVIDER</label>
                      <select
                        value={emailProvider}
                        onChange={(e) => setEmailProvider(e.target.value as any)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-200"
                      >
                        <option value="m365_graph">Microsoft 365 Graph Webhook</option>
                        <option value="imap">IMAP Email Parser</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-zinc-500">SENDER NAME & EMAIL</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={emailSenderName}
                          onChange={(e) => setEmailSenderName(e.target.value)}
                          className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200"
                          placeholder="Sender Name"
                        />
                        <input
                          type="text"
                          value={emailSender}
                          onChange={(e) => setEmailSender(e.target.value)}
                          className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200"
                          placeholder="Email"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-zinc-500">SUBJECT LINE</label>
                      <input
                        type="text"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-200"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-zinc-500">EMAIL BODY</label>
                      <textarea
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        rows={4}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-200 font-sans"
                      />
                    </div>

                    <button
                      onClick={handleSendEmailWebhook}
                      disabled={isSendingEmail}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold text-xs transition cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSendingEmail ? 'Ingesting...' : 'Ingest Webhook Email'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: GitHub & LifeStack Pipeline */}
          {activeTab === 'github-lifestack' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* GitHub Active Stream */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <GitCommit className="w-4 h-4 text-cyan-400" />
                      <span>GITHUB ACTIVE COMMITS & PULL REQUESTS</span>
                    </span>
                    <span>{githubCommits.length} commits</span>
                  </div>

                  <div className="space-y-2">
                    {githubPullRequests.map((pr) => (
                      <div key={pr.id} className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-1.5 font-mono text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-purple-400 font-semibold">PR #{pr.number}: {pr.title}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                            pr.ciStatus === 'success' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                            pr.ciStatus === 'failure' ? 'bg-red-950 text-red-400 border border-red-800' :
                            'bg-zinc-800 text-zinc-400'
                          }`}>
                            CI: {pr.ciStatus}
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          Branch: {pr.branchSource} → {pr.branchTarget} • Author: {pr.author}
                        </div>
                      </div>
                    ))}

                    {githubCommits.map((c) => (
                      <div key={c.id} className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/30 font-mono text-xs flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="text-zinc-200 font-medium">{c.message}</div>
                          <div className="text-[10px] text-zinc-500">
                            {c.repo} ({c.branch}) • {c.author} • {new Date(c.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                          c.status === 'passed' ? 'text-emerald-400 bg-emerald-950/60' : 'text-red-400 bg-red-950/60'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Simulator buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={handleSimulateCiPass}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-emerald-400 transition cursor-pointer"
                    >
                      + Simulate CI Pass
                    </button>
                    <button
                      onClick={handleSimulateCiFailure}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-red-400 transition cursor-pointer"
                    >
                      + Simulate CI Failure
                    </button>
                  </div>
                </div>

                {/* LifeStack Task Sync */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-emerald-400" />
                      <span>LIFESTACK SPRINT FOCUS & TASKS</span>
                    </span>
                    <span>{lifestackTasks.length} active</span>
                  </div>

                  <div className="space-y-2">
                    {lifestackTasks.map((t) => (
                      <div key={t.id} className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-1.5 font-mono text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-100 font-semibold">{t.title}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                            t.priority === 'p0' ? 'bg-red-950 text-red-400 border border-red-800' :
                            'bg-zinc-800 text-zinc-300'
                          }`}>
                            {t.priority}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-zinc-400">
                          <span>Project: {t.project}</span>
                          <span className="text-cyan-400 uppercase font-semibold">{t.status.replace('_', ' ')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Galaxy Watch 4 Biometrics */}
          {activeTab === 'biometrics' && (
            <div className="space-y-4">
              {/* Top Vitals Dashboard */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-950/10 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-rose-400">
                    <span>HEART RATE</span>
                    <Heart className="w-4 h-4 animate-pulse text-rose-400" />
                  </div>
                  <div className="text-2xl font-mono font-bold text-zinc-100">
                    {biometrics?.heartRateBpm || 72} <span className="text-xs font-normal text-zinc-400">BPM</span>
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400">Normal Resting Zone</div>
                </div>

                <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/10 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-amber-400">
                    <span>STRESS INDEX</span>
                    <Activity className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-mono font-bold text-zinc-100">
                    {biometrics?.stressIndex || 35} <span className="text-xs font-normal text-zinc-400">/ 100</span>
                  </div>
                  <div className="text-[10px] font-mono text-amber-300 uppercase font-semibold">
                    Level: {biometrics?.stressLevel || 'normal'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-950/10 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-indigo-400">
                    <span>SLEEP RECOVERY</span>
                    <Moon className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-mono font-bold text-zinc-100">
                    {biometrics?.sleepScore || 88} <span className="text-xs font-normal text-zinc-400">/ 100</span>
                  </div>
                  <div className="text-[10px] font-mono text-indigo-300">7h 42m Total Sleep</div>
                </div>

                <div className="p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-950/10 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400">
                    <span>HRV & SPO2</span>
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-mono font-bold text-zinc-100">
                    {biometrics?.hrvMs || 56} <span className="text-xs font-normal text-zinc-400">ms</span>
                  </div>
                  <div className="text-[10px] font-mono text-cyan-300">SpO2: {biometrics?.spo2Percent || 99}%</div>
                </div>
              </div>

              {/* Live Bio-Adaptive Insight Banner */}
              <div className="p-4 rounded-xl border border-cyan-500/40 bg-cyan-950/20 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-cyan-200 font-mono">
                    Jarvis Bio-Adaptive Intelligence Loop
                  </div>
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                    {biometrics?.proactiveInsight || 'Vitals nominal. Optimal readiness for deep engineering execution.'}
                  </p>
                </div>
              </div>

              {/* Sleep Stage Breakdown Hypnogram */}
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-300">
                  <span>SLEEP STAGE HYPNOGRAM (Galaxy Watch 4)</span>
                  <span className="text-zinc-500">REM: 1h 58m • Deep: 1h 44m • Light: 3h 35m</span>
                </div>

                <div className="h-6 w-full rounded-lg overflow-hidden flex bg-zinc-950 border border-zinc-800">
                  <div style={{ width: '22%' }} className="bg-indigo-600 h-full flex items-center justify-center text-[9px] font-mono text-white font-semibold" title="Deep Sleep (104m)">
                    DEEP 22%
                  </div>
                  <div style={{ width: '26%' }} className="bg-cyan-500 h-full flex items-center justify-center text-[9px] font-mono text-zinc-950 font-semibold" title="REM Sleep (118m)">
                    REM 26%
                  </div>
                  <div style={{ width: '47%' }} className="bg-blue-900 h-full flex items-center justify-center text-[9px] font-mono text-zinc-300 font-semibold" title="Light Sleep (215m)">
                    LIGHT 47%
                  </div>
                  <div style={{ width: '5%' }} className="bg-zinc-700 h-full flex items-center justify-center text-[8px] font-mono text-zinc-300" title="Awake (25m)">
                    5%
                  </div>
                </div>
              </div>

              {/* Live Galaxy Watch 4 Ingestion Injector */}
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-3">
                <h4 className="text-xs font-semibold text-zinc-100 flex items-center gap-2 font-mono">
                  <Watch className="w-4 h-4 text-rose-400" />
                  <span>Galaxy Watch 4 Telemetry Stream Injector</span>
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Simulate real-time WearOS telemetry events sent directly to <code className="text-cyan-400 font-mono">/api/jarvis/biometrics</code> to test bio-adaptive triggers.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 font-mono text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between text-zinc-400">
                      <span>HEART RATE:</span>
                      <span className="text-rose-400 font-bold">{simHeartRate} BPM</span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={140}
                      value={simHeartRate}
                      onChange={(e) => setSimHeartRate(Number(e.target.value))}
                      className="w-full accent-rose-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-zinc-400">
                      <span>STRESS INDEX:</span>
                      <span className="text-amber-400 font-bold">{simStressIndex} / 100</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={95}
                      value={simStressIndex}
                      onChange={(e) => setSimStressIndex(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-zinc-400">
                      <span>SLEEP SCORE:</span>
                      <span className="text-indigo-400 font-bold">{simSleepScore} / 100</span>
                    </div>
                    <input
                      type="range"
                      min={40}
                      max={99}
                      value={simSleepScore}
                      onChange={(e) => setSimSleepScore(Number(e.target.value))}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleInjectBiometrics}
                    disabled={isInjectingBio}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 text-zinc-950 font-semibold text-xs transition cursor-pointer"
                  >
                    <Watch className="w-3.5 h-3.5" />
                    <span>{isInjectingBio ? 'Logging...' : 'Inject Galaxy Watch Telemetry'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: API Documentation & Drizzle Schema */}
          {activeTab === 'api-docs' && (
            <div className="space-y-4">
              <div className="text-xs font-mono text-zinc-400">
                <span>PHASE 2 INGESTION ENDPOINTS & DRIZZLE SCHEMA</span>
              </div>

              {/* cURL Snippets */}
              <div className="space-y-3 font-mono text-xs">
                {/* Comms cURL */}
                <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 font-semibold">1. POST /api/jarvis/webhooks/communications</span>
                    <button
                      onClick={() => handleCopyCurl(curlComms, 'comms')}
                      className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 cursor-pointer"
                    >
                      {copiedCurl === 'comms' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCurl === 'comms' ? 'Copied' : 'Copy cURL'}</span>
                    </button>
                  </div>
                  <pre className="p-2.5 rounded bg-black/70 text-zinc-300 text-[10px] overflow-x-auto">
                    {curlComms}
                  </pre>
                </div>

                {/* Biometrics cURL */}
                <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-rose-400 font-semibold">2. POST /api/jarvis/biometrics</span>
                    <button
                      onClick={() => handleCopyCurl(curlBiometrics, 'bio')}
                      className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 cursor-pointer"
                    >
                      {copiedCurl === 'bio' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCurl === 'bio' ? 'Copied' : 'Copy cURL'}</span>
                    </button>
                  </div>
                  <pre className="p-2.5 rounded bg-black/70 text-zinc-300 text-[10px] overflow-x-auto">
                    {curlBiometrics}
                  </pre>
                </div>

                {/* GitHub cURL */}
                <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 font-semibold">3. POST /api/jarvis/webhooks/github</span>
                    <button
                      onClick={() => handleCopyCurl(curlGithub, 'gh')}
                      className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 cursor-pointer"
                    >
                      {copiedCurl === 'gh' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCurl === 'gh' ? 'Copied' : 'Copy cURL'}</span>
                    </button>
                  </div>
                  <pre className="p-2.5 rounded bg-black/70 text-zinc-300 text-[10px] overflow-x-auto">
                    {curlGithub}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
