import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Minus, ShoppingBag, X, ShieldCheck, Check } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProductForDetail, setSelectedProductForDetail, addToCart } = useApp();
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (selectedProductForDetail) {
      setActiveImage(selectedProductForDetail.imageUrl);
      setQty(1);
    }
  }, [selectedProductForDetail]);

  if (!selectedProductForDetail) return null;
  const product = selectedProductForDetail;

  const handleAdd = () => {
    addToCart(product, qty);
    setSelectedProductForDetail(null);
  };

  const totalPrice = product.priceTTC * qty;
  const gallery = product.galleryImages && product.galleryImages.length > 0 
    ? product.galleryImages 
    : [product.imageUrl];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-neutral-200 rounded-2xl max-w-3xl w-full p-6 text-neutral-900 shadow-2xl relative my-6">
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductForDetail(null)}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-800 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label="Fermer la fiche produit"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left: Product Imagery Gallery */}
          <div className="md:col-span-5 space-y-3">
            <div className="rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 h-72 relative group">
              <img
                src={activeImage || product.imageUrl}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
              />

              {/* Moisture badge overlay */}
              <div className="absolute bottom-2.5 left-2.5 bg-neutral-950/85 text-white text-[11px] font-mono-hooden px-2.5 py-1 rounded backdrop-blur-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Humidité : <strong className="text-amber-300">{product.humidityRate}</strong></span>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {gallery.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`relative rounded-lg overflow-hidden border h-16 cursor-pointer transition-all ${
                      activeImage === img
                        ? 'border-amber-700 ring-2 ring-amber-700/20 shadow-xs'
                        : 'border-neutral-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} vue ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-1 text-neutral-600">
              <div className="font-semibold text-neutral-900">
                Bois sec fendu prêt à l'emploi
              </div>
              <div className="text-[11px] text-neutral-500">
                Feuillus durs à fort pouvoir calorifique, humidité contrôlée inférieure à 18%.
              </div>
            </div>
          </div>

          {/* Right: Technical Spec Sheet & Purchase Module */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-hooden text-neutral-500 uppercase">
                <span className="text-amber-800 font-bold">{product.species}</span>
                <span aria-hidden="true">·</span>
                <span>Bûches {product.length}</span>
                <span aria-hidden="true">·</span>
                <span>{product.packaging}</span>
              </div>

              <h3 className="text-xl font-bold font-serif-hooden text-neutral-900 mt-1 leading-snug">
                {product.name}
              </h3>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              {product.description}
            </p>

            {/* Technical Characteristics Grid */}
            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-mono-hooden">
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase">Pouvoir Calorifique (PCI)</span>
                <strong className="text-neutral-900 font-bold">&gt; 4,2 kWh / kg</strong>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase">Taux d'humidité</span>
                <strong className="text-amber-800 font-bold">&lt; 18% garanti</strong>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase">Volume en stères</span>
                <strong className="text-neutral-900 font-bold">{product.volumeSteres} stères ({product.apparentM3} m³)</strong>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase">Poids net livré</span>
                <strong className="text-neutral-900 font-bold">{product.weightKg} kg</strong>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-baseline justify-between">
              <div>
                {product.pricePerStere && (
                  <div className="text-xs font-mono-hooden font-bold text-amber-800">
                    {product.pricePerStere.toFixed(2)} € / stère
                  </div>
                )}
                <div className="text-2xl font-black font-mono-hooden text-neutral-900">
                  {totalPrice.toFixed(2)} €
                </div>
                <div className="text-[11px] text-neutral-500 font-mono-hooden">
                  TTC ({product.unit}) · TVA légale 10% incluse
                </div>
              </div>

              <div className="text-right text-[11px] text-emerald-800 font-mono-hooden">
                <span className="font-bold flex items-center justify-end gap-1">
                  <Check className="w-3.5 h-3.5" /> En stock direct
                </span>
                <div className="text-neutral-500 text-[10px]">Livraison 24h à 48h</div>
              </div>
            </div>

            {/* Quantity Stepper & Add to Cart */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center rounded-xl border border-neutral-200 bg-neutral-50 p-1">
                <button
                  onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                  className="p-1.5 text-neutral-600 hover:text-neutral-900 cursor-pointer"
                  aria-label="Diminuer la quantité"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-mono-hooden text-xs font-bold text-neutral-900">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((prev) => prev + 1)}
                  className="p-1.5 text-neutral-600 hover:text-neutral-900 cursor-pointer"
                  aria-label="Augmenter la quantité"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Ajouter au panier ({totalPrice.toFixed(2)} €)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
