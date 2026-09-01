import React from 'react';

export type ComponentCategory =
  | 'Media & AI UI'
  | 'Data Display'
  | 'Auth & Security'
  | 'Layout & Bento'
  | 'Command & Navigation'
  | 'Feedback & Overlays';

export type ComponentStatus = 'production' | 'draft' | 'experimental' | 'deprecated';

export interface ComponentMetadata {
  id: string;
  name: string;
  slug: string;
  category: ComponentCategory;
  description: string;
  version: string;
  author: string;
  status: ComponentStatus;
  lastSyncedAt: string;
  secondBrainSourceId: string;
  tags: string[];
  dependencies: Record<string, string>;
  peerDependencies?: Record<string, string>;
  rating?: number;
  downloadsCount?: number;
}

export interface ComponentCodeFiles {
  'Usage.tsx'?: string;
  'Component.tsx': string;
  'hooks.ts': string;
  'types.ts': string;
  'schema.ts'?: string;
  'styles.css'?: string;
}

export type CodeTabKey = keyof ComponentCodeFiles;

export interface PropControl {
  name: string;
  label: string;
  type: 'boolean' | 'number' | 'string' | 'select' | 'color';
  defaultValue: any;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  description?: string;
}

export interface RegisteredComponent {
  metadata: ComponentMetadata;
  code: ComponentCodeFiles;
  propControls: PropControl[];
  defaultProps: Record<string, any>;
  renderComponent: (props: any) => React.ReactNode;
}

export interface ContainerMetrics {
  cpuUsage: number; // percentage
  memoryUsageMb: number;
  memoryLimitMb: number;
  uptimeSeconds: number;
  networkInKb: number;
  networkOutKb: number;
  fps: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  stream: 'stdout' | 'stderr' | 'system' | 'socket';
  message: string;
}

export interface SandboxSession {
  sessionId: string;
  componentId: string;
  status: 'idle' | 'provisioning' | 'running' | 'paused' | 'error';
  containerId: string;
  port: number;
  createdAt: string;
  metrics: ContainerMetrics;
  logs: LogEntry[];
}

export interface SecondBrainConnection {
  status: 'connected' | 'syncing' | 'disconnected' | 'error';
  orchestratorUrl: string;
  brainVersion: string;
  pingMs: number;
  lastHeartbeat: string;
  syncedComponentsCount: number;
  activeContainersCount: number;
  clusterRegion: string;
}

export interface WebhookEventPayload {
  eventId: string;
  eventType: 'component.published' | 'component.updated' | 'sandbox.triggered' | 'telemetry.heartbeat';
  source: string;
  timestamp: string;
  data: any;
}

// ==============================================================================
// PHASE 2: JARVIS ECOSYSTEM INGESTION & DECISION LOOP TYPES
// ==============================================================================

export type EcosystemStreamType = 
  | 'communications' 
  | 'github_lifestack' 
  | 'biometrics' 
  | 'system';

export type EcosystemUrgency = 'critical' | 'urgent' | 'high' | 'normal' | 'low';

export interface DecisionLoopAction {
  actionId: string;
  actionRecommended: string;
  actionStatus: 'executed' | 'pending_approval' | 'auto_dismissed' | 'deferred';
  confidence: number;
  rationale: string;
  executedAt?: string;
}

export interface JarvisEcosystemEvent {
  id: string;
  streamType: EcosystemStreamType;
  source: 'microsoft_graph' | 'imap' | 'github_webhook' | 'lifestack' | 'galaxy_watch_4' | string;
  eventType: string;
  urgency: EcosystemUrgency;
  title: string;
  summary: string;
  payload: Record<string, any>;
  decisionLoopAction: DecisionLoopAction;
  receivedAt: string;
  processed: boolean;
}

export interface CommunicationMessage {
  id: string;
  provider: 'm365_graph' | 'imap';
  senderName: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  body: string;
  threadId: string;
  receivedAt: string;
  isUrgent: boolean;
  extractedActionItems: string[];
  aiSummary: string;
  sentiment?: 'urgent' | 'positive' | 'neutral' | 'action_needed';
}

export interface GitHubCommit {
  id: string;
  repo: string;
  branch: string;
  author: string;
  authorAvatar?: string;
  message: string;
  addedCount: number;
  modifiedCount: number;
  timestamp: string;
  status: 'building' | 'passed' | 'failed';
  ciDurationSec: number;
}

export interface GitHubPullRequest {
  id: string;
  number: number;
  repo: string;
  title: string;
  author: string;
  reviewState: 'approved' | 'changes_requested' | 'pending';
  ciStatus: 'success' | 'failure' | 'pending';
  branchSource: string;
  branchTarget: string;
  url: string;
  updatedAt: string;
}

export interface LifeStackTask {
  id: string;
  project: string;
  title: string;
  status: 'in_progress' | 'completed' | 'blocked' | 'review';
  priority: 'p0' | 'p1' | 'p2';
  assignee: string;
  dueDate: string;
  updatedAt: string;
}

export interface SleepStageRecord {
  stage: 'awake' | 'light' | 'deep' | 'rem';
  startMin: number;
  durationMin: number;
}

export interface BiometricTelemetry {
  id: string;
  timestamp: string;
  heartRateBpm: number;
  stressIndex: number; // 0 - 100
  stressLevel: 'relaxed' | 'normal' | 'moderate' | 'elevated' | 'critical';
  sleepScore: number; // 0 - 100
  totalSleepMin: number;
  deepSleepMin: number;
  remSleepMin: number;
  lightSleepMin: number;
  awakeMin: number;
  sleepStages: SleepStageRecord[];
  spo2Percent: number; // 90 - 100%
  hrvMs: number; // heart rate variability (rMSSD)
  skinTempC: number;
  stepCount: number;
  activeEnergyKcal: number;
  proactiveInsight: string;
  deviceModel: string; // e.g. 'Samsung Galaxy Watch 4 Classic (SM-R890)'
  batteryPercent: number;
}

// ==============================================================================
// PHASE 3: ACTION ENGINE, SEMANTIC MEMORY & CLI PROTOCOL TYPES
// ==============================================================================

export type ExecutionMode = 
  | 'EXECUTE_CODE_PATCH' 
  | 'EXECUTE_COMMS_DRAFT' 
  | 'EXECUTE_SANDBOX_RUN' 
  | 'SCAFFOLD_INTEGRATION_TESTS'
  | 'EXECUTE_CUSTOM';

export interface AgentTask {
  id: string;
  title: string;
  mode: ExecutionMode;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number; // 0 - 100
  logs: string[];
  createdAt: string;
  completedAt?: string;
  eventId?: string;
  targetRef?: string;
  resultData?: {
    summary?: string;
    prUrl?: string;
    prNumber?: number;
    branch?: string;
    filesChanged?: string[];
    draftSubject?: string;
    draftRecipient?: string;
    draftBody?: string;
    testResults?: {
      passed: number;
      failed: number;
      total: number;
      durationMs: number;
      coveragePercent?: number;
    };
  };
}

export type SemanticDocumentType = 'component' | 'communication' | 'task' | 'code' | 'biometric';

export interface SemanticSearchResult {
  id: string;
  documentType: SemanticDocumentType;
  title: string;
  snippet: string;
  similarityScore: number; // 0.0 - 1.0 (e.g. 0.96)
  sourceRef: string;
  componentSlug?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface ComponentManifestFile {
  path: string;
  type: 'component' | 'hook' | 'type' | 'schema' | 'styles';
  content: string;
}

export interface ComponentCliManifest {
  name: string;
  slug: string;
  version: string;
  category: ComponentCategory;
  description: string;
  author: string;
  dependencies: Record<string, string>;
  peerDependencies?: Record<string, string>;
  tailwindConfig: {
    extend?: {
      animation?: Record<string, string>;
      keyframes?: Record<string, any>;
      colors?: Record<string, any>;
    };
  };
  files: ComponentManifestFile[];
  cliCommand: string;
  installCommand: string;
}

// ==============================================================================
// PHASE 4: THEME TOKENIZER, SELF-HEALING & STANDALONE CLI TYPES
// ==============================================================================

export type ThemePresetId = 'minimal-zinc' | 'cyberpunk-emerald' | 'gold-luxury' | 'enterprise-slate';

export interface ThemePreset {
  id: ThemePresetId;
  name: string;
  primaryColor: string;
  primaryBgClass: string;
  primaryTextClass: string;
  primaryBorderClass: string;
  accentGlow: string;
  badgeStyle: string;
  cardBgClass: string;
  fontFamily: string;
  description: string;
  tailwindColors: {
    brand: {
      DEFAULT: string;
      light: string;
      dark: string;
      glow: string;
    };
  };
}

export interface SyntheticFault {
  id: string;
  name: string;
  description: string;
  targetFile: string;
  faultyCodeSnippet: string;
  errorMessage: string;
  stackTrace: string[];
  suggestedFixDiff: string;
}

export interface SelfHealingSession {
  id: string;
  faultId?: string;
  status: 'idle' | 'fault_injected' | 'analyzing' | 'patch_generated' | 'testing' | 'healed' | 'pr_created';
  errorLog?: string;
  patchDiff?: string;
  iteration: number;
  testPassRate: number; // 0 - 100
  prUrl?: string;
  prBranch?: string;
  logs: string[];
}

// ==============================================================================
// PHASE 5: REVERSE INGESTION, VISION-TO-COMPONENT & PRODUCTION GATEWAY TYPES
// ==============================================================================

export type IngestionSourceType = 'local_path' | 'github_repo' | 'raw_snippet' | 'preset';

export interface IngestionAstAnalysis {
  componentsFound: string[];
  hooksFound: string[];
  importsDetected: string[];
  tokensDetected: string[];
  linesOfCode: number;
  complexityScore: 'Low' | 'Medium' | 'High';
}

export interface IngestionResult {
  name: string;
  slug: string;
  version: string;
  category: ComponentCategory;
  description: string;
  tags: string[];
  dependencies: Record<string, string>;
  tailwindConfig?: any;
  extractedFiles: ComponentManifestFile[];
  propControls: PropControl[];
  astAnalysis: IngestionAstAnalysis;
  componentPayload: RegisteredComponent;
}

export interface VisionPresetSample {
  id: string;
  name: string;
  description: string;
  category: ComponentCategory;
  svgDataUri: string;
  suggestedProps: Record<string, any>;
  promptDescription: string;
}

export interface VisionSynthesisInput {
  imageSrc: string;
  imageName: string;
  componentName: string;
  category: ComponentCategory;
  targetTheme: ThemePresetId;
  customColor?: string;
  additionalNotes?: string;
}

export interface VisionSynthesisResult {
  component: RegisteredComponent;
  synthesisTimeMs: number;
  tokensMatched: string[];
  layoutStructure: string[];
  generatedFiles: Record<string, string>;
}

export interface GatewayToken {
  id: string;
  name: string;
  token: string; // sb_live_...
  createdAt: string;
  lastUsed: string;
  scopes: string[];
  rateLimit: string;
  status: 'active' | 'revoked';
}

export interface SystemContainerInfo {
  name: string;
  image: string;
  status: 'running' | 'healthy' | 'starting';
  ports: string;
  cpuPercent: number;
  memoryMb: number;
}

export interface SystemSecretItem {
  key: string;
  isSet: boolean;
  lastRotated: string;
  preview: string;
  description: string;
}

export interface SystemHealthStats {
  gatewayUptime: string;
  cpuUsagePercent: number;
  memoryUsageMb: number;
  activeSandboxes: number;
  pgVectorLatencyMs: number;
  redisState: 'connected' | 'idle' | 'syncing';
  containers: SystemContainerInfo[];
  secrets: SystemSecretItem[];
  recentLogs: string[];
}


