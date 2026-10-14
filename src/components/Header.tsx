import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, User, Truck, Search, ShieldCheck } from 'lucide-react';

export const Header: React.FC<{
  onOpenOrderLookup: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}> = ({ onOpenOrderLookup, searchQuery, setSearchQuery }) => {
  const {
    cartTotalCount,
    cartSubtotalTTC,
    setIsCartOpen,
    user,
    setIsAuthOpen,
    setIsDashboardOpen,
  } = useApp();

  return (
    <>
      {/* Editorial Announcement Bar - Clean, unboxed text with typographic separators */}
      <aside aria-label="Annonce officielle" className="bg-neutral-900 text-neutral-300 text-xs py-2 px-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs">
            <span className="font-semibold text-white">Maison Forestière Hooden</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="text-neutral-400 hidden md:inline">Exploitation durable depuis 1998</span>
            <span aria-hidden="true" className="text-neutral-600 hidden md:inline">·</span>
            <span className="text-amber-400 font-mono-hooden">Bois séché &lt; 18%</span>
            <span aria-hidden="true" className="text-neutral-600 hidden lg:inline">·</span>
            <span className="text-neutral-400 hidden lg:inline">Tarif direct dépôt ~ 70 € / stère</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] sm:text-xs text-neutral-300 shrink-0">
            <button
              onClick={onOpenOrderLookup}
              className="hover:text-amber-400 flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
            >
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span>Suivre ma commande & Facture</span>
            </button>
            <span aria-hidden="true" className="text-neutral-700">·</span>
            <a
              href="tel:0189714200"
              className="hover:text-white flex items-center gap-1 font-mono-hooden text-neutral-300"
              title="Service commandes & logistique"
            >
              <span>01 89 71 42 00</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Main Navbar - Strict 3-zone contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 text-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-8">
            {/* Zone 1: Single text element wordmark with heritage grounding */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group flex flex-col whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span className="text-2xl font-bold tracking-tight text-neutral-900 font-serif-hooden group-hover:text-amber-800 transition-colors">
                HOODEN
              </span>
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-sans font-medium -mt-1">
                Bois & Forêt · Depuis 1998
              </span>
            </a>

            {/* Zone 2: 4-5 clean single-line text navigation links */}
            <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold tracking-wide uppercase text-neutral-700">
              <a
                href="#catalog"
                className="hover:text-amber-800 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8"
              >
                Catalogue des Lots
              </a>
              <a
                href="#calculateur-steres"
                className="hover:text-amber-800 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 text-amber-900 font-bold"
              >
                Calculateur de Stères
              </a>
              <a
                href="#livraison-depots"
                className="hover:text-amber-800 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8"
              >
                Livraison & Dépose
              </a>
              <a
                href="#engagements"
                className="hover:text-amber-800 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8"
              >
                Certifications NF / PEFC
              </a>
              <a
                href="#faq"
                className="hover:text-amber-800 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8"
              >
                FAQ Conseils
              </a>
            </nav>

            {/* Zone 3: Quick Search + User Account + Primary Cart Action */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Inline Search Bar */}
              <div className="relative hidden sm:block w-44 md:w-56">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Chêne, 33cm, vrac..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-6 py-2 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-amber-800 focus:bg-white transition-all font-sans"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs cursor-pointer"
                    aria-label="Effacer la recherche"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Account Profile Trigger */}
              {user ? (
                <button
                  onClick={() => setIsDashboardOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <User className="w-3.5 h-3.5 text-amber-800" />
                  <span className="hidden xl:inline">{user.fullName.split(' ')[0]}</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <User className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="hidden sm:inline">Compte</span>
                </button>
              )}

              {/* Cart Drawer Trigger - Primary Action */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Panier</span>
                {cartTotalCount > 0 ? (
                  <span className="bg-amber-950 text-amber-200 font-mono-hooden text-xs px-2 py-0.5 rounded font-bold">
                    {cartTotalCount}
                  </span>
                ) : null}
                {cartSubtotalTTC > 0 && (
                  <span className="font-mono-hooden text-xs text-amber-100 ml-0.5 hidden sm:inline">
                    · {cartSubtotalTTC.toFixed(0)} €
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
