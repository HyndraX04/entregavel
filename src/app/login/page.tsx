'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth, db } from '@/lib/firebaseClient';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const defaultPassword = process.env.NEXT_PUBLIC_DEFAULT_PASSWORD || 'CANALDARK123';

  useEffect(() => {
    const emailParam = searchParams?.get('email');
    if (emailParam) {
      setEmail(emailParam);
      setRegEmail(emailParam);
    }
  }, [searchParams]);

  const handleFillDefault = () => {
    setPassword(defaultPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage({ type: 'error', text: 'Por favor, preencha todos os campos.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      } catch (loginErr: any) {
        if ((loginErr.code === 'auth/user-not-found' || loginErr.code === 'auth/invalid-credential') && password === defaultPassword) {
          userCredential = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            email: email.trim().toLowerCase(),
            name: email.split('@')[0],
            role: 'student',
            status: 'active',
            hasActiveAccess: true,
            tier: 'premium',
            createdAt: serverTimestamp()
          }, { merge: true });
        } else {
          throw loginErr;
        }
      }

      const user = userCredential.user;
      try {
        await setDoc(doc(db, 'users', user.uid), {
          lastLogin: serverTimestamp(),
          hasActiveAccess: true
        }, { merge: true });
      } catch (dbErr) {}

      localStorage.setItem('canaldark_logged_in', 'true');
      localStorage.setItem('canaldark_user_email', user.email || '');
      localStorage.setItem('canaldark_uid', user.uid);

      setMessage({ type: 'success', text: 'Acesso liberado no Firebase! Entrando...' });
      setTimeout(() => {
        router.push('/');
      }, 600);

    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setMessage({ type: 'error', text: `Senha incorreta. A senha padrão inicial é ${defaultPassword}` });
      } else if (err.code === 'auth/user-not-found') {
        setMessage({ type: 'error', text: 'Usuário não encontrado. Crie sua conta na aba acima.' });
      } else {
        setMessage({ type: 'error', text: err.message || 'Erro ao autenticar.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      setMessage({ type: 'error', text: 'Por favor, preencha todos os campos.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, regEmail.trim().toLowerCase(), regPassword);
      const user = userCredential.user;

      await updateProfile(user, { displayName: regName });

      await setDoc(doc(db, 'users', user.uid), {
        name: regName,
        email: regEmail.trim().toLowerCase(),
        role: 'student',
        status: 'active',
        hasActiveAccess: true,
        tier: 'premium',
        createdAt: serverTimestamp()
      }, { merge: true });

      localStorage.setItem('canaldark_logged_in', 'true');
      localStorage.setItem('canaldark_user_email', user.email || '');
      localStorage.setItem('canaldark_user_name', regName);
      localStorage.setItem('canaldark_uid', user.uid);

      setMessage({ type: 'success', text: 'Conta criada com sucesso no Firebase! Acessando...' });
      setTimeout(() => {
        router.push('/');
      }, 600);

    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setMessage({ type: 'error', text: 'Este e-mail já está cadastrado. Alterne para a aba Entrar.' });
      } else if (err.code === 'auth/weak-password') {
        setMessage({ type: 'error', text: 'A senha deve ter pelo menos 6 caracteres.' });
      } else {
        setMessage({ type: 'error', text: err.message || 'Erro ao criar conta no Firebase.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-gray-100 font-sans flex items-center justify-center p-4 sm:p-6 relative overflow-x-hidden selection:bg-amber-500 selection:text-black">
      {/* Luz ambiente sutil no fundo */}
      <div className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 blur-[150px] -z-10 rounded-full"></div>

      {/* CARD ÚNICO */}
      <div className="w-full max-w-md my-auto">
        <div className="rounded-3xl p-1 bg-gradient-to-b from-amber-500/35 via-white/[0.08] to-transparent shadow-2xl shadow-black">
          <div className="rounded-[22px] bg-[#0d0d14] p-6 sm:p-8 space-y-6 border border-white/[0.05]">
            
            {/* Logo Central */}
            <div className="flex flex-col items-center text-center gap-2.5">
              <div className="flex size-14 items-center justify-center rounded-2xl border border-amber-500/40 bg-gradient-to-b from-amber-500/20 to-amber-500/5 text-amber-400 shadow-lg shadow-amber-500/15">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-crown">
                  <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"></path>
                  <path d="M5 21h14"></path>
                </svg>
              </div>

              <div>
                <span className="font-display text-lg sm:text-xl font-bold tracking-wider text-white">MÉTODO CANAL DARK</span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400/80">Dark Channel Academy</span>
              </div>

              {/* Tabs */}
              <div className="flex items-center p-1 rounded-xl bg-[#12121c] border border-white/[0.08] w-full mt-2">
                <button 
                  type="button" 
                  onClick={() => { setTab('login'); setMessage(null); }}
                  className={`w-1/2 py-2 rounded-lg text-xs font-bold transition-all ${
                    tab === 'login'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Já sou Aluno (Entrar)
                </button>
                <button 
                  type="button" 
                  onClick={() => { setTab('register'); setMessage(null); }}
                  className={`w-1/2 py-2 rounded-lg text-xs font-bold transition-all ${
                    tab === 'register'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Criar Conta
                </button>
              </div>
            </div>

            {/* Form Login */}
            {tab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-300">
                    Seu E-mail de Compra
                  </label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="seu@email.com" 
                    className="w-full px-4 py-3 bg-[#12121c] border border-white/[0.08] focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/70 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-gray-300">
                      Sua Senha
                    </label>
                    <button 
                      type="button" 
                      onClick={handleFillDefault}
                      className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                    >
                      Usar senha padrão
                    </button>
                  </div>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Digite sua senha" 
                      className="w-full pl-4 pr-10 py-3 bg-[#12121c] border border-white/[0.08] focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/70 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </div>
                </div>

                {message && (
                  <div className={`text-xs py-2.5 px-3.5 rounded-xl font-medium text-center ${
                    message.type === 'success' ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' : 'bg-red-500/15 border border-red-500/30 text-red-300'
                  }`}>
                    {message.text}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-xl font-black text-sm bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 text-black shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-80"
                >
                  <span>{loading ? 'Autenticando no Firebase...' : 'ENTRAR NA PLATAFORMA'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-300">
                    Seu Nome Completo
                  </label>
                  <input 
                    type="text" 
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    placeholder="Ex: João Silva" 
                    className="w-full px-4 py-3 bg-[#12121c] border border-white/[0.08] focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/70 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-300">
                    Seu E-mail
                  </label>
                  <input 
                    type="email" 
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    placeholder="seu@email.com" 
                    className="w-full px-4 py-3 bg-[#12121c] border border-white/[0.08] focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/70 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-300">
                    Crie sua Senha (mínimo 6 dígitos)
                  </label>
                  <input 
                    type="password" 
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Crie uma senha segura" 
                    className="w-full px-4 py-3 bg-[#12121c] border border-white/[0.08] focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/70 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all"
                  />
                </div>

                {message && (
                  <div className={`text-xs py-2.5 px-3.5 rounded-xl font-medium text-center ${
                    message.type === 'success' ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' : 'bg-red-500/15 border border-red-500/30 text-red-300'
                  }`}>
                    {message.text}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-xl font-black text-sm bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 text-black shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-80"
                >
                  <span>{loading ? 'Criando conta no Firebase...' : 'CRIAR MINHA CONTA'}</span>
                </button>
              </form>
            )}

            {/* Dica da Senha Padrão */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3.5 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-gray-400 block text-[11px]">Comprou na PerfectPay? Senha padrão:</span>
                <span className="font-mono font-bold text-yellow-400 tracking-wider">CANALDARK123</span>
              </div>
              <button 
                type="button" 
                onClick={handleFillDefault}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black font-bold text-[11px] transition-colors border border-amber-500/30"
              >
                Preencher
              </button>
            </div>

            {/* Suporte */}
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-center gap-1.5 text-xs text-gray-400">
              <span>Dúvidas com o login?</span>
              <a 
                href="https://api.whatsapp.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline font-semibold"
              >
                Suporte no WhatsApp
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
