import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export const FirewoodCarousel: React.FC = () => {
  const { addToCart, setSelectedProductForDetail } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      product: PRODUCTS[0],
      title: "Palette 2 Stères Chêne Rouvre 33 cm",
      badge: "N°1 DES VENTES • 70 € / STÈRE",
      highlight: "70,00 € / stère",
      totalPrice: "140,00 €",
      description: "Chêne fendu séché étuve < 18%. Braise constante et chaleur durable.",
      tag: "Livraison 24h-48h Paris & Île-de-France",
      image: PRODUCTS[0].imageUrl,
    },
    {
      product: PRODUCTS[5],
      title: "Demi-Palette 1 Stère Chêne Compact - 33 cm",
      badge: "IDÉAL COUR ÉTROITE & PETIT STOCKAGE",
      highlight: "78,00 € / stère",
      totalPrice: "78,00 €",
      description: "Format compact 1 stère cerclé main, facile à ranger sous préau ou dans un garage.",
      tag: "Dépose chariot tout-terrain au millimètre",
      image: PRODUCTS[5].imageUrl,
    },
    {
      product: PRODUCTS[7],
      title: "Big-Bag Respirant 1.5 Stère Chêne - 33 cm",
      badge: "LIVRAISON AÉRIENNE PAR GRUE",
      highlight: "69,00 € / stère",
      totalPrice: "103,50 €",
      description: "4 sangles de levage renforcées pour dépose par-dessus muret ou portail fermé.",
      tag: "En stock direct au parc d'expédition",
      image: PRODUCTS[7].imageUrl,
    },
    {
      product: PRODUCTS[8],
      title: "Bois en Vrac 4 Stères - Benne Basculante",
      badge: "60 € / STÈRE (TARIF EXPLOITANT)",
      highlight: "60,00 € / stère",
      totalPrice: "240,00 €",
      description: "Notre lot le plus économique, benné directement sur votre allée ou cour carrossable.",
      tag: "Le meilleur tarif au stère du marché",
      image: PRODUCTS[8].imageUrl,
    },
    {
      product: PRODUCTS[1],
      title: "Pur Charme Blanc 25 cm (Petits Poêles)",
      badge: "DENSITÉ THERMIQUE MAXIMALE",
      highlight: "74,00 € / stère",
      totalPrice: "148,00 €",
      description: "Bois ultra-dense. Bûches courtes pour poêles étanches et inserts étroits.",
      tag: "Remise volume : -15€ dès 2 palettes",
      image: PRODUCTS[1].imageUrl,
    },
    {
      product: PRODUCTS[2],
      title: "Caisse Palette Hêtre 33 cm (Flammes Vives)",
      badge: "MONTÉE EN CHAUFFE RAPIDE",
      highlight: "69,00 € / stère",
      totalPrice: "138,00 €",
      description: "Démarrage facile et flammes claires sans encrasser la vitre de votre poêle.",
      tag: "En stock direct au dépôt de Gennevilliers",
      image: PRODUCTS[2].imageUrl,
    },
  ];

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const current = slides[currentIndex];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div 
        className="relative bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 overflow-hidden shadow-xl"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Subtle Ambient Wood Texture Gradient */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#b45309_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Product Information */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-amber-400 font-mono-hooden text-xs font-bold bg-amber-950/80 border border-amber-800/80 px-2.5 py-1 rounded">
                {current.badge}
              </span>
              <span className="text-emerald-400 text-xs font-mono-hooden flex items-center gap-1.5 font-bold">
                ✓ {current.tag}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-serif-hooden text-white leading-tight">
              {current.title}
            </h2>

            <p className="text-neutral-300 text-sm leading-relaxed max-w-xl">
              {current.description}
            </p>

            <div className="flex flex-wrap items-baseline gap-4 pt-2">
              <div className="text-3xl sm:text-4xl font-black font-mono-hooden text-amber-400">
                {current.highlight}
              </div>
              <div className="text-sm font-mono-hooden text-neutral-400">
                soit <strong className="text-white">{current.totalPrice}</strong> pour le lot livré
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => addToCart(current.product, 1)}
                className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Commander ce lot</span>
              </button>

              <button
                onClick={() => setSelectedProductForDetail(current.product)}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors cursor-pointer border border-neutral-700"
              >
                Fiche détaillée
              </button>
            </div>
          </div>

          {/* Right: Wood Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-xl overflow-hidden border border-neutral-700 bg-neutral-950 h-64 sm:h-72 group shadow-lg">
              <img
                src={current.image}
                alt={current.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-neutral-950/20" />

              <div className="absolute bottom-2.5 left-2.5 bg-neutral-900/90 text-white text-xs px-2.5 py-1 rounded font-mono-hooden border border-neutral-700">
                <span className="text-amber-400 font-bold">{current.product.species}</span> • {current.product.length}
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Navigation */}
        <div className="mt-6 pt-3 border-t border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx
                    ? 'w-6 bg-amber-500'
                    : 'w-1.5 bg-neutral-700 hover:bg-neutral-500'
                }`}
                title={`Lot ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              aria-label="Lot précédent"
              className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-neutral-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono-hooden text-neutral-400">
              {currentIndex + 1} / {slides.length}
            </span>
            <button
              onClick={nextSlide}
              aria-label="Lot suivant"
              className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-neutral-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
