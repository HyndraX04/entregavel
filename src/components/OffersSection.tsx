import React from 'react';
import { Flame, Sparkles, Check, ArrowRight, ShieldCheck, Zap, Lock } from 'lucide-react';
import { Offer } from '../types';

interface OffersSectionProps {
  offers: Offer[];
  onSelectOffer: (offer: Offer) => void;
}

export const OffersSection: React.FC<OffersSectionProps> = ({ offers, onSelectOffer }) => {
  return (
    <section id="ofertas" className="py-16 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-80 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-amber-500/15 border border-amber-500/35 text-amber-300 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Acelere seus resultados</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ofertas exclusivas
          </h2>
          <p className="text-sm sm:text-base text-gray-400">
            Aceleradores práticos para cortar meses de tentativa e erro e colocar seu canal dark no ar com máxima velocidade.
          </p>
        </div>

        {/* Offers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {offers.map((offer) => {
            const isPopular = offer.isPopular;

            return (
              <div
                key={offer.id}
                className={`relative rounded-3xl p-1 transition-all duration-300 flex flex-col ${
                  isPopular
                    ? 'bg-gradient-to-b from-amber-400 via-amber-600/50 to-amber-950/40 shadow-2xl shadow-amber-500/15 hover:shadow-amber-500/25'
                    : 'bg-gradient-to-b from-white/[0.12] via-white/[0.04] to-transparent hover:border-amber-500/30'
                }`}
              >
                <div className="relative rounded-[22px] bg-[#0d0d14] p-7 sm:p-8 flex flex-col justify-between h-full space-y-6">
                  
                  {/* Top Badges & Tagline */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      {isPopular ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-md shadow-amber-500/30">
                          <Flame className="w-3.5 h-3.5 fill-black" />
                          {offer.badge}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/[0.07] border border-white/[0.1] text-amber-300">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          {offer.badge}
                        </span>
                      )}

                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-emerald-400" />
                        Acesso imediato
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-white">
                        {offer.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
                        {offer.description}
                      </p>
                    </div>
                  </div>

                  {/* Pricing Box */}
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-gray-400 line-through mr-2">
                        {offer.originalPrice}
                      </span>
                      <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                        {offer.price}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                      Pagamento único
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2.5 pt-2 border-t border-white/[0.06]">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      O que está incluso:
                    </span>
                    <ul className="space-y-2.5">
                      {offer.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                          <div className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 text-amber-400 stroke-[3]" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action CTA Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => onSelectOffer(offer)}
                      className={`w-full py-4 px-6 rounded-xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] ${
                        isPopular
                          ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50'
                          : 'bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/[0.15] hover:border-amber-400/50'
                      }`}
                    >
                      <span>{offer.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 mt-3">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Garantia incondicional de 7 dias</span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
