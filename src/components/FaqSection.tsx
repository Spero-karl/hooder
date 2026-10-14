import React, { useState } from 'react';
import { ChevronDown, Droplets, Warehouse, Clock, FileText, ShieldCheck } from 'lucide-react';

interface FaqItem {
  question: string;
  category: 'moisture' | 'storage' | 'delivery' | 'billing';
  categoryLabel: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    category: 'moisture',
    categoryLabel: 'Humidité & Séchage',
    question: 'Pourquoi le bois séché sous étuve (< 18%) est-il plus performant ?',
    answer: 'Le séchage sous étuve garantit un taux d\'humidité inférieur à 18%. Le bois s\'allume facilement, offre une chaleur immédiate et évite l\'encrassement de vos conduits.',
  },
  {
    category: 'storage',
    categoryLabel: 'Stockage',
    question: 'Comment stocker vos palettes de bois à domicile ?',
    answer: 'Conservez vos palettes dans un lieu ventilé (préau, garage aéré ou contre un mur sous avant-toit). Si vous utilisez une bâche en extérieur, recouvrez uniquement le dessus en laissant les côtés libres pour la circulation de l\'air.',
  },
  {
    category: 'delivery',
    categoryLabel: 'Livraison & Chariot',
    question: 'Comment se passe la dépose avec chariot tout-terrain ?',
    answer: 'La livraison a lieu sur créneau de 2h convenu avec vous. Le chauffeur utilise un chariot motorisé à gros pneus pour franchir graviers, pentes ou pavés et déposer la palette directement dans votre garage ou abri.',
  },
  {
    category: 'delivery',
    categoryLabel: 'Délais',
    question: 'Quels sont les délais de livraison pour Paris et les régions ?',
    answer: 'Départ quotidien depuis le dépôt de Gennevilliers : livraison sous 24h à 48h sur Paris (75) et petite couronne (92, 93, 94), sous 48h en grande couronne (78, 91, 95, 77) et sous 72h en France métropolitaine.',
  },
  {
    category: 'billing',
    categoryLabel: 'Facture & TVA 10%',
    question: 'Comment recevoir ma facture avec TVA réduite à 10% ?',
    answer: 'La facture fiscale conforme est générée dès validation de commande avec la TVA légale à 10% (Art. 278-0 bis du CGI). Téléchargeable immédiatement en PDF et imprimable depuis votre espace client.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredFaqs = activeFilter === 'all'
    ? FAQS
    : FAQS.filter(f => f.category === activeFilter);

  return (
    <section id="faq" className="py-12 bg-white border-t border-neutral-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 font-mono-hooden mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            QUESTIONS FRÉQUENTES & TRANSPARENCE
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif-hooden">
            Tout savoir sur notre bois et la livraison
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto">
            Humidité garantie, conseils de stockage sous abri, déroulement des tournées et facturation conforme.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'all', label: 'Toutes les questions' },
            { id: 'moisture', label: 'Humidité & Séchage' },
            { id: 'storage', label: 'Conseils de Stockage' },
            { id: 'delivery', label: 'Livraison & Chariot' },
            { id: 'billing', label: 'Facture & TVA 10%' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Accordion Items */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50/50 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-4.5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-100/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider font-mono-hooden text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shrink-0 hidden sm:inline">
                      {faq.categoryLabel}
                    </span>
                    <span className="text-sm font-bold text-neutral-900">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-800' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4.5 pb-4.5 pt-1 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 bg-white">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Contact Banner */}
        <div className="mt-8 p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-neutral-700 text-center sm:text-left">
            <strong className="text-neutral-900">Une autre question sur votre accès ou votre commande ?</strong>
            <div className="text-neutral-500 text-[11px]">Notre équipe logistique vous répond en direct depuis le dépôt de Paris.</div>
          </div>
          <a
            href="tel:0189714200"
            className="px-4 py-2 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs transition-colors shrink-0 shadow-xs"
          >
            Appeler le 01 89 71 42 00
          </a>
        </div>
      </div>
    </section>
  );
};
