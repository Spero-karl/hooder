import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    cartSubtotalTTC,
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
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white text-neutral-900 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-neutral-950 font-serif-hooden">
                Panier
              </h2>
              <p className="text-xs text-neutral-500 font-mono-hooden mt-0.5">
                {cart.length} {cart.length > 1 ? 'articles' : 'article'}
              </p>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-neutral-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Fermer le panier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-neutral-800">
                  Votre panier est vide
                </div>
                <button
                  onClick={() => addToCart(PRODUCTS[0], 1)}
                  className="px-4 py-2.5 rounded-lg bg-amber-900 hover:bg-amber-950 text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  Ajouter 2 stères Chêne (33 cm)
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3.5 rounded-xl border border-neutral-200 flex gap-3.5 items-center justify-between"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-lg object-cover shrink-0 border border-neutral-100"
                  />

                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-xs font-semibold text-neutral-900 truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-[11px] text-neutral-500 font-mono-hooden mt-0.5">
                      {item.product.length} · {item.product.packaging}
                    </p>

                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-50">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-neutral-600 hover:text-neutral-950 cursor-pointer"
                          aria-label="Diminuer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center text-xs font-mono-hooden font-bold text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-neutral-600 hover:text-neutral-950 cursor-pointer"
                          aria-label="Augmenter"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-bold font-mono-hooden text-neutral-950">
                          {(item.product.priceTTC * item.quantity).toFixed(2)} €
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-neutral-400 hover:text-neutral-800 p-1.5 transition-colors cursor-pointer self-start"
                    aria-label="Supprimer l'article"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-neutral-200 space-y-4 bg-neutral-50">
              <div className="space-y-1.5 text-xs font-mono-hooden text-neutral-600">
                <div className="flex justify-between">
                  <span>Livraison :</span>
                  <span className="font-medium text-emerald-700">Incluse</span>
                </div>
                <div className="flex justify-between pt-1 text-sm font-bold text-neutral-950">
                  <span>Total :</span>
                  <span className="text-amber-900 text-lg font-black font-mono-hooden">
                    {cartSubtotalTTC.toFixed(2)} €
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Commander</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
