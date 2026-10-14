import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    cartSubtotalTTC,
    cartTotalSteres,
    setIsCheckoutOpen,
    addToCart,
  } = useApp();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 sm:pl-10">
        <div className="w-screen max-w-md bg-white border-l border-neutral-200 text-neutral-900 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-950 text-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Flame className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base font-serif-hooden tracking-wide">
                  Votre Sélection de Bois
                </h3>
                <p className="text-[11px] text-amber-200/80 font-mono-hooden">
                  {cart.length} référence{cart.length > 1 ? 's' : ''} • Bois sec & étuvé &lt; 18%
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Fermer le panier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400 border border-neutral-200">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="text-neutral-900 font-serif-hooden font-bold text-base">
                  Votre sélection est vide
                </div>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
                  Ajoutez vos palettes de chêne, charme ou hêtre prêtes à l'emploi.
                </p>
                <button
                  onClick={() => addToCart(PRODUCTS[0], 1)}
                  className="px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs"
                >
                  Ajouter le Pur Chêne 33 cm (2 stères)
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3.5 rounded-xl bg-neutral-50/80 border border-neutral-200/90 flex gap-3.5 items-start hover:border-neutral-300 transition-colors"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-lg object-cover shrink-0 border border-neutral-200"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-neutral-900 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-neutral-500 font-mono-hooden mt-0.5">
                      {item.product.packaging} • {item.product.length}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center rounded-lg border border-neutral-200 bg-white shadow-2xs">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 cursor-pointer"
                          aria-label="Diminuer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-mono-hooden font-bold text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 cursor-pointer"
                          aria-label="Augmenter"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-bold font-mono-hooden text-neutral-900">
                          {(item.product.priceTTC * item.quantity).toFixed(2)} €
                        </div>
                        <div className="text-[10px] text-neutral-500 font-mono-hooden">
                          TVA 10% incluse
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-neutral-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                    aria-label="Retirer l'article"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-neutral-200 space-y-3 bg-white">
              <div className="space-y-1.5 text-xs font-mono-hooden text-neutral-600">
                <div className="flex justify-between">
                  <span>Volume total :</span>
                  <span className="font-bold text-neutral-900">{cartTotalSteres.toFixed(1)} stères</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison à domicile :</span>
                  <span className="font-bold text-emerald-700">Incluse & Soignée (0 €)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-wider font-bold text-neutral-500 font-mono-hooden">
                  Total Net TTC :
                </span>
                <span className="font-mono-hooden text-amber-900 text-xl font-bold">
                  {cartSubtotalTTC.toFixed(2)} €
                </span>
              </div>

              <div className="text-[11px] text-neutral-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                <span>Facture fiscale avec ventilation TVA transmise à validation</span>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Finaliser ma commande</span>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
