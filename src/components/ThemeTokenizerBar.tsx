import React, { useState } from 'react';
import { 
  Palette, Sparkles, Check, Sliders, ChevronDown, CheckCircle2, 
  Paintbrush, Sun, Moon, Droplet, Zap
} from 'lucide-react';
import { useRegistry } from '../context/RegistryContext';
import { ThemePresetId } from '../types';

export const ThemeTokenizerBar: React.FC = () => {
  const { 
    currentTheme, 
    setThemePreset, 
    customAccentColor, 
    setCustomAccentColor, 
    themePresets 
  } = useRegistry();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full bg-zinc-950/90 border-b border-zinc-800/80 px-3.5 py-1.5 flex flex-wrap items-center justify-between gap-2 z-10 backdrop-blur-md">
      {/* Theme Presets */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 mr-1.5">
          <Palette className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-zinc-300">Theme Preset:</span>
        </div>

        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs font-mono">
          {themePresets.map((preset) => {
            const isSelected = currentTheme.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => setThemePreset(preset.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] transition cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title={preset.description}
              >
                <span 
                  className="w-2 h-2 rounded-full shadow-sm"
                  style={{ backgroundColor: preset.primaryColor }}
                />
                <span>{preset.name}</span>
                {isSelected && <Check className="w-3 h-3 text-cyan-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Accent Color Picker & Token Info */}
      <div className="flex items-center gap-2.5">
        {/* Live Token Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-[11px] font-mono text-zinc-400">
          <Droplet className="w-3 h-3 text-zinc-400" />
          <span>brand.DEFAULT:</span>
          <span className="font-semibold font-mono text-zinc-200" style={{ color: customAccentColor }}>
            {customAccentColor}
          </span>
          <input
            type="color"
            value={customAccentColor}
            onChange={(e) => setCustomAccentColor(e.target.value)}
            className="w-4 h-4 rounded cursor-pointer border-0 bg-transparent"
            title="Pick custom primary accent color"
          />
        </div>

        <div className="hidden md:flex items-center gap-1 text-[10px] font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800/80">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>Tailwind Ast Sync Active</span>
        </div>
      </div>
    </div>
  );
};
