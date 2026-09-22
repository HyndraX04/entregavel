import React, { useState } from 'react';
import { X, Check, ShieldCheck, Lock, QrCode, CreditCard, Sparkles, Flame, CheckCircle } from 'lucide-react';
import { Offer } from '../types';

interface CheckoutModalProps {
  offer: Offer | null;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ offer, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit'>('pix');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!offer) return null;

  const handleSimulatePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-xl bg-[#0f0f17] border border-amber-500/30 rounded-3xl shadow-2xl shadow-black overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.08] bg-[#12121c]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-sm font-bold text-white tracking-wide">
              Finalizar Adesão Exclusiva
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">
                Acesso Liberado com Sucesso!
              </h3>
              <p className="text-sm text-gray-300">
                Parabéns! Você adquiriu o <span className="text-amber-400 font-semibold">{offer.title}</span>.
                Os materiais já estão vinculados à sua conta Kaue 4 Gamer.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-gray-300 text-left space-y-1">
              <p>✔ Chave de ativação enviada para o seu e-mail de membro</p>
              <p>✔ Download instantâneo de todos os assets e roteiros</p>
              <p>✔ Acesso vitalício garantido</p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:from-amber-400 transition-all shadow-lg shadow-amber-500/20"
            >
              Concluir e Voltar ao Dashboard
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
            {/* Offer Summary Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 to-[#171724] border border-amber-500/30 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  {offer.isPopular ? <Flame className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                  {offer.badge}
                </span>
                <h4 className="text-base font-bold text-white">{offer.title}</h4>
                <p className="text-xs text-gray-400 line-clamp-1">{offer.description}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-gray-400 line-through block">
                  {offer.originalPrice}
                </span>
                <span className="text-2xl font-black text-white text-gold-gradient">
                  {offer.price}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Forma de Pagamento:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    paymentMethod === 'pix'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-sm'
                      : 'bg-white/[0.03] border-white/[0.08] text-gray-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  <span>PIX Instantâneo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit')}
                  className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    paymentMethod === 'credit'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-sm'
                      : 'bg-white/[0.03] border-white/[0.08] text-gray-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>Cartão de Crédito</span>
                </button>
              </div>
            </div>

            {/* Simulated Payment Form */}
            <form onSubmit={handleSimulatePurchase} className="space-y-4">
              {paymentMethod === 'pix' ? (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center space-y-2">
                  <div className="inline-block p-2 bg-white rounded-xl mx-auto shadow-sm">
                    <QrCode className="w-24 h-24 text-black" />
                  </div>
                  <p className="text-xs text-gray-300 font-medium">
                    Escaneie o QR Code ou clique abaixo para confirmar a simulação
                  </p>
                  <span className="text-[11px] text-emerald-400 block font-semibold">
                    Aprovação em menos de 10 segundos
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Número do Cartão
                    </label>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      defaultValue="•••• •••• •••• 4242"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        Validade
                      </label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        defaultValue="12/28"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        defaultValue="888"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 rounded-xl font-black text-sm bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 text-black shadow-lg shadow-amber-500/25 transition-all"
              >
                Confirmar e Liberar Acesso ({offer.price})
              </button>
            </form>

            {/* Badges footer */}
            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pagamento 100% Criptografado</span>
              </div>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Garantia de 7 Dias</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
