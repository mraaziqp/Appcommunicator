import React, { useState } from 'react';
import { 
  Image as ImageIcon, Sparkles, UploadCloud, RefreshCw, 
  CheckCircle2, Sliders, Palette, Zap, ArrowRight, Eye, Code2,
  Cpu, Layers, FileCode, Check
} from 'lucide-react';
import { useRegistry } from '../context/RegistryContext';
import { 
  VISION_SAMPLE_MOCKS, 
  synthesizeVisionToComponent 
} from '../data/ingestionAndVisionPresets';
import { ComponentCategory, ThemePresetId, VisionSynthesisResult } from '../types';

interface VisionToCodeTabProps {
  onClose?: () => void;
}

export const VisionToCodeTab: React.FC<VisionToCodeTabProps> = ({ onClose }) => {
  const { 
    currentTheme, 
    customAccentColor, 
    themePresets,
    setThemePreset,
    ingestComponent 
  } = useRegistry();

  const [selectedPresetMock, setSelectedPresetMock] = useState(VISION_SAMPLE_MOCKS[0]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(VISION_SAMPLE_MOCKS[0].svgDataUri);
  const [componentName, setComponentName] = useState(VISION_SAMPLE_MOCKS[0].name);
  const [category, setCategory] = useState<ComponentCategory>(VISION_SAMPLE_MOCKS[0].category);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [targetThemeId, setTargetThemeId] = useState<ThemePresetId>(currentTheme.id);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisResult, setSynthesisResult] = useState<VisionSynthesisResult | null>(() => {
    return synthesizeVisionToComponent({
      imageSrc: VISION_SAMPLE_MOCKS[0].svgDataUri,
      imageName: VISION_SAMPLE_MOCKS[0].name,
      componentName: VISION_SAMPLE_MOCKS[0].name,
      category: VISION_SAMPLE_MOCKS[0].category,
      targetTheme: currentTheme.id,
      customColor: customAccentColor,
    }, currentTheme);
  });
  const [stepIndex, setStepIndex] = useState(3);

  const handleSelectPreset = (mock: typeof VISION_SAMPLE_MOCKS[0]) => {
    setSelectedPresetMock(mock);
    setImagePreviewUrl(mock.svgDataUri);
    setComponentName(mock.name);
    setCategory(mock.category);
    
    // Auto-synthesize for this mock
    const res = synthesizeVisionToComponent({
      imageSrc: mock.svgDataUri,
      imageName: mock.name,
      componentName: mock.name,
      category: mock.category,
      targetTheme: targetThemeId,
      customColor: customAccentColor,
    }, currentTheme);
    setSynthesisResult(res);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setImagePreviewUrl(url);
        const derivedName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');
        setComponentName(derivedName.charAt(0).toUpperCase() + derivedName.slice(1));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartSynthesis = async () => {
    setIsSynthesizing(true);
    setStepIndex(0);

    // Step 1: Vision Tokenizer
    await new Promise((r) => setTimeout(r, 600));
    setStepIndex(1);

    // Step 2: Theme Token Mapping
    await new Promise((r) => setTimeout(r, 600));
    setStepIndex(2);

    // Step 3: AST Code Assembly
    await new Promise((r) => setTimeout(r, 700));
    const targetThemeObj = themePresets.find((t) => t.id === targetThemeId) || currentTheme;
    const res = synthesizeVisionToComponent({
      imageSrc: imagePreviewUrl,
      imageName: componentName,
      componentName,
      category,
      targetTheme: targetThemeId,
      customColor: customAccentColor,
      additionalNotes,
    }, targetThemeObj);

    setSynthesisResult(res);
    setStepIndex(3);
    setIsSynthesizing(false);
  };

  const handleMountToSandbox = () => {
    if (!synthesisResult) return;
    ingestComponent({
      name: synthesisResult.component.metadata.name,
      slug: synthesisResult.component.metadata.slug,
      version: synthesisResult.component.metadata.version,
      category: synthesisResult.component.metadata.category,
      description: synthesisResult.component.metadata.description,
      tags: synthesisResult.component.metadata.tags,
      dependencies: synthesisResult.component.metadata.dependencies,
      extractedFiles: [
        {
          path: `${synthesisResult.component.metadata.name.replace(/[^A-Za-z0-9]/g, '')}.tsx`,
          type: 'component',
          content: synthesisResult.generatedFiles[`${synthesisResult.component.metadata.name.replace(/[^A-Za-z0-9]/g, '')}.tsx`] || '',
        },
      ],
      propControls: synthesisResult.component.propControls,
      astAnalysis: {
        componentsFound: [synthesisResult.component.metadata.name],
        hooksFound: ['useController'],
        importsDetected: ['lucide-react', 'react'],
        tokensDetected: synthesisResult.tokensMatched,
        linesOfCode: 85,
        complexityScore: 'Medium',
      },
      componentPayload: synthesisResult.component,
    });
    if (onClose) onClose();
  };

  return (
    <div className="w-full bg-zinc-950/95 border border-zinc-800/90 rounded-2xl p-4 md:p-6 text-zinc-200 font-sans shadow-2xl backdrop-blur-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-zinc-100 font-mono">
                Multi-Modal &quot;Vision-to-Component&quot; Synthesizer
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                AI VISION v5
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Drop any screenshot or UI wireframe. Jarvis parses layout hierarchy, applies your active theme tokens, and mounts modular React code.
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xs font-mono text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded bg-zinc-900 border border-zinc-800"
          >
            ✕ Close
          </button>
        )}
      </div>

      {/* Main Grid: Upload & Presets (Left) vs. Synthesized Output (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Input Dropzone & Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Preset Wireframe Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold text-zinc-300">
              Pick Preset UI Wireframe:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {VISION_SAMPLE_MOCKS.map((mock) => {
                const isSelected = selectedPresetMock.id === mock.id;
                return (
                  <button
                    key={mock.id}
                    onClick={() => handleSelectPreset(mock)}
                    className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-900 border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                        : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="text-[11px] font-bold font-mono text-zinc-200 truncate">
                      {mock.name}
                    </div>
                    <div className="text-[9px] text-zinc-400 truncate mt-0.5">
                      {mock.category}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Visual Dropzone & Preview Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold text-zinc-300">
              Visual Screenshot / Mock Canvas:
            </label>
            <div className="relative rounded-xl border-2 border-dashed border-zinc-800 hover:border-cyan-500/50 bg-zinc-900/50 p-3 transition flex flex-col items-center justify-center overflow-hidden min-h-[160px]">
              {imagePreviewUrl ? (
                <div className="relative w-full flex items-center justify-center">
                  <img
                    src={imagePreviewUrl}
                    alt="Mockup Preview"
                    className="max-h-[140px] max-w-full rounded-lg object-contain border border-zinc-800 shadow-md"
                  />
                  <label className="absolute bottom-2 right-2 px-2 py-1 bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-700 text-zinc-200 rounded-lg text-[10px] font-mono cursor-pointer transition">
                    Change Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 cursor-pointer w-full py-6">
                  <UploadCloud className="w-8 h-8 text-zinc-500" />
                  <span className="text-xs font-mono text-zinc-400">
                    Drag &amp; drop UI screenshot here or click to browse
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Component Name & Category Form */}
          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            <div>
              <label className="text-zinc-300 font-semibold">Component Name:</label>
              <input
                value={componentName}
                onChange={(e) => setComponentName(e.target.value)}
                className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-100"
              />
            </div>
            <div>
              <label className="text-zinc-300 font-semibold">Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-zinc-100"
              >
                <option value="Media & AI UI">Media &amp; AI UI</option>
                <option value="Data Display">Data Display</option>
                <option value="Auth & Security">Auth &amp; Security</option>
                <option value="Layout & Bento">Layout &amp; Bento</option>
              </select>
            </div>
          </div>

          {/* Theme Preset Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold text-zinc-300 flex items-center justify-between">
              <span>Target Tailwind Theme Token:</span>
              <span className="text-[10px] text-cyan-400 font-normal">
                {targetThemeId}
              </span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {themePresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setTargetThemeId(preset.id);
                    setThemePreset(preset.id);
                  }}
                  className={`p-2 rounded-lg border text-left text-xs font-mono transition flex items-center gap-2 ${
                    targetThemeId === preset.id
                      ? 'bg-zinc-800 text-zinc-100 font-semibold border-cyan-500/60'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: preset.primaryColor }}
                  />
                  <span className="truncate">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Action Button */}
          <button
            onClick={handleStartSynthesis}
            disabled={isSynthesizing}
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold font-mono text-xs flex items-center justify-center gap-2 transition shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isSynthesizing ? 'animate-spin' : ''}`} />
            <span>{isSynthesizing ? 'Synthesizing Visual Layout...' : 'Synthesize React Component'}</span>
          </button>
        </div>

        {/* Right Column: Multi-Modal Output & Live Preview (7 cols) */}
        <div className="lg:col-span-7 bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between space-y-4">
          {/* Synthesis Pipeline Visualizer */}
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Multi-Modal Vision Pipeline:</span>
              <span className="text-emerald-400 font-semibold text-[10px]">
                {stepIndex === 3 ? 'SYNTHESIS COMPLETE' : `STEP ${stepIndex + 1}/4`}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div className={`p-2 rounded-lg border ${stepIndex >= 0 ? 'bg-zinc-900 border-cyan-500/40 text-cyan-300' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}>
                1. Visual Layout Tree
              </div>
              <div className={`p-2 rounded-lg border ${stepIndex >= 1 ? 'bg-zinc-900 border-emerald-500/40 text-emerald-300' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}>
                2. Theme Tokens Mapped
              </div>
              <div className={`p-2 rounded-lg border ${stepIndex >= 2 ? 'bg-zinc-900 border-purple-500/40 text-purple-300' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}>
                3. Code Scaffolded
              </div>
            </div>
          </div>

          {/* Live Preview of Synthesized Component */}
          {synthesisResult && (
            <div className="flex-1 flex flex-col justify-center items-center p-4 bg-zinc-950/80 rounded-xl border border-zinc-800/80">
              <div className="text-[10px] font-mono text-zinc-500 mb-3 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>Live Interactive Component Preview (Theme-Bound):</span>
              </div>
              <div className="w-full flex justify-center">
                <synthesisResult.component.previewComponent props={synthesisResult.component.defaultProps} />
              </div>
            </div>
          )}

          {/* Tokens and Matched Layout Specs */}
          {synthesisResult && (
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800">
                <div className="text-[10px] text-zinc-500 mb-1">Matched Theme Tokens:</div>
                <div className="text-cyan-300 text-[11px] space-y-0.5">
                  {synthesisResult.tokensMatched.slice(0, 3).map((t, idx) => (
                    <div key={idx} className="truncate">• {t}</div>
                  ))}
                </div>
              </div>
              <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800">
                <div className="text-[10px] text-zinc-500 mb-1">Generated Subtrees:</div>
                <div className="text-emerald-300 text-[11px] space-y-0.5">
                  <div>• Component.tsx (Tailwind UI)</div>
                  <div>• hooks.ts (Interactive State)</div>
                  <div>• types.ts (Props &amp; Schema)</div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Commit Action */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">
              Generated in {synthesisResult?.synthesisTimeMs || 1200}ms
            </span>
            <button
              onClick={handleMountToSandbox}
              disabled={!synthesisResult || isSynthesizing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold font-mono text-xs transition shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mount to Sandbox &amp; Monaco Editor</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
