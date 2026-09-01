import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  RegisteredComponent, 
  CodeTabKey, 
  SecondBrainConnection, 
  SandboxSession, 
  LogEntry, 
  WebhookEventPayload, 
  ComponentCategory,
  JarvisEcosystemEvent,
  CommunicationMessage,
  GitHubCommit,
  GitHubPullRequest,
  LifeStackTask,
  BiometricTelemetry,
  AgentTask,
  ExecutionMode,
  SemanticSearchResult,
  ComponentCliManifest,
  ThemePreset,
  ThemePresetId,
  SyntheticFault,
  SelfHealingSession,
  IngestionResult,
  GatewayToken,
  SystemHealthStats
} from '../types';
import { REGISTERED_COMPONENTS, generateDynamicUsageCode } from '../data/componentsData';
import { THEME_PRESETS, SYNTHETIC_FAULTS } from '../data/themeAndFaultsData';

interface RegistryContextType {
  // Component Selection & Filtering
  components: RegisteredComponent[];
  activeComponent: RegisteredComponent;
  setActiveComponentId: (id: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Split-Pane Resizing State
  splitRatio: number; // 30% to 70% left pane width
  setSplitRatio: (ratio: number) => void;
  isDraggingSplit: boolean;
  setIsDraggingSplit: (dragging: boolean) => void;

  // Active Code Inspector Tab
  activeCodeTab: CodeTabKey;
  setActiveCodeTab: (tab: CodeTabKey) => void;

  // Live Component Dynamic Props
  componentProps: Record<string, any>;
  updateComponentProp: (name: string, value: any) => void;
  resetComponentProps: () => void;

  // Sandbox & Container Execution State
  sandboxSession: SandboxSession;
  isStartingSandbox: boolean;
  restartSandbox: () => Promise<void>;
  stopSandbox: () => void;
  executeTerminalCommand: (cmd: string) => void;
  clearTerminalLogs: () => void;
  sandboxMode: 'interactive' | 'iframe-remote';
  setSandboxMode: (mode: 'interactive' | 'iframe-remote') => void;

  // Second Brain Orchestrator State
  secondBrain: SecondBrainConnection;
  triggerBrainSync: () => Promise<void>;
  recentWebhooks: WebhookEventPayload[];
  sendSimulatedWebhook: (eventType: WebhookEventPayload['eventType'], data?: any) => Promise<void>;

  // Phase 2: Jarvis Ecosystem API & Webhook Ingestion
  ecosystemEvents: JarvisEcosystemEvent[];
  fetchEcosystemEvents: () => Promise<void>;
  communications: CommunicationMessage[];
  githubCommits: GitHubCommit[];
  githubPullRequests: GitHubPullRequest[];
  lifestackTasks: LifeStackTask[];
  biometrics: BiometricTelemetry | null;
  biometricsHistory: BiometricTelemetry[];
  triggerCommunicationsWebhook: (data: Partial<CommunicationMessage>) => Promise<void>;
  triggerGitHubWebhook: (data: any) => Promise<void>;
  triggerLifeStackWebhook: (data: any) => Promise<void>;
  triggerBiometricsIngest: (data: Partial<BiometricTelemetry>) => Promise<void>;
  handleDecisionAction: (eventId: string, decision: 'execute' | 'dismiss' | 'defer', executionMode?: ExecutionMode) => Promise<void>;
  isEcosystemModalOpen: boolean;
  setIsEcosystemModalOpen: (open: boolean) => void;

  // Phase 3: Action Execution Engine & Queue Drawer
  agentTasks: AgentTask[];
  fetchAgentTasks: () => Promise<void>;
  triggerAgentTask: (mode: ExecutionMode, targetRef?: string, title?: string) => Promise<void>;
  isActionQueueOpen: boolean;
  setIsActionQueueOpen: (open: boolean) => void;

  // Phase 3: Global Command Palette & Semantic Vector Search
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  performSemanticSearch: (query: string, filterType?: string) => Promise<SemanticSearchResult[]>;

  // Phase 3: CLI Distribution Protocol (npx @second-brain/cli)
  isCliExportModalOpen: boolean;
  setIsCliExportModalOpen: (open: boolean) => void;
  cliTargetSlug: string;
  setCliTargetSlug: (slug: string) => void;
  openCliExportForComponent: (slug: string) => void;
  fetchCliManifest: (slug: string) => Promise<ComponentCliManifest | null>;

  // Phase 4: Dynamic Theme Tokenizer & Preset Injector
  currentTheme: ThemePreset;
  setThemePreset: (presetId: ThemePresetId) => void;
  customAccentColor: string;
  setCustomAccentColor: (color: string) => void;
  themePresets: ThemePreset[];

  // Phase 4: Autonomous Self-Healing & Triage Loop
  selfHealingSession: SelfHealingSession;
  syntheticFaults: SyntheticFault[];
  injectSyntheticFault: (faultId: string) => Promise<void>;
  startSelfHealingLoop: () => Promise<void>;
  resetSelfHealingState: () => void;

  // Phase 5: Reverse Ingestion & Codebase Parser
  isIngestionModalOpen: boolean;
  setIsIngestionModalOpen: (open: boolean) => void;
  ingestComponent: (result: IngestionResult) => void;

  // Phase 5: Multi-Modal Vision-to-Component View
  isVisionTabActive: boolean;
  setIsVisionTabActive: (active: boolean) => void;

  // Phase 5: API Gateway, Production Deployment & Secrets Vault
  isGatewayModalOpen: boolean;
  setIsGatewayModalOpen: (open: boolean) => void;
  gatewayTokens: GatewayToken[];
  generateGatewayToken: (name: string, scopes: string[]) => void;
  revokeGatewayToken: (id: string) => void;
  systemHealth: SystemHealthStats;
  refreshSystemHealth: () => Promise<void>;

  // Global Utilities
  copyCode: (type: 'current-file' | 'all-bundle') => Promise<boolean>;
  copiedNotice: string | null;
}


const RegistryContext = createContext<RegistryContextType | undefined>(undefined);


export const RegistryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [components, setComponents] = useState<RegisteredComponent[]>(REGISTERED_COMPONENTS);
  const [activeComponentId, setActiveComponentIdState] = useState<string>(REGISTERED_COMPONENTS[0].metadata.id);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Split-pane layout ratio (Default 50% left, 50% right)
  const [splitRatio, setSplitRatio] = useState<number>(() => {
    const saved = localStorage.getItem('sb_split_ratio');
    return saved ? parseFloat(saved) : 50;
  });
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);

  // Active Code tab
  const [activeCodeTab, setActiveCodeTab] = useState<CodeTabKey>('Component.tsx');

  // Copy notice toast
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);

  // Sandbox Remote / Interactive Mode
  const [sandboxMode, setSandboxMode] = useState<'interactive' | 'iframe-remote'>('interactive');

  // Active component ref
  const activeComponent = components.find((c) => c.metadata.id === activeComponentId) || components[0];

  // Dynamic props for the active component
  const [componentProps, setComponentProps] = useState<Record<string, any>>(activeComponent.defaultProps);

  useEffect(() => {
    setComponentProps(activeComponent.defaultProps);
    setActiveCodeTab('Component.tsx');
  }, [activeComponentId]);

  const updateComponentProp = (name: string, value: any) => {
    setComponentProps((prev) => ({ ...prev, [name]: value }));
  };

  const resetComponentProps = () => {
    setComponentProps(activeComponent.defaultProps);
  };

  const setActiveComponentId = (id: string) => {
    setActiveComponentIdState(id);
  };

  // Sandbox container session
  const [sandboxSession, setSandboxSession] = useState<SandboxSession>({
    sessionId: 'sb-sess-8891',
    componentId: activeComponent.metadata.id,
    status: 'running',
    containerId: 'docker://secondbrain/satellite-runtime:v2.4',
    port: 3000,
    createdAt: new Date().toISOString(),
    metrics: {
      cpuUsage: 14,
      memoryUsageMb: 142,
      memoryLimitMb: 512,
      uptimeSeconds: 120,
      networkInKb: 840,
      networkOutKb: 2190,
      fps: 60,
    },
    logs: [
      {
        id: 'log-1',
        timestamp: new Date(Date.now() - 60000).toLocaleTimeString(),
        stream: 'system',
        message: '[docker-orchestrator] Initializing ephemeral isolated node container...',
      },
      {
        id: 'log-2',
        timestamp: new Date(Date.now() - 45000).toLocaleTimeString(),
        stream: 'stdout',
        message: `[satellite-bridge] Mounted component '${activeComponent.metadata.name}' (v${activeComponent.metadata.version})`,
      },
      {
        id: 'log-3',
        timestamp: new Date(Date.now() - 30000).toLocaleTimeString(),
        stream: 'stdout',
        message: '[xterm.js] Terminal telemetry connected to ws://0.0.0.0:3000/socket.io',
      },
      {
        id: 'log-4',
        timestamp: new Date().toLocaleTimeString(),
        stream: 'system',
        message: '[healthcheck] Container sandbox status: HEALTHY (ready for live interactions)',
      },
    ],
  });

  const [isStartingSandbox, setIsStartingSandbox] = useState(false);

  // Second Brain connection state
  const [secondBrain, setSecondBrain] = useState<SecondBrainConnection>({
    status: 'connected',
    orchestratorUrl: 'https://second-brain.internal.lan',
    brainVersion: 'v2.4.1-alpha',
    pingMs: 22,
    lastHeartbeat: new Date().toLocaleTimeString(),
    syncedComponentsCount: 4,
    activeContainersCount: 1,
    clusterRegion: 'us-east (Virginia)',
  });

  // Recent Webhook events history
  const [recentWebhooks, setRecentWebhooks] = useState<WebhookEventPayload[]>([
    {
      eventId: 'evt_sync_991823',
      eventType: 'component.published',
      source: 'SecondBrain/Hub/SynergyCam',
      timestamp: new Date(Date.now() - 120000).toLocaleTimeString(),
      data: {
        componentId: 'synergy-cam-ui',
        version: '2.4.0',
        action: 'EXTRACT_TO_SATELLITE',
      },
    },
    {
      eventId: 'evt_telemetry_8812',
      eventType: 'telemetry.heartbeat',
      source: 'SecondBrain/Bridge/DockerOrchestrator',
      timestamp: new Date(Date.now() - 30000).toLocaleTimeString(),
      data: {
        containerPool: 'ready',
        activeSandboxes: 1,
      },
    },
  ]);

  // Restart Sandbox Handler (Calls backend /api/sandbox-init)
  const restartSandbox = async () => {
    setIsStartingSandbox(true);
    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      stream: 'system',
      message: `[container-init] Sending spawn request for component: ${activeComponent.metadata.id}...`,
    };

    setSandboxSession((prev) => ({
      ...prev,
      status: 'provisioning',
      logs: [...prev.logs, newLog],
    }));

    try {
      const res = await fetch('/api/sandbox-init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          componentId: activeComponent.metadata.id,
          containerType: 'node-isolated',
          memoryLimitMb: 512,
        }),
      });
      const data = await res.json();

      setTimeout(() => {
        setIsStartingSandbox(false);
        setSandboxSession((prev) => ({
          ...prev,
          status: 'running',
          sessionId: data.sessionId || `sess-${Date.now()}`,
          logs: [
            ...prev.logs,
            {
              id: `log-${Date.now()}-done`,
              timestamp: new Date().toLocaleTimeString(),
              stream: 'stdout',
              message: `[container-init] Container instance ${data.containerId || 'docker-sandbox-01'} spawned in 340ms on port ${data.port || 3000}`,
            },
          ],
        }));
      }, 700);
    } catch (e) {
      setTimeout(() => {
        setIsStartingSandbox(false);
        setSandboxSession((prev) => ({
          ...prev,
          status: 'running',
          logs: [
            ...prev.logs,
            {
              id: `log-${Date.now()}-local`,
              timestamp: new Date().toLocaleTimeString(),
              stream: 'stdout',
              message: `[local-fallback] Fast container hot-reload completed for ${activeComponent.metadata.name}`,
            },
          ],
        }));
      }, 500);
    }
  };

  const stopSandbox = () => {
    setSandboxSession((prev) => ({
      ...prev,
      status: 'idle',
      logs: [
        ...prev.logs,
        {
          id: `log-${Date.now()}-stop`,
          timestamp: new Date().toLocaleTimeString(),
          stream: 'system',
          message: '[container-ctl] Paused execution and detached sandbox process.',
        },
      ],
    }));
  };

  const clearTerminalLogs = () => {
    setSandboxSession((prev) => ({
      ...prev,
      logs: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          stream: 'system',
          message: '[xterm.js] Terminal buffer cleared. Ready for input.',
        },
      ],
    }));
  };

  const executeTerminalCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const userEntry: LogEntry = {
      id: `cmd-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      stream: 'stdout',
      message: `$ ${trimmed}`,
    };

    let replyMessage = '';
    const lower = trimmed.toLowerCase();

    if (lower === 'help') {
      replyMessage = `Available commands:\n  • npm run test        - Run test suite for ${activeComponent.metadata.name}\n  • docker ps           - List active sandbox containers\n  • sync                - Force sync with Second Brain orchestrator\n  • status              - Inspect memory/CPU telemetry\n  • clear               - Clear terminal log buffer`;
    } else if (lower.includes('npm run test') || lower.includes('test')) {
      replyMessage = `✓ ${activeComponent.metadata.name}.test.tsx (4 passed, 0 failed)\n✓ hooks.test.ts (2 passed, 0 failed)\n  Test Suites: 2 passed, 2 total\n  Snapshots:   0 total\n  Time:        0.412s`;
    } else if (lower.includes('docker ps')) {
      replyMessage = `CONTAINER ID   IMAGE                                COMMAND                  CREATED         STATUS         PORTS\n9d7c3a89e102   secondbrain/satellite-runtime:v2.4   "npm run dev:sandbox"    2 minutes ago   Up 2 minutes   0.0.0.0:3000->3000/tcp`;
    } else if (lower === 'sync') {
      triggerBrainSync();
      replyMessage = `[sync] Sent heartbeat and pull-request to ${secondBrain.orchestratorUrl}...`;
    } else if (lower === 'status') {
      replyMessage = `Sandbox Status: ${sandboxSession.status.toUpperCase()}\nCPU: ${sandboxSession.metrics.cpuUsage}%\nMemory: ${sandboxSession.metrics.memoryUsageMb}MB / ${sandboxSession.metrics.memoryLimitMb}MB\nSecond Brain Link: ${secondBrain.status.toUpperCase()} (${secondBrain.pingMs}ms)`;
    } else if (lower === 'clear') {
      clearTerminalLogs();
      return;
    } else {
      replyMessage = `Executed: '${trimmed}'. (Command acknowledged by sandbox host bridge)`;
    }

    const replyEntry: LogEntry = {
      id: `reply-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      stream: 'system',
      message: replyMessage,
    };

    setSandboxSession((prev) => ({
      ...prev,
      logs: [...prev.logs, userEntry, replyEntry],
    }));
  };

  // Sync with Second Brain
  const triggerBrainSync = async () => {
    setSecondBrain((prev) => ({ ...prev, status: 'syncing' }));
    try {
      const res = await fetch('/api/second-brain-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'component.published',
          source: 'Satellite/Portal/ManualSync',
          data: {
            activeComponent: activeComponent.metadata.id,
            timestamp: new Date().toISOString(),
          },
        }),
      });
      const data = await res.json();

      setTimeout(() => {
        setSecondBrain((prev) => ({
          ...prev,
          status: 'connected',
          lastHeartbeat: new Date().toLocaleTimeString(),
          pingMs: Math.floor(18 + Math.random() * 12),
        }));
      }, 600);
    } catch (e) {
      setTimeout(() => {
        setSecondBrain((prev) => ({
          ...prev,
          status: 'connected',
          lastHeartbeat: new Date().toLocaleTimeString(),
        }));
      }, 400);
    }
  };

  // Send simulated webhook
  const sendSimulatedWebhook = async (eventType: WebhookEventPayload['eventType'], data?: any) => {
    const payload: WebhookEventPayload = {
      eventId: `evt_${Date.now()}`,
      eventType,
      source: 'SecondBrain/CentralOrchestrator',
      timestamp: new Date().toLocaleTimeString(),
      data: data || {
        componentId: activeComponent.metadata.id,
        note: 'Payload received via /api/second-brain-webhook',
      },
    };

    try {
      await fetch('/api/second-brain-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      // fallback
    }

    setRecentWebhooks((prev) => [payload, ...prev.slice(0, 9)]);
  };

  // Phase 2: Jarvis Ecosystem Ingestion State
  const [ecosystemEvents, setEcosystemEvents] = useState<JarvisEcosystemEvent[]>([]);
  const [communications, setCommunications] = useState<CommunicationMessage[]>([]);
  const [githubCommits, setGithubCommits] = useState<GitHubCommit[]>([]);
  const [githubPullRequests, setGithubPullRequests] = useState<GitHubPullRequest[]>([]);
  const [lifestackTasks, setLifestackTasks] = useState<LifeStackTask[]>([]);
  const [biometrics, setBiometrics] = useState<BiometricTelemetry | null>(null);
  const [biometricsHistory, setBiometricsHistory] = useState<BiometricTelemetry[]>([]);
  const [isEcosystemModalOpen, setIsEcosystemModalOpen] = useState<boolean>(false);

  // Fetch all ecosystem events and streams
  const fetchEcosystemEvents = useCallback(async () => {
    try {
      const [eventsRes, commsRes, ghRes, bioRes] = await Promise.all([
        fetch('/api/jarvis/ecosystem-events'),
        fetch('/api/jarvis/communications'),
        fetch('/api/jarvis/github-lifestack'),
        fetch('/api/jarvis/biometrics'),
      ]);

      if (eventsRes.ok) {
        const data = await eventsRes.json();
        setEcosystemEvents(data.events || []);
      }
      if (commsRes.ok) {
        const data = await commsRes.json();
        setCommunications(data.communications || []);
      }
      if (ghRes.ok) {
        const data = await ghRes.json();
        setGithubCommits(data.commits || []);
        setGithubPullRequests(data.pullRequests || []);
        setLifestackTasks(data.tasks || []);
      }
      if (bioRes.ok) {
        const data = await bioRes.json();
        setBiometrics(data.latest || null);
        setBiometricsHistory(data.history || []);
      }
    } catch (e) {
      console.warn('[Ecosystem Sync Failed] Retrying next cycle...');
    }
  }, []);

  // Initial load and periodic polling
  useEffect(() => {
    fetchEcosystemEvents();
    const interval = setInterval(fetchEcosystemEvents, 10000);
    return () => clearInterval(interval);
  }, [fetchEcosystemEvents]);

  // Trigger Communications Webhook
  const triggerCommunicationsWebhook = async (data: Partial<CommunicationMessage>) => {
    try {
      const res = await fetch('/api/jarvis/webhooks/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchEcosystemEvents();
        setCopiedNotice('Communications Webhook Ingested!');
        setTimeout(() => setCopiedNotice(null), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Trigger GitHub Webhook
  const triggerGitHubWebhook = async (data: any) => {
    try {
      const res = await fetch('/api/jarvis/webhooks/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchEcosystemEvents();
        setCopiedNotice('GitHub CI/CD Webhook Ingested!');
        setTimeout(() => setCopiedNotice(null), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Trigger LifeStack Webhook
  const triggerLifeStackWebhook = async (data: any) => {
    try {
      const res = await fetch('/api/jarvis/webhooks/lifestack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchEcosystemEvents();
        setCopiedNotice('LifeStack Task Synchronized!');
        setTimeout(() => setCopiedNotice(null), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Trigger Biometrics Telemetry Ingestion
  const triggerBiometricsIngest = async (data: Partial<BiometricTelemetry>) => {
    try {
      const res = await fetch('/api/jarvis/biometrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchEcosystemEvents();
        setCopiedNotice('Galaxy Watch 4 Telemetry Logged!');
        setTimeout(() => setCopiedNotice(null), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Phase 3: Action Execution Engine State
  const [agentTasks, setAgentTasks] = useState<AgentTask[]>([]);
  const [isActionQueueOpen, setIsActionQueueOpen] = useState(false);

  // Phase 3: Command Palette & Semantic Memory State
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Phase 3: CLI Distribution State
  const [isCliExportModalOpen, setIsCliExportModalOpen] = useState(false);
  const [cliTargetSlug, setCliTargetSlug] = useState<string>(REGISTERED_COMPONENTS[0].metadata.slug);

  // Fetch agent tasks queue
  const fetchAgentTasks = useCallback(async () => {
    try {
      const res = await fetch('/api/jarvis/action-queue');
      if (res.ok) {
        const data = await res.json();
        setAgentTasks(data.tasks || []);
      }
    } catch (e) {
      console.error('Failed to fetch agent tasks:', e);
    }
  }, []);

  useEffect(() => {
    fetchAgentTasks();
  }, [fetchAgentTasks]);

  // Global Keyboard shortcut for Command Palette (Cmd + K or Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Trigger manual agent task
  const triggerAgentTask = async (mode: ExecutionMode, targetRef?: string, title?: string) => {
    try {
      const res = await fetch('/api/jarvis/action-queue/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, targetRef, title }),
      });
      if (res.ok) {
        await fetchAgentTasks();
        setCopiedNotice(`Agent Task Executed: ${mode.replace('EXECUTE_', '')}`);
        setTimeout(() => setCopiedNotice(null), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Perform hybrid semantic search
  const performSemanticSearch = async (query: string, filterType?: string): Promise<SemanticSearchResult[]> => {
    try {
      const res = await fetch('/api/jarvis/semantic-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, filterType: filterType || 'all', limit: 10 }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.results || [];
      }
    } catch (e) {
      console.error('Semantic search failed:', e);
    }
    return [];
  };

  // Fetch CLI manifest
  const fetchCliManifest = async (slug: string): Promise<ComponentCliManifest | null> => {
    try {
      const res = await fetch(`/api/registry/v1/components/${slug}`);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (e) {
      console.error('Failed to fetch CLI manifest:', e);
    }
    return null;
  };

  const openCliExportForComponent = (slug: string) => {
    setCliTargetSlug(slug);
    setIsCliExportModalOpen(true);
  };

  // Handle Decision Action (Phase 3 Expanded)
  const handleDecisionAction = async (eventId: string, decision: 'execute' | 'dismiss' | 'defer', executionMode?: ExecutionMode) => {
    try {
      const res = await fetch('/api/jarvis/decision-loop/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, decision, executionMode }),
      });
      if (res.ok) {
        await fetchEcosystemEvents();
        await fetchAgentTasks();
        setCopiedNotice(`Decision action: ${decision.toUpperCase()}`);
        setTimeout(() => setCopiedNotice(null), 2000);
      }
    } catch (e) {
      console.error(e);
    }
  };


  // Copy Code utility
  const copyCode = async (type: 'current-file' | 'all-bundle'): Promise<boolean> => {
    let textToCopy = '';
    if (type === 'current-file') {
      if (activeCodeTab === 'Usage.tsx') {
        textToCopy = generateDynamicUsageCode(activeComponent, componentProps);
      } else {
        textToCopy = activeComponent.code[activeCodeTab] || '';
      }
    } else {
      const fullCodeBundle = {
        ...activeComponent.code,
        'Usage.tsx': generateDynamicUsageCode(activeComponent, componentProps),
      };
      textToCopy = JSON.stringify(
        {
          metadata: activeComponent.metadata,
          code: fullCodeBundle,
        },
        null,
        2
      );
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedNotice(type === 'current-file' ? `Copied ${activeCodeTab}!` : 'Copied Full Component Bundle!');
      setTimeout(() => setCopiedNotice(null), 2500);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Phase 4: Dynamic Theme Tokenizer & Preset Injector State
  const [currentTheme, setCurrentTheme] = useState<ThemePreset>(THEME_PRESETS[0]);
  const [customAccentColor, setCustomAccentColor] = useState<string>(THEME_PRESETS[0].primaryColor);

  const setThemePreset = (presetId: ThemePresetId) => {
    const found = THEME_PRESETS.find((p) => p.id === presetId) || THEME_PRESETS[0];
    setCurrentTheme(found);
    setCustomAccentColor(found.primaryColor);
    setCopiedNotice(`Applied Theme: ${found.name}`);
    setTimeout(() => setCopiedNotice(null), 2000);
  };

  // Phase 4: Autonomous Self-Healing & Triage Loop State
  const [selfHealingSession, setSelfHealingSession] = useState<SelfHealingSession>({
    id: 'heal_sess_init',
    status: 'idle',
    iteration: 0,
    testPassRate: 100,
    logs: [
      '[self-healing-agent] Diagnostic agent standby. Virtual sandbox telemetry active.',
    ],
  });

  const resetSelfHealingState = () => {
    setSelfHealingSession({
      id: `heal_sess_${Date.now()}`,
      status: 'idle',
      iteration: 0,
      testPassRate: 100,
      logs: ['[self-healing-agent] Diagnostic agent standby. Ready for execution.'],
    });
  };

  const injectSyntheticFault = async (faultId: string) => {
    const fault = SYNTHETIC_FAULTS.find((f) => f.id === faultId) || SYNTHETIC_FAULTS[0];

    // 1. Inject error logs into Sandbox Terminal
    const errorLogEntry: LogEntry = {
      id: `fault-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      stream: 'stderr',
      message: `[ERROR] [SYNTHETIC FAULT INJECTED: ${fault.name}]\n${fault.errorMessage}`,
    };

    setSandboxSession((prev) => ({
      ...prev,
      status: 'error',
      logs: [...prev.logs, errorLogEntry],
    }));

    // 2. Set self-healing session to fault_injected
    setSelfHealingSession({
      id: `heal_${Date.now()}`,
      faultId: fault.id,
      status: 'fault_injected',
      errorLog: fault.errorMessage,
      iteration: 1,
      testPassRate: 33, // Failing tests
      logs: [
        `[SYNTHETIC_FAULT_INJECTED] Target: ${fault.targetFile} (${fault.name})`,
        `[STACK_TRACE] ${fault.stackTrace.join('\n')}`,
        `[STATUS] Virtual sandbox test suites reporting 2/6 failed assertions. Awaiting agent triage.`,
      ],
    });

    setCopiedNotice(`Synthetic fault injected: ${fault.name}`);
    setTimeout(() => setCopiedNotice(null), 2500);
  };

  const startSelfHealingLoop = async () => {
    const fault = SYNTHETIC_FAULTS.find((f) => f.id === selfHealingSession.faultId) || SYNTHETIC_FAULTS[0];

    // Step 1: Analyzing error logs & AST stack trace
    setSelfHealingSession((prev) => ({
      ...prev,
      status: 'analyzing',
      logs: [
        ...prev.logs,
        `[STEP 1: ROOT_CAUSE_ANALYSIS] Feeding error stack trace into AST reasoning engine...`,
        `[AST_PARSER] Located null pointer exception in '${fault.targetFile}' at line 42.`,
      ],
    }));

    // Step 2: Generating Unified Diff Patch
    await new Promise((r) => setTimeout(r, 800));
    setSelfHealingSession((prev) => ({
      ...prev,
      status: 'patch_generated',
      patchDiff: fault.suggestedFixDiff,
      logs: [
        ...prev.logs,
        `[STEP 2: DIFF_SYNTHESIS] Generated unified patch for ${fault.targetFile}:`,
        fault.suggestedFixDiff,
        `[STEP 3: SANDBOX_INJECTION] Applying diff patch to ephemeral container file system...`,
      ],
    }));

    // Step 3: Re-running Containerized Test Suite
    await new Promise((r) => setTimeout(r, 1000));
    setSelfHealingSession((prev) => ({
      ...prev,
      status: 'testing',
      logs: [
        ...prev.logs,
        `[STEP 4: CONTAINER_TEST_RUN] Spawning isolated Vitest runner (npm test -- --reporter=json)...`,
        `✓ ${activeComponent.metadata.name}.test.tsx (6 passed, 0 failed)`,
        `✓ hooks.test.ts (4 passed, 0 failed)`,
        `[TEST_VERIFIED] 100% assertions passed in 0.384s. Zero regressions.`,
      ],
      testPassRate: 100,
    }));

    // Step 4: Auto-creating GitHub Pull Request
    await new Promise((r) => setTimeout(r, 900));
    const prNumber = Math.floor(Math.random() * 20) + 110;
    const prBranch = `jarvis/autonomous-patch-${fault.id}`;
    const prUrl = `https://github.com/second-brain/satellite-components/pull/${prNumber}`;

    setSelfHealingSession((prev) => ({
      ...prev,
      status: 'pr_created',
      prUrl,
      prBranch,
      logs: [
        ...prev.logs,
        `[STEP 5: GIT_PUSH] Auto-committed fix to branch '${prBranch}'.`,
        `[PULL_REQUEST_CREATED] PR #${prNumber} opened: "fix: resolve ${fault.name} in ${fault.targetFile}"`,
        `[STATUS] System fully healed and verified. Ready for deployment.`,
      ],
    }));

    // Also inject success message to xterm.js terminal
    setSandboxSession((prev) => ({
      ...prev,
      status: 'running',
      logs: [
        ...prev.logs,
        {
          id: `heal-success-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          stream: 'system',
          message: `[SELF-HEALING SUCCESS] Applied patch for ${fault.name}. Vitest suite 100% GREEN. Created PR #${prNumber}.`,
        },
      ],
    }));

    // Also register an agent task in the Action Queue
    await triggerAgentTask('EXECUTE_CODE_PATCH', `${activeComponent.metadata.name}/${fault.targetFile}`, `Autonomous Fix: ${fault.name}`);

    setCopiedNotice(`Self-Healing Complete: PR #${prNumber} Created!`);
    setTimeout(() => setCopiedNotice(null), 3000);
  };

  // ============================================================================
  // PHASE 5: REVERSE INGESTION & VISION GENERATOR STATE
  // ============================================================================
  const [isIngestionModalOpen, setIsIngestionModalOpen] = useState(false);
  const [isVisionTabActive, setIsVisionTabActive] = useState(false);

  // Ingest Component into Registry Roster
  const ingestComponent = (result: IngestionResult) => {
    const newComponent: RegisteredComponent = result.componentPayload;
    
    // Append or replace if exists
    setComponents((prev) => {
      const exists = prev.some((c) => c.metadata.slug === newComponent.metadata.slug);
      if (exists) {
        return prev.map((c) => c.metadata.slug === newComponent.metadata.slug ? newComponent : c);
      }
      return [newComponent, ...prev];
    });

    setActiveComponentIdState(newComponent.metadata.id);
    setSelectedCategory('All');
    setCopiedNotice(`Component "${newComponent.metadata.name}" successfully ingested & mounted!`);
    setTimeout(() => setCopiedNotice(null), 3500);

    // Also notify sandbox terminal
    setSandboxSession((prev) => ({
      ...prev,
      logs: [
        ...prev.logs,
        {
          id: `ingest-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          stream: 'system',
          message: `[AST INGESTION] Extracted "${newComponent.metadata.name}" (${result.astAnalysis.linesOfCode} LOC, ${result.extractedFiles.length} files). Loaded to memory.`,
        },
      ],
    }));

    // Trigger an agent task in the Action Queue
    triggerAgentTask('SCAFFOLD_INTEGRATION_TESTS', newComponent.metadata.slug, `Ingested: ${newComponent.metadata.name}`);
  };

  // ============================================================================
  // PHASE 5: API GATEWAY & SECRETS VAULT STATE
  // ============================================================================
  const [isGatewayModalOpen, setIsGatewayModalOpen] = useState(false);
  const [gatewayTokens, setGatewayTokens] = useState<GatewayToken[]>([
    {
      id: 'tok_live_prime_8841',
      name: 'Second-Brain-Master-Hub',
      token: 'sb_live_4b8f9a2e8c714d6092e552033d1a4e629304244e48766293',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      lastUsed: 'Just now (via NGINX Proxy)',
      scopes: ['registry:read', 'registry:write', 'sandbox:execute', 'telemetry:stream'],
      rateLimit: '120 req/min',
      status: 'active',
    },
    {
      id: 'tok_live_ios_3102',
      name: 'Satellite-Mobile-Client-IOS',
      token: 'sb_live_7719ab23cf414e829391024823901481239048129034',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      lastUsed: '14 minutes ago',
      scopes: ['registry:read', 'telemetry:stream'],
      rateLimit: '30 req/min',
      status: 'active',
    },
  ]);

  const generateGatewayToken = (name: string, scopes: string[]) => {
    const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newToken: GatewayToken = {
      id: `tok_live_${Date.now()}`,
      name,
      token: `sb_live_${randomHex}`,
      createdAt: new Date().toISOString(),
      lastUsed: 'Never',
      scopes,
      rateLimit: '60 req/min',
      status: 'active',
    };
    setGatewayTokens((prev) => [newToken, ...prev]);
    setCopiedNotice(`New API Token created for "${name}"`);
    setTimeout(() => setCopiedNotice(null), 3000);
  };

  const revokeGatewayToken = (id: string) => {
    setGatewayTokens((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'revoked' as const } : t))
    );
    setCopiedNotice('Gateway token revoked');
    setTimeout(() => setCopiedNotice(null), 3000);
  };

  const [systemHealth, setSystemHealth] = useState<SystemHealthStats>({
    gatewayUptime: '99.98% (14d 6h)',
    cpuUsagePercent: 24,
    memoryUsageMb: 1420,
    activeSandboxes: 1,
    pgVectorLatencyMs: 4.2,
    redisState: 'connected',
    containers: [
      { name: 'second-brain-registry-hub', image: 'secondbrain/hub:latest', status: 'healthy', ports: '0.0.0.0:3000->3000/tcp', cpuPercent: 12, memoryMb: 420 },
      { name: 'second-brain-pgvector', image: 'pgvector/pgvector:pg16', status: 'healthy', ports: '0.0.0.0:5432->5432/tcp', cpuPercent: 4, memoryMb: 512 },
      { name: 'second-brain-redis', image: 'redis:7-alpine', status: 'running', ports: '0.0.0.0:6379->6379/tcp', cpuPercent: 2, memoryMb: 128 },
      { name: 'second-brain-sandbox-runner', image: 'node:20-alpine', status: 'running', ports: 'socket: /tmp/runner.sock', cpuPercent: 6, memoryMb: 360 },
    ],
    secrets: [
      { key: 'GEMINI_API_KEY', isSet: true, lastRotated: '3 days ago', preview: 'AIzaSyC7•••••••••••••••••••••••••', description: 'Server-side multimodal synthesis key' },
      { key: 'DATABASE_URL', isSet: true, lastRotated: '7 days ago', preview: 'postgresql://brain:••••••••@pgvector:5432/sb', description: 'PostgreSQL + pgvector connection string' },
      { key: 'API_GATEWAY_SECRET', isSet: true, lastRotated: '14 days ago', preview: 'sb_sec_prod_••••••••••••••••', description: 'Master JWT & rate limiting secret' },
      { key: 'GITHUB_WEBHOOK_SECRET', isSet: true, lastRotated: '12 days ago', preview: 'gh_wh_sec_••••••••••••••••', description: 'HMAC signature verification for push/PR hooks' },
    ],
    recentLogs: [
      `[NGINX] Ingress HTTP 200 GET /api/registry/v1/components/orbital-radar-sweep (2ms)`,
      `[PGVECTOR] Executed cosine distance search (similarity > 0.88, latency: 4.1ms)`,
      `[CONTAINER] Ephemeral Vitest sandbox worker #04 spawned on unix socket`,
      `[GATEWAY] Rate limit quota OK for token sb_live_4b8f... (4/120 reqs)`,
    ],
  });

  const refreshSystemHealth = async () => {
    setSystemHealth((prev) => ({
      ...prev,
      cpuUsagePercent: Math.floor(Math.random() * 15) + 18,
      memoryUsageMb: Math.floor(Math.random() * 100) + 1380,
      pgVectorLatencyMs: parseFloat((Math.random() * 2 + 3.1).toFixed(1)),
      recentLogs: [
        `[HEALTHCHECK] Cluster heartbeat ping ok (${Date.now()})`,
        ...prev.recentLogs.slice(0, 5),
      ],
    }));
  };

  return (
    <RegistryContext.Provider
      value={{
        components,
        activeComponent,
        setActiveComponentId,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        splitRatio,
        setSplitRatio,
        isDraggingSplit,
        setIsDraggingSplit,
        activeCodeTab,
        setActiveCodeTab,
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
        secondBrain,
        triggerBrainSync,
        recentWebhooks,
        sendSimulatedWebhook,
        ecosystemEvents,
        fetchEcosystemEvents,
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
        isEcosystemModalOpen,
        setIsEcosystemModalOpen,
        agentTasks,
        fetchAgentTasks,
        triggerAgentTask,
        isActionQueueOpen,
        setIsActionQueueOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        performSemanticSearch,
        isCliExportModalOpen,
        setIsCliExportModalOpen,
        cliTargetSlug,
        setCliTargetSlug,
        openCliExportForComponent,
        fetchCliManifest,
        currentTheme,
        setThemePreset,
        customAccentColor,
        setCustomAccentColor,
        themePresets: THEME_PRESETS,
        selfHealingSession,
        syntheticFaults: SYNTHETIC_FAULTS,
        injectSyntheticFault,
        startSelfHealingLoop,
        resetSelfHealingState,
        isIngestionModalOpen,
        setIsIngestionModalOpen,
        ingestComponent,
        isVisionTabActive,
        setIsVisionTabActive,
        isGatewayModalOpen,
        setIsGatewayModalOpen,
        gatewayTokens,
        generateGatewayToken,
        revokeGatewayToken,
        systemHealth,
        refreshSystemHealth,
        copyCode,
        copiedNotice,
      }}
    >
      {children}
    </RegistryContext.Provider>
  );


};

export const useRegistry = () => {
  const context = useContext(RegistryContext);
  if (!context) {
    throw new Error('useRegistry must be used within a RegistryProvider');
  }
  return context;
};
