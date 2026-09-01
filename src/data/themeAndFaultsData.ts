import { ThemePreset, SyntheticFault } from '../types';

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'minimal-zinc',
    name: 'Minimal Zinc',
    primaryColor: '#06b6d4', // Cyan
    primaryBgClass: 'bg-cyan-500',
    primaryTextClass: 'text-cyan-400',
    primaryBorderClass: 'border-cyan-500/40',
    accentGlow: 'rgba(6, 182, 212, 0.4)',
    badgeStyle: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    cardBgClass: 'bg-zinc-900/90 border-zinc-800',
    fontFamily: 'font-mono',
    description: 'Clean, industrial monochrome palette with electric cyan accents & crisp contrast.',
    tailwindColors: {
      brand: {
        DEFAULT: '#06b6d4',
        light: '#22d3ee',
        dark: '#0891b2',
        glow: 'rgba(6, 182, 212, 0.4)',
      },
    },
  },
  {
    id: 'cyberpunk-emerald',
    name: 'Cyberpunk Emerald',
    primaryColor: '#10b981', // Emerald green
    primaryBgClass: 'bg-emerald-500',
    primaryTextClass: 'text-emerald-400',
    primaryBorderClass: 'border-emerald-500/40',
    accentGlow: 'rgba(16, 185, 129, 0.45)',
    badgeStyle: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    cardBgClass: 'bg-zinc-950/95 border-emerald-900/40',
    fontFamily: 'font-mono',
    description: 'High-contrast matrix terminal palette with neon emerald bioluminescence.',
    tailwindColors: {
      brand: {
        DEFAULT: '#10b981',
        light: '#34d399',
        dark: '#059669',
        glow: 'rgba(16, 185, 129, 0.45)',
      },
    },
  },
  {
    id: 'gold-luxury',
    name: 'Gold Luxury',
    primaryColor: '#eab308', // Amber / Gold
    primaryBgClass: 'bg-amber-500',
    primaryTextClass: 'text-amber-400',
    primaryBorderClass: 'border-amber-500/40',
    accentGlow: 'rgba(234, 179, 8, 0.4)',
    badgeStyle: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    cardBgClass: 'bg-stone-950/95 border-amber-900/30',
    fontFamily: 'font-serif',
    description: 'Warm, prestigious brass and amber tones designed for executive fintech dashboards.',
    tailwindColors: {
      brand: {
        DEFAULT: '#eab308',
        light: '#fde047',
        dark: '#ca8a04',
        glow: 'rgba(234, 179, 8, 0.4)',
      },
    },
  },
  {
    id: 'enterprise-slate',
    name: 'Enterprise Slate',
    primaryColor: '#6366f1', // Indigo / Slate
    primaryBgClass: 'bg-indigo-500',
    primaryTextClass: 'text-indigo-400',
    primaryBorderClass: 'border-indigo-500/40',
    accentGlow: 'rgba(99, 102, 241, 0.4)',
    badgeStyle: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    cardBgClass: 'bg-slate-900/90 border-slate-800',
    fontFamily: 'font-sans',
    description: 'Professional deep cobalt & indigo hues engineered for high-density enterprise SaaS.',
    tailwindColors: {
      brand: {
        DEFAULT: '#6366f1',
        light: '#818cf8',
        dark: '#4f46e5',
        glow: 'rgba(99, 102, 241, 0.4)',
      },
    },
  },
];

export const SYNTHETIC_FAULTS: SyntheticFault[] = [
  {
    id: 'fault-webrtc-stream-null',
    name: 'WebRTC Null Pointer Dereference',
    description: 'Simulates accessing stream.getVideoTracks()[0] when user revokes camera permissions.',
    targetFile: 'hooks.ts',
    faultyCodeSnippet: `// BUGGY LINE
const track = stream.getVideoTracks()[0];
const settings = track.getSettings(); // Uncaught TypeError: Cannot read properties of undefined`,
    errorMessage: `TypeError: Cannot read properties of undefined (reading 'getSettings')
    at useCameraStream (src/components/ui/synergy-cam/hooks.ts:42:28)
    at SynergyCam (src/components/ui/synergy-cam/SynergyCam.tsx:88:14)
    at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:15486)`,
    stackTrace: [
      'TypeError: Cannot read properties of undefined (reading "getSettings")',
      '  at useCameraStream (src/components/ui/synergy-cam/hooks.ts:42:28)',
      '  at SynergyCam (src/components/ui/synergy-cam/SynergyCam.tsx:88:14)',
      '  at Vitest runner: test/synergy-cam.test.tsx:24:9',
    ],
    suggestedFixDiff: `--- a/src/components/ui/synergy-cam/hooks.ts
+++ b/src/components/ui/synergy-cam/hooks.ts
@@ -40,4 +40,5 @@
-  const track = stream.getVideoTracks()[0];
-  const settings = track.getSettings();
+  const videoTracks = stream ? stream.getVideoTracks() : [];
+  const track = videoTracks.length > 0 ? videoTracks[0] : null;
+  const settings = track?.getSettings() || { width: 1280, height: 720, frameRate: 30 };`,
  },
  {
    id: 'fault-rate-limiter-overflow',
    name: 'WebSocket Rate-Limiter Burst Overflow',
    description: 'Simulates unthrottled 1000fps canvas drawing events overloading message queue.',
    targetFile: 'SynergyCam.tsx',
    faultyCodeSnippet: `// BUGGY BURST LOOP
onFrameCapture((frame) => {
  ws.send(JSON.stringify(frame)); // Buffer overflow: RateLimitExceededException (1000 req/s)
});`,
    errorMessage: `RateLimitExceededException: WebSocket frame buffer exceeded threshold (max 60 fps).
    at WebSocketBridge.dispatch (src/lib/telemetry.ts:104:12)
    at SynergyCam.handleDraw (src/components/ui/synergy-cam/SynergyCam.tsx:162:9)`,
    stackTrace: [
      'RateLimitExceededException: Buffer threshold exceeded (1000 msgs/s)',
      '  at WebSocketBridge.dispatch (src/lib/telemetry.ts:104:12)',
      '  at SynergyCam.handleDraw (src/components/ui/synergy-cam/SynergyCam.tsx:162:9)',
      '  at Vitest runner: test/telemetry-load.test.tsx:51:7',
    ],
    suggestedFixDiff: `--- a/src/components/ui/synergy-cam/SynergyCam.tsx
+++ b/src/components/ui/synergy-cam/SynergyCam.tsx
@@ -158,3 +158,5 @@
-  onFrameCapture((frame) => {
-    ws.send(JSON.stringify(frame));
+  const lastSentRef = useRef(0);
+  onFrameCapture((frame) => {
+    const now = performance.now();
+    if (now - lastSentRef.current >= 1000 / targetFps) {
+      lastSentRef.current = now;
+      ws.send(JSON.stringify(frame));
+    }
   });`,
  },
  {
    id: 'fault-webauthn-missing-challenge',
    name: 'Passkey Credential Creation Missing Salt Challenge',
    description: 'Simulates undefined navigator.credentials creation payload challenge buffer.',
    targetFile: 'QuantumPasskeyModal.tsx',
    faultyCodeSnippet: `// BUGGY WEBAUTHN PAYLOAD
const credential = await navigator.credentials.create({
  publicKey: { challenge: undefined } // DOMException: The operation failed because an invalid argument was supplied
});`,
    errorMessage: `DOMException: Failed to execute 'create' on 'CredentialsContainer': Required parameter 'challenge' missing or invalid.
    at QuantumPasskeyModal.handleRegister (src/components/ui/quantum-passkey/QuantumPasskeyModal.tsx:64:33)`,
    stackTrace: [
      "DOMException: Required parameter 'challenge' missing or invalid",
      '  at QuantumPasskeyModal.handleRegister (src/components/ui/quantum-passkey/QuantumPasskeyModal.tsx:64:33)',
      '  at Vitest runner: test/passkey.test.tsx:19:12',
    ],
    suggestedFixDiff: `--- a/src/components/ui/quantum-passkey/QuantumPasskeyModal.tsx
+++ b/src/components/ui/quantum-passkey/QuantumPasskeyModal.tsx
@@ -62,3 +62,6 @@
-  const credential = await navigator.credentials.create({
-    publicKey: { challenge: undefined }
+  const challengeBuffer = crypto.getRandomValues(new Uint8Array(32));
+  const credential = await navigator.credentials.create({
+    publicKey: {
+      challenge: challengeBuffer,
+      rp: { name: 'Satellite Cloud Gateway' },
+      user: { id: new Uint8Array(16), name: 'user@satellite.io', displayName: 'Developer' }
+    }
   });`,
  },
];
