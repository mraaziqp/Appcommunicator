import React from 'react';
import { 
  Search, Video, Table, Lock, LayoutGrid, Terminal, 
  ChevronRight, ChevronLeft, Sparkles, Filter, Database,
  CheckCircle2, Box, Layers, Radio, FolderGit2, Plus
} from 'lucide-react';
import { useRegistry } from '../context/RegistryContext';
import { ComponentCategory } from '../types';

const CATEGORIES: { label: string; value: string; count?: number }[] = [
  { label: 'All', value: 'All' },
  { label: 'Media & AI UI', value: 'Media & AI UI' },
  { label: 'Data Display', value: 'Data Display' },
  { label: 'Auth & Security', value: 'Auth & Security' },
  { label: 'Layout & Bento', value: 'Layout & Bento' },
];

const getCategoryIcon = (category: ComponentCategory) => {
  switch (category) {
    case 'Media & AI UI':
      return <Video className="w-3.5 h-3.5 text-cyan-400" />;
    case 'Data Display':
      return <Table className="w-3.5 h-3.5 text-emerald-400" />;
    case 'Auth & Security':
      return <Lock className="w-3.5 h-3.5 text-purple-400" />;
    case 'Layout & Bento':
      return <LayoutGrid className="w-3.5 h-3.5 text-amber-400" />;
    default:
      return <Box className="w-3.5 h-3.5 text-zinc-400" />;
  }
};

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  onToggleCollapse, 
  isMobileOpen = false,
  onCloseMobile 
}) => {
  const { 
    components, 
    activeComponent, 
    setActiveComponentId, 
    selectedCategory, 
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    secondBrain,
    setIsIngestionModalOpen
  } = useRegistry();

  const filtered = components.filter((comp) => {
    const matchesCat = selectedCategory === 'All' || comp.metadata.category === selectedCategory;
    const matchesSearch = 
      comp.metadata.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.metadata.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.metadata.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleSelectComponent = (id: string) => {
    setActiveComponentId(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
        />
      )}

      <aside 
        className={`border-r border-zinc-800/80 bg-zinc-950/95 flex flex-col justify-between transition-all duration-200 select-none transform-gpu ${
          /* Desktop behavior */
          'hidden md:flex'
        } ${
          isCollapsed ? 'md:w-16' : 'md:w-72'
        } ${
          /* Mobile Drawer behavior */
          isMobileOpen 
            ? '!flex fixed inset-y-0 left-0 z-50 w-[85vw] max-w-xs shadow-2xl h-dvh' 
            : ''
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Mobile Header when open in Drawer Mode */}
          {isMobileOpen && (
            <div className="md:hidden p-3 border-b border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-zinc-100 uppercase">Components Catalog</span>
              </div>
              {onCloseMobile && (
                <button
                  onClick={onCloseMobile}
                  className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                >
                  <span className="text-xs font-mono">✕</span>
                </button>
              )}
            </div>
          )}
        {/* Search Bar */}
        <div className="p-3 border-b border-zinc-800/60">
          {!isCollapsed ? (
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search components..."
                className="w-full bg-zinc-900/90 border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-500 hover:text-zinc-300"
                >
                  ✕
                </button>
              )}
            </div>
          ) : (
            <button 
              onClick={onToggleCollapse} 
              className="w-full flex justify-center p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-zinc-200"
              title="Expand Sidebar"
            >
              <Search className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories Bar (when expanded) */}
        {!isCollapsed && (
          <div className="px-3 py-2 border-b border-zinc-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition ${
                  selectedCategory === cat.value
                    ? 'bg-zinc-800 text-cyan-300 border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Ingest from Repo Action Bar */}
        <div className="p-2 border-b border-zinc-800/60 bg-zinc-900/30">
          {!isCollapsed ? (
            <button
              onClick={() => setIsIngestionModalOpen(true)}
              className="w-full py-1.5 px-3 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 text-xs font-mono font-semibold flex items-center justify-between transition cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.1)]"
            >
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ingest from Repo</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-900 text-cyan-200 border border-cyan-700/50">
                + AST
              </span>
            </button>
          ) : (
            <button
              onClick={() => setIsIngestionModalOpen(true)}
              className="w-full flex justify-center p-2 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 transition cursor-pointer"
              title="Ingest from Repo (AST Parser)"
            >
              <FolderGit2 className="w-4 h-4 text-cyan-400" />
            </button>
          )}
        </div>

        {/* Component Items List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {!isCollapsed && (
            <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500 flex justify-between items-center">
              <span>Extracted Modules ({filtered.length})</span>
              <span className="text-[9px] text-zinc-600">v2.4 Core</span>
            </div>
          )}

          {filtered.map((comp) => {
            const isActive = comp.metadata.id === activeComponent.metadata.id;
            return (
              <button
                key={comp.metadata.id}
                onClick={() => handleSelectComponent(comp.metadata.id)}
                className={`w-full text-left rounded-xl transition-all duration-150 border group cursor-pointer ${
                  isActive
                    ? 'bg-zinc-900/90 border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.12)] ring-1 ring-cyan-500/20'
                    : 'bg-zinc-900/40 hover:bg-zinc-900/70 border-zinc-800/60 hover:border-zinc-700/80 backdrop-blur-sm'
                } ${isCollapsed ? 'p-2.5 flex justify-center' : 'p-3'}`}
                title={comp.metadata.name}
              >
                {isCollapsed ? (
                  <div className="relative">
                    {getCategoryIcon(comp.metadata.category)}
                    {isActive && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(comp.metadata.category)}
                        <span className={`font-semibold text-xs tracking-tight ${
                          isActive ? 'text-cyan-300' : 'text-zinc-200 group-hover:text-white'
                        }`}>
                          {comp.metadata.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-semibold tracking-wider text-zinc-400 uppercase bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800/90 shrink-0">
                        v{comp.metadata.version}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-400/90 line-clamp-2 mt-1.5 leading-relaxed font-sans">
                      {comp.metadata.description}
                    </p>

                    <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                      <span className="text-[9px] font-mono font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/50 text-emerald-400">
                        {comp.metadata.status}
                      </span>
                      {comp.metadata.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[9px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded bg-zinc-900/90 text-zinc-400 border border-zinc-800/80">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer / Toggle & Status */}
        <div className="p-3 border-t border-zinc-800/60 bg-zinc-950/90 flex items-center justify-between">
          {!isCollapsed ? (
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-[10px] font-mono text-zinc-400">
                <div>Neon DB / Drizzle</div>
                <div className="text-zinc-600">Synced to Brain Hub</div>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center text-zinc-500">
              <Database className="w-4 h-4 text-cyan-400" />
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </aside>
    </>
  );
};
