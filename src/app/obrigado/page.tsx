'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ObrigadoPage() {
  const [copied, setCopied] = useState(false);
  const defaultPassword = process.env.NEXT_PUBLIC_DEFAULT_PASSWORD || 'CANALDARK123';

  const handleCopy = () => {
    navigator.clipboard.writeText(defaultPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-gray-100 font-sans flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-x-hidden selection:bg-amber-500 selection:text-black">
      {/* Luz ambiente sutil no fundo */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/10 blur-[140px] -z-10 rounded-full"></div>

      {/* CARD ÚNICO, CLEAN E ELEGANTE */}
      <div className="w-full max-w-lg rounded-3xl p-1 bg-gradient-to-b from-amber-500/30 via-white/[0.08] to-transparent shadow-2xl shadow-black">
        <div className="rounded-[22px] bg-[#0d0d14] p-6 sm:p-10 space-y-7 border border-white/[0.05] text-center">
          
          {/* Logo Central e Status */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl border border-amber-500/40 bg-amber-500/10 text-amber-400 shadow-md shadow-amber-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-crown">
                <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"></path>
                <path d="M5 21h14"></path>
              </svg>
            </div>

            <div>
              <span className="font-display text-lg font-bold tracking-wider text-white">MÉTODO CANAL DARK</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">Dark Channel Academy</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mt-1">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Compra Aprovada com Sucesso</span>
            </div>
          </div>

          {/* Título Principal */}
          <div className="space-y-2">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Seu acesso foi <span className="bg-gradient-to-r from-yellow-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">liberado</span>!
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
              Sua conta já está pronta. Use os dados abaixo para fazer o login e começar:
            </p>
          </div>

          {/* Caixa de Credenciais (Super Clean) */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#12121c] p-4 sm:p-5 space-y-3.5 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-xs">
              <span className="text-gray-400 font-medium">E-mail:</span>
              <span className="text-white font-semibold">O mesmo usado na compra</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 font-medium">Senha padrão:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-yellow-400 tracking-wider">{defaultPassword}</span>
                <button 
                  onClick={handleCopy}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all active:scale-95 border ${
                    copied 
                      ? 'bg-emerald-500 text-black border-emerald-400' 
                      : 'bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-black border-amber-500/30'
                  }`}
                >
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>
          </div>

          {/* Botão Único de Ação */}
          <div className="space-y-3">
            <Link 
              href="/login" 
              className="w-full py-4 px-6 rounded-xl font-black text-sm sm:text-base bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95"
            >
              <span>ENTRAR NA PLATAFORMA</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </Link>

            <p className="text-[11px] text-gray-400 leading-relaxed">
              Enviamos esses dados para o seu e-mail. Se não achar, veja no <strong>Spam / Promoções</strong>.
            </p>
          </div>

          {/* Suporte */}
          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-center gap-1.5 text-xs text-gray-400">
            <span>Dúvidas com o acesso?</span>
            <a 
              href="https://api.whatsapp.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline font-semibold"
            >
              Falar no WhatsApp
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
