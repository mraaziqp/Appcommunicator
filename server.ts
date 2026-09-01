import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store for ephemeral sandbox sessions and webhook telemetry
const sandboxSessions: Record<string, any> = {};
const webhookLogs: any[] = [];

// ==============================================================================
// PHASE 2: JARVIS ECOSYSTEM IN-MEMORY STORES & SEED DATA
// ==============================================================================

interface EcosystemEventRecord {
  id: string;
  streamType: 'communications' | 'github_lifestack' | 'biometrics' | 'system';
  source: string;
  eventType: string;
  urgency: 'critical' | 'urgent' | 'high' | 'normal' | 'low';
  title: string;
  summary: string;
  payload: Record<string, any>;
  decisionLoopAction: {
    actionId: string;
    actionRecommended: string;
    actionStatus: 'executed' | 'pending_approval' | 'auto_dismissed' | 'deferred';
    confidence: number;
    rationale: string;
    executedAt?: string;
  };
  receivedAt: string;
  processed: boolean;
}

let jarvisEcosystemEvents: EcosystemEventRecord[] = [
  {
    id: 'evt_bio_091',
    streamType: 'biometrics',
    source: 'galaxy_watch_4',
    eventType: 'biometrics.stress_spike',
    urgency: 'high',
    title: 'Elevated Stress Index Detected (82/100)',
    summary: 'Galaxy Watch 4 telemetry detected elevated sympathetic nervous activation & HRV dip (31ms) during high PR review load.',
    payload: {
      heartRateBpm: 94,
      stressIndex: 82,
      hrvMs: 31,
      device: 'Samsung Galaxy Watch 4 Classic (SM-R890)',
    },
    decisionLoopAction: {
      actionId: 'act_bio_091',
      actionRecommended: 'Suggested 10-min cognitive reset buffer & silenced non-urgent Slack/Discord notifications',
      actionStatus: 'executed',
      confidence: 0.94,
      rationale: 'Bio-adaptive load balancing: preventing cognitive fatigue during active deployment sprint.',
      executedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    },
    receivedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    processed: true,
  },
  {
    id: 'evt_comm_084',
    streamType: 'communications',
    source: 'microsoft_graph',
    eventType: 'email.received',
    urgency: 'urgent',
    title: 'Urgent: Production Auth Gateway SSL Renewal Required',
    summary: 'Email from Infrastructure Ops (Elena Rostova) warning that api-auth.satellite.io cert expires in 4 hours.',
    payload: {
      provider: 'm365_graph',
      senderEmail: 'elena.rostova@satellite.internal',
      subject: 'URGENT: Production Auth Gateway SSL cert expires in 4 hours',
      threadId: 'th_graph_882194',
      extractedActionItems: ['Rotate SSL cert on edge proxy', 'Verify automated Certbot acme DNS challenge'],
    },
    decisionLoopAction: {
      actionId: 'act_comm_084',
      actionRecommended: 'Drafted quick confirmation reply & flagged P0 task in LifeStack sprint',
      actionStatus: 'pending_approval',
      confidence: 0.98,
      rationale: 'Time-critical production security certificate expiration within <4 hours.',
    },
    receivedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    processed: true,
  },
  {
    id: 'evt_gh_072',
    streamType: 'github_lifestack',
    source: 'github_webhook',
    eventType: 'pull_request.review_requested',
    urgency: 'normal',
    title: 'PR #48: Refactor Monaco Editor Split View & Telemetry Hooks',
    summary: 'PR #48 merged to main. GitHub Actions CI pipeline passed in 42s across 18 unit suites.',
    payload: {
      repo: 'second-brain/satellite-portal',
      prNumber: 48,
      author: 'dev-alex',
      ciStatus: 'success',
      commitHash: '7c89fb2',
    },
    decisionLoopAction: {
      actionId: 'act_gh_072',
      actionRecommended: 'Auto-updated LifeStack task #104 status to "Completed" and synced deployment preview',
      actionStatus: 'executed',
      confidence: 0.96,
      rationale: 'Direct correlation between merged PR #48 and active LifeStack sprint item.',
      executedAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    },
    receivedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    processed: true,
  },
];

let communicationsStore: any[] = [
  {
    id: 'comm_001',
    provider: 'm365_graph',
    senderName: 'Elena Rostova (Infra Lead)',
    senderEmail: 'elena.rostova@satellite.internal',
    subject: 'URGENT: Production Auth Gateway SSL cert expires in 4 hours',
    snippet: 'Hey team, Certbot acme-challenge failed for api-auth.satellite.io due to DNS CAA restriction...',
    body: 'Hey team,\n\nOur automatic Certbot acme-challenge failed for api-auth.satellite.io due to DNS CAA restriction update on Cloudflare. The production certificate will expire at 18:00 UTC today (approx 4 hours).\n\nPlease verify manual DNS TXT verification token or roll the wildcard certificate immediately.\n\nThanks,\nElena',
    threadId: 'th_graph_882194',
    receivedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    isUrgent: true,
    extractedActionItems: [
      'Roll wildcard certificate or manual DNS TXT token',
      'Verify Cloudflare CAA records before 18:00 UTC',
    ],
    aiSummary: 'Critical 4-hour SSL expiration on api-auth.satellite.io caused by Cloudflare CAA record mismatch. Requires manual TXT record insertion or wildcard rollover.',
    sentiment: 'urgent',
  },
  {
    id: 'comm_002',
    provider: 'imap',
    senderName: 'Marcus Vance (Partner Architect)',
    senderEmail: 'm.vance@apex-synergy.io',
    subject: 'Feedback on Synergy Cam UI Component & WebRTC HUD',
    snippet: 'We tested the Synergy Cam UI package in our staging environment. Frame rate and HUD shaders are blazing fast...',
    body: 'Hi Alex,\n\nWe benchmarked the Synergy Cam UI component from your component registry on our WebRTC video pipeline. The shader performance (noir, matrix, cyberpunk) is butter smooth at 60 FPS.\n\nCould we get the hook source code for audio VU metering exposed directly?\n\nBest regards,\nMarcus',
    threadId: 'th_imap_449120',
    receivedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    isUrgent: false,
    extractedActionItems: [
      'Expose audio VU metering hook in hooks.ts for Synergy Cam UI',
    ],
    aiSummary: 'Positive integration feedback on Synergy Cam UI component. Requested export of standalone audio VU metering hook.',
    sentiment: 'positive',
  },
  {
    id: 'comm_003',
    provider: 'm365_graph',
    senderName: 'GitHub Enterprise Bot',
    senderEmail: 'notifications@github.com',
    subject: '[CI/CD] Staging deployment successful for build #284',
    snippet: 'All 24 integration test suites passed. Deployed to staging cluster europe-west1-d...',
    body: 'Commit 92ef41b by alex: "Optimize Monaco dynamic usage code synthesis"\nDeployed to https://staging.satellite.io\nBuild duration: 1m 14s',
    threadId: 'th_graph_110943',
    receivedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    isUrgent: false,
    extractedActionItems: [],
    aiSummary: 'Automated notification: Staging cluster build #284 deployed successfully with zero test failures.',
    sentiment: 'neutral',
  },
];

let githubCommits: any[] = [
  {
    id: 'c_92ef41b',
    repo: 'second-brain/satellite-portal',
    branch: 'main',
    author: 'Alex Mercer',
    message: 'feat: add Monaco dynamic usage code synthesizer & prop mutator drawer',
    addedCount: 4,
    modifiedCount: 6,
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    status: 'passed',
    ciDurationSec: 38,
  },
  {
    id: 'c_448f21a',
    repo: 'second-brain/satellite-portal',
    branch: 'feature/galaxy-watch-biometrics',
    author: 'Alex Mercer',
    message: 'feat: implement Galaxy Watch 4 telemetry parser & stress index model',
    addedCount: 3,
    modifiedCount: 2,
    timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    status: 'passed',
    ciDurationSec: 41,
  },
  {
    id: 'c_1b99a03',
    repo: 'second-brain/satellite-portal',
    branch: 'fix/auth-passkey-fido2',
    author: 'Dev Bot',
    message: 'fix(security): sanitize WebAuthn challenge payload buffer size',
    addedCount: 1,
    modifiedCount: 1,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'passed',
    ciDurationSec: 32,
  },
];

let githubPullRequests: any[] = [
  {
    id: 'pr_52',
    number: 52,
    repo: 'second-brain/satellite-portal',
    title: 'Phase 2: Real-World Ecosystem API & Webhook Ingestion Engine',
    author: 'Alex Mercer',
    reviewState: 'approved',
    ciStatus: 'success',
    branchSource: 'feature/ecosystem-ingestion',
    branchTarget: 'main',
    url: 'https://github.com/second-brain/satellite-portal/pull/52',
    updatedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
  {
    id: 'pr_51',
    number: 51,
    repo: 'second-brain/satellite-portal',
    title: 'Add Live Webcam Shader Filters & HUD overlay for Synergy Cam',
    author: 'Alex Mercer',
    reviewState: 'approved',
    ciStatus: 'success',
    branchSource: 'feature/synergy-cam-shaders',
    branchTarget: 'main',
    url: 'https://github.com/second-brain/satellite-portal/pull/51',
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
];

let lifestackTasks: any[] = [
  {
    id: 'task_001',
    project: 'Ecosystem Bridge',
    title: 'Wire IMAP / Microsoft 365 Graph webhooks into Jarvis decision loops',
    status: 'in_progress',
    priority: 'p0',
    assignee: 'Alex Mercer',
    dueDate: '2026-08-31',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task_002',
    project: 'Biometric Telemetry',
    title: 'Connect Galaxy Watch 4 live vitals stream to /api/jarvis/biometrics',
    status: 'in_progress',
    priority: 'p0',
    assignee: 'Alex Mercer',
    dueDate: '2026-08-31',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task_003',
    project: 'Component Registry',
    title: 'Ship standalone Monaco Code Inspector with dynamic prop mutator',
    status: 'completed',
    priority: 'p1',
    assignee: 'Alex Mercer',
    dueDate: '2026-08-30',
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

let latestBiometrics: any = {
  id: 'bio_latest',
  timestamp: new Date().toISOString(),
  heartRateBpm: 68,
  stressIndex: 28,
  stressLevel: 'relaxed',
  sleepScore: 88,
  totalSleepMin: 462, // 7h 42m
  deepSleepMin: 104, // 1h 44m
  remSleepMin: 118, // 1h 58m
  lightSleepMin: 215, // 3h 35m
  awakeMin: 25,
  sleepStages: [
    { stage: 'awake', startMin: 0, durationMin: 15 },
    { stage: 'light', startMin: 15, durationMin: 65 },
    { stage: 'deep', startMin: 80, durationMin: 90 },
    { stage: 'rem', startMin: 170, durationMin: 60 },
    { stage: 'light', startMin: 230, durationMin: 70 },
    { stage: 'deep', startMin: 300, durationMin: 45 },
    { stage: 'rem', startMin: 345, durationMin: 58 },
    { stage: 'awake', startMin: 403, durationMin: 10 },
  ],
  spo2Percent: 99,
  hrvMs: 56,
  skinTempC: 36.5,
  stepCount: 8420,
  activeEnergyKcal: 540,
  proactiveInsight: 'Optimal physical recovery achieved (Deep Sleep: 22.5%). Circadian rhythm aligned for peak analytical focus until 16:30.',
  deviceModel: 'Samsung Galaxy Watch 4 Classic (SM-R890)',
  batteryPercent: 82,
};

let biometricsHistory: any[] = [
  { ...latestBiometrics },
  {
    id: 'bio_hist_1',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    heartRateBpm: 84,
    stressIndex: 65,
    stressLevel: 'moderate',
    sleepScore: 88,
    spo2Percent: 98,
    hrvMs: 44,
    stepCount: 8120,
    proactiveInsight: 'Moderate stress elevation during code compilation. Breathing rate normal.',
  },
  {
    id: 'bio_hist_2',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    heartRateBpm: 66,
    stressIndex: 22,
    stressLevel: 'relaxed',
    sleepScore: 88,
    spo2Percent: 99,
    hrvMs: 62,
    stepCount: 7800,
    proactiveInsight: 'Resting state following lunch walk.',
  },
];


// ==========================================
// 1. GET /api/components
// ==========================================
app.get('/api/components', (req, res) => {
  const { category, query } = req.query;

  const sampleComponents = [
    {
      id: 'synergy-cam-ui',
      name: 'Synergy Cam UI',
      slug: 'synergy-cam-ui',
      category: 'Media & AI UI',
      description: 'Extracted high-performance camera HUD interface with AI facial auto-framing, real-time audio/bitrate telemetry, filter shaders, and stream recorder.',
      version: '2.4.0',
      author: 'Second Brain Core',
      status: 'production',
      lastSyncedAt: new Date().toISOString(),
      secondBrainSourceId: 'sb_node_synergy_cam_094',
      tags: ['Camera', 'Computer Vision', 'HUD', 'WebRTC', 'Aceternity'],
      dependencies: {
        'lucide-react': '^0.546.0',
        'clsx': '^2.1.1',
      },
    },
    {
      id: 'data-stream-table',
      name: 'Data Stream Table',
      slug: 'data-stream-table',
      category: 'Data Display',
      description: 'Virtualized real-time telemetry grid with live pulsing latency values, multi-node search filter, batch selections, and status pills.',
      version: '1.8.2',
      author: 'Satellite Dev Team',
      status: 'production',
      lastSyncedAt: new Date().toISOString(),
      secondBrainSourceId: 'sb_node_data_table_112',
      tags: ['Data Table', 'Streaming', 'Telemetry', 'Virtualization'],
      dependencies: {
        'lucide-react': '^0.546.0',
      },
    },
    {
      id: 'quantum-auth-modal',
      name: 'Quantum Auth Modal',
      slug: 'quantum-auth-modal',
      category: 'Auth & Security',
      description: 'Hardware Passkey (WebAuthn / FIDO2) and 6-digit OTP verification modal with luminous border animations and security indicators.',
      version: '3.1.0',
      author: 'Security WG',
      status: 'production',
      lastSyncedAt: new Date().toISOString(),
      secondBrainSourceId: 'sb_node_auth_modal_883',
      tags: ['Auth', 'WebAuthn', 'Passkey', 'Security', 'Modal'],
      dependencies: {
        'lucide-react': '^0.546.0',
      },
    },
    {
      id: 'bento-telemetry-grid',
      name: 'Bento Telemetry Grid',
      slug: 'bento-telemetry-grid',
      category: 'Layout & Bento',
      description: 'Aceternity-inspired bento grid displaying live CPU cgroups, resident memory footprint, streaming QPS, and Docker cluster health.',
      version: '2.0.1',
      author: 'Infrastructure Guild',
      status: 'production',
      lastSyncedAt: new Date().toISOString(),
      secondBrainSourceId: 'sb_node_bento_grid_404',
      tags: ['Bento', 'Dashboard', 'Metrics', 'Docker'],
      dependencies: {
        'lucide-react': '^0.546.0',
      },
    },
    {
      id: 'booking-operations-drawer',
      name: 'Operations & Booking Drawer',
      slug: 'booking-operations-drawer',
      category: 'Command & Navigation',
      description: 'Service scheduler & agent dispatch drawer with interactive time-slot matrix, tier selection, pricing calculation, and checkout receipt.',
      version: '1.5.0',
      author: 'Operations Guild',
      status: 'production',
      lastSyncedAt: new Date().toISOString(),
      secondBrainSourceId: 'sb_node_booking_drawer_772',
      tags: ['Scheduler', 'Booking', 'Drawer', 'Operations'],
      dependencies: {
        'lucide-react': '^0.546.0',
      },
    },
  ];

  let filtered = sampleComponents;
  if (category && category !== 'All') {
    filtered = filtered.filter((c) => c.category === category);
  }
  if (query && typeof query === 'string') {
    filtered = filtered.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.description.toLowerCase().includes(query.toLowerCase()));
  }

  res.json({
    status: 'success',
    total: filtered.length,
    components: filtered,
  });
});

// ==========================================
// 1.1 GET /api/components/:slug (CLI raw JSON ingestor endpoint)
// ==========================================
app.get('/api/components/:slug', (req, res) => {
  const { slug } = req.params;
  res.json({
    status: 'success',
    slug,
    message: `Raw JSON payload for CLI installer npx second-brain-cli add ${slug}`,
    targetPath: `src/components/ui/${slug}`,
    fetchedAt: new Date().toISOString(),
  });
});

// ==========================================
// 2. POST /api/sandbox-init
// Accepts execution requests to trigger temporary containerized environments
// ==========================================
app.post('/api/sandbox-init', (req, res) => {
  const { componentId, containerType = 'node-isolated', memoryLimitMb = 512 } = req.body;

  const sessionId = `sb_sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const containerId = `docker://secondbrain/satellite-runtime:${componentId || 'default'}`;

  const session = {
    sessionId,
    componentId: componentId || 'synergy-cam-ui',
    containerType,
    containerId,
    status: 'running',
    port: 3000,
    memoryLimitMb,
    createdAt: new Date().toISOString(),
    websocketEndpoint: 'ws://0.0.0.0:3000/socket.io/telemetry',
  };

  sandboxSessions[sessionId] = session;

  res.status(201).json({
    status: 'provisioned',
    message: 'Containerized sandbox environment successfully initialized.',
    ...session,
  });
});

// ==========================================
// 3. POST /api/second-brain-webhook
// Receives and parses REST payloads from the central Second Brain orchestrator
// ==========================================
app.post('/api/second-brain-webhook', (req, res) => {
  const signature = req.headers['x-second-brain-signature'] || 'unsigned';
  const { eventType = 'component.published', source = 'SecondBrain/Core', data = {} } = req.body;

  const eventRecord = {
    eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    eventType,
    source,
    signature,
    data,
    receivedAt: new Date().toISOString(),
    acknowledged: true,
  };

  webhookLogs.unshift(eventRecord);
  if (webhookLogs.length > 50) webhookLogs.pop();

  console.log(`[SecondBrain Webhook Received] Type: ${eventType}, Source: ${source}`);

  res.status(200).json({
    status: 'acknowledged',
    eventId: eventRecord.eventId,
    processedAt: eventRecord.receivedAt,
  });
});

// ==========================================
// 4. GET /api/second-brain-status
// ==========================================
app.get('/api/second-brain-status', (req, res) => {
  res.json({
    status: 'connected',
    orchestratorUrl: process.env.SECOND_BRAIN_ORCHESTRATOR_URL || 'https://second-brain.internal.lan',
    brainVersion: 'v2.4.1-alpha',
    pingMs: 24,
    lastHeartbeat: new Date().toISOString(),
    activeContainers: Object.keys(sandboxSessions).length || 1,
    webhookCount: webhookLogs.length,
    ecosystemEventsCount: jarvisEcosystemEvents.length,
  });
});

// ==============================================================================
// 5. JARVIS ECOSYSTEM INGESTION & PROACTIVE DECISION LOOP APIS
// ==============================================================================

// 5.1 GET /api/jarvis/ecosystem-events
app.get('/api/jarvis/ecosystem-events', (req, res) => {
  const { streamType, urgency } = req.query;
  let events = [...jarvisEcosystemEvents];

  if (streamType && streamType !== 'all') {
    events = events.filter((e) => e.streamType === streamType);
  }
  if (urgency && urgency !== 'all') {
    events = events.filter((e) => e.urgency === urgency);
  }

  res.json({
    status: 'success',
    total: events.length,
    events,
    timestamp: new Date().toISOString(),
  });
});

// 5.2 POST /api/jarvis/webhooks/communications (IMAP / Microsoft 365 Graph Webhook)
app.post('/api/jarvis/webhooks/communications', (req, res) => {
  const {
    provider = 'm365_graph',
    senderName = 'Unknown Sender',
    senderEmail = 'anonymous@domain.internal',
    subject = '(No Subject)',
    body = '',
    threadId = `th_${Date.now()}`,
  } = req.body;

  const isUrgent = 
    /urgent|critical|asap|expires|emergency|fail|down|alert|p0|deadline/i.test(subject) ||
    /urgent|immediate action|within \d+ hours|certbot|security/i.test(body);

  const urgencyRating = isUrgent ? 'urgent' : 'normal';

  // Extract action items with basic heuristics
  const actionItems: string[] = [];
  const lines = body.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('-') || trimmed.startsWith('*') || /please|need to|must|verify|rotate|fix/i.test(trimmed)) {
      if (trimmed.length > 5 && trimmed.length < 120) {
        actionItems.push(trimmed.replace(/^[-*]\s*/, ''));
      }
    }
  }

  const aiSummary = isUrgent
    ? `URGENT ACTION ITEM: ${subject}. Sender requires prompt resolution regarding: ${body.substring(0, 100)}...`
    : `Summary of email thread: ${subject} from ${senderName}.`;

  const newComm = {
    id: `comm_${Date.now()}`,
    provider,
    senderName,
    senderEmail,
    subject,
    snippet: body.substring(0, 120),
    body,
    threadId,
    receivedAt: new Date().toISOString(),
    isUrgent,
    extractedActionItems: actionItems.slice(0, 3),
    aiSummary,
    sentiment: isUrgent ? 'urgent' : 'neutral',
  };

  communicationsStore.unshift(newComm);
  if (communicationsStore.length > 30) communicationsStore.pop();

  // Create Jarvis Decision Loop Event
  const eventId = `evt_comm_${Date.now()}`;
  const decisionAction = {
    actionId: `act_${Date.now()}`,
    actionRecommended: isUrgent
      ? `Auto-drafted urgent reply, generated calendar buffer, and marked P0 in LifeStack`
      : `Categorized into Communications Digest and marked low priority`,
    actionStatus: (isUrgent ? 'pending_approval' : 'executed') as 'pending_approval' | 'executed',
    confidence: isUrgent ? 0.97 : 0.91,
    rationale: isUrgent
      ? 'High urgency markers detected in email subject/body requiring immediate developer awareness.'
      : 'Standard communication thread processed without blocker indicators.',
    executedAt: isUrgent ? undefined : new Date().toISOString(),
  };

  const ecosystemEvent: EcosystemEventRecord = {
    id: eventId,
    streamType: 'communications',
    source: provider === 'm365_graph' ? 'microsoft_graph' : 'imap',
    eventType: 'email.received',
    urgency: urgencyRating,
    title: `${isUrgent ? '🚨 ' : ''}${subject}`,
    summary: aiSummary,
    payload: {
      provider,
      senderName,
      senderEmail,
      subject,
      threadId,
      extractedActionItems: actionItems,
    },
    decisionLoopAction: decisionAction,
    receivedAt: new Date().toISOString(),
    processed: true,
  };

  jarvisEcosystemEvents.unshift(ecosystemEvent);
  if (jarvisEcosystemEvents.length > 60) jarvisEcosystemEvents.pop();

  console.log(`[Jarvis Communications Webhook Ingested] Provider: ${provider}, Subject: "${subject}", Urgent: ${isUrgent}`);

  res.status(201).json({
    status: 'ingested',
    message: 'Communications webhook parsed and dispatched to jarvisEcosystemEvents table.',
    communication: newComm,
    ecosystemEvent,
  });
});

// 5.3 GET /api/jarvis/communications
app.get('/api/jarvis/communications', (req, res) => {
  res.json({
    status: 'success',
    total: communicationsStore.length,
    communications: communicationsStore,
  });
});

// 5.4 POST /api/jarvis/webhooks/github
app.post('/api/jarvis/webhooks/github', (req, res) => {
  const {
    eventType = 'push',
    repo = 'second-brain/satellite-portal',
    branch = 'main',
    author = 'Alex Mercer',
    message = 'Update build artifacts',
    ciStatus = 'success',
    prNumber,
    prTitle,
  } = req.body;

  const isCiFailure = ciStatus === 'failure';
  const urgency = isCiFailure ? 'critical' : 'normal';

  const newCommit = {
    id: `c_${Math.random().toString(36).substring(2, 9)}`,
    repo,
    branch,
    author,
    message,
    addedCount: Math.floor(Math.random() * 5) + 1,
    modifiedCount: Math.floor(Math.random() * 8) + 1,
    timestamp: new Date().toISOString(),
    status: ciStatus,
    ciDurationSec: Math.floor(Math.random() * 30) + 25,
  };

  githubCommits.unshift(newCommit);
  if (githubCommits.length > 30) githubCommits.pop();

  // If PR update
  if (prNumber) {
    const existingPrIndex = githubPullRequests.findIndex((p) => p.number === prNumber);
    const prData = {
      id: `pr_${prNumber}`,
      number: prNumber,
      repo,
      title: prTitle || `PR #${prNumber}`,
      author,
      reviewState: isCiFailure ? 'changes_requested' : 'approved',
      ciStatus,
      branchSource: branch,
      branchTarget: 'main',
      url: `https://github.com/${repo}/pull/${prNumber}`,
      updatedAt: new Date().toISOString(),
    };

    if (existingPrIndex >= 0) {
      githubPullRequests[existingPrIndex] = prData;
    } else {
      githubPullRequests.unshift(prData);
    }
  }

  // Record ecosystem event
  const ecosystemEvent: EcosystemEventRecord = {
    id: `evt_gh_${Date.now()}`,
    streamType: 'github_lifestack',
    source: 'github_webhook',
    eventType: eventType === 'pull_request' ? 'github.pull_request' : 'github.push',
    urgency,
    title: isCiFailure
      ? `❌ CI Failure: ${repo} (${branch})`
      : `✅ Build Passed: ${repo} (${branch})`,
    summary: `${author}: "${message}" — CI Status: ${ciStatus.toUpperCase()}`,
    payload: {
      repo,
      branch,
      author,
      commitHash: newCommit.id,
      ciStatus,
    },
    decisionLoopAction: {
      actionId: `act_gh_${Date.now()}`,
      actionRecommended: isCiFailure
        ? `Alert developer of broken unit tests on ${branch} and freeze auto-merge pipeline`
        : `Synchronized LifeStack sprint tasks and triggered preview deployment`,
      actionStatus: 'executed',
      confidence: 0.98,
      rationale: isCiFailure
        ? 'Prevent broken build artifacts from propagating to container cluster.'
        : 'Automated CI/CD validation flow succeeded.',
      executedAt: new Date().toISOString(),
    },
    receivedAt: new Date().toISOString(),
    processed: true,
  };

  jarvisEcosystemEvents.unshift(ecosystemEvent);
  if (jarvisEcosystemEvents.length > 60) jarvisEcosystemEvents.pop();

  res.status(201).json({
    status: 'ingested',
    commit: newCommit,
    ecosystemEvent,
  });
});

// 5.5 POST /api/jarvis/webhooks/lifestack
app.post('/api/jarvis/webhooks/lifestack', (req, res) => {
  const {
    taskId = `task_${Date.now()}`,
    project = 'Ecosystem Bridge',
    title = 'Updated LifeStack Milestone',
    status = 'in_progress',
    priority = 'p1',
    assignee = 'Alex Mercer',
  } = req.body;

  const existingIndex = lifestackTasks.findIndex((t) => t.id === taskId);
  const taskObj = {
    id: taskId,
    project,
    title,
    status,
    priority,
    assignee,
    dueDate: '2026-08-31',
    updatedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    lifestackTasks[existingIndex] = taskObj;
  } else {
    lifestackTasks.unshift(taskObj);
  }

  const ecosystemEvent: EcosystemEventRecord = {
    id: `evt_ls_${Date.now()}`,
    streamType: 'github_lifestack',
    source: 'lifestack',
    eventType: 'lifestack.task_updated',
    urgency: priority === 'p0' ? 'high' : 'normal',
    title: `📋 LifeStack Task [${priority.toUpperCase()}]: ${title}`,
    summary: `Task updated to "${status}" under project "${project}". Assigned to ${assignee}.`,
    payload: taskObj,
    decisionLoopAction: {
      actionId: `act_ls_${Date.now()}`,
      actionRecommended: `Re-evaluated active focus schedule and synchronized context with local IDE`,
      actionStatus: 'executed',
      confidence: 0.93,
      rationale: 'Keeping Jarvis aware of developer real-time focus states.',
      executedAt: new Date().toISOString(),
    },
    receivedAt: new Date().toISOString(),
    processed: true,
  };

  jarvisEcosystemEvents.unshift(ecosystemEvent);
  if (jarvisEcosystemEvents.length > 60) jarvisEcosystemEvents.pop();

  res.status(201).json({
    status: 'ingested',
    task: taskObj,
    ecosystemEvent,
  });
});

// 5.6 GET /api/jarvis/github-lifestack
app.get('/api/jarvis/github-lifestack', (req, res) => {
  res.json({
    status: 'success',
    commits: githubCommits,
    pullRequests: githubPullRequests,
    tasks: lifestackTasks,
  });
});

// 5.7 POST /api/jarvis/biometrics (Galaxy Watch 4 Continuous Ingestion Endpoint)
app.post('/api/jarvis/biometrics', (req, res) => {
  const {
    heartRateBpm = 72,
    stressIndex = 35,
    sleepScore = 85,
    deepSleepMin = 90,
    remSleepMin = 110,
    lightSleepMin = 210,
    awakeMin = 20,
    spo2Percent = 98,
    hrvMs = 52,
    skinTempC = 36.5,
    stepCount = 8500,
    activeEnergyKcal = 520,
    deviceModel = 'Samsung Galaxy Watch 4 Classic (SM-R890)',
  } = req.body;

  let stressLevel: 'relaxed' | 'normal' | 'moderate' | 'elevated' | 'critical' = 'normal';
  if (stressIndex < 30) stressLevel = 'relaxed';
  else if (stressIndex <= 55) stressLevel = 'normal';
  else if (stressIndex <= 75) stressLevel = 'moderate';
  else if (stressIndex <= 88) stressLevel = 'elevated';
  else stressLevel = 'critical';

  let proactiveInsight = '';
  let urgency: 'critical' | 'urgent' | 'high' | 'normal' | 'low' = 'normal';
  let actionRecommended = 'Telemetry logged in jarvisBiometrics table. Vitals nominal.';

  if (stressLevel === 'critical') {
    urgency = 'critical';
    proactiveInsight = `CRITICAL sympathetic nervous activation (Stress: ${stressIndex}/100, HR: ${heartRateBpm} BPM). Recommend immediate cognitive reset.`;
    actionRecommended = 'Triggered bio-adaptive focus shield: Muted non-critical notifications & queued boxed breathing prompt';
  } else if (stressLevel === 'elevated') {
    urgency = 'high';
    proactiveInsight = `Elevated sympathetic nervous activation (Stress: ${stressIndex}/100, HR: ${heartRateBpm} BPM, HRV: ${hrvMs}ms). Recommend 5-10m cognitive pacing reset.`;
    actionRecommended = 'Triggered bio-adaptive focus shield: Muted non-critical Slack notifications & queued 5-minute boxed breathing prompt';
  } else if (sleepScore < 65) {
    urgency = 'high';
    proactiveInsight = `Suboptimal sleep recovery (Sleep Score: ${sleepScore}/100, Deep Sleep: ${deepSleepMin}m). Recommend deferring high-risk prod deployments to tomorrow morning.`;
    actionRecommended = 'Adjusted daily deep work schedule to morning peak energy window';
  } else {
    urgency = 'normal';
    proactiveInsight = `Excellent baseline vitals. Heart rate (${heartRateBpm} BPM) and Stress (${stressIndex}/100) indicate high cognitive readiness.`;
    actionRecommended = 'Vitals optimal: Jarvis maintaining full-throttle dev assistance mode';
  }

  const updatedBiometrics = {
    id: `bio_${Date.now()}`,
    timestamp: new Date().toISOString(),
    heartRateBpm: Number(heartRateBpm),
    stressIndex: Number(stressIndex),
    stressLevel,
    sleepScore: Number(sleepScore),
    totalSleepMin: deepSleepMin + remSleepMin + lightSleepMin + awakeMin,
    deepSleepMin: Number(deepSleepMin),
    remSleepMin: Number(remSleepMin),
    lightSleepMin: Number(lightSleepMin),
    awakeMin: Number(awakeMin),
    sleepStages: latestBiometrics.sleepStages,
    spo2Percent: Number(spo2Percent),
    hrvMs: Number(hrvMs),
    skinTempC: Number(skinTempC),
    stepCount: Number(stepCount),
    activeEnergyKcal: Number(activeEnergyKcal),
    proactiveInsight,
    deviceModel,
    batteryPercent: latestBiometrics.batteryPercent || 80,
  };

  latestBiometrics = updatedBiometrics;
  biometricsHistory.unshift(updatedBiometrics);
  if (biometricsHistory.length > 40) biometricsHistory.pop();

  // Create ecosystem event if significant or every 10 logs
  if (urgency === 'high' || urgency === 'critical' || Math.random() > 0.4) {
    const ecosystemEvent: EcosystemEventRecord = {
      id: `evt_bio_${Date.now()}`,
      streamType: 'biometrics',
      source: 'galaxy_watch_4',
      eventType: stressLevel === 'elevated' || stressLevel === 'critical' ? 'biometrics.stress_spike' : 'biometrics.vitals_logged',
      urgency,
      title: `⌚ Galaxy Watch 4: HR ${heartRateBpm} BPM • Stress ${stressIndex}/100 (${stressLevel.toUpperCase()})`,
      summary: proactiveInsight,
      payload: {
        heartRateBpm,
        stressIndex,
        stressLevel,
        sleepScore,
        hrvMs,
        deviceModel,
      },
      decisionLoopAction: {
        actionId: `act_bio_${Date.now()}`,
        actionRecommended,
        actionStatus: 'executed',
        confidence: 0.95,
        rationale: 'Continuous biometric monitoring and real-time stress index loop.',
        executedAt: new Date().toISOString(),
      },
      receivedAt: new Date().toISOString(),
      processed: true,
    };

    jarvisEcosystemEvents.unshift(ecosystemEvent);
    if (jarvisEcosystemEvents.length > 60) jarvisEcosystemEvents.pop();
  }

  res.status(201).json({
    status: 'logged',
    message: 'Galaxy Watch 4 telemetry ingested successfully into /api/jarvis/biometrics pipeline.',
    vitals: updatedBiometrics,
  });
});

// 5.8 GET /api/jarvis/biometrics
app.get('/api/jarvis/biometrics', (req, res) => {
  res.json({
    status: 'success',
    latest: latestBiometrics,
    history: biometricsHistory,
    deviceStatus: {
      model: 'Samsung Galaxy Watch 4 Classic (SM-R890)',
      connection: 'Bluetooth Low Energy (BLE) / WearOS Webhook',
      battery: `${latestBiometrics.batteryPercent}%`,
      lastSync: latestBiometrics.timestamp,
      sensors: ['PPG Optical Heart Rate', 'BIA Bioelectrical Impedance', 'ECG Sensor', 'SpO2 Pulse Oximeter'],
    },
  });
});

// ==========================================
// 5.9 POST /api/jarvis/decision-loop/action & AUTONOMOUS ACTION ENGINE
// ==========================================

interface AgentTaskRecord {
  id: string;
  title: string;
  mode: 'EXECUTE_CODE_PATCH' | 'EXECUTE_COMMS_DRAFT' | 'EXECUTE_SANDBOX_RUN' | 'EXECUTE_CUSTOM';
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
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

let agentTasksStore: AgentTaskRecord[] = [
  {
    id: 'task_exec_901',
    title: 'PR Generation: Inject Telemetry Rate Limiter into SynergyCam HUD',
    mode: 'EXECUTE_CODE_PATCH',
    status: 'completed',
    progress: 100,
    logs: [
      '[02:01:14] Initialized ephemeral git workspace @ branch: fix/synergycam-telemetry-throttle',
      '[02:01:15] Injected adaptive rAF debouncer in src/components/synergy-cam/hooks.ts',
      '[02:01:16] Executed test runner: 18/18 unit tests passed in 480ms',
      '[02:01:17] Published Pull Request #52 to second-brain/satellite-portal with label: automated-patch',
    ],
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 39 * 60 * 1000).toISOString(),
    targetRef: 'synergy-cam',
    resultData: {
      summary: 'Automated patch created PR #52 with debounce fix and test verification.',
      prUrl: 'https://github.com/second-brain/satellite-portal/pull/52',
      prNumber: 52,
      branch: 'fix/synergycam-telemetry-throttle',
      filesChanged: ['src/components/synergy-cam/hooks.ts', 'src/components/synergy-cam/types.ts'],
    },
  },
  {
    id: 'task_exec_902',
    title: 'Containerized Sandbox Validation: Neon Metrics Grid Test Suite',
    mode: 'EXECUTE_SANDBOX_RUN',
    status: 'completed',
    progress: 100,
    logs: [
      '[02:14:02] Provisioned ephemeral Docker container: docker://secondbrain/test-runner:v2.1',
      '[02:14:03] Running ESLint v9 & TypeScript strict typecheck on neon-metrics-grid',
      '[02:14:04] Running Vitest suite (bento-cgroups.test.tsx, memory-gauge.test.tsx)',
      '[02:14:05] All suites green (24 passed, 0 failed). Bundle payload verified: 8.4 KB gzip.',
    ],
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
    targetRef: 'neon-metrics-grid',
    resultData: {
      summary: 'Verified 24 unit test cases across container cgroup calculators. Zero regressions.',
      testResults: {
        passed: 24,
        failed: 0,
        total: 24,
        durationMs: 1120,
        coveragePercent: 98.4,
      },
    },
  },
  {
    id: 'task_exec_903',
    title: 'Draft Contextual Comms Reply: SSL Gateway Expiration Response',
    mode: 'EXECUTE_COMMS_DRAFT',
    status: 'completed',
    progress: 100,
    logs: [
      '[02:22:10] Ingested email thread th_graph_882194 from Elena Rostova (Infrastructure Ops)',
      '[02:22:11] Queried Neon pgvector memory for recent SSL renewal runbooks & Certbot configs',
      '[02:22:12] Synthesized contextual reply with DNS ACME challenge confirmation',
      '[02:22:13] Queued draft in Outbox with 1-click approve dispatch',
    ],
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 9 * 60 * 1000).toISOString(),
    eventId: 'evt_comm_084',
    resultData: {
      draftSubject: 'Re: URGENT: Production Auth Gateway SSL cert expires in 4 hours',
      draftRecipient: 'elena.rostova@satellite.internal',
      draftBody: 'Hi Elena,\n\nAcknowledged. The automated Certbot ACME challenge on Cloudflare DNS has been verified. The edge proxy certificate rotation script is scheduled for deployment on staging first, then rolled to production auth nodes with zero downtime.\n\nBest,\nJarvis Second Brain Agent',
    },
  },
];

app.post('/api/jarvis/decision-loop/action', (req, res) => {
  const { eventId, decision = 'execute', executionMode } = req.body;
  const event = jarvisEcosystemEvents.find((e) => e.id === eventId);

  if (!event && eventId) {
    return res.status(404).json({ status: 'error', message: 'Event not found' });
  }

  if (decision === 'execute') {
    if (event) {
      event.decisionLoopAction.actionStatus = 'executed';
      event.decisionLoopAction.executedAt = new Date().toISOString();
    }

    // Determine execution mode
    let mode: 'EXECUTE_CODE_PATCH' | 'EXECUTE_COMMS_DRAFT' | 'EXECUTE_SANDBOX_RUN' | 'EXECUTE_CUSTOM' = 'EXECUTE_CODE_PATCH';
    if (executionMode) {
      mode = executionMode;
    } else if (event?.streamType === 'communications') {
      mode = 'EXECUTE_COMMS_DRAFT';
    } else if (event?.streamType === 'biometrics') {
      mode = 'EXECUTE_SANDBOX_RUN';
    }

    const taskId = `task_exec_${Date.now().toString().slice(-4)}_${Math.random().toString(36).substring(2, 5)}`;
    const taskTitle = event 
      ? `Auto-Execution: ${event.decisionLoopAction.actionRecommended.slice(0, 55)}...`
      : `Autonomous Action: ${mode.replace('EXECUTE_', '').toLowerCase()}`;

    let resultData: any = {};
    const nowIso = new Date().toISOString();

    if (mode === 'EXECUTE_CODE_PATCH') {
      resultData = {
        summary: `Automated PR generated for ${event?.title || 'Code Patch'}. CI builds initiated.`,
        prUrl: `https://github.com/second-brain/satellite-portal/pull/${Math.floor(Math.random() * 40) + 55}`,
        prNumber: Math.floor(Math.random() * 40) + 55,
        branch: `jarvis/patch-${Date.now().toString().slice(-4)}`,
        filesChanged: ['src/components/ui/patch.ts', 'src/db/schema.ts'],
      };
    } else if (mode === 'EXECUTE_COMMS_DRAFT') {
      resultData = {
        draftSubject: `Re: ${event?.payload?.subject || event?.title || 'Status Update'}`,
        draftRecipient: event?.payload?.senderEmail || 'team@satellite.internal',
        draftBody: `Hi team,\n\nJarvis Second Brain has processed this update. Action items have been indexed into our LifeStack sprint queue and dependencies resolved.\n\nAutomated via Second Brain Satellite Agent.`,
      };
    } else if (mode === 'EXECUTE_SANDBOX_RUN') {
      resultData = {
        summary: `Containerized test suite executed on isolated runner in 940ms.`,
        testResults: {
          passed: 16,
          failed: 0,
          total: 16,
          durationMs: 940,
          coveragePercent: 96.8,
        },
      };
    }

    const newTask: AgentTaskRecord = {
      id: taskId,
      title: taskTitle,
      mode,
      status: 'completed',
      progress: 100,
      logs: [
        `[${nowIso.slice(11, 19)}] Dispatched agentic tool call: ${mode}`,
        `[${nowIso.slice(11, 19)}] Evaluated context & constraints in Neon memory`,
        `[${nowIso.slice(11, 19)}] Execution completed successfully. Artifacts persisted to action queue.`,
      ],
      createdAt: nowIso,
      completedAt: nowIso,
      eventId: event?.id,
      resultData,
    };

    agentTasksStore.unshift(newTask);
    if (agentTasksStore.length > 30) agentTasksStore.pop();

    return res.json({
      status: 'success',
      message: `Action executed successfully via ${mode}`,
      task: newTask,
      event,
    });
  } else if (decision === 'dismiss') {
    if (event) event.decisionLoopAction.actionStatus = 'auto_dismissed';
  } else if (decision === 'defer') {
    if (event) event.decisionLoopAction.actionStatus = 'deferred';
  }

  res.json({
    status: 'success',
    message: `Decision action status updated to "${event?.decisionLoopAction?.actionStatus || decision}"`,
    event,
  });
});

// 5.10 GET /api/jarvis/action-queue (List Agent Tasks)
app.get('/api/jarvis/action-queue', (req, res) => {
  res.json({
    status: 'success',
    total: agentTasksStore.length,
    tasks: agentTasksStore,
    timestamp: new Date().toISOString(),
  });
});

// 5.11 POST /api/jarvis/action-queue/trigger (Direct manual dispatch)
app.post('/api/jarvis/action-queue/trigger', (req, res) => {
  const { title, mode = 'EXECUTE_SANDBOX_RUN', targetRef = 'synergy-cam' } = req.body;
  const taskId = `task_exec_${Date.now().toString().slice(-4)}_${Math.random().toString(36).substring(2, 5)}`;
  const nowIso = new Date().toISOString();

  let resultData: any = {};
  if (mode === 'EXECUTE_CODE_PATCH') {
    resultData = {
      summary: `Automated patch applied to ${targetRef}. Generated PR #${Math.floor(Math.random() * 30) + 60}.`,
      prUrl: `https://github.com/second-brain/satellite-portal/pull/${Math.floor(Math.random() * 30) + 60}`,
      prNumber: Math.floor(Math.random() * 30) + 60,
      branch: `jarvis/feature-${targetRef}`,
      filesChanged: [`src/components/${targetRef}/Component.tsx`, `src/components/${targetRef}/hooks.ts`],
    };
  } else if (mode === 'EXECUTE_COMMS_DRAFT') {
    resultData = {
      draftSubject: `Update on Component [${targetRef}] Status`,
      draftRecipient: 'product-ops@satellite.internal',
      draftBody: `Hi team,\n\nComponent ${targetRef} has been validated and packaged for CLI distribution. You can now test it using "npx @second-brain/cli add ${targetRef}".\n\nJarvis Agent`,
    };
  } else {
    resultData = {
      summary: `Containerized test & build runner passed on isolated sandbox node.`,
      testResults: {
        passed: 20,
        failed: 0,
        total: 20,
        durationMs: 820,
        coveragePercent: 99.1,
      },
    };
  }

  const newTask: AgentTaskRecord = {
    id: taskId,
    title: title || `Agent Execution: ${mode.replace('EXECUTE_', '')} (${targetRef})`,
    mode,
    status: 'completed',
    progress: 100,
    logs: [
      `[${nowIso.slice(11, 19)}] Tool calling initiated: ${mode} on target [${targetRef}]`,
      `[${nowIso.slice(11, 19)}] Running AST validation and semantic diff checks`,
      `[${nowIso.slice(11, 19)}] Task finished with exit code 0. Artifacts generated.`,
    ],
    createdAt: nowIso,
    completedAt: nowIso,
    targetRef,
    resultData,
  };

  agentTasksStore.unshift(newTask);
  if (agentTasksStore.length > 30) agentTasksStore.pop();

  res.status(201).json({
    status: 'success',
    message: 'Agent task queued and executed successfully.',
    task: newTask,
  });
});

// ==============================================================================
// 6. PHASE 3: SEMANTIC MEMORY & NEURAL RETRIEVAL (pgvector / Neon Scaffolding)
// ==============================================================================

interface MemoryDocument {
  id: string;
  documentType: 'component' | 'communication' | 'task' | 'code' | 'biometric';
  title: string;
  snippet: string;
  sourceRef: string;
  componentSlug?: string;
  tags: string[];
  keywords: string[];
}

const memoryDocuments: MemoryDocument[] = [
  {
    id: 'mem_comp_01',
    documentType: 'component',
    title: 'SynergyCam Pro Component & WebRTC Hook',
    snippet: 'Extracted high-performance camera HUD interface with AI facial auto-framing, real-time audio/bitrate telemetry, filter shaders (Cyberpunk, Matrix, Infrared), and WebRTC stream recorder.',
    sourceRef: 'src/components/synergy-cam/Component.tsx',
    componentSlug: 'synergy-cam',
    tags: ['Camera', 'Computer Vision', 'HUD', 'WebRTC', 'Aceternity', 'Video'],
    keywords: ['camera', 'webrtc', 'stream', 'video', 'hud', 'facial', 'filters', 'recording', 'synergycam'],
  },
  {
    id: 'mem_comp_02',
    documentType: 'component',
    title: 'Quantum Passkey & Hardware Authenticator',
    snippet: 'Hardware Passkey (WebAuthn / FIDO2) and 6-digit OTP verification modal with luminous border animations, biometric prompt, and cryptographic signing indicators.',
    sourceRef: 'src/components/quantum-passkey/Component.tsx',
    componentSlug: 'quantum-passkey',
    tags: ['Auth', 'WebAuthn', 'Passkey', 'Security', 'Modal', 'FIDO2'],
    keywords: ['auth', 'passkey', 'webauthn', 'fido2', 'security', 'login', 'otp', 'biometrics', 'quantum'],
  },
  {
    id: 'mem_comp_03',
    documentType: 'component',
    title: 'Neon Metrics Bento Grid & Docker Telemetry',
    snippet: 'Aceternity-inspired bento grid displaying live CPU cgroups, resident memory footprint, streaming QPS, and Docker cluster health gauges.',
    sourceRef: 'src/components/neon-metrics-grid/Component.tsx',
    componentSlug: 'neon-metrics-grid',
    tags: ['Bento', 'Dashboard', 'Metrics', 'Docker', 'cgroups', 'Telemetry'],
    keywords: ['metrics', 'bento', 'dashboard', 'docker', 'cgroups', 'cpu', 'memory', 'telemetry', 'grid'],
  },
  {
    id: 'mem_comp_04',
    documentType: 'component',
    title: 'Operations Booking & Agent Dispatch Drawer',
    snippet: 'Service scheduler & agent dispatch drawer with interactive time-slot matrix, tier selection (Standard, Express, Dedicated), pricing calculation, and checkout receipt.',
    sourceRef: 'src/components/operations-booking-drawer/Component.tsx',
    componentSlug: 'operations-booking-drawer',
    tags: ['Scheduler', 'Booking', 'Drawer', 'Operations', 'Payments'],
    keywords: ['booking', 'operations', 'drawer', 'scheduler', 'timeslot', 'pricing', 'checkout', 'dispatch'],
  },
  {
    id: 'mem_comp_05',
    documentType: 'component',
    title: 'Data Stream Table & Virtualized Telemetry',
    snippet: 'Virtualized real-time telemetry grid with live pulsing latency values, multi-node search filter, batch selections, and status pills.',
    sourceRef: 'src/components/data-stream-table/Component.tsx',
    componentSlug: 'data-stream-table',
    tags: ['Data Table', 'Streaming', 'Telemetry', 'Virtualization'],
    keywords: ['table', 'stream', 'data', 'virtualization', 'latency', 'grid', 'telemetry', 'filter'],
  },
  {
    id: 'mem_comm_01',
    documentType: 'communication',
    title: 'M365 Email: Production Auth Gateway SSL Cert Expiration',
    snippet: 'Elena Rostova: "api-auth.satellite.io SSL certificate expires in <4 hours. Action items: rotate edge proxy cert & verify Certbot ACME challenge."',
    sourceRef: 'Email Thread th_graph_882194',
    tags: ['M365 Graph', 'SSL', 'Security', 'Infra', 'P0'],
    keywords: ['ssl', 'cert', 'elena', 'auth', 'gateway', 'security', 'expiration', 'certbot', 'email'],
  },
  {
    id: 'mem_comm_02',
    documentType: 'communication',
    title: 'IMAP Alert: Stripe Webhook Signature Mismatch in Billing API',
    snippet: 'Billing Webhook Dispatcher: "HTTP 401 signature verification failed for invoice.payment_succeeded. Needs signing secret sync in .env."',
    sourceRef: 'IMAP Message #4029',
    tags: ['Stripe', 'Billing', 'Webhooks', 'Signature', 'Error'],
    keywords: ['stripe', 'billing', 'webhook', 'signature', 'payment', '401', 'invoice', 'error'],
  },
  {
    id: 'mem_task_01',
    documentType: 'task',
    title: 'LifeStack Sprint Task: Migrate Component Registry to Neon pgvector',
    snippet: 'Status: In Progress | Priority: P1 | Assignee: Satellite Team. Objectives: Embed component files & communication threads as 1536-dim vectors for instant semantic RAG.',
    sourceRef: 'LifeStack Task #LS-304',
    tags: ['LifeStack', 'Sprint', 'pgvector', 'Neon', 'Semantic'],
    keywords: ['pgvector', 'neon', 'lifestack', 'sprint', 'vector', 'embeddings', 'rag', 'semantic', 'task'],
  },
  {
    id: 'mem_task_02',
    documentType: 'task',
    title: 'GitHub PR #48: Refactor Monaco Split View & Telemetry Hooks',
    snippet: 'Merged to main by Marcus Vance. Unit tests 18/18 green. Added support for live CSS injections and multi-tab code inspector.',
    sourceRef: 'GitHub PR #48',
    tags: ['GitHub', 'PR', 'Monaco', 'Split View', 'CI/CD'],
    keywords: ['github', 'pr', 'monaco', 'split', 'telemetry', 'ci', 'actions', 'marcus'],
  },
  {
    id: 'mem_bio_01',
    documentType: 'biometric',
    title: 'Galaxy Watch 4 Biometrics: Elevated Stress Index & Focus Shield',
    snippet: 'Samsung Galaxy Watch 4 Classic: Stress score reached 82/100 (Sympathetic activation, HRV 31ms). Jarvis triggered bio-adaptive focus shield and muted notification noise.',
    sourceRef: 'Galaxy Watch 4 Telemetry Ingestion',
    tags: ['Galaxy Watch 4', 'Biometrics', 'Stress', 'HRV', 'Sleep'],
    keywords: ['watch', 'biometrics', 'stress', 'galaxy', 'heart rate', 'hrv', 'sleep', 'vitals'],
  },
];

// 6.1 POST /api/jarvis/semantic-search
app.post('/api/jarvis/semantic-search', (req, res) => {
  const { query = '', filterType = 'all', limit = 8 } = req.body;
  const q = query.trim().toLowerCase();

  let results: Array<MemoryDocument & { similarityScore: number }> = [];

  if (!q) {
    // Return top documents with baseline scores
    results = memoryDocuments.map((doc, idx) => ({
      ...doc,
      similarityScore: Math.max(0.72, +(0.95 - idx * 0.03).toFixed(2)),
    }));
  } else {
    const queryTokens = q.split(/[\s,.-]+/).filter(Boolean);

    results = memoryDocuments.map((doc) => {
      let score = 0.5; // baseline prior
      const textToSearch = `${doc.title} ${doc.snippet} ${doc.tags.join(' ')} ${doc.keywords.join(' ')}`.toLowerCase();

      // Exact phrase match bonus
      if (textToSearch.includes(q)) {
        score += 0.35;
      }

      // Keyword token matches
      let matchedTokens = 0;
      for (const token of queryTokens) {
        if (textToSearch.includes(token)) {
          matchedTokens++;
          score += 0.12;
        }
      }

      // Tag match bonus
      for (const tag of doc.tags) {
        if (queryTokens.some((t) => tag.toLowerCase().includes(t))) {
          score += 0.08;
        }
      }

      // Semantic proximity simulation (hash-based cosine similarity jitter for realism)
      let hash = 0;
      for (let i = 0; i < q.length; i++) hash = (hash << 5) - hash + q.charCodeAt(i);
      const jitter = (Math.abs(hash % 100) / 100) * 0.08;
      score = Math.min(0.99, +(score + jitter).toFixed(2));

      return {
        ...doc,
        similarityScore: score,
      };
    });

    // Filter out low scores
    results = results.filter((r) => r.similarityScore > 0.58);
  }

  // Apply document type filter
  if (filterType !== 'all') {
    results = results.filter((r) => r.documentType === filterType);
  }

  // Sort by similarity score descending
  results.sort((a, b) => b.similarityScore - a.similarityScore);

  res.json({
    status: 'success',
    query,
    total: results.length,
    results: results.slice(0, limit),
    meta: {
      engine: 'Neon pgvector (1536-dim) + Hybrid BM25',
      recallRate: '98.8%',
      latencyMs: 14,
    },
  });
});

// 6.2 GET /api/jarvis/semantic-search/stats
app.get('/api/jarvis/semantic-search/stats', (req, res) => {
  res.json({
    status: 'success',
    vectorDimension: 1536,
    indexedVectorsCount: memoryDocuments.length * 12 + 88,
    indexType: 'HNSW (Hierarchical Navigable Small World, Cosine)',
    databaseEngine: 'Neon Serverless PostgreSQL 16 + pgvector',
    clustersCount: 4,
    embeddingModel: 'text-embedding-3-small (1536-dim)',
    lastIndexUpdate: new Date().toISOString(),
  });
});

// ==============================================================================
// 7. PHASE 3: CLI DISTRIBUTION PROTOCOL (npx @second-brain/cli add <slug>)
// ==============================================================================

const CLI_COMPONENT_MANIFESTS: Record<string, any> = {
  'synergy-cam': {
    name: 'SynergyCam Pro',
    slug: 'synergy-cam',
    version: '2.4.0',
    category: 'Media & AI UI',
    description: 'Extracted high-performance camera HUD interface with AI facial auto-framing, real-time audio/bitrate telemetry, filter shaders, and stream recorder.',
    author: 'Satellite Dev Team',
    dependencies: {
      'lucide-react': '^0.546.0',
      'clsx': '^2.1.1',
    },
    peerDependencies: {
      'react': '^18.0.0 || ^19.0.0',
      'react-dom': '^18.0.0 || ^19.0.0',
    },
    tailwindConfig: {
      extend: {
        animation: {
          'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'radar-sweep': 'radar 4s linear infinite',
        },
        keyframes: {
          radar: {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
        },
      },
    },
    files: [
      {
        path: 'Component.tsx',
        type: 'component',
        content: `// src/components/ui/synergy-cam/Component.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, Mic, Video, Settings, Radio, Sparkles, RefreshCw, Layers, ShieldCheck, Image } from 'lucide-react';
import { useCameraStream } from './hooks';
import { SynergyCamProps } from './types';

export function SynergyCam({ 
  showTelemetry = true,
  aiFacialTracking = true,
  filterShader = 'None',
  resolution = '1080p',
  bitrateKbps = 4500,
  accentColor = '#06b6d4',
}: SynergyCamProps) {
  const { isLive, fps, audioLevel, toggleStream } = useCameraStream();
  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-2xl p-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-zinc-200">SYNERGY-CAM PRO [LIVE HUD]</span>
        </div>
        <span className="text-[11px] font-mono text-zinc-400">{resolution} • {bitrateKbps} kbps</span>
      </div>
      <div className="relative aspect-video rounded-xl bg-zinc-900 flex items-center justify-center overflow-hidden border border-zinc-800">
        <div className="text-center space-y-2">
          <Camera className="w-10 h-10 text-cyan-400 mx-auto opacity-80" />
          <p className="text-xs font-mono text-zinc-400">WebRTC HUD Active • Filter: {filterShader}</p>
        </div>
      </div>
    </div>
  );
}
export default SynergyCam;
`,
      },
      {
        path: 'hooks.ts',
        type: 'hook',
        content: `// src/components/ui/synergy-cam/hooks.ts
import { useState, useEffect, useCallback } from 'react';

export function useCameraStream() {
  const [isLive, setIsLive] = useState(true);
  const [fps, setFps] = useState(60);
  const [audioLevel, setAudioLevel] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      setFps(59 + Math.floor(Math.random() * 2));
      setAudioLevel(Math.floor(30 + Math.random() * 40));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const toggleStream = useCallback(() => setIsLive(prev => !prev), []);
  return { isLive, fps, audioLevel, toggleStream };
}
`,
      },
      {
        path: 'types.ts',
        type: 'type',
        content: `// src/components/ui/synergy-cam/types.ts
export interface SynergyCamProps {
  showTelemetry?: boolean;
  aiFacialTracking?: boolean;
  filterShader?: 'None' | 'Cyberpunk Neon' | 'Matrix Green' | 'Infrared Thermal';
  resolution?: '720p' | '1080p' | '4K UHD';
  bitrateKbps?: number;
  accentColor?: string;
}
`,
      },
    ],
    cliCommand: 'npx @second-brain/cli add synergy-cam',
    installCommand: 'npx @second-brain/cli add synergy-cam --path ./src/components/ui',
  },
  'quantum-passkey': {
    name: 'Quantum Passkey Authenticator',
    slug: 'quantum-passkey',
    version: '3.1.0',
    category: 'Auth & Security',
    description: 'Hardware Passkey (WebAuthn / FIDO2) and 6-digit OTP verification modal with luminous border animations and security indicators.',
    author: 'Security WG',
    dependencies: {
      'lucide-react': '^0.546.0',
    },
    peerDependencies: {
      'react': '^18.0.0 || ^19.0.0',
      'react-dom': '^18.0.0 || ^19.0.0',
    },
    tailwindConfig: {
      extend: {
        colors: {
          'security-gold': '#fbbf24',
        },
      },
    },
    files: [
      {
        path: 'Component.tsx',
        type: 'component',
        content: `// src/components/ui/quantum-passkey/Component.tsx
import React, { useState } from 'react';
import { Fingerprint, KeyRound, Shield, CheckCircle2 } from 'lucide-react';
import { QuantumPasskeyProps } from './types';

export function QuantumPasskey({ 
  authMode = 'Hardware Passkey (FIDO2)',
  requireBiometricPrompt = true,
  allowOtpFallback = true,
}: QuantumPasskeyProps) {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'verified'>('idle');
  return (
    <div className="max-w-md mx-auto rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
          <Fingerprint className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-100 font-mono">QUANTUM SECURE AUTH</h3>
          <p className="text-xs text-zinc-400">{authMode}</p>
        </div>
      </div>
      <button 
        onClick={() => setStatus('verified')}
        className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs font-mono transition shadow-lg shadow-amber-500/20"
      >
        {status === 'verified' ? 'PASSKEY AUTHENTICATED' : 'TOUCH SECURITY KEY / BIOMETRICS'}
      </button>
    </div>
  );
}
export default QuantumPasskey;
`,
      },
      {
        path: 'types.ts',
        type: 'type',
        content: `// src/components/ui/quantum-passkey/types.ts
export interface QuantumPasskeyProps {
  authMode?: 'Hardware Passkey (FIDO2)' | '6-Digit OTP Fallback' | 'Hybrid Dual-Factor';
  requireBiometricPrompt?: boolean;
  allowOtpFallback?: boolean;
}
`,
      },
    ],
    cliCommand: 'npx @second-brain/cli add quantum-passkey',
    installCommand: 'npx @second-brain/cli add quantum-passkey --path ./src/components/ui',
  },
  'neon-metrics-grid': {
    name: 'Neon Metrics Bento Grid',
    slug: 'neon-metrics-grid',
    version: '2.0.1',
    category: 'Layout & Bento',
    description: 'Aceternity-inspired bento grid displaying live CPU cgroups, resident memory footprint, streaming QPS, and Docker cluster health.',
    author: 'Infrastructure Guild',
    dependencies: {
      'lucide-react': '^0.546.0',
    },
    peerDependencies: {
      'react': '^18.0.0 || ^19.0.0',
      'react-dom': '^18.0.0 || ^19.0.0',
    },
    tailwindConfig: {
      extend: {
        colors: {
          'neon-cyan': '#06b6d4',
        },
      },
    },
    files: [
      {
        path: 'Component.tsx',
        type: 'component',
        content: `// src/components/ui/neon-metrics-grid/Component.tsx
import React from 'react';
import { Cpu, HardDrive, Wifi, Activity } from 'lucide-react';
import { NeonMetricsGridProps } from './types';

export function NeonMetricsGrid({ 
  clusterHealthStatus = 'Optimal (99.98% SLA)',
  cpuThrottlingAlert = false,
  showNetworkTopology = true,
}: NeonMetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto p-4">
      <div className="p-4 rounded-xl bg-zinc-950 border border-cyan-500/30 space-y-2">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-mono">CPU CGROUPS</span>
          <Cpu className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="text-2xl font-mono font-bold text-zinc-100">14.2%</div>
      </div>
      <div className="p-4 rounded-xl bg-zinc-950 border border-indigo-500/30 space-y-2">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-mono">RESIDENT RAM</span>
          <HardDrive className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="text-2xl font-mono font-bold text-zinc-100">284 MB</div>
      </div>
      <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-500/30 space-y-2">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-mono">STREAMING QPS</span>
          <Wifi className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-mono font-bold text-zinc-100">3,420</div>
      </div>
    </div>
  );
}
export default NeonMetricsGrid;
`,
      },
      {
        path: 'types.ts',
        type: 'type',
        content: `// src/components/ui/neon-metrics-grid/types.ts
export interface NeonMetricsGridProps {
  clusterHealthStatus?: 'Optimal (99.98% SLA)' | 'Degraded (Warning)' | 'Critical Maintenance';
  cpuThrottlingAlert?: boolean;
  showNetworkTopology?: boolean;
}
`,
      },
    ],
    cliCommand: 'npx @second-brain/cli add neon-metrics-grid',
    installCommand: 'npx @second-brain/cli add neon-metrics-grid --path ./src/components/ui',
  },
  'operations-booking-drawer': {
    name: 'Operations & Booking Drawer',
    slug: 'operations-booking-drawer',
    version: '1.5.0',
    category: 'Command & Navigation',
    description: 'Service scheduler & agent dispatch drawer with interactive time-slot matrix, tier selection, pricing calculation, and checkout receipt.',
    author: 'Operations Guild',
    dependencies: {
      'lucide-react': '^0.546.0',
    },
    peerDependencies: {
      'react': '^18.0.0 || ^19.0.0',
      'react-dom': '^18.0.0 || ^19.0.0',
    },
    tailwindConfig: { extend: {} },
    files: [
      {
        path: 'Component.tsx',
        type: 'component',
        content: `// src/components/ui/operations-booking-drawer/Component.tsx
import React from 'react';
import { Calendar, Clock, CreditCard } from 'lucide-react';
import { OperationsBookingDrawerProps } from './types';

export function OperationsBookingDrawer({
  tier = 'Express',
  currency = 'USD',
  showPricingBreakdown = true,
}: OperationsBookingDrawerProps) {
  return (
    <div className="max-w-md mx-auto rounded-2xl bg-zinc-950 border border-zinc-800 p-6 space-y-4 shadow-2xl">
      <h3 className="text-sm font-bold text-zinc-100 font-mono">DISPATCH & SCHEDULER</h3>
      <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
        Selected Tier: {tier} ({currency})
      </div>
    </div>
  );
}
export default OperationsBookingDrawer;
`,
      },
      {
        path: 'types.ts',
        type: 'type',
        content: `// src/components/ui/operations-booking-drawer/types.ts
export interface OperationsBookingDrawerProps {
  tier?: 'Standard' | 'Express' | 'Dedicated';
  currency?: 'USD' | 'EUR' | 'GBP';
  showPricingBreakdown?: boolean;
}
`,
      },
    ],
    cliCommand: 'npx @second-brain/cli add operations-booking-drawer',
    installCommand: 'npx @second-brain/cli add operations-booking-drawer --path ./src/components/ui',
  },
  'data-stream-table': {
    name: 'Data Stream Table',
    slug: 'data-stream-table',
    version: '1.8.2',
    category: 'Data Display',
    description: 'Virtualized real-time telemetry grid with live pulsing latency values, multi-node search filter, batch selections, and status pills.',
    author: 'Satellite Dev Team',
    dependencies: {
      'lucide-react': '^0.546.0',
    },
    peerDependencies: {
      'react': '^18.0.0 || ^19.0.0',
      'react-dom': '^18.0.0 || ^19.0.0',
    },
    tailwindConfig: { extend: {} },
    files: [
      {
        path: 'Component.tsx',
        type: 'component',
        content: `// src/components/ui/data-stream-table/Component.tsx
import React from 'react';
import { Activity, Server } from 'lucide-react';

export function DataStreamTable({ maxRows = 10 }: { maxRows?: number }) {
  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl bg-zinc-950 border border-zinc-800 p-4 space-y-3 font-mono">
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span>TELEMETRY STREAM DATA TABLE</span>
        <span>{maxRows} rows active</span>
      </div>
    </div>
  );
}
export default DataStreamTable;
`,
      },
      {
        path: 'types.ts',
        type: 'type',
        content: `// src/components/ui/data-stream-table/types.ts
export interface DataStreamTableProps {
  maxRows?: number;
}
`,
      },
    ],
    cliCommand: 'npx @second-brain/cli add data-stream-table',
    installCommand: 'npx @second-brain/cli add data-stream-table --path ./src/components/ui',
  },
};

// Aliases for slug variants
CLI_COMPONENT_MANIFESTS['synergy-cam-ui'] = CLI_COMPONENT_MANIFESTS['synergy-cam'];
CLI_COMPONENT_MANIFESTS['quantum-auth-modal'] = CLI_COMPONENT_MANIFESTS['quantum-passkey'];
CLI_COMPONENT_MANIFESTS['bento-telemetry-grid'] = CLI_COMPONENT_MANIFESTS['neon-metrics-grid'];
CLI_COMPONENT_MANIFESTS['booking-operations-drawer'] = CLI_COMPONENT_MANIFESTS['operations-booking-drawer'];

// 7.1 GET /api/registry/v1/components/:slug & GET /api/registry/manifest/:slug
app.get(['/api/registry/v1/components/:slug', '/api/registry/manifest/:slug'], (req, res) => {
  const { slug } = req.params;
  const manifest = CLI_COMPONENT_MANIFESTS[slug];

  if (!manifest) {
    return res.status(404).json({
      status: 'error',
      message: `Component "${slug}" not found in CLI manifest registry.`,
      availableSlugs: Object.keys(CLI_COMPONENT_MANIFESTS),
    });
  }

  res.json({
    status: 'success',
    ...manifest,
  });
});

// 7.2 GET /api/registry/v1/components (List all component manifests)
app.get('/api/registry/v1/components', (req, res) => {
  const list = Object.values(CLI_COMPONENT_MANIFESTS).filter(
    (v, i, a) => a.findIndex(t => t.slug === v.slug) === i
  );
  res.json({
    status: 'success',
    total: list.length,
    components: list,
  });
});



// ==========================================
// Vite Middleware & Static Server
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Component Registry & Sandbox Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
