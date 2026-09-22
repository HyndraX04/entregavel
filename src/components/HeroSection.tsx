import React from 'react';
import { Play, Sparkles, CheckCircle2, Clock, ArrowRight, Award, Flame } from 'lucide-react';
import { Lesson } from '../types';

interface HeroSectionProps {
  lastLesson: Lesson;
  onOpenLesson: (lesson: Lesson) => void;
  completedLessonsCount: number;
  totalLessonsCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lastLesson,
  onOpenLesson,
  completedLessonsCount,
  totalLessonsCount,
}) => {
  const progressPercent = Math.round((completedLessonsCount / (totalLessonsCount || 1)) * 100);

  return (
    <section id="inicio" className="relative pt-6 pb-12 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/10 via-amber-600/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Motivational Alert Banner */}
        <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#161622] to-amber-950/30 border border-amber-500/25 p-4 sm:p-5 shadow-lg shadow-black/40">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
              <p className="text-sm sm:text-base font-medium text-amber-200/90">
                Continue avançando. <span className="text-white font-semibold">Sua consistência constrói o resultado.</span>
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-amber-400 font-semibold bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
              <Clock className="w-3.5 h-3.5" />
              <span>Acesso 100% vitalício</span>
            </div>
          </div>
        </div>

        {/* Hero Grid: Main Headline + Resume Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Headlines & Course Progress */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Sua jornada continua</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              Transforme conhecimento <br className="hidden sm:inline" />
              em <span className="text-gold-gradient">liberdade</span>.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed">
              Volte ao ponto em que parou e dê o próximo passo na construção do seu canal dark.
            </p>

            {/* Progress Bar & Stats */}
            <div className="p-5 rounded-2xl bg-[#12121a]/80 border border-white/[0.08] backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-gray-200 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  Progresso geral da formação
                </span>
                <span className="text-amber-400 font-bold">{progressPercent}% Concluído</span>
              </div>

              {/* Progress Track */}
              <div className="w-full h-3 bg-[#1d1d29] rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500 shadow-glow-subtle"
                  style={{ width: `${Math.max(progressPercent, 6)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                <span>{completedLessonsCount} de {totalLessonsCount} aulas finalizadas</span>
                <span>4 módulos completos</span>
              </div>
            </div>

          </div>

          {/* Right Column: "Última aula" Resume Card */}
          <div className="lg:col-span-5">
            <div className="relative group rounded-3xl p-1 bg-gradient-to-b from-amber-500/30 via-white/[0.08] to-transparent shadow-2xl shadow-black/80">
              <div className="rounded-[22px] bg-[#0f0f16] p-6 space-y-6 border border-white/[0.05]">
                
                {/* Header Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                      Última aula
                    </span>
                    <span className="text-xs text-gray-400 font-medium">Trilha principal</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{lastLesson.duration}</span>
                  </div>
                </div>

                {/* Lesson Thumbnail & Video Trigger */}
                <div
                  onClick={() => onOpenLesson(lastLesson)}
                  className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/[0.1] cursor-pointer group/thumb shadow-inner"
                >
                  {/* Backdrop artwork & dark gradient */}
                  <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop")'
                  }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  {/* Play Button Center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black shadow-lg shadow-amber-500/40 group-hover/thumb:scale-110 group-hover/thumb:shadow-amber-500/70 transition-all duration-300">
                      <Play className="w-6 h-6 fill-black ml-0.5" />
                    </div>
                  </div>

                  {/* Bottom info on thumbnail */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-gray-200">
                    <span className="bg-black/70 backdrop-blur-md px-2 py-0.5 rounded font-medium border border-white/10">
                      Módulo 1 • Aula 1
                    </span>
                    <span className="bg-amber-500/90 text-black px-2 py-0.5 rounded font-bold">
                      Retomar
                    </span>
                  </div>
                </div>

                {/* Lesson Info */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                    {lastLesson.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {lastLesson.description}
                  </p>
                </div>

                {/* Resume Button */}
                <button
                  onClick={() => onOpenLesson(lastLesson)}
                  className="w-full py-3.5 px-5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-400 hover:to-yellow-400 text-black shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>Continuar assistindo</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
