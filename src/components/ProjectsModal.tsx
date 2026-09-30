import React from 'react';
import type { ProjectSummary } from '../types';
import { 
  Folder, 
  Clock, 
  Trash2, 
  X, 
  Plus, 
  ArrowRight,
  Layers
} from 'lucide-react';

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProjectId: string;
  savedProjects: ProjectSummary[];
  onLoadProject: (id: string) => void;
  onCreateNewProject: () => void;
  onDeleteProject: (id: string) => void;
}

export const ProjectsModal: React.FC<ProjectsModalProps> = ({
  isOpen,
  onClose,
  currentProjectId,
  savedProjects,
  onLoadProject,
  onCreateNewProject,
  onDeleteProject,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">My Carousel Projects</h2>
              <p className="text-xs text-slate-400">
                Switch between decks or start a fresh viral carousel draft.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CREATE NEW DECK ACTION */}
        <button
          onClick={() => {
            onCreateNewProject();
            onClose();
          }}
          className="w-full p-4 rounded-2xl border-2 border-dashed border-indigo-500/40 hover:border-indigo-500 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Carousel Deck</span>
        </button>

        {/* SAVED PROJECT LIST */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
            Saved Drafts ({savedProjects.length})
          </div>

          {savedProjects.map(proj => {
            const isCurrent = proj.id === currentProjectId;
            const updatedDate = new Date(proj.updatedAt || Date.now()).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={proj.id}
                onClick={() => {
                  if (!isCurrent) onLoadProject(proj.id);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-indigo-600/15 border-indigo-500 shadow-md ring-1 ring-indigo-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate max-w-xs sm:max-w-sm">
                        {proj.title || 'Untitled Carousel'}
                      </span>
                      {isCurrent && (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-0.5">
                      <span>{proj.slideCount} slides</span>
                      <span>•</span>
                      <span>{proj.aspectRatio}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {updatedDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {savedProjects.length > 1 && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onDeleteProject(proj.id);
                      }}
                      title="Delete Project"
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <div className="p-1.5 text-slate-500 hover:text-indigo-400">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
