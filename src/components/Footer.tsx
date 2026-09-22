import React from 'react';
import { Crown, Shield, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.06] bg-[#07070a] py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 via-amber-500 to-amber-700 p-0.5 shadow-md shadow-amber-500/20">
              <div className="w-full h-full bg-[#0d0d12] rounded-[10px] flex items-center justify-center">
                <Crown className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="font-extrabold text-sm text-white tracking-wider">
                MÉTODO CANAL DARK
              </div>
              <div className="text-[11px] text-amber-400/90 font-medium tracking-widest uppercase">
                Dark Channel Academy
              </div>
            </div>
          </div>

          {/* Slogan */}
          <p className="text-xs text-gray-400 text-center md:text-left max-w-md">
            Treinamento premium para criar, monetizar e escalar canais dark. Plataforma de alta performance para membros.
          </p>

          {/* Copyright & Disclaimer */}
          <div className="text-xs text-gray-500 flex flex-col sm:flex-row items-center gap-4">
            <span>© {new Date().getFullYear()} Método Canal Dark. Todos os direitos reservados.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
