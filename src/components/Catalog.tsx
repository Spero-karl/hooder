import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Minus, ShoppingBag, Eye, Tag, CheckCircle2 } from 'lucide-react';

export const Catalog: React.FC<{
  selectedLength: string;
  setSelectedLength: (len: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}> = ({ selectedLength, setSelectedLength, searchQuery, setSearchQuery }) => {
  const { products, addToCart, setSelectedProductForDetail } = useApp();
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const getQty = (id: string) => quantities[id] || 1;
  const setQty = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  const filteredProducts = products.filter((p) => {
    if (selectedLength !== 'all' && p.length !== selectedLength) {
      return false;
    }
    if (selectedSpecies !== 'all' && p.species !== selectedSpecies) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.species.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.length.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <section id="catalog" className="py-12 bg-neutral-50 min-h-[600px] border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 font-mono-hooden">
              <span>Palettes & Vrac Séchés Sous Étuve</span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span className="text-amber-800 font-bold">100% Prêt à brûler</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif-hooden tracking-tight mt-1">
              Catalogue Officiel des Lots en Stock
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl">
              Chêne, charme, hêtre et frêne séchés prêts à l'emploi. Prix transparents avec TVA 10% incluse et dépose soignée avec chariot tout-terrain.
            </p>
          </div>

          <div className="text-xs text-neutral-600 font-mono-hooden flex items-center gap-2 bg-white border border-neutral-200 px-3.5 py-2 rounded-xl shadow-2xs self-start md:self-auto">
            <span className="font-semibold text-neutral-900">{filteredProducts.length}</span>
            <span>références disponibles au dépôt</span>
          </div>
        </div>

        {/* Species Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-neutral-200">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'Toutes les essences' },
              { id: 'Chêne', label: 'Pur Chêne' },
              { id: 'Charme', label: 'Pur Charme' },
              { id: 'Hêtre', label: 'Pur Hêtre' },
              { id: 'Frêne', label: 'Pur Frêne' },
              { id: 'Mélange feuillus durs', label: 'Duo Chêne & Charme' },
            ].map((tab) => {
              const isActive = selectedSpecies === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedSpecies(tab.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {(selectedLength !== 'all' || selectedSpecies !== 'all' || searchQuery !== '') && (
            <button
              onClick={() => {
                setSelectedLength('all');
                setSelectedSpecies('all');
                setSearchQuery('');
              }}
              className="text-xs text-amber-800 hover:text-amber-900 font-semibold cursor-pointer underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white border border-neutral-200 rounded-2xl p-8 space-y-3">
            <div className="text-neutral-900 font-bold text-base font-serif-hooden">
              Aucun lot ne correspond à ces critères
            </div>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Modifiez votre recherche ou réinitialisez les filtres pour afficher l'ensemble de nos palettes de bois sec.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedLength('all');
                setSelectedSpecies('all');
              }}
              className="mt-2 px-5 py-2.5 rounded-lg bg-amber-800 text-white text-xs font-bold cursor-pointer hover:bg-amber-900 transition-colors"
            >
              Voir tout le stock
            </button>
          </div>
        ) : (
          /* Products Grid - Anti-slop, clean typography, strict alignment */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredProducts.map((product) => {
              const currentQty = getQty(product.id);
              const totalLotTTC = product.priceTTC * currentQty;

              return (
                <article
                  key={product.id}
                  className="bg-white border border-neutral-200 hover:border-neutral-300 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 shadow-2xs hover:shadow-md group"
                >
                  {/* Firewood Image */}
                  <div
                    onClick={() => setSelectedProductForDetail(product)}
                    className="relative h-56 overflow-hidden bg-neutral-100 cursor-pointer"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Clean unboxed tags over image scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-neutral-950/20" />

                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                      <span className="text-[11px] font-mono-hooden font-bold text-white bg-neutral-950/80 px-2.5 py-1 rounded backdrop-blur-xs">
                        {product.badge || 'LOT SÉLECTIONNÉ'}
                      </span>
                      <span className="text-[11px] font-mono-hooden text-emerald-300 bg-neutral-950/80 px-2 py-1 rounded backdrop-blur-xs">
                        Stock : {product.stockCount} dispos
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white font-mono-hooden">
                      <span>Humidité : <strong className="text-amber-300">{product.humidityRate}</strong></span>
                      <span className="text-neutral-300 text-[11px] flex items-center gap-1 group-hover:text-white transition-colors">
                        <Eye className="w-3.5 h-3.5" /> Fiche détaillée
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Zero-Pill Metadata Discipline: unboxed text with middle dots */}
                      <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono-hooden mb-2">
                        <span className="font-semibold text-neutral-800">{product.species}</span>
                        <span aria-hidden="true">·</span>
                        <span>{product.length}</span>
                        <span aria-hidden="true">·</span>
                        <span>{product.packaging}</span>
                      </div>

                      {/* Product Title */}
                      <h3
                        onClick={() => setSelectedProductForDetail(product)}
                        className="text-base font-bold text-neutral-900 hover:text-amber-800 transition-colors font-serif-hooden cursor-pointer leading-snug"
                      >
                        {product.name}
                      </h3>

                      <p className="text-xs text-neutral-600 mt-2 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Technical Specs Metric Row */}
                      <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-xs font-mono-hooden text-neutral-700">
                        <div>
                          <span className="text-neutral-400 block text-[10px] uppercase">Cubage & Stères</span>
                          <strong className="text-neutral-900 font-bold">
                            {product.volumeSteres} stères ({product.apparentM3} m³)
                          </strong>
                        </div>
                        <div>
                          <span className="text-neutral-400 block text-[10px] uppercase">Poids net livré</span>
                          <strong className="text-neutral-900 font-bold">{product.weightKg} kg</strong>
                        </div>
                      </div>

                      {/* Bulk Discount Note if any */}
                      {product.bulkDiscountInfo && (
                        <div className="mt-2.5 text-[11px] font-mono-hooden text-emerald-800 bg-emerald-50/80 border border-emerald-200/80 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium">
                          <Tag className="w-3 h-3 text-emerald-700 shrink-0" />
                          <span>Remise quantité : {product.bulkDiscountInfo}</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action & Pricing Bar */}
                    <div className="mt-5 pt-4 border-t border-neutral-200 flex items-end justify-between gap-3">
                      <div>
                        {product.pricePerStere && (
                          <div className="text-xs font-mono-hooden font-bold text-amber-800">
                            {product.pricePerStere.toFixed(2)} € / stère
                          </div>
                        )}
                        <div className="text-2xl font-black font-mono-hooden text-neutral-900">
                          {totalLotTTC.toFixed(2)} €
                        </div>
                        <div className="text-[10px] text-neutral-500 font-mono-hooden">
                          TTC · TVA 10% incluse
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Quantity Stepper */}
                        <div className="flex items-center rounded-lg border border-neutral-200 bg-white p-0.5">
                          <button
                            onClick={() => setQty(product.id, -1)}
                            className="p-1.5 text-neutral-500 hover:text-neutral-900 cursor-pointer"
                            title="Diminuer la quantité"
                            aria-label="Diminuer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center text-xs font-mono-hooden font-bold text-neutral-900">
                            {currentQty}
                          </span>
                          <button
                            onClick={() => setQty(product.id, 1)}
                            className="p-1.5 text-neutral-500 hover:text-neutral-900 cursor-pointer"
                            title="Augmenter la quantité"
                            aria-label="Augmenter"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Add to Cart CTA */}
                        <button
                          onClick={() => addToCart(product, currentQty)}
                          className="px-4 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap shrink-0"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Commander</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
