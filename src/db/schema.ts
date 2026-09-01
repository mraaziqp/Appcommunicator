/**
 * Drizzle ORM Schema Definition for Neon PostgreSQL
 * Component Registry & Second Brain Satellite DB
 */

// We define PostgreSQL table schemas ready for Drizzle ORM migration & Neon connection
export interface ComponentsTableRow {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  version: string;
  author: string;
  status: string;
  codeComponent: string;
  codeHooks: string;
  codeTypes: string;
  codeSchema: string | null;
  dependencies: Record<string, string>;
  tags: string[];
  secondBrainSourceId: string;
  lastSyncedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SandboxSessionsTableRow {
  id: string;
  componentId: string;
  containerId: string;
  status: string;
  port: number;
  cpuPercent: number;
  memoryMb: number;
  logsJson: string;
  createdAt: Date;
  terminatedAt: Date | null;
}

export interface SecondBrainWebhooksTableRow {
  id: string;
  eventType: string;
  source: string;
  payloadJson: string;
  receivedAt: Date;
  processed: boolean;
}

export interface JarvisEcosystemEventsTableRow {
  id: string;
  streamType: string;
  source: string;
  eventType: string;
  urgency: string;
  title: string;
  summary: string;
  payloadJson: string;
  decisionActionJson: string;
  receivedAt: Date;
  processed: boolean;
}

export interface JarvisCommunicationsTableRow {
  id: string;
  provider: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  body: string;
  threadId: string;
  isUrgent: boolean;
  actionItemsJson: string;
  aiSummary: string;
  receivedAt: Date;
}

export interface JarvisBiometricsTableRow {
  id: string;
  deviceModel: string;
  heartRateBpm: number;
  stressIndex: number;
  stressLevel: string;
  sleepScore: number;
  deepSleepMin: number;
  remSleepMin: number;
  lightSleepMin: number;
  awakeMin: number;
  spo2Percent: number;
  hrvMs: number;
  skinTempC: number;
  stepCount: number;
  proactiveInsight: string;
  loggedAt: Date;
}

export interface JarvisEmbeddingsTableRow {
  id: string;
  documentType: string; // 'component' | 'communication' | 'task' | 'code' | 'biometric'
  referenceId: string;
  title: string;
  contentChunk: string;
  embeddingVector: string; // vector(1536) in pgvector
  tokenCount: number;
  similarityThreshold?: number;
  metadataJson: string;
  createdAt: Date;
}

export interface JarvisAgentTasksTableRow {
  id: string;
  title: string;
  mode: string; // 'EXECUTE_CODE_PATCH' | 'EXECUTE_COMMS_DRAFT' | 'EXECUTE_SANDBOX_RUN'
  status: string; // 'queued' | 'running' | 'completed' | 'failed'
  progressPercent: number;
  logsJson: string;
  eventId: string | null;
  resultJson: string | null;
  createdAt: Date;
  completedAt: Date | null;
}

/**
 * Raw Drizzle SQL schema code string export for developer reference & CLI migration
 */
export const DRIZZLE_SCHEMA_TS = `// src/db/schema.ts
import { pgTable, text, timestamp, varchar, jsonb, integer, boolean, customType } from 'drizzle-orm/pg-core';

// customType for pgvector extension
const vector = customType<{ data: number[] }>({
  dataType() {
    return 'vector(1536)';
  },
});

export const components = pgTable('components', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  category: varchar('category', { length: 128 }).notNull(),
  description: text('description').notNull(),
  version: varchar('version', { length: 32 }).notNull().default('1.0.0'),
  author: varchar('author', { length: 128 }).notNull(),
  status: varchar('status', { length: 32 }).notNull().default('production'),
  codeComponent: text('code_component').notNull(),
  codeHooks: text('code_hooks').notNull(),
  codeTypes: text('code_types').notNull(),
  codeSchema: text('code_schema'),
  dependencies: jsonb('dependencies').notNull().default({}),
  tags: jsonb('tags').$type<string[]>().notNull().default([]),
  secondBrainSourceId: varchar('second_brain_source_id', { length: 128 }).notNull(),
  lastSyncedAt: timestamp('last_synced_at', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const sandboxSessions = pgTable('sandbox_sessions', {
  id: varchar('id', { length: 64 }).primaryKey(),
  componentId: varchar('component_id', { length: 64 }).references(() => components.id),
  containerId: varchar('container_id', { length: 128 }).notNull(),
  status: varchar('status', { length: 32 }).notNull().default('running'),
  port: integer('port').notNull().default(3000),
  cpuPercent: integer('cpu_percent').notNull().default(0),
  memoryMb: integer('memory_mb').notNull().default(128),
  logsJson: jsonb('logs_json').default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  terminatedAt: timestamp('terminated_at', { withTimezone: true }),
});

export const orchestratorWebhooks = pgTable('orchestrator_webhooks', {
  id: varchar('id', { length: 64 }).primaryKey(),
  eventType: varchar('event_type', { length: 128 }).notNull(),
  source: varchar('source', { length: 128 }).notNull(),
  payloadJson: jsonb('payload_json').notNull(),
  receivedAt: timestamp('received_at', { withTimezone: true }).defaultNow().notNull(),
  processed: boolean('processed').notNull().default(true),
});

// Phase 2: Jarvis Ecosystem & Decision Loop Ingestion Schema
export const jarvisEcosystemEvents = pgTable('jarvis_ecosystem_events', {
  id: varchar('id', { length: 64 }).primaryKey(),
  streamType: varchar('stream_type', { length: 64 }).notNull(), // 'communications' | 'github_lifestack' | 'biometrics' | 'system'
  source: varchar('source', { length: 128 }).notNull(), // 'microsoft_graph' | 'imap' | 'github_webhook' | 'lifestack' | 'galaxy_watch_4'
  eventType: varchar('event_type', { length: 128 }).notNull(),
  urgency: varchar('urgency', { length: 32 }).notNull().default('normal'), // 'critical' | 'urgent' | 'high' | 'normal' | 'low'
  title: varchar('title', { length: 255 }).notNull(),
  summary: text('summary').notNull(),
  payloadJson: jsonb('payload_json').notNull().default({}),
  decisionActionJson: jsonb('decision_action_json').notNull().default({}),
  receivedAt: timestamp('received_at', { withTimezone: true }).defaultNow().notNull(),
  processed: boolean('processed').notNull().default(false),
});

export const jarvisCommunications = pgTable('jarvis_communications', {
  id: varchar('id', { length: 64 }).primaryKey(),
  provider: varchar('provider', { length: 32 }).notNull(), // 'm365_graph' | 'imap'
  senderName: varchar('sender_name', { length: 128 }).notNull(),
  senderEmail: varchar('sender_email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  body: text('body').notNull(),
  threadId: varchar('thread_id', { length: 128 }).notNull(),
  isUrgent: boolean('is_urgent').notNull().default(false),
  actionItemsJson: jsonb('action_items_json').notNull().default([]),
  aiSummary: text('ai_summary').notNull(),
  receivedAt: timestamp('received_at', { withTimezone: true }).defaultNow().notNull(),
});

export const jarvisBiometrics = pgTable('jarvis_biometrics', {
  id: varchar('id', { length: 64 }).primaryKey(),
  deviceModel: varchar('device_model', { length: 128 }).notNull().default('Samsung Galaxy Watch 4 Classic'),
  heartRateBpm: integer('heart_rate_bpm').notNull(),
  stressIndex: integer('stress_index').notNull(), // 0 - 100
  stressLevel: varchar('stress_level', { length: 32 }).notNull().default('normal'),
  sleepScore: integer('sleep_score').notNull(),
  deepSleepMin: integer('deep_sleep_min').notNull().default(0),
  remSleepMin: integer('rem_sleep_min').notNull().default(0),
  lightSleepMin: integer('light_sleep_min').notNull().default(0),
  awakeMin: integer('awake_min').notNull().default(0),
  spo2Percent: integer('spo2_percent').notNull().default(98),
  hrvMs: integer('hrv_ms').notNull().default(48),
  skinTempC: text('skin_temp_c').notNull().default('36.4'),
  stepCount: integer('step_count').notNull().default(0),
  proactiveInsight: text('proactive_insight').notNull(),
  loggedAt: timestamp('logged_at', { withTimezone: true }).defaultNow().notNull(),
});

// Phase 3: Semantic Memory (pgvector / Neon) & Autonomous Action Queue Schema
export const jarvisEmbeddings = pgTable('jarvis_embeddings', {
  id: varchar('id', { length: 64 }).primaryKey(),
  documentType: varchar('document_type', { length: 64 }).notNull(), // 'component' | 'communication' | 'task' | 'code' | 'biometric'
  referenceId: varchar('reference_id', { length: 128 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  contentChunk: text('content_chunk').notNull(),
  embeddingVector: vector('embedding_vector').notNull(), // Neon pgvector 1536-dim
  tokenCount: integer('token_count').notNull().default(0),
  metadataJson: jsonb('metadata_json').notNull().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const jarvisAgentTasks = pgTable('jarvis_agent_tasks', {
  id: varchar('id', { length: 64 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  mode: varchar('mode', { length: 64 }).notNull(), // 'EXECUTE_CODE_PATCH' | 'EXECUTE_COMMS_DRAFT' | 'EXECUTE_SANDBOX_RUN'
  status: varchar('status', { length: 32 }).notNull().default('queued'), // 'queued' | 'running' | 'completed' | 'failed'
  progressPercent: integer('progress_percent').notNull().default(0),
  logsJson: jsonb('logs_json').notNull().default([]),
  eventId: varchar('event_id', { length: 64 }),
  resultJson: jsonb('result_json'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
});
`;

