import React, { useState } from 'react';
import { BookOpen, CheckCircle, ChevronDown, ChevronUp, Play, Clock, Sparkles, Compass, TrendingUp, PenTool, Zap, Check } from 'lucide-react';
import { Module, Lesson } from '../types';

interface ModulesSectionProps {
  modules: Module[];
  completedLessonIds: string[];
  onOpenLesson: (lesson: Lesson) => void;
  onToggleLessonComplete: (lessonId: string) => void;
}

export const ModulesSection: React.FC<ModulesSectionProps> = ({
  modules,
  completedLessonIds,
  onOpenLesson,
  onToggleLessonComplete,
}) => {
  // By default, open the first module
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'modulo-1': true,
  });

  const toggleExpand = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const getModuleIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="w-5 h-5 text-amber-400" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-amber-400" />;
      case 'PenTool':
        return <PenTool className="w-5 h-5 text-amber-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-400" />;
      default:
        return <BookOpen className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <section id="modulos" className="py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trilha Completa</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Seus módulos
            </h2>
            <p className="text-sm text-gray-400 max-w-xl">
              Domine cada etapa para planejar, produzir, publicar e escalar canais dark de alta monetização.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
            <span className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
              4 Módulos
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
              13 Aulas práticas
            </span>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 gap-6">
          {modules.map((module) => {
            const isExpanded = !!expandedModules[module.id];
            const moduleCompletedCount = module.lessons.filter((l) =>
              completedLessonIds.includes(l.id)
            ).length;
            const moduleProgress = Math.round(
              (moduleCompletedCount / (module.lessons.length || 1)) * 100
            );
            const isAllCompleted = moduleCompletedCount === module.lessons.length;

            return (
              <div
                key={module.id}
                className={`rounded-2xl transition-all duration-300 border ${
                  isExpanded
                    ? 'bg-[#101017] border-amber-500/30 shadow-xl shadow-black/50'
                    : 'bg-[#0e0e14]/80 hover:bg-[#12121b] border-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                {/* Module Header Row */}
                <div
                  onClick={() => toggleExpand(module.id)}
                  className="p-5 sm:p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    {/* Module Number Badge */}
                    <div className="relative shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/30">
                      {getModuleIcon(module.iconName)}
                      <span className="absolute -bottom-1 -right-1 text-[10px] font-black bg-amber-500 text-black px-1 rounded">
                        0{module.number}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                          {module.title}
                        </h3>
                        {isAllCompleted && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <Check className="w-3 h-3" />
                            Concluído
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                        {module.description}
                      </p>
                    </div>
                  </div>

                  {/* Right Side Info & Expand Arrow */}
                  <div className="flex items-center justify-between md:justify-end gap-5 pt-2 md:pt-0 border-t md:border-t-0 border-white/[0.06]">
                    <div className="flex flex-col md:items-end text-xs text-gray-400">
                      <span className="font-semibold text-gray-300">
                        {moduleCompletedCount}/{module.lessons.length} aulas ({moduleProgress}%)
                      </span>
                      <div className="w-24 sm:w-28 h-1.5 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-300"
                          style={{ width: `${moduleProgress}%` }}
                        />
                      </div>
                    </div>

                    <button
                      className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 transition-colors border border-white/[0.06]"
                      aria-label="Expandir módulo"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-amber-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Lessons Expandable List */}
                {isExpanded && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2 border-t border-white/[0.06]">
                    <div className="space-y-2.5">
                      {module.lessons.map((lesson, idx) => {
                        const isDone = completedLessonIds.includes(lesson.id);

                        return (
                          <div
                            key={lesson.id}
                            className={`p-3 sm:p-4 rounded-xl transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                              isDone
                                ? 'bg-emerald-950/15 border border-emerald-500/20'
                                : 'bg-[#151520]/80 hover:bg-[#1a1a28] border border-white/[0.04] hover:border-white/[0.08]'
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              {/* Complete Toggle Checkbox */}
                              <button
                                onClick={() => onToggleLessonComplete(lesson.id)}
                                title={isDone ? 'Marcar como não concluída' : 'Marcar como concluída'}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                  isDone
                                    ? 'bg-emerald-500 text-black shadow-sm'
                                    : 'bg-white/[0.05] border border-white/[0.1] text-transparent hover:text-gray-400'
                                }`}
                              >
                                <Check className={`w-4 h-4 ${isDone ? 'stroke-[3]' : ''}`} />
                              </button>

                              {/* Lesson Number & Title */}
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-mono text-gray-400">
                                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}.
                                  </span>
                                  <h4
                                    onClick={() => onOpenLesson(lesson)}
                                    className={`text-sm font-semibold cursor-pointer transition-colors ${
                                      isDone
                                        ? 'text-gray-300 line-through decoration-emerald-500/50'
                                        : 'text-white hover:text-amber-300'
                                    }`}
                                  >
                                    {lesson.title}
                                  </h4>
                                </div>
                                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {lesson.duration}
                                  </span>
                                  <span>•</span>
                                  <span>Aula em vídeo HD</span>
                                </div>
                              </div>
                            </div>

                            {/* Watch Action Button */}
                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              <button
                                onClick={() => onOpenLesson(lesson)}
                                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.06] hover:bg-amber-500 hover:text-black text-gray-200 transition-all duration-200 flex items-center gap-1.5 border border-white/[0.08] hover:border-amber-400"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Assistir</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
