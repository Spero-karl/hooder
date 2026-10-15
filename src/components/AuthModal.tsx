import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Lock, Mail, Building, X, ArrowRight, ShieldCheck } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthOpen, setIsAuthOpen, loginDemoUser } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isAuthOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginDemoUser(email.includes('pro') || email.includes('sas'));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-neutral-200 rounded-2xl max-w-md w-full p-6 sm:p-8 text-neutral-900 shadow-2xl relative">
        <button
          onClick={() => setIsAuthOpen(false)}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-800 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-mono-hooden text-amber-900 mb-2 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
            ESPACE CLIENT HOODEN
          </div>
          <h3 className="text-xl font-bold font-serif-hooden text-neutral-900">
            {mode === 'login' ? 'Connexion à votre compte' : 'Créer un compte client'}
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Consultez vos commandes de bois, vos factures et vos suivis.
          </p>
        </div>

        {/* Client Profiles */}
        <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 mb-5 space-y-2">
          <div className="text-[11px] font-bold text-neutral-700 font-mono-hooden">
            ACCÈS RAPIDE AUX COMPTES ENREGISTRÉS :
          </div>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => loginDemoUser(false)}
              className="w-full text-left p-2.5 rounded-lg bg-white hover:bg-neutral-100 border border-neutral-200 text-xs flex items-center justify-between cursor-pointer transition-colors"
            >
              <div>
                <div className="font-semibold text-neutral-900">Compte Particulier : Karl Freaton</div>
                <div className="text-[10px] text-neutral-500">Paris 16e • Commande en cours & factures</div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-amber-800" />
            </button>

            <button
              type="button"
              onClick={() => loginDemoUser(true)}
              className="w-full text-left p-2.5 rounded-lg bg-white hover:bg-neutral-100 border border-neutral-200 text-xs flex items-center justify-between cursor-pointer transition-colors"
            >
              <div>
                <div className="font-semibold text-neutral-900">Compte Professionnel : Boulangerie Fournil SAS</div>
                <div className="text-[10px] text-neutral-500">Paris 17e • Factures & livraisons régulières</div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-amber-800" />
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleCustomSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-neutral-700 font-medium block mb-1">E-mail</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@exemple.fr"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-amber-800"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-neutral-700 font-medium block mb-1">Mot de passe</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-amber-800"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-neutral-200 text-center text-xs text-neutral-500">
          {mode === 'login' ? (
            <span>
              Pas encore de compte ?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-amber-800 hover:underline cursor-pointer font-semibold"
              >
                Inscrivez-vous
              </button>
            </span>
          ) : (
            <span>
              Déjà un compte ?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-amber-800 hover:underline cursor-pointer font-semibold"
              >
                Connectez-vous
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
