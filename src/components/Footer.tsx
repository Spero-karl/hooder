import React from 'react';
import { HOODEN_COMPANY } from '../data/mockData';
import { MapPin, Truck, Phone, Mail } from 'lucide-react';

export const Footer: React.FC<{
  onNavigate: (section: string) => void;
  onOpenOrderLookup?: () => void;
}> = ({ onOpenOrderLookup }) => {
  return (
    <footer className="bg-white text-neutral-600 border-t border-neutral-200 text-xs mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Company Heritage */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex flex-col">
              <span className="text-xl font-bold font-serif-hooden text-neutral-900">
                HOODEN
              </span>
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-sans font-medium">
                Maison Forestière · Fondée en 1998
              </span>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Exploitation, séchage sous étuve (&lt; 18% H₂O) et distribution de bois de chauffage haute performance.
            </p>
            <div className="text-[11px] text-neutral-400 font-mono-hooden space-y-0.5">
              <div>SIRET : {HOODEN_COMPANY.siret} · Code NAF 0220Z</div>
              <div>R.C.S. Paris B {HOODEN_COMPANY.siren}</div>
            </div>
          </div>

          {/* Column 2: Quick Access Navigation */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-neutral-900 uppercase font-mono-hooden tracking-wider">
              Accès Direct
            </div>
            <ul className="space-y-2 text-xs text-neutral-600 font-sans">
              <li>
                <a href="#catalog" className="hover:text-amber-800 transition-colors">
                  Catalogue des lots & palettes
                </a>
              </li>
              <li>
                <a href="#calculateur-steres" className="hover:text-amber-800 transition-colors">
                  Calculateur interactif de stères
                </a>
              </li>
              <li>
                <a href="#livraison-depots" className="hover:text-amber-800 transition-colors">
                  Livraison & Chariot tout-terrain
                </a>
              </li>
              <li>
                <a href="#avis" className="hover:text-amber-800 transition-colors">
                  Avis clients (4.9/5)
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-amber-800 transition-colors">
                  Questions fréquentes (FAQ)
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Logistics & Depots */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-neutral-900 uppercase font-mono-hooden tracking-wider">
              Plateforme & Dépose
            </div>
            <div className="space-y-2 text-xs text-neutral-600">
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <span>Plateforme logistique principale : Port de Gennevilliers (92230)</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <span>Dépose dans votre allée, cour ou garage</span>
              </div>
              {onOpenOrderLookup && (
                <div className="pt-2">
                  <button
                    onClick={onOpenOrderLookup}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium text-[11px] transition-colors cursor-pointer"
                  >
                    <Truck className="w-3.5 h-3.5 text-amber-800" />
                    <span>Suivre ma commande & Facture</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Column 4: Hotline & Customer Care */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-neutral-900 uppercase font-mono-hooden tracking-wider">
              Service Commandes
            </div>
            <div className="space-y-2 text-xs text-neutral-600 font-mono-hooden">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-800" />
                <span className="font-bold text-neutral-900">{HOODEN_COMPANY.phone}</span>
              </div>
              <div className="text-[10px] text-neutral-400">
                Du lundi au samedi : 08h00 – 19h00
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-800" />
                <span>{HOODEN_COMPANY.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-neutral-400 text-[11px]">
          <div>© {new Date().getFullYear()} Hooden Énergie Forestière SAS. Tous droits réservés.</div>
          <div className="flex items-center gap-4">
            <span>Bois sec &lt; 18%</span>
            <span aria-hidden="true">·</span>
            <span>Tarifs directs</span>
            <span aria-hidden="true">·</span>
            <span>Livraison directe à domicile</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
