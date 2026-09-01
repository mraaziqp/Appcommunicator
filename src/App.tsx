import React, { useState, useRef, useEffect } from 'react';
import { RegistryProvider, useRegistry } from './context/RegistryContext';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { LiveSandbox } from './components/LiveSandbox';
import { CodeInspector } from './components/CodeInspector';
import { SecondBrainModal } from './components/SecondBrainModal';
import { JarvisEcosystemHub } from './components/JarvisEcosystemHub';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { ActionQueueDrawer } from './components/ActionQueueDrawer';
import { CliExportModal } from './components/CliExportModal';
import { RepoIngestionModal } from './components/RepoIngestionModal';
import { SystemGatewayModal } from './components/SystemGatewayModal';
import { Play, Code2, Columns } from 'lucide-react';

function DashboardLayout() {
  const { 
    splitRatio, 
    setSplitRatio, 
    isDraggingSplit, 
    setIsDraggingSplit,
    copiedNotice 
  } = useRegistry();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isBrainModalOpen, setIsBrainModalOpen] = useState(false);
  const [mobileViewMode, setMobileViewMode] = useState<'sandbox' | 'code' | 'split'>('split');
  const splitContainerRef = useRef<HTMLDivElement>(null);

  // Mouse and Touch move handler for resizing split panes
  useEffect(() => {
    const handleMove = (clientX: number) => {
      if (!isDraggingSplit || !splitContainerRef.current) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      const newRatio = ((clientX - rect.left) / rect.width) * 100;
      if (newRatio >= 20 && newRatio <= 80) {
        setSplitRatio(newRatio);
        localStorage.setItem('sb_split_ratio', newRatio.toString());
      }
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    };

    const handleEnd = () => {
      if (isDraggingSplit) {
        setIsDraggingSplit(false);
      }
    };

    if (isDraggingSplit) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
      window.addEventListener('touchcancel', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };
  }, [isDraggingSplit, setSplitRatio, setIsDraggingSplit]);

  return (
    <div className="flex flex-col h-dvh w-screen max-w-full bg-zinc-950 text-zinc-100 font-sans overflow-hidden select-none transform-gpu">
      {/* Top Navigation Bar */}
      <TopBar 
        onOpenBrainModal={() => setIsBrainModalOpen(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Main Workspace: Sidebar + Split-Pane */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Responsive Navigation Sidebar (Desktop inline + Mobile off-canvas drawer) */}
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Resizable Split-Pane (Live Sandbox & Code Inspector) */}
        <div 
          ref={splitContainerRef} 
          className="flex-1 flex flex-col md:flex-row overflow-hidden relative bg-zinc-950"
        >
          {/* Left Pane: Live Sandbox & Terminal */}
          <div 
            style={{ 
              width: undefined,
            }}
            className={`flex flex-col overflow-hidden relative transition-all duration-150 ${
              mobileViewMode === 'code' ? 'hidden md:flex' : 'flex'
            } ${
              mobileViewMode === 'sandbox' 
                ? 'h-full md:h-full' 
                : 'h-1/2 md:h-full'
            }`}
            {...(typeof window !== 'undefined' && window.innerWidth >= 768 ? { style: { width: `${splitRatio}%` } } : {})}
          >
            <div className="hidden md:block w-full h-full" style={{ width: '100%' }}>
              <LiveSandbox />
            </div>
            <div className="block md:hidden w-full h-full">
              <LiveSandbox />
            </div>
          </div>

          {/* Draggable Divider Handle (Desktop & Mobile Touch Target) */}
          <div
            onMouseDown={() => setIsDraggingSplit(true)}
            onTouchStart={() => setIsDraggingSplit(true)}
            className={`hidden md:flex w-2 hover:w-2 -mx-1 z-30 cursor-col-resize items-center justify-center bg-transparent hover:bg-cyan-500/20 active:bg-cyan-500/30 transition group select-none touch-none relative after:content-[''] after:absolute after:inset-y-0 after:-left-3 after:-right-3 after:z-30`}
            title="Drag to resize Sandbox and Code Inspector"
          >
            <div className="h-12 w-1 rounded-full bg-zinc-800 group-hover:bg-cyan-400 group-active:bg-cyan-400 transition" />
          </div>

          {/* Right Pane: Monaco Code Inspector */}
          <div 
            style={{ 
              width: undefined,
            }}
            className={`flex flex-col overflow-hidden relative transition-all duration-150 ${
              mobileViewMode === 'sandbox' ? 'hidden md:flex' : 'flex'
            } ${
              mobileViewMode === 'code' 
                ? 'h-full md:h-full' 
                : 'h-1/2 md:h-full'
            }`}
            {...(typeof window !== 'undefined' && window.innerWidth >= 768 ? { style: { width: `${100 - splitRatio}%` } } : {})}
          >
            <div className="hidden md:block w-full h-full" style={{ width: '100%' }}>
              <CodeInspector />
            </div>
            <div className="block md:hidden w-full h-full">
              <CodeInspector />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Split / Sandbox / Code Ergonomic Toolbar Switcher */}
      <div className="flex md:hidden h-11 border-t border-zinc-800/90 bg-zinc-950/95 backdrop-blur-lg px-4 items-center justify-between z-20 text-xs font-mono">
        <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Mobile View</span>
        </div>

        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
          <button
            onClick={() => setMobileViewMode('sandbox')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md transition min-h-[36px] ${
              mobileViewMode === 'sandbox'
                ? 'bg-zinc-800 text-cyan-300 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Sandbox</span>
          </button>
          <button
            onClick={() => setMobileViewMode('split')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md transition min-h-[36px] ${
              mobileViewMode === 'split'
                ? 'bg-zinc-800 text-cyan-300 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split</span>
          </button>
          <button
            onClick={() => setMobileViewMode('code')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md transition min-h-[36px] ${
              mobileViewMode === 'code'
                ? 'bg-zinc-800 text-cyan-300 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code</span>
          </button>
        </div>
      </div>

      {/* Second Brain Orchestration Bridge Modal */}
      <SecondBrainModal
        isOpen={isBrainModalOpen}
        onClose={() => setIsBrainModalOpen(false)}
      />

      {/* Phase 2: Jarvis Ecosystem Ingestion & Decision Hub */}
      <JarvisEcosystemHub />

      {/* Phase 3: Global Command Palette & Semantic Memory Modal (Cmd + K) */}
      <CommandPaletteModal />

      {/* Phase 3: Autonomous Action Engine Queue Drawer */}
      <ActionQueueDrawer />

      {/* Phase 3: CLI Distribution Protocol Modal */}
      <CliExportModal />

      {/* Phase 5: Reverse AST Repo Ingestion Modal */}
      <RepoIngestionModal />

      {/* Phase 5: Production Deployment & API Gateway Modal */}
      <SystemGatewayModal />

      {/* Floating Copied Toast Notice */}
      {copiedNotice && (
        <div className="fixed bottom-14 md:bottom-6 right-4 md:right-6 z-50 px-4 py-2.5 rounded-xl bg-cyan-500 text-zinc-950 font-semibold text-xs shadow-2xl shadow-cyan-500/40 animate-in fade-in slide-in-from-bottom-3 duration-200 transform-gpu">
          {copiedNotice}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <RegistryProvider>
      <DashboardLayout />
    </RegistryProvider>
  );
}

