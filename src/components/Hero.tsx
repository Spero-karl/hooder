import React, { useState } from 'react';
import { MapPin, Truck, ShieldCheck, Flame, Scale, Clock, Check } from 'lucide-react';
import { POSTAL_CODE_ZONES } from '../data/products';

export const Hero: React.FC<{
  onSelectLength: (len: string) => void;
  selectedLength: string;
}> = ({ onSelectLength, selectedLength }) => {
  const [zipInput, setZipInput] = useState('75008');
  const [currentZone, setCurrentZone] = useState<any>(POSTAL_CODE_ZONES[0]);

  const handleZipCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const prefix = zipInput.trim().substring(0, 2);
    const found =
      POSTAL_CODE_ZONES.find((z) => z.prefix === prefix) ||
      POSTAL_CODE_ZONES[POSTAL_CODE_ZONES.length - 1];
    setCurrentZone(found);
  };

  return (
    <section className="bg-white border-b border-neutral-200 pt-8 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Brand Statement & Length Filter Strip */}
          <div className="lg:col-span-7 space-y-4">
            {/* Heritage Kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-600">
              <span className="text-amber-800 font-bold">Maison Forestière Hooden</span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span>Dépôt & Séchage depuis 1998</span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span className="text-neutral-800 font-mono-hooden font-bold">70 € / stère en moyenne</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-neutral-900 font-serif-hooden leading-[1.15] tracking-tight">
              Bois de chauffage haute performance séché en étuve, livré à votre abri.
            </h1>

            {/* Explanatory Prose */}
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl">
              100% feuillus durs français (chêne rouvre, pur charme, hêtre et frêne). Taux d'humidité rigoureusement garanti sous 18% pour un allumage instantané et un rendement calorifique maximal, sans encrassement de vos conduits.
            </p>

            {/* Interactive Length Selector */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                  Choisir la longueur de bûches :
                </span>
                <a
                  href="#calculateur-steres"
                  className="text-xs font-semibold text-amber-800 hover:text-amber-900 hover:underline flex items-center gap-1"
                >
                  Estimer mon volume en stères →
                </a>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'Toutes les longueurs' },
                  { id: '25 cm', label: '25 cm (Poêles compacts)' },
                  { id: '30 cm', label: '30 cm (Foyers moyens)' },
                  { id: '33 cm', label: '33 cm (Standard N°1)' },
                  { id: '50 cm', label: '50 cm (Grands foyers)' },
                ].map((btn) => {
                  const isActive = selectedLength === btn.id;
                  return (
                    <button
                      key={btn.id}
                      onClick={() => onSelectLength(btn.id)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        isActive
                          ? 'bg-neutral-900 text-white shadow-xs'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {btn.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#catalog"
                className="px-5 py-2.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs inline-flex items-center gap-2"
              >
                <span>Consulter les palettes en stock</span>
                <span>↓</span>
              </a>
              <a
                href="#livraison-depots"
                className="px-4 py-2.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                Conditions de dépose & Chariot
              </a>
            </div>
          </div>

          {/* Right Column: Direct Logistics & Postal Code Checker */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono-hooden">
                  DISPONIBILITÉ LOGISTIQUE
                </span>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  Dépôt opérationnel
                </span>
              </div>

              <h2 className="text-base font-bold text-neutral-900 font-serif-hooden">
                Vérifiez la livraison à votre domicile
              </h2>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Renseignez votre code postal pour connaître le créneau de passage et les engins de dépose disponibles pour votre adresse.
              </p>

              <form onSubmit={handleZipCheck} className="mt-4 flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={zipInput}
                    onChange={(e) => setZipInput(e.target.value)}
                    maxLength={5}
                    placeholder="Ex: 75008, 78000, 92100..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white border border-neutral-300 text-xs font-mono-hooden font-bold text-neutral-900 focus:outline-none focus:border-amber-800"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Tester
                </button>
              </form>

              {currentZone && (
                <div className="mt-4 pt-4 border-t border-neutral-200 text-xs space-y-2 font-mono-hooden">
                  <div className="flex justify-between items-center text-neutral-600">
                    <span>Secteur desservi :</span>
                    <strong className="text-neutral-900 font-sans font-semibold">{currentZone.dept}</strong>
                  </div>
                  <div className="flex justify-between items-center text-neutral-600">
                    <span>Délai de passage estimé :</span>
                    <strong className="text-emerald-700 font-sans font-semibold">{currentZone.delayHours}</strong>
                  </div>
                  <div className="flex justify-between items-center text-neutral-600">
                    <span>Matériel de dépose :</span>
                    <strong className="text-neutral-900 font-sans font-medium">Chariot embarqué tout-terrain</strong>
                  </div>
                  <div className="flex justify-between items-center text-neutral-600">
                    <span>Frais de dépose :</span>
                    <strong className="text-neutral-900 font-sans font-semibold">
                      {currentZone.baseDeliveryTTC === 0 ? 'Inclus dès 2 stères' : `${currentZone.baseDeliveryTTC} € TTC`}
                    </strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4-Column Proof & Trust Strip */}
        <div className="mt-10 pt-8 border-t border-neutral-200 grid grid-cols-2 md:grid-cols-4 gap-6 text-neutral-800">
          <div className="space-y-1">
            <div className="text-xl font-black font-mono-hooden text-neutral-900">
              1998
            </div>
            <div className="text-xs font-bold text-neutral-900">Expérience & Savoir-faire</div>
            <div className="text-[11px] text-neutral-500 leading-normal">
              Producteur et distributeur de bois de chauffage depuis plus de 25 ans.
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xl font-black font-mono-hooden text-neutral-900">
              &lt; 18% H₂O
            </div>
            <div className="text-xs font-bold text-neutral-900">Bois sec garanti</div>
            <div className="text-[11px] text-neutral-500 leading-normal">
              Humidité contrôlée. Prêt à brûler immédiatement pour un rendement optimal.
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xl font-black font-mono-hooden text-neutral-900">
              Dès 60 €
            </div>
            <div className="text-xs font-bold text-neutral-900">Prix direct producteur</div>
            <div className="text-[11px] text-neutral-500 leading-normal">
              Tarifs nets directs du dépôt sans intermédiaire.
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xl font-black font-mono-hooden text-neutral-900">
              Dépose Précise
            </div>
            <div className="text-xs font-bold text-neutral-900">Chariot tout-terrain</div>
            <div className="text-[11px] text-neutral-500 leading-normal">
              Dépose directe dans votre cour, garage ou sous abri.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
