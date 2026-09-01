import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Mic, Video, Settings, Radio, Sparkles, RefreshCw, Layers, ShieldCheck, 
  Search, Terminal, Database, Server, Cpu, Play, CheckCircle, CheckCircle2, Activity,
  Maximize2, Eye, Sliders, Lock, Zap, ArrowRight, Smartphone, Fingerprint, 
  KeyRound, Shield, Laptop, HardDrive, Wifi, TrendingUp, Filter, Download,
  Calendar, Clock, Check, AlertCircle, User, CreditCard, ChevronRight, X, Image
} from 'lucide-react';
import { RegisteredComponent, PropControl, CodeTabKey } from '../types';

// ==============================================================================
// DYNAMIC CODE GENERATION HELPER
// Generates live Usage.tsx snippet matching the current prop mutation state & theme
// ==============================================================================
export function generateDynamicUsageCode(
  component: RegisteredComponent, 
  props: Record<string, any>,
  themeName?: string
): string {
  const componentName = component.metadata.name.replace(/[\s&/]+/g, '');
  const importPath = `@/components/ui/${component.metadata.slug}`;

  const propsLines = Object.entries(props)
    .map(([key, value]) => {
      if (typeof value === 'boolean') {
        return value ? `      ${key}` : `      ${key}={false}`;
      }
      if (typeof value === 'number') {
        return `      ${key}={${value}}`;
      }
      if (typeof value === 'string') {
        return `      ${key}="${value}"`;
      }
      return `      ${key}={${JSON.stringify(value)}}`;
    })
    .join('\n');

  const themeHeader = themeName 
    ? `// Theme Preset Applied: ${themeName}\n// Tailwind classes automatically mapped to project theme token registry\n` 
    : '';

  return `// Usage.tsx (Live Configured Snippet)
${themeHeader}import React from 'react';
import { ${componentName} } from '${importPath}';

export default function Example() {
  return (
    <div className="p-6 flex items-center justify-center min-h-[400px] bg-zinc-950">
      <${componentName}
${propsLines}
      />
    </div>
  );
}
`;
}

// ==============================================================================
// 1. SYNERGY CAM UI COMPONENT & SOURCES
// ==============================================================================

const SYNERGY_CAM_TSX = `// SynergyCam.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Camera, Mic, Video, Settings, Radio, Sparkles, RefreshCw, Layers, 
  ShieldCheck, Image, Check, AlertCircle 
} from 'lucide-react';
import { useCameraStream } from './hooks';
import { SynergyCamProps, FilterMode } from './types';

export const SynergyCam: React.FC<SynergyCamProps> = ({
  autoFraming = true,
  themeAccent = 'cyan',
  showTelemetry = true,
  filterMode = 'studio',
  bitrateKbps = 4800,
  resolution = '1080p',
  enableShutterSound = true,
  onCapture,
}) => {
  const { 
    isStreaming, 
    fps, 
    audioLevel, 
    isUsingRealWebcam, 
    startRealCamera, 
    stopRealCamera, 
    toggleStream, 
    switchSource 
  } = useCameraStream();

  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [flashActive, setFlashActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => setRecordSeconds((s) => s + 1), 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleCaptureSnapshot = () => {
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 200);

    const syntheticUrl = \`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="640" height="360" fill="%2309090b"/><circle cx="320" cy="180" r="80" fill="%2306b6d4" opacity="0.3"/><text x="320" y="185" fill="%23e4e4e7" font-family="monospace" font-size="16" text-anchor="middle">SNAPSHOT \${new Date().toLocaleTimeString()}</text></svg>\`;
    setSnapshot(syntheticUrl);
    if (onCapture) onCapture(syntheticUrl);
  };

  const getFilterStyle = (mode: FilterMode) => {
    switch (mode) {
      case 'cyberpunk': return 'hue-rotate(180deg) saturate(1.8) contrast(1.2)';
      case 'noir': return 'grayscale(100%) contrast(1.4) brightness(0.9)';
      case 'matrix': return 'hue-rotate(90deg) saturate(2.2) contrast(1.3)';
      case 'hdr': return 'saturate(1.6) contrast(1.2) brightness(1.05)';
      case 'infrared': return 'invert(90%) hue-rotate(240deg) saturate(2)';
      case 'gold': return 'sepia(80%) saturate(1.5) contrast(1.1)';
      default: return 'none';
    }
  };

  const formatTime = (total: number) => {
    const mins = Math.floor(total / 60).toString().padStart(2, '0');
    const secs = (total % 60).toString().padStart(2, '0');
    return \`\${mins}:\${secs}\`;
  };

  return (
    <div className="relative w-full max-w-xl mx-auto overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950 p-4 shadow-2xl font-sans text-zinc-100 backdrop-blur-xl">
      {/* Viewfinder Canvas */}
      <div 
        className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800/80 group"
        style={{ filter: getFilterStyle(filterMode) }}
      >
        {/* Flash animation */}
        {flashActive && <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-200" />}

        {/* Real video or ambient visualizer */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-900/40 to-zinc-950/60 pointer-events-none" />
        <div className="w-24 h-24 rounded-full bg-cyan-500/20 blur-2xl animate-pulse" />

        {/* AI Tracking Box */}
        {autoFraming && (
          <div className="absolute border border-cyan-400/80 bg-cyan-400/5 rounded-xl w-44 h-44 flex flex-col justify-between p-2 shadow-[0_0_20px_rgba(6,182,212,0.25)] animate-pulse">
            <div className="flex justify-between items-center text-[10px] text-cyan-300 font-mono">
              <span className="flex items-center gap-1 font-semibold">
                <Sparkles className="w-3 h-3 text-cyan-400" /> AI TRACK
              </span>
              <span className="bg-cyan-950/80 border border-cyan-800/60 px-1 rounded">99.8% CONF</span>
            </div>
            <div className="flex justify-between items-end text-[9px] font-mono text-cyan-400/80">
              <span>X: 420 Y: 280</span>
              <span>FACE #01</span>
            </div>
          </div>
        )}

        {/* Telemetry HUD */}
        {showTelemetry && (
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-zinc-900/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-zinc-800 text-[11px] font-mono text-zinc-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-zinc-100">{resolution}</span>
            <span className="text-zinc-600">|</span>
            <span className="text-cyan-400">{fps} FPS</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">{bitrateKbps} kbps</span>
          </div>
        )}

        {/* Filter badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <div className="bg-zinc-900/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-zinc-800 text-[10px] text-zinc-300 font-mono flex items-center gap-1">
            <Layers className="w-3 h-3 text-cyan-400" />
            <span className="uppercase">{filterMode}</span>
          </div>
        </div>

        {/* Crosshairs */}
        <div className="absolute w-6 h-6 border-t-2 border-l-2 border-white/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Control Dock */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleStream} 
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition"
            title="Toggle Stream"
          >
            <Video className="w-4 h-4" />
          </button>
          <button 
            onClick={handleCaptureSnapshot}
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition"
            title="Take Snapshot"
          >
            <Camera className="w-4 h-4 text-cyan-400" />
          </button>
        </div>

        {/* Center Record Button */}
        <button
          onClick={() => setIsRecording(!isRecording)}
          className={\`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition shadow-lg \${
            isRecording 
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40' 
              : 'bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold shadow-cyan-500/20'
          }\`}
        >
          <span className={\`w-2.5 h-2.5 rounded-full \${isRecording ? 'bg-white animate-pulse' : 'bg-zinc-950'}\`} />
          {isRecording ? \`REC \${formatTime(recordSeconds)}\` : 'Record Stream'}
        </button>

        {/* Audio VU Decibel Meter */}
        <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-2.5 py-2 rounded-xl">
          <Mic className="w-3.5 h-3.5 text-emerald-400" />
          <div className="w-14 h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-100" 
              style={{ width: \`\${audioLevel}%\` }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
`;

const SYNERGY_CAM_HOOKS = `// hooks.ts
import { useState, useEffect, useCallback, useRef } from 'react';

export function useCameraStream() {
  const [isStreaming, setIsStreaming] = useState(true);
  const [fps, setFps] = useState(60);
  const [audioLevel, setAudioLevel] = useState(45);
  const [isUsingRealWebcam, setIsUsingRealWebcam] = useState(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isStreaming) {
        setFps(Math.floor(58 + Math.random() * 4));
        setAudioLevel(Math.floor(18 + Math.random() * 65));
      } else {
        setFps(0);
        setAudioLevel(0);
      }
    }, 400);

    return () => clearInterval(timer);
  }, [isStreaming]);

  const startRealCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });
      mediaStreamRef.current = stream;
      setIsUsingRealWebcam(true);
      setIsStreaming(true);
      return stream;
    } catch (err) {
      console.warn('Webcam permission denied or not available; fallback to synthetic stream.');
      setIsUsingRealWebcam(false);
      return null;
    }
  }, []);

  const stopRealCamera = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsUsingRealWebcam(false);
  }, []);

  const toggleStream = useCallback(() => {
    setIsStreaming((prev) => !prev);
  }, []);

  const switchSource = useCallback(() => {
    // Switch between front/rear or synthetic sensor
  }, []);

  return {
    isStreaming,
    fps,
    audioLevel,
    isUsingRealWebcam,
    startRealCamera,
    stopRealCamera,
    toggleStream,
    switchSource,
  };
}
`;

const SYNERGY_CAM_TYPES = `// types.ts
export type FilterMode = 'studio' | 'cyberpunk' | 'noir' | 'matrix' | 'hdr' | 'infrared' | 'gold';
export type VideoResolution = '720p' | '1080p' | '4K-ProRes';

export interface SynergyCamProps {
  /** Enables AI facial bounding box and tracking matrix */
  autoFraming?: boolean;
  /** Primary HUD accent palette */
  themeAccent?: 'cyan' | 'emerald' | 'violet' | 'amber' | 'gold';
  /** Display real-time FPS, bitrate, and sensor telemetry */
  showTelemetry?: boolean;
  /** Active shader or post-processing filter */
  filterMode?: FilterMode;
  /** Target encoding bitrate in kilobits per second */
  bitrateKbps?: number;
  /** Stream output resolution target */
  resolution?: VideoResolution;
  /** Enable audio click haptic sound on shutter */
  enableShutterSound?: boolean;
  /** Callback triggered on frame capture snapshot */
  onCapture?: (snapshotUrl: string) => void;
}
`;

const SYNERGY_CAM_SCHEMA = `// schema.ts
import { pgTable, varchar, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

export const cameraSessions = pgTable('camera_sessions', {
  id: varchar('id', { length: 64 }).primaryKey(),
  deviceId: varchar('device_id', { length: 128 }).notNull(),
  resolution: varchar('resolution', { length: 32 }).default('1080p'),
  fpsTarget: integer('fps_target').default(60),
  aiAutoFraming: boolean('ai_auto_framing').default(true),
  filterPreset: varchar('filter_preset', { length: 64 }).default('studio'),
  startedAt: timestamp('started_at', { withTimezone: true }).defaultNow(),
});
`;

// Live Interactive Renderer for Synergy Cam
const SynergyCamRenderer: React.FC<any> = (props) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordSec, setRecordSec] = useState(0);
  const [fps, setFps] = useState(60);
  const [audioLevel, setAudioLevel] = useState(42);
  const [snapshotPreview, setSnapshotPreview] = useState<string | null>(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [facingLabel, setFacingLabel] = useState('Front Ultra HD');

  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const {
    autoFraming = true,
    showTelemetry = true,
    filterMode = 'studio',
    bitrateKbps = 4800,
    resolution = '1080p',
    themeAccent = 'cyan',
  } = props;

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => setRecordSec((s) => s + 1), 1000);
    } else {
      setRecordSec(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    const timer = setInterval(() => {
      setFps(Math.floor(58 + Math.random() * 4));
      setAudioLevel(Math.floor(15 + Math.random() * 70));
    }, 450);
    return () => clearInterval(timer);
  }, []);

  // Real webcam activation handler
  const toggleRealCamera = async () => {
    if (isWebcamActive) {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
      setIsWebcamActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        mediaStreamRef.current = stream;
        if (videoElementRef.current) {
          videoElementRef.current.srcObject = stream;
        }
        setIsWebcamActive(true);
      } catch (e) {
        // user denied or unavailable
      }
    }
  };

  const takeSnapshot = () => {
    setSnapshotPreview(
      `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225"><rect width="400" height="225" fill="%2309090b"/><circle cx="200" cy="112" r="50" fill="%2306b6d4" opacity="0.3"/><text x="200" y="118" fill="%23e4e4e7" font-family="monospace" font-size="12" text-anchor="middle">SNAPSHOT ${new Date().toLocaleTimeString()}</text></svg>`
    );
  };

  const getFilterCSS = (f: string) => {
    switch (f) {
      case 'cyberpunk': return 'hue-rotate(180deg) saturate(1.8) contrast(1.2)';
      case 'noir': return 'grayscale(100%) contrast(1.4) brightness(0.9)';
      case 'matrix': return 'hue-rotate(90deg) saturate(2.2) contrast(1.3)';
      case 'hdr': return 'saturate(1.6) contrast(1.2) brightness(1.05)';
      case 'infrared': return 'invert(90%) hue-rotate(240deg) saturate(2)';
      case 'gold': return 'sepia(80%) saturate(1.5) contrast(1.1)';
      default: return 'none';
    }
  };

  const formatTime = (total: number) => {
    const mins = Math.floor(total / 60).toString().padStart(2, '0');
    const secs = (total % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl border border-zinc-800/80 bg-zinc-950/90 p-4 shadow-2xl backdrop-blur-xl">
      {/* Video Viewport Canvas */}
      <div 
        className="relative aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 flex items-center justify-center border border-zinc-800/80 group"
        style={{ filter: getFilterCSS(filterMode) }}
      >
        {isWebcamActive ? (
          <video
            ref={videoElementRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <div className="absolute inset-0 opacity-20 workbench-dense-matrix" />
            <div className="w-24 h-24 rounded-full bg-cyan-500/20 blur-xl animate-pulse" />
          </>
        )}

        {/* AI Tracking Box */}
        {autoFraming && (
          <div className="absolute border-2 border-cyan-400/80 bg-cyan-400/5 rounded-xl w-44 h-44 flex flex-col justify-between p-2 shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all duration-300">
            <div className="flex justify-between items-center text-[10px] text-cyan-300 font-mono">
              <span className="flex items-center gap-1 font-semibold">
                <Sparkles className="w-3 h-3 text-cyan-400" /> AI BBOX #1
              </span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/50">99.8%</span>
            </div>
            <div className="flex justify-between items-end text-[9px] font-mono text-cyan-400/90">
              <span>X: 420 Y: 280</span>
              <span>TRACK ACTIVE</span>
            </div>
          </div>
        )}

        {/* Top HUD bar */}
        {showTelemetry && (
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-zinc-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-zinc-800 text-[11px] font-mono text-zinc-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-zinc-100 font-semibold">{resolution}</span>
            <span className="text-zinc-600">|</span>
            <span className="text-cyan-400">{fps} FPS</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">{bitrateKbps} kbps</span>
          </div>
        )}

        <div className="absolute top-3 right-3 flex items-center gap-2">
          <div className="bg-zinc-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-zinc-800 text-[11px] text-zinc-300 flex items-center gap-1.5 font-mono">
            <Layers className="w-3 h-3 text-cyan-400" />
            <span className="capitalize">{filterMode}</span>
          </div>
        </div>

        {/* Crosshairs */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <div className="w-8 h-8 border border-white/30 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
          </div>
        </div>
      </div>

      {/* Control Dock */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleRealCamera}
            className={`p-2.5 rounded-xl border text-xs font-mono transition flex items-center gap-1.5 ${
              isWebcamActive 
                ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300 font-semibold' 
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
            }`}
            title="Toggle Live Webcam Device"
          >
            <Video className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isWebcamActive ? 'Webcam Active' : 'Enable Webcam'}</span>
          </button>

          <button
            onClick={takeSnapshot}
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-cyan-400 border border-zinc-800 transition"
            title="Take Snapshot"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center record trigger */}
        <button
          onClick={() => setIsRecording(!isRecording)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition shadow-lg ${
            isRecording 
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40' 
              : 'bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold shadow-cyan-500/25'
          }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-white animate-pulse' : 'bg-zinc-950'}`} />
          {isRecording ? `REC ${formatTime(recordSec)}` : 'Record Stream'}
        </button>

        {/* Audio Meter */}
        <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-2.5 py-2 rounded-xl">
          <Mic className="w-3.5 h-3.5 text-emerald-400" />
          <div className="w-14 h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-150"
              style={{ width: `${audioLevel}%` }}
            />
          </div>
        </div>
      </div>

      {/* Snapshot Preview modal if captured */}
      {snapshotPreview && (
        <div className="mt-3 p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <img src={snapshotPreview} alt="Snapshot thumbnail" className="w-12 h-7 rounded object-cover border border-zinc-700" />
            <div className="text-[11px] font-mono text-zinc-300">Frame Captured (1080p WebP)</div>
          </div>
          <button 
            onClick={() => setSnapshotPreview(null)}
            className="text-xs text-zinc-500 hover:text-zinc-300 font-mono px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

// ==============================================================================
// 2. BENTO TELEMETRY GRID COMPONENT & SOURCES
// ==============================================================================

const BENTO_GRID_TSX = `// BentoTelemetryGrid.tsx
import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Wifi, Server, Activity, ShieldCheck, RefreshCw, Zap } from 'lucide-react';
import { BentoTelemetryGridProps } from './types';

export const BentoTelemetryGrid: React.FC<BentoTelemetryGridProps> = ({
  themeAccent = 'cyan',
  refreshIntervalMs = 800,
  showDockerStatus = true,
  compactMode = false,
}) => {
  const [cpuLoad, setCpuLoad] = useState(38);
  const [memoryMb, setMemoryMb] = useState(284);
  const [qps, setQps] = useState(4820);
  const [p99Latency, setP99Latency] = useState(1.8);

  useEffect(() => {
    const timer = setInterval(() => {
      setCpuLoad(Math.floor(25 + Math.random() * 30));
      setMemoryMb(Math.floor(260 + Math.random() * 40));
      setQps(Math.floor(4500 + Math.random() * 700));
      setP99Latency(parseFloat((1.4 + Math.random() * 0.8).toFixed(2)));
    }, refreshIntervalMs);
    return () => clearInterval(timer);
  }, [refreshIntervalMs]);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 rounded-2xl border border-zinc-800/80 bg-zinc-950 font-sans text-zinc-100 shadow-2xl">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span className="font-semibold text-xs text-zinc-200">Bento Telemetry Hub</span>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
          NODE: US-EAST-01
        </span>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Card 1: CPU Cgroup */}
        <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-cyan-400" /> CPU Core</span>
            <span className="text-cyan-400 font-bold">{cpuLoad}%</span>
          </div>
          <div className="mt-3">
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400 transition-all duration-300" style={{ width: \`\${cpuLoad}%\` }} />
            </div>
            <div className="text-[10px] text-zinc-500 font-mono mt-1.5">8 vCPUs • 0 Throttled</div>
          </div>
        </div>

        {/* Card 2: Memory Leak Watchdog */}
        <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5 text-purple-400" /> RSS Memory</span>
            <span className="text-purple-400 font-bold">{memoryMb} MB</span>
          </div>
          <div className="mt-3">
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-purple-400 transition-all duration-300" style={{ width: \`\${(memoryMb / 512) * 100}%\` }} />
            </div>
            <div className="text-[10px] text-zinc-500 font-mono mt-1.5">Limit: 512 MB • Stable</div>
          </div>
        </div>

        {/* Card 3: Live QPS & Latency */}
        <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-emerald-400" /> QPS / p99</span>
            <span className="text-emerald-400 font-bold">{p99Latency} ms</span>
          </div>
          <div className="mt-3">
            <div className="text-sm font-semibold text-zinc-100 font-mono">{qps.toLocaleString()} req/s</div>
            <div className="text-[10px] text-zinc-500 font-mono mt-0.5">HTTP/2 WebSocket Stream</div>
          </div>
        </div>

        {/* Card 4: Docker Container Pool */}
        {showDockerStatus && (
          <div className="md:col-span-3 p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/30 flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <span className="text-zinc-300">Runtime: docker://secondbrain/satellite-runtime:v2.4</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 text-[10px]">
                0 FAULTS
              </span>
              <span className="text-zinc-500 text-[10px]">PORT 3000 (INGRESS)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
`;

const BENTO_GRID_HOOKS = `// hooks.ts
import { useState, useEffect } from 'react';

export function useTelemetryFeed(intervalMs: number = 800) {
  const [metrics, setMetrics] = useState({
    cpu: 32,
    memory: 240,
    qps: 4200,
    latency: 1.4,
  });

  useEffect(() => {
    const t = setInterval(() => {
      setMetrics({
        cpu: Math.floor(25 + Math.random() * 30),
        memory: Math.floor(220 + Math.random() * 60),
        qps: Math.floor(4000 + Math.random() * 800),
        latency: parseFloat((1.2 + Math.random() * 0.9).toFixed(2)),
      });
    }, intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);

  return metrics;
}
`;

const BENTO_GRID_TYPES = `// types.ts
export interface BentoTelemetryGridProps {
  /** Palette accent color */
  themeAccent?: 'cyan' | 'emerald' | 'violet' | 'amber';
  /** Telemetry poll rate in milliseconds */
  refreshIntervalMs?: number;
  /** Display bottom container orchestration row */
  showDockerStatus?: boolean;
  /** Render in high density mode */
  compactMode?: boolean;
}
`;

const BentoTelemetryGridRenderer: React.FC<any> = (props) => {
  const { themeAccent = 'cyan', refreshIntervalMs = 800, showDockerStatus = true } = props;
  const [cpu, setCpu] = useState(38);
  const [memory, setMemory] = useState(284);
  const [qps, setQps] = useState(4820);
  const [p99, setP99] = useState(1.8);

  useEffect(() => {
    const timer = setInterval(() => {
      setCpu(Math.floor(25 + Math.random() * 30));
      setMemory(Math.floor(260 + Math.random() * 40));
      setQps(Math.floor(4500 + Math.random() * 700));
      setP99(parseFloat((1.4 + Math.random() * 0.8).toFixed(2)));
    }, refreshIntervalMs || 800);
    return () => clearInterval(timer);
  }, [refreshIntervalMs]);

  return (
    <div className="w-full max-w-xl mx-auto p-4 rounded-2xl border border-zinc-800/80 bg-zinc-950/90 font-sans text-zinc-100 shadow-2xl backdrop-blur-xl">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span className="font-semibold text-xs text-zinc-200">Bento Telemetry Grid</span>
        </div>
        <span className="text-[10px] font-mono font-semibold tracking-wider text-zinc-400 uppercase bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
          NODE: US-EAST-01 • LIVE
        </span>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Card 1: CPU */}
        <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-cyan-400" /> CPU Core</span>
            <span className="text-cyan-400 font-bold">{cpu}%</span>
          </div>
          <div className="mt-3">
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400 transition-all duration-300" style={{ width: `${cpu}%` }} />
            </div>
            <div className="text-[10px] text-zinc-500 font-mono mt-1.5">8 vCPUs • Active</div>
          </div>
        </div>

        {/* Card 2: Memory */}
        <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5 text-purple-400" /> RSS Memory</span>
            <span className="text-purple-400 font-bold">{memory} MB</span>
          </div>
          <div className="mt-3">
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-purple-400 transition-all duration-300" style={{ width: `${(memory / 512) * 100}%` }} />
            </div>
            <div className="text-[10px] text-zinc-500 font-mono mt-1.5">Limit: 512 MB</div>
          </div>
        </div>

        {/* Card 3: QPS */}
        <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-emerald-400" /> QPS / p99</span>
            <span className="text-emerald-400 font-bold">{p99} ms</span>
          </div>
          <div className="mt-3">
            <div className="text-sm font-semibold text-zinc-100 font-mono">{qps.toLocaleString()} req/s</div>
            <div className="text-[10px] text-zinc-500 font-mono mt-0.5">HTTP/2 WebSocket</div>
          </div>
        </div>

        {/* Card 4: Docker status */}
        {showDockerStatus && (
          <div className="sm:col-span-3 p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <span className="text-zinc-300">secondbrain/satellite-runtime:v2.4</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 text-[10px]">
                0 FAULTS
              </span>
              <span className="text-zinc-500 text-[10px]">PORT 3000</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==============================================================================
// 3. QUANTUM AUTH MODAL COMPONENT & SOURCES
// ==============================================================================

const QUANTUM_AUTH_TSX = `// QuantumAuthModal.tsx
import React, { useState } from 'react';
import { Fingerprint, KeyRound, Lock, Shield, CheckCircle2, RefreshCw, X } from 'lucide-react';
import { QuantumAuthModalProps } from './types';

export const QuantumAuthModal: React.FC<QuantumAuthModalProps> = ({
  authMethod = 'passkey',
  showBiometricRing = true,
  requirePinFallback = true,
  tokenDurationMinutes = 60,
  onSuccess,
}) => {
  const [step, setStep] = useState<'prompt' | 'scanning' | 'otp' | 'success'>('prompt');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);

  const handleTriggerPasskey = () => {
    setStep('scanning');
    setTimeout(() => {
      setStep('success');
      if (onSuccess) onSuccess('tok_quantum_88921');
    }, 1200);
  };

  return (
    <div className="w-full max-w-md mx-auto p-5 rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl font-sans">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-sm">Quantum Security Guard</span>
        </div>
        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
          FIDO2 / WEBAUTHN
        </span>
      </div>

      {step === 'prompt' && (
        <div className="text-center py-4 space-y-4">
          <button
            onClick={handleTriggerPasskey}
            className="w-20 h-20 mx-auto rounded-full bg-cyan-950/60 border border-cyan-500/50 flex items-center justify-center text-cyan-400 hover:scale-105 transition shadow-[0_0_25px_rgba(6,182,212,0.3)]"
          >
            <Fingerprint className="w-10 h-10 animate-pulse" />
          </button>
          <div>
            <div className="font-semibold text-sm text-zinc-200">Touch Security Key / Passkey</div>
            <p className="text-xs text-zinc-500 mt-1">Authenticate session via hardware passkey or biometric enclave.</p>
          </div>
          {requirePinFallback && (
            <button
              onClick={() => setStep('otp')}
              className="text-xs text-zinc-400 hover:text-cyan-300 font-mono transition"
            >
              Use 6-Digit OTP Fallback →
            </button>
          )}
        </div>
      )}

      {step === 'scanning' && (
        <div className="text-center py-8 space-y-3">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
          <div className="text-xs font-mono text-cyan-300">Verifying hardware signature...</div>
        </div>
      )}

      {step === 'otp' && (
        <div className="py-3 space-y-3 text-center">
          <div className="text-xs text-zinc-300 font-mono">Enter 6-Digit Security Token</div>
          <div className="flex justify-center gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <input
                key={i}
                maxLength={1}
                className="w-9 h-10 bg-zinc-900 border border-zinc-800 rounded-lg text-center font-mono text-cyan-400 text-lg"
                defaultValue={i < 3 ? '7' : ''}
              />
            ))}
          </div>
          <button
            onClick={() => setStep('success')}
            className="w-full py-2 mt-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold text-xs transition"
          >
            Verify Token
          </button>
        </div>
      )}

      {step === 'success' && (
        <div className="text-center py-6 space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <div className="font-semibold text-sm text-zinc-100">Session Verified</div>
          <p className="text-xs text-zinc-500 font-mono">Token valid for {tokenDurationMinutes} minutes.</p>
        </div>
      )}
    </div>
  );
};
`;

const QUANTUM_AUTH_HOOKS = `// hooks.ts
import { useState, useCallback } from 'react';

export function useWebAuthnPasskey() {
  const [status, setStatus] = useState<'idle' | 'verifying' | 'authenticated'>('idle');

  const authenticate = useCallback(async () => {
    setStatus('verifying');
    await new Promise((r) => setTimeout(r, 1000));
    setStatus('authenticated');
    return { token: 'tok_jwt_secure_signature' };
  }, []);

  return { status, authenticate };
}
`;

const QUANTUM_AUTH_TYPES = `// types.ts
export interface QuantumAuthModalProps {
  authMethod?: 'passkey' | 'otp' | 'dual-factor';
  showBiometricRing?: boolean;
  requirePinFallback?: boolean;
  tokenDurationMinutes?: number;
  onSuccess?: (token: string) => void;
}
`;

const QuantumAuthModalRenderer: React.FC<any> = (props) => {
  const [step, setStep] = useState<'prompt' | 'scanning' | 'otp' | 'success'>('prompt');
  const { requirePinFallback = true, tokenDurationMinutes = 60 } = props;

  return (
    <div className="w-full max-w-sm mx-auto p-5 rounded-2xl border border-zinc-800/80 bg-zinc-950/90 text-zinc-100 shadow-2xl font-sans backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-xs text-zinc-200">Quantum Auth Guard</span>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
          FIDO2 / WEBAUTHN
        </span>
      </div>

      {step === 'prompt' && (
        <div className="text-center py-4 space-y-4">
          <button
            onClick={() => {
              setStep('scanning');
              setTimeout(() => setStep('success'), 1200);
            }}
            className="w-20 h-20 mx-auto rounded-full bg-cyan-950/60 border border-cyan-500/50 flex items-center justify-center text-cyan-400 hover:scale-105 transition shadow-[0_0_25px_rgba(6,182,212,0.3)] cursor-pointer"
          >
            <Fingerprint className="w-10 h-10 animate-pulse" />
          </button>
          <div>
            <div className="font-semibold text-xs text-zinc-200">Touch Security Key / Passkey</div>
            <p className="text-[11px] text-zinc-500 mt-1">Authenticate session via hardware passkey or biometric enclave.</p>
          </div>
          {requirePinFallback && (
            <button
              onClick={() => setStep('otp')}
              className="text-[11px] text-zinc-400 hover:text-cyan-300 font-mono transition cursor-pointer"
            >
              Use 6-Digit OTP Fallback →
            </button>
          )}
        </div>
      )}

      {step === 'scanning' && (
        <div className="text-center py-8 space-y-3">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
          <div className="text-xs font-mono text-cyan-300">Verifying hardware signature...</div>
        </div>
      )}

      {step === 'otp' && (
        <div className="py-3 space-y-3 text-center">
          <div className="text-xs text-zinc-300 font-mono">Enter 6-Digit Security Token</div>
          <div className="flex justify-center gap-1.5">
            {['8', '2', '4', '', '', ''].map((v, i) => (
              <input
                key={i}
                maxLength={1}
                className="w-8 h-9 bg-zinc-900 border border-zinc-800 rounded-lg text-center font-mono text-cyan-400 text-sm"
                defaultValue={v}
              />
            ))}
          </div>
          <button
            onClick={() => setStep('success')}
            className="w-full py-2 mt-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold text-xs transition cursor-pointer"
          >
            Verify Token
          </button>
        </div>
      )}

      {step === 'success' && (
        <div className="text-center py-6 space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <div className="font-semibold text-sm text-zinc-100">Session Verified</div>
          <p className="text-xs text-zinc-500 font-mono">Token valid for {tokenDurationMinutes} minutes.</p>
          <button
            onClick={() => setStep('prompt')}
            className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono pt-2"
          >
            Reset Flow
          </button>
        </div>
      )}
    </div>
  );
};

// ==============================================================================
// 4. OPERATIONS & BOOKING DRAWER COMPONENT & SOURCES
// ==============================================================================

const BOOKING_DRAWER_TSX = `// OperationsBookingDrawer.tsx
import React, { useState } from 'react';
import { Calendar, Clock, User, Check, CreditCard, Shield, ChevronRight } from 'lucide-react';
import { BookingDrawerProps } from './types';

export const OperationsBookingDrawer: React.FC<BookingDrawerProps> = ({
  tier = 'Express',
  currency = 'USD',
  showPricingBreakdown = true,
  requireDeposit = true,
  onConfirm,
}) => {
  const [selectedSlot, setSelectedSlot] = useState('14:00 - 15:00 UTC');
  const [confirmed, setConfirmed] = useState(false);

  const SLOTS = ['09:00 - 10:00 UTC', '11:30 - 12:30 UTC', '14:00 - 15:00 UTC', '16:30 - 17:30 UTC'];

  return (
    <div className="w-full max-w-md mx-auto p-5 rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl font-sans">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-xs text-zinc-200">Satellite Dispatch Scheduler</span>
        </div>
        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
          TIER: {tier.toUpperCase()}
        </span>
      </div>

      {!confirmed ? (
        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-mono text-zinc-400 mb-2 block">AVAILABLE TIME SLOTS</label>
            <div className="grid grid-cols-2 gap-2">
              {SLOTS.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={\`p-2.5 rounded-xl border text-xs font-mono transition text-left \${
                    selectedSlot === slot 
                      ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300 font-semibold shadow-sm' 
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }\`}
                >
                  <Clock className="w-3 h-3 mb-1" />
                  <div>{slot}</div>
                </button>
              ))}
            </div>
          </div>

          {showPricingBreakdown && (
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Base Dispatch Fee</span>
                <span>$120.00 {currency}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Infrastructure SLA</span>
                <span>$30.00 {currency}</span>
              </div>
              <div className="border-t border-zinc-800 pt-1.5 flex justify-between font-semibold text-zinc-100">
                <span>Total Commitment</span>
                <span className="text-cyan-400">$150.00 {currency}</span>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setConfirmed(true);
              if (onConfirm) onConfirm({ slot: selectedSlot, tier });
            }}
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold text-xs transition shadow-[0_0_15px_rgba(6,182,212,0.25)]"
          >
            Confirm Dispatch Reservation
          </button>
        </div>
      ) : (
        <div className="text-center py-6 space-y-2 font-mono">
          <Check className="w-8 h-8 text-emerald-400 mx-auto" />
          <div className="font-semibold text-xs text-zinc-100">Reservation Dispatched</div>
          <p className="text-[11px] text-zinc-500">Confirmed for {selectedSlot}</p>
          <button
            onClick={() => setConfirmed(false)}
            className="text-[10px] text-zinc-400 hover:text-zinc-200 pt-2"
          >
            Book Another Window
          </button>
        </div>
      )}
    </div>
  );
};
`;

const BOOKING_DRAWER_HOOKS = `// hooks.ts
import { useState } from 'react';

export function useSchedulerSlots() {
  const [slots] = useState([
    '09:00 - 10:00 UTC',
    '11:30 - 12:30 UTC',
    '14:00 - 15:00 UTC',
    '16:30 - 17:30 UTC',
  ]);
  return { slots };
}
`;

const BOOKING_DRAWER_TYPES = `// types.ts
export interface BookingDrawerProps {
  tier?: 'Standard' | 'Express' | 'Dedicated';
  currency?: 'USD' | 'EUR' | 'GBP';
  showPricingBreakdown?: boolean;
  requireDeposit?: boolean;
  onConfirm?: (data: { slot: string; tier: string }) => void;
}
`;

const OperationsBookingDrawerRenderer: React.FC<any> = (props) => {
  const { tier = 'Express', currency = 'USD', showPricingBreakdown = true } = props;
  const [selectedSlot, setSelectedSlot] = useState('14:00 - 15:00 UTC');
  const [confirmed, setConfirmed] = useState(false);

  const SLOTS = ['09:00 - 10:00 UTC', '11:30 - 12:30 UTC', '14:00 - 15:00 UTC', '16:30 - 17:30 UTC'];

  return (
    <div className="w-full max-w-md mx-auto p-5 rounded-2xl border border-zinc-800/80 bg-zinc-950/90 text-zinc-100 shadow-2xl font-sans backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-xs text-zinc-200">Satellite Dispatch Scheduler</span>
        </div>
        <span className="text-[10px] font-mono font-semibold tracking-wider text-zinc-400 uppercase bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
          TIER: {tier.toUpperCase()}
        </span>
      </div>

      {!confirmed ? (
        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-mono text-zinc-400 mb-2 block">AVAILABLE TIME SLOTS</label>
            <div className="grid grid-cols-2 gap-2">
              {SLOTS.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-2.5 rounded-xl border text-xs font-mono transition text-left cursor-pointer ${
                    selectedSlot === slot 
                      ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300 font-semibold shadow-sm' 
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Clock className="w-3 h-3 mb-1 text-cyan-400" />
                  <div>{slot}</div>
                </button>
              ))}
            </div>
          </div>

          {showPricingBreakdown && (
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Base Dispatch Fee</span>
                <span>$120.00 {currency}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Infrastructure SLA</span>
                <span>$30.00 {currency}</span>
              </div>
              <div className="border-t border-zinc-800/80 pt-1.5 flex justify-between font-semibold text-zinc-100">
                <span>Total Commitment</span>
                <span className="text-cyan-400">$150.00 {currency}</span>
              </div>
            </div>
          )}

          <button
            onClick={() => setConfirmed(true)}
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold text-xs transition shadow-[0_0_15px_rgba(6,182,212,0.25)] cursor-pointer"
          >
            Confirm Dispatch Reservation
          </button>
        </div>
      ) : (
        <div className="text-center py-6 space-y-2 font-mono">
          <Check className="w-8 h-8 text-emerald-400 mx-auto" />
          <div className="font-semibold text-xs text-zinc-100">Reservation Dispatched</div>
          <p className="text-[11px] text-zinc-500">Confirmed for {selectedSlot}</p>
          <button
            onClick={() => setConfirmed(false)}
            className="text-[10px] text-zinc-400 hover:text-zinc-200 pt-2 cursor-pointer"
          >
            Book Another Window
          </button>
        </div>
      )}
    </div>
  );
};

// ==============================================================================
// 5. DATA STREAM TABLE COMPONENT & SOURCES
// ==============================================================================

const DATA_TABLE_TSX = `// DataStreamTable.tsx
import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, Download, Activity } from 'lucide-react';
import { DataStreamTableProps } from './types';

export const DataStreamTable: React.FC<DataStreamTableProps> = ({
  density = 'comfortable',
  enableRealtimeStream = true,
  batchActions = true,
  maxRows = 10,
}) => {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const rows = [
    { id: '1', service: 'core-auth-gateway', region: 'us-east-va', latencyMs: 14, throughput: 1420, status: 'HEALTHY' },
    { id: '2', service: 'telemetry-collector', region: 'eu-central-de', latencyMs: 28, throughput: 3890, status: 'HEALTHY' },
    { id: '3', service: 'synergy-cam-rtc', region: 'ap-northeast-jp', latencyMs: 82, throughput: 940, status: 'STABLE' },
    { id: '4', service: 'drizzle-postgres-node', region: 'us-west-or', latencyMs: 19, throughput: 2110, status: 'HEALTHY' },
  ];

  const filtered = rows.filter((r) => r.service.includes(search.toLowerCase()));

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-100 shadow-2xl font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg w-52 text-xs">
          <Search className="w-3.5 h-3.5 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter services..."
            className="bg-transparent border-none outline-none text-xs text-zinc-200 placeholder:text-zinc-600 w-full"
          />
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
          LIVE STREAM
        </span>
      </div>

      <table className="w-full text-left text-xs font-mono">
        <thead className="text-zinc-500 border-b border-zinc-800 text-[10px]">
          <tr>
            <th className="pb-2">SERVICE</th>
            <th className="pb-2">REGION</th>
            <th className="pb-2">LATENCY</th>
            <th className="pb-2">STATUS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60">
          {filtered.slice(0, maxRows).map((row) => (
            <tr key={row.id} className="hover:bg-zinc-900/50">
              <td className="py-2 text-zinc-200">{row.service}</td>
              <td className="py-2 text-zinc-500">{row.region}</td>
              <td className="py-2 text-cyan-400">{row.latencyMs}ms</td>
              <td className="py-2 text-emerald-400">{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
`;

const DATA_TABLE_HOOKS = `// hooks.ts
import { useState, useEffect } from 'react';

export function useStreamRecords() {
  const [data] = useState([
    { id: '1', service: 'core-auth-gateway', region: 'us-east-va', latencyMs: 14, throughput: 1420, status: 'HEALTHY' },
  ]);
  return { data };
}
`;

const DATA_TABLE_TYPES = `// types.ts
export interface DataStreamTableProps {
  density?: 'compact' | 'comfortable' | 'spacious';
  enableRealtimeStream?: boolean;
  batchActions?: boolean;
  maxRows?: number;
}
`;

const DataStreamTableRenderer: React.FC<any> = (props) => {
  const { maxRows = 10 } = props;
  const [search, setSearch] = useState('');

  const rows = [
    { id: '1', service: 'core-auth-gateway', region: 'us-east-va', latencyMs: 14, throughput: 1420, status: 'HEALTHY' },
    { id: '2', service: 'telemetry-collector', region: 'eu-central-de', latencyMs: 28, throughput: 3890, status: 'HEALTHY' },
    { id: '3', service: 'synergy-cam-rtc', region: 'ap-northeast-jp', latencyMs: 82, throughput: 940, status: 'STABLE' },
    { id: '4', service: 'drizzle-postgres-node', region: 'us-west-or', latencyMs: 19, throughput: 2110, status: 'HEALTHY' },
  ];

  const filtered = rows.filter((r) => r.service.includes(search.toLowerCase()));

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl border border-zinc-800/80 bg-zinc-950/90 p-4 text-zinc-100 shadow-2xl font-sans backdrop-blur-xl">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3">
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg w-52 text-xs">
          <Search className="w-3.5 h-3.5 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter services..."
            className="bg-transparent border-none outline-none text-xs text-zinc-200 placeholder:text-zinc-600 w-full font-mono"
          />
        </div>
        <span className="text-[10px] font-mono font-semibold tracking-wider text-emerald-400 uppercase bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
          LIVE STREAM
        </span>
      </div>

      <table className="w-full text-left text-xs font-mono">
        <thead className="text-zinc-500 border-b border-zinc-800/80 text-[10px] uppercase">
          <tr>
            <th className="pb-2">SERVICE</th>
            <th className="pb-2">REGION</th>
            <th className="pb-2">LATENCY</th>
            <th className="pb-2">STATUS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60">
          {filtered.slice(0, maxRows).map((row) => (
            <tr key={row.id} className="hover:bg-zinc-900/50 transition">
              <td className="py-2 text-zinc-200 font-medium">{row.service}</td>
              <td className="py-2 text-zinc-500">{row.region}</td>
              <td className="py-2 text-cyan-400">{row.latencyMs}ms</td>
              <td className="py-2">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ==============================================================================
// REGISTERED COMPONENTS CATALOG EXPORT
// ==============================================================================

export const REGISTERED_COMPONENTS: RegisteredComponent[] = [
  {
    metadata: {
      id: 'synergy-cam-ui',
      name: 'Synergy Cam UI',
      slug: 'synergy-cam',
      category: 'Media & AI UI',
      description: 'Extracted camera HUD with AI auto-tracking bounding boxes, real-time webcam streaming, filter shaders, and telemetry.',
      version: '2.4.0',
      author: 'Second Brain Core',
      status: 'production',
      lastSyncedAt: new Date().toISOString(),
      secondBrainSourceId: 'sb_node_synergy_cam_094',
      tags: ['Camera', 'AI Track', 'HUD', 'WebRTC'],
      dependencies: {
        'lucide-react': '^0.546.0',
        'clsx': '^2.1.1',
      },
    },
    code: {
      'Usage.tsx': '', // dynamic
      'Component.tsx': SYNERGY_CAM_TSX,
      'hooks.ts': SYNERGY_CAM_HOOKS,
      'types.ts': SYNERGY_CAM_TYPES,
      'schema.ts': SYNERGY_CAM_SCHEMA,
    },
    propControls: [
      {
        name: 'autoFraming',
        label: 'AI Auto-Framing',
        type: 'boolean',
        defaultValue: true,
      },
      {
        name: 'showTelemetry',
        label: 'Telemetry HUD',
        type: 'boolean',
        defaultValue: true,
      },
      {
        name: 'filterMode',
        label: 'Filter Shader',
        type: 'select',
        defaultValue: 'studio',
        options: ['studio', 'cyberpunk', 'noir', 'matrix', 'hdr', 'infrared', 'gold'],
      },
      {
        name: 'resolution',
        label: 'Resolution Target',
        type: 'select',
        defaultValue: '1080p',
        options: ['720p', '1080p', '4K-ProRes'],
      },
      {
        name: 'bitrateKbps',
        label: 'Target Bitrate (kbps)',
        type: 'number',
        defaultValue: 4800,
        min: 1200,
        max: 12000,
        step: 400,
      },
      {
        name: 'enableShutterSound',
        label: 'Shutter Sound',
        type: 'boolean',
        defaultValue: true,
      },
    ],
    defaultProps: {
      autoFraming: true,
      showTelemetry: true,
      filterMode: 'studio',
      resolution: '1080p',
      bitrateKbps: 4800,
      enableShutterSound: true,
    },
    renderComponent: (props) => <SynergyCamRenderer {...props} />,
  },
  {
    metadata: {
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
    code: {
      'Usage.tsx': '',
      'Component.tsx': BENTO_GRID_TSX,
      'hooks.ts': BENTO_GRID_HOOKS,
      'types.ts': BENTO_GRID_TYPES,
    },
    propControls: [
      {
        name: 'showDockerStatus',
        label: 'Show Docker Pool Card',
        type: 'boolean',
        defaultValue: true,
      },
      {
        name: 'refreshIntervalMs',
        label: 'Telemetry Poll Rate (ms)',
        type: 'number',
        defaultValue: 800,
        min: 200,
        max: 3000,
        step: 200,
      },
      {
        name: 'compactMode',
        label: 'Compact Density',
        type: 'boolean',
        defaultValue: false,
      },
    ],
    defaultProps: {
      showDockerStatus: true,
      refreshIntervalMs: 800,
      compactMode: false,
    },
    renderComponent: (props) => <BentoTelemetryGridRenderer {...props} />,
  },
  {
    metadata: {
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
    code: {
      'Usage.tsx': '',
      'Component.tsx': QUANTUM_AUTH_TSX,
      'hooks.ts': QUANTUM_AUTH_HOOKS,
      'types.ts': QUANTUM_AUTH_TYPES,
    },
    propControls: [
      {
        name: 'requirePinFallback',
        label: 'Allow OTP PIN Fallback',
        type: 'boolean',
        defaultValue: true,
      },
      {
        name: 'tokenDurationMinutes',
        label: 'Token Expiry (Minutes)',
        type: 'number',
        defaultValue: 60,
        min: 15,
        max: 240,
        step: 15,
      },
    ],
    defaultProps: {
      requirePinFallback: true,
      tokenDurationMinutes: 60,
    },
    renderComponent: (props) => <QuantumAuthModalRenderer {...props} />,
  },
  {
    metadata: {
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
    code: {
      'Usage.tsx': '',
      'Component.tsx': BOOKING_DRAWER_TSX,
      'hooks.ts': BOOKING_DRAWER_HOOKS,
      'types.ts': BOOKING_DRAWER_TYPES,
    },
    propControls: [
      {
        name: 'tier',
        label: 'Service Tier',
        type: 'select',
        defaultValue: 'Express',
        options: ['Standard', 'Express', 'Dedicated'],
      },
      {
        name: 'currency',
        label: 'Currency',
        type: 'select',
        defaultValue: 'USD',
        options: ['USD', 'EUR', 'GBP'],
      },
      {
        name: 'showPricingBreakdown',
        label: 'Show Pricing Breakdown',
        type: 'boolean',
        defaultValue: true,
      },
    ],
    defaultProps: {
      tier: 'Express',
      currency: 'USD',
      showPricingBreakdown: true,
    },
    renderComponent: (props) => <OperationsBookingDrawerRenderer {...props} />,
  },
  {
    metadata: {
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
    code: {
      'Usage.tsx': '',
      'Component.tsx': DATA_TABLE_TSX,
      'hooks.ts': DATA_TABLE_HOOKS,
      'types.ts': DATA_TABLE_TYPES,
    },
    propControls: [
      {
        name: 'maxRows',
        label: 'Max Visible Rows',
        type: 'number',
        defaultValue: 10,
        min: 2,
        max: 50,
        step: 2,
      },
    ],
    defaultProps: {
      maxRows: 10,
    },
    renderComponent: (props) => <DataStreamTableRenderer {...props} />,
  },
];
