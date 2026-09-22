import React, { useState } from 'react';
import { X, Play, Pause, CheckCircle2, Circle, Download, FileText, ChevronRight, ChevronLeft, Volume2, Maximize, RotateCcw } from 'lucide-react';
import { Lesson, Module } from '../types';

interface LessonModalProps {
  lesson: Lesson | null;
  module?: Module;
  isCompleted: boolean;
  onClose: () => void;
  onToggleComplete: (lessonId: string) => void;
  onNextLesson?: () => void;
  onPrevLesson?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  lesson,
  module,
  isCompleted,
  onClose,
  onToggleComplete,
  onNextLesson,
  onPrevLesson,
  hasNext,
  hasPrev,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(35);

  if (!lesson) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#0e0e15] border border-white/[0.12] rounded-3xl shadow-2xl shadow-black flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/[0.08] sticky top-0 bg-[#0e0e15]/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase">
              {module?.badge || 'Módulo'}
            </span>
            <span className="text-xs text-gray-400 font-medium hidden sm:inline">
              {module?.title}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-gray-400 hover:text-white transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Screen Simulation */}
        <div className="relative aspect-video w-full bg-black flex flex-col justify-between overflow-hidden group select-none">
          {/* Background image preview / video art */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop")',
            }}
          />

          {/* Watermark / Academy Tag */}
          <div className="relative z-10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 text-xs text-gray-200">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span>HD 1080p • Kaue 4 Gamer Academy</span>
            </div>
          </div>

          {/* Center Play Button Overlay */}
          <div
            className="relative z-10 flex items-center justify-center cursor-pointer"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-black flex items-center justify-center shadow-xl shadow-amber-500/40 group-hover:scale-105 transition-transform duration-200">
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-black" />
              ) : (
                <Play className="w-8 h-8 fill-black ml-1" />
              )}
            </div>
          </div>

          {/* Bottom Player Controls Bar */}
          <div className="relative z-10 p-3 sm:p-4 bg-gradient-to-t from-black via-black/80 to-transparent space-y-2">
            {/* Progress Bar */}
            <div
              className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer relative overflow-hidden"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickPos = (e.clientX - rect.left) / rect.width;
                setVideoProgress(Math.round(clickPos * 100));
              }}
            >
              <div
                className="h-full bg-amber-400 rounded-full"
                style={{ width: `${videoProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-300">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="hover:text-amber-400 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setVideoProgress(0)}
                  className="hover:text-amber-400 transition-colors"
                  title="Reiniciar vídeo"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[11px] text-gray-400">
                  {Math.floor((videoProgress / 100) * 18)}:20 / {lesson.duration}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 cursor-pointer hover:text-amber-400" />
                <Maximize className="w-4 h-4 cursor-pointer hover:text-amber-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Lesson Details & Actions Body */}
        <div className="p-5 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {lesson.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Duração estimada: <span className="text-amber-300 font-semibold">{lesson.duration}</span>
              </p>
            </div>

            {/* Toggle Complete Button */}
            <button
              onClick={() => onToggleComplete(lesson.id)}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                isCompleted
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-white/[0.06] hover:bg-white/[0.1] text-gray-200 border border-white/[0.1]'
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Aula concluída</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4 text-gray-400" />
                  <span>Marcar como concluída</span>
                </>
              )}
            </button>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">
              Sobre esta aula
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {lesson.description}
            </p>
          </div>

          {/* Summary Key Points */}
          {lesson.summaryPoints && lesson.summaryPoints.length > 0 && (
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Pontos-chave abordados:
              </h4>
              <ul className="space-y-2">
                {lesson.summaryPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Resources & Attachments */}
          {lesson.resources && lesson.resources.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Materiais complementares:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lesson.resources.map((res, i) => (
                  <a
                    key={i}
                    href={res.url}
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Download simulado: ${res.title}`);
                    }}
                    className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-amber-500/30 flex items-center justify-between text-xs text-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span className="font-medium">{res.title}</span>
                    </div>
                    <Download className="w-3.5 h-3.5 text-gray-400" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Next / Previous Lesson Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
            <button
              onClick={onPrevLesson}
              disabled={!hasPrev}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                hasPrev
                  ? 'bg-white/[0.05] hover:bg-white/[0.1] text-gray-200 border-white/[0.1]'
                  : 'opacity-40 cursor-not-allowed text-gray-500 border-transparent'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Aula anterior</span>
            </button>

            <button
              onClick={onNextLesson}
              disabled={!hasNext}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                hasNext
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-400 font-bold'
                  : 'opacity-40 cursor-not-allowed bg-white/[0.05] text-gray-500'
              }`}
            >
              <span>Próxima aula</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
