import React, { useState, useEffect } from 'react';
import { Sparkles, Crown, Menu, X, Shield, Compass, BookOpen, Flame } from 'lucide-react';
import { userProfile } from '../data/courseData';

interface NavbarProps {
  completedCount: number;
  totalLessons: number;
}

export const Navbar: React.FC<NavbarProps> = ({ completedCount, totalLessons }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Simple active link detection
      const sections = ['inicio', 'modulos', 'ofertas'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const progressPercent = Math.round((completedCount / (totalLessons || 1)) * 100);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0a0a0e]/90 backdrop-blur-md border-b border-white/[0.08] shadow-lg shadow-black/50'
          : 'bg-[#08080b]/70 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Academy Branding */}
          <div className="flex items-center gap-4">
            <a href="#inicio" className="flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-400 via-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all duration-300">
                <div className="w-full h-full bg-[#0d0d12] rounded-[10px] flex items-center justify-center">
                  <Crown className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold tracking-wider text-base sm:text-lg text-white group-hover:text-amber-300 transition-colors">
                    MÉTODO CANAL DARK
                  </span>
                </div>
                <span className="text-[11px] font-medium tracking-widest uppercase text-amber-400/90 flex items-center gap-1">
                  Dark Channel Academy
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#13131b]/80 border border-white/[0.06] p-1.5 rounded-full backdrop-blur-md">
            <a
              href="#inicio"
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeSection === 'inicio'
                  ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Visão geral
            </a>
            <a
              href="#modulos"
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeSection === 'modulos'
                  ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Meus módulos
            </a>
            <a
              href="#ofertas"
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                activeSection === 'ofertas'
                  ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Ofertas exclusivas
            </a>
          </nav>

          {/* User Status / Premium Badge */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="relative">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center font-bold text-xs text-black shadow-sm">
                  K
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#0d0d12]"></span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-gray-200">Olá, membro</span>
                <span className="text-[10px] text-gray-400">{progressPercent}% concluído</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-amber-500/15 border border-amber-500/35 text-amber-300 text-xs font-semibold shadow-glow-subtle">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Acesso premium</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Premium</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/[0.05] text-gray-300 hover:text-white border border-white/[0.1] focus:outline-none"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c0c12]/95 border-b border-white/[0.08] px-4 pt-3 pb-6 space-y-3 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center font-bold text-xs text-black">
                K
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-white">Olá, membro</div>
                <div className="text-xs text-amber-400 font-semibold">{userProfile.tier}</div>
              </div>
            </div>
            <span className="text-xs text-gray-400">{progressPercent}% do curso</span>
          </div>

          <div className="space-y-1">
            <a
              href="#inicio"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-200 hover:bg-white/[0.06] hover:text-amber-300"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              Visão geral
            </a>
            <a
              href="#modulos"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-200 hover:bg-white/[0.06] hover:text-amber-300"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              Meus módulos
            </a>
            <a
              href="#ofertas"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-200 hover:bg-white/[0.06] hover:text-amber-300"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              Ofertas exclusivas
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
