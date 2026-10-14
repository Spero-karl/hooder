import React, { useState } from 'react';
import { Truck, CheckCircle2, Star, MapPin } from 'lucide-react';

export const TrustAndLogistics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'logistique' | 'avis'>('logistique');

  const reviews = [
    {
      id: 1,
      author: 'Marc D.',
      location: 'Versailles (78)',
      date: 'Octobre 2026',
      rating: 5,
      productOrdered: 'Palette 2 stères Chêne 33 cm',
      comment:
        'Commande reçue dans le créneau prévu. Le bois est bien sec et démarre très vite. Le chauffeur a déposé la palette directement sous mon abri avec son chariot tout-terrain, un vrai gain de temps.',
    },
    {
      id: 2,
      author: 'Hélène B.',
      location: 'Fontainebleau (77)',
      date: 'Septembre 2026',
      rating: 5,
      productOrdered: 'Palette 2 stères Charme 25 cm',
      comment:
        'Parfait pour mon poêle. Le bois brûle longtemps avec une belle braise. Facture reçue immédiatement avec la TVA à 10%. Très sérieux.',
    },
    {
      id: 3,
      author: 'Antoine V.',
      location: 'Chantilly (60)',
      date: 'Octobre 2026',
      rating: 5,
      productOrdered: 'Bois en Vrac 4 stères 33 cm',
      comment:
        'Excellente qualité de bûches bien fendues et prêtes à brûler. Tarif très bien positionné à 60€ le stère en vrac. Je recommande sans hésiter.',
    },
  ];

  return (
    <section className="bg-white border-b border-neutral-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-200 mb-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 font-mono-hooden">
              Maison Forestière Hooden
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif-hooden tracking-tight mt-1">
              Livraison Soignée & Avis Clients
            </h2>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-100 border border-neutral-200">
            <button
              onClick={() => setActiveTab('logistique')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'logistique'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Livraison & Chariot
            </button>
            <button
              onClick={() => setActiveTab('avis')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'avis'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Avis Clients (4.9/5)
            </button>
          </div>
        </div>

        {/* Tab 1: Delivery & Forklift */}
        {activeTab === 'logistique' && (
          <div id="livraison-depots" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold font-serif-hooden text-neutral-900">
                  Dépose précise à l’endroit souhaité avec notre chariot tout-terrain.
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Nos camions sont équipés d'un chariot élévateur tout-terrain embarqué. Nous ne laissons pas votre palette sur le trottoir : le chauffeur la dépose directement dans votre allée, cour, garage ou sous votre abri de jardin.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-xs text-neutral-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Tous types de sols</span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      Gravillons, dalles, pavés ou pelouse sans abîmer votre terrain.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-xs text-neutral-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Directement sous votre abri</span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      Dépose au plus près de votre foyer pour vous éviter toute manutention.
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Photo */}
              <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-900 relative shadow-md">
                <img
                  src="/src/assets/images/firewood_truck_tipper_1791979209811.jpg"
                  alt="Camion de livraison de bois de chauffage"
                  referrerPolicy="no-referrer"
                  className="w-full h-64 object-cover"
                />
                <div className="p-4 bg-neutral-950 text-white">
                  <div className="text-xs font-bold font-serif-hooden">Livraison directe à domicile</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    Chauffeur dédié · Appel téléphonique avant passage · Dépose soignée
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Verified Customer Testimonials */}
        {activeTab === 'avis' && (
          <div id="avis" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-3">
                <div className="text-3xl font-black font-mono-hooden text-amber-950">
                  4.9 <span className="text-base font-normal text-amber-800">/ 5</span>
                </div>
                <div>
                  <div className="flex text-amber-600 text-sm">
                    {'★★★★★'}
                  </div>
                  <div className="text-xs font-mono-hooden text-amber-900 mt-0.5">
                    Avis clients vérifiés après livraison
                  </div>
                </div>
              </div>

              <div className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>99% de clients satisfaits</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono-hooden">
                      <span className="font-bold text-neutral-900 font-sans">{r.author}</span>
                      <span className="text-neutral-400">{r.location}</span>
                    </div>

                    <div className="text-amber-600 text-xs tracking-wider">
                      {'★'.repeat(r.rating)}
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed">
                      "{r.comment}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-200 text-[11px] font-mono-hooden text-neutral-500 flex items-center justify-between">
                    <span className="text-amber-900 font-medium">{r.productOrdered}</span>
                    <span>{r.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
