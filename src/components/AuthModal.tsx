import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { User, Lock, Mail, Phone, X, Eye, EyeOff, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthOpen, setIsAuthOpen, loginUser, registerUser, showToast } = useApp();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register fields
  const [isPro, setIsPro] = useState(false);
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [companyName, setCompanyName] = useState('');

  // UI status
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isAuthOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsAuthOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthOpen, setIsAuthOpen]);

  // Reset errors when switching tabs
  useEffect(() => {
    setErrorMsg(null);
  }, [tab]);

  if (!isAuthOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = loginUser(loginEmail, loginPassword);
      setIsLoading(false);
      if (!res.success) {
        setErrorMsg(res.error || 'Identifiants incorrects.');
      } else {
        setLoginEmail('');
        setLoginPassword('');
      }
    }, 300);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (registerPassword.length < 6) {
      setErrorMsg('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = registerUser({
        fullName: isPro && companyName.trim() ? `${registerName.trim()} (${companyName.trim()})` : registerName.trim(),
        email: registerEmail,
        phone: registerPhone,
        password: registerPassword,
        isPro,
        companyName: isPro ? companyName.trim() : undefined,
      });

      setIsLoading(false);

      if (!res.success) {
        setErrorMsg(res.error || 'Erreur lors de la création du compte.');
      } else {
        setRegisterName('');
        setRegisterEmail('');
        setRegisterPhone('');
        setRegisterPassword('');
        setCompanyName('');
      }
    }, 300);
  };

  const handleForgotPassword = () => {
    if (!loginEmail.trim()) {
      showToast('Veuillez renseigner votre adresse e-mail pour réinitialiser votre mot de passe.');
      return;
    }
    showToast(`Un lien de réinitialisation a été envoyé à ${loginEmail.trim()}.`);
  };

  return (
    <div
      onClick={() => setIsAuthOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto cursor-pointer"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-neutral-200/90 rounded-2xl max-w-md w-full p-6 sm:p-8 text-neutral-900 shadow-2xl relative my-auto cursor-default transition-all"
      >
        <button
          onClick={() => setIsAuthOpen(false)}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-800 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-[11px] font-mono-hooden text-neutral-800 mb-2 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
            <span>ESPACE CLIENT SÉCURISÉ</span>
          </div>
          <h3 className="text-2xl font-bold font-serif-hooden text-neutral-900">
            Maison Hooden
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Gérez vos commandes de bois, suivez vos livraisons et téléchargez vos factures.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-neutral-200 mb-5">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 pb-3 text-xs font-semibold tracking-wide uppercase transition-colors cursor-pointer border-b-2 ${
              tab === 'login'
                ? 'border-amber-800 text-amber-900 font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Connexion
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 pb-3 text-xs font-semibold tracking-wide uppercase transition-colors cursor-pointer border-b-2 ${
              tab === 'register'
                ? 'border-amber-800 text-amber-900 font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Créer un compte
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab 1: Login */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1">
                Adresse e-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="votre.email@exemple.fr"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-amber-800 focus:bg-white transition-all font-sans"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-neutral-700">
                  Mot de passe
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[11px] text-amber-800 hover:underline cursor-pointer"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-amber-800 focus:bg-white transition-all font-mono-hooden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  aria-label="Afficher ou masquer le mot de passe"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-neutral-300 text-amber-800 focus:ring-amber-800"
              />
              <label htmlFor="rememberMe" className="text-xs text-neutral-600 cursor-pointer select-none">
                Mémoriser mes identifiants
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>

            <div className="pt-3 text-center text-xs text-neutral-500">
              Pas encore de compte client ?{' '}
              <button
                type="button"
                onClick={() => setTab('register')}
                className="text-amber-800 font-semibold hover:underline cursor-pointer"
              >
                Créer un compte
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Register */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            {/* Account type toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-neutral-100 border border-neutral-200 text-xs">
              <button
                type="button"
                onClick={() => setIsPro(false)}
                className={`py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  !isPro
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Particulier
              </button>
              <button
                type="button"
                onClick={() => setIsPro(true)}
                className={`py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  isPro
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Professionnel
              </button>
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1">
                {isPro ? 'Nom du contact' : 'Nom et prénom'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder={isPro ? 'Laurent Mercier' : 'Jean Dupont'}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-amber-800 focus:bg-white"
                />
              </div>
            </div>

            {isPro && (
              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1">
                  Raison sociale / Entreprise
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Ex : Boulangerie du Fournil SAS"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-amber-800 focus:bg-white"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="email@exemple.fr"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-amber-800 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1">
                  Téléphone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(e.target.value)}
                    placeholder="06 12 34 56 78"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-amber-800 focus:bg-white font-mono-hooden"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1">
                Mot de passe (6 caractères minimum)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-amber-800 focus:bg-white font-mono-hooden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  aria-label="Afficher ou masquer le mot de passe"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer disabled:opacity-50 mt-1 shadow-xs"
            >
              {isLoading ? 'Création en cours...' : 'Créer mon compte client'}
            </button>

            <div className="pt-2 text-center text-xs text-neutral-500">
              Déjà inscrit chez Hooden ?{' '}
              <button
                type="button"
                onClick={() => setTab('login')}
                className="text-amber-800 font-semibold hover:underline cursor-pointer"
              >
                Se connecter
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
