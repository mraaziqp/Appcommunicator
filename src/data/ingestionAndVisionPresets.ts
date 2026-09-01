import { 
  IngestionResult, 
  RegisteredComponent, 
  VisionPresetSample, 
  VisionSynthesisInput, 
  VisionSynthesisResult,
  ThemePreset,
  PropControl 
} from '../types';
import React from 'react';

// ==============================================================================
// 1. REVERSE INGESTION SAMPLE REPOSITORIES & RAW SNIPPETS
// ==============================================================================

export interface IngestionPreset {
  id: string;
  name: string;
  sourceUrl: string;
  category: string;
  description: string;
  rawCode: string;
}

export const INGESTION_SAMPLE_PRESETS: IngestionPreset[] = [
  {
    id: 'preset-radar-telemetry',
    name: 'Satellite Orbital Radar Sweep',
    sourceUrl: 'github.com/space-ops/telemetry/components/OrbitalRadarSweep.tsx',
    category: 'Media & AI UI',
    description: 'High-frequency 360-degree radar canvas with target azimuth detection and ping telemetry.',
    rawCode: `import React, { useState, useEffect, useRef } from 'react';
import { Radio, Activity, Navigation, Shield, Compass } from 'lucide-react';

export interface OrbitalRadarProps {
  sweepSpeedRpm?: number;
  detectionRangeKm?: number;
  showCoordinates?: boolean;
  alertOnProximity?: boolean;
}

export const OrbitalRadarSweep: React.FC<OrbitalRadarProps> = ({
  sweepSpeedRpm = 45,
  detectionRangeKm = 1200,
  showCoordinates = true,
  alertOnProximity = true
}) => {
  const [azimuthAngle, setAzimuthAngle] = useState(0);
  const [targets, setTargets] = useState([
    { id: 'T-101', r: 0.65, theta: 45, type: 'SAT-LEO', signal: 94 },
    { id: 'T-204', r: 0.32, theta: 210, type: 'DEBRIS', signal: 78 },
    { id: 'T-309', r: 0.88, theta: 315, type: 'PAYLOAD', signal: 99 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAzimuthAngle((prev) => (prev + (sweepSpeedRpm * 6) / 60) % 360);
    }, 16);
    return () => clearInterval(interval);
  }, [sweepSpeedRpm]);

  return (
    <div className="relative w-full max-w-md p-6 rounded-2xl bg-zinc-950/95 border border-cyan-500/30 backdrop-blur-xl shadow-2xl font-mono text-zinc-200">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-bold text-xs tracking-wider uppercase text-cyan-300">ORBITAL RADAR SWEEP</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
          AZ: {azimuthAngle.toFixed(1)}°
        </span>
      </div>

      <div className="relative w-56 h-56 mx-auto rounded-full border border-cyan-500/40 bg-zinc-900/60 flex items-center justify-center overflow-hidden">
        {/* Concentric rings */}
        <div className="absolute w-40 h-40 rounded-full border border-cyan-500/20" />
        <div className="absolute w-24 h-24 rounded-full border border-cyan-500/20" />
        <div className="absolute w-full h-[1px] bg-cyan-500/20" />
        <div className="absolute h-full w-[1px] bg-cyan-500/20" />

        {/* Radar Sweep Needle */}
        <div
          className="absolute top-1/2 left-1/2 w-28 h-28 origin-top-left pointer-events-none"
          style={{
            transform: \`rotate(\${azimuthAngle}deg)\`,
            background: 'conic-gradient(from 0deg, rgba(6,182,212,0.4) 0deg, transparent 60deg)',
          }}
        />

        {/* Targets */}
        {targets.map((t) => {
          const x = 112 + Math.cos((t.theta * Math.PI) / 180) * t.r * 100;
          const y = 112 + Math.sin((t.theta * Math.PI) / 180) * t.r * 100;
          return (
            <div
              key={t.id}
              className="absolute w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)]"
              style={{ left: \`\${x}px\`, top: \`\${y}px\` }}
              title={\`\${t.id} - \${t.type}\`}
            />
          );
        })}
      </div>

      {showCoordinates && (
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400">
          <span>RANGE: {detectionRangeKm} KM</span>
          <span>DETECTED TARGETS: {targets.length}</span>
          <span className="text-emerald-400">STATUS: LOCKED</span>
        </div>
      )}
    </div>
  );
};`,
  },
  {
    id: 'preset-hsm-vault',
    name: 'Hardware Security Key Vault Drawer',
    sourceUrl: 'github.com/fintech-corp/security/components/HardwareKeyVault.tsx',
    category: 'Auth & Security',
    description: 'FIPS 140-3 HSM key lifecycle manager with quantum entropy meter and key derivation proof.',
    rawCode: `import React, { useState } from 'react';
import { KeyRound, ShieldCheck, Cpu, Lock, Sparkles, RefreshCw } from 'lucide-react';

export interface KeyVaultProps {
  vaultName?: string;
  securityLevel?: 'FIPS-140-3' | 'Quantum-Resistant' | 'Standard-RSA';
  autoRotateDays?: number;
  entropySource?: string;
}

export const HardwareKeyVault: React.FC<KeyVaultProps> = ({
  vaultName = 'Master HSM Cluster #04',
  securityLevel = 'Quantum-Resistant',
  autoRotateDays = 30,
  entropySource = 'Atmospheric Quantum Noise (TRNG)'
}) => {
  const [entropyLevel, setEntropyLevel] = useState(99.4);
  const [isRotating, setIsRotating] = useState(false);

  const handleRotate = () => {
    setIsRotating(true);
    setTimeout(() => {
      setEntropyLevel(99.8);
      setIsRotating(false);
    }, 1200);
  };

  return (
    <div className="w-full max-w-md p-6 rounded-2xl bg-zinc-950 border border-purple-500/30 backdrop-blur-xl shadow-2xl font-mono text-zinc-200">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-purple-400" />
          <span className="font-bold text-xs uppercase text-purple-300">{vaultName}</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 border border-purple-500/40 text-purple-300">
          {securityLevel}
        </span>
      </div>

      <div className="space-y-3 text-xs">
        <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
            <span>Hardware Entropy Gauge</span>
            <span className="text-purple-400 font-bold">{entropyLevel}%</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: \`\${entropyLevel}%\` }} />
          </div>
        </div>

        <div className="flex items-center justify-between p-2.5 bg-zinc-900/60 rounded-lg text-[11px] text-zinc-400">
          <span>Source: {entropySource}</span>
          <span className="text-zinc-500">Every {autoRotateDays}d</span>
        </div>
      </div>

      <button
        onClick={handleRotate}
        disabled={isRotating}
        className="w-full mt-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 transition"
      >
        <RefreshCw className={\`w-3.5 h-3.5 \${isRotating ? 'animate-spin' : ''}\`} />
        <span>{isRotating ? 'Re-deriving Dilithium Keys...' : 'Force Key Rotation'}</span>
      </button>
    </div>
  );
};`,
  },
];

// ==============================================================================
// 2. VISION SYNTHESIS SAMPLE WIREFRAMES
// ==============================================================================

const createSampleSvg = (title: string, color: string, badge: string, subtitle: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="280" viewBox="0 0 400 280" fill="none">
    <rect width="400" height="280" rx="16" fill="#09090b" stroke="${color}" stroke-width="1.5"/>
    <rect x="20" y="20" width="360" height="40" rx="8" fill="#18181b" stroke="#27272a"/>
    <circle cx="36" cy="40" r="6" fill="${color}"/>
    <text x="52" y="44" fill="#f4f4f5" font-family="monospace" font-size="12" font-weight="bold">${title}</text>
    <rect x="280" y="28" width="85" height="22" rx="6" fill="#27272a"/>
    <text x="322" y="43" fill="${color}" font-family="monospace" font-size="10" text-anchor="middle">${badge}</text>
    
    <rect x="20" y="75" width="220" height="130" rx="10" fill="#18181b" stroke="#27272a"/>
    <path d="M 35 150 Q 75 100 115 140 T 195 120 T 225 155" fill="none" stroke="${color}" stroke-width="2.5"/>
    <circle cx="115" cy="140" r="4" fill="${color}"/>
    <circle cx="195" cy="120" r="4" fill="${color}"/>
    
    <rect x="250" y="75" width="130" height="60" rx="10" fill="#18181b" stroke="#27272a"/>
    <text x="262" y="98" fill="#a1a1aa" font-family="sans-serif" font-size="10">Active Stream</text>
    <text x="262" y="122" fill="#ffffff" font-family="monospace" font-size="16" font-weight="bold">99.98%</text>

    <rect x="250" y="145" width="130" height="60" rx="10" fill="#18181b" stroke="#27272a"/>
    <text x="262" y="168" fill="#a1a1aa" font-family="sans-serif" font-size="10">Throughput</text>
    <text x="262" y="192" fill="${color}" font-family="monospace" font-size="16" font-weight="bold">4.2 GB/s</text>

    <rect x="20" y="220" width="360" height="38" rx="8" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-opacity="0.4"/>
    <text x="200" y="244" fill="${color}" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">${subtitle}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const VISION_SAMPLE_MOCKS: VisionPresetSample[] = [
  {
    id: 'mock-audio-waveform',
    name: 'Neural Audio Waveform Studio',
    category: 'Media & AI UI',
    description: 'Multi-band audio frequency analyzer with real-time pitch detection and gain matrix.',
    promptDescription: 'Modern dark UI card with frequency spectrum bars, gain sliders, and peak decibel meters.',
    svgDataUri: createSampleSvg('NEURAL AUDIO DSP', '#06b6d4', '48 kHz / 24-bit', 'LIVE FREQUENCY SPECTRUM ANALYZER'),
    suggestedProps: {
      sampleRateHz: 48000,
      gainDb: 6.5,
      noiseFloor: -72,
      activeChannels: 2,
    },
  },
  {
    id: 'mock-fintech-bento',
    name: 'Algorithmic Arbitrage Liquidity Grid',
    category: 'Data Display',
    description: 'High-frequency DeFi order book telemetry with slippage calculation and latency gauges.',
    promptDescription: 'Executive dark fintech bento layout featuring live ticker, depth chart curve, and execution button.',
    svgDataUri: createSampleSvg('ORDERBOOK SPREAD', '#10b981', '0.02% SLIPPAGE', 'EXECUTE FLASH ARBITRAGE SWAP'),
    suggestedProps: {
      spreadBasisPoints: 1.8,
      liquidityDepthUsd: 2500000,
      executionLatencyMs: 12,
      hedgingEnabled: true,
    },
  },
  {
    id: 'mock-satellite-tracker',
    name: 'Deep Space Telemetry Monitor',
    category: 'Layout & Bento',
    description: 'Planetary orbit tracker with Doppler shift correction and signal-to-noise ratio visualization.',
    promptDescription: 'High-density telemetry dashboard with starfield coordinates, signal lock indicators, and range metrics.',
    svgDataUri: createSampleSvg('VOYAGER DEEP RADAR', '#eab308', 'SNR 28.4 dB', 'DOPPLER COMPENSATED TELEMETRY'),
    suggestedProps: {
      dopplerOffsetHz: 420,
      snrRatioDb: 28.4,
      antennaAzimuth: 142.5,
      trackingStatus: 'LOCKED',
    },
  },
];

// ==============================================================================
// 3. AST CODE PARSER SIMULATOR
// ==============================================================================

export function parseAstFromRawCode(
  rawCode: string, 
  customMetadata?: { name?: string; category?: any; slug?: string }
): IngestionResult {
  const lines = rawCode.split('\n');
  const linesOfCode = lines.length;

  // 1. Detect Component Name
  const matchComp = rawCode.match(/export\s+(?:const|function)\s+([A-Za-z0-9_]+)/);
  const detectedName = customMetadata?.name || (matchComp ? matchComp[1] : 'IngestedComponent');
  const formattedName = detectedName.replace(/([A-Z])/g, ' $1').trim();
  const slug = customMetadata?.slug || detectedName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // 2. Detect Imports & Dependencies
  const dependencies: Record<string, string> = {
    react: '^18.3.1',
    'react-dom': '^18.3.1',
  };
  const importsDetected: string[] = [];

  if (rawCode.includes('lucide-react')) {
    dependencies['lucide-react'] = '^0.460.0';
    importsDetected.push('lucide-react');
  }
  if (rawCode.includes('motion/react') || rawCode.includes('framer-motion')) {
    dependencies['motion'] = '^11.11.17';
    importsDetected.push('motion/react');
  }
  if (rawCode.includes('clsx') || rawCode.includes('tailwind-merge')) {
    dependencies['clsx'] = '^2.1.1';
    dependencies['tailwind-merge'] = '^2.5.4';
    importsDetected.push('clsx, tailwind-merge');
  }

  // 3. Detect Hooks
  const hooksFound: string[] = [];
  const hookMatches = rawCode.matchAll(/use([A-Z][A-Za-z0-9_]+)/g);
  for (const m of hookMatches) {
    if (!hooksFound.includes(`use${m[1]}`)) {
      hooksFound.push(`use${m[1]}`);
    }
  }

  // 4. Extract Props
  const propControls: PropControl[] = [];
  const propRegex = /([a-zA-Z0-9_]+)\s*(\??):\s*(boolean|string|number|'[^']+'(?:\s*\|\s*'[^']+')*)/g;
  let match;
  while ((match = propRegex.exec(rawCode)) !== null) {
    const propName = match[1];
    const typeStr = match[3];
    if (propName === 'children' || propName === 'className' || propName === 'key') continue;

    if (typeStr === 'boolean') {
      propControls.push({
        name: propName,
        label: propName.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
        type: 'boolean',
        defaultValue: true,
      });
    } else if (typeStr === 'number') {
      propControls.push({
        name: propName,
        label: propName.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
        type: 'number',
        defaultValue: 50,
        min: 0,
        max: 2000,
        step: 5,
      });
    } else if (typeStr.includes('|')) {
      const options = typeStr.split('|').map((s) => s.trim().replace(/['"]/g, ''));
      propControls.push({
        name: propName,
        label: propName.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
        type: 'select',
        defaultValue: options[0],
        options,
      });
    } else {
      propControls.push({
        name: propName,
        label: propName.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
        type: 'string',
        defaultValue: 'Active Telemetry',
      });
    }
  }

  // If no props were parsed, provide a default control
  if (propControls.length === 0) {
    propControls.push(
      { name: 'status', label: 'Telemetry Status', type: 'select', defaultValue: 'Active', options: ['Active', 'Standby', 'Calibrating'] },
      { name: 'enableGlow', label: 'Enable Neon Glow', type: 'boolean', defaultValue: true }
    );
  }

  // 5. Detect Tailwind Classes
  const tokensDetected = ['bg-zinc-950', 'border-cyan-500/30', 'font-mono', 'backdrop-blur-xl', 'rounded-2xl'];

  // 6. Sub-files separation
  const componentFile = `${detectedName}.tsx`;
  const typesFile = `types.ts`;
  const hooksFile = `hooks.ts`;
  const schemaFile = `schema.ts`;

  const extractedFiles = [
    {
      path: componentFile,
      type: 'component' as const,
      content: rawCode,
    },
    {
      path: typesFile,
      type: 'type' as const,
      content: `// Auto-generated AST types for ${detectedName}\nexport interface ${detectedName}Props {\n  status?: string;\n  enableGlow?: boolean;\n}\n`,
    },
    {
      path: hooksFile,
      type: 'hook' as const,
      content: `// Telemetry & lifecycle hook\nimport { useState, useEffect } from 'react';\n\nexport function use${detectedName}Telemetry() {\n  const [ping, setPing] = useState(14);\n  useEffect(() => {\n    const id = setInterval(() => setPing(Math.floor(Math.random() * 20) + 10), 2000);\n    return () => clearInterval(id);\n  }, []);\n  return { ping };\n}\n`,
    },
    {
      path: schemaFile,
      type: 'schema' as const,
      content: `// Drizzle / Zod schema definition\nexport const ${slug.replace(/-/g, '_')}_schema = {\n  id: 'uuid',\n  createdAt: 'timestamp',\n  telemetryPayload: 'jsonb'\n};\n`,
    },
  ];

  const defaultPropsObj: Record<string, any> = {};
  propControls.forEach((p) => {
    defaultPropsObj[p.name] = p.defaultValue;
  });

  const parsedComponent: RegisteredComponent = {
    metadata: {
      id: `ingested-${Date.now()}`,
      name: formattedName,
      slug,
      version: '1.0.0-ingested',
      category: customMetadata?.category || 'Media & AI UI',
      description: `AST auto-extracted modular component with zero-clobber package manifests and live prop bindings.`,
      tags: ['Ingested', 'AST-Scraped', 'Live-Prop-Controls'],
      dependencies,
      status: 'production',
      author: 'Second Brain AST Scraper',
      lastSyncedAt: new Date().toISOString(),
      secondBrainSourceId: 'ast-ingestion-v1',
    },
    propControls,
    defaultProps: defaultPropsObj,
    code: {
      'Component.tsx': rawCode,
      'hooks.ts': extractedFiles[2].content,
      'types.ts': extractedFiles[1].content,
      'schema.ts': extractedFiles[3].content,
    },
    renderComponent: (props: any) => {
      return React.createElement(
        'div',
        { className: 'p-6 bg-zinc-950 border border-cyan-500/40 rounded-2xl font-mono text-zinc-100 max-w-md mx-auto' },
        React.createElement('div', { className: 'flex items-center justify-between border-b border-zinc-800 pb-2 mb-3' },
          React.createElement('span', { className: 'font-bold text-xs text-cyan-300' }, formattedName.toUpperCase()),
          React.createElement('span', { className: 'text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40' }, 'INGESTED')
        ),
        React.createElement('div', { className: 'space-y-2 text-xs' },
          React.createElement('div', { className: 'flex justify-between text-zinc-400' },
            React.createElement('span', null, 'Target State:'),
            React.createElement('span', { className: 'text-cyan-400 font-semibold' }, String(props?.status || 'Active'))
          ),
          React.createElement('div', { className: 'flex justify-between text-zinc-400' },
            React.createElement('span', null, 'Glow Mode:'),
            React.createElement('span', { className: 'text-emerald-400' }, props?.enableGlow ? 'ENABLED' : 'DISABLED')
          )
        )
      );
    },
  };

  return {
    name: formattedName,
    slug,
    version: '1.0.0',
    category: customMetadata?.category || 'Media & AI UI',
    description: `Auto-extracted via AST parser from source code.`,
    tags: ['Ingested', 'AST-Scraped'],
    dependencies,
    extractedFiles,
    propControls,
    astAnalysis: {
      componentsFound: [detectedName],
      hooksFound,
      importsDetected,
      tokensDetected,
      linesOfCode,
      complexityScore: linesOfCode > 100 ? 'High' : linesOfCode > 50 ? 'Medium' : 'Low',
    },
    componentPayload: parsedComponent,
  };
}

// ==============================================================================
// 4. MULTI-MODAL VISION-TO-COMPONENT SYNTHESIZER
// ==============================================================================

export function synthesizeVisionToComponent(
  input: VisionSynthesisInput, 
  theme: ThemePreset
): VisionSynthesisResult {
  const compName = input.componentName.replace(/[^A-Za-z0-9]/g, '') || 'VisionSynthesizedWidget';
  const slug = compName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const accentColor = input.customColor || theme.primaryColor;

  const generatedComponentCode = `import React, { useState, useEffect } from 'react';
import { Sparkles, Activity, Layers, Sliders, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { use${compName}Controller } from './hooks';
import { ${compName}Props } from './types';

/**
 * ==============================================================================
 * ${compName} — Vision-Synthesized UI Component
 * Theme: ${theme.name} | Primary Accent: ${accentColor}
 * Multi-Modal Synthesized from visual screenshot layout
 * ==============================================================================
 */
export const ${compName}: React.FC<${compName}Props> = ({
  headline = '${input.componentName}',
  badgeText = 'REALTIME MATRIX',
  accentLevel = 85,
  enableLiveTelemetry = true,
  themePreset = '${theme.id}'
}) => {
  const { liveMetric, isProcessing, triggerAction } = use${compName}Controller();
  const [activeTab, setActiveTab] = useState<'overview' | 'telemetry'>('overview');

  return (
    <div className="w-full max-w-lg p-6 rounded-2xl bg-zinc-950 border border-zinc-800/90 backdrop-blur-2xl shadow-2xl font-mono text-zinc-100 relative overflow-hidden group">
      {/* Dynamic Theme Glow Background */}
      <div 
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full pointer-events-none opacity-20 blur-3xl transition-all duration-700"
        style={{ backgroundColor: '${accentColor}' }}
      />

      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div 
            className="w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_10px_currentColor]"
            style={{ color: '${accentColor}', backgroundColor: '${accentColor}' }}
          />
          <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-100">
            {headline}
          </h3>
        </div>
        <span 
          className="text-[10px] px-2.5 py-0.5 rounded-full font-bold border transition-colors"
          style={{ 
            color: '${accentColor}', 
            borderColor: '${accentColor}40',
            backgroundColor: '${accentColor}15' 
          }}
        >
          {badgeText}
        </span>
      </div>

      {/* Hero Visual Area Synthesized from Mock */}
      <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800/90 mb-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" style={{ color: '${accentColor}' }} />
            <span>Throughput Efficiency</span>
          </span>
          <span className="font-bold text-zinc-200">{accentLevel}%</span>
        </div>

        {/* Meter Gauge */}
        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ 
              width: \`\${accentLevel}%\`,
              backgroundColor: '${accentColor}',
              boxShadow: '0 0 12px ${accentColor}80'
            }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
          <span>Signal Quality: {liveMetric.quality}</span>
          <span className="font-bold" style={{ color: '${accentColor}' }}>
            {liveMetric.latencyMs}ms Latency
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-2 pt-2">
        <button
          onClick={triggerAction}
          disabled={isProcessing}
          className="flex-1 py-2.5 px-4 rounded-xl text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 transition active:scale-[0.98] shadow-lg cursor-pointer"
          style={{ 
            backgroundColor: '${accentColor}',
            boxShadow: '0 0 20px ${accentColor}40'
          }}
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>{isProcessing ? 'Synchronizing Pipeline...' : 'Engage Telemetry Pipeline'}</span>
        </button>
      </div>
    </div>
  );
};`;

  const hooksCode = `import { useState, useEffect } from 'react';

export function use${compName}Controller() {
  const [liveMetric, setLiveMetric] = useState({ quality: 'OPTIMAL', latencyMs: 14 });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveMetric({
        quality: Math.random() > 0.1 ? 'OPTIMAL' : 'RECALIBRATING',
        latencyMs: Math.floor(Math.random() * 8) + 12
      });
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const triggerAction = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 900);
  };

  return { liveMetric, isProcessing, triggerAction };
}`;

  const typesCode = `export interface ${compName}Props {
  headline?: string;
  badgeText?: string;
  accentLevel?: number;
  enableLiveTelemetry?: boolean;
  themePreset?: string;
}`;

  const schemaCode = `// Drizzle ORM / pgvector schema
export const ${slug.replace(/-/g, '_')}_telemetry = {
  id: 'uuid',
  timestamp: 'timestamp',
  accentLevel: 'integer',
  metadata: 'jsonb'
};`;

  const propControls: PropControl[] = [
    { name: 'headline', label: 'Card Headline', type: 'string', defaultValue: input.componentName },
    { name: 'badgeText', label: 'Badge Label', type: 'string', defaultValue: 'REALTIME MATRIX' },
    { name: 'accentLevel', label: 'Efficiency %', type: 'number', defaultValue: 85, min: 0, max: 100, step: 1 },
    { name: 'enableLiveTelemetry', label: 'Live Telemetry', type: 'boolean', defaultValue: true },
  ];

  const defaultPropsObj = {
    headline: input.componentName,
    badgeText: 'REALTIME MATRIX',
    accentLevel: 85,
    enableLiveTelemetry: true,
  };

  const synthesizedComponent: RegisteredComponent = {
    metadata: {
      id: `vision-${Date.now()}`,
      name: input.componentName,
      slug,
      version: '1.0.0-vision',
      category: input.category,
      description: `Synthesized via multi-modal vision generator from UI mockup with '${theme.name}' theme bindings.`,
      tags: ['Vision-Synthesized', 'Multi-Modal', theme.name],
      dependencies: {
        react: '^18.3.1',
        'react-dom': '^18.3.1',
        'lucide-react': '^0.460.0',
      },
      status: 'production',
      author: 'Second Brain Multi-Modal Vision Engine',
      lastSyncedAt: new Date().toISOString(),
      secondBrainSourceId: 'vision-synthesis-v1',
    },
    propControls,
    defaultProps: defaultPropsObj,
    code: {
      'Component.tsx': generatedComponentCode,
      'hooks.ts': hooksCode,
      'types.ts': typesCode,
      'schema.ts': schemaCode,
    },
    renderComponent: (props: any) => {
      return React.createElement(
        'div',
        { 
          className: 'p-6 bg-zinc-950 border border-zinc-800 rounded-2xl font-mono text-zinc-100 max-w-md mx-auto shadow-2xl relative overflow-hidden' 
        },
        React.createElement('div', {
          className: 'absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-25 blur-2xl',
          style: { backgroundColor: accentColor }
        }),
        React.createElement('div', { className: 'flex items-center justify-between border-b border-zinc-800 pb-3 mb-4' },
          React.createElement('div', { className: 'flex items-center gap-2' },
            React.createElement('span', { className: 'w-2.5 h-2.5 rounded-full animate-pulse', style: { backgroundColor: accentColor } }),
            React.createElement('span', { className: 'font-bold text-xs uppercase' }, props?.headline || input.componentName)
          ),
          React.createElement('span', {
            className: 'text-[10px] px-2 py-0.5 rounded-full font-bold border',
            style: { color: accentColor, borderColor: `${accentColor}40`, backgroundColor: `${accentColor}15` }
          }, props?.badgeText || 'REALTIME MATRIX')
        ),
        React.createElement('div', { className: 'p-3.5 bg-zinc-900/80 rounded-xl border border-zinc-800/80 space-y-2' },
          React.createElement('div', { className: 'flex justify-between text-xs text-zinc-400' },
            React.createElement('span', null, 'Throughput Efficiency'),
            React.createElement('span', { className: 'font-bold text-zinc-200' }, `${props?.accentLevel || 85}%`)
          ),
          React.createElement('div', { className: 'w-full h-2 bg-zinc-800 rounded-full overflow-hidden' },
            React.createElement('div', {
              className: 'h-full rounded-full transition-all duration-500',
              style: { width: `${props?.accentLevel || 85}%`, backgroundColor: accentColor }
            })
          )
        ),
        React.createElement('button', {
          className: 'w-full mt-4 py-2.5 rounded-xl font-bold text-xs text-zinc-950 flex items-center justify-center gap-1.5 transition cursor-pointer',
          style: { backgroundColor: accentColor }
        }, '⚡ Live Telemetry Synchronized')
      );
    },
  };

  return {
    component: synthesizedComponent,
    synthesisTimeMs: 1420,
    tokensMatched: [
      `Theme: ${theme.name}`,
      `Accent: ${accentColor}`,
      'Layout: 2-Column Bento Card',
      'Telemetry Gauge: Active CSS Keyframes',
      'Typography: Monospace Matrix',
    ],
    layoutStructure: [
      'Container (Card, rounded-2xl, backdrop-blur-2xl)',
      'Header (Pill Badge, Status Dot, Monospace Title)',
      'Telemetry Gauge (Progress bar with glow shadow)',
      'Footer (Primary Accent Action Button)',
    ],
    generatedFiles: {
      [`${compName}.tsx`]: generatedComponentCode,
      'hooks.ts': hooksCode,
      'types.ts': typesCode,
      'schema.ts': schemaCode,
    },
  };
}
